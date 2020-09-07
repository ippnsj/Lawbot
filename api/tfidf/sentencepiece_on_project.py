import os
import sentencepiece as spm

# sentencepiece model을 학습시킵니다.
# lxml_OpenAPI 모듈에서 all_in_one함수를 실행시켰다는 전제하에 이용합니다.
def train_sp(vocab_size, is_src=True):
    template = "--input={} \
                --pad_id={} \
                --bos_id={} \
                --eos_id={} \
                --unk_id={} \
                --model_prefix={} \
                --vocab_size={} \
                --character_coverage={} \
                --model_type={}"


    config = template.format('Case_Main/total_cases.txt',
                            0,
                            1,
                            2,
                            3,
                            'output',
                            vocab_size,
                            1.0,
                            'bpe')

    # 실제 학습이 시작되는 함수
    spm.SentencePieceTrainer.Train(config)
    
# 이미 학습이 되었다는 가정하에 학습된 모델을 가져옵니다.
def get_sentencepiece():
    src_sp = spm.SentencePieceProcessor()
    # 현재 디렉토리에 학습된 모델이 있어야합니다.
    src_sp.Load("output.model")
    return src_sp

def significant_words(file, stop_words = None):
    """
    file은 하나씩만 넣읍시다.
    """
    model = get_sentencepiece()
   
    temp = sentencepiece.EncodeAsPieces(file) # 학습된 sentenpiece 모델을 이용합니다.
    
       if (stop_words is None):
        stop_words=['_', '의','가','이','은','들','는','좀','잘','걍','과','도','를','으로','자','에','와','한','하다','\n']
        
    temp=[word for word in temp_X if not word in stopwords] # 불용어 제거
    return temp
