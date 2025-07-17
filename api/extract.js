import { Configuration, OpenAIApi } from 'openai';
import express from 'express';

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }
  const prompt = `
Extract as many of the following as possible from the text and output ONLY as JSON:
projectTitle, companyName, siteAddress, siteContactName, siteContactPhone, crewSize, forkliftSize, trailerType, tractorType, workDescription

If a value isn't present, leave it blank.

Text:
"""${text}"""

JSON:
`;
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 250,
      temperature: 0,
    });
    const match = completion.data.choices[0].text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : {};
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: 'Extraction failed' });
  }
});

export default router;
