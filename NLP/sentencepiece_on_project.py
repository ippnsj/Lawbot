def train_sp(is_src=True):
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
                            20000,
                            1.0,
                            'bpe')

    spm.SentencePieceTrainer.Train(config)
    