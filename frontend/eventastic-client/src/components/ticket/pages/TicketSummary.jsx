import { ScrollContainer } from "../../styles/layouts.styled"
import { styled } from '@mui/material/styles';

const SeatsBox = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TicketSummary = ({ generalSeats, frontSeats, middleSeats, backSeats, generalPrice, frontPrice, middlePrice, backPrice, totalCost }) => {

  return (
    <ScrollContainer hide height='100%' sx={{ width:'40%', marginLeft: '20px' }}>
      <div style={{  width: '70%'}}>
        <div style={{  marginBottom: '20px'}}>
          <b>Summary:</b>
        </div>
        {generalSeats > 0 &&        
          <SeatsBox>
            <div>
              {generalSeats} x General
            </div>
            <div>
              A$ {(generalPrice * generalSeats).toFixed(2)}
            </div>
          </SeatsBox>
        }
        {frontSeats > 0 &&        
          <SeatsBox>
            <div>
              {frontSeats} x Front
            </div>
            <div>
              A$ {(frontPrice * frontSeats).toFixed(2)}
            </div>
          </SeatsBox>
        }
        {middleSeats > 0 &&        
          <SeatsBox>
            <div>
              {middleSeats} x Middle
            </div>
            <div>
              A$ {(middlePrice * middleSeats).toFixed(2)}
            </div>
          </SeatsBox>
        }
        {backSeats > 0 &&        
          <SeatsBox>
            <div>
              {backSeats} x Back
            </div>
            <div>
              A$ {(backPrice * backSeats).toFixed(2)}
            </div>
          </SeatsBox>
        }

        {(generalSeats > 0 || frontSeats > 0 || middleSeats > 0 || backSeats > 0) &&  
          <SeatsBox style={{marginTop: '50px'}}>
            <div>
              Eventastic Fees (@3%): 
            </div>
            <div>
              A$ {((generalPrice*generalSeats + frontPrice*frontSeats + middlePrice*middleSeats + backPrice*backSeats) * 0.03).toFixed(2)}
            </div>
          </SeatsBox>
        }

        {(generalSeats > 0 || frontSeats > 0 || middleSeats > 0 || backSeats > 0) &&  
          <SeatsBox style={{marginTop: '30px'}}>
            <div>
              Total Amount: 
            </div>
            <div>
            A$ { totalCost }
            </div>
          </SeatsBox>
        }
      </div>
    </ScrollContainer>
  )
}

export default TicketSummary