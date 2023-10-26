import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button, Typography } from '@mui/material';
import EventAPI from '../../../utils/EventAPIHelper';
import EmailAPI from '../../../utils/EmailAPIHelper';

const eventAPI = new EventAPI();
const emailAPI = new EmailAPI();
const evenTasticEmail = 'eventastic.comp9900@gmail.com'

const CancelEventModal = ({ open, setOpen, managedEventDetails, setManagedEventDetails, setSuccessModal }) => {

  const handleClose = () => {
    setOpen(false);
  }

  const handleCancel = async () => {

    try {

      // First, notifiy all Customers that purchased tickets that the booking has been Cancelled.
      const param = {
        'event_id': managedEventDetails.event_id,
        'booking_status': 'Booked'
      }
      const bookingRes = await eventAPI.getBookings(param)
      const emailsToBroadcast = bookingRes.data.map((booking) => ({ email_address: booking.booking_email }))
      
      if (emailsToBroadcast.length > 0) {
        const sendgridBroadcast = {
          email_subject: "Your Event Booking has been Cancelled",
          email_content: "The Event " + managedEventDetails.event_title +
            " has been Cancelled. You will be refunded your Booking Costs. Apologies for the cancellation.",
          email_from: {
            email_address: evenTasticEmail,
            name: "EvenTastic"
          },
          email_to: emailsToBroadcast
        }
        const emailRes = await emailAPI.postEmails(sendgridBroadcast)
      }

      const updateStatus = {
        op: "replace",
        path: "/event_status",
        value: "Cancelled"
      }

      // Second, set the Event Status to Cancelled.
      managedEventDetails.event_status = "Cancelled"
      const response = await eventAPI.patchEvent(managedEventDetails.event_id, updateStatus)
      setManagedEventDetails(prevState => { return { ...prevState, ...managedEventDetails } })
      handleClose(true)
      setSuccessModal(true)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Cancel Event modal" maxWidth='lg'>
      <ModalTitle title='Cancel your Event' close={handleClose} />
      <ModalBody>
        <Typography>
          Are you sure that you want to cancel this event?
        </Typography>
      </ModalBody>
      <FlexBox justify='space-between'>
        <Button onClick={handleCancel}
          variant='contained' size='small' color='error'
          sx={{ m: '1rem' }}
        >
          Cancel Event
        </Button>
        <Button onClick={handleClose}
          variant='contained' size='small'
          sx={{ backgroundColor: 'evenTastic.dull', m: '1rem' }}
        >
          Nevermind
        </Button>
      </FlexBox>
    </StandardModal>
  )
}

export default CancelEventModal