import { useEffect, useState } from "react";
import GroupAPI from "../../../utils/GroupAPIHelper";
import InfoHeader from "../../account/styles/InfoHeader";
import { FlexBox, ScrollContainer } from "../../styles/layouts.styled"
import { Box, Button, Chip, TextField, Typography, styled } from "@mui/material"
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const api = new GroupAPI()

const ImageHolder = styled('div')`
  margin-right: 1rem;
  width: 380px;
  height: 380px;
`

const Image = styled('img')`
  width: 100%;
  height: 100%;
`

const RequestJoinPage = ({ setOpen, setPage, setGroupList, group, account }) => {
  const [selectedTags, setSelectedTags] = useState([])
  const [rePopulateTags, setRePopulateTags] = useState(false)
  const [formErrors, setFormErrors] = useState({
    error: false,
    joinRequest: false,
  })

  const handleSelect = (event) => {
    setSelectedTags(selectedTags.filter((tag) => tag.name !== event.currentTarget.id))
    setRePopulateTags(true)
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const joinRequest = data.get('joinRequest')

    formErrors.error = false;
    if (!joinRequest) {
      setFormErrors(prevState => { return { ...prevState, joinRequest: true } })
      formErrors.error = true
    }

    if (!formErrors.error) {
      try {
        let request = {
          group_id: group.group_id,
          account_id: account.account_id,
          interest_tags: selectedTags,
          join_desc: joinRequest,
          join_status: "Pending"
        }
        const requestRes = await api.postGroupMember(group.group_id, request)
        const prevMembers = group.group_members
        group = {
          ...group,
          group_members: [...prevMembers, requestRes.data]
        }
        setGroupList(prevState => { return [group, ...prevState.filter((prevGroup) => prevGroup.group_id !== group.group_id)] })
        setPage('listGroups')
        setOpen(true)
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    group.group_members.forEach((member) => {
      if (member.account_id === account.account_id && member.join_status === 'Pending') {
        setPage('listGroups') // if redirected to request page via login modal when user already pending, send back
      }
    })
    setSelectedTags(account.tags)
  }, [])

  return (
    <ScrollContainer thin pr='1vw' height='97%'>
      <FlexBox wrap='wrap' sx={{ mb: 2 }}>
        <ImageHolder>
          <Image src={group.group_img} alt='group thumbnail' />
        </ImageHolder>
        <FlexBox direction='column' sx={{ maxWidth: '900px', width: { sm: '100%', md: '55vw' } }} >
          <InfoHeader title='Group name' />
          <Typography variant='h4' sx={{ fontWeight: 1000, mb: 2, mr: 1 }}>
            {group.group_name}
          </Typography>
          <InfoHeader title='Members' />
          <Chip icon={<PeopleAltIcon />} sx={{ maxWidth: '80px', mb: 2 }}
            label={group.group_members.reduce(
              (total, member) => (total + (member.join_status === 'Accepted' ? 1 : 0)), 0
            )}
          />
          <InfoHeader title='Group description' />
          <Typography variant='body1' sx={{ mb: 2 }}>
            {group.group_desc}
          </Typography>
        </FlexBox>
      </FlexBox>
      <InfoHeader title='Join Request Form' />
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <TextField
          name="joinRequest"
          required
          fullWidth
          multiline
          rows={5}
          id="joinRequest"
          label="Join Request"
          placeholder='Introduce yourself, why do you want to join this group?'
          onChange={() => {
            formErrors.joinRequest && setFormErrors(prevState => { return { ...prevState, joinRequest: false } })
          }}
          error={formErrors.joinRequest}
          helperText={formErrors.joinRequest ? 'Cannot be empty.' : ''}
          sx={{ mb: 2, width: { sm: '100%', md: '50%' } }}
        />
        <InfoHeader title='Select which Interests To Show' />
        <Typography variant='subtitle1'>
          These are your account's interests. Click to remove ones you don't want in your join request
        </Typography>
        <FlexBox>
          <ScrollContainer thin horizontal='true'
            sx={{
              height: '45px', border: '3px solid #ad9fa3',
              width: { sm: '100%', md: '50%' }
            }}
          >
            {selectedTags.map((tag, idx) => (
              <Chip id={tag.name} key={idx} clickable color='success' label={tag.name}
                onClick={handleSelect} sx={{ m: 0.5 }} />
            ))}
          </ScrollContainer>
          {rePopulateTags
            ? <Button variant='contained' onClick={() => setSelectedTags(account.tags)}
              size='small' color='info' sx={{ ml: 2, mt: 1, mb: 1 }}
            >
              Add tags back
            </Button>
            : ''
          }
        </FlexBox>

        <Button variant='contained' color='success' type='submit' sx={{ mt: 2 }}>
          Submit Join Request
        </Button>
      </Box>

    </ScrollContainer>
  )
}

export default RequestJoinPage