import { toast } from "../utils/toast.js";

async function getDetails(password, token, email) {
  const submitBtn = document.getElementById("submitBtn");

  submitBtn.disabled = true;

  submitBtn.textContent = "Verifying...";
  const body = {
    email,
    password,
    token,
  };

  // console.log(JSON.stringify(body));
  const response = await fetch("http://localhost:5000/reset-password", {
    method: "POST", // HTTP method for sending data
    body: JSON.stringify(body), // Send data as JSON
  });

  const result = await response.json();
  // console.log(response)
  if (response.ok) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Success";

    // console.log("success");
    await toast(result.message);
    window.location.href = "/src/User/login.html";
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Failed";
    await toast(result.error || "Something went wrong!", "error");
    window.location.reload(); // refresh page
  }
  // const result = await response.text(); // Extract response text
  // const result = await response.json();

  return result;
}
document.addEventListener("submit", async function (e) {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const confPassword = document.getElementById("confPassword").value;
  if (password !== confPassword) {
    await toast("Password does not match.", "error");
    return;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const token = decodeURIComponent(urlParams.get("resetToken")); // get the token from url
  const email = decodeURIComponent(urlParams.get("email")); // get the email
  const test = await getDetails(password, token, email);
  // await toast(test.message);
});
