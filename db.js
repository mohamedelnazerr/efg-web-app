const sql = require("mssql");
require("dotenv").config();

const config = {
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    port: Number(process.env.AZURE_SQL_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);

        console.log("Connected to Azure SQL successfully!");

        return pool;
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);

        throw error;
    }
}

module.exports = {
    sql,
    connectToDatabase
};