#!/usr/bin/env python
# coding: utf-8

# In[8]:


get_ipython().system('pip install PyMySQL')


# In[3]:


import pymysql as pms
import requests
import base64
import json
import logging


# In[17]:


host = "ict.clw3yf0azeqw.ap-northeast-2.rds.amazonaws.com"
port = 3306
username = "admin"
database = "ict"
password = "48834883"


try:
    conn = pms.connect(host=host,user=username,password=password,db=database, 
                       port=port, use_unicode=True, charset="utf8")
    cursor=conn.cursor()
except:
    logging.error("연결 실패")
    

