from dotenv import load_dotenv
import os
load_dotenv()
OPENAI_API_KEY=os.getenv("OPENAI_API_KEY")
OPENAI_ORGANISATION_KEY=os.getenv("OPENAI_ORGANISATION_KEY")
PINECONE_INDEX_NAME=os.getenv("PINECONE_INDEX_NAME")
PINECONE_NAME_SPACE=os.getenv("PINECONE_NAME_SPACE")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_API_ENV = os.getenv("PINECONE_API_ENV")
