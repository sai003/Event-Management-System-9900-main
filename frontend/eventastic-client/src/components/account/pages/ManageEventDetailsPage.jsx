import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollContainer } from '../../../components/styles/layouts.styled'
import BroadcastModal from '../../event/modals/BroadcastModal';
import BroadcastSentModal from '../../event/modals/BroadcastSentModal';
import BroadcastFailedModal from '../../event/modals/BroadcastFailedModal';
import UpdateEventModal from '../../event/modals/UpdateEventModal';
import UpdateEventSuccessModal from '../../event/modals/UpdateEventSuccessModal';
import CancelEventModal from '../../event/modals/CancelEventModal';
import CancelEventSuccessModal from '../../event/modals/CancelEventSuccessModal';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';


// formating for the Grid Items 
export const GridItem = styled(Paper)`
  border: 1px solid black;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;  
`;

// code to format the Date Time
const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

function formatDate(datetime) {
  let d = new Date(datetime);
  return d.toLocaleDateString("en-US", dateFormat)
}

function formatEventPrice(gen, front, mid, back) {
  let formatted = ""
  if (parseInt(gen) >= 0) {
    formatted = formatted + "General: $" + gen + " "
  } 
  if (parseInt(front) >= 0)  {
    formatted = formatted + "Front: $" + front + " "
  } 
  if (parseInt(mid) >= 0)  {
    formatted = formatted + "Middle: $" + mid + " "
  } 
  if (parseInt(back) >= 0)  {
    formatted = formatted + "Back: $" + back + " "
  }
  return formatted
}

const ManageEventDetailsPage = ({ managedEventDetails, setManagedEventDetails, changePage }) => {
  const navigate = useNavigate();
  const [openSentModal, setSentModal] = useState(false)
  const [openFailModal, setFailModal] = useState(false)
  const [openBroadcast, setOpenBroadcast] = useState(false)
  const [openEventUpdateModal, setOpenEventUpdateModal] = useState(false)
  const [openEventUpdateSuccessModal, setOpenEventUpdateSuccessModal] = useState(false)
  const [openCancelEventModal, setOpenCancelEventModal] = useState(false)
  const [openCancelEventSuccessModal, setOpenCancelEventSuccessModal] = useState(false)

  return (
    <ScrollContainer thin pr='1vw'>
      {managedEventDetails.event_status === "Cancelled"
        ? 
          <Typography gutterBottom variant="h4" component="div">
            This Event has been Cancelled.
          </Typography>
        : 
          <Grid container spacing={1}>
            <Grid item xs={6} md={6}>
              <div>
                <img
                  src={managedEventDetails.event_img.length<70 ? process.env.PUBLIC_URL + '/img/event/' + managedEventDetails.event_img : managedEventDetails.event_img}
                  width="100%"
                  alt="A visulaisation of the Event"
                >
                </img>
              </div>
            </Grid>
            <Grid item xs={6} md={6}>
              <GridItem>
                <Typography gutterBottom variant="h4" component="div">
                  {managedEventDetails.event_title}
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                  <b>Where is it?</b><br></br>{managedEventDetails.event_location}
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                  <b>When does it start?</b><br></br>{formatDate(managedEventDetails.event_start_datetime)}
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                  <b>When does it end?</b><br></br>{formatDate(managedEventDetails.event_end_datetime)}
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                  <b>What is the price range?</b><br></br>
                  {formatEventPrice(
                  managedEventDetails.gen_seat_price, 
                  managedEventDetails.front_seat_price, 
                  managedEventDetails.mid_seat_price,
                  managedEventDetails.back_seat_price)} 
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained" href="#contained-buttons" color="success" fullWidth
                      onClick={() => setOpenEventUpdateModal(true)}
                    >
                      Update Event
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained" href="#contained-buttons" color="primary" fullWidth
                      onClick={() => setOpenBroadcast(true)}
                    >
                      Message All
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="contained" href="#contained-buttons" color="warning" fullWidth
                      onClick={() => navigate(`/event/${managedEventDetails.event_id}`, { state: { redirect: 'reviews' } })}
                    >
                      Event Reviews 
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="contained" href="#contained-buttons" color="error" fullWidth
                      onClick={() => setOpenCancelEventModal(true)}
                    >
                      Cancel Event
                    </Button>
                  </Grid>
                </Grid>
              </GridItem>
            </Grid>
            <Grid item xs={12} md={12}>
              <GridItem>
                <Typography gutterBottom variant="h4" component="div">
                  Overview:
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                  {managedEventDetails.event_desc}
                </Typography>
              </GridItem>
            </Grid>
            <Grid item xs={12} md={12}>
              <GridItem>
                <Typography gutterBottom variant="h4" component="div">
                  Tags:
                </Typography>
                <Stack direction="row" spacing={2}>
                  {managedEventDetails.tags?.map(function (tag, i) {
                    return (
                      <Chip
                        key={i}
                        label={tag.name}
                      />
                    );
                  })}
                </Stack>
              </GridItem>
            </Grid>
          </Grid>
      }
      <BroadcastModal
        open={openBroadcast}
        setOpen={setOpenBroadcast}
        managedEventDetails={managedEventDetails}
        setSuccessModal={setSentModal}
        setFailModal={setFailModal}
      />
      <BroadcastSentModal
        open={openSentModal}
        setOpen={setSentModal}
        managedEventDetails={managedEventDetails}
      />
      <BroadcastFailedModal
        open={openFailModal}
        setOpen={setFailModal}
        managedEventDetails={managedEventDetails}
      />
      <UpdateEventModal
        open={openEventUpdateModal}
        setOpen={setOpenEventUpdateModal}
        managedEventDetails={managedEventDetails}
        setManagedEventDetails={setManagedEventDetails}
        setSuccessModal={setOpenEventUpdateSuccessModal}
      />
      <UpdateEventSuccessModal
        open={openEventUpdateSuccessModal}
        setOpen={setOpenEventUpdateSuccessModal}
      />
      <CancelEventModal
        open={openCancelEventModal}
        setOpen={setOpenCancelEventModal}
        managedEventDetails={managedEventDetails}
        setManagedEventDetails={setManagedEventDetails}
        setSuccessModal={setOpenCancelEventSuccessModal}
      />
      <CancelEventSuccessModal
        open={openCancelEventSuccessModal}
        setOpen={setOpenCancelEventSuccessModal}
      />
    </ScrollContainer>
  )
}

export default ManageEventDetailsPage