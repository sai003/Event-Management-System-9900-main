import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  IconButton,
  Avatar,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

const AccountMenu = () => {
  const context = useContext(StoreContext);
  const [, setRedirect] = context.redirect;
  const [loggedIn, setLoggedIn] = context.login;
  const [account, setAccount] = context.account;
  const [, setAccountGroups] = context.groups;
  const [, setCard] = context.card;
  const [, setHostDetails] = context.host;
  const [, setLogInModal] = context.logInModal;
  const [anchor, setAnchor] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  const handleLogInModal = (redirect) => {
    handleCloseMenu();
    setRedirect(redirect)
    setLogInModal(true);
  };

  const handleLogout = () => {
    handleCloseMenu();
    setLoggedIn(false);
    setAccount(false);
    setAccountGroups({})
    setCard({});
    setHostDetails(false);
  };

  return (
    <>
      <Tooltip title="Open account menu" enterDelay={10}>
        <IconButton onClick={handleOpenMenu} sx={{ p: 0, mr: { xs: '0.25rem', md: '1rem' } }}>
          <Avatar
            src={account.profile_pic}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '25px' }}
        id="appbar-menu"
        keepMounted
        anchorEl={anchor}
        paperwidth={13}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchor)}
        onClose={handleCloseMenu}
      >
        {(() => {
          if (!loggedIn) {
            return (
              <div>
                <MenuItem id='logIn' onClick={() => handleLogInModal(false)}>
                  <ListItemIcon>
                    <LoginIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Log In</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={'/register'} onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <PersonAddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Sign Up</ListItemText>
                </MenuItem>
                <Tooltip title="log in to create event" placement="left">
                  <MenuItem id='createEvent' onClick={() => handleLogInModal('/create-event')}>
                    <ListItemIcon>
                      <EventIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Create an Event</ListItemText>
                  </MenuItem>
                </Tooltip>
                <Tooltip title="log in to access account" placement="left">
                  <MenuItem id='myAccount' onClick={() => handleLogInModal('/account')}>
                    <ListItemIcon>
                      <AccountBoxIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My Account</ListItemText>
                  </MenuItem>
                </Tooltip>
              </div>
            )
          }
          else if (account.admin) {
            return (
              <div>
                <MenuItem component={Link} to={'/'} onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Admin logout</ListItemText>
                </MenuItem>
              </div>
            )
          }
          else {
            return (
              <div>
                <MenuItem component={Link} to={'/'} onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <HomeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Home Page</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={'/create-event'} onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <EventIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Create an Event</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={'/account'} onClick={handleCloseMenu}>
                  <ListItemIcon>
                    <AccountBoxIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>My Account</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={'/'} onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </div>
            )
          }
        })()}
      </Menu>
    </>
  )
}

export default AccountMenu