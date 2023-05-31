const mongoose = require('mongoose');
const PropertiesReader = require('properties-reader');
const properties_DB = PropertiesReader('config/dataBase.properties');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 15,
  bufferMaxEntries: 0,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 30000
};

const crearConexion = (dbName) => {
const dbUrl = `mongodb+srv://${properties_DB.get("USER_DB")}:${properties_DB.get("PASSWORD_DB")}@${properties_DB.get("SERVER_DB")}.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  return mongoose.createConnection(dbUrl, options);
}

export default {
  obtenerConexion:(dbName) =>{
    let [ conexion ] = mongoose.connections.filter(conn => conn.name === dbName);
    if(!conexion) {
      conexion = crearConexion(dbName);
    }
    return conexion;  
  }
};
