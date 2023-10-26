import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../../utils/context';
import AccountAPI from '../../../utils/AccountAPIHelper';
import HostRegisterModal2 from '../modals/HostRegisterModal2';
import { FlexBox, ScrollContainer } from '../../styles/layouts.styled';
import InfoHeader from '../styles/InfoHeader';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  styled
} from '@mui/material';

const accountApi = new AccountAPI();

const StatusBox = styled(FlexBox)`
  border: 1px solid darkgrey;
  border-radius: 10px;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  width: 35%;
  background-color: aliceblue;
`

const HostDetailsPage = ({ change, setChange }) => {
  const context = useContext(StoreContext);
  const [account] = context.account;
  const [hostDetails, setHostDetails] = context.host;
  const [OpenModal, setOpenModal] = useState(false);
  const [hostStatus, setHostStatus] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [changeOrgName, setChangeOrgName] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [formErrors, setFormErrors] = useState({
    error: false,
    orgName: null,
    orgEmail: null,
    orgJobTitle: null,
    qualification: null,
    hostMobile: null
  })

  const resetHost = () => {
    setHostStatus(false)
    setChange('register')
    setHostDetails(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const orgName = data.get('orgName')
    const orgDesc = data.get('orgDesc')
    const orgEmail = data.get('orgEmail')
    const orgJobTitle = data.get('orgJobTitle')
    const qualification = data.get('qualification')
    const hostMobile = data.get('hostMobile')
    formErrors.error = false;

    if ((!hostDetails && !orgName) || !/^[a-zA-Z0-9]+(\s[a-zA-Z0-9]+)*$/.test(orgName) || (changeOrgName && !orgName)) {
      setFormErrors(prevState => { return { ...prevState, orgName: true } })
      formErrors.error = true
    }
    if ((!hostDetails && !orgEmail) || (!/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(orgEmail) && orgEmail) || (changeEmail && !orgEmail)) {
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
      // I had to do this becasue for some reason, the regex /^[\+]?\D+$/.test(hostMobile) fails to work properly..
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
    if (!formErrors.error) {
      let body = {
        host_contact_no: hostMobile,
        host_status: hostDetails ? hostDetails.host_status : 'Pending',
        isVerified: hostDetails ? true : false,
        job_title: orgJobTitle,
        org_desc: orgDesc,
        org_name: orgName ? orgName : hostDetails.org_name,
        org_email: orgEmail ? orgEmail : hostDetails.org_email,
        qualification: qualification
      }
      if (changeOrgName || changeEmail) {
        body = { ...body, host_status: 'Pending', isVerified: false }
      }
      try {
        const hostRes = await accountApi.putHost(account.account_id, body)
        setHostDetails(hostRes.data)
        setChangeOrgName(false)
        setChangeEmail(false)
        setChange('')
        setSubmit(true)
        if (hostRes.data.host_status === 'Pending') {
          setOpenModal(true)
        }
      }
      catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if (!hostDetails) {
      setChange('register')
      setHostStatus(false)
    }
    else {
      accountApi.getHost(account.account_id)
      .then((res) => {
        setHostDetails(res.data)
        const host_status = res.data.host_status
        if (host_status === 'Pending') {
          setHostStatus('Pending')
        }
        else if (host_status === 'Declined') {
          setHostStatus('Declined')
        }
        else {
          setHostStatus('Approved')
        }
      })
      .catch((err) => console.error(err))
    }
    setSubmit(false)
  }, [submit])

  return (
    <ScrollContainer thin pr='1vw'>
      <StatusBox justify='space-between'>
        <Typography variant='subtitle1'
          sx={{ color: 'evenTastic.grey', fontWeight: 1000, mb: 2 }}>Host status:
        </Typography>
        {(() => {
          if (hostStatus === 'Pending') {
            return (
              <Typography component='span' variant='subtitle1'
                sx={{ color: 'warning.light', fontWeight: 1000 }}> Pending
              </Typography>
            )
          }
          else if (hostStatus === 'Declined') {
            return (
              <Typography component='span' variant='subtitle1'
                sx={{ color: 'error.main', fontWeight: 1000 }}> Declined
              </Typography>
            )
          }
          else if (hostStatus === 'Approved') {
            return (
              <Typography component='span' variant='subtitle1'
                sx={{ color: 'success.main', fontWeight: 1000 }}> Approved
              </Typography>
            )
          }
          else {
            return (
              <Typography component='span' variant='subtitle1'
                sx={{ fontWeight: 1000 }}> Not registered
              </Typography>
            )
          }
        })()}

      </StatusBox>
      {hostStatus === 'Declined'
        ? <Button variant='contained' onClick={resetHost} sx={{ mt: 1.5, ml: 1 }}>
          Apply again
        </Button>
        : ''
      }
      <Grid
        onChange={() => !change && hostStatus === 'Approved' && setChange('save')}
        id='hostForm' component="form" noValidate onSubmit={handleSubmit}
        container spacing={2} sx={{ mt: 0 }}
      >
        <Grid item sm={12}>
          <InfoHeader title='Organisation details' />
          <Typography variant='subtitle1'
            sx={{ mb: 1.5, display: hostStatus === 'Approved' ? 'inherit' : 'none' }}>
            Note: changing organisation name or email will result in your host status reverted to pending,
            until the admin team approves the changes.
          </Typography>
          <FlexBox>
            {(() => {
              if (changeOrgName || !hostDetails) {
                return (
                  <TextField
                    name="orgName"
                    required
                    fullWidth
                    id="orgName"
                    label="Organisation name"
                    inputProps={{ maxLength: 50 }}
                    InputLabelProps={{ shrink: true }}
                    defaultValue={hostDetails?.org_name}
                    onChange={() => {
                      formErrors.orgName && setFormErrors(prevState => { return { ...prevState, orgName: false } })
                    }}
                    error={formErrors.orgName}
                    helperText={formErrors.orgName ? 'Must be a valid organisation name.' : ''}
                    sx={{ width: { sm: '100%', md: '59%' } }}
                  />
                )
              }
              else if (hostDetails) {
                return (
                  <FlexBox sx={{ mt: 2, mb: 0.5 }}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mr: 2, fontWeight: 1000 }}>
                      Organisation name:
                    </Typography>
                    <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
                      {hostDetails.org_name}
                    </Typography>
                  </FlexBox>
                )
              }
            })()}
            {hostDetails
              ? <Button
                component='span' variant="contained"
                sx={{
                  mt: { sm: 2, md: 2 }, ml: { sm: 0, md: 8 }, width: '220px',
                  backgroundColor: changeOrgName ? 'evenTastic.dull' : 'info.main',
                  display: hostStatus === 'Approved' ? 'initial' : 'none'
                }}
                onClick={() => setChangeOrgName(!changeOrgName)}
              >
                {changeOrgName ? 'Undo change' : 'Rename Organisation?'}
              </Button>
              : ''
            }
          </FlexBox>
        </Grid>
        <Grid item sm={12}>
          <TextField
            name="orgDesc"
            fullWidth
            multiline
            rows={9}
            id="orgDesc"
            label="Organisation description"
            disabled={hostStatus === 'Pending' || hostStatus === 'Declined'}
            defaultValue={hostDetails ? hostDetails.org_desc : ''}
            sx={{ width: { sm: '100%', md: '59%' } }}
          />
        </Grid>
        <Grid item sm={12}>
          <FlexBox>
          {(() => {
            if (changeEmail || !hostDetails) {
              return (
                <TextField
                  name="orgEmail"
                  required
                  fullWidth
                  id="orgEmail"
                  label="Organisation email"
                  inputProps={{ maxLength: 30 }}
                  InputLabelProps={{ shrink: true }}
                  defaultValue={hostDetails?.org_email}
                  onChange={() => {
                    formErrors.orgEmail && setFormErrors(prevState => { return { ...prevState, orgEmail: false } })
                  }}
                  error={formErrors.orgEmail}
                  helperText={formErrors.orgEmail ? 'Must be a valid email.' : ''}
                  sx={{ width: { sm: '100%', md: '59%' } }}
                />
              )
            }
            else if (hostDetails) {
              return (
                <FlexBox sx={{ mt: 2, mb: 0.5 }}>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mr: 2, fontWeight: 1000 }}>
                    Organisation email:
                  </Typography>
                  <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
                    {hostDetails.org_email}
                  </Typography>
                </FlexBox>
              )
            }
          })()}
          {hostDetails
            ? <Button
              component='span' variant="contained"
              sx={{
                mt: { sm: 2, md: 2 }, ml: { sm: 0, md: 8 }, mb: 2, width: '220px',
                backgroundColor: changeEmail ? 'evenTastic.dull' : 'info.main',
                display: hostStatus === 'Approved' ? 'initial' : 'none'
              }}
              onClick={() => setChangeEmail(!changeEmail)}
            >
              {changeEmail ? 'Undo change' : 'Change email?'}
            </Button>
            : ''
          }
          </FlexBox>
        </Grid>
        <Grid item sm={12} md={6}>
          <InfoHeader title='Host details' />
          <TextField
            name="orgJobTitle"
            required
            fullWidth
            type="tel"
            id="orgJobTitle"
            label="Job title"
            inputProps={{ maxLength: 30 }}
            defaultValue={hostDetails ? hostDetails.job_title : ''}
            disabled={hostStatus === 'Pending' || hostStatus === 'Declined'}
            onChange={() => {
              formErrors.orgJobTitle && setFormErrors(prevState => { return { ...prevState, orgJobTitle: false } })
            }}
            error={formErrors.orgJobTitle}
            helperText={formErrors.orgJobTitle ? 'Must be a valid job title.' : ''}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <TextField
            name="qualification"
            required
            fullWidth
            type="tel"
            id="qualification"
            label="Qualification"
            inputProps={{ maxLength: 50 }}
            defaultValue={hostDetails ? hostDetails.qualification : ''}
            disabled={hostStatus === 'Pending' || hostStatus === 'Declined'}
            onChange={() => {
              formErrors.qualification && setFormErrors(prevState => { return { ...prevState, qualification: false } })
            }}
            error={formErrors.qualification}
            helperText={formErrors.qualification ? 'Must be a valid qualification.' : ''}
            sx={{ mt: { sm: 0, md: 5.6 } }}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <TextField
            name="hostMobile"
            required
            fullWidth
            type="tel"
            id="hostMobile"
            label="Host mobile"
            inputProps={{ maxLength: 17 }}
            defaultValue={hostDetails ? hostDetails.host_contact_no : ''}
            disabled={hostStatus === 'Pending' || hostStatus === 'Declined'}
            onChange={() => {
              formErrors.hostMobile && setFormErrors(prevState => { return { ...prevState, hostMobile: false } })
            }}
            error={formErrors.hostMobile}
            helperText={formErrors.hostMobile ? 'Must be a valid mobile.' : ''}
          />
        </Grid>
      </Grid>
      <HostRegisterModal2 open={OpenModal} setOpen={setOpenModal} s />
    </ScrollContainer>
  )
}

export default HostDetailsPage