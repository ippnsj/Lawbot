"""
자 해봅시다.
변호사 추천 알고리즘을 짜야합니다.
일단 .py를 나눠서 작업하고 정리는 나중에합시다.
Class를 쓰나요? 아니면 바로 function 때리나요
ㅇㅋㅇㅋ function때릴게요
비슷? 한거같던데
function때리자
"""

import pymysql


def recommand(category_list):
    lawyers_id = []
    lawyer_id = 0
    #
    # for loop:
    # pymysql을 이용해 DB에서 lawyer들의 id를 하나씩 순차적으로 받아온다. (하나씩 접근이 불가능 할 경우 id의 리스트를 먼저 저장)
        # score 초기화
        # for loop:
            # DB에서 해당 lawyer의 관심분야를 받아서 category_list에 존재할경우 score++
            # end for loop
        # [id, score]로 laywes_id에 append해준다
        # end for loop
    
    # lawyers_id 를 스코어에 대해 내림차순으로 정렬
    # 점수가 곂치는 경우 랜덤으로다가 짤라준다.
    # laywers_id[0: 원하는 개수] 만큼 리턴한다.


    return lawyers_id