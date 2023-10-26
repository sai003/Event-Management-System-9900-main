import { useEffect, useContext, useState } from "react"
import { StoreContext } from "../../../utils/context"
import { useNavigate } from 'react-router-dom';
import EventAPI from "../../../utils/EventAPIHelper"
import GroupAPI from "../../../utils/GroupAPIHelper";
import { FlexBox, ScrollContainer } from "../../styles/layouts.styled"
import { Badge, Button, Card, CardMedia, Typography } from "@mui/material"

const eventApi = new EventAPI()
const groupApi = new GroupAPI()

const Group = ({ groupDetails, account }) => {
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [eventCancelled, setEventCancelled] = useState(false)
  const [newRequests, setNewRequests] = useState(0)

  const redirect = () => {
    navigate(`/event/${groupDetails.event_id}`, { state: { redirect: 'groups' } })
  }

  useEffect(() => {
    account.account_id === groupDetails.group_host_id && setIsAdmin(true)
    eventApi.getEventDetails(groupDetails.event_id)
      .then((res) => {
        setEventDetails(res.data)
        res.data.event_status === "Cancelled" && setEventCancelled(true)
      })
      .catch((err) => console.error(err))
    groupApi.getGroup(groupDetails.group_id)
    .then((res) => {
      setNewRequests(res.data.group_members.filter((member) => member.join_status === 'Pending').length)
    })
    .catch((err) => console.error(err))
  }, [])

  return (
    <FlexBox direction='column' sx={{display: eventCancelled ? 'hide' : 'flex'}}>
      <FlexBox sx={{ ml: 3, mb: -2 }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.25 }}>
          Event:
        </Typography>
        <Typography variant='h5' sx={{ ml: 1 }}>
          {eventDetails.event_title}
        </Typography>
      </FlexBox>
      <Card sx={{
        display: 'flex', borderRadius: '10px', height: '20vh',
        bgcolor: '#fff7ec', m: 3, p: 1 }}
      >
        <CardMedia component="img" image={groupDetails.group_img}
          alt="User profile picture"
          sx={{ width: '15%', height: '100%', borderRadius: '100px', mr: 2 }}
        />
        <FlexBox direction='column' width="85%" >
          <FlexBox justify='space-between'>
            <FlexBox direction='column' >
              <Typography variant="subtitle1" color="text.secondary">
                Group Name
              </Typography>
              <Typography>
                {groupDetails.group_name}
              </Typography>
            </FlexBox>
            <Badge badgeContent={newRequests} color='error' sx={{mt:0.5, mr:0.5}}>
            {isAdmin
              ? <Button variant='contained' color='success' sx={{ mr: 1 }} onClick={redirect} >
                Manage My Group
              </Button>
              : <Button variant='contained' sx={{ mr: 1 }} onClick={redirect} >
                Go To Group
              </Button>
            }
            </Badge>
          </FlexBox>
          <FlexBox direction='column' sx={{ mt: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Event Date
            </Typography>
            <Typography>
              {eventDetails.event_start_datetime}
            </Typography>
          </FlexBox>
          <FlexBox direction='column' >
            <Typography variant="subtitle1" color="text.secondary">
              Event Location
            </Typography>
            <Typography>
              {eventDetails.event_location}
            </Typography>
          </FlexBox>
        </FlexBox>
      </Card>
    </FlexBox>
  )
}

const AccountGroupPage = () => {
  const context = useContext(StoreContext);
  const [accountGroups] = context.groups;
  const [account] = context.account;

  return (
    <ScrollContainer thin pr='1vw'>
      {Object.entries(accountGroups).length
        ? ''
        : <Typography variant="h5" align='center' sx={{mt:5}}>
          You're not in any groups
        </Typography>
      }
      {Object.entries(accountGroups).map((group, idx) => (
        <Group key={idx} groupDetails={group[1]} account={account} />
      ))}
    </ScrollContainer>
  )
}

export default AccountGroupPage