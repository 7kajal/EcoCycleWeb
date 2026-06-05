import { toast } from "../utils/toast.js";

document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("date");
  const itemForm = document.getElementById("itemForm");

  dateInput.addEventListener("change", function () {
    validateDate();
  });

  itemForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateDate()) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const itemId = decodeURIComponent(urlParams.get("id"));

    const date = dateInput.value;
    const time = document.getElementById("time").value;

    if (!time) {
      return await toast("Select time.", "error");
    }

    await pickupSchedule(date, time, itemId);
  });

  function validateDate() {
    if (!dateInput.value) {
      toast("Please select a date.", "error");
      return false;
    }
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    if (selectedDate < today) {
      toast("Please select a date greater than today.", "error");
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
  }
}
