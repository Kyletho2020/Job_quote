const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const messages = body.messages;
    if (!messages) {
      return { statusCode: 400, body: "No messages provided." };
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });

    const reply = completion.data.choices[0].message.content;
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("OpenAI API call error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate response" })
    };
  }
};
