document.addEventListener("DOMContentLoaded", function () {
  const footer = document.createElement("footer");
  footer.classList.add("text-white", "bg-green-950", "py-10", "px-6", "shadow-md");

  footer.innerHTML = `
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <!-- Logo + Social Media -->
        <div>
          <h1 class="text-4xl font-semibold">EcoCycle</h1>
          <div class="flex justify-center md:justify-start space-x-4 mt-3">
            <a href="#"><img src="/images/insta.svg" class="w-6 h-6 hover:scale-110 transition"></a>
            <a href="#"><img src="/images/fb.svg" class="w-6 h-6 hover:scale-110 transition"></a>
            <a href="#"><img src="/images/x.svg" class="w-6 h-6 hover:scale-110 transition"></a>
          </div>
        </div>
  
        <!-- Quick Links -->
        <div class="space-y-2">
          <h2 class="text-2xl font-medium">Quick Links</h2>
          <div class="flex flex-col space-y-1 text-green-300 text-sm">
            <a href="/" class="hover:text-white text-base transition">Home</a>
            <a href="/src/User/leaderBoard.html" class="hover:text-white text-base transition">Leaderboard</a>
            <a href="/src/User/about.html" class="hover:text-white text-base  transition">About</a>
            <a href="/src/User/report.html" class="hover:text-white text-base transition">Services</a>
            <a href="/src/User/profile.html" class="hover:text-white text-base transition">Profile</a>
          </div>
        </div>
  
        <!-- Contact Info -->
        <div class="space-y-2">
          <h2 class="text-2xl font-medium">Contact Us</h2>
          <p class="text-green-200 text-base">📞 +91 7989807090</p>
          <p class="text-green-200 text-base flex items-center">
            <i class="fa-solid fa-envelope text-green-200 text-sm"></i>
            <span class="ml-2">ecocycle@gmail.com</span>
          </p>
        </div>
      </div>
  
      <!-- Copyright -->
      <div class="text-center text-[14px] text-green-400 mt-6">
        © 2025 EcoCycle. All Rights Reserved.
      </div>
    `;

  document.body.append(footer);
});
