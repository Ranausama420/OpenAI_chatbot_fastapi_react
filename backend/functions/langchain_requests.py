
from langchain.embeddings.openai import OpenAIEmbeddings
import os
from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import pinecone
from functions.config import OPENAI_API_KEY,PINECONE_INDEX_NAME,PINECONE_NAME_SPACE,PINECONE_API_KEY,PINECONE_API_ENV


def get_chat_response_pdf(message_input):
  """Input: message_input - A string containing a single question

    Output: result - A list of documents that are relevant to the input message_input.

    Description: This method takes a message_input (a single question) as an input and returns a list of relevant documents as the output. 
    It uses a ConversationalRetrievalChain with an OpenAI and a Pinecone to process the input and retrieve relevant documents. 
    It also specifies the OpenAI and Pinecone parameters, like temperature, api key, etc. for better processing."""

  embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
  pinecone.init(
      api_key=PINECONE_API_KEY,  # find at app.pinecone.io
      environment=PINECONE_API_ENV  # next to api key in console
  )
  index_name = PINECONE_INDEX_NAME
  docsearch=Pinecone.from_existing_index(index_name, embeddings,namespace=PINECONE_NAME_SPACE)
  print(docsearch)
  CONDENSE_PROMPT_TEXT = """Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

  Chat History:
  {chat_history}
  Follow Up Input: {question}
  Standalone question:"""
  CONDENSE_QUESTION_PROMPT = PromptTemplate.from_template(CONDENSE_PROMPT_TEXT)
  try:
    # chain=ConversationalRetrievalChain.from_llm(OpenAI(temperature=0,openai_api_key=OPENAI_API_KEY),docsearch.as_retriever(),CONDENSE_QUESTION_PROMPT,chain_type="stuff",return_source_documents=True)
    chain = RetrievalQA.from_chain_type(llm=OpenAI(openai_api_key=OPENAI_API_KEY), chain_type="stuff", retriever=docsearch.as_retriever(),return_source_documents=True)
    vectordbkwargs = {"search_distance": 0.9}
    # Ask a question and get the response with source documents
    query = message_input
    print(query)
    chat_history=[]
    result = chain({"query":query})
    print(result)
    
    return result
  except Exception as e:
    import traceback
    print(e)
    print(traceback.print_exc())
    return




