import express from "express";
import setup from "./config.js";
import userRoutes from "./routes/user.routes.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", setup.DIRNAME + "/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRoutes);
app.use("/static", express.static(`${setup.DIRNAME}/public`));

const httpServer = app.listen(
  setup.PORT,
  console.log(`Servidor funcionando en puerto ${setup.PORT}`)
);
const socketServer = new Server(httpServer);

socketServer.on("conection", socket => {
  console.log("loco, socket funcionando, che");
});
