import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const StoreContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState(false);
  const [accountGroups, setAccountGroups] = useState({});
  const [card, setCard] = useState({});
  const [hostDetails, setHostDetails] = useState(false);
  const [LogInModal, setLogInModal] = useState(false);

  const states = {
    redirect: [redirect, setRedirect],
    login: [loggedIn, setLoggedIn],
    account: [account, setAccount],
    groups: [accountGroups, setAccountGroups],
    card: [card, setCard],
    host: [hostDetails, setHostDetails],
    logInModal: [LogInModal, setLogInModal]
  };

  return (
    <StoreContext.Provider value={states}>
      {children}
    </StoreContext.Provider>
  )
};

ContextProvider.propTypes = {
  children: PropTypes.node,
};

export default ContextProvider;
