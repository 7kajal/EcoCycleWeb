import { database } from "../server.js";

export async function getAllUsers(req, res) {
  const email = req.headers.cookie
    .split(";")
    .find((e) => e.includes("email="))
    .split("=")[1];

  const role = req.headers.cookie
    .split(";")
    .find((e) => e.includes("role="))
    .split("=")[1];
  // console.log(email);

  if (!email) {
    res.status = 401;
    // console.log("error");
    return res.end(
      JSON.stringify({ error: "You must be logged in to access this resource" })
    );
  }

  if (role !== "admin") {
    res.status = 401;
    // console.log("error");
    return res.end(
      JSON.stringify({
        error: "You are not authorized to access this resource",
      })
    );
  }

  const userCollection = await database.collection("userCollection");
  const users = await userCollection.find().toArray();

  res.statusCode = 200;
  return res.end(JSON.stringify(users));
}
