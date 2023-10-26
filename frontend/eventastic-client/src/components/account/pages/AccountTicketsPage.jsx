import { useContext, useEffect, useState } from "react"
import { styled } from '@mui/material/styles';
import { StoreContext } from '../../../utils/context';
import EventAPI from "../../../utils/EventAPIHelper"
import EmailAPI from '../../../utils/EmailAPIHelper';
import CancelTicketModal from "../modals/CancelTicketModal";
import SendTicketsModal from "../modals/SendTicketsModal";
import { FlexBox, ScrollContainer } from "../../styles/layouts.styled"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const api = new EventAPI()
const emailAPI = new EmailAPI();
const evenTasticEmail = 'eventastic.comp9900@gmail.com'

const MainBox = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PastMainBox = styled('div')`
  display: flex;
  flex-direction: row;
`;

const SaveButtonBox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// code to format the Date Time
const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

function formatDate(datetime) {
  let d = new Date(datetime);
  return d.toLocaleDateString("en-US", dateFormat)
}

const Ticket = ({ booking, handleCancelBooking, handleSendTicketsModal }) => {

  let navigate = useNavigate();

  const toEvent = (eventId) => {
    navigate("../event/"+eventId);
  }

  
  let ticketSeats = ""
  const setTypes = ['General', 'Front', 'Middle', 'Back']
  setTypes.forEach((item) => {
    if (Object.keys(booking.ticket_details).includes(item)) {
      ticketSeats += item+":"+booking.ticket_details[item]+", "
    }
  })
  ticketSeats = ticketSeats.substring(0, ticketSeats.length-2)

  const currentDate = new Date();
  const eventDate = new Date(booking.event_start_datetime);
  const daysToGo = parseInt(Math.abs(eventDate - currentDate)/ (1000 * 60 * 60 * 24))
  const hoursToGo = parseInt(Math.abs(eventDate - currentDate)/ (1000 * 60 * 60))

  return (
    <FlexBox id={booking.booking_id} sx={{ border: '0.1px solid black', borderRadius: '3px', m: 3 }}>
      <MainBox>
        { booking.event_img.length < 70 ?
        <img style={{ cursor:'pointer' }}
          src={process.env.PUBLIC_URL + '/img/event/' + booking.event_img}
          width="20%"
          alt="Event thumbnail"
          id = {booking.event_id}
          onClick={(e) => toEvent(e.target.id)}
        >
        </img>
        :
        <img style={{ cursor:'pointer' }}
          src={booking.event_img}
          width="20%"
          alt="Event thumbnail"
          id = {booking.event_id}
          onClick={(e) => toEvent(e.target.id)}
        >
        </img>
        }

        <div width="60%" style={{ marginBottom: '10px' }}>
          <Typography variant="h5"><b style={{ color:'#202020' }}>{booking.event_title}</b></Typography>
          <b style={{ color:'#404040' }}>At:</b> {booking.event_location}<br></br>
          <b style={{ color:'#404040' }}>When:</b> {formatDate(booking.event_start_datetime)}<br></br>
          <b style={{ color:'#404040' }}>Seats</b>: {ticketSeats}<br></br>
          <b style={{ color:'#404040' }}>Cost</b>: A${booking.total_cost}<br></br>
        </div>
        <div width="20%" style={{ color:'#505050' }}>
          <div style={{ marginTop: '3px' }}>
            {daysToGo > 0 &&
            <b>Days to Go</b>
            }
            {daysToGo < 1 &&
            <b style={{ color: 'red' }}>HOURS TO GO</b>
            }
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {daysToGo > 0 &&
            <Typography variant="h3" mt={1} >{daysToGo}</Typography>
            }
            {daysToGo < 1 &&
            <Typography variant="h3" mt={1} color='red' >{hoursToGo}</Typography>
            }
          </div>
        </div>
        <SaveButtonBox  width="15%">
          <Button sx={{ height: '50%' }} variant="contained" value={booking.booking_id} onClick={(e) => handleSendTicketsModal(e.target.value, booking.qr_code, booking.event_title, booking.event_short_desc, booking.event_desc, booking.event_location, booking.event_start_datetime, booking.event_end_datetime)} >Send Tickets</Button> 
          <Button sx={{ height: '50%' }} variant="contained" color="error" id={booking.booking_id} onClick={(e) => handleCancelBooking(e.target.id, booking.card_number, booking.total_cost, booking.reward_points_id, booking.qr_code, booking.event_title, booking.event_short_desc, booking.event_desc, booking.event_location, booking.event_start_datetime, booking.event_end_datetime)} >Cancel Booking</Button>
        </SaveButtonBox>
      </MainBox>
    </FlexBox>
  )
}

