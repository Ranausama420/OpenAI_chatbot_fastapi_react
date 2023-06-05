# !pip install pypdf
# !pip install pinecone-client
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
PINECONE_INDEX_NAME="gpt4-pdf-chatbot-langchain"
PINECONE_NAME_SPACE="pdf-test-5"
PINECONE_API_KEY = "ea9bd77f-ec5b-4b4f-9e47-ecbb72c0c7cf"
PINECONE_API_ENV = "asia-southeast1-gcp-free"

import os
dir=os.path.exists("MayJune23-LR.pdf")
print(dir)

loader = PyPDFLoader("MayJune23-LR.pdf")
pages = loader.load_and_split(CharacterTextSplitter(chunk_size=2000, chunk_overlap=200))

from langchain.text_splitter import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200
)
texts = text_splitter.split_documents(pages)
print(texts)
from langchain.vectorstores import Pinecone
import pinecone
embeddings = OpenAIEmbeddings(openai_api_key = "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")

pinecone.init(
    api_key=PINECONE_API_KEY,  # find at app.pinecone.io
    environment=PINECONE_API_ENV  # next to api key in console
)
index_name = PINECONE_INDEX_NAME
docsearch = Pinecone.from_documents(texts, embeddings, index_name=index_name,namespace=PINECONE_NAME_SPACE)
print(docsearch)
if docsearch:
    print('data added to pinecone')