import { useState } from 'react';
import EventAPI from '../../../utils/EventAPIHelper';
import EmailAPI from '../../../utils/EmailAPIHelper';
import { fileToDataUrl } from '../../../utils/helpers';
import { StandardModal, ModalBody, ModalTitle } from '../../styles/modal/modal.styled';
import { FlexBox } from '../../styles/layouts.styled';
import { Button, TextField, Grid, styled } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const eventAPI = new EventAPI();
const emailAPI = new EmailAPI();
const evenTasticEmail = 'eventastic.comp9900@gmail.com'

const ImageHolder = styled(Button)`
  border: 1px solid black;
  cursor: pointer;
  height:100%;
  width:100%;
  max-height: 350px;
  max-width: 350px;
  ${({theme}) => theme.breakpoints.down("md")} {
    max-width: 100%;
  }
  background-color: ${({ theme }) => theme.palette.evenTastic.dull};
`

const Image = styled('img')`
  max-height: 100%;
  max-width: 100%;
`

const UpdateEventModal = ({ open, setOpen, managedEventDetails, setManagedEventDetails, setSuccessModal }) => {

  const [imgUpload, setImageUpload] = useState(false);

  const handleImage = async (event) => {
    const imageFile = event.target.files[0]
    const imageBlob = await fileToDataUrl(imageFile)
    setImageUpload(imageBlob)
  }

  const [formErrors, setFormErrors] = useState({
    event_title: false,
    event_short_desc: false,
    event_desc: false,
    event_location: false
  })

  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const event_title = data.get('event_title')
    const event_short_desc = data.get('event_short_desc')
    const event_desc = data.get('event_desc')
    const event_location = data.get('event_location')

    formErrors.error = false;

    if (!event_title) {
      setFormErrors(prevState => { return { ...prevState, event_title: true } })
      formErrors.error = true
    }

    if (!event_short_desc) {
      setFormErrors(prevState => { return { ...prevState, event_short_desc: true } })
      formErrors.error = true
    }

    if (!event_desc) {
      setFormErrors(prevState => { return { ...prevState, event_desc: true } })
      formErrors.error = true
    }

    if (!event_location) {
      setFormErrors(prevState => { return { ...prevState, event_location: true } })
      formErrors.error = true
    }

    if (!formErrors.error) {
      try {
        const updatedEvent = {
          event_title: event_title,
          event_short_desc: event_short_desc,
          event_desc: event_desc,
          event_location: event_location,
          event_img: imgUpload ? imgUpload : managedEventDetails.event_img
        }
        const eventResponse = await eventAPI.putEvent(managedEventDetails.event_id, updatedEvent)
        setManagedEventDetails(prevState => { return { ...prevState, ...updatedEvent } })
        handleClose(true)
        setSuccessModal(true)

        // send Event Updated Email notifiction
        const param = {
          'event_id': managedEventDetails.event_id,
          'booking_status': 'Booked'
        }
        const bookingRes = await eventAPI.getBookings(param)
        const emailsToBroadcast = bookingRes.data.map((booking) => ({ email_address: booking.booking_email }))
        
        if (emailsToBroadcast.length > 0) {
          const sendgridBroadcast = {
            email_subject: "Your Event Details have been Updated",
            email_content: emailAPI.format_event_updated_email(eventResponse.data),
            email_from: {
              email_address: evenTasticEmail,
              name: "EvenTastic"
            },
            email_to: emailsToBroadcast
          }
          const emailRes = await emailAPI.postEmails(sendgridBroadcast)
        }
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="Update Event Modal" maxWidth='lg'>
      <ModalTitle title='Update Event Details' close={handleClose} />
      <ModalBody id='form' component="form" noValidate onSubmit={handleSubmit}>
      <Grid item sm={12} md={5}>
          <ImageHolder component='label'>
            <input
              hidden type="file" name="eventPicture"
              id="eventPicture" label="eventPicture" onChange={handleImage}
            />
            {(() => {
              if (managedEventDetails.event_img && !imgUpload) {
                return (
                  <Image
                    src={managedEventDetails.event_img}
                    alt="Event picture"
                    width="100%"
                  />
                )
              } else if (imgUpload) {
                return (
                  <Image
                    src={imgUpload}
                    alt="Event picture"
                    width="100%"
                  />
                )
              } else {
                return (
                  <AddAPhotoIcon fontSize='large' color='disabled' sx={{ mt: '100%' }} />
                )
              }
            })()}

          </ImageHolder>
        </Grid>
        <br></br>
        <TextField
          name="event_title"
          required
          fullWidth
          id="event_title"
          label="Event Title"
          defaultValue={managedEventDetails.event_title}
          onChange={() => {
            formErrors.event_title && setFormErrors(prevState => { return { ...prevState, event_title: false } })
          }}
          error={formErrors.event_title}
          helperText={formErrors.event_title ? 'Cannot be empty' : ''}
          sx={{ mb: 2 }}
        />
        <TextField
          name="event_short_desc"
          required
          fullWidth
          id="event_short_desc"
          label="Event Short Description"
          defaultValue={managedEventDetails.event_short_desc}
          onChange={() => {
            formErrors.event_short_desc && setFormErrors(prevState => { return { ...prevState, event_short_desc: false } })
          }}
          error={formErrors.event_short_desc}
          helperText={formErrors.event_short_desc ? 'Cannot be empty' : ''}
          sx={{ mb: 2 }}
        />
        <TextField
          name="event_location"
          required
          fullWidth
          id="event_location"
          label="Event Location"
          defaultValue={managedEventDetails.event_location}
          onChange={() => {
            formErrors.event_location && setFormErrors(prevState => { return { ...prevState, event_location: false } })
          }}
          error={formErrors.event_location}
          helperText={formErrors.event_location ? 'Cannot be empty' : ''}
          sx={{ mb: 2 }}
        />
        <TextField
          name="event_desc"
          required
          fullWidth
          id="event_desc"
          label="Event Overview"
          defaultValue={managedEventDetails.event_desc}
          multiline
          rows={5}
          onChange={() => {
            formErrors.event_desc && setFormErrors(prevState => { return { ...prevState, event_desc: false } })
          }}
          error={formErrors.event_desc}
          helperText={formErrors.event_desc ? 'Cannot be empty' : ''}
          sx={{ mb: 2 }}
        />
      </ModalBody>
      <FlexBox justify='space-between'>
        <Button onClick={handleClose}
          variant='contained' size='small'
          sx={{ backgroundColor: 'evenTastic.dull', m: '1rem' }}
        >
          Nevermind
        </Button>
        <Button
          variant='contained' size='small' color='success'
          type='submit' form='form' sx={{ m: '1rem' }}
        >
          Update
        </Button>

      </FlexBox>
    </StandardModal>
  )
}

export default UpdateEventModal