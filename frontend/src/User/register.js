import { toast } from "../utils/toast.js";

async function getDetails(name, email, password, role) {
  const registerBtn = document.getElementById("submitBtn");
  registerBtn.disabled = true;

  const body = {
    name,
    email,
    password,
    role,
  };

  // console.log(body)
  registerBtn.textContent = "Registering...";

  const response = await fetch("http://localhost:5000/register", {
    method: "POST", //HTTP method for sending data
    body: JSON.stringify(body), // send data as JSON
  });

  const details = await response.json();
  if (response.ok) {
    registerBtn.disabled = false;
    registerBtn.textContent = "Registered";

    // toast("Success");
    // console.log("success");
    await toast("Registration successful");
    window.location.href = "/src/User/login.html";
  } else {
    registerBtn.textContent = "Registration Failed";
    registerBtn.disabled = false;
    console.log(details.error)
    // console.log("failed");
    await toast(details.message || details.error, "error");
    // window.location.reload(); // refresh page
  }

  //extract response json
  // console.log(details);
  return details;
}

document.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  // await toast("Name:" + name);
  // await toast("Email:" + email);
  // await toast("Password:" + password);
  if (!name || !email || !password || !role) {
    await toast("All fields are required.", "error");
    return;
  }

  const test = await getDetails(name, email, password, role);
  // console.log(test)
  // await toast(test.message);
  name.value = "";
  email.value = "";
  password.value = "";
  role = "";
});
