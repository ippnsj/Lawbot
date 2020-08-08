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

    spm.SentencePieceTrainer.Train(config)
    