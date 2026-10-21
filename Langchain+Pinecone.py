#!/usr/bin/env python
# coding: utf-8

# In[2]:


# PDF Loaders. If unstructured gives you a hard time, try PyPDFLoader
from langchain.document_loaders import UnstructuredPDFLoader, OnlinePDFLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os


# In[3]:


#Load your data
loader = PyPDFLoader("E:/Users/tong/Downloads/Documents/field-guide-to-data-science.pdf")


# In[4]:


## Other options for loaders 
# loader = UnstructuredPDFLoader("../data/field-guide-to-data-science.pdf")
#loader = OnlinePDFLoader("https://wolfpaulus.com/wp-content/uploads/2017/05/field-guide-to-data-science.pdf")

data = loader.load()
# Note: If you're using PyPDFLoader then it will split by page for you already
print (f'You have {len(data)} document(s) in your data')
print (f'There are {len(data[30].page_content)} characters in your document')


# In[5]:


#Chunk your data up into smaller documents
# Note: If you're using PyPDFLoader then we'll be splitting for the 2nd time.
# This is optional, test out on your own data.

text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
texts = text_splitter.split_documents(data)
print (f'Now you have {len(texts)} documents')


# In[6]:


texts[13]


# In[7]:


#Create embeddings of your documents to get ready for semantic search
from langchain.vectorstores import Chroma, Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
import pinecone
from tqdm import tqdm


# In[8]:


# Check to see if there is an environment variable with you API keys, if not, use what you put below
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '<REDACTED>')


# In[9]:


#PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY', '<REDACTED>')
#PINECONE_API_ENV = os.environ.get('PINECONE_API_ENV', '<REDACTED>') # You may need to switch with your env
embeddings = OpenAIEmbeddings(openai_api_key='<REDACTED>')


# In[16]:


# initialize pinecone

pinecone.init(
    api_key='<REDACTED>',  # find at app.pinecone.io
    environment='<REDACTED>'  # next to api key in console
)
index_name = "langchain-index" # put in the name of your pinecone index here


# In[17]:


docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)

query = "What are examples of good data science teams?"
docs = docsearch.similarity_search(query)


# In[18]:


docs


# In[19]:


# Here's an example of the first document that was returned
print(docs[0].page_content[:450])


# In[20]:


from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain


# In[21]:


llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY)
chain = load_qa_chain(llm, chain_type="stuff")


# In[22]:


query = "Tell me some pros on how to effectively analyze data?"
docs = docsearch.similarity_search(query)


# In[23]:


chain.run(input_documents=docs, question=query)


# In[ ]:




