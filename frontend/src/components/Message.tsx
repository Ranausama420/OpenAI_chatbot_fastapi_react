import styled from 'styled-components';

interface MessageProps {
  text: string;
  time: string;
  sender: string;
}


const MessageComp: React.FC<MessageProps> = ({ text, time, sender }) => {
  const isFromSender = sender === 'me';

  const MessageContainer = styled.div<{ isFromSender: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isFromSender ? 'flex-end' : 'flex-start'};
  margin-bottom: 10px;
`;

const MessageText = styled.div<{ isFromSender: boolean }>`
  background-color: ${props => props.isFromSender ? '#DCF8C6' : '#F2F2F2'};
  color: ${props => props.isFromSender ? 'black' : 'inherit'};
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
`;

const MessageTime = styled.span<{ isFromSender: boolean }>`
  font-size: 12px;
  color: #999;
  align-self: ${props => props.isFromSender ? 'flex-end' : 'flex-start'};
`;

  return (
    <MessageContainer isFromSender={isFromSender}>
      <MessageText isFromSender={isFromSender}>{text}</MessageText>
      <MessageTime isFromSender={isFromSender}>{time}</MessageTime>
    </MessageContainer>
  );
};

export default MessageComp;