const PastTickets = ({ booking }) => {

  let navigate = useNavigate();

  const toEvent = (eventId) => {
    navigate("../event/"+eventId);
  }

  let ticketSeats = ""
  const setTypes = ['General', 'Front', 'Middle', 'Back']
  setTypes.forEach((item) => {
    if (Object.keys(booking.ticket_details).includes(item)) {
      ticketSeats += item+":"+booking.ticket_details[item]+", "
    }
  })
  ticketSeats = ticketSeats.substring(0, ticketSeats.length-2)

  return (
    <FlexBox id={booking.booking_id} sx={{ border: '1px solid black', borderRadius: '3px', m: 3 }}>
      <PastMainBox>
        { booking.event_img.length < 70 ?
        <img style={{ cursor:'pointer' }}
          src={process.env.PUBLIC_URL + '/img/event/' + booking.event_img}
          width="20%"
          alt="Event thumbnail"
          id = {booking.event_id}
          onClick={(e) => toEvent(e.target.id)}
        >
        </img>
        :
        <img style={{ cursor:'pointer' }}
          src={booking.event_img}
          width="20%"
          alt="Event thumbnail"
          id = {booking.event_id}
          onClick={(e) => toEvent(e.target.id)}
        >
        </img>
        }

        <div width="60%" style={{ marginBottom: '10px', marginLeft: '30px' }}>
          <Typography variant="h5"><b>{booking.event_title}</b></Typography>
          <b>At:</b> {booking.event_location}<br></br>
          <b>When:</b> {formatDate(booking.event_start_datetime)}<br></br>
          <b>Seats</b>: {ticketSeats}<br></br>
          <b>Cost</b>: A${booking.total_cost}<br></br>
        </div>
      </PastMainBox>
    </FlexBox>
  )
}

