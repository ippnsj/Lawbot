# scikit-learn 패키지를 이용하여 tfidf를 구현합니다.
# scikit-learn 패키지를 이용하여 cosine similarity를 계산합니다.
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import euclidean_distances
from sklearn.metrics.pairwise import manhattan_distances
from sentencepiece_on_project import id_to_word as decode
import numpy as np
import pymysql as pms
import sys
import re
import io
# tfidf 모델을 로컬에 저장하기 위한 패키지
import pickle


# 학습된 sentencepiece model을 이용하여 data를 tfidf에 이용할 수 있도록 전처리 합니다.
def preprocessing(sentencepiece_model, files, stopwords, Print=False):
    """
    sentencepiece_model : 이미 학습된 sentencepiece_model 객체를 받는 parameter입니다.
    
    files : tfidf에 이용할 file 리스트 입니다. 
    type은 str입니다.
    
    stopwords : 불용언을 답고 있는 리스트 입니다.
    type은 str[]입니다.
    
    Print : 중간 결과를 프린트 할지에 대한 parameter입니다.
    기본값은 False입니다.
    """
    realdata=[]
    for file in files:
        temp_X = sentencepiece_model.EncodeAsPieces(file)
        
        temp_X = [word for word in temp_X if not word in stopwords]
        if (Print):
            print('temp입니다')
            print(temp_X)
            
        file_data=''.join(temp_X)
        file_data = re.sub('▁', '', file_data)
        
        realdata.append(file_data)
        
    if (Print):
        print('실제 사용될 data는 다음과 같습니다')
        for file_data in realdata:
            print(file_data[:20] + '.....')

    return realdata

# tfidf 모델을 학습시킵니다.
def train(data):
    """
    data : 문서의 리스트로 이루어져있어야 합니다.
    """
    tfidfv = TfidfVectorizer().fit(data)
    return tfidfv

# tfidf 분석을 실시합니다.
def do(model, data_input):
    """
    model : tfidf 분석을 실행할 모델
    
    data : tfidf 분석을 실행할 데이터
    type은 str, str[]입니다.
    만약 open()함수를 이용하여 읽은 파일을 그대로 넘길경우 전체 텍스트를 읽어서 사용합니다.
    """

    data = []
    # data가 하나의 file인지 검사합니다.
    if (type(data_input) == io.TextIOWrapper):
        data.append(data_input.read())

    if (type(data_input) == type('A')):
        data.append(data_input)

    # data가 리스트형식인지 검사합니다.
    if (isinstance(data_input, list)):
        for d in data_input:
            if (isinstance(d, io.TextIOWrapper)):
                temp = d.read()
                data.append(temp)
            elif(isinstance(d, str)):
                data.append(d)

    if (len(data)==0):
        print('data_input is empty or invalid')
        result = None
    else:
        result = model.transform(data).toarray()
        # result = model.inverse_transform(data)
    return result
    
# pickle 패키지를 이용하여 tfidf모델을 현재 로컬폴더에 저장합니다.
def save(model, name):
    with open(name + '.pk', 'wb') as file:
        pickle.dump(model, file)
        
# pickle 패키지를 이용하여 tfidf모델을 현재 로컬폴더에서 가져옵니다.
# 이름이 같다면 무조건 물러오기 때문에 이 함수는 불러오는 모듈이 tfidf모델인지 체크하지 않습니다.
def load(name):
    """
    각각 tfidf 모델의 이름은 다음과 같다.
    content_tfidf_model.pk
    judgement_tfidf_model.pk
    summary_tfidf_model.pk
    tfidf_model.pk
    """
    if ((name != 'content_tfidf_model.pk') and 
        (name != 'judgement_tfidf_model.pk') and
        (name != 'summary_tfidf_model.pk') and
        (name != 'tfidf_model.pk')):
        print('Wrong tfidf model name')
        print('name must include .pk suffix')
        return

    with open(name, 'rb') as file:
        return pickle.load(file)

    
# region start 유사도 분석
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
        print('data 1, data 2 Set 유사도: {0:.3f}'.format(similarity))
    return similarity

def eucli_similarity(data1, data2, Print=False):
    # 유클리디언 유사도를 구합니다.
    similarity = euclidean_distances(data1, data2)
    if (Print):
        print('data 1, data 2 Euclidean 유사도: {0:.3f}'.format(similarity))
    return similarity

def manhattan_similarity(data1, data2, Print=False):
    # 맨해튼 유사도를 구합니다.
    norm_data1 = __normalize(data1)
    norm_data2 = __normalize(data2)
    similarity = manhattan_distances(norm_data1, norm_data2)
    if (Print):
        print('data 1, data 2 Manhattan 유사도: {0:.3f}'.format(similarity))

def similarity(data1, data2, method, Print=False):
    if (method == 'set'):
        similarity = set_similarity(data1, data2, Print)
    elif (method == 'eucli'):
        similarity = eucli_similarity(data1, data2, Print)
    elif (method == 'manhattan'):
        similarity = manhattan_similarity(data1, data2, Print)
    elif (method == 'cos'):
        similarity = cos_similarity(data1, data2, Print)
    else:
        print("Illegal method name")
        return
    return similarity[0]
# region end 유사도 분석        


# 특정 벡터를 정규화합니다.
# 본 프로젝트에서는 유사도 분석시의 결과를 0~1의 범위로 제한시키기 위해 tfidf결과값에 정규화를 취해준뒤 유사도를 분석합니다.
def __normalize(v):
    norm = np.sum(v)
    return v / norm 


