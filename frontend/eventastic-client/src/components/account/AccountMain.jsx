import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlexBox } from '../styles/layouts.styled';
import AccountDetailsPage from './pages/AccountDetailsPage';
import AccountInterestPage from './pages/AccountInterestPage'
import AccountTicketsPage from './pages/AccountTicketsPage'
import AccountPointsPage from './pages/AccountPointsPage'
import AccountGroupPage from './pages/AccountGroupPage'
import HostDetailsPage from './pages/HostDetailsPage'
import HostEventsPage from './pages/HostEventsPage'
import ManageEventDetailsPage from './pages/ManageEventDetailsPage';
import { Button, Divider, Typography, styled } from '@mui/material';

export const AccountContainer = styled('div')`
  flex-grow: 7;
  border: 3px solid #ad9fa3;
  margin-bottom: 1rem;
  padding: 1rem;
  overflow: hidden;
`;

const PageTitles = {
  'account': 'My Account Details',
  'interests': 'My Interests',
  'tickets': 'My Tickets',
  'points': 'My Reward Points',
  'groups': 'My Groups',
  'host': 'Host Details',
  'events': 'My Hosted Events'
}

const AccountMain = ({ accountPage, changePage }) => {
  const navigate = useNavigate();
  const [accountChange, setAccountChange] = useState(false);
  const [hostChange, setHostChange] = useState('');
  const [toggleTickets, setToggleTickets] = useState(true)
  const [toggleEvents, setToggleEvents] = useState(false)
  const [managedEventDetails, setManagedEventDetails] = useState({})

  useEffect(() => {
    accountPage !== 'managedEventDetails' && setManagedEventDetails({})
  }, [accountPage])

  useEffect(() => {
    if (Object.keys(managedEventDetails).length !== 0 && accountPage !== 'managedEventDetails') {
      changePage('managedEventDetails')
    }
  }, [managedEventDetails])

  return (
    <AccountContainer>
      <FlexBox justify='space-between'>
        <Typography variant='h6'>
          {Object.keys(managedEventDetails).length === 0
            ? PageTitles[accountPage]
            : `Manage: ${managedEventDetails.event_title}`
          }
        </Typography>
        {(() => {
          if (accountPage === 'account') {
            return (
              <Button form='accountForm' type='submit' disabled={!accountChange} color='success'
                variant="contained" sx={{ bottom: '5px', backgroundColor: 'success.main' }}>
                Save changes
              </Button>
            )
          }
          else if (accountPage === 'tickets') {
            return (
              <FlexBox sx={{ ml: 'auto', mr: 'auto' }}>                
                <Button onClick={() => setToggleTickets(true)}
                  variant="contained" color='success' sx={{
                    top: '45px', mr: 10,
                    backgroundColor: toggleTickets ? 'success.light' : 'success.main'
                  }}>
                  Upcoming
                </Button>
                <Button onClick={() => setToggleTickets(false)}
                  variant="contained" color='success' sx={{
                    top: '45px', width: '117px', mr: 7,
                    backgroundColor: toggleTickets ? 'success.main' : 'success.light'
                  }}>
                  Past
                </Button>
              </FlexBox>
            )
          }
          else if (accountPage === 'host') {
            return (
              <Button form='hostForm' type='submit' disabled={!hostChange} color='success'
                variant="contained" sx={{ bottom: '5px', backgroundColor: 'success.main' }}>
                {hostChange === 'register' ? 'Register' : 'Save changes'}
              </Button>
            )
          }
          else if (accountPage === 'events') {
            return (
              // TODO negative margins on media mobile
              <FlexBox justify='space-between' sx={{ ml: -50 }}>
                <FlexBox sx={{ ml: 'auto', mr: 10 }}>
                  <Button onClick={() => setToggleEvents(true)}
                    variant="contained" color='success' sx={{
                      top: '45px', width: '117px', mr: 7,
                      backgroundColor: toggleEvents ? 'success.light' : 'success.main'
                    }}>
                    Past
                  </Button>
                  <Button onClick={() => setToggleEvents(false)}
                    variant="contained" color='success' sx={{
                      top: '45px', mr: 10,
                      backgroundColor: toggleEvents ? 'success.main' : 'success.light'
                    }}>
                    Up-coming
                  </Button>
                </FlexBox>
                <Button onClick={() => navigate('/create-event')} color='success'
                  variant="contained" sx={{ bottom: '5px', backgroundColor: 'success.main' }}>
                  Create event
                </Button>
              </FlexBox>

            )
          }
        })()}
      </FlexBox>
      <Divider variant="middle" sx={{ mb: 2 }} />
      {(() => {
        if (accountPage === 'account') {
          return (
            <AccountDetailsPage change={accountChange} setChange={setAccountChange} />
          )
        } else if (accountPage === 'interests') {
          return (
            <AccountInterestPage />
          )
        } else if (accountPage === 'tickets') {
          return (
            <AccountTicketsPage toggle={toggleTickets} />
          )
        } else if (accountPage === 'points') {
          return (
            <AccountPointsPage />
          )
        } else if (accountPage === 'groups') {
          return (
            <AccountGroupPage />
          )
        } else if (accountPage === 'host') {
          return (
            <HostDetailsPage change={hostChange} setChange={setHostChange} />
          )
        } else if (accountPage === 'events') {
          return (
            <HostEventsPage toggle={toggleEvents} setManagedEventDetails={setManagedEventDetails} />
          )
        } else if (accountPage === 'managedEventDetails') {
          return (
            <ManageEventDetailsPage
              managedEventDetails={managedEventDetails}
              setManagedEventDetails={setManagedEventDetails}
              changePage={changePage}
            />
          )
        }

      })()}
    </AccountContainer>

  )
}

export default AccountMain