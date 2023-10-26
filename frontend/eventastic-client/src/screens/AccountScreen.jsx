import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../utils/context';
import { useNavigate, useLocation } from 'react-router';
import { PageContainer } from '../components/styles/layouts.styled'
import AccountSideBar from '../components/account/AccountSideBar'
import AccountMain from '../components/account/AccountMain'
import AccountWelcomeModal from '../components/account/modals/AccountWelcomeModal';

const AccountScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(StoreContext);
  const [loggedIn] = context.login;
  const [openWelcome, setOpenWelcome] = useState(false);
  const [accountPage, setAccountPage] = useState('account');

  useEffect(() => {
    if (!loggedIn) {
      navigate('/') // if someone typed /account in url without login
    }
    if (location.state && location.state.from === '/register') {
      setOpenWelcome(true)
    }
    else if (location.state && location.state.from === '/tags') {
      setAccountPage('interests')
    }
    else if (location.state && location.state.from === '/create-events') {
      setAccountPage('events') 
    }
    else if (location.state && location.state.require === 'host') {
      setAccountPage('host') 
    }
  }, [])

  return (
    <PageContainer direction='row' maxWidth='lg'>
      <AccountSideBar accountPage={accountPage} changePage={setAccountPage}/>
      <AccountMain accountPage={accountPage} changePage={setAccountPage}/>
      <AccountWelcomeModal open={openWelcome} setOpen={setOpenWelcome}/>
    </PageContainer>
  )
}

export default AccountScreen