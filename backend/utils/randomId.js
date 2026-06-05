const shiftedMapping = {
  a: "f",
  b: "g",
  c: "h",
  d: "i",
  e: "j",
  f: "k",
  g: "l",
  h: "m",
  i: "n",
  j: "o",
  k: "p",
  l: "q",
  m: "r",
  n: "s",
  o: "t",
  p: "u",
  q: "v",
  r: "w",
  s: "x",
  t: "y",
  u: "z",
  v: "a",
  w: "b",
  x: "c",
  y: "d",
  z: "e",
  0: "5",
  1: "6",
  2: "7",
  3: "8",
  4: "9",
  5: "0",
  6: "1",
  7: "2",
  8: "3",
  9: "4",
};

export function generateId(anyString) {
  const updatedString = Math.random().toFixed(8).toString() + anyString;
  console.log(updatedString)

  const id = updatedString.split("").map((element) => {
    if (shiftedMapping[element.toLowerCase()])
      return shiftedMapping[element.toLowerCase()];
  });
  console.log(id)
  return id.join("");
}


const generatedToken = generateId("MyPasswordIsSuperSecret")
console.log(generatedToken)