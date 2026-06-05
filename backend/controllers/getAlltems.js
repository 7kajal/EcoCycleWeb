import { database } from "../server.js";
import { parseCookies } from "../utils/cookie.js";

export async function getAllItems(req, res) {
  const cookies = parseCookies(req);
  const email = cookies.email;
  const role = cookies.role;
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

  const itemCollection = await database.collection("recycleItem");
  const users = await itemCollection.find().toArray();

  res.statusCode = 200;
  return res.end(JSON.stringify(users));
}
