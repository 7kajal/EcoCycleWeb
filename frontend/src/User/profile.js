import { fetchUserProfile } from "../main.js";

if (!document.cookie || document.cookie.includes("LoggedIn=''")) {
  window.location.href = "/";
}

const data = await fetchUserProfile();
console.log(data);

document.getElementById("profile-image").src = data.imageUrl || `https://ui-avatars.com/api/?name=${data?.email.split("@")[0]}&background=random` || "https://ui-avatars.com/api/?name=unknown";
document.getElementById("profile-name").textContent = data.name;
document.getElementById("profile-email").textContent = data.email;

const container = document.getElementById("profile-details");

// User-specific points display
if (document.cookie.includes("user")) {
  const points = document.createElement("div");
  points.classList.add("text-sm", "font-semibold", "text-green-700", "p-2", "bg-green-100", "rounded-lg", "w-fit");
  points.textContent = `⭐ Points: ${data.points}`;
  container.classList.add("space-y-4");
  container.append(points);
}

// Company-specific stats display
if (document.cookie.includes("company")) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("mt-4", "grid", "grid-cols-3", "gap-4", "p-4", "bg-gray-100", "rounded-lg");

  const createStatCard = (label, value, icon) => {
    const statDiv = document.createElement("div");
    statDiv.classList.add("p-3", "rounded-lg", "bg-white", "shadow", "flex", "flex-col", "items-center");

    const statIcon = document.createElement("span");
    statIcon.innerHTML = icon;
    statIcon.classList.add("text-2xl", "text-green-600");

    const statText = document.createElement("div");
    statText.classList.add("text-sm", "font-semibold", "text-gray-800", "mt-2");
    statText.textContent = `${label}: ${value}`;

    statDiv.append(statIcon, statText);
    return statDiv;
  };

  const itemsAccepted = data.itemsAccepted.filter((item) => item.status === "Accepted").length;
  const itemsScheduled = data.itemsAccepted.filter((item) => item.status === "Scheduled").length;
  const itemsCollected = data.itemsAccepted.filter((item) => item.status === "Collected").length;

  statsContainer.append(createStatCard("Accepted", itemsAccepted, "✅"), createStatCard("Scheduled", itemsScheduled, "📅"), createStatCard("Collected", itemsCollected, "📦"));

  container.append(statsContainer);
}
