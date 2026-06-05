// console.log(navbar);

export async function fetchUserProfile() {
  const res = await fetch("http://localhost:5000/getcurrentuser", {
    credentials: "include",
  });
  const data = await res.json();

  return data;
}
