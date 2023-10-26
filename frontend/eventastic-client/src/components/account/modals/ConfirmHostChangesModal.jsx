import { Link } from 'react-router-dom';
import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/ModalBody.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const ConfirmHostChangesModal = ({ open, setOpen }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Confirm Host Change modal" maxWidth='lg'>
      <ModalTitle title='Account registered!' close={handleClose} />
      <ModalBody>
        Are you sure you want to 
      </ModalBody>
      <FlexBox justify='space-between'>
        <Button
          component={Link} to={'/account?test=yolo'} state={{ from: '/register' }}
          variant='contained' size='small'
          sx={{ backgroundColor: 'evenTastic.dull', m: '1rem' }}
        >
          Skip
        </Button>
        <Button
          component={Link} to={'/tags'}
          variant='contained' size='small'
          sx={{ m: '1rem' }}
        >
          Add tags
        </Button>
      </FlexBox>
    </StandardModal>
  )
}

export default ConfirmHostChangesModal