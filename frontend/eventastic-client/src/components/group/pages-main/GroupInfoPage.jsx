import { useContext, useEffect, useState } from "react"
import { StoreContext } from "../../../utils/context"
import GroupAPI from "../../../utils/GroupAPIHelper"
import { fileToDataUrl } from "../../../utils/helpers"
import InfoHeader from "../../account/styles/InfoHeader"
import GroupEditedModal from "../modals/GroupEdittedModal"
import { FlexBox, ScrollContainer } from "../../styles/layouts.styled"
import { Button, Chip, TextField, Typography, styled } from "@mui/material"
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';

const api = new GroupAPI()

const ImageHolder = styled(Button)`
  border: 1px solid black;
  cursor: pointer;
  margin-right: 1rem;
  width: 100%;
  height: 100%;
  max-width: 380px;
  max-height: 380px;
  background-color: ${({ theme }) => theme.palette.evenTastic.dull};
  ${({ theme }) => theme.breakpoints.down("md")} {
    min-width: 380px;
    min-height: 380px;
  }
`

const ImageBox = styled('div')`
  margin-right: 1rem;
  width: 380px;
  height: 380px;
`

const Image = styled('img')`
  width: 100%;
  height: 100%;
`

const GroupInfoPage = ({ groupDetails, setGroupDetails, eventDetails, accountID }) => {
  const context = useContext(StoreContext);
  const [accountGroups, setAccountGroups] = context.groups;
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false)
  const [imgUpload, setImageUpload] = useState(false);
  const [isGroupAdmin, setGroupAdmin] = useState(false)
  const [formErrors, setFormErrors] = useState({
    error: false,
    groupName: false,
    groupImg: false,
    groupDesc: false
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
    if (!groupDesc) {
      setFormErrors(prevState => { return { ...prevState, groupDesc: true } })
      formErrors.error = true
    }

    if (!formErrors.error) {
      try {
        let group = {
          group_desc: groupDesc,
          group_img: imgUpload ? imgUpload : groupDetails.group_img,
          group_name: groupName
        }
        const groupRes = await api.putGroup(groupDetails.group_id, group)
        setGroupDetails(groupRes.data)
        const temp = accountGroups
        accountGroups[eventDetails.event_id] = groupRes.data
        setAccountGroups(temp)
        setEdit(false)
        setOpen(true)
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    groupDetails.group_host_id === accountID && setGroupAdmin(true)
  }, [])

  return (
    <ScrollContainer thin pr='1vw' height='97%'>
      <FlexBox component="form" noValidate onSubmit={handleSubmit} wrap='wrap' sx={{ mb: 2 }}>
        {edit
          ? <ImageHolder component='label'>
            <input hidden type="file" name="GroupPicture"
              id="GroupPicture" label="GroupPicture" onChange={handleImage}
            />
            {imgUpload
              ? <Image src={imgUpload} alt="Group thumbnail" />
              : <Image src={groupDetails.group_img} alt="Group thumbnail" />
            }
          </ImageHolder>
          : <ImageBox>
            <Image src={groupDetails.group_img} alt='group thumbnail' />
          </ImageBox>
        }

        <FlexBox direction='column' sx={{ maxWidth: '900px', width: { sm: '100%', md: '55vw' } }} >
          {isGroupAdmin
            ? edit
              ? <FlexBox justify='space-between'>
                <Button variant="contained" color='warning'
                  startIcon={<SettingsIcon />} sx={{ width: '180px', mb: 3, mt: 2 }}
                  onClick={() => setEdit(false)}
                >
                  Cancel Edit
                </Button>
                <Button type='submit' variant="contained" color='success' sx={{ mb: 2, mt: 2 }}>
                  Confirm Changes
                </Button>
              </FlexBox>

              : <Button variant="contained" color='info'
                startIcon={<SettingsIcon />} sx={{ width: '150px', mb: 2, mt: 2 }}
                onClick={() => setEdit(true)}
              >
                Edit Group
              </Button>
            : ''
          }
          <FlexBox>
            <Typography variant='subtitle1' sx={{ color: 'evenTastic.grey', fontWeight: 1000, mt:0.25, mr:2 }}>
              Group Name:
            </Typography>
            {edit
              ? <TextField
                name="groupName"
                required
                fullWidth
                id="groupName"
                label="Group Name"
                placeholder='Cool group name'
                defaultValue={groupDetails.group_name}
                onChange={() => {
                  formErrors.groupName && setFormErrors(prevState => { return { ...prevState, groupName: false } })
                }}
                error={formErrors.groupName}
                helperText={formErrors.groupName ? 'Must have a group name.' : ''}
                sx={{ maxWidth: { sm: '100%', md: '400px' } }}
              />
              : <Typography variant='h5' sx={{ fontWeight: 1000, mb: 2, mr: 1 }}>
                {groupDetails.group_name}
              </Typography>
            }
          </FlexBox>
          <FlexBox sx={{mt:2, mb:1}}>
          <Typography variant='subtitle1' sx={{ color: 'evenTastic.grey', fontWeight: 1000, mr:2 }}>
            Members:
          </Typography>
          <Chip icon={<PeopleAltIcon />} sx={{ maxWidth: '80px', mb: 2 }}
            label={groupDetails.group_members.reduce(
              (total, member) => (total + (member.join_status === 'Accepted' ? 1 : 0)), 0
            )}
          />
          </FlexBox>


          <InfoHeader title='Group description' />
          {edit
            ? <TextField
              name="groupDesc"
              required
              fullWidth
              multiline
              rows={6}
              id="groupDesc"
              label="Group Description"
              placeholder='Enticing group description'
              defaultValue={groupDetails.group_desc}
              onChange={() => {
                formErrors.groupDesc && setFormErrors(prevState => { return { ...prevState, groupDesc: false } })
              }}
              error={formErrors.groupDesc}
              helperText={formErrors.groupDesc ? 'Must have a group description.' : ''}
            />
            : <Typography variant='body1' sx={{ mb: 1 }}>
              {groupDetails.group_desc}
            </Typography>
          }

        </FlexBox>
      </FlexBox>
      <FlexBox direction='column' sx={{ width: { sm: '100%', md: '55vw' } }}>
        <InfoHeader title='Event name' />
        <Typography variant='subtitle1' sx={{ mb: 1 }}>
          {eventDetails.event_title}
        </Typography>
        <InfoHeader title='Start date' />
        <Typography variant='subtitle1' sx={{ mb: 1 }}>
          {eventDetails.event_start_datetime}
        </Typography>
        <InfoHeader title='Location' />
        <Typography variant='subtitle1' sx={{ mb: 1 }}>
          {eventDetails.event_location}
        </Typography>
      </FlexBox>
      <GroupEditedModal open={open} setOpen={setOpen} />
    </ScrollContainer>
  )
}

export default GroupInfoPage