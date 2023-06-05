import React, { useState } from 'react';
import styled from 'styled-components';

interface RadioButton {
  label: string;
}

const RadioButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const RadioButtonLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding-left: 25px;
  font-size: 16px;
  color: #333;
`;

const RadioButtonInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const RadioButtonCustom = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid #eee;

  ${RadioButtonInput}:checked ~ & {
    border-color: #2196f3;
  }

  ${RadioButtonInput}:checked ~ &:after {
    content: '';
    position: absolute;
    display: block;
    top: 6px;
    left: 6px;
    width: 8px;
    height: 8px;
    background-color: #2196f3;
    border-radius: 50%;
  }
`;

const RadioButtonText = styled.span`
  margin-left: 10px;
`;

const RadioButtonGroup: React.FC<{ radioButtons: RadioButton[]; onChange: (index: number) => void }> = ({
  radioButtons,
  onChange,
}) => {
  return (
    <div>
      {radioButtons.map((radioButton, index) => (
        <RadioButtonContainer key={index}>
          <RadioButtonLabel>
            <RadioButtonInput
              type="radio"
              name="radioButton"
              onChange={() => onChange(index)}
            />
            <RadioButtonCustom />
            <RadioButtonText>{radioButton.label}</RadioButtonText>
          </RadioButtonLabel>
        </RadioButtonContainer>
      ))}
    </div>
  );
};


interface RadioProps {
  selectedRadioButton: number | null;
  setSelectedRadioButton: React.Dispatch<React.SetStateAction<number | null>>;
}

const Radio: React.FC<RadioProps> = ({ selectedRadioButton, setSelectedRadioButton }) => {
  const radioButtons: RadioButton[] = [
    { label: 'Chat with FAQ bot' },
    { label: 'Chat with FAQ bot from PDF' },
  ];

  const handleRadioButtonChange = (index: number) => {
    setSelectedRadioButton(index);
    console.log(`Clicked Radio Button: ${index}`);
  };


  return (
    <div>
      <RadioButtonGroup radioButtons={radioButtons} onChange={handleRadioButtonChange} />
    </div>
  );
};

export default Radio;
