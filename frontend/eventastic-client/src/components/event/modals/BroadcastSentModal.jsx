import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const BroadcastSentModal = ({ open, setOpen, managedEventDetails }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Broadcast modal" maxWidth='lg'>
      <ModalTitle title='Broadcast sent!' close={handleClose} />
      <ModalBody>
        Your broadcast has been sent to everybody who has a booking with <b>{managedEventDetails.event_title}</b>
      </ModalBody>
      <FlexBox justify='space-between'>
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

export default BroadcastSentModal