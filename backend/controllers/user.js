import { database } from "../server.js";
import { sendEmail } from "../utils/email.js";
import { generateId } from "../utils/randomId.js";

// const users = [
//     { email: "user1@gmail.com", password: "1234" },
//     { email: "user2@gmail.com", password: "2345" },
//     { email: "user3@gmail.com", password: "3456" },
//     { email: "user4@gmail.com", password: "4567" },
//     { email: "user5@gmail.com", password: "5678" }
// ];

export function login(req, res) {
  // if (req.method === "OPTIONS") {
  //   res.end();
  // }
  // console.log(req.method);

  if (req.method !== "POST") {
    res.statusCode = 405; // Method not allowed
    return res.end();
  }
  let data = ""; // Initialize an empty string to store incoming data

  // Event listener for incoming data from the client
  req.on("data", (msg) => {
    data += msg.toString(); // Append incoming data to 'data'
  });

  req.on("end", async (msg) => {
    const formData = JSON.parse(data); // Parse the received JSON data

    const userCollection = database.collection("userCollection");

    const userFound = await userCollection.findOne({ email: formData.email });

    if (!userFound) {
      res.statusCode = 404; // Not Found
      return res.end(JSON.stringify({ message: "User not found" }));
    }
    const userAgent = req.headers["user-agent"]; // Get device info
    // const ip =
    //   req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get IP Address
    const time = new Date().toUTCString(); // Get current timestamp

    // body of email
    const context = `
    <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <tr>
    <td align="center">
      <table width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
          <td align="center" style="padding-bottom: 20px;">
            <h2 style="color: #333;">New Login Detected</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 20px; color: #555; font-size: 16px;">
            <p>Hello,</p>
            <p>We detected a new login to your account from a new device or location.</p>
            <p><strong>Details:</strong></p>
            <ul style="line-height: 1.6;">
              <li><strong>Device:</strong> ${userAgent}</li>
           
              <li><strong>Time:</strong> ${time}</li>
            </ul>
            <p>If this was you, no further action is needed.</p>
            <p>If you don't recognize this activity, please secure your account immediately.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 20px;">
            <a href="#" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Secure Your Account</a>
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
    // check if password is correct
    if (userFound.password === formData.password) {
      // send email if user is not admin
      if (userFound.role !== "admin") {
        const emailRes = await sendEmail(
          formData.email,
          "New login detected", // subject
          context
        ); // calling the sendEmail
        // console.log(emailRes);
      }
      // Setting up the cookie

      const expiry = 30 * 24 * 60 * 60; // 30 days
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
        "Set-Cookie": [
          `LoggedIn=True; Path=/; Max-Age=${expiry}`,
          `role=${userFound.role}; Path=/; Max-Age=${expiry}`,
          `email=${userFound.email}; Path=/; HttpOnly; Max-Age=${expiry}`,
        ],
      });
      return res.end(JSON.stringify({ message: "Login successful." }));
    } else {
      res.statusCode = 401; //unauthorized
      return res.end(JSON.stringify({ message: "Invalid password." }));
    }
    // // Check if the email exists in the users array
    // const userFound = users.find(user => user.email === formData.email);
    // if (!userFound) {
    //     // If user not found, send error messageHttpOnly
    //     return res.end(JSON.stringify({ message: "User not found" }));
    // }

    // // Check if the password matches
    // if (userFound.password === formData.password) {
    //     // If email and password match, send success message
    //     return res.end(JSON.stringify({ message: "Login successful." }));
    // } else {
    //     // If password does not match, send error message
    //     return res.end(JSON.stringify({ message: "Invalid password." }));
    // }
  });
}
//
export function register(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405; // Method not allowed
    return res.end();
  }
  let data = ""; // Initialize an empty string to store incoming data

  // Event listener for incoming data from the client
  req.on("data", (msg) => {
    data += msg.toString(); // Append incoming data to 'data'
  });

  req.on("end", async (msg) => {
    const formData = JSON.parse(data); // Parse the received JSON data
    const userCollection = database.collection("userCollection");
    const userFound = await userCollection.findOne({ email: formData.email });

    if (userFound) {
      res.statusCode = 400; // invalid
      return res.end(JSON.stringify({ message: "user already exists." }));
    } else {
      let data;
      if (formData.role === "user") {
        data = {
          ...formData,
          points: 0,
          imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            formData.name
          )}&background=random`,
          reqAccepted: [],
        };
      } else {
        data = {
          ...formData,
          itemsAccepted: [],
        };
      }
      const insertUser = await userCollection.insertOne(data);

      const context = `
      <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <tr>
    <td align="center">
      <table width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
          <td align="center" style="padding-bottom: 20px;">
            <h2 style="color: #333;">Welcome to EcoCycle</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 20px; color: #555; font-size: 16px;">
            <p>Hello,</p>
            <p>Thank you for joining EcoCycle, your partner in sustainable living.</p>
            <p><strong>What you can do:</strong></p>
            <ul style="line-height: 1.6;">
              <li>Track your recycling progress</li>
              <li>Learn sustainable habits</li>
              <li>Join our eco-friendly community</li>  
            </ul>
            <p>Start your journey towards a greener future today!</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 20px;">
            <a href="http://localhost:5173" style="background-color: #28a745; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Get Started</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 20px; font-size: 12px; color: #777;">
            <p>Need help? Contact our support team.</p>
            <p>&copy; 2025 EcoCycle. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

      `;

      const emailRes = await sendEmail(
        formData.email,
        "Welcome to EcoCycle", // subject
        context
      );
      // console.log(insertUser);
      res.statusCode = 201; // Created
      return res.end(
        JSON.stringify({ message: "user registered successfully." })
      );
    }

    // // Check if the email already exists in the users array
    // const userFound = users.find(user => user.email === formData.email);

    // if (userFound) {
    //     // If the user already exists, send error message
    //     return res.end(JSON.stringify({ message: "User already exists." }));
    // } else {
    //     // If the user does not exist, add them to the users array
    //     users.push(formData);
    //     // Send success message after adding the new user
    //     return res.end(JSON.stringify({ message: "User registered successfully." }));
    // }
  });
}

