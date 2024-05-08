import fs from "fs";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }
  async addProducts(item) {
    let readItems = await fs.promises.readFile(this.path, this.products);
    let itemsList = JSON.parse(readItems);
    let itemListPath = this.path;
    let generateID = itemsList.length + 1;
    let findCode = itemsList.find((elem) => elem.code === item.code);
    let errorMesagge = `El producto con código "${item.code}" ya existe`;

    !findCode || item.code === undefined
      ? itemsList.push({ id: generateID, ...item })
      : console.error(errorMesagge);

    let listJSON = JSON.stringify(itemsList);

    await fs.promises.writeFile(itemListPath, listJSON);
  }
  async getProducts(limit) {
    let readItems = await fs.promises.readFile(this.path, this.products);
    let itemsParse = JSON.parse(readItems);

    return limit === 0 || limit > itemsParse.length
      ? itemsParse
      : itemsParse.slice(0, limit);
  }
  async getProductsById(itemID) {
    let readItems = await fs.promises.readFile(this.path, "utf-8");
    let list = JSON.parse(readItems);
    let getItem = await list.find((item) => item.id === itemID);
    return getItem
      ? getItem
      : { error: `El producto con ID "${itemID}" no existe` };
  }
  async updateProduct(productID, properties) {
    let readItems = await fs.promises.readFile(this.path, "utf-8");
    let listParse = JSON.parse(readItems);

    listParse.forEach((elem) => {
      if (productID === elem.id) {
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
  async deleteProduct(elemId) {
    let itemsList = this.products;

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

export default ProductManager;
