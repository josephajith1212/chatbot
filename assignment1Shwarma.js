const Order = require("./assignment1Order");

// const handleInvalid = () => {
//   aReturn.push("Oops.. invalid selection! Try again.");
//   this.handleInput("");
// };

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  ITEM: Symbol("food item choice"),
  SIZE: Symbol("size"),
  SAUCE: Symbol("sauces"),
  DRINKS: Symbol("drinks"),
  FRIES: Symbol("fries"),
  CONFIRM: Symbol("Order confirm"),
});

const items = {
  Shawarma: { S: 10, M: 13, L: 15 },
  Pizza: { S: 12, M: 15, L: 20 },
  Sandwich: { S: 7, M: 10, L: 12 },
  AddOns: { drink: 2, fries: 2 },
};
var retry;
var billAmount = 0;

module.exports = class ShwarmaOrder extends Order {
  constructor() {
    super();
    this.stateCur = OrderState.WELCOMING;
    this.sItem = "";
    this.sSize = "";
    this.sSauce = "";
    this.sDrinks = "";
    this.sFries = "";
    this.sConfirm = "";
  }
  handleInput(sInput) {
    var aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        console.log("arrived at welcome");
        this.stateCur = OrderState.ITEM;
        sInput = "";
        !retry && aReturn.push("Welcome to AJ's Food Court.");
        !retry &&
          aReturn.push(
            "What would you like to have today? (type 1/2/3)\n1. Shawarma\n2. Pizza\n3. Sandwich"
          );
        retry = false;
        break;
      case OrderState.ITEM:
        console.log("arrived at item");
        this.stateCur = OrderState.SIZE;
        this.sItem = Object.keys(items)[sInput - 1];
        aReturn.push("What size would you like?\n(type S/M/L)");
        break;
      case OrderState.SIZE:
        this.stateCur = OrderState.SAUCE;
        this.sSize = sInput.toUpperCase();
        billAmount = 0;
        billAmount += items[this.sItem][this.sSize];
        aReturn.push("What sauce would you like? \n(eg: hot, taco, barbecue)");
        break;
      case OrderState.SAUCE:
        this.stateCur = OrderState.FRIES;
        this.sSauce = sInput;
        aReturn.push("Would you like fries with that? (Y/N)");
        break;
      case OrderState.FRIES:
        if (sInput.toLowerCase() != "n") {
          this.sFries = true;
          billAmount += items["AddOns"]["fries"];
        } else this.sFries = false;
        this.stateCur = OrderState.DRINKS;
        aReturn.push("Would you like a drink? (Y/N)");
        break;
      case OrderState.DRINKS:
        if (sInput.toLowerCase() != "n") {
          this.sDrinks = true;
          billAmount += items["AddOns"]["drink"];
        } else this.sDrinks = false;
        console.log(billAmount);
        this.stateCur = OrderState.CONFIRM;
        let printBill = `Please confirm your order (Y/N)-\n${this.sItem} (${
          this.sSize
        }) $${items[this.sItem][this.sSize]}\nSauce: ${this.sSauce}`;
        printBill += this.sFries ? `\nFries: $${items["AddOns"]["fries"]}` : "";
        printBill += this.sDrinks
          ? `\nDrink: $${items["AddOns"]["drink"]}`
          : "";
        // +(this.sDrinks)? `\nDrinks: ${this.sDrinks} $${items["AddOns"]["drink"]}`:''
        printBill += `\nEstimated Bill amount: $${billAmount}`;
        aReturn.push(printBill);
        break;
      case OrderState.CONFIRM:
        this.sConfirm = sInput;
        if (this.sConfirm.toLowerCase() == "n") {
          console.log("nodanger");
          this.stateCur = OrderState.WELCOMING;
          // this.handleInput(sInput)
          // switch(OrderState.WELCOMING)
          // this.isDone("error");
          aReturn.push(`Please try again-\n1. Shawarma\n2. Pizza\n3. Sandwich`);
          console.log(aReturn);
          retry = true;
          this.handleInput("");
        } else {
          console.log("danger");
          this.isDone(true);
          let d = new Date();
          d.setMinutes(d.getMinutes() + 20);
          aReturn.push(
            `Thank-you for your order.\nPlease pick it up at ${d.toTimeString()}`
          );
          break;
        }
    }
    return aReturn;
  }
  
};
