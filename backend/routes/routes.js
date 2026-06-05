// Defining a route handler function to process incoming HTTP requests.
// req represents the request  and res represents the response .
import { recycleItem } from "../controllers/recycleItem.js";
import {
  forgotPassword,
  getUserDetails,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/user.js";
import { getReqLists, updateReqList } from "../controllers/getUserReqList.js";
import { leaderBoard } from "../controllers/leaderBoard.js";
import { pickupSchedule } from "../controllers/pickupSchedule.js";
import { getAllUsers } from "../controllers/getAllUsers.js";
import { getAllItems } from "../controllers/getAlltems.js";
import { contactUs } from "../controllers/contact.js";
import { chat } from "../controllers/chat.js";

export const routes = (req, res) => {
  // console.log(req);
  // console.log(req.connection);
  // console.log(req.headers["user-agent"]);
  // console.log(req);
  if (req.url === "/login") {
    // Check if the request URL matches /login
    // res.end("login page");        // Send a response and end the response
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); //set the header to solve the cros error(getting access of the page)
    login(req, res);
  } else if (req.url === "/register") {
    // Check if the request URL matches /register
    // res.end("register page");           // Send a response and end the response
    res.setHeader("Access-Control-Allow-Origin", "*");  // this is bad 
    register(req, res);
  } else if (req.url === "/recycleItem") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // cors fix
    recycleItem(req, res);
  } else if (req.url === "/getReqLists") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    getReqLists(req, res);
  } else if (req.url === "/leaderBoard") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    leaderBoard(req, res);
  } else if (req.url === "/logout") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    logout(req, res);
  } else if (req.url === "/updateReqStatus") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    updateReqList(req, res);
  } else if (req.url === "/getcurrentuser") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    getUserDetails(req, res);
  } else if (req.url === "/pickupSchedule") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    pickupSchedule(req, res);
  } else if (req.url === "/admin/getAllUsers") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    getAllUsers(req, res);
  } else if (req.url === "/admin/getAllItems") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    getAllItems(req, res);
  } else if (req.url === "/forgot-password") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    forgotPassword(req, res);
  } else if (req.url === "/reset-password") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    resetPassword(req, res);
  } else if (req.url === "/contactus") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    contactUs(req, res);
  } else if (req.url === "/chat") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    chat(req, res);
  } else if (req.url === "/test") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "This is a message" }));
  }
};
