import { toast } from "../utils/toast.js";

document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("date");
  const itemForm = document.getElementById("itemForm");

  dateInput.addEventListener("change", function () {
    validateDate();
  });

  itemForm.addEventListener("submit", function (event) {
    if (!validateDate()) {
      event.preventDefault(); // Prevent form submission if validation fails
    }
  });

  async function validateDate() {
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    if (selectedDate < today) {
      await toast("Please select a date greater than today.", "error");
      dateInput.value = ""; // Clear the invalid date
      return false;
    }
    return true;
  }
});

async function pickupSchedule(date, time, itemId) {
  const confirmBtn = document.getElementById("confirm");
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Processing...";
  const body = {
    date,
    time,
    itemId,
  };

  const res = await fetch("http://localhost:5000/pickupSchedule", {
    method: "POST",
    credentials: "include", // because we need to send cookie also
    body: JSON.stringify(body),
  });

  if (res.ok) {
    confirmBtn.disabled = false;
    await toast("Time scheduled");
    window.location.href = "/";
  } else {
    confirmBtn.disabled = false;
    await toast("something went wrong", "error");
    confirmBtn.textContent = "Try again";
    // window.location.reload(); // refresh page
  }
}

document.addEventListener("submit", async function (e) {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = decodeURIComponent(urlParams.get("id"));

  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!time) return await toast("Select time.");
  await pickupSchedule(date, time, itemId);
});
