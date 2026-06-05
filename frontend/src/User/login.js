import { toast } from "../utils/toast.js";

async function getDetails(email, password) {
  const loginBtn = document.getElementById("submitBtn");

  loginBtn.disabled = true;

  loginBtn.textContent = "Logging In...";
  const body = {
    email,
    password,
  };

  const response = await fetch("http://localhost:5000/login", {
    method: "POST", // HTTP method for sending data
    body: JSON.stringify(body), // Send data as JSON
    credentials: "include",
  });

  const result = await response.json();
  // console.log(response)
  if (response.ok) {
    loginBtn.disabled = false;
    loginBtn.textContent = "LoggedIn";

    // console.log("success");
    // await toast("Login success");
    await toast("Login Successful");
    if (document.cookie.includes("role=admin")) {
      window.location.href = "/src/admin/dashboard.html";
    } else {
      // window.location.href = "/";
    }
  } else {
    loginBtn.disabled = false;
    loginBtn.textContent = "Try again";
    // console.log("failed");
    await toast(result.message, "error");
    // window.location.reload(); // refresh page
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }
  // const result = await response.text(); // Extract response text
  // const result = await response.json();

  return result;
}
document.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const test = await getDetails(email, password);
  // await toast(test.message);
});
