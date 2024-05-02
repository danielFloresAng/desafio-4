import fs from "fs";

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
  }
  async addCarts(item) {
    let itemsList = this.carts;
    let itemListPath = this.path;
    let generateID = itemsList.length + 1;
    // let findCode = itemsList.find((elem) => elem.code === item.code);

    // !findCode || item.code === undefined
    //   ? itemsList.push({ id: generateID, ...item })
    //   : console.error(`El carrito con código "${item.code}" ya existe`);

    let listJSON = JSON.stringify(itemsList);

    await fs.promises.writeFile(itemListPath, listJSON);
  }
  async getCarts(limit) {
    let readItems = await fs.promises.readFile(this.path, this.carts);
    let itemsParse = JSON.parse(readItems);

    return limit === 0 || limit > itemsParse.length
      ? itemsParse
      : itemsParse.slice(0, limit);
  }
  async getCartsById(itemID) {
    let readItems = await fs.promises.readFile(this.path, "utf-8");
    let list = JSON.parse(readItems);
    let getItem = await list.find((item) => item.id === itemID);
    return getItem
      ? getItem
      : { error: `El carto con ID "${itemID}" no existe` };
  }
  async updateCart(cartID, properties) {
    let readItems = await fs.promises.readFile(this.path, "utf-8");
    let listParse = JSON.parse(readItems);

    listParse.forEach((elem) => {
      if (cartID === elem.id) {
        for (let prop in properties) {
          if (prop !== "id") {
            elem[prop] = properties[prop];
          }
        }
      }
    });
    let listJSON = JSON.stringify(listParse);
    await fs.promises.writeFile(this.path, listJSON);
  }
  async deleteCart(elemId) {
    let itemsList = this.carts;

    let readItems = await fs.promises.readFile(this.path, "utf-8");
    let list = JSON.parse(readItems);
    let filterItem = list.findIndex((elem) => elem.id === elemId);

    if (filterItem !== -1) {
      itemsList.splice(filterItem, 1);
    }
    let listJSON = JSON.stringify(itemsList);

    await fs.promises.writeFile(this.path, listJSON);
  }
}

export default CartManager;
