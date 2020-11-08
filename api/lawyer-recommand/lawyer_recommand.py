import pymysql as pms
import json
import os
import sys
# DB에 연결
host = "ict.cor8kkyfcogd.ap-northeast-2.rds.amazonaws.com"
port = 3306
username = "admin"
database = "ict"
password = "48834883"

try:
    conn = pms.connect(host=host,user=username,password=password,db=database, port=port, use_unicode=True, charset="utf8")
    cursor=conn.cursor()
except:
    logging.error("연결 실패")
    
def recommand(category_list, n=5):
    lawyers_id = []
    
    query = 'SELECT ID FROM Lawyer'
    cursor.execute(query)
    select = [i[0] for i in cursor.fetchall()]

    for lawyer_id in select:
    # pymysql을 이용해 DB에서 lawyer들의 id를 하나씩 순차적으로 받아온다. 
    # (하나씩 접근이 불가능 할 경우 id의 리스트를 먼저 저장)
        # score 초기화
        score = 0
        query = "SELECT Category_ID FROM LawyerField WHERE '{0}' = Lawyer_ID".format(lawyer_id)
        cursor.execute(query)
        
        #category = list(cursor.fetchall())
        category = [t[0] for t in cursor.fetchall()]

        for interest in category:
            # DB에서 해당 lawyer의 관심분야를 받아서 category_list에 존재할경우 score++
            if interest in category_list:
                score += 1
            # end for loop
        # [id, score]로 laywers_id에 append해준다
        lawyers_id.append([lawyer_id, score])
        # end for loop
    
    # lawyers_id 를 스코어에 대해 내림차순으로 정렬
    lawyers_id = sorted(lawyers_id, key=lambda lawyer: lawyer[1], reverse=True)
    return lawyers_id[:n]
tags=sys.argv[1].split(",")
for n, i in enumerate(tags):
    tags[n] = int(i)

#print(tags);
print(json.dumps(recommand(tags,5)))