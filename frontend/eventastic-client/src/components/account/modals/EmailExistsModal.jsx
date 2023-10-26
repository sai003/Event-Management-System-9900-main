import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Box, Button } from '@mui/material';

const EmailExistsModal = ({ open, setOpen, email }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Email error modal" maxWidth='lg'>
      <ModalTitle title='Email already exists' close={handleClose} />
      <ModalBody>
        <Box sx={{ mb: '1rem' }}>
            The email '{email}' already exists. Nothing has been submitted, please set a different email
            and try submit again.
        </Box>
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

export default EmailExistsModal
