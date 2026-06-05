import { ObjectId } from "mongodb";
import { database } from "../server.js";
import { sendEmail } from "../utils/email.js";
import { calculatePrice } from "../utils/calculatePrice.js";

export async function getReqLists(req, res) {
  // console.log(req.headers);

  // console.log(req.headers.cookie);
  // const email = req.headers.cookie.split(";")[2].split("=")[1];
  // const role = req.headers.cookie.split(";")[1].split("=")[1];

  const email = req.headers.cookie
    .split(";")
    .find((e) => e.includes("email="))
    .split("=")[1];
  // console.log(email);  ye samjha

  const role = req.headers.cookie
    .split(";")
    .find((e) => e.includes("role="))
    .split("=")[1];
  // console.log(email);

  if (email === "''" || !email) {
    res.status = 401;
    // console.log("error");
    return res.end(
      JSON.stringify({ error: "You must be logged in to access this resource" })
    );
  }

  const itemCollection = database.collection("recycleItem");
  let itemFound;
  if (role === "user") {
    itemFound = await itemCollection.find({ email }).toArray(); // only req if user
  } else {
    itemFound = await itemCollection.find().toArray(); // all req if company
  }

  return res.end(JSON.stringify(itemFound));
}

export async function updateReqList(req, res) {
  const email = req.headers.cookie
    .split(";")
    .find((e) => e.includes("email="))
    .split("=")[1];

  // console.log(req.headers);
  // return console.log(email);

  if (!email) {
    res.status = 401;
    return res.end(
      JSON.stringify({
        error: "You must be logged in to access this resource",
      })
    );
  }

  let data = ""; // Initialize an empty string to store incoming data

  const itemCollection = database.collection("recycleItem");
  const userCollection = database.collection("userCollection");

  // Event listener for incoming data from the client
  req.on("data", (msg) => {
    data += msg.toString(); // Append incoming data to 'data'
  });
  req.on("end", async (msg) => {
    const parsedData = JSON.parse(data);

    // console.log(parsedData);

    const itemData = await itemCollection.findOne({
      _id: new ObjectId(parsedData.id),
    });

    if (itemData.status === "Accepted" && parsedData.status === "Collected") {
      console.log("not allowed");
      res.statusCode = 400;
      return res.end(
        JSON.stringify({ error: "Item has not been scheduled net." })
      );
    }

    const reqData = await itemCollection.updateOne(
      { _id: new ObjectId(parsedData.id) },
      { $set: { status: parsedData.status } }
    );

    const companyData = await userCollection.updateOne(
      { email },
      { $push: { itemsAccepted: itemData } }
    );

    // update user
    const userData = await userCollection.updateOne(
      {
        email: itemData.email,
      },
      { $push: { reqAccepted: { compEmail: email, itemId: itemData._id } } }
    );

    const context = `
    <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <tr>
    <td align="center">
      <table width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
          <td align="center" style="padding-bottom: 20px;">
            <h2 style="color: #333;">Schedule Your Pickup</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 20px; color: #555; font-size: 16px;">
            <p>Hello,</p>
            <p>We have received your pickup request. Please Schedule your preferred date and time for pickup.</p>
            <p><strong>Steps to Schedule:</strong></preq 
            <ul style="line-height: 1.6;">
              <li>Select a suitable date and time for pickup.</li>
              <li>Click the  link below.</li>
            </ul>
            <p>Click the button below to Schedule your pickup:</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 20px;">
            <a href="http://localhost:5173/src/company/recycleForm.html?id=${encodeURIComponent(
              parsedData.id
            )}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Schedule Pickup</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 20px; font-size: 12px; color: #777;">
            <p>If you have any questions, contact our support team.</p>
            <p>&copy; 2025 EcoCycle. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `;
    // console.log(itemData.email);
    const resEmail = await sendEmail(
      itemData.email,
      "Schedule pickup",
      context
    );
    // console.log(resEmail);
    res.statusCode = 200;
    return res.end(JSON.stringify({ message: "status updated" }));
  });
}
