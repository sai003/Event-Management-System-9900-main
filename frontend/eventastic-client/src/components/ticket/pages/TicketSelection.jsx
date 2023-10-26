import { useState, useEffect } from 'react';
import { ScrollContainer } from "../../styles/layouts.styled"
import { Button, InputLabel, Select, MenuItem } from "@mui/material"
import { styled } from '@mui/material/styles';

const MainBox = styled('div')`
  width: 100%;
  margin-left: 50px;
`;

const ContentBox = styled('div')`
  width: 100%;
  height: 70%;
  min-height: 350px;
`;

const ButtonBox = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
`;

const SeatsBox = styled('div')`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%
`;

const PriceBox = styled('div')`
  width: 60%
`;

const SelectionBox = styled('div')`
  width: 10%
`;

const SoldOutBox = styled('div')`
  width: 30%;
  margin-top: 13px;
`;

const TicketSelection = ({ open, setPage, generalSeats, frontSeats, middleSeats, backSeats, 
  setGeneralSeats, setFrontSeats, setMiddleSeats, setBackSeats,
  maxGeneralSeats, maxFrontSeats, maxMiddleSeats, maxBackSeats,
  generalPrice, frontPrice, middlePrice, backPrice, setTotalCost }) => {

    const changeGeneralSelect = (e) => {
      setGeneralSeats(e.target.value)
      setTotalCost(((generalPrice*e.target.value + frontPrice*frontSeats + middlePrice*middleSeats + backPrice*backSeats) * 1.03).toFixed(2))
    }
    const changeFrontSelect = (e) => {
      setFrontSeats(e.target.value)
      setTotalCost(((generalPrice*generalSeats + frontPrice*e.target.value + middlePrice*middleSeats + backPrice*backSeats) * 1.03).toFixed(2))
    }
    const changeMiddleSelect = (e) => {
      setMiddleSeats(e.target.value)
      setTotalCost(((generalPrice*generalSeats + frontPrice*frontSeats + middlePrice*e.target.value + backPrice*backSeats) * 1.03).toFixed(2))
    }
    const changeBackSelect = (e) => {
      setBackSeats(e.target.value)
      setTotalCost(((generalPrice*generalSeats + frontPrice*frontSeats + middlePrice*middleSeats + backPrice*e.target.value) * 1.03).toFixed(2))
    }

  return (
    <ScrollContainer hide height='100%' sx={{ width: '60%' }}>   
      <MainBox>
        <ContentBox >
          <div style={{  marginBottom: '20px'}}>
            <b>Seat Selection:</b>
          </div>
          <div>
            { generalPrice >= 0 &&
            <SeatsBox>
              <PriceBox>
                General Seats: 
                <br></br>
                A$ {generalPrice}
              </PriceBox>
              <SelectionBox>
                <Select
                  labelId="seats-select-label"
                  id="seats-select"
                  value={generalSeats}
                  disabled={parseInt(maxGeneralSeats.length) === 0}
                  label="General Seats"
                  onChange={changeGeneralSelect}
                >
                <MenuItem value={0}>0</MenuItem>
                {maxGeneralSeats.map((idx) => <MenuItem key={idx} value={idx}>{idx}</MenuItem>)}
                </Select>
              </SelectionBox> 
              { parseInt(maxGeneralSeats.length) === 0 &&     
              <SoldOutBox style={{ color: 'grey' }}>
                *Sold Out
              </SoldOutBox> 
              }
            </SeatsBox>
            }

            { frontPrice >= 0 &&
            <SeatsBox>
              <PriceBox>
                Front Seats: 
                <br></br>
                A$ {frontPrice}
              </PriceBox>
              <SelectionBox>
                <Select
                  labelId="front-seats-select-label"
                  id="front-seats-select"
                  value={frontSeats}
                  disabled={parseInt(maxFrontSeats.length) === 0}
                  label="Front Seats"
                  onChange={changeFrontSelect}
                >
                <MenuItem value={0}>0</MenuItem>
                {maxFrontSeats.map((idx) => <MenuItem key={idx} value={idx}>{idx}</MenuItem>)}
                </Select>
              </SelectionBox> 
              { parseInt(maxFrontSeats.length) === 0 &&     
              <SoldOutBox style={{ color: 'grey' }}>
                *Sold Out
              </SoldOutBox> 
              }
            </SeatsBox>
            }

            { middlePrice >= 0 &&
            <SeatsBox>
              <PriceBox>
                Middle Seats: 
                <br></br>
                A$ {middlePrice}
              </PriceBox>
              <SelectionBox>
                <Select
                  labelId="middle-seats-select-label"
                  id="middle-seats-select"
                  value={middleSeats}
                  disabled={parseInt(maxMiddleSeats.length) === 0}
                  label="Middle Seats"
                  onChange={changeMiddleSelect}
                >
                <MenuItem value={0}>0</MenuItem>
                {maxMiddleSeats.map((idx) => <MenuItem key={idx} value={idx}>{idx}</MenuItem>)}
                </Select>
              </SelectionBox> 
              { parseInt(maxMiddleSeats.length) === 0 &&     
              <SoldOutBox style={{ color: 'grey' }}>
                *Sold Out
              </SoldOutBox> 
              }
            </SeatsBox>
            }

            { backPrice >= 0 &&
            <SeatsBox>
              <PriceBox>
                Back Seats: 
                <br></br>
                A$ {backPrice}
              </PriceBox>
              <SelectionBox>
                <Select
                  labelId="back-seats-select-label"
                  id="back-seats-select"
                  value={backSeats}
                  disabled={parseInt(maxBackSeats.length) === 0}
                  label="Back Seats"
                  onChange={changeBackSelect}
                >
                <MenuItem value={0}>0</MenuItem>
                {maxBackSeats.map((idx) => <MenuItem key={idx} value={idx}>{idx}</MenuItem>)}
                </Select>               
              </SelectionBox>  
              { parseInt(maxBackSeats.length) === 0 &&     
              <SoldOutBox style={{ color: 'grey' }}>
                *Sold Out
              </SoldOutBox> 
              }
            </SeatsBox>
            }
          </div>
        </ContentBox>
        <ButtonBox>
          <Button variant='contained' disabled={generalSeats<1 && frontSeats<1 && middleSeats<1 && backSeats<1} onClick={() => setPage('paymentOptions')}>
            checkout
          </Button>
        </ButtonBox>
      </MainBox>   
    </ScrollContainer>
  )
}

export default TicketSelection
