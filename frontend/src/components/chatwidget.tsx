import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane  } from 'react-icons/fa';

interface InputProps {
  onSendMessage: (message: string) => void;
}

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 200%;
  margin-left: 20px;
  
`;

const Input = styled.input`
  width: 200%;
  font-size: 16px;
  padding: 10px 40px 10px 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius:20px;
`;

const Button = styled.button`
  font-size: 16px;
  padding: 10px;
  color: grey;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
`;

const ChatWidget: React.FC<InputProps> = ({onSendMessage }) => {
    const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <InputContainer>
      <Input
        type="text"
        placeholder="Type a message..."
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button type="button" onClick={handleSendClick}>
        <FaPaperPlane  />
      </Button>
    </InputContainer>
  );
};

export default ChatWidget;
