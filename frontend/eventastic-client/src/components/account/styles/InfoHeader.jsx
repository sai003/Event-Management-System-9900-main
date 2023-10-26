import { Divider, Typography } from '@mui/material';

const InfoHeader = ({ title }) => {
    return (
      <div>
        <Typography variant='subtitle1' sx={{ color: 'evenTastic.grey', fontWeight: 1000 }}>
          {title}
        </Typography>
        <Divider variant="middle" sx={{ mb: 2 }} />
      </div>
    )
  }

export default InfoHeader