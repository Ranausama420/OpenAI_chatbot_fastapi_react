import os
import json
import random


from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()






# Save messages for retrieval later on
def get_recent_messages():
  """
  Description:
This function retrieves the recent chat messages from a stored data file and generates a list of messages.
It includes a system instruction message as the first message, followed by the last 5 rows of data from the stored data file.

Inputs: None

Output: List of messages

Each message is represented as a dictionary with the following keys:
role: Role of the message (string) "system", "user", or "assistant"
content: Content of the message (string)"""

  # Define the file name
  file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
  file_name = os.path.join(os.path.dirname(file_dir), 'frontend', 'src', 'components', 'stored_data.json')
  learn_instruction = {"role": "system", 
                       "content": "you are SAF Now's FAQ Chatbot you read from pdf and answer question. SAF Now's is The Society of American Florists is the association that connects and cultivates a thriving floral community for:all participants of the U.S. floral industry and offers exciting benefits for the following types of businesses:Retail Florists, Growers, Wholesalers/Importers, Suppliers ,Event Florists, Researchers. Keep responses under 100 words. "}
  
  # Initialize messages
  messages = []

  # Add Random Element
  x = random.uniform(0, 1)
  if x < 0.2:
    learn_instruction["content"] = learn_instruction["content"] + "Your response will have some light humour. "
  elif x < 0.5:
    learn_instruction["content"] = learn_instruction["content"] + "Your response will include an interesting new fact about FAQ bot. "
  else:
    learn_instruction["content"] = learn_instruction["content"] + "Your response will be greating as a chatbot . "

  # Append instruction to message
  messages.append(learn_instruction)

  # Get last messages
  try:
    with open(file_name) as user_file:
      data = json.load(user_file)
      
      # Append last 5 rows of data
      if data:
        for item in data:
            messages.append(item)
  except:
    pass

  
  # Return messages
  return messages



# Save messages for retrieval later on
def get_recent_faq(ques,ans):
  """Description:
    This function retrieves the recent FAQs (Frequently Asked Questions) from a stored FAQ file.
    It takes a question and its corresponding answer as input. It loads the existing FAQ data from the file and
   checks if the question already exists. If it does, it appends the answer and source documents to the existing entry. 
   If not, it creates a new entry with the question, answer, and source documents. Finally, it returns the updated FAQ data.

Inputs:
ques: Question (string)
ans: Answer object (dictionary)

Output: List of FAQ data"""

  # Define the file name
  file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
  file_name = os.path.join(os.path.dirname(file_dir), 'frontend', 'src', 'components', 'stored_faq.json')
  faq = []
  try:
    with open(file_name) as user_file:
      data = json.load(user_file)
      if data:
        for d in data:
          if ques in d['question']:
              d['answer'].append(ans['answer'])
              d['source']=get_source_docs(ans['source_documents'])
              # d[ques].append(ans)
          else:
              dic={}
              dic['question']=ques
              dic['answer']=[ans['answer']]
              dic['source']=get_source_docs(ans['source_documents'])
              data.append(dic)
        faq.append(data)
      else:
        src=get_source_docs(ans['source_documents'])
        data={"question":ques, 'answer':[ans['answer']],"source":src}
        print(data)
        faq.append(data)
  except Exception as e:
    import traceback
    print(traceback.print_exc())
    print(e)
    print('error fq list')
    pass
  # Return messages
  # print(faq)
  return faq[0]


def get_source_docs(source):
  srcdoclst=[]
  for i in source:
    srcdoc={}
    srcdoc["page_content"]=i.page_content.strip()
    srcdoc["pdf_numpages"]=i.metadata['pdf_numpages']
    srcdoc["lines_from"]=i.metadata['loc.lines.from']
    srcdoc["lines_to"]=i.metadata['loc.lines.to']
    # srcdoc["source_link"]=i.metadata['source']
    srcdoclst.append(srcdoc)
  return srcdoclst


# Save messages for retrieval later on
def store_messages(request_message, response_message):

  # Define the file name
  # file_name = "stored_data.json"

  file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
  file_name_faq = os.path.join(os.path.dirname(file_dir), 'frontend', 'src', 'components', 'stored_faq.json')
  # print(file_name_faq)
  # print("request_message,response_message")
  # print(request_message,response_message)

  faq=get_recent_faq(request_message,response_message)
  print(faq)
  # Save the updated file
  # with open(file_name, "w") as f:
  #   json.dump(messages, f)
  

  with open(file_name_faq, "w") as f:
    json.dump(faq, f)



def store_messages_db(request_message, db):
  print('sa')
  print(db)
  print(type(db))


# Save messages for retrieval later on
def reset_messages():

  # Define the file name
  file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
  file_name = os.path.join(os.path.dirname(file_dir), 'frontend', 'src', 'components', 'stored_data.json')

  # Write an empty file
  open(file_name, "w")


def reset_faq():

  # Define the file name
  file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
  file_name = os.path.join(os.path.dirname(file_dir), 'frontend', 'src', 'components', 'stored_faq.json')

  # Write an empty file
  open(file_name, "w")
