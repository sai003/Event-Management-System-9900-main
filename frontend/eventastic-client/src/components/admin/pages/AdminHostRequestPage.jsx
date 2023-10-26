import { useState, useEffect } from 'react';
import AccountAPI from "../../../utils/AccountAPIHelper";
import HostRequestCard from '../HostRequestCard'
import { ScrollContainer } from '../../styles/layouts.styled';

const api = new AccountAPI();

const ApproveHostScreen = () => {
  const [hostRequestsList, setHostRequestsList] = useState([])

  useEffect(() => {
    let param = {
      host_status: 'Pending'
    }
    api
      .getHostRequests(param)
      .then((response) => setHostRequestsList(response.data))
      .catch((err) => console.log(err));
  }, [])

  return (
    <ScrollContainer hide flex='true' wrap='wrap' align='start'>
      {hostRequestsList.map((hostRequest, idx) => 
        <HostRequestCard 
          key={idx} hostRequest={hostRequest} setRequests={setHostRequestsList}
        />
      )}
    </ScrollContainer>
  )

}


export default ApproveHostScreen