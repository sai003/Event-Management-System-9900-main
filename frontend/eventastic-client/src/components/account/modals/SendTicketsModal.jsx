import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';
import QRCode from "react-qr-code";

const SendTicketsModal = ({ open, setOpen, ticketString, sendTicketQRCode }) => {
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="send tickets modal" maxWidth='lg'>
      <ModalTitle title='Send Tickets' close={handleClose} />
      <ModalBody>
        <div>
          Your seats for this booking are {ticketString}. An email will be sent to your registered email ID with the ticket details.
        </div>
        <br></br>
        <div style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div>
            Booking code: <b>{sendTicketQRCode}</b>
          </div>
          <div>
            <QRCode value={sendTicketQRCode} />
          </div>
        </div>
      </ModalBody>
      <FlexBox justify='end'>
        <Button
          onClick={handleClose}
          variant='contained' size='small'
          sx={{ m: '1rem' }}
        >
          continue
        </Button>
      </FlexBox>
    </StandardModal>
  )
}

export default SendTicketsModal
