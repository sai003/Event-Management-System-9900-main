import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const ReviewSuccessModal = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="review success modal" maxWidth='lg'>
      <ModalTitle title='Review has been posted successfully!' close={handleClose} />
      <ModalBody>
        Thank you for leaving a review. 😄 <br></br>
        You have been credited <b>1</b> reward point which can be used for future ticket purchases. 
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

export default ReviewSuccessModal
