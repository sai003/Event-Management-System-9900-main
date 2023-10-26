import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';

const GroupJoinedModal = ({ open, setOpen }) => {

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Group Joined!" maxWidth='lg'>
      <ModalTitle title='Group Joined!' close={handleClose} />
      <ModalBody>
        Congratulations you have joined a group! Click 'View Your Group' to view and interact with your new friends!
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

export default GroupJoinedModal