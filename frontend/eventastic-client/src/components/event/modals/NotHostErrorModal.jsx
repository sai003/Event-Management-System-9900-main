import { useNavigate } from "react-router-dom";
import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button, Typography } from '@mui/material';

const NotHostErrorModal = ({ open, setOpen }) => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Not host modal" maxWidth='lg'>
      <ModalTitle title='Host account privilages required' close={handleClose} />
      <ModalBody>
        <Typography>
        You need to be a registered host to be able to create an event. You can check on your host
        status, or register to become one by clicking the button bellow.
        </Typography>
      </ModalBody>
      <FlexBox justify='space-between'>
        <Button onClick={() => navigate('/')}
          variant='contained' size='small' 
          sx={{ m: '1rem', backgroundColor:'evenTastic.dull' }}
        >
          Nevermind
        </Button>
        <Button onClick={() => navigate('/account', { state: {require: 'host'} })}
          variant='contained' size='small' color='success'
          sx={{ m: '1rem' }}
        >
          Host status
        </Button>
      </FlexBox>
    </StandardModal>
  )
}

export default NotHostErrorModal