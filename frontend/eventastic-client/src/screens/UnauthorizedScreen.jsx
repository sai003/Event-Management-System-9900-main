import { PageContainer } from '../components/styles/layouts.styled'
import { Typography } from '@mui/material'

const UnauthorizedScreen = () => {
  return (
    <PageContainer align='center' maxWidth='lg'>
      <Typography variant='h2' sx={{mt:20}}>
        Unauthorized to access this page
      </Typography>
    </PageContainer>
  )
}

export default UnauthorizedScreen