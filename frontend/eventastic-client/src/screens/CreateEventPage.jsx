import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import eventTags from '../event_tags'
import { StoreContext } from '../utils/context';
import OutlinedInput from '@mui/material/OutlinedInput';
import { pink } from '@mui/material/colors';
import VenueAPI from "../utils/VenueAPIHelper";
import EventAPI from "../utils/EventAPIHelper";
import { ScrollContainer } from '../components/styles/layouts.styled'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import NotHostErrorModal from "../components/event/modals/NotHostErrorModal";
import { fileToDataUrl } from '../utils/helpers';
import CreateEventSuccessModal from '../components/event/modals/CreateEventSuccessModal';
import {
  Button, Card, Checkbox,
  Grid,  Stack,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormControl, FormHelperText, Chip,
  Divider, Paper,
  Typography,
  styled,
} from '@mui/material';



// formating for the Grid Items 
export const GridItem = styled(Paper)`
  border: 1px solid black;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;  
`;

const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

function formatDate(datetime) {
  let d = new Date(datetime);
  return d.toLocaleDateString("en-US", dateFormat)
}

const steps = ['Basic Info', 'Details', 'Tickets','Preview/Submit'];
const Input = styled('input')({
    display:'none'
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const venue_api = new VenueAPI();
const event_api = new EventAPI();

const CreateEventPage = () => {
  const [venueList, setVenueList] = React.useState([])
  
  const [locationImg,setLocationImg] = React.useState("") 
  const [activeStep, setActiveStep] = React.useState(0);
  const context = React.useContext(StoreContext);
  const [hostDetails] = context.host;
  const [datevalue, setDateValue] = React.useState(new Date());
  const [enddatevalue, setEndDateValue] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [createEventSuccess,setCreateEventSuccess] = React.useState(false);
  const [seatCount, setSeatCount] = React.useState({
    gen_count:0, front_count:0,middle_count:0, back_count:0
  })
  const [seattype, setSeatType] = React.useState({
    gen_type:false, front_type:false,middle_type:false, back_type:false
  })
  const [formDetails, setFormDetails] = React.useState({
    event_title: "",
    event_category: "",
    event_tags: [],
    event_location: "",
    venue_id: null,
    event_start_datetime: "",
    event_end_datetime: "",
    event_short_desc: "",
    event_desc: "",
    event_img: "",
    gen_seat_price:"",
    front_seat_price:"",
    mid_seat_price:"",
    back_seat_price:"",
    event_status: "Upcoming",
    host_id: hostDetails.host_id,
    account_id: hostDetails.account_id
  });
  
  
  const [formErrors, setformErrors] = React.useState({
    error: false,
    event_title: false,
    event_category: false,
    event_tags: false,
    event_location: false,
    event_short_desc: false,
    event_desc: false,
    gen_seat_price:false,
    front_seat_price:false,
    mid_seat_price:false,
    back_seat_price:false,
    start_date_exist:false,
    end_date_exist: false,
    start_date_before_today: false,
    end_date_before_start:false
  })

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    //console.log(formDetails)
    //console.log(seatCount)
    formErrors.error = false;
    if(activeStep === 0)
    {
      formErrors.start_date_exist = false;
      formErrors.end_date_exist = false;
      formErrors.start_date_before_today = false;
      formErrors.end_date_before_start=false;
      if (!/\S+/.test(formDetails.event_title)) {
        setformErrors(prevState => { return { ...prevState, event_title: true } })
        formErrors.error = true
      }
      
      if (formDetails.event_category === "") {
        setformErrors(prevState => { return { ...prevState, event_category: true } })
        formErrors.error = true
      }
      
      if (formDetails.event_tags.length === 0) {
        setformErrors(prevState => { return { ...prevState, event_tags: true } })
        formErrors.error = true
      }
      
      if (formDetails.event_location === "") {
        setformErrors(prevState => { return { ...prevState, event_location: true } })
        formErrors.error = true
      }
      
      if (formDetails.event_start_datetime === "" || formDetails.event_end_datetime === "") {
        formErrors.error = true;
        if(formDetails.event_start_datetime === "")
          setformErrors(prevState => { return { ...prevState, start_date_exist: true } })

        if(formDetails.event_end_datetime === "")
          setformErrors(prevState => { return { ...prevState, end_date_exist: true } })
      }else{
        var start_d = new Date(formDetails.event_start_datetime);
        var end_d = new Date(formDetails.event_end_datetime);
        var now_d = new Date();
        if(start_d <= now_d){
          setformErrors(prevState => { return { ...prevState, start_date_before_today: true } })
          formErrors.error = true;
        }

        if(end_d <= start_d){
          setformErrors(prevState => { return { ...prevState, end_date_before_start: true } })
          formErrors.error = true;
        }
      }
    
    }
    else if(activeStep === 1)
    {
      if (!/\S+/.test(formDetails.event_desc)) {
        setformErrors(prevState => { return { ...prevState, event_desc: true } })
        formErrors.error = true
      }

      if (!/\S+/.test(formDetails.event_short_desc)) {
        setformErrors(prevState => { return { ...prevState, event_short_desc: true } })
        formErrors.error = true
      }

      
    }
    else if(activeStep === 2)
    {
      if(!seattype.gen_type && !seattype.front_type && !seattype.middle_type && !seattype.back_type)
      {
        alert("Please select atleast one ticket type")
        formErrors.error = true
      }
      
      if(seattype.gen_type && !/^[0-9]*\.?[0-9]+$/.test(formDetails.gen_seat_price)){
        setformErrors(prevState => { return { ...prevState, gen_seat_price: true } })
        formErrors.error = true
      }

      if(seattype.front_type && !/^[0-9]*\.?[0-9]+$/.test(formDetails.front_seat_price)){
        setformErrors(prevState => { return { ...prevState, front_seat_price: true } })
        formErrors.error = true
      }

      if(seattype.middle_type && !/^[0-9]*\.?[0-9]+$/.test(formDetails.mid_seat_price)){
        setformErrors(prevState => { return { ...prevState, mid_seat_price: true } })
        formErrors.error = true
      }

      if(seattype.back_type && !/^[0-9]*\.?[0-9]+$/.test(formDetails.back_seat_price)){
        setformErrors(prevState => { return { ...prevState, back_seat_price: true } })
        formErrors.error = true
      }
      
    }
    
    if(!formErrors.error)
    {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
      
  }

  const handleSubmit = () => {
    //console.log(formDetails)
    var data = {"account_id":parseInt(formDetails.account_id),
                "back_seat_price":formDetails.back_seat_price===""?-1:parseFloat(formDetails.back_seat_price),
                "event_category":formDetails.event_category,
            "event_desc":formDetails.event_desc,"event_end_datetime":formDetails.event_end_datetime,"event_img":formDetails.event_img,
            "event_location":formDetails.event_location,"event_short_desc":formDetails.event_short_desc,"event_start_datetime":formDetails.event_start_datetime,
            "event_status":formDetails.event_status, "event_title":formDetails.event_title,
            "front_seat_price":formDetails.front_seat_price===""?-1:parseFloat(formDetails.front_seat_price),
            "gen_seat_price":formDetails.gen_seat_price===""?-1:parseFloat(formDetails.gen_seat_price),
            "mid_seat_price":formDetails.mid_seat_price===""?-1:parseFloat(formDetails.mid_seat_price),
            "host_id":parseInt(formDetails.host_id),
            "venue_id":formDetails.venue_id}
    data = {...data,"tags":formDetails.event_tags.map((tag_name)=>{
      return {"name":tag_name}
    })}
    //console.log(data)
    
    event_api
      .postEvent(data)
      .then((response) => {
        //console.log(response)
        //alert("Successfully Event is created done")
        setCreateEventSuccess(true);
      })
      .catch((err) => console.log(err));
      
  }

  React.useEffect(() => {
    if (!hostDetails || hostDetails.host_status !== 'Approved') {
      setOpen(true)
    }
    else{
      venue_api
      .getVenueList()
      .then((response) => { setVenueList(response.data);})
      .catch((err) => console.log(err));
    }
    
  }, [])

  //console.log(formDetails.event_tags)

  return (
    <Box sx={{ flexGrow: 1, paddingLeft:'15%',paddingRight:'15%' }}>
        <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
              {
                  activeStep === 0 ?
                      <Grid container direction='column'>
                        <Grid item sx={{width:'50%',margin:'25px',marginBottom:'1px'}}>
                          <TextField
                            name="event_title"
                            required
                            fullWidth
                            value={formDetails.event_title}
                            id="event_title"
                            label="Event Title"
                            autoFocus
                            onChange={(event) => {
                              setFormDetails(prevState => { return {...prevState, event_title: event.target.value}}) 
                              if(formErrors.event_title === true){
                                setformErrors(prevState => { return { ...prevState, event_title: false } })
                              }
                              
                            }}
                            error={formErrors.event_title}
                            helperText={formErrors.event_title ? 'Title can only have alphabets,spaces and apostrophes' : ''}
                          />
                        </Grid>
                        <Grid item sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <TextField
                            name="org_name"
                            fullWidth
                            id="org_name"
                            label="Organisation Name"
                            autoFocus
                            defaultValue={hostDetails.org_name}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item xs={4}>
                            <FormControl fullWidth error={formErrors.event_category}>
                              <InputLabel id="Category-label">Category</InputLabel>
                              <Select
                                labelId="Category-label"
                                id="Category"
                                value={formDetails.event_category}
                                label="Category"
                                onChange={(event)=>{
                                  setFormDetails((prevState)=>{return {...prevState,event_category:event.target.value,event_tags:[]}})
                                  if(formErrors.event_category === true){
                                    setformErrors(prevState => { return { ...prevState, event_category: false } })
                                  }
                                  
                      
                                }}
                              >
                                {
                                  eventTags.eventCategories.map((category,i)=>{
                                    return <MenuItem key={i} value={category}>{category}</MenuItem>
                                  })
                                }
    
                              </Select> 
                              {formErrors.event_category && <FormHelperText>Please choose a Category</FormHelperText> }
                            </FormControl>
                          </Grid>
                          <Grid item xs={1}></Grid>
                          <Grid item xs={6}>
                            {
                              formDetails.event_category && 
                            <FormControl fullWidth error={formErrors.event_tags}>
                              <InputLabel id="tags-label">Tags</InputLabel>
                              <Select
                                labelId="tags-label"
                                id="tags-chip"
                                multiple
                                value={formDetails.event_tags}
                                onChange={(event)=>{
                                  //console.log('TEST')
                                  const {
                                    target: { value },
                                  } = event;
                                  setFormDetails((prevState)=>{return {...prevState,event_tags:typeof value === 'string' ? value.split(',') : value}})
                                  if(formErrors.event_tags === true){
                                    setformErrors(prevState => { return { ...prevState, event_tags: false } })
                                  }
                                  
                                }}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value,index) => (
                                      <Chip key={index} label={value} />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                              >
                                {
                                  eventTags.eventTagsByCategory.filter((cat)=>cat.cat_name === formDetails.event_category)[0].tags.map((tag,ind)=>{
                                    return <MenuItem key={ind} value={tag.tag_name}>{tag.tag_name}</MenuItem>
                                  })
                                }
                                
                              </Select>
                              {formErrors.event_tags && <FormHelperText>Select atleast one tag</FormHelperText> }
                            </FormControl>
                            }
                          </Grid>
                        </Grid>

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item xs={3} style={{paddingTop:"10px"}}>
                            <Typography variant="subtitle1" gutterBottom component="div" >
                              Select Event Venue:
                            </Typography>
                          </Grid>
                          <Grid item xs={7}>
                            <FormControl fullWidth error={formErrors.event_location}>
                              <InputLabel id="venue-label">Venues</InputLabel>
                              <Select
                                labelId="venue-label"
                                id="Venue"
                                value={formDetails.event_location}
                                label="Venue"
                                onChange={(event)=>{
                                  var val = event.target.value
                                  //console.log(val)

                                  var selected_venue = venueList.filter((venue)=>venue.venue_name === val)[0]
                                  //console.log(selected_venue)
                                  selected_venue.seating.map((seat)=>{
                                    if(seat.seating_type.toLowerCase() === 'general') setSeatCount((prev)=>{return {...prev,gen_count:seat.seating_number}})
                                    else if(seat.seating_type.toLowerCase() === 'front') setSeatCount((prev)=>{return {...prev,front_count:seat.seating_number}})
                                    else if(seat.seating_type.toLowerCase() === 'middle') setSeatCount((prev)=>{return {...prev,middle_count:seat.seating_number}})
                                    else if(seat.seating_type.toLowerCase() === 'back') setSeatCount((prev)=>{return {...prev,back_count:seat.seating_number}})
                                    return seat;
                                  })
                                  setFormDetails((prevState)=>{return {...prevState,event_location:selected_venue.venue_name,venue_id:selected_venue.venue_id}})
                                  if(formErrors.event_location === true){
                                    setformErrors(prevState => { return { ...prevState, event_location: false } })
                                  }
                                  setLocationImg(selected_venue.venue_img)
                                }}
                              >
                                {
                                  venueList.map((venue)=>{
                                    return <MenuItem value={venue.venue_name} key={venue.venue_id}>
                                      {venue.venue_name}
                                      </MenuItem>
                                  })
                                  
                                }
    
                              </Select> 
                              {formErrors.event_location && <FormHelperText>Please choose a Location</FormHelperText> }
                            </FormControl>
                          </Grid>
                        </Grid>

                        {
                          locationImg!=="" &&
                            <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                              <Grid item xs={3}></Grid>
                              <Grid item>
                                {
                                  locationImg.length < 70 ?
                                  <img
                                    src={process.env.PUBLIC_URL + '/img/venues/' + locationImg}
                                    alt={"Venue Not Loaded"}
                                    loading="lazy"
                                    width='300px'
                                    height='250px'
                                  /> :
                                  <img
                                    src={locationImg}
                                    alt={"Venue Not Loaded"}
                                    loading="lazy"
                                    width='300px'
                                    height='250px'
                                  />
                                }
                                
                              </Grid>
                            </Grid>
                        }

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item xs={3} style={{paddingTop:"10px"}}>
                            <Typography variant="subtitle1" gutterBottom component="div" >
                              Select Start DateTime:
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DateTimePicker
                                renderInput={(props) => <TextField {...props} />}
                                label="DateTimePicker"
                                value={datevalue}
                                onChange={(newValue) => {
                                  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                                  var localISOTime = (new Date(newValue - tzoffset)).toISOString().slice(0, -5);
                                  setDateValue(newValue);
                                  setFormDetails((prevState)=>{return {...prevState,event_start_datetime: localISOTime+"+10:00"}})
                                  setEndDateValue(newValue)
                                }}
                              />
                            </LocalizationProvider>
                            
                          </Grid>
                          <Grid item xs={4}>
                                <FormControl error={formErrors.start_date_exist || formErrors.start_date_before_today } style={{marginTop:"10%"}}>
                                { 
                                  formErrors.start_date_exist ?  <FormHelperText>Please Select Event Start Date</FormHelperText> :
                                  formErrors.start_date_before_today && <FormHelperText>Please Select a future start date for the event</FormHelperText>
                                }
                              </FormControl>
                          </Grid>
                        </Grid>
                        
                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item xs={3} style={{paddingTop:"10px"}}>
                            <Typography variant="subtitle1" gutterBottom component="div" >
                              Select End DateTime:
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DateTimePicker
                                renderInput={(props) => <TextField {...props} />}
                                label="DateTimePicker"
                                value={enddatevalue}
                                onChange={(newValue) => {
                                  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                                  var localISOTime = (new Date(newValue - tzoffset)).toISOString().slice(0, -5);
                                  setEndDateValue(newValue);
                                  setFormDetails((prevState)=>{return {...prevState,event_end_datetime: localISOTime+"+10:00"}})
                                }}
                              />
                            </LocalizationProvider>
                            
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl error={formErrors.end_date_exist || formErrors.end_date_before_start} style={{marginTop:"10%"}}>
                          { 
                            formErrors.end_date_exist ? <FormHelperText>Please Select Event End Date</FormHelperText> :
                            formErrors.end_date_before_start && <FormHelperText> Event's end date should come after start date</FormHelperText>
                          }
                        </FormControl>
                          </Grid>
                        </Grid>
                        
                      </Grid> 
                :     
                activeStep === 1 ?
                      <Grid container direction='column'>
                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item xs={3} style={{paddingTop:"10px"}}>
                            <Typography variant="subtitle1" gutterBottom component="div" >
                              Add Event Image:
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item xs={4}>
                            <label htmlFor="contained-button-file">
                              <Input accept="image/*" id="contained-button-file" type="file" onChange={async (e)=>{
                                const imageFile = e.target.files[0]
                                const imageBlob = await fileToDataUrl(imageFile)   
                                setFormDetails((prevState)=>{return {...prevState,event_img: imageBlob}})                   
                              }}/>
                              <Button variant="contained" component="span">
                                Upload Image
                              </Button>
                            </label>
                          </Grid>
                          <Grid item xs={4}>
                           {
                            formDetails.event_img !== "" &&
                            <img
                                    src={formDetails.event_img}
                                    alt={"Event Not Loaded"}
                                    loading="lazy"
                                    width='300px'
                                    height='250px'
                                  />
                           }
                          </Grid>
                        </Grid>

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item xs={3} style={{paddingTop:"10px"}}>
                            <Typography variant="subtitle1" gutterBottom component="div" >
                              Event Details:
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <TextField
                            name="event_short_desc"
                            required
                            fullWidth
                            value={formDetails.event_short_desc}
                            id="event_short_desc"
                            label="Event Summary"
                            autoFocus
                            onChange={(event) => {
                              setFormDetails(prevState => { return {...prevState, event_short_desc: event.target.value}}) 
                              if(formErrors.event_short_desc === true){
                                setformErrors(prevState => { return { ...prevState, event_short_desc: false } })
                              }
                              
                            }}
                            error={formErrors.event_short_desc}
                            helperText={formErrors.event_short_desc ? 'Summary field is required' : ''}
                          />
                        </Grid>

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <TextField
                            name="event_desc"
                            required
                            fullWidth
                            value={formDetails.event_desc}
                            id="event_desc"
                            label="Event Description"
                            autoFocus
                            multiline
                            rows={5}
                            onChange={(event) => {
                              setFormDetails(prevState => { return {...prevState, event_desc: event.target.value}}) 
                              if(formErrors.event_desc === true){
                                setformErrors(prevState => { return { ...prevState, event_desc: false } })
                              }
                              
                            }}
                            error={formErrors.event_desc}
                            helperText={formErrors.event_desc ? 'Description field is required' : ''}
                          />
                        </Grid>
                      </Grid>
                       
                  : 
                  activeStep === 2 ?
                      <Grid container direction='column'>
                      
                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item style={{paddingTop:"10px"}}>
                            <Typography variant="h5" gutterBottom component="div" >
                              Ticket Details:
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px',marginTop:'1px'}}>
                            <Grid item >
                              <Typography variant="body1" gutterBottom component="div" >
                                Please select the type of Tickets you want to publish and set the price for your Tickets:
                              </Typography>
                            </Grid>
                        </Grid>

                        <Divider />

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'0px',marginTop:'1px'}}>
                          <Grid item style={{paddingTop:"1px"}}>
                            <Checkbox checked={seattype.gen_type} sx={{color: pink[800],'&.Mui-checked': {color: pink[600],},}} 
                            onChange={(event)=>{
                              setSeatType((prev)=>{return {...prev,gen_type:event.target.checked}}) 
                              if(!event.target.checked)
                                setFormDetails(prevState => { return {...prevState, gen_seat_price: ""}}) 
                              else
                                setFormDetails(prevState => { return {...prevState, gen_seat_price: "0"}}) 
                            
                            }}
                            />
                          </Grid>
                          <Grid item xs={2} style={{paddingTop:"10px"}}>
                            <Typography variant="body1" gutterBottom component="div" >
                                General Type
                            </Typography>
                          </Grid>

                          <Grid item style={{paddingTop:"1px"}}>
                            <Checkbox checked={seattype.front_type} sx={{color: pink[800],'&.Mui-checked': {color: pink[600],},}} 
                            onChange={(event)=>{
                              setSeatType((prev)=>{return {...prev,front_type:event.target.checked}}) 
                              if(!event.target.checked)
                                setFormDetails(prevState => { return {...prevState, front_seat_price: ""}}) 
                              else
                                setFormDetails(prevState => { return {...prevState, front_seat_price: "0"}}) 
                            }}
                            />
                          </Grid>
                          <Grid item xs={2} style={{paddingTop:"10px"}}>
                            <Typography variant="body1" gutterBottom component="div" >
                                Front Type
                            </Typography>
                          </Grid>

                          <Grid item style={{paddingTop:"1px"}}>
                            <Checkbox checked={seattype.middle_type} sx={{color: pink[800],'&.Mui-checked': {color: pink[600],},}} 
                            onChange={(event)=>{
                              setSeatType((prev)=>{return {...prev,middle_type:event.target.checked}}) 
                              if(!event.target.checked)
                                setFormDetails(prevState => { return {...prevState, mid_seat_price: ""}})
                              else
                                setFormDetails(prevState => { return {...prevState, mid_seat_price: "0"}})
                            }}
                            />
                          </Grid>
                          <Grid item xs={2} style={{paddingTop:"10px"}}>
                            <Typography variant="body1" gutterBottom component="div" >
                                Middle Type
                            </Typography>
                          </Grid>

                          <Grid item style={{paddingTop:"1px"}}>
                            <Checkbox checked={seattype.back_type} sx={{color: pink[800],'&.Mui-checked': {color: pink[600],},}} 
                            onChange={(event)=>{
                              setSeatType((prev)=>{return {...prev,back_type:event.target.checked}}) 
                              if(!event.target.checked)
                                setFormDetails(prevState => { return {...prevState, back_seat_price: ""}})
                              else
                                setFormDetails(prevState => { return {...prevState, back_seat_price: "0"}})
                            }}
                            />
                          </Grid>
                          <Grid item xs={2} style={{paddingTop:"10px"}}>
                            <Typography variant="body1" gutterBottom component="div" >
                                Back Type
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'0px',marginTop:'1px'}}>
                          { seattype.gen_type &&
                            <Grid item xs={3} style={{paddingTop:"10px", marginLeft:"20px"}}>
                              <Card style={{padding:'10px'}}>
                                <Typography variant="h7" component="div" style={{margin:"5px"}}>
                                  General Ticket Details
                                </Typography>
                                <Divider style={{marginBottom:'20px'}}/>
                                <TextField
                                  name="SeatCount"
                                  fullWidth
                                  id="SeatCount"
                                  label="Seat Count"
                                  autoFocus
                                  defaultValue={seatCount.gen_count}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  style={{marginBottom:'20px'}}
                                />
                                <TextField
                                  name="Price_Per_ticket"
                                  required
                                  fullWidth
                                  value={formDetails.gen_seat_price}
                                  id="Price_Per_ticket"
                                  label="Price per Ticket"
                                  autoFocus
                                  onChange={(event) => {
                                    setFormDetails(prevState => { return {...prevState, gen_seat_price: event.target.value}}) 
                                    if(formErrors.gen_seat_price === true){
                                      setformErrors(prevState => { return { ...prevState, gen_seat_price: false } })
                                    }
                                    
                                  }}
                                  error={formErrors.gen_seat_price}
                                  helperText={formErrors.gen_seat_price ? 'Only numerical format for prices is allowed' : ''}
                                />
                              </Card>
                            </Grid>
                            }

                            { seattype.front_type &&
                            <Grid item xs={3} style={{paddingTop:"10px", marginLeft:"20px"}}>
                              <Card style={{padding:'10px'}}>
                                <Typography variant="h7" component="div" style={{margin:"5px"}}>
                                  Front Seat Ticket Details
                                </Typography>
                                <Divider style={{marginBottom:'20px'}}/>
                                <TextField
                                  name="FrontSeatCount"
                                  fullWidth
                                  id="FrontSeatCount"
                                  label="Front Seat Count"
                                  autoFocus
                                  defaultValue={seatCount.front_count}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  style={{marginBottom:'20px'}}
                                />
                                <TextField
                                  name="Price_Per_ticket"
                                  required
                                  fullWidth
                                  value={formDetails.front_seat_price}
                                  id="Price_Per_ticket"
                                  label="Price per Ticket"
                                  autoFocus
                                  onChange={(event) => {
                                    setFormDetails(prevState => { return {...prevState, front_seat_price: event.target.value}}) 
                                    if(formErrors.front_seat_price === true){
                                      setformErrors(prevState => { return { ...prevState, front_seat_price: false } })
                                    }
                                    
                                  }}
                                  error={formErrors.front_seat_price}
                                  helperText={formErrors.front_seat_price ? 'Only numerical format for prices is allowed' : ''}
                                />
                              </Card>
                            </Grid>
                            }
                            { seattype.middle_type &&
                            <Grid item xs={3} style={{paddingTop:"10px", marginLeft:"20px"}}>
                              <Card style={{padding:'10px'}}>
                                <Typography variant="h7" component="div" style={{margin:"5px"}}>
                                  Middle Seat Ticket Details
                                </Typography>
                                <Divider style={{marginBottom:'20px'}}/>
                                <TextField
                                  name="MiddleSeatCount"
                                  fullWidth
                                  id="MiddleSeatCount"
                                  label="Middle Seat Count"
                                  autoFocus
                                  defaultValue={seatCount.middle_count}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  style={{marginBottom:'20px'}}
                                />
                                <TextField
                                  name="Price_Per_ticket"
                                  required
                                  fullWidth
                                  value={formDetails.mid_seat_price}
                                  id="Price_Per_ticket"
                                  label="Price per Ticket"
                                  autoFocus
                                  onChange={(event) => {
                                    setFormDetails(prevState => { return {...prevState, mid_seat_price: event.target.value}}) 
                                    if(formErrors.mid_seat_price === true){
                                      setformErrors(prevState => { return { ...prevState, mid_seat_price: false } })
                                    }
                                    
                                  }}
                                  error={formErrors.mid_seat_price}
                                  helperText={formErrors.mid_seat_price ? 'Only numerical format for prices is allowed' : ''}
                                />
                              </Card>
                            </Grid>
                            }

                            { seattype.back_type &&
                            <Grid item xs={3} style={{paddingTop:"10px", marginLeft:"20px"}}>
                              <Card style={{padding:'10px'}}>
                                <Typography variant="h7" component="div" style={{margin:"5px"}}>
                                  Back Seat Ticket Details
                                </Typography>
                                <Divider style={{marginBottom:'20px'}}/>
                                <TextField
                                  name="BackSeatCount"
                                  fullWidth
                                  id="BackSeatCount"
                                  label="Back Seat Count"
                                  autoFocus
                                  defaultValue={seatCount.back_count}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  style={{marginBottom:'20px'}}
                                />
                                <TextField
                                  name="Price_Per_ticket"
                                  required
                                  fullWidth
                                  value={formDetails.back_seat_price}
                                  id="Price_Per_ticket"
                                  label="Price per Ticket"
                                  autoFocus
                                  onChange={(event) => {
                                    setFormDetails(prevState => { return {...prevState, back_seat_price: event.target.value}}) 
                                    if(formErrors.back_seat_price === true){
                                      setformErrors(prevState => { return { ...prevState, back_seat_price: false } })
                                    }
                                    
                                  }}
                                  error={formErrors.back_seat_price}
                                  helperText={formErrors.back_seat_price ? 'Only numerical format for prices is allowed' : ''}
                                />
                              </Card>
                            </Grid>
                            }
                        </Grid>

                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'0px',marginTop:'1px'}}>
                          <Grid item xs={5} style={{paddingTop:"10px"}}>
                            
                          </Grid>
                        </Grid>
                      </Grid>
                  :
                  
                  activeStep === 3 &&
                      <Grid container direction='column'>
                      
                        <Grid container direction='row' sx={{width:'100%',margin:'25px',marginBottom:'1px'}}>
                          <Grid item style={{paddingTop:"10px"}}>
                            <Typography variant="h5" gutterBottom component="div" >
                              Preview your Event:
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <ScrollContainer thin pr='1vw' style={{marginLeft:"30px",marginRight:"30px"}}>
                          <Grid container spacing={1}>
                            <Grid item xs={6} md={6}>
                              <div>
                                <img
                                  src={formDetails.event_img}
                                  width="100%"
                                  alt="No Photo for this event yet"
                                >
                                </img>
                              </div>
                            </Grid>
                            <Grid item xs={6} md={6}>
                              <GridItem>
                                <Typography gutterBottom variant="h4" component="div">
                                  {formDetails.event_title}
                                </Typography>
                                <Typography gutterBottom variant="body1" component="div">
                                  <b>Where is it?</b><br></br>{formDetails.event_location}
                                </Typography>
                                <Typography gutterBottom variant="body1" component="div">
                                  <b>When does it start?</b><br></br>{formatDate(formDetails.event_start_datetime)}
                                </Typography>
                                <Typography gutterBottom variant="body1" component="div">
                                  <b>When does it end?</b><br></br>{formatDate(formDetails.event_end_datetime)}
                                </Typography>
                                <Typography gutterBottom variant="body1" component="div">
                                  <b>What is the price range?</b> $20-$30
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                    <Button
                                      variant="contained"  color="success" fullWidth
                                      
                                    >
                                      Update Event
                                    </Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Button
                                      variant="contained"  color="primary" fullWidth
                                      
                                    >
                                      Message All
                                    </Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Button variant="contained"  color="warning" fullWidth>
                                      Event Reviews
                                    </Button>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Button variant="contained"  color="error" fullWidth>
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
                                  {formDetails.event_desc}
                                </Typography>
                              </GridItem>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <GridItem>
                                <Typography gutterBottom variant="h4" component="div">
                                  Tags:
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                  {formDetails.event_tags.map(function (tag, i) {
                                    return (
                                      <Chip
                                        key={i}
                                        label={tag}
                                      />
                                    );
                                  })}
                                </Stack>
                              </GridItem>
                            </Grid>
                          </Grid>
                        </ScrollContainer>
                      </Grid>
                   
                }
              
              
              <Grid container direction="row" spacing={2}>
                  <Grid item md={1}></Grid>
                  <Grid item md={5}>
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                  </Grid>
                  <Grid item md={5}></Grid>
                <Grid item md={1}>
                  {
                    
                      activeStep <= steps.length - 2
                      ?
                         (
                          <Button onClick={handleNext}>
                            Next
                          </Button>
                        )
                      :
                        (
                          <Button onClick={handleSubmit}>
                            Submit
                          </Button>
                        )
              
                  }
                </Grid>
              </Grid>
        </Grid>
        <NotHostErrorModal open={open} setOpen={setOpen}/>
        <CreateEventSuccessModal open={createEventSuccess} setOpen={setCreateEventSuccess} />
    </Box>
  )
}

export default CreateEventPage