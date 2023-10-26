import { useEffect, useContext, useState } from "react"
import { StoreContext } from "../../../utils/context"
import GroupAPI from "../../../utils/GroupAPIHelper";
import { FlexBox, ScrollContainer } from "../../styles/layouts.styled";
import { Button, Card, CardMedia, Chip, Typography } from "@mui/material";

const groupApi = new GroupAPI()

const MemberCard = ({ groupDetails, setGroupDetails, eventID, member, groupMemberDetails }) => {
  const context = useContext(StoreContext);
  const [accountGroups, setAccountGroups] = context.groups;
  const [account] = context.account;
  const [isGroupAdmin, setGroupAdmin] = useState(false)

  const processRequest = async (status) => {
    try {
      const body = {
        op: "replace",
        path: "/join_status",
        value: status
      }
      const patchRes = await groupApi.patchGroupMember(
        groupDetails.group_id, member.group_membership_id, body
      )
      let updatedMembers = groupDetails.group_members.filter((m) => m.account_id !== member.account_id)
      updatedMembers.push(patchRes.data)
      const updatedGroup = { ...groupDetails, group_members: updatedMembers }
      setGroupDetails(updatedGroup) // update local account group
      const temp = accountGroups
      temp[eventID] = updatedGroup
      setAccountGroups(temp) // update global account groups
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    groupDetails.group_host_id === account.account_id && setGroupAdmin(true)
  }, [])

  return (
    <Card sx={{
      display: 'flex', borderRadius: '10px', height: '20vh',
      bgcolor: '#fff7ec', m: 3, p: 1
    }}
    >
      <CardMedia component="img"
        image={groupMemberDetails[member.account_id]?.profile_pic 
          ? groupMemberDetails[member.account_id]?.profile_pic
          : '/img/stock/user.jpg'
        }
        alt="User profile picture"
        sx={{ width: '15%', height: '100%', borderRadius: '100px', mr: 2 }}
      />
      <FlexBox direction='column' width="85%" >
        <FlexBox>
          <FlexBox direction='column' sx={{ minWidth: '15%' }}>
            <Typography variant="subtitle1" color="text.secondary">
              Name
            </Typography>
            <Typography>
              {groupMemberDetails[member.account_id]?.first_name} {groupMemberDetails[member.account_id]?.last_name}
            </Typography>
          </FlexBox>
          <FlexBox direction='column' sx={{ width: '60%', ml:3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Interests
            </Typography>
            <ScrollContainer thin horizontal='true' sx={{ pb: 0.25 }}>
              {member.interest_tags.map((tag, idx) => (
                <Chip key={idx} color='success' label={tag.name} sx={{ ml: 0.5, mr: 0.5 }} />
              ))}
            </ScrollContainer>
          </FlexBox>
          {isGroupAdmin
            ? <FlexBox sx={{ width: '15%', ml: 4 }}>
              <Button variant='contained' color='success'
                onClick={() => processRequest('Accepted')} sx={{ height: '3vh', mr: 2 }}
              >
                Accept
              </Button>
              <Button variant='contained' color='error'
                onClick={() => processRequest('Rejected')} sx={{ height: '3vh' }}
              >
                Decline
              </Button>
            </FlexBox>
            : ''
          }
        </FlexBox>
        <ScrollContainer thin flex='true' pr='1vw' sx={{ flexDirection: 'column', width: '97%' }} >
          <FlexBox direction='column' sx={{ mr: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              My bio
            </Typography>
            <Typography>
              {groupMemberDetails[member.account_id]?.user_desc}
            </Typography>
          </FlexBox>
          <FlexBox direction='column' sx={{ mr: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Join request
            </Typography>
            <Typography>
              {member.join_desc}
            </Typography>
          </FlexBox>
        </ScrollContainer>
      </FlexBox>
    </Card>
  )
}

const GroupRequestsPage = ({ groupDetails, setGroupDetails, eventID, newRequests, groupMemberDetails }) => {
  return (
    <ScrollContainer thin pr='1vw'>
      {newRequests
        ? ''
        : <Typography variant="h4" align='center' sx={{ mt: 5 }}>
          No new join requests
        </Typography>
      }
      {groupDetails.group_members.filter((member) => member.join_status === 'Pending').map((member, idx) => (
        <MemberCard
          key={idx}
          groupDetails={groupDetails}
          setGroupDetails={setGroupDetails}
          eventID={eventID}
          member={member}
          groupMemberDetails={groupMemberDetails}
        />
      ))}
    </ScrollContainer>
  )
}

export default GroupRequestsPage