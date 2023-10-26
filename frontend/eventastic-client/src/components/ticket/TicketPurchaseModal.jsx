import { useState, useEffect } from 'react';
import TicketSelection from './pages/TicketSelection';
import PaymentOptions from './pages/PaymentOptions';
import CardDetails from './pages/CardDetails';
import RewardPoints from './pages/RewardPoints';
import TicketSummary from './pages/TicketSummary';
import { FlexBox } from '../styles/layouts.styled';
import { LargeModal, ModalBodyLarge, ModalTitle } from '../styles/modal/modal.styled';
import { Divider } from '@mui/material';
import EventAPI from "../../utils/EventAPIHelper"

const api = new EventAPI()

const TicketPurchaseModal = ({ open, setOpen, eventDetails, setSuccessModal, setPurchaseQRCode, setBookingPoints }) => {
  const [page, setPage] = useState('selection')
  
  const [generalPrice, setGeneralPrice] = useState(0.0)
  const [frontPrice, setFrontPrice] = useState(0.0)
  const [middlePrice, setMiddlePrice] = useState(0.0)
  const [backPrice, setBackPrice] = useState(0.0)
  const [totalCost, setTotalCost] = useState(0.0)
  
  const [maxGeneralSeats, setMaxGeneralSeats] = useState([])
  const [maxFrontSeats, setMaxFrontSeats] = useState([])
  const [maxMiddleSeats, setMaxMiddleSeats] = useState([])
  const [maxBackSeats, setMaxBackSeats] = useState([])

  const [generalSeats, setGeneralSeats] = useState(0.0)
  const [frontSeats, setFrontSeats] = useState(0.0)
  const [middleSeats, setMiddleSeats] = useState(0.0)
  const [backSeats, setBackSeats] = useState(0.0) 

  const getAvailableTickets = async (eventDetails) => {
    const ticket_params = {
      event_id: eventDetails.event_id,
      ticket_status: 'Available'
    }
    const avTickets = await api.getTickets(ticket_params)

    setGeneralSeats(0.0)
    setFrontSeats(0.0)
    setMiddleSeats(0.0)
    setBackSeats(0.0)
  
    const maxGeneral = avTickets.data.filter((ticket) => ticket.ticket_type === 'General').length
    let generalList = []
    for (let i=1; i<=maxGeneral; i++) generalList.push(i)
    setMaxGeneralSeats(generalList)
  
    const maxFront = avTickets.data.filter((ticket) => ticket.ticket_type === 'Front').length
    let frontList = []
    for (let i=1; i<=maxFront; i++) frontList.push(i)
    setMaxFrontSeats(frontList)
  
    const maxMiddle = avTickets.data.filter((ticket) => ticket.ticket_type === 'Middle').length
    let middleList = []
    for (let i=1; i<=maxMiddle; i++) middleList.push(i)
    setMaxMiddleSeats(middleList)
  
    const maxBack = avTickets.data.filter((ticket) => ticket.ticket_type === 'Back').length
    let backList = []
    for (let i=1; i<=maxBack; i++) backList.push(i)
    setMaxBackSeats(backList)

    setGeneralPrice(eventDetails.gen_seat_price)
    setFrontPrice(eventDetails.front_seat_price)
    setMiddlePrice(eventDetails.mid_seat_price)
    setBackPrice(eventDetails.back_seat_price)

  }

  useEffect(() => {
    getAvailableTickets(eventDetails)
  }, [open])
  

  const handleClose = () => {
    setOpen(false);
    setPage('selection')
  }

  return (
    <LargeModal open={open} onClose={handleClose} aria-labelledby="Purchase ticket modal" maxWidth='lg'>
      <ModalTitle title={`Purchase tickets for ${eventDetails.event_title}`} close={handleClose} />
      <ModalBodyLarge>
        <FlexBox sx={{ height: '100%' }}>
          {(() => {
            if (page === 'selection') {
              return (
                <TicketSelection open={open} setPage={setPage}
                generalSeats={generalSeats} frontSeats={frontSeats} middleSeats={middleSeats} backSeats={backSeats} 
                setGeneralSeats={setGeneralSeats} setFrontSeats={setFrontSeats} setMiddleSeats={setMiddleSeats} setBackSeats={setBackSeats}
                maxGeneralSeats={maxGeneralSeats} maxFrontSeats={maxFrontSeats} maxMiddleSeats={maxMiddleSeats} maxBackSeats={maxBackSeats}
                generalPrice={generalPrice} frontPrice={frontPrice} middlePrice={middlePrice} backPrice={backPrice} setTotalCost={setTotalCost} />
              )
            }
            else if (page === 'paymentOptions') {
              return (
                <PaymentOptions setPage={setPage} totalCost={totalCost} />
              )
            }
            else if (page === 'cardDetails') {
              return (
                <CardDetails open={open} setOpen={setOpen} setPage={setPage} setSuccessModal={setSuccessModal} 
                totalCost={totalCost} eventID={eventDetails.event_id} generalSeats={generalSeats} frontSeats={frontSeats} 
                middleSeats={middleSeats} backSeats={backSeats} setPurchaseQRCode={setPurchaseQRCode} 
                eventDetails={eventDetails} setBookingPoints={setBookingPoints} />
              )
            }
            else if (page === 'points') {
              return (
                <RewardPoints open={open} setOpen={setOpen} setPage={setPage} setSuccessModal={setSuccessModal} 
                totalCost={totalCost} eventID={eventDetails.event_id} generalSeats={generalSeats} frontSeats={frontSeats} 
                middleSeats={middleSeats} backSeats={backSeats} setPurchaseQRCode={setPurchaseQRCode} 
                eventDetails={eventDetails} setBookingPoints={setBookingPoints} />
              )
            }
          })()}
          <Divider orientation='vertical' />
          <TicketSummary generalSeats={generalSeats} frontSeats={frontSeats} middleSeats={middleSeats} backSeats={backSeats} 
          generalPrice={generalPrice} frontPrice={frontPrice} middlePrice={middlePrice} backPrice={backPrice} totalCost={totalCost} />
        </FlexBox>
      </ModalBodyLarge>
    </LargeModal>
  )
}

export default TicketPurchaseModal
