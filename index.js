const cron = require("node-cron");
const { MongoClient } = require("mongodb");
const { Sequelize, DataTypes } = require("sequelize");

// Conexión a MongoDB
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");
//const mongoClient = new MongoClient("mongodb://localhost:27017");

// Conexión a la base de datos SQL (ejemplo con SQLite)
const sequelize = new Sequelize({
  dialect: "mssql", // Indica que estás utilizando SQL Server
  database: "app_shopper",
  username: "root",
  password: "1234",
  host: "localhost", // Por ejemplo, localhost si está en tu máquina local
  port: "1433", // El puerto de tu base de datos, por ejemplo 1433 para SQL Server
});

// Definición del modelo para la tabla en la base de datos SQL
const Data = sequelize.define(
  "pdv_historial",
  {
    // Define aquí los campos de la tabla SQL
    // Ejemplo:
    // fieldName: DataTypes.STRING
    host: DataTypes.STRING,
    userAgent: DataTypes.STRING,
    platform: DataTypes.STRING,
    program: DataTypes.STRING,
    ip: DataTypes.STRING,
    method: DataTypes.STRING,
    origin: DataTypes.STRING,
    url: DataTypes.STRING,
    personaid: DataTypes.NUMBER,
    persona: DataTypes.STRING,
    tienda: DataTypes.STRING,
    mobileid: DataTypes.STRING,
    numerodocumento: DataTypes.STRING,
    error: DataTypes.BOOLEAN,
    errorMsg: DataTypes.STRING,
    esVenta: DataTypes.BOOLEAN,
    comprobante: DataTypes.STRING,
    codigos: DataTypes.STRING,
  },
  {
    tableName: "pdv_historial",
    timestamps: false,
  }
);

// Función para migrar datos de MongoDB a SQL
async function migrateData() {
  console.log("Step 1");
  try {
    // Conexión a MongoDB
    await mongoClient.connect();
    const db = mongoClient.db("test_shopper");
    const collection = db.collection("pdv_historial");

    // Consulta los datos en MongoDB
    const mongoData = await collection.find({}).toArray();
    // console.log("🚀 ~ migrateData ~ mongoData:", mongoData);

    // Transformar los datos de MongoDB según sea necesario antes de migrarlos a SQL
    // Transformar los datos de MongoDB según sea necesario antes de migrarlos a SQL
    const transformedData = mongoData.map((item) => {
      // console.log("🚀 ~ transformedData ~ item:", item.other);

      // Transforma cada objeto 'item' según la estructura de tu tabla SQL
      // Ejemplo:
      // fieldName: item.fieldName
      // Aquí puedes realizar las transformaciones necesarias
      return {
        // Transforma cada objeto 'item' según la estructura de tu tabla SQL
        // Ejemplo:
        // fieldName: item.fieldName
        // Aquí puedes realizar las transformaciones necesarias
        host: item.host,
        userAgent: item.userAgent,
        platform: item.platform,
        program: item.program,
        ip: item.ip,
        method: item.method,
        origin: item.origin,
        url: item.url,
        personaid: item.personaid,
        persona: item.persona,
        tienda: item.tienda,
        mobileid: item.mobileid,
        numerodocumento: item.numerodocumento,
        error: item.error,
        errorMsg: item.errorMsg,
        esVenta: item.esVenta,
        comprobante: item.comprobante,
        codigos: item.codigos,
      };
    });

    // Migrar los datos a SQL utilizando el ORM
    await Data.bulkCreate(transformedData);

    console.log("Datos migrados exitosamente de MongoDB a SQL.");
  } catch (error) {
    console.error("Error al migrar datos:", error);
  } finally {
    // Cierra las conexiones
    await mongoClient.close();
    await sequelize.close();
  }
}

// Programar la ejecución del cron al final del día
migrateData();
// cron.schedule('59 23 * * *', () => {
//   console.log('Ejecutando migración de datos al final del día...');
//   migrateData();
// });
