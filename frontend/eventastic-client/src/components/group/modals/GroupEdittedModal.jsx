import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const GroupEditedModal = ({ open, setOpen }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Group edited" maxWidth='lg'>
      <ModalTitle title='Edit successful!' close={handleClose} />
      <ModalBody>
        Your group details have been updated!
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

export default GroupEditedModal