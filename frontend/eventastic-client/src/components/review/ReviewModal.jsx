import { useEffect, useContext, useState } from 'react';
import { StoreContext } from '../../utils/context';
import ReviewListPage from './pages/ReviewListPage';
import MakeReivewPage from './pages/MakeReivewPage';
import RespondReviewPage from './pages/RespondReviewPage';
import { FlexBox } from '../styles/layouts.styled';
import { StyledTitle, LargeModal, ModalBodyLarge } from '../styles/modal/modal.styled';
import { Button, Divider, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ReviewAPI from '../../utils/ReviewAPIHelper';
import ReviewSuccessModal from './pages/ReviewSuccessModal';

const review_api = new ReviewAPI();

const options = [
  'Most Upvoted',
  'Most Recent',
  'Most Rated'
];

const ReviewModal = ({ open, setOpen, eventDetails }) => {
  const context = useContext(StoreContext);
  const [account, setAccount] = context.account;
  const [page, setPage] = useState('listReviews');
  const [madeReview, setMadeReview] = useState(false)
  const [reviews, setReviews] = useState([])
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const openMenu = Boolean(anchorEl);
  const [refresh, setRefresh] = useState(false);
  const [replyReviewId, setReplyReviewId] = useState(1);
  const [reviewSuccessModal, setReviewSuccessModal] = useState(false);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setPage('listReviews'), 200);
  }

  useEffect(() => {
    if(Object.keys(eventDetails).length !== 0)
    {
      review_api
      .getReviewList({event_id:parseInt(eventDetails.event_id),interaction_acount_id:account.account_id})
      .then((response)=>{
        var revs = response.data
        revs.sort((r1,r2)=>{
          return parseInt(r2.upvotes) - parseInt(r1.upvotes)
        })
        setReviews(revs)
        setMadeReview(revs.filter((rev)=>rev.reviewer_account_id===account.account_id).length !== 0)
      })
      .catch((err)=>console.log(err));
    }
    // api call: 
    // Get /bookings setReviews()
    // Determine all account_id review interactions
    // setMadeReivew() // Determine if account_id has made a reivew or not
  }, [eventDetails])


  //Reply button should be under each review and should be visible only to hosts
  return (
    <LargeModal open={open} onClose={handleClose} aria-labelledby="Review modal" maxWidth='lg'>
      <StyledTitle direction='column'>
        <FlexBox justify='center'>
          <Typography variant='h5' sx={{ml:'auto'}}>
            Reviews for {eventDetails.event_title}
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} sx={{ml:'auto'}}>
            <CloseIcon />
          </IconButton>
        </FlexBox>
        {page !== 'listReviews'
          ? ''
          : <FlexBox justify='space-between' sx={{mt:2, mb:2}}>
            <Button 
              variant='contained' color='success' disabled={parseInt(eventDetails.account_id) === parseInt(account.account_id) || madeReview}
              onClick={() => setPage('makeReivew')}  
            >
              Write a review
            </Button>
            <Button variant="contained" endIcon={<FilterAltIcon />} 
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-label="filter by"
                aria-expanded={openMenu ? 'true' : undefined}
                onClick={handleClickListItem}
            >
                  Filter By: {options[selectedIndex]}
            </Button>
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleCloseMenu}
              MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox',
              }}
            >
              {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    selected={index === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
            </Menu>
            
          </FlexBox>
        }
      </StyledTitle>
      <Divider variant="middle" sx={{ mb: 2 }} />
      <ModalBodyLarge>
        {(() => {
          if (page === 'listReviews') {
            return ( 
                 <ReviewListPage setReplyReviewId={setReplyReviewId} refresh={refresh} setRefresh={setRefresh} reviews={reviews} setReviews={setReviews} account={account} selectedIndex={selectedIndex}
                 eventDetails={eventDetails} setPage={setPage}/>
            )
          }
          else if (page === 'makeReivew') {
            return (
              <MakeReivewPage setMadeReview={setMadeReview} refresh={refresh} setRefresh={setRefresh} reviews={reviews} setPage={setPage} setReviews={setReviews} eventDetails={eventDetails} account={account} setReviewSuccessModal={setReviewSuccessModal}/>
            )
          }
          else if (page === 'makeResponse') {
            return (
              <RespondReviewPage refresh={refresh} setRefresh={setRefresh} reviews={reviews} replyReviewId={replyReviewId} setPage={setPage} setReviews={setReviews} />
            )
          }
        })()}
        <ReviewSuccessModal
        open={reviewSuccessModal}
        setOpen={setReviewSuccessModal}
        />
      </ModalBodyLarge>
    </LargeModal>
  
  )
}

export default ReviewModal


