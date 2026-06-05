import { fetchUserProfile } from "../main";
import { handleLogout } from "./logout.js";

document.addEventListener("DOMContentLoaded", async () => {
  const role = document.cookie.includes("admin");

  if (role) window.location.href = "/src/admin/dashboard.html";
  const navbar = document.createElement("nav");
  navbar.id = "navbar";
  navbar.classList.add("w-full", "bg-green-900", "sm:px-6", "sm:py-4", "shadow-md", "sticky", "z-10", "top-0");

  if (document.cookie.includes("company") || document.cookie.includes("admin")) {
    navbar.innerHTML = `
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Logo -->
      <div class="text-3xl font-semibold text-green-50 pl-3 py-2 md:py-0 cursor-pointer"><a href="/">EcoCycle</a></div>

      <!-- Hamburger (Only on Mobile) -->
      <button id="menu-btn" class="md:hidden text-white pr-3 text-3xl py-4 md:py-0 focus:outline-none">☰</button>

      <!-- Desktop Navigation Links -->
      <div id="nav-links" class="hidden md:flex space-x-8 text-xl text-green-50">
        <a href="/" class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">Home</a>
        <a href="/src/User/leaderBoard.html" class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">Leaderboard</a>
        <a href="/#contactus" class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">Contact Us</a>
        <a href="/src/User/about.html" class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">About Us</a>
        <div class="mt-1" id="profile-container"></div>
      </div>
    </div>

    <!-- Mobile Menu (Full Width + Hover Effect) -->
    <div id="mobile-menu" class="hidden md:hidden  flex-col mt-4 bg-green-800 text-white w-full">
      <a href="/" class="block w-full px-4 py-3 hover:bg-green-700 transition">Home</a>
      <a href="/src/User/leaderBoard.html" class="block w-full px-4 py-3 hover:bg-green-700 transition">Leaderboard</a>
      <a href="/#contactus" class="block w-full px-4 py-3 hover:bg-green-700 transition">Contact Us</a>
      <a href="/src/User/about.html" class="block w-full px-4 py-3 hover:bg-green-700 transition">About Us</a>
      <div  id="mobile-profile-section"></div>
    </div>
  `;
  } else {
    navbar.innerHTML = `
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Logo -->
      <div class="text-3xl font-semibold text-green-50 pl-3 py-2 md:py-0 cursor-pointer"><a href="/">EcoCycle</a></div>

      <!-- Hamburger (Only on Mobile) -->
      <button id="menu-btn" class="md:hidden text-white pr-3 text-3xl py-4 md:py-0 focus:outline-none">☰</button>

      <!-- Desktop Navigation Links -->
      <div id="nav-links" class="hidden md:flex space-x-8 text-xl text-green-50">
        <a href="/" class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">Home</a>
        <a href="/src/User/report.html" class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">Service</a>
        <a href="/src/User/leaderBoard.html" class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">Leaderboard</a>
        <a href="/#contactus" class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">Contact Us</a>
        <a href="/src/User/about.html " class="hover:bg-gray-200 px-2 py-1 rounded-md hover:text-black transition">About Us</a>

        <div class="mt-1" id="profile-container"></div>
      </div>
    </div>

    <!-- Mobile Menu (Full Width + Hover Effect) -->
    <div id="mobile-menu" class="hidden md:hidden  flex-col mt-4 bg-green-800 text-white w-full">
      <a href="/" class="block w-full px-4 py-3 hover:bg-green-700 transition">Home</a>
      <a href="/src/User/report.html" class="block w-full px-4 py-3 hover:bg-green-700 transition">Service</a>
      <a href="/src/User/leaderBoard.html" class="block w-full px-4 py-3 hover:bg-green-700 transition">Leaderboard</a>
      <a href="/#contactus" class="block w-full px-4 py-3 hover:bg-green-700 transition">Contact Us</a>
      <a href="/src/User/about.html" class="block w-full px-4 py-3 hover:bg-green-700 transition">About Us</a>

      <div  id="mobile-profile-section"></div>
    </div>
  `;
  }

  document.body.prepend(navbar);

  // Hamburger Menu Toggle
  const menuBtn = document.querySelector("#menu-btn");
  const mobileMenu = document.querySelector("#mobile-menu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Profile Section
  const profileContainer = document.querySelector("#profile-container");
  const mobileProfileSection = document.querySelector("#mobile-profile-section");

  if (document.cookie.includes("LoggedIn=True")) {
    const userData = await fetchUserProfile();

    // Desktop: Profile Dropdown
    profileContainer.innerHTML = `
      <div class="relative">
        <button id="profileBtn" class="flex items-center">
          <img src="${userData?.imageUrl || `https://ui-avatars.com/api/?name=${userData?.email.split("@")[0]}` || "https://ui-avatars.com/api/?name=unknown"}" 
               alt="Profile" class="w-8 h-8 rounded-full border-2 border-green-300 hover:border-white transition">
        </button>
        <div id="dropdownMenu" class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg hidden">
          <a href="/src/User/profile.html" class="block px-4 py-2 text-black rounded-md hover:bg-green-500 hover:text-white">Profile</a>
          <a href="/src/User/reqList.html" class="block px-4 py-2 text-black rounded-md hover:bg-green-500 hover:text-white">Requests</a>
          <button id="logoutBtn" class="block w-full text-left px-4 py-2 text-black rounded-md hover:bg-green-500 hover:text-white">Logout</button>
        </div>
      </div>
    `;

    // Mobile: Profile Links (Full Width + Hover Effect)
    mobileProfileSection.innerHTML = `
      <a href="/src/User/profile.html" class=" w-full px-4 py-3 rounded-md hover:bg-green-700 transition">Profile</a>
      <a href="/src/User/reqList.html" class=" w-full px-4 py-3 rounded-md hover:bg-green-700 transition">Requests</a>
      <button id="logoutBtnMobile" class=" w-full text-left px-4 py-3 rounded-md hover:bg-green-700 transition">Logout</button>
    `;

    // Profile Dropdown Functionality
    const profileBtn = document.querySelector("#profileBtn");
    const dropdownMenu = document.querySelector("#dropdownMenu");
    const logoutBtn = document.querySelector("#logoutBtn");
    const logoutBtnMobile = document.querySelector("#logoutBtnMobile");

    profileBtn.addEventListener("click", () => {
      dropdownMenu.classList.toggle("hidden");
    });

    logoutBtn.addEventListener("click", async () => {
      await handleLogout();
    });

    logoutBtnMobile.addEventListener("click", async () => {
      await handleLogout();
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!profileBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  } else {
    profileContainer.innerHTML = `<a href="/src/User/login.html" class="bg-white text-black px-4 py-2 rounded-md hover:bg-black hover:text-white">Login</a>`;
    mobileProfileSection.innerHTML = `<a href="/src/User/login.html" class="block w-full px-4 py-3 hover:bg-green-700 transition">Login</a>`;
  }

  const navLinks = document.querySelectorAll("#nav-links a");

  const page = window.location.href;

  navLinks.forEach((e) => {
    if (page.includes("report.html") && e.textContent === "Service") {
      e.classList.add("bg-white", "text-black", "px-4");
    } else if (page.includes("about.html") && e.textContent === "About Us") {
      e.classList.add("bg-white", "text-black", "px-4");
    } else if (page.includes("leaderBoard.html") && e.textContent === "Leaderboard") {
      e.classList.add("bg-white", "text-black", "px-4");
    } else if (page.includes("#contactus") && e.textContent === "Contact Us") {
      e.classList.add("bg-white", "text-black", "px-4");
    } else if (e.textContent === "Home" && !page.includes("html") && !page.includes("#contactus")) {
      e.classList.add("bg-white", "text-black", "px-4");
    }
  });
});
