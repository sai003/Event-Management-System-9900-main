import { useNavigate, useLocation } from "react-router-dom";
import { SideBar, SideBarTitle, SideBarItem } from "../styles/sidebar/sidebar.styled";
import { Divider, List, styled } from '@mui/material';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import GradingIcon from '@mui/icons-material/Grading';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

export const SideBarButton = styled('button')`
  width: 200px;
  height: 30px;
  margin-top: 20px;
`;

const AccountSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <SideBar>
        <SideBarTitle variant='h6'>
          Admin Menu
        </SideBarTitle>
        <Divider variant="middle" sx={{ mb: 2 }} />
        <List>
          <SideBarItem 
            title='Set Venues'
            selected={location.pathname === '/admin/createVenues' ? true : false}
            onClick={() => navigate("/admin/createVenues")}
          >
            <DomainAddIcon />
          </SideBarItem>
          <SideBarItem 
            title='Manage reviews' 
            selected={location.pathname === '/admin/approveReviews' ? true : false}
            onClick={() => navigate("/admin/approveReviews")}
          >
            <GradingIcon />
          </SideBarItem>
          <SideBarItem 
            title='Host requests' 
            selected={location.pathname === '/admin/approveHosts' ? true : false}
            onClick={() => navigate("/admin/approveHosts")}
          >
            <RequestQuoteIcon />
          </SideBarItem>
        </List>
    </SideBar>
  )
}

export default AccountSideBar