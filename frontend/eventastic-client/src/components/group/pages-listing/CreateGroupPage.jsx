import { useState } from "react"
import { fileToDataUrl } from "../../../utils/helpers"
import GroupAPI from "../../../utils/GroupAPIHelper"
import InfoHeader from "../../account/styles/InfoHeader"
import { ScrollContainer } from "../../styles/layouts.styled"
import { Button, Grid, TextField, Typography, styled } from "@mui/material"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const api = new GroupAPI();

const ImageHolder = styled(Button)`
  border: 1px solid black;
  cursor: pointer;
  width: 100%;
  height: 100%;
  max-width: 380px;
  max-height: 380px;
  background-color: ${({ theme }) => theme.palette.evenTastic.dull};
  ${({theme}) => theme.breakpoints.down("md")} {
    min-width: 380px;
    min-height: 380px;
  }
`

const Image = styled('img')`
  max-height: 100%;
  max-width: 100%;
`

const CreateGroupPage = ({ eventID, account, setOpen, setApiGetGroup }) => {
  const [imgUpload, setImageUpload] = useState(false);
  const [formErrors, setFormErrors] = useState({
    error: false,
    groupName: false,
    groupImg: false,
    groupDesc: false,
    groupHostID: false,
  })

  const handleImage = async (event) => {
    const imageFile = event.target.files[0]
    const imageBlob = await fileToDataUrl(imageFile)
    formErrors.groupImg && setFormErrors(prevState => { return { ...prevState, groupImg: false } })
    setImageUpload(imageBlob)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const groupName = data.get('groupName')
    const groupDesc = data.get('groupDesc')

    formErrors.error = false;
    if (!groupName) {
      setFormErrors(prevState => { return { ...prevState, groupName: true } })
      formErrors.error = true
    }
    if (!imgUpload) {
      setFormErrors(prevState => { return { ...prevState, groupImg: true } })
      formErrors.error = true
    }
    if (!groupDesc) {
      setFormErrors(prevState => { return { ...prevState, groupDesc: true } })
      formErrors.error = true
    }

    if (!formErrors.error) {
      try {
        let group = {
          event_id: parseInt(eventID),
          group_desc: groupDesc,
          group_host_id: account.account_id,
          group_img: imgUpload,
          group_name: groupName
        }
        const groupRes = await api.postGroup(group)
        const groupID = groupRes.data.group_id
        const member = {
          group_id: groupID,
          account_id: account.account_id,
          interest_tags: account.tags,
          join_desc: `Hi I am ${account.first_name}, I'm the group admin`,
          join_status: "Accepted"
        }
        const memberRes = await api.postGroupMember(groupID, member)
        setOpen(true)
        setApiGetGroup(true)
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <ScrollContainer thin pr='1vw'>
      <Grid component="form"
        noValidate onSubmit={handleSubmit}
        container spacing={3} sx={{ mt: 0 }}
      >
        <Grid item sm={12} >
          <InfoHeader title='Group Name' />
          <TextField
            name="groupName"
            required
            fullWidth
            id="groupName"
            label="Group Name"
            placeholder='Cool group name'
            onChange={() => {
              formErrors.groupName && setFormErrors(prevState => { return { ...prevState, groupName: false } })
            }}
            error={formErrors.groupName}
            helperText={formErrors.groupName ? 'Must have a group name.' : ''}
            sx={{ maxWidth: { sm: '100%', md: '400px' } }}
          />
        </Grid>
        <Grid item sm={12} md={4}>
          <Typography variant='subtitle1' sx={{ color: 'evenTastic.grey', fontWeight: 1000, mb:1 }}>
            Group Thumbnail
          </Typography>
          <ImageHolder component='label'>
            <input hidden type="file" name="GroupPicture"
              id="GroupPicture" label="GroupPicture" onChange={handleImage}
            />
            {imgUpload
              ? <Image src={imgUpload} alt="Group thumbnail" />
              : <AddAPhotoIcon fontSize='large' color='disabled'/>
            }
          </ImageHolder>
          {formErrors.groupImg
          ? <Typography variant='caption' sx={{color:'#d32f2f'}}>
            Must upload a group picture
          </Typography>
          : ''
          }
        </Grid>
        <Grid item sm={12} md={8}>
        <InfoHeader title='Group Description' />
          <TextField
            name="groupDesc"
            required
            fullWidth
            multiline
            rows={11}
            id="groupDesc"
            label="Group Description"
            placeholder='Enticing group description'
            onChange={() => {
              formErrors.groupDesc && setFormErrors(prevState => { return { ...prevState, groupDesc: false } })
            }}
            error={formErrors.groupDesc}
            helperText={formErrors.groupDesc ? 'Must have a group description.' : ''}
          />
        </Grid>
        <Grid item sm={12} md={5}>
          <Button fullWidth variant='contained' type='submit'
            color='success' sx={{mt:{sm:2, md:6}, width:'80%' }}
          >
            Create Group
          </Button>
        </Grid>        
      </Grid>
    </ScrollContainer>
  )
}

export default CreateGroupPage