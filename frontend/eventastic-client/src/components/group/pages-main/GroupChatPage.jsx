import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FlexBox, ScrollContainer } from '../../styles/layouts.styled'
import { Avatar, Container, IconButton, Card, TextField, Tooltip, Typography, styled } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';

let socket;
const CHAT_ENDPOINT = "http://localhost:9090";

const MsgBody = styled(Card)`
  padding-left: 8px;
  padding-right: 16px;
  min-height: 40px;
  border-radius: 50px;
  max-width: 30vw;
`

const Message = ({ self, user, text, userDetails, groupMemberDetails }) => {
  return (
    <FlexBox justify={
      self === user ? 'flex-end' : user === 'evenTastic' ? 'center' : 'flex-start'}
      sx={{ mt: 1.5, ml: 3, mr: 3 }}
    >
      {(() => {
        if (self === user) {
          return (
            <MsgBody sx={{ bgcolor: '#45a7dd' }}>
              <Typography sx={{ ml: 1, mt: 1, color: 'white' }}>
                {text}
              </Typography>
            </MsgBody>
          )
        }
        else if (user === 'evenTastic') {
          return (
            <MsgBody sx={{ ml: 1.5, bgcolor: 'evenTastic.layout' }}>
              {Number.isInteger(parseInt(text[0]))
                ? <Typography sx={{ ml: 1, mt: 1 }}>
                  {groupMemberDetails[parseInt(text.split(' ')[0])].first_name} {text.slice((text.split(' ')[0]).length)}
                </Typography>
                : <Typography sx={{ ml: 1, mt: 1 }}>
                  {text}
                </Typography>
              }
            </MsgBody>
          )
        }
        else {
          return (
            <FlexBox>
              <Tooltip title={userDetails.first_name} enterDelay={10}>
                <Avatar src={userDetails.profile_pic && userDetails.profile_pic} />
              </Tooltip>
              <MsgBody sx={{ ml: 1.5, bgcolor: '#b7b7b7' }}>
                <Typography sx={{ ml: 1, mt: 1, color: 'white' }}>
                  {text}
                </Typography>
              </MsgBody>
            </FlexBox>
          )
        }
      })()}
    </FlexBox>
  )
}

const GroupChatPage = ({ groupDetails, account, groupMemberDetails }) => {
  const [userName] = useState(account.account_id);
  const [groupName] = useState(groupDetails.group_name);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const ref = useRef(null);

  const scrollTo = () => {
    ref.current.scrollIntoView()
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {

      socket.emit("sendMessage", { message });
      setMessage("");
    }
  };

  useEffect(() => {
    socket = io(CHAT_ENDPOINT);
    socket.emit("join", { userName, groupName }, (error) => {
      if (error) {
        console.log(error);
      }
    });
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.disconnect()
    }
  }, []);

  useEffect(() => {
    setTimeout(scrollTo, 100)
  }, [messages])

  return (
    <Container maxWidth='lg' sx={{}}>
      <ScrollContainer thin height='60vh' sx={{ borderLeft: '1px solid #b5b5b5', borderRight: '1px solid #b5b5b5', pb: 2 }}>
        {messages.map((val, idx) => {
          return (
            <Message
              key={idx}
              self={userName}
              user={val.user}
              text={val.text}
              userDetails={groupMemberDetails[parseInt(val.user)]}
              groupMemberDetails={groupMemberDetails}
            />
          );
        })}
        <div ref={ref} />
      </ScrollContainer>
      <FlexBox justify='center' component='form' action="" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          name="message"
          id="message"
          type="text"
          autoFocus
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
          sx={{ width: '50vw' }}
        >
        </TextField>
        <IconButton type="submit">
          <SendIcon />
        </IconButton >
      </FlexBox>
    </Container>
  )
}

export default GroupChatPage