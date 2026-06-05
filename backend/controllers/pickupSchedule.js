import { ObjectId } from "mongodb";
import { database } from "../server.js";
import { sendEmail } from "../utils/email.js";
import { parseCookies } from "../utils/cookie.js";

export async function pickupSchedule(req, res) {
  const cookies = parseCookies(req);
  const email = cookies.email;

  if (!email) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: "You need to login first" }));
  }

  let formData = "";
  req.on("data", (msg) => {
    formData += msg.toString();
  });

  req.on("end", async () => {
    try {
      const parsedData = JSON.parse(formData);

      const userCollection = database.collection("userCollection");

      const item = await userCollection.findOne({
        "reqAccepted.itemId": new ObjectId(parsedData.itemId),
      });

      if (!item) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: "Associated request or company not found" }));
      }

      const comp = item.reqAccepted.find(
        (itm) => itm.itemId.toString() === parsedData.itemId
      );

      if (!comp) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: "Company details not found for pickup" }));
      }

      const itemCollection = database.collection("recycleItem");

      await itemCollection.updateOne(
        {
          _id: new ObjectId(parsedData.itemId),
        },
        {
          $set: { status: "Scheduled" },
        }
      );

      const context = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
          <tr>
            <td align="center">
              <h2 style="color: #333;">Pickup Schedule</h2>
              <p style="font-size: 16px; color: #555;">
                Hello,<br><br>
                A user has selected the following date and time:
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="10" border="0" style="background-color: #f9f9f9; border-radius: 5px; margin: 20px 0;">
                <tr>
                  <td align="center" style="font-size: 18px; font-weight: bold; color: #222;">
                    📅 Date: <span style="color: #007bff;">${parsedData.date}</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 18px; font-weight: bold; color: #222;">
                    ⏰ Time: <span style="color: #007bff;">${parsedData.time}</span>
                  </td>
                </tr>
              </table>
              <br><br>
              <p style="font-size: 14px; color: #777;">Thank you!</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
      `;

      await sendEmail(comp.compEmail, "Time scheduled", context);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "Pickup scheduled" }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
}
