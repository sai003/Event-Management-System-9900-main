import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button, Typography } from '@mui/material';
import EventAPI from "../../../utils/EventAPIHelper"
import EmailAPI from '../../../utils/EmailAPIHelper';
import AccountAPI from "../../../utils/AccountAPIHelper"
import { StoreContext } from '../../../utils/context';
import { useContext } from 'react';

const eventAPI = new EventAPI()
const accountAPI = new AccountAPI()
const emailAPI = new EmailAPI();
const evenTasticEmail = 'eventastic.comp9900@gmail.com'

const CancelTicketModal = ({ open, setOpen, toCancel, setCancelBooking, toCancelCard, toCancelPoints, toCancelPointsID, toCancelQRCode, eventTitle, shortDesc, fullDesc, eventLocation, eventStartTime, eventEndTime }) => {
  
  const context = useContext(StoreContext);
  const [account, setAccount] = context.account;

  const cancelBooking = (bookingID, qrCode) => {
    const body = {
      op: "replace",
      path: "/booking_status",
      value: "Cancelled"
    }
    eventAPI.patchBookings(bookingID, body)
      .then()
      .catch((err) => console.error(err))

    const emailTo = [{email_address : account.email}]
      const sendCancelEmail = {
        email_subject: 'EvenTastic Booking Cancellation',
        email_content: emailAPI.send_cancellation_email(qrCode, eventTitle, shortDesc, fullDesc, eventLocation, eventStartTime, eventEndTime),
        email_from: {
          email_address: evenTasticEmail,
          name: "EvenTastic"
        },
        email_to: emailTo
      }
      emailAPI.postEmails(sendCancelEmail)
      .then()
      .catch((err) => console.error(err))
  }

  const addRewardPointsBack = (rewardPoints) => {
    let newRewardPoints = parseFloat((parseFloat(account.reward_points) + (parseFloat(rewardPoints))).toFixed(2))
    const body = {
      op: "replace",
      path: "/reward_points",
      value: newRewardPoints
    }

    setAccount(prevState => { return { ...prevState, reward_points: newRewardPoints } })
    
    accountAPI.patchAccount(parseInt(account.account_id), body)
    .then()
    .catch((err) => console.error(err))
  }

  const cancelRewardPointsStatus = (rewardPointsID) => {
    const body = {
      op: "replace",
      path: "/reward_points_status",
      value: "Cancelled"
    }
    eventAPI.patchRewardPoints(rewardPointsID, body)
      .then()
      .catch((err) => console.error(err))
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCancel = () => {
    cancelBooking(toCancel, toCancelQRCode)

    if (toCancelCard === '-100') {
      addRewardPointsBack(toCancelPoints)
    } else if (parseInt(toCancelPointsID) !== -1) {
      cancelRewardPointsStatus(toCancelPointsID)
    }

    setCancelBooking(toCancel)
    handleClose()
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Delete booking modal" maxWidth='lg'>
      <ModalTitle title='Cancel booking' close={handleClose} />
      <ModalBody>
        <Typography>
        Are you sure you want to cancel this booking?
        </Typography>
      </ModalBody>
      <FlexBox justify='space-between'>
        <Button onClick={handleCancel}
          variant='contained' size='small' color='error'
          sx={{ m: '1rem' }}
        >
          Cancel booking
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

export default CancelTicketModal