import OpenAI from "openai";

async function testOpenAI() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY || "your_api_key_here",
    });

    console.log("Testing OpenAI connection...");
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "write a haiku about ai"},
      ],
    });

    console.log("Response received:");
    console.log(completion.choices[0].message);
    
    return completion.choices[0].message;
  } catch (error) {
    console.error("Error testing OpenAI:", error);
    throw error;
  }
}

// Uncomment to run the test directly
// testOpenAI().catch(console.error);

export default testOpenAI; 