const AccountTicketsPage = ({ toggle }) => {
  const context = useContext(StoreContext);
  const [account] = context.account;
  const [UpComingBookings, setUpComingBookings] = useState([])
  const [PastBookings, setPastBookings] = useState([])
  const [ticketString, setTicketString] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [sendTicketsModal, setSendTicketsModal] = useState(false)
  const [cancelBooking, setCancelBooking] = useState(null)

  const [sendTicketQRCode, setSendTicketQRCode] = useState(null)
  const [toCancel, setToCancel] = useState(null)
  const [toCancelCard, setToCancelCard] = useState(null)
  const [toCancelPoints, setToCancelPoints] = useState(null)
  const [toCancelPointsID, setToCancelPointsID] = useState(null)
  const [toCancelQRCode, setToCancelQRCode] = useState(null)

  const [eventTitle, setEventTitle] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [fullDesc, setFullDesc] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [eventStartTime, setEventStartTime] = useState('')
  const [eventEndTime, setEventEndTime] = useState('')

  const getBookings = async () => {
    try {
      const booking_params = {
        account_id: account.account_id,
        booking_status: 'Booked'
      }
      const bookedRes = await api.getBookings(booking_params)

      let bookedEventsRes = await Promise.all(bookedRes.data.map((booking, idx) => {
        return api.getEventDetails(booking.event_id).then((res) => res.data)
      }))
      
      const bookingMapping = bookedRes.data.map((booking, idx) => (
        {
          booking_id: booking.booking_id,
          booking_email: booking.booking_email,
          account_id: booking.account_id,
          event_id: booking.event_id,
          total_cost: booking.total_cost,
          ticket_details: booking.ticket_details,
          card_number: booking.card_number,
          qr_code: booking.qr_code,
          reward_points_id: parseInt(booking.reward_points_id),
          reward_points: parseFloat(booking.reward_points),
          event_title: bookedEventsRes[idx].event_title,
          event_img: bookedEventsRes[idx].event_img,
          event_location: bookedEventsRes[idx].event_location,
          event_desc: bookedEventsRes[idx].event_desc,
          event_short_desc: bookedEventsRes[idx].event_short_desc,
          event_start_datetime: bookedEventsRes[idx].event_start_datetime,
          event_end_datetime: bookedEventsRes[idx].event_end_datetime
        }
      ))

      setUpComingBookings(bookingMapping)

      // get past bookings data

      const pastBookingParams = {
        account_id: account.account_id,
        booking_status: 'Completed'
      }
      const pastBookings = await api.getBookings(pastBookingParams)

      let pastBookedEvents = await Promise.all(pastBookings.data.map((booking, idx) => {
        return api.getEventDetails(booking.event_id).then((res) => res.data)
      }))
      
      const pastBookingsMapping = pastBookings.data.map((booking, idx) => (
        {
          booking_id: booking.booking_id,
          booking_email: booking.booking_email,
          account_id: booking.account_id,
          event_id: booking.event_id,
          total_cost: booking.total_cost,
          ticket_details: booking.ticket_details,
          event_title: pastBookedEvents[idx].event_title,
          event_img: pastBookedEvents[idx].event_img,
          event_location: pastBookedEvents[idx].event_location,
          event_start_datetime: pastBookedEvents[idx].event_start_datetime
        }
      ))
      setPastBookings(pastBookingsMapping)

    }
    catch (err) {
      console.error(err)
    }
  }

  const handleCancelBooking = (booking_id, card_number, total_cost, reward_points_id, qr_code, event_title, event_short_desc, event_desc, event_location, event_start_datetime, event_end_datetime) => {
    setToCancel(booking_id)
    setToCancelCard(card_number)
    setToCancelPoints(parseFloat(total_cost).toFixed(2))
    setToCancelPointsID(reward_points_id)
    setToCancelQRCode(qr_code)

    setEventTitle(event_title)
    setShortDesc(event_short_desc)
    setFullDesc(event_desc)
    setEventLocation(event_location)
    setEventStartTime(event_start_datetime)
    setEventEndTime(event_end_datetime)

    setOpenModal(true)
  }

  const handleSendTicketsModal = async (booking_id, qr_code, event_title, event_short_desc, event_desc, event_location, event_start_datetime, event_end_datetime) => {
    try {
      setSendTicketsModal(true)
      setSendTicketQRCode(qr_code)

      const bookingParams = {
        booking_id: booking_id
      }
      const ticketList = await api.getTickets(bookingParams)
      let seats = ''
      for (let i=0; i<ticketList.data.length; i++) {
        seats += ticketList.data[i].ticket_ref
        if (i < ticketList.data.length-2)
          seats += ', '
        if (i === ticketList.data.length-2)
          seats += ' and '
      }
      setTicketString(seats)

      //const message = "Your seats for this booking (booking code: "+qr_code+") are "+seats+"."
      const emailTo = [{email_address : account.email}]
        const sendTicketsEmail = {
          email_subject: 'EvenTastic Booking Tickets',
          email_content: emailAPI.send_bookings_email(qr_code, seats, event_title, event_short_desc, event_desc, event_location, event_start_datetime, event_end_datetime),
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

  useEffect(() => {
    getBookings()
  }, [])

  useEffect(() => {
    setUpComingBookings(UpComingBookings.filter((booking) => parseInt(booking.booking_id) !== parseInt(toCancel)))
  }, [cancelBooking])

  return (
    <ScrollContainer hide sx={{ p: 1, mt: 7 }}>
      {toggle
        ? <div>
        {UpComingBookings.map((booking, idx) => (
          <Ticket key={idx} booking={booking} handleCancelBooking={handleCancelBooking} handleSendTicketsModal={handleSendTicketsModal} />
        ))}
      </div>
        : 
        <div>
          {PastBookings.map((booking, idx) => (
            <PastTickets key={idx} booking={booking} />
          ))}
        </div>
      }
      <div style={{ height:'50px' }}></div>
      <CancelTicketModal open={openModal} setOpen={setOpenModal} toCancel={toCancel} setCancelBooking={setCancelBooking}
      toCancelCard={toCancelCard} toCancelPoints={toCancelPoints} toCancelPointsID={toCancelPointsID}
      toCancelQRCode={toCancelQRCode} eventTitle={eventTitle} shortDesc={shortDesc} fullDesc={fullDesc}
      eventLocation={eventLocation} eventStartTime={eventStartTime} eventEndTime={eventEndTime} />
      <SendTicketsModal open={sendTicketsModal} setOpen={setSendTicketsModal} ticketString={ticketString} sendTicketQRCode={sendTicketQRCode} />
    </ScrollContainer>
  )
}

export default AccountTicketsPage
