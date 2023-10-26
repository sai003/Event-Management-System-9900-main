import { 
    Typography,
    styled,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";

export const SideBar = styled('div')`
display: flex;
flex-direction: column;
flex-grow: 1;
border: 3px solid #ad9fa3;
margin-right: 1rem;
margin-bottom: 1rem;
max-width: 225px;
min-width: 225px;
`;

export const SideBarTitle = styled(Typography)`
align-self: center;
margin-top: 1rem;
`

export const SideBarItem = ({ title, onClick, children, selected }) => {
  return (
    <ListItemButton onClick={onClick} selected={selected}>
      <ListItemIcon>
        {children}
      </ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  )
}