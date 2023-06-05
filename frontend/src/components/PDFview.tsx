import styled, { keyframes } from 'styled-components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

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

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 20px;
  color: #999;

  /* Add animation styles */
  &:after {
    content: '';
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-top-color: #999;
    animation: ${spinAnimation} 1s linear infinite;
  }
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
}

const ExtractedPDF: React.FC<ExtractedPDFProps> = ({ text, width, height }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pdfData, setPdfData] = useState('');

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
        setPdfData(response.data.msg);

        
      } catch (error) {
        // Handle errors
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false); // Set isLoading to false after the request is completed (whether success or error)
      }
    };

    loadData();

  }, []);
  const index=1;
  return (
    <Container width={width} height={height}>
      <Title>Extracted PDF</Title>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <TextArea width={width} height={height * 0.8} value={pdfData} readOnly />
      )}

      
    </Container>
  );
};

export default ExtractedPDF;
