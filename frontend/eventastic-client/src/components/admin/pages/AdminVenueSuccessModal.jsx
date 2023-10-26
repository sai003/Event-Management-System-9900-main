import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const AdminVenueSuccessModal = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="venue success modal" maxWidth='lg'>
      <ModalTitle title='Venue has been Created successfully!' close={handleClose} />
      <ModalBody>
        Venue Created!!! 😄 <br></br>
        
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

export default AdminVenueSuccessModal