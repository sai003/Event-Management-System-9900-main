import { useContext } from 'react';
import { StoreContext } from '../../../utils/context';
import { useNavigate } from 'react-router-dom';
import { ScrollContainer } from '../../styles/layouts.styled';
import InfoHeader from '../styles/InfoHeader';
import { Button, Chip, styled, Typography } from '@mui/material';

const StyledTagContainer = styled('div')`
  border: 3px solid #ad9fa3;
  border-radius: 10px;
  padding: 0.25rem;
  margin-bottom: 1rem;
  overflow: hidden;
`

const AccountInterestPage = () => {
  const navigate = useNavigate()
  const context = useContext(StoreContext);
  const [account] = context.account;

  return (
    <ScrollContainer hide>
      <InfoHeader title='Your interests influence what events we recommend,
       and help with group formation!'/>
      <StyledTagContainer>
        <ScrollContainer thin flex='true' wrap='wrap' align='start' sx={{ maxHeight: '50vh' }}>
          {account.tags.length === 0
            ? <Typography variant='subtitle1' sx={{ ml: 1 }}>
              You have no interest ...
            </Typography>
            : account.tags.map((tag, idx) => (
              <Chip key={idx} label={tag.name}
                color={'success'}
                sx={{ m: 0.5 }} />
            ))
          }
        </ScrollContainer>
      </StyledTagContainer>
      <Button variant='contained' onClick={() => navigate('/tags')}>
        Update my interests
      </Button>
    </ScrollContainer>
  )
}

export default AccountInterestPage