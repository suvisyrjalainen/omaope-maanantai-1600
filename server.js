import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import vision from '@google-cloud/vision';
import fs from 'fs';


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

dotenv.config();

const upload = multer({ dest: 'uploads/' });

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'omaope-vision.json' 
});

let koealueTekstina = '';


app.post('/chat',async (req,res) =>{
  const userMessage = req.body.question;
  console.log(userMessage);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: userMessage }
      ],
      max_tokens: 150
    })
  });

  console.log('API response:', response);

  if(response.status===200){
    const data = await response.json();
    console.log('API response message:', data.choices[0].message.content);
    res.json({answer: data.choices[0].message.content});
  }
});

app.post('/upload-images', upload.array('images', 10), async(req,res) =>{
  console.log("Kuvat vastaanotettu");
  const files = req.files;
  console.log(files);
  //tiedoston validointi  
  if (!files || files.length === 0) {
   return res.status(400).json({ error: 'No files uploaded.' });
  }
  else{
    //Odotetaan, että kaikki kuvat on käsitelty OCR:n avulla, eli jokaisen kuvan teksti tunnistetaan.
    const texts = await Promise.all(files.map(async file => {
      // suoritetaan, että saadaan tiedostopolku kuvalle, jonka OCR-tunnistus halutaan suorittaa. 
      const imagePath = file.path;
      console.log(imagePath);
      // kutsu GCV API:lle, joka suorittaa OCR:n annetulle kuvalle
      const [result] = await client.textDetection(imagePath);
      //ottaa result-muuttujasta kaikki tekstintunnistusmerkinnät (textAnnotations), jotka sisältävät kaikki kuvasta tunnistetut tekstialueet.
      const detections = result.textAnnotations;
      //console.log('OCR Detected Text:', detections);
      // poistaa tiedoston, joka on luotu kuvan lähettämisen yhteydessä
      fs.unlinkSync(imagePath); 
      // Koodi tarkistaa, löytyykö kuvasta OCR-tunnistuksen perusteella tekstiä. Jos löytyy, se palauttaa tämän tekstin. Jos ei, se palauttaa tyhjän merkkijonon 
      return detections.length > 0 ? detections[0].description : '';
     }));

     koealueTekstina = texts.join(' ');
     console.log('OCR Combined Text:', koealueTekstina);
   //res.json({ message: 'Images uploaded successfully.' });
  }
});

/*
app.post('/get-question',(req,res) =>{
  const userMessage = req.body.question;
  console.log(userMessage);
  
  if (userMessage) {
    res.json({ question: `Tämä on serverin palauttama viesti frontille: ${userMessage}` });
  } else {
    res.status(400).json({ error: 'Kysymys puuttuu.' });
  }
});
*/

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

