import { ScrollContainer } from "../../styles/layouts.styled"
import { Button } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { StoreContext } from '../../../utils/context';
import AccountAPI from "../../../utils/AccountAPIHelper"
import EventAPI from "../../../utils/EventAPIHelper"
import EmailAPI from '../../../utils/EmailAPIHelper';

const accountAPI = new AccountAPI()
const eventAPI = new EventAPI()
const emailAPI = new EmailAPI();
const evenTasticEmail = 'eventastic.comp9900@gmail.com' 

const MainBox = styled('div')`
  width: 100%;
  margin-left: 50px;
`;

const ContentBox = styled('div')`
  width: 60%;
  height: 70%;
  min-height: 350px;
`;

const RewardsBox = styled('div')`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
`;

const ButtonBox = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
`;

const SeatsBox = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const RewardPoints = ({ open, setOpen, setPage, setSuccessModal, totalCost, eventID, generalSeats, frontSeats, middleSeats, backSeats, setPurchaseQRCode, eventDetails, setBookingPoints }) => {

  const context = useContext(StoreContext);
  const [account, setAccount] = context.account;

  const submitBooking = async () => {
    try {
      const bookingParams = {
        account_id: parseInt(account.account_id),
        event_id: parseInt(eventID),
        ticket_details: {
          General: generalSeats,
          Front: frontSeats,
          Middle: middleSeats,
          Back: backSeats,
        },
        total_cost: parseFloat(totalCost),
        card_name: "",
        card_number: "-100"
      }
        
      setBookingPoints('0')
      const makeBooking = await eventAPI.addBooking(bookingParams)
      setPurchaseQRCode(makeBooking.data.qr_code)
      setOpen(false)
      setPage('selection')
      setSuccessModal(true)

      // to deduct reward points from account
      let newRewardPoints = parseFloat((parseFloat(account.reward_points) - (parseFloat(totalCost))).toFixed(2))
      const rewardPointsParams = {
        op: "replace",
        path: "/reward_points",
        value: newRewardPoints
      }
      
      const deductRewardPoints = await accountAPI.patchAccount(parseInt(account.account_id), rewardPointsParams)

      setAccount(prevState => { return { ...prevState, reward_points: newRewardPoints } })

      // to get the list of seats
      const bookedParams = {
        booking_id: makeBooking.data.booking_id
      }
      const ticketList = await eventAPI.getTickets(bookedParams)
      let seats = ''
      for (let i=0; i<ticketList.data.length; i++) {
        seats += ticketList.data[i].ticket_ref
        if (i < ticketList.data.length-2)
          seats += ', '
        if (i === ticketList.data.length-2)
          seats += ' and '
      }
  
      //const message = "Your seats for this booking are "+seats+"."
      const emailTo = [{email_address : account.email}]
        const sendTicketsEmail = {
          email_subject: 'EvenTastic Booking Tickets',
          email_content: emailAPI.send_bookings_email(makeBooking.data.qr_code, seats, eventDetails.event_title, eventDetails.event_short_desc, eventDetails.event_desc, eventDetails.event_location, eventDetails.event_start_datetime, eventDetails.event_end_datetime ),
          email_from: {
            email_address: evenTasticEmail,
            name: "EvenTastic"
          },
          email_to: emailTo
        }
        const emailRes = await emailAPI.postEmails(sendTicketsEmail)

      
    }
    catch (err) {
      console.error(err)
    }
  }

  return (
    <ScrollContainer hide height='100%' sx={{ width: '60%' }}>
      <MainBox>
        <ContentBox >
          <div style={{  marginBottom: '20px'}}>
            <b>Rewards Points:</b>
          </div>
          <RewardsBox>
            <div style={{ width: '250px' }}>
              Current reward points:
            </div>
            <div>
              {account.reward_points}
            </div>
          </RewardsBox>
          <RewardsBox>
            <div style={{ width: '250px' }}>
              Points needed for this booking:
            </div>
            <div>
              {(parseFloat(totalCost)).toFixed(2)}
            </div>
          </RewardsBox>
          <RewardsBox>
            <div style={{ width: '250px' }}>
              Reward points after booking:
            </div>
            <div>
              {(parseFloat(account.reward_points) - (parseFloat(totalCost))).toFixed(2)}
            </div>
          </RewardsBox>
        </ContentBox>
        <ButtonBox>
          <Button variant='contained' color="success" onClick={submitBooking}>
            Confirm
          </Button>
          <Button variant='contained' onClick={() => setPage('paymentOptions')}>
            back
          </Button>
        </ButtonBox>
      </MainBox>  
    </ScrollContainer>
    
  )
}

export default RewardPoints