import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent } from '@mui/material'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountAPI from "../../utils/AccountAPIHelper";

export const StyledHostCard = styled(Card)`
  border: 0.1px solid black;
  border-radius: 5px;
  margin: 1rem;
  min-height: 200;
  min-width: 300px;
`;

const SaveButtonBox = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const api = new AccountAPI();

const HostRequestCard = ({ hostRequest, setRequests }) => {
  const ApproveHost = (account_id) => {
    let body = {
      is_verified: true,
      host_status: 'Approved'
    }
    api.putHost(account_id, body)
      .then()
      .catch((err) => {console.log(err)})

    setRequests(prevState => prevState.filter((request) =>
      request.account_id !== account_id)
    )
  }

  const DeclineHost = (account_id) => {
    let body = {
      is_verified: false,
      host_status: 'Declined'
    }
    api.putHost(account_id, body)
    .then()
    .catch((err) => {console.log(err)})
    setRequests(prevState => prevState.filter((request) =>
      request.account_id !== account_id )
    )
  }

  return (
    <StyledHostCard>
      <CardHeader  style={{ backgroundColor: '#404040', color: 'white' }} title={hostRequest.org_name} />
      <CardContent>
        <div variant="h6" component="div">
          <b style={{ color: '#484848' }}>Title:</b> {hostRequest.job_title}
        </div>
        <div variant="h6" component="div">
          <b style={{ color: '#484848' }}>Qualification:</b> {hostRequest.qualification}
        </div>
        <div variant="h6" component="div">
          <b style={{ color: '#484848' }}>Email:</b> {hostRequest.org_email}
        </div>
        <div variant="h6" component="div">
          <b style={{ color: '#484848' }}>Mobile:</b> {hostRequest.host_contact_no}
        </div>
        <SaveButtonBox>
          <Button variant="contained" value={hostRequest.account_id} color="success" onClick={(e) => ApproveHost(e.target.value)} >
            Approve
          </Button>
          <Button variant="contained" value={hostRequest.account_id} color="error" onClick={(e) => DeclineHost(e.target.value)} >
            Decline
          </Button>
        </SaveButtonBox>
      </CardContent>
    </StyledHostCard>
  )
}

export default HostRequestCard