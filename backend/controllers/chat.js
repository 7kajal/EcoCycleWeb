import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBOqwFnLZuXAnKDDyC-AIEzhkmWKdDMmvY";
const geminiModel = "gemini-2.0-flash";

const systemInstruction = `You are Tia a HelpDesk Assistant at a EcoCycle (which is a website which helps user to recycle their waste and companies to collect those waste). 
We currently recycle the following categories: paper, plastic, glass, and metal. 
The minimum allowed weight for waste collection is 5 kg, and the maximum is 50 kg.
The price per kilogram for each category is:
- Paper: ₹12/kg
- Electronic: ₹15/kg
- Plastic: ₹10/kg
- Glass: ₹18/kg
- Metal: ₹28/kg
Please answer questions related to these categories, weight limits, and pricing and any other question related to recycle, eco-friendly and environment. You are not allowed to answer any other questions.`;

export async function chat(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 204;
    res.end();
    return;
  }

  // Using Google Gemini
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: geminiModel,
    systemInstruction,
  });

  let data = "";
  req.on("data", (msg) => {
    data += msg.toString();
  });

  req.on("end", async () => {
    try {
      const parsedData = JSON.parse(data);

      const chat = model.startChat();

      let result = await chat.sendMessage(parsedData.userPrompt);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          botResponse: result.response.candidates[0].content.parts[0].text,
        })
      );
    } catch (error) {
      console.error("Error processing chat request:", error);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });
}
