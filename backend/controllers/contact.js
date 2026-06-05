import { sendEmail } from "../utils/email.js";

export async function contactUs(req, res) {
  let data = "";
  req.on("data", (msg) => {
    data += msg.toString(); // Append incoming data to 'data'
  });

  req.on("end", async () => {
    try {
      const parsedData = JSON.parse(data);
      const context = `
      <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Message</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; text-align: center;">
      <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: auto; text-align: left;">
          <h2 style="color: #333;">New Message Received</h2>
          <p style="color: #555;"><strong>Name:</strong> ${parsedData.name}</p>
          <p style="color: #555;"><strong>Email:</strong> ${parsedData.email}</p>
          <p style="color: #555;"><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">${parsedData.message}</p>
          <div style="margin-top: 20px; font-size: 12px; color: #777777; text-align: center;">
              <p>&copy; 2025 EcoCycle . All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
      `;
      const emailRes = await sendEmail(
        parsedData.email,
        "New message received",
        context
      );
      console.log(emailRes);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "message has been sent." }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
}
