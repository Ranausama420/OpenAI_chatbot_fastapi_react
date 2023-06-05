# uvicorn main:app
# uvicorn main:app --reload

# Main imports
from fastapi import FastAPI, File, UploadFile, HTTPException,Depends
from pydantic import BaseModel, Field
import models
from database import engine, SessionLocal,Base
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai


# Custom function imports
from functions.text_to_speech import convert_text_to_speech
from functions.openai_requests import convert_audio_to_text, get_chat_response,extract_pdf
from functions.langchain_requests import get_chat_response_pdf
from functions.databaseops import store_messages, reset_messages,reset_faq, store_messages_db

from functions.config import OPENAI_API_KEY,OPENAI_ORGANISATION_KEY
from dotenv import load_dotenv
import os,json


load_dotenv()

# Retrieve Enviornment Variables
openai.organization =OPENAI_API_KEY
openai.api_key =OPENAI_ORGANISATION_KEY

# Initiate App
app = FastAPI()
models.Base.metadata.create_all(bind=engine)

# CORS - Origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000",
]


# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


class Sourcebody(BaseModel):
    page_content: str
    pdf_numpages: int
    source: str

class Qa(BaseModel):
    question: str 
    answer: str
    source: list[Sourcebody]



qadata = []



# Check health
@app.get("/health")
async def check_health():
    return {"response": "healthy"}


# Reset Conversation
@app.get("/reset")
async def reset_conversation():
    reset_messages()
    return {"response": "conversation reset"}


@app.get("/reset-qa")
async def reset_conversation():
    # reset_messages()
    print('resetqa')
    return {"response": "QA reset"}

# Post bot response
# Note: Not playing back in browser when using post request.
@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):

    # Convert audio to text - production
    # Save the file temporarily
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")

    # Decode audio
    message_decoded = convert_audio_to_text(audio_input)

    # Guard: Ensure output
    if not message_decoded:
        raise HTTPException(status_code=400, detail="Failed to decode audio")

    # Get chat response
    chat_response = get_chat_response(message_decoded)

    # Store messages
    store_messages(message_decoded, chat_response)

    # Guard: Ensure output
    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed chat response")

    # Convert chat response to audio
    audio_output = convert_text_to_speech(chat_response)

    # Guard: Ensure output
    if not audio_output:
        raise HTTPException(status_code=400, detail="Failed audio output")

    # Create a generator that yields chunks of data
    def iterfile():
        yield audio_output

    # Use for Post: Return output audio
    return StreamingResponse(iterfile(), media_type="application/octet-stream")



@app.post("/post-msg/")
async def post_msg(msg: str):
    print('msg',msg)
    print('msg',type(msg))
    print("in chat")

     # Get chat response
    chat_response = get_chat_response(msg)

    # Store messages
    # store_messages(msg, chat_response)

    if not chat_response:
        raise HTTPException(status_code=400, detail="Failed chat response")
    return {"msg": chat_response['answer']}


@app.post("/load-doc/")
def load_doc():
    print('load doc in')
    
    data=extract_pdf()
    return {"msg": data}

"""This post endpoint takes an incoming message(str) from the user as an input parameter and processes
 the message to produce a response. The function get_chat_response_pdf is called which takes the 
 user's input string and processes it to generate a chat response which is stored in the "chat_response" variable.
   The messages are also stored in the store_messages function before returning the response as {"msg": chat_response['answer']}
     in the form of a JSON response."""

@app.post("/post-msg-pdf/")
async def post_msg_pdf(msg: str,db: Session = Depends(get_db)):
    try:
        print('msg',msg)
        print('msg',type(msg))
        print("in pdf")
        chat_response = get_chat_response_pdf(msg)
        # store_messages(msg, chat_response)
        save_db_response(chat_response, db)
        print(chat_response['result'])
        return {"msg":chat_response['result']}
    except Exception as e:
        print(e)
        print('error in send msg')
        return {'msg':e}
    



def save_db_response(resp, db: Session = Depends(get_db)):

    book_model = models.QaData()
    book_model.question = resp['query']
    book_model.answer = resp['result']
    db.add(book_model)
    db.commit()

    # print(resp.source_documents)
    print(book_model.id)
    # for src in resp['source_documents']:
    #     print(src.page_content)
    #     print(src.metadata['page'])
    #     print(src.metadata['source'])
    for src in resp['source_documents']:
        src_model=models.Source()
        src_model.page_content=src.page_content
        src_model.pdf_numpages=src.metadata['page']
        src_model.source=src.metadata['source']
        src_model.qadata_id=book_model.id
        db.add(src_model)
        db.commit()


    return 'created'


@app.post("/readdb/")
async def read_api(db: Session = Depends(get_db)):
    qadb=db.query(models.QaData).all()
    fls=[]
    for i in qadb:
        fdic={}
        fdic['question']=i.question
        fdic['answer']=i.answer
        sources = db.query(models.Source).filter_by(qadata_id=i.id).all()
        fdic['source']=sources
        fls.append(fdic)
    return fls



@app.post("/createdb/")
def create_book(book: Qa, db: Session = Depends(get_db)):

    book_model = models.QaData()
    book_model.question = book.question
    book_model.answer = book.answer
    db.add(book_model)
    db.commit()

    print(book.source)
    print(book_model.id)
    print(len(book.source))
    for src in book.source:
        src_model=models.Source()
        src_model.page_content=src.page_content
        src_model.pdf_numpages=src.pdf_numpages
        src_model.source=src.source
        src_model.qadata_id=book_model.id
        db.add(src_model)
        db.commit()


    return book


@app.put("updatedb/{book_id}")
def update_book(book_id: int, book: Qa, db: Session = Depends(get_db)):

    book_model = db.query(models.QaData).filter(models.QaData.id == book_id).first()

    if book_model is None:
        raise HTTPException(
            status_code=404,
            detail=f"ID {book_id} : Does not exist"
        )

    book_model.title = book.title
    book_model.author = book.author
    book_model.description = book.description
    book_model.rating = book.rating

    db.add(book_model)
    db.commit()

    return book




@app.post("/load-script/")
def load_script(db: Session = Depends(get_db)):
    file_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_name_faq = os.path.join(file_dir, 'frontend', 'src', 'components', 'stored_faq.json')
    print()
    with open(file_name_faq) as user_file:
      data = json.load(user_file)
      for d in data:
        existing_question = db.query(models.QaData).filter(models.QaData.question == d['question']).first()
        print(not existing_question)
        if not existing_question:
            print(d['question'])
            book_model = models.QaData()
            book_model.question = d['question']
            book_model.answer = d['answer'][0]
            db.add(book_model)
            db.add(book_model)
            db.commit()
            for src in d['source']:
                src_model=models.Source()
                src_model.page_content=src['page_content']
                src_model.pdf_numpages=src['pdf_numpages']
                src_model.source="MayJune23-LR.pdf"
                src_model.qadata_id=book_model.id
                db.add(src_model)
                db.commit()
    
    return {"msg": "loaded"}