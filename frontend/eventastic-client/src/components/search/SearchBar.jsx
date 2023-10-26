import { useState, useRef } from 'react';
import { FlexBox } from '../styles/layouts.styled';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Chip,
  ClickAwayListener,
  TextField,
  Typography,
  Grow,
  MenuList,
  Paper,
  Popper,
  InputBase,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';

const eventCategories = ["Music", "Business", "Food & Drink", "Community", "Arts", "Film & Media",
  "Sports & Fitness", "Health", "Science & Tech", "Travel & Outdoor", "Charity & Causes",
  "Spirituality", "Family & Education", "Seasonal", "Government", "Fashion", "Home & Lifestyle",
  "Auto, Boat & Air", "Hobbies", "School Activities", "Kids Entertainment"]

const EventasticSearchBar = styled(Paper)`
  width: 450px;
  display: flex;
  margin-top: 1rem;
`

const SearchMenuItem = styled(FlexBox)`
  padding: 8px 16px 0px 16px;
`

const SearchBar = ({ setQuery }) => {
  const [openMenu, setOpenMenu] = useState(false)
  const [savedTag, setSavedTag] = useState(null)
  const [eventDesc, setEventDesc] = useState('')
  const searchTitle = useRef('')
  const anchorRef = useRef(null);


  const handleTagSelect = (event) => {
    const tagNode = event.currentTarget
    const tagName = tagNode.children[0].innerHTML.replace('&amp;', '&')
    if (savedTag === tagName) {
      setSavedTag(null)
    } else {
      setSavedTag(tagName)
    }
  }

  const handleClose = (event) => {
    const targetID = event.target.id
    if (targetID !== 'evenTasticSearchBar') {
      setOpenMenu(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setQuery({
      event_title: searchTitle?.current?.value || '',
      event_desc: eventDesc,
      event_category: savedTag
    })
    if (searchTitle.current) {
      searchTitle.current.value = ''
    }
    setSavedTag(null)
    setEventDesc('')
    handleClose(event)
  };

  return (
    <>
      <EventasticSearchBar component="form" onSubmit={handleSubmit}>
        <Tooltip title="Advanced search" enterDelay={10}>
          <IconButton
            ref={anchorRef}
            onClick={() => setOpenMenu(!openMenu)}
            aria-expanded={openMenu}
            aria-label="open-more-search"
            aria-describedby="opens menu for additional search params"
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <InputBase
          inputRef={searchTitle}
          autoComplete='off'
          id='evenTasticSearchBar'
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for Events"
        />
        <Tooltip title="Submit search" enterDelay={10}>
          <IconButton type="submit" aria-label="search" >
            <SearchIcon
              id='searchIcon'
              aria-label="search-submit"
              aria-describedby="submits search query when clicked"
            />
          </IconButton>
        </Tooltip>
      </EventasticSearchBar>
      <Popper
        open={openMenu}
        anchorEl={anchorRef.current}
        placement='bottom-start'
        transition
        disablePortal
        sx={{ '.MuiPopper-root': { zIndex: 100 } }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper sx={{ width: '450px', '.MuiPaper-root': { zIndex: 100 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <SearchMenuItem>
                    <Typography sx={{ color: 'evenTastic.dull' }}>
                      Search by Event Description
                    </Typography>
                  </SearchMenuItem>
                  <SearchMenuItem>
                    <TextField
                      id="event-desc"
                      name="event_desc"
                      label="Event Description"
                      type="text"
                      sx={{ width: '100%' }}
                      value={eventDesc}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      onChange={(e) => setEventDesc(e.target.value)}
                    />
                  </SearchMenuItem>
                  <SearchMenuItem id="selectEventTags333">
                    <Typography sx={{ color: 'evenTastic.dull' }}>
                      Search by Event Category
                    </Typography>
                  </SearchMenuItem>
                  <SearchMenuItem wrap='wrap' onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
                    {eventCategories.map((tag, idx) => (
                      <Chip key={idx} clickable label={tag}
                        onClick={handleTagSelect} sx={{ m: 0.5 }}
                        color={tag === savedTag ? 'success' : 'default'}
                      /> 
                    )
                    )}
                  </SearchMenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper >
    </>
  )
}

export default SearchBar