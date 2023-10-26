import { useContext, useState } from 'react';
import { StoreContext } from '../utils/context';
import { useNavigate, useLocation } from 'react-router';
import AccountAPI from '../utils/AccountAPIHelper';
import eventTags from '../event_tags'
import { PageContainer } from '../components/styles/layouts.styled'
import { FlexBox, ScrollContainer } from '../components/styles/layouts.styled'
import { Box, Button, Chip, Divider, Typography, styled } from '@mui/material'

const api = new AccountAPI();
const success = '#2e7d32'
const unselected = 'rgba(0, 0, 0, 0.08)'


const StyledContainer = styled(Box)`
  border: 3px solid #ad9fa3;
  border-radius: 10px;
  overflow: hidden;
  height: 65vh;
`


const StyledTagContainer = styled(FlexBox)`
  border: 3px solid #ad9fa3;
  border-radius: 10px;
  padding: 0.25rem;
  margin-bottom: 1rem;
`

// Helper inner component
const TagContainer = ({ categoryAndTags, savedTags, setSavedTags }) => {
  const category = categoryAndTags.cat_name
  const tags = categoryAndTags.tags

  const handleSelect = (event) => {
    const tagNode = event.currentTarget
    const tagName = tagNode.children[0].innerHTML.replace('&amp;', '&')
    if (savedTags.find((tag) => tag === tagName)) {
      tagNode.style.backgroundColor = unselected
      const newState = savedTags.filter((tag) => tag !== tagName)
      setSavedTags(newState)
    } else {
      tagNode.style.backgroundColor = success
      setSavedTags(prevState => { return [...prevState, tagName] })
    }
  }

  return (
    <div>
      <Typography variant='h6' align='center'>
        {category}
      </Typography>
      <StyledTagContainer wrap='wrap'>
        {tags.map((tag, idx) => (
          <Chip key={idx} clickable label={tag.tag_name}
            onClick={handleSelect} sx={{ m: 0.5 }}
            color={savedTags.find((savedTag) => savedTag === tag.tag_name) && 'success'} />
        )
        )}
      </StyledTagContainer>
    </div>
  )
}

const TagsScreen = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const context = useContext(StoreContext);
  const [account, setAccount] = context.account;
  const [savedTags, setSavedTags] = useState(() => account.tags.map((item) => item.name))

  const handleSubmit = () => {
    const body = {
      ...account,
      'tags': savedTags.map((tag) => ({ 'name': tag }))
    }
    api.putAccount(account.account_id, body)
      .then((response) => {
        setAccount(response.data)
        if (location.state && location.state.from === '/register') {
          navigate('/account', { state: {from: '/register'} })  
        }
        else {
          navigate('/account', { state: {from: '/tags'} })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <PageContainer maxWidth='lg' sx={{ mt: 5 }}>
      <FlexBox justify='space-between'>
        <Box sx={{ maxWidth: '60vw', height: '80vh', mr: 3, flexGrow: 1, overflow: 'hidden', mb: 1 }}>
          <FlexBox direction='column'>
            <Typography variant='h5' align='center'
              sx={{ color: 'evenTastic.grey', fontWeight: 1000 }}>
              Select the tags to customise your profile!
            </Typography>
            <Typography variant='subtitle1' align='center'>
              Make it easier to find events suited to you and improve your chances of joining a group!
            </Typography>
            <Divider variant="middle" sx={{ mb: 2 }} />
          </FlexBox>
          <ScrollContainer thin pr='0.25vw' height='88%'>
            {eventTags.eventTagsByCategory.map((tags, idx) => (
              <TagContainer key={idx} categoryAndTags={tags}
                savedTags={savedTags} setSavedTags={setSavedTags} />
            ))}
          </ScrollContainer>
        </Box>
        <Box sx={{ flexGrow: 1 }} >
          <Typography variant='h5' align='center' sx={{ color: 'evenTastic.grey', fontWeight: 1000 }}>
            your tags
          </Typography>
          <StyledContainer sx={{ mt: 2, minWidth: '280px', maxWidth: '300px', p: 1 }}>
            <ScrollContainer thin height='100%' flex='true' wrap='wrap' align='start'>
              {savedTags.map((tag, idx) => (
                <Chip key={idx} label={tag}
                  color={'success'}
                  sx={{ m: 0.5 }} />
              ))}
            </ScrollContainer>
          </StyledContainer>
          <Button fullWidth variant='contained' sx={{ mt: 2 }} onClick={handleSubmit}>
            Save and continue
          </Button>
        </Box>
      </FlexBox>
    </PageContainer>
  )
}

export default TagsScreen