import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const GroupJoinRequestedModal = ({ open, setOpen }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Group Join requested!" maxWidth='lg'>
      <ModalTitle title='Join request sent!' close={handleClose} />
      <ModalBody>
        The group owner will review your request, if they approve, you will be automatically added to the group!
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

export default GroupJoinRequestedModal