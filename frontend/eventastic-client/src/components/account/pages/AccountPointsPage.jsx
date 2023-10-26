import { useEffect, useContext, useState } from 'react';
import AccountAPI from '../../../utils/AccountAPIHelper';
import EventAPI from '../../../utils/EventAPIHelper';
import { StoreContext } from '../../../utils/context';
import { ScrollContainer, FlexBox } from "../../styles/layouts.styled"
import { Typography } from '@mui/material';

const accountApi = new AccountAPI();
const eventApi = new EventAPI();

const AccountPointsPage = () => {
  const context = useContext(StoreContext);
  const [account, setAccount] = context.account;
  const [PendingPoints, setPendingPoints] = useState([]);

  useEffect(() => {
    const params = {
      account_id: account.account_id,
      reward_points_status: 'Pending'
    }
    eventApi.getRewardPoints(params)
      .then((res) => {
        setPendingPoints(res.data.reduce((sum, pointObj) => {
          return sum + (pointObj.reward_points_status === 'Pending' ? pointObj.reward_points_amount : 0)
        }, 0))
      })
      .catch((err) => console.error(err))

    accountApi.getAccount(account.account_id)
      .then((res) => setAccount(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <ScrollContainer thin pr='1vw'>
      <Typography variant='subtitle1'>
        Accumulate reward points by purchasing tickets to events. Once you have enough points
        you can use them to purchase tickets instead of using money!<br></br>Pending points will be awarded
        once you have attended the respective event.
      </Typography>
      <FlexBox sx={{ mt: 2 }}>
        <Typography variant='subtitle1' sx={{ color: 'evenTastic.grey', fontWeight: 1000, mr: 2 }}>
          Your points:
        </Typography>
        <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
          {account.reward_points ? account.reward_points : 0}
        </Typography>
      </FlexBox>
      <FlexBox sx={{ mt: 2 }}>
        <Typography variant='subtitle1' sx={{ color: 'evenTastic.grey', fontWeight: 1000, mr: 2}}>
          Points pending:
        </Typography>
        <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
          {PendingPoints}
        </Typography>
      </FlexBox>
    </ScrollContainer>
  )
}

export default AccountPointsPage