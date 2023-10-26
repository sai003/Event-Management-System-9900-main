import { Link } from 'react-router-dom';
import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const CustomerRegisterModal = ({ open, setOpen }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Customer register modal" maxWidth='lg'>
      <ModalTitle title='Account registered!' close={handleClose} />
      <ModalBody>
        Welcome! You are now a registered EvenTastic user!
        Customise your event feed now by adding interest tags to your profile!
      </ModalBody>
      <FlexBox justify='space-between'>
        <Button
          component={Link} to={'/account'} state={{ from: '/register' }}
          variant='contained' size='small'
          sx={{ backgroundColor: 'evenTastic.dull', m: '1rem' }}
        >
          Skip
        </Button>
        <Button
          component={Link} to={'/tags'} state={{ from: '/register' }}
          variant='contained' size='small'
          sx={{ m: '1rem' }}
        >
          Add tags
        </Button>
      </FlexBox>
    </StandardModal>
  )
}

export default CustomerRegisterModal