import express from "express";

import morgan from "morgan";

import cors from "cors";

import path from "path";

import mongoose from "mongoose";

import router from "./routes";

const PropertiesReader = require('properties-reader');
const properties_DB = PropertiesReader('config/dataBase.properties');
const properties_APP = PropertiesReader('config/application.properties');


mongoose.Promise = global.Promise;

const dbUrl = `mongodb+srv://${properties_DB.get("USER_DB")}:${properties_DB.get("PASSWORD_DB")}@${properties_DB.get("SERVER_DB")}.mongodb.net/${properties_DB.get("NAME_DB")}?retryWrites=true&w=majority`;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true,
    poolSize: 15,
    bufferMaxEntries: 0,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 30000,
  })
  .then((mongoose) =>
    console.log("Conexion satisfactoria con la base de datos.")
  )
  .catch((err) => console.log(err));

const app = express(); 
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  app.use("/"+properties_APP.get("NAME_API"), router);
  app.set("port", process.env.PORT || 777);
  app.listen(app.get("port"), () => {
    console.log(
      "Servidor de NojdeJS levantado en el puerto: " + app.get("port")
    );
  });
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
} else {
  app.use("/"+properties_APP.get("NAME_API"), router);
  app.set("port", process.env.PORT || 20000);
  app.listen(app.get("port"), () => {
    console.log(
      "Servidor de NojdeJS levantado en el puerto: " + app.get('port')
    );
  });
}
