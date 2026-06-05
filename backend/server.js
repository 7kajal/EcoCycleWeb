import http from "http"; // Importing 'http' to create an HTTP server in Node.js.
import { MongoClient } from "mongodb"; // Importing MongoClient to interact with MongoDB
import { routes } from "./routes/routes.js";

function DBConnection() {
  const uri = "mongodb://127.0.0.1:27017/"; // MongoDB connection URI
  const client = new MongoClient(uri); // Creating a new MongoDB client
  const db = client.db("recycle"); // Connecting to  the "recycle" database
  return db; // Returning the database
}

export const database = DBConnection();
// try {
  const dbStats = await database.stats();
  // console.log("connected to DB");
// } catch (error) {
  // console.error("Failed to connect to DB");
// }

const PORT = 5000; // Defining the port number (1000) on which the server will listen for incoming requests.

const server = http.createServer((req, res) => routes(req, res)); // Creating a server that uses the 'routes' function to handle requests and responses.

server.listen(PORT, () => {
  // Start the server and print the port .
  console.log("Server is Listening on Port ", PORT);
});
