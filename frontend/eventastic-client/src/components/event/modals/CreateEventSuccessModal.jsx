import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEventSuccessModal = ({ open, setOpen }) => {
    const [max_seconds_before_close,set_max_seconds_before_close] = useState(5);
    const navigate = useNavigate()

    useEffect(()=>{
        setInterval(() => {
                set_max_seconds_before_close((prev)=>prev-1);
            }, 1000)
    },[open])

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="event success modal" maxWidth='lg'>
      <ModalTitle title='Event has been Created successfully!' close={handleClose} />
      <ModalBody>
        Event Created!!! 😄 <br></br>

      </ModalBody>
       <FlexBox justify='end'>
        <Button
          onClick={handleClose}
          variant='contained' size='small'
          sx={{ m: '1rem' }}
          disabled={max_seconds_before_close > 0}
        >
          {max_seconds_before_close > 0 ? max_seconds_before_close : "Continue"}
        </Button>
      </FlexBox> 
    </StandardModal>
  )
}

export default CreateEventSuccessModal