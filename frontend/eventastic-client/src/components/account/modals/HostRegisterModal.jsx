import { Link } from 'react-router-dom';
import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Box, Button } from '@mui/material';

const HostRegisterModal = ({ open, setOpen }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Host register modal" maxWidth='lg'>
      <ModalTitle title='Account registered!' close={handleClose} />
      <ModalBody>
        <Box sx={{ mb: '1rem' }}>
          Welcome! You have registered as a host on EvenTastic!
          Host verification will remain pending until our admin team verifies your organisation.
        </Box>
        <Box>
          In the meantime, customise your event feed now by adding interest tags to your profile!
        </Box>
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

export default HostRegisterModal
