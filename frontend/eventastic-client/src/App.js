import React from 'react';
import ContextProvider from './utils/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EvenTasticAppBar from './components/layout/AppBar';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import AccountScreen from './screens/AccountScreen';
import TagsScreen from './screens/TagsScreen';
import EventScreen from './screens/EventScreen';
import CreateEventPage from './screens/CreateEventPage';
import AdminScreen from './screens/AdminScreen';
import UnauthorizedScreen from './screens/UnauthorizedScreen';
import Footer from './components/layout/Footer';
import LogInModal from './components/account/modals/LogInModal';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    evenTastic: {
      title: 'lightsalmon',
      layout: 'lavenderblush',
      purple: 'rgb(156, 39, 176)',
      dark_purple: 'rgb(114 30 129)',
      dull: '#b5b5b5',
      grey: '#757575'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
    <ContextProvider>
    <Router>
      <EvenTasticAppBar />
        <Routes>
          <Route path='/' element={<HomeScreen/>}/>
          <Route exact path='/register' element={<RegisterScreen/>}/>
          <Route exact path='/account' element={<AccountScreen/>}/>
          <Route exact path='/tags' element={<TagsScreen/>}/>
          <Route exact path='/event/:id' element={<EventScreen/>}/>
          <Route exact path='/create-event' element={<CreateEventPage/>}/>
          <Route exact path='/admin/*' element={<AdminScreen/>}/>
          <Route exact path='/unauthorized' element={<UnauthorizedScreen/>}/>
        </Routes>
      <Footer />
      <LogInModal/>
    </Router>
    </ContextProvider>
    </ThemeProvider>
  );
}

export default App;
