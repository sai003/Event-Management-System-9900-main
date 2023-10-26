import { useEffect, useState } from "react"
import { styled } from '@mui/material/styles';
import EventAPI from "../../../utils/EventAPIHelper"
import AccountAPI from "../../../utils/AccountAPIHelper"
import { ScrollContainer, FlexBox } from "../../styles/layouts.styled"
import Button from '@mui/material/Button';
import { Typography, Avatar } from "@mui/material";

const api = new EventAPI()
const apiAccount = new AccountAPI()

const ItemBox = styled('div')`
  width: 93%;
  margin-top: 8px;
  margin-left: 20px;
`;

const FlaggedByBox = styled('div')`
  width: 90%;
  margin-top: 10px;
  margin-left: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const ButtonBox = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const CountBoldBox = styled('b')`
  background-color: grey;
  color: white;
  border-radius: 3px;
  padding: 1px 4px 5px 3px;
`;

const CheckReviewBox = ({ review, setToRemove }) => {

  const approveReview = async (e) => {
    try {
      let review_params = {
        flag_count: 0,
        review_status: 'Active'
      }
      api.putReviews(e.target.value, review_params)
      setToRemove(e.target.value)
    }
    catch (err) {
      console.error(err)
    }
  }

  const deleteReview = async (e) => {
    try {
      let review_params = {
        flag_count: 0,
        review_status: 'Removed'
      }
      api.putReviews(e.target.value, review_params)
    setToRemove(e.target.value)
    }
    catch (err) {
      console.error(err)
    }
  }

  return (
    <FlexBox id={review.review_id} sx={{ border: '5px inset white', margin: '30px 40px'}}>
      <div style={{ width: '100%', backgroundColor: 'white' }}>
        <ItemBox style={{ display:'flex', flexDirection: 'row' }}>
            <img style={{ marginRight: '10px', borderRadius: '8px' }}
            src={review.event_img}
            width="7%"
            alt="Event thumbnail"
            id = {review.event_id}
          >
          </img>
          <Typography variant="body" style={{ marginTop: '5px' }} >
            <b>{review.event_title}</b> <br></br>
          </Typography>
        </ItemBox>
        <ItemBox style={{ display:'flex', flexDirection: 'row' }}>
            <Avatar sx={{ width: 30, height: 30, marginLeft: '10px', marginRight: '10px' }}
            src={review.account_img}
            />
          {review.review_text}<br></br>
        </ItemBox>
        <FlaggedByBox>
          <div>
            <b>Flagged by:</b> {review.flag_count} users
          </div>
          <div>
            <b>Rating:</b> {review.rating}
          </div>
          <div>
            <b>Upvotes:</b> {review.upvotes}<br></br>
          </div>
        </FlaggedByBox>
        <ButtonBox>
          <Button variant='contained' value={review.review_id} color="success" onClick={approveReview}
          style= {{ marginRight: '20px' }}>
            Approve
          </Button>
          <Button variant='contained' value={review.review_id} color="error"  onClick={deleteReview}>
            Delete
          </Button>
        </ButtonBox>
      </div> 
    </FlexBox>
  )
}

const AdminReviewsPage = () => {  
  const [reviews, setReviews] = useState([])
  const [toRemove, setToRemove] = useState(-1)

  const getFlaggedReviews = async () => {
    try {
    let getReviews = await api.getReviews()

    if (getReviews.data.length > 0) {
      getReviews.data = getReviews.data.filter((review) => review.flag_count > 2)
    }      

    if (getReviews.data.length > 0) {

      let bookedEventsRes = await Promise.all(getReviews.data.map((review, idx) => {
        return api.getEventDetails(review.event_id).then((res) => res.data)
      }))    
      
      let flaggedReviews = getReviews.data.map((review, idx) => (
        {
          review_id: review.review_id,
          flag_count: review.flag_count,
          rating: review.rating,
          upvotes: review.upvotes,
          review_text: review.review_text,
          event_id: review.event_id,

          event_title: bookedEventsRes[idx].event_title,
          event_img: bookedEventsRes[idx].event_img,
          
          account_img: '',
        }
      ))

      setReviews(flaggedReviews)

      let accountRes = await Promise.all(getReviews.data.map((review, idx) => {
        return apiAccount.getAccount(review.reviewer_account_id).then((res) => res.data)
      }))
      
      flaggedReviews = getReviews.data.map((review, idx) => (
        {
          review_id: review.review_id,
          flag_count: review.flag_count,
          rating: review.rating,
          upvotes: review.upvotes,
          review_text: review.review_text,
          event_id: review.event_id,

          event_title: bookedEventsRes[idx].event_title,
          event_img: bookedEventsRes[idx].event_img,
          
          account_img: accountRes[idx].profile_pic,
        }
      ))

      setReviews(flaggedReviews)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getFlaggedReviews()
  }, [])

  useEffect(() => {
    setReviews(reviews.filter((review) => parseInt(review.review_id) !== parseInt(toRemove)))
  }, [toRemove])

  return (
    <ScrollContainer id="Scroll" style={{ backgroundColor: '#DCDCDC', height: '100%' }}>
      <div>
        {reviews.map((review, idx) => (
            <CheckReviewBox key={idx} review={review} setToRemove={setToRemove} />
          ))}
      </div>
    </ScrollContainer>
  )
}

export default AdminReviewsPage