import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

dotenv.config();

app.post('/chat',(req,res) =>{
  const userMessage = req.body.question;
  console.log(userMessage);

  

  if (userMessage) {
    res.json({ question: `Tämä on serverin palauttama viesti frontille: ${userMessage}` });
  } else {
    res.status(400).json({ error: 'Kysymys puuttuu.' });
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

