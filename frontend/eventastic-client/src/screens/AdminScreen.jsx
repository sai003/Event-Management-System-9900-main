import { useContext, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/styles/layouts.styled'
import AdminSideBar from '../components/admin/AdminSideBar'
import AdminVenuePage from '../components/admin/pages/AdminVenuePage'
import AdminReviewsPage from '../components/admin/pages/AdminReviewsPage'
import AdminHostRequestPage from '../components/admin/pages/AdminHostRequestPage'
import { styled } from '@mui/material';

export const AdminContainer = styled('div')`
  flex-grow: 7;
  border: 3px solid #ad9fa3;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const AdminScreen = () => {
  const navigate = useNavigate()
  const context = useContext(StoreContext);
  const [account] = context.account;

  useEffect(() => {
    !account.admin && navigate('/unauthorized') 
  }, [])

  return (
    <PageContainer direction='row' maxWidth='lg'>
      <AdminSideBar />
      <AdminContainer>
      <Routes>
        <Route exact path='/createVenues' element={<AdminVenuePage />} />
        <Route exact path='/approveReviews' element={<AdminReviewsPage />} />
        <Route exact path='/approveHosts' element={<AdminHostRequestPage />} />
      </Routes>
      </AdminContainer>
    </PageContainer>
  )
}

export default AdminScreen