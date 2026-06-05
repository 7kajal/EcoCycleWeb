import { database } from "../server.js";

export async function recycleItem(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405; // Method not allowed
    return res.end();
  }

  // console.log(req.headers);

  const email = req.headers.cookie
    .split(";")
    .find((e) => e.includes("email="))
    .split("=")[1];

  if (!email) {
    res.statusCode = 401; // unauthorized
    return res.end(JSON.stringify({ error: "Login to submit the request" }));
  }
  // console.log(email);

  // else {
  //   console.log("Valid token");
  // }

  // console.log(req.headers.cookie);
  // // const e1 = req.headers.cookie.split(";");
  // // console.log(e1);
  // // const e2 = e1[2];
  // // console.log(e2);
  // // const e3 = e2.split("=");
  // // console.log(e3);
  // // const email = e3[1];

  // const email = req.headers.cookie.split(";")[2].split("=")[1];
  // console.log(email);

  let recycleItems = "";
  req.on("data", (msg) => {
    recycleItems += msg.toString();
  });

  req.on("end", async (msg) => {
    const parsedData = JSON.parse(recycleItems);
    const data = {
      ...parsedData,
      email,
    };

    console.log(parsedData);
    // console.log(data);

    const itemCollection = database.collection("recycleItem");
    const userCollection = database.collection("userCollection");
    const userData = await userCollection.findOne({ email });

    // console.log(typeof userData);

    // ye samjha rha ahai ? 
    const itemData = {
      ...data,
      status: "Pending"}
    const insertItems = await itemCollection.insertOne(itemData);
    // console.log(insertItems);
    const updateUserData = await userCollection.updateOne(
      { email },
      { $set: { points: userData.points + 5 } }
    );

    // // console.log(insertItems);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.statusCode = 201;
    res.end(JSON.stringify({ message: "Item submitted" }));
  });
}
