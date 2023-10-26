import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const BroadcastFailedModal = ({ open, setOpen, managedEventDetails }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Failed broadcast" maxWidth='lg'>
      <ModalTitle title='Broadcast failed' close={handleClose} />
      <ModalBody>
        No one has yet made a booking for your event <b>{managedEventDetails.event_title}</b>..
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

export default BroadcastFailedModal