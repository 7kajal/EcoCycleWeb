import { toast } from "../utils/toast.js";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return "";
}

const role = getCookie("role");
const email = getCookie("email");

if (!email || email === "''") window.location.href = "/";

async function getReqLists() {
  try {
    const response = await fetch("http://localhost:5000/getReqLists", { credentials: "include" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching request list:", error);
    document.getElementById("reqList").innerHTML = "<p class='text-red-500'>Error loading requests.</p>";
  }
}

const data = await getReqLists();
// console.log(data);

if (!data || data.error || data.length === 0) {
  document.getElementById("reqHead").textContent = "0 Requests";
  document.getElementById("reqList").innerHTML = "<p class='text-gray-500'>No requests available.</p>";
}

const filterBy = document.getElementById("filterBy");

filterBy.addEventListener("change", (e) => {
  // console.log(e.target.value);
  addValue(data, e.target.value);
});

// Set the default filter Staus to Pending
function addValue(data, status = "Pending") {
  let filteredData = [];


  filteredData = data.filter((item) => item.status === status);

  const requestList = document.getElementById("reqList");
  requestList.innerHTML = "";

  if (filteredData.length === 0) {
    requestList.innerHTML = `<div class='text-2xl text-center font-bold'>0 ${status} Requests </div>`;
    return;
  }
  const table = document.createElement("table");
  table.classList.add("w-full", "table-auto", "border-collapse", "bg-white", "shadow-md", "rounded-lg", "overflow-hidden", "text-sm", "sm:text-base", "table-fixed");

  const thead = document.createElement("thead");
  thead.classList.add("bg-green-800", "text-white");

  const headerRow = document.createElement("tr");
  const headers = role === "company" ? ["Email", "Category", "Quantity", "Location", "Status", "Actions"] : ["Category", "Quantity", "Location", "Status"];

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.classList.add("px-6", "py-3", "text-left", "font-semibold", "uppercase", "tracking-wider", "truncate", "max-w-xs");
    th.innerText = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  filteredData.forEach((item, index) => {
    const row = document.createElement("tr");
    row.classList.add("border-b", index % 2 === 0 ? "bg-gray-100" : "bg-white", "hover:bg-gray-200", "transition");

    const rowData =
      role === "company"
        ? [item.email || "N/A", item.category || "N/A", item.quantity || "N/A", item.location || "N/A", item.status || "Pending"]
        : [item.category || "N/A", item.quantity || "N/A", item.location || "N/A", item.status || "Pending"];

    rowData.forEach((cellData) => {
      const td = document.createElement("td");
      td.classList.add("px-6", "py-2", "text-gray-700", "whitespace-nowrap", "text-sm", "sm:text-base", "text-left", "truncate", "max-w-xs");
      td.innerText = cellData;
      row.appendChild(td);
    });

    if (role === "company") {
      const actionTd = document.createElement("td");
      actionTd.classList.add("px-6", "py-2", "text-center");

      const actionDiv = document.createElement("div");
      actionDiv.classList.add("flex", "justify-center", "space-x-2");

      const acceptBtn = document.createElement("button");
      const collectBtn = document.createElement("button");

      acceptBtn.classList.add("bg-green-500", "text-white", "text-xs", "sm:text-sm", "px-4", "py-2", "rounded", "hover:bg-green-600", "transition", "truncate");
      collectBtn.classList.add("bg-green-500", "text-white", "text-xs", "sm:text-sm", "px-4", "py-2", "rounded", "hover:bg-green-600", "transition", "truncate");

      acceptBtn.textContent = "Accept";
      collectBtn.textContent = "Collected";

      acceptBtn.addEventListener("click", async () => {
        await updateStatus(item._id, "Accepted");
      });

      collectBtn.addEventListener("click", async () => {
        await updateStatus(item._id, "Collected");
      });

      if (item.status === "Pending") {
        actionDiv.append(acceptBtn);
      } else if (item.status === "Accepted" || item.status === "Scheduled") {
        actionDiv.append(collectBtn);
      } else {
        collectBtn.disabled = true;
        actionDiv.append(collectBtn);
      }

      actionTd.appendChild(actionDiv);
      row.appendChild(actionTd);
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  requestList.appendChild(table);
}

async function updateStatus(id, status) {
  try {
    const response = await fetch("http://localhost:5000/updateReqStatus", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ id, status }),
    });

    const result = await response.json();

    if (response.ok) {
      await toast("Status Updated");
      window.location.reload();
      // getReqLists();
    } else {
      await toast(result.error || "Something went wrong", "error");
    }
  } catch (error) {
    console.error(error);
  }
}
addValue(data);
document.addEventListener("DOMContentLoaded", getReqLists);
