import { toast } from "../utils/toast.js";

const contactForm = document.getElementById("contactForm");
const contactFormSubmitBtn = document.getElementById("contactFormSubmit");
contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("hefvbhsvfh");
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  await sendContactForm(name, email, message);
});

async function sendContactForm(name, email, message) {
  contactFormSubmitBtn.disabled = true;
  const body = {
    name,
    email,
    message,
  };
  const res = await fetch("http://localhost:5000/contactus", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.ok) {
    contactFormSubmitBtn.disabled = false;
    contactFormSubmitBtn.textContent = "Success";
    await toast("Your message has been sent.");
    window.location.reload();
  } else {
    contactFormSubmitBtn.disabled = false;
    contactFormSubmitBtn.textContent = "Failed";
    await toast("Something went wrong", "error");
  }
}
