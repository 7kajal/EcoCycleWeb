const prices = {
  plastic: 10, // means 10rs for 1kg
  electronic: 15,
  paper: 12,
  glass: 18,
  metal: 28,
};

export function calculatePrice(name, quantity) {
  console.log(name, quantity);
  return prices[name.toLowerCase()] * quantity;
}
