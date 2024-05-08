import { Router } from "express";
import ProductManager from "../productManager.js";
import CartManager from "../cartManager.js";
import setup from "../config.js";
// import newProduct from '../views/rea'

const endPoints = Router();
const itemsManager = new ProductManager("../src/files/products.json");
const cartManager = new CartManager("../src/files/carts.json");

// ---> GET DE INICIO EN LOCAL HOST 8080
endPoints.get("/", (req, res) => {
  let user = {
    name: "Usuario",
    PORT: setup.PORT,
  };

  res.render("index", user);
});

// ---> VISTA REALTIMEPRODUCTS
endPoints.get("/realtimeproducts", async (req, res) => {
  // itemsManager.addProducts()

  const allItems = await itemsManager.getProducts();

  res.render("realTimeProducts", { allItems });
});
// ---> VISTA HOME
endPoints.get("/home", async (req, res) => {
  const allItems = await itemsManager.getProducts();

  res.render("home", { allItems });
});

// ---> GET PARA DEVOLVER PRODUCTOS CON UN LIMITE
endPoints.get("/api/products", async (req, res) => {
  const itemsLimit = req.query.limit;
  const items = await itemsManager.getProducts(itemsLimit);

  res.send({ status: "OK", playload: items });
});

// ---> GET PARA FILTRAR PRODUCTOS POR ID
endPoints.get("/api/products/:pid", async (req, res) => {
  const filterById = req.params.pid;
  const items = await itemsManager.getProductsById(+filterById);

  res.send({ status: "OK", playload: items });
});

// ---> POST PARA AGREGAR PRODUCTOS
endPoints.post("/api/products", async (req, res) => {
  const addItem = req.body;

  await itemsManager.addProducts(addItem);
  const allItems = await itemsManager.getProducts();
  // const findtCodeItem = await allItems.find(
  //   (item) => item.code == addItem.code
  // );

  // if (findtCodeItem ) {
  //   res.send({
  //     status: "error",
  //     playload: `El producto con código "${addItem.code}" ya existe`,

  //   });
  // }
  res.send({ status: "OK", playload: allItems });
});

// ---> PUT PARA ACTUALIZAR PRODUCTOS
endPoints.put("/api/products/:pid", async (req, res) => {
  const ID = req.params.pid;
  const update = req.body;

  await itemsManager.updateProduct(+ID, update);
  res.send(itemsManager.getProductsById(+ID));
});

// ---> DELETE PARA BORRAR PRODUCTOS CON EL ID SELECCIONADO
endPoints.delete("/api/products/:pid", async (req, res) => {
  const deleteItem = req.params.pid;
  await itemsManager.deleteProduct(deleteItem);

  res.send({ status: "ok", playload: itemsManager.getProducts() });
});

// ---> POST PARA CREAR NUEVO CARRITO
endPoints.post("/api/carts", (req, res) => {
  const newCart = req.body;
  cartManager.addCarts(newCart);

  res.send(cartManager.getCarts());
});
// ---> GET PARA LISTAR PRODUCTOS
endPoints.get("/api/carts/:cid", async (req, res) => {
  const cartID = req.params.cid;
  const cartItems = await cartManager.getCartsById(+cartID);

  res.send({ status: "ok", playload: cartItems });
});

// ---> POST PARA AGREGAR PRODUCTO A "products"
endPoints.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const itemID = req.params.pid;
  const cartID = req.params.cid;

  let cartFilter = await cartManager.getCartsById(+cartID);
  const findItem = cartFilter.products.find(
    (elem) => elem.id == itemID || elem.productID == itemID
  );

  if (!findItem) {
    cartFilter.products.push({
      productID: itemID,
      quantity: 1,
    });
  } else if (findItem && !findItem.quantity) {
    findItem.quantity = 1;
  } else if (findItem && findItem.quantity) {
    findItem.quantity++;
  }

  await cartManager.updateCart(+cartID, { products: cartFilter.products });

  res.send({ status: "ok", playload: cartFilter });
});
endPoints.get("/", (req, res) => {
  res.render("index", {});
});

export default endPoints;
