import { StandardModal, ModalBody, ModalTitle } from '../styles/modal/modal.styled';
import { FlexBox } from '../styles/layouts.styled';
import { Button } from '@mui/material';
import QRCode from "react-qr-code";

const PurchaseSuccessModal = ({ open, setOpen, purchaseQRCode, bookingPoints }) => {
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="purchase success modal" maxWidth='lg'>
      <ModalTitle title='Booking Successful!' close={handleClose} />
      <ModalBody>
        {bookingPoints === '0' &&
          <div>
            Your booking has been completed successfully. 
            An email will be sent to your registered email ID with the ticket details.
          </div>
        }
        {bookingPoints !== '0' &&
          <div>
            Your booking has been completed successfully and {bookingPoints} reward points will be added to your account upon event completion. 
            An email will be sent to your registered email ID with the ticket details.
          </div>
        }
        <br></br>
        <div style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div>
            Booking code: <b>{purchaseQRCode}</b>
          </div>
          <div>
            <QRCode value={purchaseQRCode} />
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

export default PurchaseSuccessModal
