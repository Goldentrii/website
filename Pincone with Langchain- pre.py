#!/usr/bin/env python
# coding: utf-8

# In[7]:


# PDF Loaders. If unstructured gives a hard time, try PyPDFLoader
from langchain.document_loaders import UnstructuredPDFLoader, OnlinePDFLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os


# In[16]:


#Load the data
loader = PyPDFLoader("C:/Users/tong/OneDrive/GPT SEMINAR\Big change! Not big enough. The rise of the GPT ecosystem-TongWu, 5163957.pdf")


# In[17]:


## Other options for loaders 
# loader = UnstructuredPDFLoader("../data/field-guide-to-data-science.pdf")
#loader = OnlinePDFLoader("https://wolfpaulus.com/wp-content/uploads/2017/05/field-guide-to-data-science.pdf")

data = loader.load()
# Note: If we are using PyPDFLoader then it will split by page for you already
print (f'You have {len(data)} document(s) in your data')
print (f'There are {len(data[0].page_content)} characters in your document')


# In[18]:


#Chunk data up into smaller documents
# Note: If we are using PyPDFLoader then we'll be splitting for the 2nd time.
# This is optional, test out on data.

text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
texts = text_splitter.split_documents(data)
print (f'Now you have {len(texts)} documents')


# In[19]:


texts[13]


# In[20]:


#Create embeddings of documents to get ready for semantic search
from langchain.vectorstores import Chroma, Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
import pinecone
from tqdm import tqdm


# In[21]:


# Check to see if there is an environment variable with  API keys, if not, use what put below
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', 'sk-45yg5n1U0253ntOOLh///////FJCmo3w1x7BT10fCirlEur')


# In[22]:


#PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY', '<REDACTED>')
#PINECONE_API_ENV = os.environ.get('PINECONE_API_ENV', '<REDACTED>') # May need to switch with env
embeddings = OpenAIEmbeddings(openai_api_key='sk-45yg5n1U0253ntOOLh2///////3w1x7BT10fCirlEur')


# In[23]:


# initialize pinecone

pinecone.init(
    api_key='<REDACTED>',  # find at app.pinecone.io
    environment='<REDACTED>'  # next to api key in console
)
index_name = "langchain-index" # put in the name of your pinecone index here


# In[24]:


docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)

query = "What is the taxonomy of GPT Ecosystem?"
docs = docsearch.similarity_search(query)


# In[25]:


docs


# In[26]:


# Here's an example of the first document that was returned
print(docs[0].page_content[:450])


# In[27]:


from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain


# In[28]:


llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY)
chain = load_qa_chain(llm, chain_type="stuff")


# In[29]:


query = "Tell me some about GPT ecosystem."
docs = docsearch.similarity_search(query)


# In[30]:


chain.run(input_documents=docs, question=query)


# In[ ]:




