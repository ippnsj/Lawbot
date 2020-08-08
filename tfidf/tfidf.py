# scikit-learn 패키지를 이용하여 tfidf를 구현합니다.
# scikit-learn 패키지를 이용하여 cosine similarity를 계산합니다.

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import euclidean_distances
from sklearn.metrics.pairwise import manhattan_distances
import numpy as np

def open_file(name, Print=False):

    data_output=[]
    f=open(name, 'r', encoding='euc-kr')

    lines=f.readlines()

    for line in lines :
        data_output.append(line)

    if (Print):
        print(data_output)
    return data_output

def preprocessing(sentencepiece_model, data, stopwords, Print=False):
    data_no_stopwords=[]
    for sentence in data:
        temp_X = sentencepiece_model.EncodeAsPieces(sentence)

        temp_X=[word for word in temp_X if not word in stopwords] # 불용어 제거
        data_no_stopwords.append(temp_X)

    if (Print):
        print('불용어 제거된 data는 다음과 같습니다')
        print(data_no_stopwords)
        
    realdata=[]

    for sentence in data_train :
        test=' '.join(sentence).replace('▁', '')
        realdata.append(test)
    
    if (Print):
        print('실제 사용될 data는 다음과 같습니다')
        print(realdata)

    return realdata

def train(data):
    tfidfv = TfidfVectorizer().fit(data)
    return tfidfv

def cos_similarity(data1, data2, Print=False):
    # 코사인 유사도를 구합니다.
    similarity = cosine_similarity(data1, data2)
    if (Print):
        print('data 1, data 2 Cosine 유사도: {0:.3f}'.format(similarity))
    return similarity

def set_similarity(data1, data2, Print=False):
    # 자카드 유사도를 구합니다.
    union = set(tokenized_doc1).union(set(tokenized_doc2))
    intersection = set(tokenized_doc1).intersection(set(tokenized_doc2))
    similarity = len(intersection)/len(union)
    if (Print):
        print(similarity)
    return similarity

def ucli_similarity(data1, data2, Print=False):
    # 유클리디언 유사도를 구합니다.
    similarity = euclidean_distances(data1, data2)
    if (Print):
        print('data 1, data 2 Euclidean 유사도: {0:.3f}'.format(similarity))
    return similarity

def manhatan_similarity(data1, data2, Print=False):
    # 맨해튼 유사도를 구합니다.
    norm_data1 = __normalize(data1)
    norm_data2 = __normalize(data2)
    similarity = manhattan_distances(norm_data1, norm_data2)
    if (Print):
        print('data 1, data 2 Manhattan 유사도: {0:.3f}'.format(similarity))

def __normalize(v):
	norm = np.sum(v)
    return v / norm 
  
