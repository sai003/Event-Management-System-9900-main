import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AccountAPI from "../utils/AccountAPIHelper";
import { StoreContext } from '../utils/context'
import { FlexBox, PageContainer } from '../components/styles/layouts.styled'
import CustomerRegisterModal from '../components/account/modals/CustomerRegisterModal';
import HostRegisterModal from '../components/account/modals/HostRegisterModal';
import EmailExistsModal from '../components/account/modals/EmailExistsModal';
import UndoIcon from '@mui/icons-material/Undo';
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';

const api = new AccountAPI();

const ImageBanner = styled('div')`
  width: 35vw;
  margin-left: ${( {ml} ) => ml + 'rem'};
  margin-right: ${( {mr} ) => mr + 'rem'};
  margin-bottom: 1rem;
  background-image: url('../img/stock/stock-event-image.jpg');
  background-size: cover;
  background-position: ${({ pos }) => pos};

  ${({theme}) => theme.breakpoints.down("lg")} {
    margin-left: ${( {ml} ) => '1rem'};
    margin-right: ${( {mr} ) => '1rem'};
  }

  ${({theme}) => theme.breakpoints.down("md")} {
    display: none;
  }
`

const ToggleGrid = styled(Grid)`
  display: ${( {show} ) => show === 'Host' ? 'initial' : 'none'};
`

