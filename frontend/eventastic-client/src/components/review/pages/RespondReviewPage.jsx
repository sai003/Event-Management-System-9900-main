import { ScrollContainer } from "../../styles/layouts.styled"
import { Box, Button, TextField } from "@mui/material"
import { styled } from '@mui/material/styles';
import * as React from 'react';
import ReviewAPI from "../../../utils/ReviewAPIHelper";

const review_api = new ReviewAPI();

const ContentBox = styled('div')`
  width: 60%;
  height: 70%;
  min-height: 350px;
`;
const RespondReviewPage = ({ refresh,setRefresh,reviews, replyReviewId, setPage, setReviews }) => {
const [replyText, setReplyText] = React.useState('');
  const handleSubmit = (event) => {
    // setReviews(prevState => { return { ...prevState, newReview } })
    event.preventDefault();
    setPage('listReviews')
    var data = {"reply_text":replyText}
    var review_id = replyReviewId //replace 1 with actual review ID
    review_api
        .putReview(review_id,data) 
        .then((response) => {
          for (var i = 0; i < reviews.length; i++) {
            if(reviews[i].review_id === replyReviewId )
            {
              reviews[i].reply_text = data.reply_text;
              break;
            }
          }
          setReviews(reviews)
          setRefresh(!refresh)
          })
        .catch((err) => console.log(err));
  }

  return (
    <ScrollContainer thin>
      <Box id='form' component="form" onSubmit={handleSubmit}>
      <ContentBox >
          <div style={{  marginBottom: '50px'}}>
            <h2>My Response:</h2>
          </div>
          
          <div>
          <b>Please write a response to your customer below!:</b>
          <TextField
            name="replyText"
            required
            fullWidth
            inputProps={{ maxLength: 1000 }}
            id="replyText"
            multiline
            rows={10}
            value={replyText}
              onChange={(event) => {
                setReplyText(event.target.value);
              }}
            InputLabelProps={{ shrink: true }}
          
          />
          <br></br>
          <br></br>
          <br></br>
          
          </div>

        </ContentBox>
        <Button variant='contained' type='submit'>
          Post Reply
        </Button>
      </Box>

    </ScrollContainer>
  )
}

export default RespondReviewPage
