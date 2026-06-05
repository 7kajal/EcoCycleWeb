async function fetchLeaderboard() {
  const response = await fetch("http://localhost:5000/leaderBoard");
  const data = await response.json();
  data.sort((a, b) => b.points - a.points);
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";
  data.forEach((user, index) => {
    const row = `<tr class="text-lg font-medium ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition">
        <td class="px-6 py-4 font-bold text-gray-700 text-center">#${index + 1}</td>
        <td class="px-6 py-4 font-semibold text-gray-700 text-center">${user.name}</td>
        <td class="px-6 py-4 font-semibold text-green-700 text-center">${user.points}</td>
      </tr>`;
    leaderboard.innerHTML += row;
  });
}
document.addEventListener("DOMContentLoaded", fetchLeaderboard);
