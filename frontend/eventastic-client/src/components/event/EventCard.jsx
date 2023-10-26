import { useNavigate } from 'react-router-dom';
import { ScrollContainer } from '../styles/layouts.styled';
import { Grid, Card, Chip, CardMedia, CardContent, Typography, styled } from '@mui/material'

export const StyledEventCard = styled(Card)`
  width: 300px;
  height: 410px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #dbdbdb;
  }
`;

const CardTitle = styled('h3')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
  margin-bottom: -10px;
  margin-left: 1rem;
`

export const CardSummary = styled(Typography)`
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TagContainer = styled(ScrollContainer)`
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
  padding-bottom: 5px;
  overflow-x: auto;
`

const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function formatDate(datetime) {
  let d = new Date(datetime);
  return d.toLocaleDateString("en-US", dateFormat)
}

const EventCard = ({ eventData }) => {
  const navigate = useNavigate()

  return (
    <Grid item xs={12} sm={4} md={4} lg={4}>
      <StyledEventCard onClick={() => navigate(`/event/${eventData.event_id}`)}>
        <CardMedia
          component="img"
          height="140"
          image={eventData.event_img}
        />
        <CardTitle>
          {eventData.event_title}
        </CardTitle>
        <CardContent>
          <Typography gutterBottom variant="subtitle2" component="div" sx={{ mt: -0.5 }}>
            {formatDate(eventData.event_start_datetime)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: -1 }}>
            Summary
          </Typography>
          <CardSummary gutterBottom variant="subtitle1" component="div" sx={{ mb: -0.25 }} >
            {eventData.event_short_desc}
          </CardSummary>
          <Typography variant="subtitle1" color="text.secondary">
            Event Category
          </Typography>
          <Chip label={eventData.event_category} color='success' />
          <Typography variant="subtitle1" color="text.secondary">
            Event Tags
          </Typography>
          <TagContainer thin horizontal='true'>
            {eventData.tags.map((tag, idx) => (
              <Chip key={idx} label={tag.name} color='success' sx={{mr: 1}} />
            ))}
          </TagContainer>
        </CardContent>
      </StyledEventCard>
    </Grid>
  )
}

export default EventCard