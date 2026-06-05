import { toast } from "../utils/toast.js";

async function getDetails(email) {
  const submitBtn = document.getElementById("submitBtn");

  submitBtn.disabled = true;

  submitBtn.textContent = "Sending reset Link...";
  const body = {
    email,
  };

  // console.log(JSON.stringify(body));
  const response = await fetch("http://localhost:5000/forgot-password", {
    method: "POST", // HTTP method for sending data
    body: JSON.stringify(body), // Send data as JSON
  });

  // console.log(response)
  let result = null;
  try {
    result = await response.json();
  } catch (err) {
    // Ignore JSON parse error if response body is empty or not JSON
  }

  if (response.ok) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Reset link sent";

    // console.log("success");
    await toast("Reset Link Sent");
    submitBtn.textContent = "Send reset link";

    // window.location.href = "/src/User/login.html";
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Failed";
    await toast("Something went wrong!", "error");
    submitBtn.textContent = "Try again";
  }

  return result;
}
document.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const test = await getDetails(email);
  // await toast(test.message);
});
