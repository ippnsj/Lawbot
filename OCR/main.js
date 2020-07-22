const express = require('express');
const app = express();
const axios = require('axios').default;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());

app.post('/apicall', upload.single('temp'), (req, res) => {
    let file = req.file.buffer.toString('base64');
    var mimetype = req.file.mimetype.split("/");
    let data = {
        "version": "V1",
        "requestId": "test",
        "timestamp": 0,
        "images":
        [{
            "format": mimetype[mimetype.length - 1],
            "name": "tmp",
            "data": file,
        }]
    };
   
    // naver에다가 보내는 api
axios.post("https://571c51cbfe4f47808884e4a36286721d.apigw.ntruss.com/custom/v1/2609/4f1d71e2a236f959f6423ed2c5970e8799f7b9296f24a03b675a77d769f0ad87/general", data, {
        headers: {
            'Content-Type': 'application/json',
            'X-OCR-SECRET': 'SldleHFpZFBwVUJteHJvaEREVmRjcXdXUlVQdHFhTkE=',
        },
    }).then((result) => {
        res.json(result.data);
    }).catch((result) => {
        console.log(result);
    });
    
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.listen('8081');