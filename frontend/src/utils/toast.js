const cross = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
const right = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>`;

export async function toast(message, type = "success") {
  return new Promise((resolve) => {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");

    toast.className = `capitalize flex items-center p-3 rounded-lg shadow-md text-white mb-2 transition-opacity duration-300 ease-in-out ${type === "error" ? "bg-red-500" : "bg-green-500"}`;
    toast.innerHTML = `<span class='mr-2'>${type === "error" ? cross : right}</span> ${message}`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => {
        toast.remove();
        resolve();
      }, 500);
    }, 2000);
  });
}
