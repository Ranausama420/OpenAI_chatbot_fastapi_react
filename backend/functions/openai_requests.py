import openai
# from PyPDF2 import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS
from functions.databaseops import get_recent_messages
import os
# from config import openai_organization,openai_api_key
from functions.config import OPENAI_API_KEY,OPENAI_ORGANISATION_KEY

# Retrieve Enviornment Variables
openai.organization =OPENAI_API_KEY
openai.api_key =OPENAI_ORGANISATION_KEY


# Open AI - Whisper
# Convert audio to text
def convert_audio_to_text(audio_file):
  try:
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    message_text = transcript["text"]
    return message_text
  except Exception as e:
    return

# Open AI - Chat GPT
# Convert audio to text
def get_chat_response(message_input):
  """Description:
This function generates a chatbot response based on the provided user input message.
It retrieves the recent chat messages using the get_recent_messages() function and appends the user's message to the list. 
It then uses the OpenAI Chat API to generate a response using the GPT-3.5-turbo model. The response is extracted from the API's
result and returned as a dictionary containing the answer and an empty list for the source documents.

Inputs:
message_input: User input message (string)

Output: Dictionary containing the generated chatbot response
answer: Generated response text (string)
source_documents: List of source documents associated with the response (empty list)
Note: The function makes use of the OpenAI Chat API to generate the chatbot response."""

  messages = get_recent_messages()
  user_message = {"role": "user", "content": message_input}
  messages.append(user_message)
  # message_text='sombooosa somboosa '
  # return message_text
  msg_dic={}
  try:
    response = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=messages
    )
    print(response)
    print(response['choices'])
    message_text = response["choices"][0]["message"]["content"]
    msg_dic['answer']=message_text
    msg_dic['source_documents']=[]
    
    return msg_dic
  except Exception as e:
    print(e)
    return


def extract_pdf():
  file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
  file_path = os.path.join(os.path.dirname(file_dir), 'frontend', 'src', 'components', 'texts.txt')

  with open(file_path, 'r', encoding='utf-8') as file:
          loaded_texts = file.readlines()
  
  processed_texts = [text.strip() for text in loaded_texts]

  return processed_texts


