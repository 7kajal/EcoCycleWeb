import { toast } from "../utils/toast.js";

export async function handleLogout() {
  const res = await fetch("http://localhost:5000/logout", { credentials: "include" });

  if (res.ok) {
    await toast("Logout Successfully.");
    window.location.reload();
  }
}
