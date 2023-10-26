import { styled } from '@mui/material/styles';
import { Container as muiContainer, Box } from '@mui/material';


export const FlexBox = styled(Box)`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  flex-grow: ${({ grow }) => grow};
  flex-wrap: ${({ wrap }) => wrap};
  gap: ${({ gap }) => gap};
`;


export const Container = styled(muiContainer)`
  margin: ${({ m }) => m};
  margin-left: ${({ ml, theme }) => ml ? theme.spacing(ml) : 0};
  margin-right: ${({ mr, theme }) => mr ? theme.spacing(mr) : 0};
  margin-top: ${({ mt, theme }) => mt ? theme.spacing(mt) : 0};
  margin-bottom: ${({ mb, theme }) => mb ? theme.spacing(mb) : 0};
  padding: ${({ p }) => p};
  padding-left: ${({ pl, theme }) => pl ? theme.spacing(pl) : 0};
  padding-right: ${({ pr, theme }) => pr ? theme.spacing(pr) : 0};
  padding-top: ${({ pt, theme }) => pt ? theme.spacing(pt) : 0};
  padding-bottom: ${({ pb, theme }) => pb ? theme.spacing(pb) : 0};
`;


export const PageContainer = styled(muiContainer)`
  height: 100%;
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  overflow-y: auto;
`;

export const ScrollContainer = styled(Box)`
  overflow-y: auto;
  width: 100%;
  height: ${({ height }) => height ? height : '93%'};
  display: ${({ flex }) => flex ? 'flex' : 'inherit'};
  flex-wrap: ${({ wrap }) => wrap};
  align-items: ${({ align }) => align};
  padding-right: ${({ pr }) => pr ? pr : 0};
  white-space: ${({ horizontal }) => horizontal ? 'nowrap' : 'normal'};

  ${({ hide }) => {
    if (hide) {
      return `::-webkit-scrollbar {width:1px};`
    }
  }};

  ${({ thin }) => {
    if (thin) {
      return `
        ::-webkit-scrollbar {
        width: 0.5vw;
        height: 0.5vh;
      }

      ::-webkit-scrollbar-thumb {
        background: #7775;
        -webkit-border-radius: 1ex;
        
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #777;
      }

      ::-webkit-scrollbar-track {
        background: #5555551f;
      }

      ::-webkit-scrollbar-track:hover {
        background: #55555547;
      }
      `
    }
  }};

`