# tfidf를 이용하여 본프로젝트의 DB속 판례 데이터와 input으로 받은 data의 유사도를 전체적으로 분석하여 가장 높은 유사도를 보이는 top10을 골라줍니다.
def similarity_with_db(data, case_name, method, table, include_weights=False, Print=False):
    # 사건명 parameter를 추가하고 해당 사건명에 해당하는 판례들만 비교하도록 변경
    """
    data : 판례 데이터 (각각 부분별)
    str type입니다.

    case_name : 사건명을 string으로 넣어줍니다. 이때 case_name이 

    method : string으로 받아줍니다
        'set', 'eucli', 'manhattan', 'cos'

    table : 어떤 테이블(판시사항, 판결요지, 판례내용)에서 받아올지
        'Summary', 'Judgement', 'Content'

    Print : 중간 디버그 메시지를 뽑을지 말지 boolean으로 받음
    """
    
    if (table == 'Summary'):
        tfidf_data = do(load('summary_tfidf_model.pk'), data)
    elif (table == 'Judgement'):
        tfidf_data = do(load('judgement_tfidf_model.pk'), data)
    elif (table == 'Content'):
        tfidf_data = do(load('content_tfidf_model.pk'), data)
    else:
        print('Wrong table name')
        return

    
    cur = db_cursor()
    same_case_name_ids = find_ids(case_name)

    weights = []

    print('db loop start')
    for ids in same_case_name_ids:
        # summary 의 경우 key_weight의 개수가 5731개이다
        # judgement의 경우 key_weight의 개수가 16594개이다
        # content의 경우 key_weight의 개수가 109131개이다
        key_weight_num = 0
        if (table == 'Summary'):
            key_weight_num = 5731
        elif (table == 'Judgement'):
            key_weight_num = 16594
        elif (table == 'Content'):
            key_weight_num = 109131
        
        # key_weight의 개수를 길이로 가지는 array를 선언
        weight=[0 for i in range(0, key_weight_num)]

        # db에 존재하는 key index들을 가져옴
        index_sql = 'select keyindex from ' + table + ' where Precedent_ID=' + str(ids) + ' order by keyindex asc'
        cur.execute(index_sql)
        index_temp = [var[0] for var in list(cur.fetchall())]

        # index와 동일한 순서대로 key_weight들을 db에서 가져옴
        weight_sql = 'select keyweight from ' + table + ' where Precedent_ID=' + str(ids) + ' order by keyindex asc'
        cur.execute(weight_sql)
        weight_temp = [var[0] for var in list(cur.fetchall())]

        # key_weight들을 index정보를 이용하여 올바른 위치에 넣어줌
        idx = 0
        for ind in index_temp:
            weight[ind] = weight_temp[idx]
            idx+=1
            
        # 재구성된 weight를 weights에다 붙여줌
        # 여기서 weight는 하나의 판례에 대한 tfidf 결과값 벡터를 의미한다.
        # 각각 판례의 tfidf분석결과의 리스트가 각각의 인덱스에 들어가므로 결론적으로 2차원 배열이 된다.
        weights.append(weight)

    print('db loop finish')

    # matrix연산을 위해 matrix로 type을 변경
    db_data_matrix = np.matrix(weights)

    # 유사도를 분석
    similarity_arr = similarity(tfidf_data, db_data_matrix, method, Print)

    # 유사도가 높은순서대로 해당 index를 뽑아서 해당 index에 해당하는 case id를 return합니다. 
    if (include_weights):
        return similarity_arr, weights
    else:
        return similarity_arr

def top10(purpose, cause, case_name, method, Print=False):
    """
    purpose : 소장 청구취지
    cause : 소장 청구원인
    str type입니다.

    case_name : 사건명을 string으로 넣어줍니다. 이때 case_name이 

    method : string으로 받아줍니다
        'set', 'eucli', 'manhattan', 'cos'
        
    Print : 중간 디버그 메시지를 뽑을지 말지 boolean으로 받음
    """
    ids = find_ids(case_name)
    if (ids == None):
        return

    print('start')
    summary_simil = similarity_with_db(purpose, case_name, method, 'Summary', Print)
    print('summary finish')
    judgement_simil = similarity_with_db(cause, case_name, method, 'Judgement', Print)
    print('judgement finish')
    content_simil = similarity_with_db(cause, case_name, method, 'Content', Print)
    print('content finish')

    total_simil = summary_simil + judgement_simil + content_simil
    total_descent_simil = np.sort(total_simil)[:][::-1]
    total_descent_ids = np.array(ids)[np.argsort(total_simil)[:][::-1]]

    result = {}
    result['keywords'] = decode(find_indexes())
    result['ids'] = (total_descent_ids[:10], total_descent_simil*100)
    return result
        
def find_ids(case_name):
    cursor = db_cursor()
    sql = ('select ID from ict.Precedent where caseName Like "%'
        + case_name + '%" or caseName Like "손해배상"')
    cursor.execute(sql)
    same_case_name_ids = list(cursor.fetchall())
    ids = [same_case_name_ids[i][0] for i in range(len(same_case_name_ids))]
    return ids
        
def db_cursor():
    host = "ict.cor8kkyfcogd.ap-northeast-2.rds.amazonaws.com"
    port = 3306
    username = "admin"
    database = "ict"
    password = "48834883"

    try:
        conn = pms.connect(host=host,user=username,password=password,db=database, port=port, use_unicode=True, charset="utf8")
        cursor=conn.cursor()
    except:
        print("연결 실패")
        return

    return cursor

def find_indexes(key_weight):
    indexes = np.argsort(key_weight)[::-1]
    return indexes[:10]

# print(top10(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]))s--++