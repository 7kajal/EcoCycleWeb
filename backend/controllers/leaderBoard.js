import { database } from "../server.js";

export async function leaderBoard(req, res) {
  const userCollection = await database.collection("userCollection");

  const users = await userCollection
    .find({ role: { $nin: ["company", "admin"] } })
    .sort({ points: -1 })
    .toArray();
  res.statusCode = 200;
  res.end(JSON.stringify(users));
}
