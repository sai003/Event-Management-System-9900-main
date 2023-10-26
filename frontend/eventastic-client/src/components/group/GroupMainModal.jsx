import { useEffect, useState } from 'react';
import GroupAPI from '../../utils/GroupAPIHelper';
import AccountAPI from '../../utils/AccountAPIHelper';
import GroupInfoPage from './pages-main/GroupInfoPage'
import GroupChatPage from './pages-main/GroupChatPage';
import GroupMembersPage from './pages-main/GroupMembersPage';
import GroupRequestsPage from './pages-main/GroupRequestsPage';
import { StyledTitle, LargeModal, ModalBodyLarge } from '../styles/modal/modal.styled';
import { Badge, Divider, IconButton, Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SubjectIcon from '@mui/icons-material/Subject';
import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const groupApi = new GroupAPI()
const accountApi = new AccountAPI()

const GroupMainModal = ({
  open,
  setOpen,
  eventDetails,
  groupDetails,
  setGroupDetails,
  setHasLeftGroup,
  account
}) => {
  const [page, setPage] = useState('groupInfo')
  const [value, setValue] = useState(0);
  const [newRequests, setNewRequests] = useState(0);
  const [groupMemberDetails, setGroupMemberDetails] = useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    if (page === 'groupRequests') {
      setNewRequests(0)
    }
    else if (Object.keys(groupDetails).length !== 0) {
      // Each page change update all member details
      (async () => {
        try {
          const groupRes = await groupApi.getGroup(groupDetails.group_id)
          setGroupDetails(groupRes.data)
          setNewRequests(groupRes.data.group_members.filter((member) => member.join_status === 'Pending').length)

          const groupMemRes = await Promise.all(groupRes.data.group_members.map((member, idx) => {
            return accountApi.getAccount(member.account_id).then((res) => res.data)
          }))

          let groupMemberDetailsTemp = {}
          groupMemRes.map((member) => {
            groupMemberDetailsTemp[member.account_id] = member
          })
          setGroupMemberDetails(groupMemberDetailsTemp)
        }
        catch(err) {
          console.error(err)
        } 
      })()
    }
  }, [open, page])

  return (
    <LargeModal open={open} onClose={handleClose} aria-labelledby="Review modal" maxWidth='lg'>
      <StyledTitle justify='space-between'>
        <Tabs value={value} onChange={handleChange} aria-label="Group tabs">
          <Tab icon={<SubjectIcon />} label="Group Info" onClick={() => setPage('groupInfo')} />
          <Tab icon={<ChatIcon />} label="Group Chat" onClick={() => setPage('groupChat')} />
          <Tab icon={<GroupsIcon />} label="Group Members" onClick={() => setPage('groupMembers')} />
          <Tab icon={<Badge badgeContent={newRequests} color='error'><GroupAddIcon /></Badge>}
            label="Join Requests" onClick={() => setPage('groupRequests')}
          />
        </Tabs>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </StyledTitle>
      <Divider variant="middle" sx={{ mb: 2 }} />
      <ModalBodyLarge>
        {(() => {
          if (page === 'groupInfo') {
            return (
              <GroupInfoPage
                groupDetails={groupDetails}
                setGroupDetails={setGroupDetails}
                eventDetails={eventDetails}
                accountID={account.account_id}
              />
            )
          }
          else if (page === 'groupChat') {
            return (
              <GroupChatPage
                groupDetails={groupDetails}
                account={account}
                groupMemberDetails={groupMemberDetails}
              />
            )
          }
          else if (page === 'groupMembers') {
            return (
              <GroupMembersPage
                groupDetails={groupDetails}
                setGroupDetails={setGroupDetails}
                setHasLeftGroup={setHasLeftGroup}
                setGroupMainModal={setOpen}
                groupMemberDetails={groupMemberDetails}
              />
            )
          }
          else if (page === 'groupRequests') {
            return (
              <GroupRequestsPage
                groupDetails={groupDetails}
                setGroupDetails={setGroupDetails}
                eventID={eventDetails.event_id}
                newRequests={newRequests}
                groupMemberDetails={groupMemberDetails}
              />
            )
          }
        })()}
      </ModalBodyLarge>
    </LargeModal>
  )
}

export default GroupMainModal


