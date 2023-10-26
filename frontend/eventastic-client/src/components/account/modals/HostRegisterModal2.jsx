import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const HostRegisterModal2 = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Host register modal" maxWidth='lg'>
      <ModalTitle title='Host registration requested' close={handleClose} />
      <ModalBody>
        Thank you for registering as a host with us! Host verification will be pending
        until our admin team has verified your organisation.
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

export default HostRegisterModal2
