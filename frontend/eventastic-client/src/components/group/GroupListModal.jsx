import { useContext, useEffect, useRef, useState } from 'react';
import { StoreContext } from '../../utils/context';
import GroupListingsPage from './pages-listing/GroupListingsPage';
import CreateGroupPage from './pages-listing/CreateGroupPage';
import RequestJoinPage from './pages-listing/RequestJoinPage';
import GroupJoinRequestedModal from './modals/GroupJoinRequestedModal'
import { FlexBox } from '../styles/layouts.styled';
import { StyledTitle, LargeModal, ModalBodyLarge } from '../styles/modal/modal.styled';
import { Button, Divider, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const GroupListModal = ({
  open,
  setOpen,
  eventDetails,
  accountGroups,
  groupList,
  setGroupList,
  setApiGetGroup,
  setGroupCreatedModal,
  setGroupJoinedModal
}) => {
  const context = useContext(StoreContext);
  const [account] = context.account;
  const [loginModal, setLoginModal] = context.logInModal;
  const refParent = useRef(0)
  const refChild = useRef(0)
  const [requestedGroupId, setRequestedGroupId] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [page, setPage] = useState('listGroups')
  const [openGroupRequestedModal, setGroupRequestedModal] = useState(false)

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setPage('listGroups'), 200);
  }

  const handleClick = () => {
    refParent.current++; // detect click on Create group button
    setLoginModal(true)
  }

  useEffect(() => {
    // Allows redirect after clicking 'create group' OR 'request join' if user logs in via prompted login modal
    if (loginModal && !account.account_id) {
      // reached after user clicks 'create group' or 'request join' not being logged in, this sets up redirect upon login
      if (refParent.current) {
        setRedirect('creatGroup')
      }
      else if (refChild.current) {
        setRedirect('makeRequest')
        setRequestedGroupId(parseInt(refChild.current))
      }
    }
    else if (!loginModal && !account.account_id) {
      setRedirect('listGroups') // If user closes log in modal and still hasn't logged in, reset redirect
    }
    else {
      // This will be reached if the login modal just got closed + user is logged in
      if (accountGroups[eventDetails.event_id]) {
        setApiGetGroup(true); // user already member of group, leave modal
      }
      else {
        setPage(redirect)
      }
    }
    if (!open) {
      setRedirect('listGroups') // After parent modal closes, set page back to listings
    }
    refParent.current = 0
    refChild.current = 0
  }, [loginModal, open])

  return (
    <LargeModal open={open} onClose={handleClose} aria-labelledby="Review modal" maxWidth='lg'>
      <StyledTitle wrap='wrap' justify='space-between' sx={{ mb: 2 }}>
        <Typography variant='h4'>
          {(() => {
            if (page === 'listGroups') return 'Time to find a group!'
            else if (page === 'creatGroup') return 'Create your own group'
            else if (page === 'makeRequest') return 'Request to join a group'
          })()}
        </Typography>
        <FlexBox>
          {page !== 'listGroups'
            ? <Button sx={{ mr: 3, width: '185px' }}
              variant='contained' color='warning'
              onClick={() => setPage('listGroups')}
            >
              Cancel
            </Button>
            : <Button id='createButton' sx={{ mr: 3 }}
              variant='contained' color='success'
              onClick={() => account.account_id ? setPage('creatGroup') : handleClick()}
            >
              Create new group
            </Button>
          }
          <IconButton aria-label="close" onClick={handleClose} sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </FlexBox>
      </StyledTitle>
      <Divider variant="middle" sx={{ mb: 2 }} />
      <ModalBodyLarge sx={{ overflow: 'hidden' }}>
        {(() => {
          if (page === 'listGroups') {
            return (
              <GroupListingsPage
                ref={refChild}
                setPage={setPage}
                groupList={groupList}
                setRequestedGroupId={setRequestedGroupId}
                eventTitle={eventDetails.event_title}
                setGroupJoinedModal={setGroupJoinedModal}
                setApiGetGroup={setApiGetGroup}
              />
            )
          }
          else if (page === 'creatGroup') {
            return (
              <CreateGroupPage
                eventID={eventDetails.event_id}
                account={account}
                setOpen={setGroupCreatedModal}
                setApiGetGroup={setApiGetGroup}
              />
            )
          }
          else if (page === 'makeRequest') {
            return (
              <RequestJoinPage
                setOpen={setGroupRequestedModal}
                setPage={setPage}
                setGroupList={setGroupList}
                group={groupList.filter((group) => group.group_id === requestedGroupId)[0]}
                account={account}
              />
            )
          }
        })()}
      </ModalBodyLarge>
      <GroupJoinRequestedModal
        open={openGroupRequestedModal}
        setOpen={setGroupRequestedModal}
      />
    </LargeModal>
  )
}

export default GroupListModal


