import { ScrollContainer } from "../../styles/layouts.styled"
import { Box, Button, TextField } from "@mui/material"
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import ReviewAPI from "../../../utils/ReviewAPIHelper";


const review_api = new ReviewAPI();

const MainBox = styled('div')`
  width: 100%;
  margin-left: 50px;
`;
const ContentBox = styled('div')`
  width: 60%;
  height: 70%;
  min-height: 350px;
`;

const MakeReivewPage = ({setMadeReview,refresh, setRefresh ,reviews , setPage, setReviews, eventDetails, account, setReviewSuccessModal }) => {

  

const handleSubmit = (event) => {
  // setReviews(prevState => { return { ...prevState, newReview } })
  event.preventDefault();
  setPage('listReviews')

  var current_datetime = new Date();
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  current_datetime = (new Date(current_datetime - tzoffset)).toISOString().slice(0, -5);
  current_datetime = current_datetime + "+10:00"
  var data = {
              "event_id":parseInt(eventDetails.event_id),"reviewer_account_id":parseInt(account.account_id),
              "upvotes":0,"rating":parseInt(rating),"review_text":reviewText,
              "review_timestamp":current_datetime, "review_status":"Active","reply_text":"",
              "flag_count":0
            }
  // console.log(data)

    review_api
        .postReview(data)
        .then((response) => {
          var new_review = response.data
          new_review['review_interaction'] = {}
          review_api
            .getReviewList({event_id:parseInt(eventDetails.event_id),interaction_acount_id:account.account_id})
            .then((response)=>{
              var revs = response.data
              revs.sort((r1,r2)=>{
                return parseInt(r2.upvotes) - parseInt(r1.upvotes)
              })
              setReviews(revs)
              setMadeReview(revs.filter((rev)=>rev.reviewer_account_id===account.account_id).length !== 0)
              setReviewSuccessModal(true)
              setRefresh(!refresh)
            })
            .catch((err)=>console.log(err));

        })
        .catch((err) => console.log(err));
          
}


const [rating, setRating] = React.useState(3);
const [reviewText, setReviewText] = React.useState('');

return (
    <ScrollContainer hide height='100%' sx={{ width: '100%' }}>
      <MainBox>
      <Box id='form' component="form" onSubmit={handleSubmit}>
        <ContentBox >
          <div style={{  marginBottom: '50px'}}>
            <h2>My Review:</h2>
          </div>
          <div>
          <b>How would you rate your experience on a scale of 1 - 5?</b>
          <Box
            sx={{
              '& > legend': { mt: 2 },
            }}
          >
            <Typography component="legend"></Typography>
            <Rating
              name="user-rating"
              value={rating}
              size="large"
              onChange={(event, newRating) => {
                setRating(newRating);
              }}
            />
          </Box>
          
          </div>
          <div>
          <br></br>
          <b>Please let us know the details about your experience!:</b>
          <TextField
            name="reviewText"
            required
            fullWidth
            inputProps={{ maxLength: 1000 }}
            id="reviewText"
            InputLabelProps={{ shrink: true }}
            multiline
            rows={10}
            value={reviewText}
              onChange={(event) => {
                setReviewText(event.target.value);
              }}
          />
          <br></br>
          <br></br>
          <br></br>
          </div>
          
            <Button variant='contained' type='submit'>
              Post Review
            </Button>
          

        </ContentBox>
        </Box>

    </MainBox>
  </ScrollContainer>
)
}

export default MakeReivewPage