const RegisterScreen = () => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  const [, setAccount] = context.account;
  const [, setHostDetails] = context.host;
  const [openCustomerModal, setCustomerModal] = useState(false);
  const [openHostModal, setHostModal] = useState(false);
  const [openEmailModal, setEmailModal] = useState(false);
  const [emailErr, setEmailErr] = useState(null);
  const [hostInputs, setHostInputs] = useState('Customer');
  const [formErrors, setFormErrors] = useState({
    error: false,
    firstName: null,
    lastName: null,
    email: null,
    password1: null,
    password2: null,
    orgName: null,
    orgEmail: null,
    orgJobTitle: null,
    qualification: null,
    hostMobile: null
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName')
    const lastName = data.get('lastName')
    const email = data.get('email')
    const password1 = data.get('password1')
    const password2 = data.get('password2')
    const orgName = data.get('orgName')
    const orgEmail = data.get('orgEmail')
    const orgJobTitle = data.get('orgJobTitle')
    const qualification = data.get('qualification')
    const hostMobile = data.get('hostMobile')

    formErrors.error = false;

    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(firstName)) {
      setFormErrors(prevState => { return { ...prevState, firstName: true } })
      formErrors.error = true
    }
    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(lastName)) {
      setFormErrors(prevState => { return { ...prevState, lastName: true } })
      formErrors.error = true
    }
    if (!/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(email)) {
      setFormErrors(prevState => { return { ...prevState, email: true } })
      formErrors.error = true
    }
    if (!/\S+/.test(password1) || password1.length < 8) {
      setFormErrors(prevState => { return { ...prevState, password1: true } })
      formErrors.error = true
    }
    if (password1 !== password2) {
      setFormErrors(prevState => { return { ...prevState, password2: true } })
      formErrors.error = true
    }
    if (hostInputs === 'Host') {
      if (!orgName || !/^[a-zA-Z0-9]+(\s[a-zA-Z0-9]+)*$/.test(orgName)) {
        setFormErrors(prevState => { return { ...prevState, orgName: true } })
        formErrors.error = true
      }
      if (!orgEmail || !/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(orgEmail)) {
        setFormErrors(prevState => { return { ...prevState, orgEmail: true } })
        formErrors.error = true
      }
      if (!orgJobTitle || !/^[a-zA-Z0-9]+(\s[a-zA-Z0-9]+)*$/.test(orgJobTitle)) {
        setFormErrors(prevState => { return { ...prevState, orgJobTitle: true } })
        formErrors.error = true
      }
      if (!qualification || !/^[a-zA-Z0-9]+(\s[a-zA-Z0-9]+)*$/.test(qualification)) {
        setFormErrors(prevState => { return { ...prevState, qualification: true } })
        formErrors.error = true
      }
      if (hostMobile && hostMobile[0] === '+') {
        if (/\D+/.test(hostMobile.slice(1)) || hostMobile.length < 9) {
          setFormErrors(prevState => { return { ...prevState, hostMobile: true } })
          formErrors.error = true
        }
      }
      else if (hostMobile) {
        if (/\D+/.test(hostMobile) || hostMobile.length < 9) {
          setFormErrors(prevState => { return { ...prevState, hostMobile: true } })
          formErrors.error = true
        }
      }
      else {
        setFormErrors(prevState => { return { ...prevState, hostMobile: true } })
        formErrors.error = true
      }
    }

    if (!formErrors.error) {
      const body = {
        "account_type": hostInputs,
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "password": password1,
        "hostMobile": hostMobile,
        "tags": []
      }
      try {
        const accountRes = await api.addAccount(body)
        setLoggedIn(true)
        setAccount(accountRes.data)
        if (hostInputs === 'Host') {
          const accountID = accountRes.data.account_id
          const hostDetails = {
            host_contact_no: hostMobile,
            isVerified: false,
            host_status: 'Pending',
            job_title: orgJobTitle,
            qualification: qualification,
            org_email: orgEmail,
            org_name: orgName,
          }
          const HostRes = await api.putHost(accountID, hostDetails)
          setHostDetails(HostRes.data)
          setHostModal(true)
        }
        else {
          setCustomerModal(true)
        }
      }
      catch(error) {
        if (error.response?.status === 400) {
          setEmailErr(email)
          setEmailModal(true)
        }
        console.error(error)
      }
    }
  };

  useEffect(() => {
    if (loggedIn && (!openCustomerModal && !openHostModal)) {
      navigate('/'); // send user to home if they close modal without selecting 'tags' or 'skip'
    }
  }, [openCustomerModal, openHostModal])

  return (
    <PageContainer direction='row' justify='center' maxWidth='xl'>
      <ImageBanner pos='left' mr='3.5'/>
      <FlexBox direction='column'>
        <Typography variant='h3' align='center' sx={{ mt:10,
          color: 'evenTastic.title' }}>
          Create an account
        </Typography>
        <Typography variant='h6' align='center' sx={{ mb:5, color: 'evenTastic.title' }}>
          start having an evenTastic time!
        </Typography>
        <form component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{height:'40vh', maxWidth: '50vw', minWidth:'400px'}}>

            {/* Customer detail section */}

            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                inputProps={{ maxLength: 50 }}
                onChange={() => {
                  formErrors.firstName && setFormErrors(prevState => { return { ...prevState, firstName: false } })
                }}
                error={formErrors.firstName}
                helperText={formErrors.firstName ? 'Must be a valid firstname.' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                inputProps={{ maxLength: 50 }}
                onChange={() => {
                  formErrors.lastName && setFormErrors(prevState => { return { ...prevState, lastName: false } })
                }}
                error={formErrors.lastName}
                helperText={formErrors.lastName ? 'Must be a valid lastname.' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                id="email"
                label="Email"
                inputProps={{ maxLength: 50 }}
                onChange={() => {
                  formErrors.email && setFormErrors(prevState => { return { ...prevState, email: false } })
                }}
                error={formErrors.email}
                helperText={formErrors.email ? 'Invalid email.' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password1"
                required
                fullWidth
                type="password"
                id="password1"
                label="Password"
                inputProps={{ maxLength: 50 }}
                onChange={() => {
                  formErrors.password1 && setFormErrors(prevState => { return { ...prevState, password1: false } })
                }}
                error={formErrors.password1}
                helperText={formErrors.password1 ? 'Cannot be empty. Must contain at least 8 characters.' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password2"
                required={hostInputs ? true : false}
                fullWidth
                type="password"
                id="password2"
                label="Confirm password"
                inputProps={{ maxLength: 50 }}
                onChange={() => {
                  formErrors.password2 && setFormErrors(prevState => { return { ...prevState, password2: false } })
                }}
                error={formErrors.password2}
                helperText={formErrors.password2 ? 'Passwords must match.' : ''}
              />
            </Grid>

            {/* Host detail section */}

            <ToggleGrid show={hostInputs} item xs={12} sm={6}>
              <FlexBox>
                <Typography variant='subtitle1' sx={{color: 'success.main', fontWeight:1000 }}>
                  Host details:
                </Typography>
                <Tooltip title="Nevermind" placement='right'>
                  <IconButton size='small' sx={{ml:'1rem'}} onClick={() => setHostInputs('Customer')}>
                    <UndoIcon/>
                  </IconButton>
                </Tooltip>
              </FlexBox>
              <TextField
                name="orgName"
                required={hostInputs ? true : false}
                fullWidth
                id="orgName"
                label="Organisation"
                inputProps={{ maxLength: 50 }}
                onChange={() => {
                  formErrors.orgName && setFormErrors(prevState => { return { ...prevState, orgName: false } })
                }}
                error={formErrors.orgName}
                helperText={formErrors.orgName ? 'Must be a valid organisation.' : ''}
              />
            </ToggleGrid>
            <ToggleGrid show={hostInputs} item xs={12} sm={6}>
              <TextField
                name="orgEmail"
                required={hostInputs ? true : false}
                fullWidth
                id="orgEmail"
                label="Organisation email"
                inputProps={{ maxLength: 30 }}
                sx={{mt:{xs:0, sm:4.2}}}
                onChange={() => {
                  formErrors.orgEmail && setFormErrors(prevState => { return { ...prevState, orgEmail: false } })
                }}
                error={formErrors.orgEmail}
                helperText={formErrors.orgEmail ? 'Must be a valid email.' : ''}
              />
            </ToggleGrid>
            <ToggleGrid show={hostInputs} item xs={12} sm={6}>
              <TextField
                name="orgJobTitle"
                required={hostInputs ? true : false}
                fullWidth
                id="orgJobTitle"
                label="Job title"
                inputProps={{ maxLength: 30 }}
                onChange={() => {
                  formErrors.orgJobTitle && setFormErrors(prevState => { return { ...prevState, orgJobTitle: false } })
                }}
                error={formErrors.orgJobTitle}
                helperText={formErrors.orgJobTitle ? 'Must be a valid job title.' : ''}
              />
            </ToggleGrid>
            <ToggleGrid show={hostInputs} item xs={12} sm={6}>
              <TextField
                name="qualification"
                required={hostInputs ? true : false}
                fullWidth
                id="qualification"
                label="Qualification"
                inputProps={{ maxLength: 50 }}
                onChange={() => {
                  formErrors.qualification && setFormErrors(prevState => { return { ...prevState, qualification: false } })
                }}
                error={formErrors.qualification}
                helperText={formErrors.qualification ? 'Must be a valid qualification.' : ''}
              />
            </ToggleGrid>
            <ToggleGrid show={hostInputs} item xs={12} sm={6}>
              <TextField
                name="hostMobile"
                required={hostInputs ? true : false}
                fullWidth
                id="hostMobile"
                label="Your host mobile"
                type="tel"
                inputProps={{ maxLength: 20 }}
                onChange={() => {
                  formErrors.hostMobile && setFormErrors(prevState => { return { ...prevState, hostMobile: false } })
                }}
                error={formErrors.hostMobile}
                helperText={formErrors.hostMobile ? 'Must be a valid mobile number.' : ''}
              />
            </ToggleGrid>

            {/* Submit button section */}

            {hostInputs === 'Host'
            ? <span/>
            : <FlexBox direction='column' sx={{ ml:3 }}>
                <Typography variant='subtitle1' sx={{color: 'success.main', fontWeight:1000 }}>
                  Want to host events?
                </Typography>
                <Button onClick={() => setHostInputs('Host')} variant="contained" color='success'>
                  Add host details
                </Button>
              </FlexBox>
            }
            {hostInputs === 'Host'
            ? <Button type='submit' variant="contained" fullWidth sx={{ml:'1rem', mt:'1rem'}}>
                Register as host
              </Button>
            : <Button type='submit' variant="contained" fullWidth sx={{ml:'1rem', mt:'1rem'}}>
                Sign up
              </Button>
            }
          </Grid>
        </form>
      </FlexBox>
      <ImageBanner pos='right' ml='3.5'/>
      <CustomerRegisterModal open={openCustomerModal} setOpen={setCustomerModal}/>
      <HostRegisterModal open={openHostModal} setOpen={setHostModal}/>
      <EmailExistsModal open={openEmailModal} setOpen={setEmailModal} email={emailErr} />
    </PageContainer>
  )
}

export default RegisterScreen