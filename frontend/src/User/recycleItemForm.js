import { calculatePrice } from "../utils/calculateprice";
import { toast } from "../utils/toast.js";

// console.log(document.cookie.includes("company"));
if (document.cookie.includes("company")) {
  window.location.href = "/";
}

const category = document.getElementById("category");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");

category.addEventListener("change", function () {
  price.value = calculatePrice(category.value, quantity.value);
});
quantity.addEventListener("change", function () {
  price.value = calculatePrice(category.value, quantity.value);
});

document.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!document.cookie.includes("user")) {
    return await toast("Login first to submit an item", "error");
  }

  const location = document.getElementById("location");

  if (!category) {
    await toast("Please select a category.", "error");
    return;
  } else if (quantity < 5) {
    await toast("Quanity should be minimum 5Kg.", "error");
    return;
  } else if (location.length < 15) {
    await toast("Please enter full address", "error");
    return;
  }

  await getItems(category.value, quantity.value, location.value, price.value);
  category.value = "";
  quantity.value = "";
  location.value = "";
  price.value = "";
});
async function getItems(category, quantity, location, price) {
  const body = {
    category,
    quantity,
    location,
    price,
  };

  const formBtn = document.getElementById("formBtn");
  formBtn.disabled = true;
  formBtn.textContent = "Submitting";
  //   console.log(JSON.stringify(body))
  const response = await fetch("http://localhost:5000/recycleItem", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (response.ok) {
    formBtn.disabled = false;
    formBtn.textContent = "Submitted.";
    await toast("Item submitted successfully");
    formBtn.textContent = "Submit";
  } else {
    formBtn.disabled = false;
    formBtn.textContent = "Failed";
    await toast("Something went wrong!", "error");
    formBtn.textContent = "Submit";
  }
  const result = await response.json();
  // console.log(result);
}
