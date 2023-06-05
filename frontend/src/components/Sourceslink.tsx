import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ContainerProps {
  width: number;
  height: number;
}

const Container = styled.div<ContainerProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  color: #756FF2;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 20px;
  color: #999;
`;

interface TextAreaProps {
  width: number;
  height: number;
}

const TextArea = styled.textarea<TextAreaProps>`
  width: ${(props) => props.width-15 }px;
  height: ${(props) => props.height}px;
  resize: vertical;
  border: none;
  padding: 5px;
  overflow-y: scroll; /* Enable vertical scroll */

  /* Styling the scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent; /* Change color as desired */

  /* For WebKit based browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc; /* Change color as desired */
    border-radius: 4px;
  }
`;

interface ExtractedPDFProps {
  text: string;
  width: number;
  height: number;
  question: string;
}

const Sourcelink: React.FC<ExtractedPDFProps> = ({ text, width, height, question}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/load-doc/', {}, {
          headers: {
            Accept: 'application/json',
          },
        });

        // Handle the response data
        console.log(response.data);
      } catch (error) {
        // Handle errors
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false); // Set isLoading to false after the request is completed (whether success or error)
      }
    };

    // Call the loadData function
    loadData();
  }, []);

  return (
    <Container width={width} height={height}>
      <Title>Question Source</Title>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <TextArea width={width} height={height * 0.8} value={text} readOnly />
      )}
    </Container>
  );
};

export default Sourcelink;
