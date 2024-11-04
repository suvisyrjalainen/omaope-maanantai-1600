import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

dotenv.config();

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

