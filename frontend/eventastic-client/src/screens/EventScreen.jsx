import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { useParams, useLocation } from 'react-router-dom';
import EventAPI from "../utils/EventAPIHelper";
import GroupAPI from '../utils/GroupAPIHelper';
import ReviewModal from '../components/review/ReviewModal'
import TicketPurchaseModal from '../components/ticket/TicketPurchaseModal';
import GroupListModal from '../components/group/GroupListModal';
import GroupMainModal from '../components/group/GroupMainModal';
import GroupCreatedModal from '../components/group/modals/GroupCreatedModal';
import GroupJoinedModal from '../components/group/modals/GroupJoinedModal';
import PurchaseSuccessModal from '../components/ticket/PurchaseSuccessModal'
import { PageContainer } from '../components/styles/layouts.styled'
import { Button, Chip, Grid, Paper, Typography, Stack, styled } from '@mui/material';

const eventApi = new EventAPI();
const groupApi = new GroupAPI()

// formating for the Grid Items 
export const GridItem = styled(Paper)`
  border: 1px solid black;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;  
`;

// code to format the Date Time
const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

function formatDate(datetime) {
  let d = new Date(datetime);
  return d.toLocaleDateString("en-US", dateFormat)
}

function formatEventPrice(gen, front, mid, back) {
  let formatted = ""
  if (parseInt(gen) >= 0) {
    formatted = formatted + "General: $" + gen + " "
  } 
  if (parseInt(front) >= 0)  {
    formatted = formatted + "Front: $" + front + " "
  } 
  if (parseInt(mid) >= 0)  {
    formatted = formatted + "Middle: $" + mid + " "
  } 
  if (parseInt(back) >= 0)  {
    formatted = formatted + "Back: $" + back + " "
  }
  return formatted
}

const EventScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const context = useContext(StoreContext);
  const [account] = context.account;
  const [accountGroups, setAccountGroups] = context.groups;
  const [LogInModal, setLogInModal] = context.logInModal;
  const [redirect, setRedirect] = useState(false)
  const [eventDetails, setEventDetails] = useState({})
  const [groupList, setGroupList] = useState([])
  const [groupDetails, setGroupDetails] = useState({})
  const [apiGetGroup, setApiGetGroup] = useState(false)
  const [hasLeftGroup, setHasLeftGroup] = useState(false)
  const [purchaseQRCode, setPurchaseQRCode] = useState(false)
  const [bookingPoints, setBookingPoints] = useState('')

  // modals
  const [openTicketModal, setTicketModal] = useState(false)
  const [openReviewModal, setReviewModal] = useState(false)
  const [openGroupListModal, setGroupListModal] = useState(false)
  const [openGroupMainModal, setGroupMainModal] = useState(false)
  const [openGroupCreatedModal, setGroupCreatedModal] = useState(false)
  const [openGroupJoinedModal, setGroupJoinedModal] = useState(false)
  const [purchaseSuccessModal, setPurchaseSuccessModal] = useState(false)

  const handleTicketButton = () => {
    if (account) {
      setTicketModal(true)
    }
    else {
      setRedirect('tickets')
      setLogInModal(true)
    }
  }

  const handleReviewButton = () => {
    if (account) {
      setReviewModal(true)
    }
    else {
      setRedirect('reviews')
      setLogInModal(true)
    }
  }

  const apiGroupsFilterBy = (eventID, accountID = false) => {
    let params = {}
    if (eventID && !accountID) {
      params = {
        event_id: eventID
      }
    }
    else if (eventID && accountID) {
      params = {
        event_id: eventID,
        account_id: account.account_id
      }
    }
    return new Promise((resolve, reject) => {
      groupApi.getGroupList(params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => reject(err))
    })
  }

  const isAccountAccepted = (groups) => {
    for (const group of groups) {
      for (const member of group.group_members) {
        if (member.account_id === account.account_id && member.join_status === 'Accepted') {
          setGroupListModal(false)
          setGroupDetails(group)
          const temp = accountGroups
          temp[eventDetails.event_id] = group
          setAccountGroups(temp) // update global account groups
          return true
        }
      }
    }
    return false
  }

  const initApiCalls = async () => {
    try {
      let eventID = null
      if (!Object.entries(eventDetails).length) {
        const eventRes = await eventApi.getEventDetails(id)
        setEventDetails(eventRes.data)
        eventID = eventRes.data.event_id
      }
      else {
        eventID = eventDetails.event_id
      }
      if (account && accountGroups[eventID]) {
        // user is logged in + already member of group
        setGroupDetails(accountGroups[eventID])
        if (location?.state?.redirect === 'groups') {
          setGroupMainModal(true)
        }
      }
      else {
        // get list of groups filtered by eventID
        const groups = await apiGroupsFilterBy(eventID)
        if (!isAccountAccepted(groups)){
          setGroupList(groups)
        }
        else if (!openGroupCreatedModal) {
          setTimeout(() => setGroupJoinedModal(true), 200)
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // this is called in main group modal when you click leave group
    if (hasLeftGroup) {
      setGroupMainModal(false)
      setGroupDetails({})
      const temp = accountGroups
      delete temp[eventDetails.event_id]
      setAccountGroups(temp) // update global account groups
      apiGroupsFilterBy(eventDetails.event_id)
        .then((groupsRes) => {
          setGroupList(groupsRes)
        })
        .catch((err) => console.error(err))
    }
  }, [hasLeftGroup])

  useEffect(() => {
    // Called when: logging in while in listing modal when you're already part of group
    // Called when: When creating a new group in listing modal
    if (apiGetGroup) {
      if (accountGroups[eventDetails.event_id]) {
        setGroupDetails(accountGroups[eventDetails.event_id])
      }
      else {
        apiGroupsFilterBy(eventDetails.event_id, account.account_id)
          .then((groupRes) => { isAccountAccepted(groupRes) })
          .catch((err) => console.error(err))
      }
      setGroupListModal(false) // close group listing modal
      setApiGetGroup(false)
    }
  }, [apiGetGroup])

  useEffect(() => {
    if (!LogInModal && !openGroupListModal && account) {
      redirect === 'tickets' && setTicketModal(true) // redirect to ticket modal after login modal
      redirect === 'reviews' && setReviewModal(true) // redirect to review modal after login modal
      setRedirect(false)
    }
  }, [LogInModal])

  useEffect(() => {
    initApiCalls()
  }, [openGroupListModal])


  useEffect(() => {
    if (location?.state?.redirect === 'reviews') {
      setReviewModal(true) // redirect to review modal if person came to page with redirect === 'reviews'
    }
  }, [])


  return (
    <PageContainer maxWidth='lg'>
      {eventDetails.event_status === "Cancelled"
        ?
        <Typography gutterBottom variant="h4" component="div">
          This Event has been Cancelled.
        </Typography>
        :
        <Grid container spacing={1}>
          <Grid item xs={6} md={6}>
            <div>
              <img
                src={eventDetails.event_img}
                width="100%"
                alt="A visulaisation of the Event"
              >
              </img>
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <GridItem>
              <Typography gutterBottom variant="h4" component="div">
                {eventDetails.event_title}
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                <b>Where is it?</b> {eventDetails.event_location}
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                <b>When does it start?</b> {formatDate(eventDetails.event_start_datetime)}
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                <b>When does it end?</b> {formatDate(eventDetails.event_end_datetime)}
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                <b>What is the price range?</b> <br></br>
                {formatEventPrice(
                  eventDetails.gen_seat_price, 
                  eventDetails.front_seat_price, 
                  eventDetails.mid_seat_price,
                  eventDetails.back_seat_price)} 
              </Typography>
              <Stack spacing={3}>
                <Button
                  variant="contained"
                  href="#contained-buttons"
                  color="error" onClick={handleTicketButton}
                >
                  Tickets
                </Button>
                <Button
                  variant="contained"
                  href="#contained-buttons"
                  color="warning" onClick={handleReviewButton}
                >
                  Reviews
                </Button>
                {Object.keys(groupDetails).length !== 0
                  ? <Button
                    variant="contained"
                    href="#contained-buttons"
                    onClick={() => setGroupMainModal(true)}
                    sx={{ bgcolor: 'evenTastic.purple', '&:hover': { backgroundColor: 'evenTastic.dark_purple' } }}
                  >
                    View Your Group
                  </Button>
                  : <Button
                    variant="contained"
                    href="#contained-buttons"
                    onClick={() => setGroupListModal(true)}
                    sx={{ bgcolor: 'evenTastic.purple', '&:hover': { backgroundColor: 'evenTastic.dark_purple' } }}
                  >
                    Find Groups
                  </Button>
                }

              </Stack>
            </GridItem>
          </Grid>
          <Grid item xs={12} md={12}>
            <GridItem>
              <Typography gutterBottom variant="h4" component="div">
                Overview:
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                {eventDetails.event_desc}
              </Typography>
            </GridItem>
          </Grid>
          <Grid item xs={12} md={12}>
            <GridItem>
              <Typography gutterBottom variant="h4" component="div">
                Tags:
              </Typography>
              <Stack direction="row" spacing={2}>
                {eventDetails.tags?.map(function (tag, i) {
                  return (
                    <Chip
                      key={i}
                      label={tag.name}
                      color='success'
                    />
                  );
                })}
              </Stack>
            </GridItem>
          </Grid>
        </Grid>
      }
      <TicketPurchaseModal
        open={openTicketModal}
        setOpen={setTicketModal}
        eventDetails={eventDetails}
        setSuccessModal={setPurchaseSuccessModal}
        setPurchaseQRCode={setPurchaseQRCode}
        setBookingPoints={setBookingPoints}
      />
      <PurchaseSuccessModal
        open={purchaseSuccessModal}
        setOpen={setPurchaseSuccessModal}
        purchaseQRCode={purchaseQRCode}
        bookingPoints={bookingPoints}
      />
      <ReviewModal
        open={openReviewModal}
        setOpen={setReviewModal}
        eventDetails={eventDetails}
      />
      <GroupListModal
        open={openGroupListModal}
        setOpen={setGroupListModal}
        eventDetails={eventDetails}
        accountGroups={accountGroups}
        groupList={groupList}
        setGroupList={setGroupList}
        setApiGetGroup={setApiGetGroup}
        setGroupCreatedModal={setGroupCreatedModal}
        setGroupJoinedModal={setGroupJoinedModal}
      />
      <GroupMainModal
        open={openGroupMainModal}
        setOpen={setGroupMainModal}
        eventDetails={eventDetails}
        groupDetails={groupDetails}
        setGroupDetails={setGroupDetails}
        setHasLeftGroup={setHasLeftGroup}
        account={account}
      />
      <GroupCreatedModal
        open={openGroupCreatedModal}
        setOpen={setGroupCreatedModal}
      />
      <GroupJoinedModal
        open={openGroupJoinedModal}
        setOpen={setGroupJoinedModal}
      />
    </PageContainer>
  )
}

export default EventScreen