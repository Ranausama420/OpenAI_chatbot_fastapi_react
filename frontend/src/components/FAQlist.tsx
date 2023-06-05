import React, { useState,useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import stored_data from "./stored_faq.json"
import { FaLink } from 'react-icons/fa';
import { Accordion, Card, Button } from 'react-bootstrap';
import axios from 'axios';
interface FAQItem {
  question: string;
  answer: string[];
  source: { page_content: string; pdf_numpages: number; source: string;}[];
}

const FAQContainer = styled.div`
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  
`;

const FAQQuestion = styled.div`
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between; // Add this line
  
  
`;

const FAQAnswer = styled.div`
  position: relative;
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  /* Styling for the button */
  z-index: -1; 
  button {
    position: absolute;
    top: 5px;
    right: 5px;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
`;
const FAQHeading = styled.h2`
font-size: 18px;
margin-bottom: 10px;
color: #756FF2;
`;
    
const DropdownIcon = styled(FaAngleDown)`
  margin-left: 50px;
`;
const DropupIcon = styled(FaAngleUp)`
  margin-left: 50px;
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

const FAQs: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>(-1);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);


  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAccordionToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  

  const fetchData = async () => {
    console.log('fetchData')
    try {
      setIsLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/readdb/', {}, {
        headers: {
          Accept: 'application/json',
        },
      });

      // Handle the response data
      const parsedData: FAQItem[] = [];
      // console.log(response.data);
      const data=response.data
      // setPdfData(response.data.msg);
      data.forEach((item: any) => {
        // console.log(item)
        // console.log(typeof item)
        const question=item.question
        const answers=[item.answer]
        const source=item.source

      const questionExists = parsedData.some((data) => data.question === question);
      if (questionExists) {
        // Find the existing data with the matching question
        const existingData = parsedData.find((data) => data.question === question);
        // console.log(existingData)
        // Append the new answer to the existing data's answer list
        existingData.answer.push(...answers as string[]);
        existingData.source=item.source
      } else {
        // Add a new entry to the parsedData list
        parsedData.push({
          question,
          answer: answers as string[],
          source: source as {
            page_content: string;
            pdf_numpages: number;
            source: string;
          }[],
        });
      }

        setFaqData(parsedData);
      
  
      });

      
    } catch (error) {
      // Handle errors
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false); // Set isLoading to false after the request is completed (whether success or error)
    }
  };


  useEffect(() => {
    
    fetchData();

  }, []);

  const toggleCard = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(index);
    }
  };
  const handleClick = (question: string) => {
    // Perform actions using the question value
    console.log('Clicked on question:', question);
   
  };


  const [isResetting, setIsResetting] = useState(false);

  // Reset conversation
  const resetConversation = async () => {
    setIsResetting(true);

    await axios
      .get("http://localhost:8000/reset-qa", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status == 200) {
          // setMessages([]);
          console.log('rest')
          useEffect(() => {
    
            fetchData();
        
          }, []);
        }
      })
      .catch((err) => {});

    setIsResetting(false);
  };


  return (
    <FAQContainer>
      <div className="flex items-center justify-between w-full p-2 mb-5 mt-1 bg-gray-900 font-bold shadow bg-gradient-to-r from-gray-200 via-gray-150 to-gray-200">
      <FAQHeading style={{color:"grey"}}>Most FAQ List</FAQHeading>
      <button
        onClick={fetchData}
        className={
          "transition-all duration-300 text-blue-300 hover:text-pink-500 " +
          (isResetting && "animate-pulse")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button></div>


      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div>
        {faqData.map((faq, index) => (
          <div key={index}>
            <FAQQuestion onClick={() => toggleCard(index)}>
              <div>{faq.question}</div>
              {expandedIndex === index ? (
                <DropupIcon size={20} />
              ) : (
                <DropdownIcon size={20} />
              )}
            </FAQQuestion>
           
                
            {expandedIndex === index && 
  
            <div>
      {faq.answer.map((answer, answerIndex) => (
        <FAQAnswer key={answerIndex}>
           <button onClick={() => handleClick(faq.question)}>
        <div><span><FaLink/></span></div>
      </button>
      <h5><u>Ans: </u> {answerIndex + 1}</h5>
      <p>{answer}</p>
      <br></br>
      {faq.source.map((source_doc, srcIndex) => (
        <div>
          <hr></hr>
          <h5><u>Source: </u> {srcIndex + 1}</h5>
  <p>{source_doc.page_content}</p>
  <p>From page: {source_doc.pdf_numpages - 1}</p>
  <p>Source: {source_doc.source}</p>
        </div>
      ))}
  
  
              </FAQAnswer>
            ))}
            </div>
            
            }
            
          </div>
        ))}
        </div>
      )}
      {/* {faqData.map((faq, index) => (
        <div key={index}>
          <FAQQuestion onClick={() => toggleCard(index)}>
            <div>{faq.question}</div>
            {expandedIndex === index ? (
              <DropupIcon size={20} />
            ) : (
              <DropdownIcon size={20} />
            )}
          </FAQQuestion>
         
              
          {expandedIndex === index && 

          <div>
    {faq.answer.map((answer, answerIndex) => (
      <FAQAnswer key={answerIndex}>
         <button onClick={() => handleClick(faq.question)}>
      <div><span><FaLink/></span></div>
    </button>
    <h5><u>Ans: </u> {answerIndex + 1}</h5>
    <p>{answer}</p>
    <br></br>
    {faq.source.map((source_doc, srcIndex) => (
      <div>
        <hr></hr>
        <h5><u>Source: </u> {srcIndex + 1}</h5>
<p>{source_doc.page_content}</p>
<p>From page: {source_doc.pdf_numpages - 1}</p>
<p>Source: {source_doc.source}</p>
      </div>
    ))}


            </FAQAnswer>
          ))}
          </div>
          
          }
          
        </div>
      ))} */}
      
    </FAQContainer>
  );
};

export default FAQs;
