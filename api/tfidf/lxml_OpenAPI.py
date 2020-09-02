"""
Requests 모듈을 이용하여 오픈 API로부터 판례 목록, 판례 본문등을 가져올 수 있습니다.
원하는 판례 목록들을 XML파일로 받아온뒤
LXML 모듈을 이용하여 판례일련번호만을 추출하여 판례 본문을 가져오는 API에 전달하게 됩니다.
여기서 본 프로젝트에서 사용하게 될 판시사항, 판결요지, 판결내용만을 추려 각각 txt파일로 저장합니다.
저장된 수많은 txt파일을 sentencepiece에 학습시키기 위해 하나의 txt파일로 합쳐 total_cas.txt로 저장합니다.

"""



import requests as rq
import re
import lxml
import os
from lxml import etree as et
from io import StringIO

# 특정 판례일련번호의 lxml element를 가져오는 함수입니다.
def get_case(case_number):
    main = {'OC':'ICTPoolC',
           'target':'prec',
           'ID': case_number, #가져오고 싶은 최대 판례 수
          'type':'XML'}
    res_main = rq.get('http://www.law.go.kr/DRF/lawService.do?',params=main)
    res_main = re.sub(' encoding="UTF-8"', '', res_main.text) 
    return et.fromstring(res_main)

#  특정 판례 lxml element에서 원하는 tag의 내용을 가져오는 함수입니다.
def findtext(tree, tag):
    for el in tree.iter():
        if (el.tag == tag):
            return re.sub('<.*?>','', el.text)

# 원하는 정보들만을 txt파일로 저장하는 함수입니다.
def save_local(xml_data, output_path, contents):
    """
    xml_data : 대상 xml파일입니다.
    
    output_path : 결과 txt파일을 저장할 경로입니다. 현재 디렉토리를 기준으로 상대경로로 찾아갑니다.
    
    contents : 받아올 정보를 str로 담고있는 리스트 입니다.
    ex) 사건명, 판시사항, 판결요지, 판례내용
    """
    # 받아온 판례목록 전처리
    data = re.sub(' encoding="UTF-8"', '', xml_data.text)
    data = et.XML(data)
    
    #원하는 정보만을 뽑아내는 과정
    for el in data.iter():
        if (el.tag == "판례일련번호"):
            THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
            my_file = os.path.join(THIS_FOLDER, output_path, el.text + ".txt")
            if not os.path.exists(os.path.dirname(my_file)):
                os.mkdir(os.path.join(THIS_FOLDER, output_path))
            f = open(my_file, 'w')
#             f.write(findtext(get_case(el.text), '판례정보일련번호') + '\n')
            if (type(contents) == list):
                for content in content:
                    if (type(content) == str):
                        f.wirte(findtext(get_case(el.text), content) + '\n')
            else :
                f.write(findtext(get_case(el.text), contents) + '\n')
                
            f.close()
            print(el.text + ' : saved')

# 여러개의 txt파일을 하나로 합쳐주는 함수입니다.
def txt_concat(path, output_name):
    
    file_list = os.listdir(path)
    output = open(path + '\\' + output_name, 'w')
    for name in file_list:
        if ".txt" not in name:
            continue
        f = open(path + '\\' + name, 'r')
        for line in f:
            output.write(line)
        output.write('\n')
    
        f.close()
    print(path + '\\' + output_name)
    output.close()

# 모든 동작을 하나로 묶어주는 함수로 실제로 사용하게 될 함수입니다.
def all_in_one(keyword, case_num, output_path, contents):
    ## 목록 request templat
    chart= {'OC':'ICTPoolC'
            ,'target':'prec'
            ,'type':'XML'
            ,'query': keyword
            ,'display': case_num
            ,'curt':'대법원'
            ,'prncYd':'20000101~20191231'
           }
    
    ## 목록 받아오기
    res_chart=rq.get('http://www.law.go.kr/DRF/lawSearch.do?',params=chart)
    
    save_local(res_chart, output_path, contents)
    txt_concat(os.path.join(os.getcwd(), output_path), 'total_case.txt')
