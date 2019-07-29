// importing the dependencies
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const http = require('http');
const fs = require('fs');
const watson = require('watson-developer-cloud/speech-to-text/v1');
var TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});

app.get('/about', function (req, res)  {
  res.send('Hello, about!')
})

app.post('/translate', (req, res) => {
  const options = {
      method: 'post',
      url: 'https://gateway.watsonplatform.net/language-translator/api/v3/translate?version=2018-05-01',
      auth: {
          username:'apikey',
          password: process.env.TRANSLATE_PSW
      },
     data:req.body
    };
    
    let response2;
    axios(options)
    .then(response => {
        response2= response.data.translations;
        res.send(response2);
    })
    .catch(error => {
      console.log("error", error);
    });
  
});


app.post('/audio', (req, res) => {
  console.log(`This is the audio request2---- ${process.env.IAM_APIKEY}`);

  var textToSpeech = new TextToSpeechV1({
    iam_apikey: process.env.IAM_APIKEY,
    url: 'https://stream.watsonplatform.net/text-to-speech/api/'
  });
  
  var params = {
    text: 'Hello from IBM Watson',
    voice: 'en-US_AllisonVoice', // Optional voice
    accept: 'audio/wav'
  };
  
  
  const synthStream = textToSpeech.synthesizeUsingWebSocket(params);
// synthStream.pipe(fs.createWriteStream('./audio.ogg'));



  res.send(synthStream);
});

// starting the server
// app.listen(3001, () => {
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});