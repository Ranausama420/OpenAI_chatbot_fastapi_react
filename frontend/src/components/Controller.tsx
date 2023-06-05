import React,{ useRef, useState, useEffect } from "react";
import Title from "./Title";
import axios from "axios";
import RecordMessage from "./RecordMessage";
import Chatwidget from "./chatwidget";
import MessageComp from "./Message"
import { Document } from 'langchain/document';
import { pinecone } from './pinecone-client';
import { makeChain } from './makechain';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

interface ControllerProps {
  radio: number | null;
}

const Controller: React.FC<ControllerProps> = ({ radio }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);



  const onSendMessage = async (msgtext: string) => {
    setIsLoading(true);

    // Append recorded message to messages
    const myMessage = { sender: "me", msgtext };
    const messagesArr = [...messages, myMessage];
    console.log(myMessage,messagesArr)
  setMessages(messagesArr);
  let url=""
  console.log('radio', radio)
  if(radio == 1)
  {
    url="http://127.0.0.1:8000/post-msg-pdf/"

  }else{
    url="http://127.0.0.1:8000/post-msg/"

  }
  

    try {
    const response = await axios.post(url, null, {
      params: {
        msg: msgtext
      }
    }).then(response => {
      console.log(response.data);
      const msgtext=response.data.msg
      const rachelMessage = { sender: "bot", msgtext };
      messagesArr.push(rachelMessage);
      console.log(messagesArr)
      setMessages(messagesArr);

      // Play audio
      setIsLoading(false);
    })
    .catch(error => {
      console.error(error);
    });
  } catch (error) {
    console.error(error);
  }
  };
  
  



  return (
    <div className="h-screen overflow-y-hidden">
      {/* Title */}
      <Title setMessages={setMessages} />

      <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96 "style={{width:'100%'}}>
        {/* Conversation */}
        <div className="mt-5 px-5" >
          {messages?.map((msg, index) => {
            return (
              <div
                key={index + msg.sender}
                
              >
                {/* Sender */}
                <div className="mt-4 ">
                  <p
                    className={
                      msg.sender == "me"
                        ? "text-right mr-2 italic text-green-500"
                        : "ml-2 italic text-blue-500"
                    }
                  >
                    {msg.sender}
                   
                  </p>

                  {/* Message */}
                  <MessageComp text={msg.msgtext} time={new Date().toLocaleString()} sender={msg.sender}/>
                </div>
              </div>
            );
          })}

          {messages.length == 0 && !isLoading && (
            <div className="text-center font-light italic mt-10">
              Send bot a message...
            </div>
          )}

          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              Gimme a few seconds...
            </div>
          )}
        </div>

        {/* Recorder */}
        <div className="fixed bottom-0 w-1/2.5 py-6 border-t text-center bg-gradient-to-r from-gray-200 via-gray-150 to-gray-200" style={{width:'48.75%'}}>
          <div className="flex justify-center items-center w-1/2">
            <div>
              {/* <RecordMessage handleStop={handleStop} /> */}
              <Chatwidget onSendMessage={onSendMessage}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;
