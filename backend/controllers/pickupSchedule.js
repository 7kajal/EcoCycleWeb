import { ObjectId } from "mongodb";
import { database } from "../server.js";
import { sendEmail } from "../utils/email.js";

export async function pickupSchedule(req, res) {
  // console.log(req.headers);
  const email = req.headers.cookie
    .split(";")
    .find((e) => e.includes("email="))
    .split("=")[1];
  // console.log(email);

  if (!email) {
    return res.end({ error: "You need to login first" });
  }
  let formData = "";
  req.on("data", (msg) => {
    formData += msg.toString();
  });
  // console.log("data", formData);

  let parsedData;
  req.on("end", async () => {
    parsedData = await JSON.parse(formData);

    const userCollection = database.collection("userCollection");

    // console.log(parsedData.itemId);
    const item = await userCollection.findOne({
      "reqAccepted.itemId": new ObjectId(parsedData.itemId),
    });

    // item.reqAccepted.forEach((id) => {
    //   console.log("Type of id.itemId:", typeof id.itemId.toString(), id.itemId);
    //   console.log(
    //     "Type of parsedData.id:",
    //     typeof parsedData.itemId,
    //     parsedData.itemId
    //   );
    // });

    let see = "";
    // const comp = item.reqAccepted.find((id) => {
    //   const id1 = id.itemId.toString();
    //   const id2 = parsedData.itemId;
    //   console.log(id1 === id2);
    // });
    const comp = item.reqAccepted.find(
      (itm) => itm.itemId.toString() === parsedData.itemId
    );

    const itemCollection = database.collection("recycleItem");

    const updateStatus = await itemCollection.updateOne(
      {
        _id: new ObjectId(parsedData.itemId),
      },
      {
        $set: { status: "Scheduled" },
      }
    );
    console.log(updateStatus);

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

    // console.log(item);
    await sendEmail(comp.compEmail, "Time scheduled", context);
  });
  return res.end(JSON.stringify({ message: "Pickup scheduled" }));
}
