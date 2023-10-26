import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import EventAPI from "../utils/EventAPIHelper";
import { PageContainer } from '../components/styles/layouts.styled'
import EventCard from '../components/event/EventCard'
import SearchBar from '../components/search/SearchBar';
import { Grid, Typography, styled } from '@mui/material'

const api = new EventAPI();

const MainScreenContainer = styled(PageContainer)`
  height: auto;
  overflow-y: initial;
  margin-bottom: 1rem;
`

const MainScreenTitle = styled(Typography)`
  color: lightsalmon;
  font-weight: 1000;
`

const createCard = (event) => {
  if (event.event_status.toLowerCase() === "upcoming") {
    return (
      <EventCard
        key={event.event_id}
        eventData={event}
      />
    );
  }
}

const HomeScreen = () => {
  const context = useContext(StoreContext);
  const [account] = context.account;
  const [eventsList, setEventsList] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [recommendationsList, setRecommendations] = useState([])
  const [query, setQuery] = useState({
    event_title: null,
    event_desc: null,
    event_category: null
  })

  useEffect(() => {
    api
      .getEventList()
      .then((response) => setEventsList(response.data))
      .catch((err) => console.log(err));
  }, [])

  useEffect(() => {
    setSearchResults([])
    if (query.event_title || query.event_desc || query.event_category) {
      api.getEventList(query)
      .then((response) => {
        setSearchResults(response.data)
      })
      .catch((err) => console.log(err));
    }
  }, [query])

  useEffect(() => {
    if (account) {
      api
        .getRecommendations(account.account_id, { max_limit: 3 })
        .then((response) => setRecommendations(response.data))
        .catch((err) => console.log(err));
    }
    else {
      setRecommendations([])
    }
  }, [account])

  return (
    <MainScreenContainer maxWidth='lg' sx={{mb:5}}>
      <MainScreenTitle variant="h5">
        Search or browse for upcoming events!
      </MainScreenTitle>
      <SearchBar setQuery={setQuery} />
      {searchResults.length
        ? <Grid container spacing={2}>
          <Grid item xs={12}>
            <MainScreenTitle variant="h5" component="div" align='left' sx={{ mt: 2 }}>
              Search Results:
            </MainScreenTitle>
          </Grid>
          {searchResults.map(createCard)}
        </Grid>
        : !query.event_title && !query.event_desc && !query.event_category
        ?  ''
        : <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" component="div" align='left' sx={{ mt: 2 }}>
            Search Results: No Results found
          </Typography>
        </Grid>
      </Grid>
      }
      {recommendationsList.length > 0
        ?
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MainScreenTitle variant="h5" component="div" align='left' sx={{ mt: 5}} >
              Recommended for you:
            </MainScreenTitle>
          </Grid>
          {recommendationsList.map(createCard)}
        </Grid>
        :
        <div></div>
      }
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MainScreenTitle variant="h5" component="div" align='left' sx={{ mt: 5}}>
            Upcoming Events:
          </MainScreenTitle>
        </Grid>
        {eventsList.map(createCard)}
      </Grid>
    </MainScreenContainer>
  )

}

export default HomeScreen