export function logout(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentiacls": "true",
    "Set-Cookie": ["LoggedIn=''", " role=''", "email=''"],
  });
  return res.end(JSON.stringify({ message: "User logged out successfully" }));
}

export async function getUserDetails(req, res) {
  const email = req.headers.cookie
    .split(";")
    .find((e) => e.includes("email="))
    .split("=")[1];
  // console.log(email);

  if (!email) {
    res.statusCode = 401; // unauthorized
    return res.end({ error: "You are not authorized" });
  }

  try {
    const userCollection = database.collection("userCollection");
    const currentUser = await userCollection.findOne({ email }); // current user and we have only one user with each email that why findOne
    res.statusCode = 200; // success
    return res.end(JSON.stringify(currentUser));
  } catch (error) {
    console.error(error);
  }
}

export async function forgotPassword(req, res) {
  let data = "";
  req.on("data", (msg) => {
    data += msg.toString(); // Append incoming data to 'data'
  });

  req.on("end", async () => {
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    const userCollection = database.collection("userCollection");
    // const user = await userCollection.findOne({ email: parsedData.email });

    const resetToken = generateId(parsedData.email.split("@")[0]);
    const tokenExpiry = Date.now() + 10 * 60 * 1000;

    const user = await userCollection.updateOne(
      { email: parsedData.email },
      { $set: { resetToken, tokenExpiry } }
    );
    // console.log(user);
    if (user.matchedCount === 0) {
      tokenExpiry;
      res.statusCode = 404; // not found
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    console.log(user);
    const resetLink = `http://localhost:5173/src/User/reset-password?resetToken=${encodeURIComponent(
      resetToken
    )}&email=${parsedData.email}`;
    const context = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; text-align: center;">
    <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">You recently requested to reset your password. Click the button below to proceed.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 20px;">Reset Password</a>
        <p style="color: #777;">If you did not request a password reset, please ignore this email.</p>
        <div style="margin-top: 20px; font-size: 12px; color: #777777;">
            <p>&copy; 2025 EcoCycle. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    await sendEmail(parsedData.email, "Reset your password", context);
    return res.end(JSON.stringify({ message: "Reset link has been sent." }));
  });
}

export async function resetPassword(req, res) {
  let data = "";
  req.on("data", (msg) => {
    data += msg.toString(); // Append incoming data to 'data'
  });

  req.on("end", async () => {
    const parsedData = JSON.parse(data);
    // console.log(parsedData);
    const userCollection = database.collection("userCollection");
    const user = await userCollection.findOne({ email: parsedData.email });

    // if current time is less than time stored in db
    if (user.tokenExpiry < Date.now()) {
      // reseting the token and time
      await userCollection.updateOne(
        { email: parsedData.email },
        { $set: { resetToken: undefined, tokenExpiry: undefined } }
      );
      res.statusCode = 403; // forbidden
      return res.end(JSON.stringify({ error: "Token has been expired" }));
    }

    if (user.resetToken !== parsedData.token) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: "Invalid resetToken" }));
    }

    const updatedUser = await userCollection.updateOne(
      { email: parsedData.email },
      {
        $set: {
          password: parsedData.password,
          resetToken: undefined,
          tokenExpiry: undefined,
        },
      }
    );
    // console.log(user);
    if (user.matchedCount === 0) {
      res.statusCode = 404; // not found
      return res.end(JSON.stringify({ error: "User not found" }));
    }
    res.statusCode = 200;
    return res.end(JSON.stringify({ message: "Password has been reset." }));
  });
}
