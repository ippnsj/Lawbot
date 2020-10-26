#!/usr/bin/env python
# coding: utf-8

# In[50]:


import requests as rq
import pandas as pd
from bs4 import BeautifulSoup as bs
import re


# In[2]:


import xml.etree.ElementTree as ET
from xml.etree.ElementTree import Element, dump, ElementTree


# ### 1. 법령용어 나와있는 url 가져오기

# * #### 목록 parameter 딕셔너리
# 
# 
# > query가 keyword에 해당하는데, input 함수로 키워드를 입력받음
# <br/> type은 url 타고 웹에서 볼거면 html로 하는게 낫고, 주피터노트북으로 text 확인할거면 xml이 나음

# In[32]:


chart= {'OC':'ICTPoolC'
        ,'target': 'lstrm'
        ,'type':'XML'
        ,'query':input()
       }


# * #### request 모듈을 이용하여 chart의 변수들을 전송함

# In[33]:


res_chart=rq.post('http://www.law.go.kr/DRF/lawService.do?'
            ,params=chart)


# * #### url 가져오기

# In[34]:


print(res_chart.url)


# * #### text 가져오기
# > 아래에서 볼 수 있듯이 html 타입으로 text 읽어오는건 무의미한듯..

# In[35]:


print(res_chart.text)


# ### 2. 크롤링으로 용어정의 가져오기
# 

# In[58]:


soup = bs(res_chart.text,"xml")
print(soup.find("법령용어코드명").text, "\n\n", re.sub("[&</b>sim;nsp;rddot]","",soup.find("법령용어정의").text))


# ### 3. 함수화
# 

# In[70]:


def Lawdict(word):
    chart= {'OC':'ICTPoolC'
        ,'target': 'lstrm'
        ,'type':'XML'
        ,'query': word
       }
    res_chart=rq.post('http://www.law.go.kr/DRF/lawService.do?',params=chart)
    soup = bs(res_chart.text,"xml")
    return [soup.find("법령용어코드명").text, re.sub("[&</b>sim;nsp;rddot]","",soup.find("법령용어정의").text)]


# In[71]:


Lawdict("재심")

