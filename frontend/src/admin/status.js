import { handleLogout } from "../User/logout";
if (!document.cookie.includes("LoggedIn=True")) {
  window.location.href = "/";
}

if (!document.cookie.includes("role=admin")) {
  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", async () => {
  const userTab = document.getElementById("users");
  if (window.location.href.includes("/admin/user.html")) {
    userTab.classList.add("bg-green-500");
  }
  const userList = document.getElementById("usersList");
  const stats = document.getElementById("stats");
  const userCountCard = document.createElement("div");
  userList.className = "mx-auto bg-white  rounded-lg shadow-lg";

  async function getUsers() {
    try {
      const res = await fetch("http://localhost:5000/admin/getAllUsers", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      return await res.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  const users = await getUsers();
  userCountCard.innerHTML = `
    <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold">Total Users</h2>
      <p class="text-4xl font-semibold">${users.length}</p>
    </div>
  `;

  stats.append(userCountCard);

  userList.innerHTML = `
    <table class="w-full border-collapse border border-green-500 mt-4">
      <thead>
        <tr class="bg-green-500 text-white">
        <th class="p-4 border">Sr No</th>
          <th class="p-4 border">Name</th>
          <th class="p-4 border">Email</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .slice(0, 9)
          .map(
            (user, index) => `
          <tr class="text-center">
          <td class="p-4 border">${index + 1}</td>
            <td class="p-4 border">${user.name}</td>
            <td class="p-4 border">${user.email}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
  const itemsList = document.getElementById("itemsList");
  const itemCountCard = document.createElement("div");
  const acceptedItemsCard = document.createElement("div");
  const collectedItemsCard = document.createElement("div");
  const pendingItemsCard = document.createElement("div");
  const scheduledItemsCard = document.createElement("div");

  async function getAllItems() {
    const res = await fetch("http://localhost:5000/admin/getAllItems", {
      credentials: "include",
    });

    const data = await res.json();
    // console.log("i", data);
    return data;
  }
  const items = await getAllItems();

  const collectedItems = items.filter((item) => item.status === "Collected").length;
  const acceptedItems = items.filter((item) => item.status === "Accepted").length;
  const scheduledItems = items.filter((item) => item.status === "Scheduled").length;
  const pendingItems = items.filter((item) => item.status === "Pending").length;

  // console.log(items);
  const itemsPrice = items.filter((e) => e.price);
  // console.log(itemsPrice);
  const price = itemsPrice.reduce((a, b) => a + parseFloat(b.price), 0);
  console.log(typeof price);
  // console.log(itemsPrice);

  // console.log(typeof itemsPrice[0].price);
  // let price = 0;
  // itemsPrice.forEach((element) => {
  //   price += parseInt(element.price);
  // });
  // console.log(price);

  itemCountCard.innerHTML = `
    <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold">Total Revenue</h2>
      <p class="text-4xl font-semibold">${price}</p>
    </div>
  `;

  pendingItemsCard.innerHTML = `
  <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
    <h2 class="text-2xl font-bold">Pending Items</h2>
    <p class="text-4xl font-semibold">${pendingItems}</p>
  </div>
`;

  scheduledItemsCard.innerHTML = `
    <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold">Schedule Items</h2>
      <p class="text-4xl font-semibold">${scheduledItems}</p>
    </div>
  `;

  acceptedItemsCard.innerHTML = `
    <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold">Accepted Items</h2>
      <p class="text-4xl font-semibold">${acceptedItems}</p>
    </div>
  `;

  collectedItemsCard.innerHTML = `
    <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold">Collected Items</h2>
      <p class="text-4xl font-semibold">${collectedItems}</p>
    </div>
  `;

  // console.log(typeof parseInt(itemsPrice[0].price));
  // console.log(itemsPrice.reduce((sum, e) => sum + Number(e.price)));

  const userBtnDiv = document.createElement("div");
  const userNextBtn = document.createElement("button");
  const userPrevBtn = document.createElement("button");
  userNextBtn.textContent = "next >";
  userPrevBtn.textContent = "< prev";
  userBtnDiv.classList.add("w-full", "flex", "justify-between");
  userBtnDiv.classList.add("p-4", "mx-2");
  userBtnDiv.append(userPrevBtn);
  userBtnDiv.append(userNextBtn);

  stats.append(itemCountCard);
  stats.append(pendingItemsCard);
  stats.append(acceptedItemsCard);
  stats.append(scheduledItemsCard);
  stats.append(collectedItemsCard);

  let userStart = 0;
  let userEnd = 9;

  userList.append(userBtnDiv);

  userNextBtn.addEventListener("click", function () {
    userStart += 10;
    userEnd += 10;
    if (userStart > users.length) return;
    userList.innerHTML = "";
    userList.innerHTML = `
    <table class="w-full border-collapse border border-green-500 mt-4">
      <thead>
        <tr class="bg-green-500 text-white">
        <th class="p-4 border">Sr No</th>
          <th class="p-4 border">Name</th>
          <th class="p-4 border">Email</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .slice(userStart, userEnd)
          .map(
            (user, index) => `
          <tr class="text-center">
          <td class="p-4 border">${index + userStart + 1}</td>
            <td class="p-4 border">${user.name}</td>
            <td class="p-4 border">${user.email}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
    userList.append(userBtnDiv);
  });

  userPrevBtn.addEventListener("click", function () {
    userStart -= 10;
    userEnd -= 10;
    if (userStart > users.length) return;
    userList.innerHTML = "";
    userList.innerHTML = `
    <table class="w-full border-collapse border border-green-500 mt-4">
      <thead>
        <tr class="bg-green-500 text-white">
        <th class="p-4 border">Sr No</th>
          <th class="p-4 border">Name</th>
          <th class="p-4 border">Email</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .slice(userStart, userEnd)
          .map(
            (user, index) => `
          <tr class="text-center">
          <td class="p-4 border">${index + userStart + 1}</td>
            <td class="p-4 border">${user.name}</td>
            <td class="p-4 border">${user.email}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
    userList.append(userBtnDiv);
  });

  userList.append(userBtnDiv);

  document.getElementById("logout").addEventListener("click", () => handleLogout());
});
