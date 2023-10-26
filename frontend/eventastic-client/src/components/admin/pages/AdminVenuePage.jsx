import { ScrollContainer } from '../../styles/layouts.styled';
import VenueAPI from "../../../utils/VenueAPIHelper";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText'
import Divider from '@mui/material/Divider';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import DialogActions from '@mui/material/DialogActions';
import OutlinedInput from '@mui/material/OutlinedInput';
import { fileToDataUrl } from '../../../utils/helpers';
import AdminVenueSuccessModal from './AdminVenueSuccessModal';

const Input = styled('input')({
  display:'none'
});

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const api = new VenueAPI();

const AdminVenueScreen = () => {
  const [venueList, setVenueList] = useState([])
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageName, setImageName] = React.useState('');
  const [Front_seats,setFrontSeats] = React.useState('');
  const [Middle_seats,setMiddleSeats] = React.useState('');
  const [Back_seats,setBackSeats] = React.useState('');
  const [General_seats,setGeneralSeats] = React.useState('');
  const [venueSuccessModal, setVenueSuccessModal] = useState(false);
  const [formErrors, setformErrors] = React.useState({
    error: false,
    venue_title: false,
    venue_address: false,
    venue_desc: false,
    venue_image:false,
    seat_numerical_error:false,
    all_seats_filled : false
  })

  const handleCreate = () => {

    formErrors.error = false;
    formErrors.all_seats_filled = false;
    formErrors.seat_numerical_error = false;
    if (!/\S+/.test(name)) {
        setformErrors(prevState => { return { ...prevState, venue_title: true } })
        formErrors.error = true
    }

    if (!/\S+/.test(address)) {
        setformErrors(prevState => { return { ...prevState, venue_address: true } })
        formErrors.error = true
    }

    if (!/\S+/.test(desc)) {
        setformErrors(prevState => { return { ...prevState, venue_desc: true } })
        formErrors.error = true
    }

    if(imageName.length === 0) {
        setformErrors(prevState => { return { ...prevState, venue_image: true } })
        formErrors.error = true
    }

    if(Front_seats.length === 0 || Middle_seats.length===0 || Back_seats.length === 0 || General_seats === 0){
        setformErrors(prevState => { return { ...prevState, all_seats_filled: true } })
        formErrors.error = true
    }else{
      if(!/^[1-9][0-9]*$/.test(Front_seats) || !/^[1-9][0-9]*$/.test(Middle_seats) || !/^[1-9][0-9]*$/.test(Back_seats) || !/^[1-9][0-9]*$/.test(General_seats)){
        setformErrors(prevState => { return { ...prevState, seat_numerical_error: true } })
        formErrors.error = true
      }
    }

    if(formErrors.error === false){
      const data = {'seating':[{'seating_type':'general','seating_number':parseInt(General_seats)},{'seating_type':'front','seating_number':parseInt(Front_seats)},{'seating_type':'middle','seating_number':parseInt(Middle_seats)},{'seating_type':'back','seating_number':parseInt(Back_seats)}], 
                      'venue_name':name, 'venue_desc':desc, 'venue_address':address, 'venue_img':image}
      //console.log(data)
      
      api
        .addVenue(data)
        .then(() => {
          setName(''); setDesc(''); setAddress(''); setImage(''); setFrontSeats('');
          setMiddleSeats(''); setBackSeats('');setGeneralSeats(''); setImageName('');
          setVenueList([...venueList,data]);
          setOpen(false);
          setVenueSuccessModal(true);
        })
        .catch((err) => console.log(err));
    }
  }

  const onFileChange = async (event) => {
    
      // Update the state
      if(formErrors.venue_image)
        setformErrors(prevState => { return { ...prevState, venue_image: false } })
      const imageFile = event.target.files[0]
      const imageBlob = await fileToDataUrl(imageFile)
      setImageName(imageFile.name);
      //console.log(imageBlob)
      setImage(imageBlob);
      //console.log(image)
    };

  const handleChangeFront = (event) => {
    setFrontSeats(event.target.value);
  };

  const handleChangeMiddle = (event) => {
    setMiddleSeats(event.target.value);
  };

  const handleChangeBack = (event) => {
    setBackSeats(event.target.value);
  };

  const handleChangeGeneral = (event) => {
    setGeneralSeats(event.target.value);
  };

  const handleChangeAddress = (event) => {
    if(formErrors.venue_address)
      setformErrors(prevState => { return { ...prevState, venue_address: false } })
    setAddress(event.target.value);
  };

  const handleChangeDesc = (event) => {
    if(formErrors.venue_desc)
      setformErrors(prevState => { return { ...prevState, venue_desc: false } })
    setDesc(event.target.value);
  };

  const handleChangeName = (event) => {
    if(formErrors.venue_title)
      setformErrors(prevState => { return { ...prevState, venue_title: false } })
    setName(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    api
      .getVenueList()
      .then((response) => setVenueList(response.data))
      .catch((err) => console.log(err));
  }, [])


  return (
    <ScrollContainer thin>
      <Box sx={{ flexGrow: 1 }} style={{'marginLeft':'20px'}}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          style={{'marginLeft':'20px'}}
        >
          <Typography variant="h6" component="span" gutterBottom>
                All Venues
          </Typography>
          <Button variant="contained" size="small" color="success" onClick={handleClickOpen}>
              Create Venue
          </Button>
        </Stack>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Fill Venue Details</DialogTitle>
            <DialogContent>
                <Box
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 1 },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  
                    <FormControl style={{width:'50%'}} error={formErrors.venue_title}>
                      <InputLabel htmlFor="component-outlined">Name</InputLabel>
                      <OutlinedInput
                        id="component-outlined"
                        value={name}
                        onChange={handleChangeName}
                        label="Name"
                      />
                      {formErrors.venue_title && <FormHelperText>Please fill out Venue Name properly</FormHelperText> }
                    </FormControl>
                    <FormControl fullWidth style={{marginLeft:'10px'}} error={formErrors.venue_address}>
                      <InputLabel htmlFor="component-outlined">Address</InputLabel>
                      <OutlinedInput
                        id="component-outlined"
                        value={address}
                        onChange={handleChangeAddress}
                        label="Address"
                      />
                      {formErrors.venue_address && <FormHelperText>Please fill out Venue Address properly</FormHelperText> }
                    </FormControl>
                  
                  
                    <FormControl fullWidth error={formErrors.venue_desc}>
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Description"
                        multiline
                        rows={3}
                        value={desc}
                        onChange={handleChangeDesc}
                        fullWidth
                        error={formErrors.venue_desc}
                        helperText={formErrors.venue_desc ? 'Please fill out Venue Description properly' : ''}
                      />
                    </FormControl>
                  
                  
                    <FormControl fullWidth error={formErrors.venue_image}>
                      <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" type="file" onChange={onFileChange}/>
                        <Button variant="contained" component="span">
                          Upload Image
                        </Button>
                      </label>
                      <Typography variant="caption"  style={{marginLeft:'10px'}} gutterBottom>
                        {image && imageName}
                      </Typography>
                      {formErrors.venue_image && <FormHelperText>Please Upload a venue image</FormHelperText> }
                    </FormControl>
                  
                  <div style ={{'marginTop':'20px'}}>
                    <Typography variant="h6"  style={{marginTop:'10px'}}gutterBottom>
                      Venue Seatings
                    </Typography>
                  </div>
                  <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                    style ={{'marginTop':'10px'}}
                  >
                      <FormControl>
                        <InputLabel htmlFor="component-outlined">General Seats</InputLabel>
                        <OutlinedInput
                          id="component-outlined"
                          value={General_seats}
                          onChange={handleChangeGeneral}
                          label="General Seats"
                        />
                      </FormControl>

                      <FormControl>
                        <InputLabel htmlFor="component-outlined">Front Seats</InputLabel>
                        <OutlinedInput
                          id="component-outlined"
                          value={Front_seats}
                          onChange={handleChangeFront}
                          label="Front Seats"
                        />
                      </FormControl>
                    
                      <FormControl>
                        <InputLabel htmlFor="component-outlined">Middle Seats</InputLabel>
                        <OutlinedInput
                          id="component-outlined"
                          value={Middle_seats}
                          onChange={handleChangeMiddle}
                          label="Middle Seats"
                        />
                      </FormControl>
                    
                      <FormControl>
                        <InputLabel htmlFor="component-outlined">Back Seats</InputLabel>
                        <OutlinedInput
                          id="component-outlined"
                          value={Back_seats}
                          onChange={handleChangeBack}
                          label="Back Seats"
                        />
                      </FormControl>
                      
                  </Stack>
                  <FormControl error={formErrors.all_seats_filled || formErrors.seat_numerical_error}>
                      {formErrors.all_seats_filled ? <FormHelperText>All seat values are required</FormHelperText> :
                        formErrors.seat_numerical_error && <FormHelperText>Seat numbers must be in numerical format and must be greater than 0</FormHelperText>}
                  </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
        {
          venueList.map((venue,ind) => {
            return (
              <Card key={ind} sx={{ maxWidth: 450 }} style={{margin:'20px'}}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {venue.venue_name.toUpperCase().charAt(0)}
                    </Avatar>
                  }
                  title={venue.venue_name}
                  subheader={venue.venue_address}
                />
                {
                  venue.venue_img.length < 70 ?
                  <CardMedia
                    component="img"
                    height="194"
                    image={process.env.PUBLIC_URL + '/img/venues/' + venue.venue_img}
                    alt="Venue_img"
                  />
                  :
                  <CardMedia
                    component="img"
                    height="194"
                    image={venue.venue_img}
                    alt="Venue_img"
                  />
                }
                
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {venue.venue_desc}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Typography pvariant="body2" color="text.secondary">
                    Venue Seatings
                  </Typography>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Stack
                      direction="row"
                      divider={<Divider orientation="vertical" flexItem />}
                      spacing={2}
                    >
                      {
                        venue.seating.map((seating, idx) => {
                          return <Item key={idx}> {seating.seating_type.toUpperCase()} : {seating.seating_number}</Item>
                        })
                      }
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>
            )
          })
        }
        
      </Box>
      <AdminVenueSuccessModal
        open={venueSuccessModal}
        setOpen={setVenueSuccessModal}
        />
    </ScrollContainer>
  )
}

export default AdminVenueScreen