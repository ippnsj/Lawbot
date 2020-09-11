"""
자 해봅시다.
변호사 추천 알고리즘을 짜야합니다.
일단 .py를 나눠서 작업하고 정리는 나중에합시다.
Class를 쓰나요? 아니면 바로 function 때리나요
ㅇㅋㅇㅋ function때릴게요
비슷? 한거같던데
function때리자
"""

import pymysql as pms

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
    """
    category_list : 인풋으로 Category의 ID의 리스트를 받아야합니다.

    n : 상위 몇명까지 뽑을지에 대한 인풋 파라미터 입니다.
    """
    laywers = []
    
    query = 'SELECT ID FROM Lawyer'
    cursor.execute(query)
    laywers_id = list(cursor.fetchall())

    for lawyer_id in laywers_id:
    # pymysql을 이용해 DB에서 lawyer들의 id를 하나씩 순차적으로 받아온다. 
    # (하나씩 접근이 불가능 할 경우 id의 리스트를 먼저 저장)
        # score 초기화
        score = 0
        query = "SELECT Category_ID FROM LawyerField WHERE '{0}' = Lawyer_ID".format(lawyer_id)
        cursor.execute(query)
        category_ids = list(cursor.fetchall())

        for category_id in category_ids:
            if category_id in category_list:
                score += 1

        # [id, score]로 laywers에 append해준다
        lawyers.append([lawyer_id, score])
        # end for loop
    
    # lawyers_id 를 스코어에 대해 내림차순으로 정렬
    lawyers.sort(reverse=True)
    # laywers[0: 원하는 개수] 만큼 리턴한다.
    return lawyers[:n]