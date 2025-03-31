require("dotenv").config(); // Load .env variables

console.log("🚀 Database Config Loaded:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_PORT:", process.env.DB_PORT);

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

// {
//   // development1: {
//   //   username: "rakshit",
//   //   password: 12345,
//   //   "database": "postgres",
//   //   "host": "127.0.0.1",
//   //   "dialect": "postgres"
//   // },
//   development: {
//     username: process.env.username;
//     password: process.env.password;
//     database: process.env.database;
//     host: process.env.host;
//     port: process.env.port;
//     dialect: "postgres";
//     dialectOptions: {
//       ssl: {
//         require: true;
//         rejectUnauthorized: false;
//       }
//     }
//   }
//   // "test": {
//   //   "username": "root",
//   //   "password": null,
//   //   "database": "database_test",
//   //   "host": "127.0.0.1",
//   //   "dialect": "mysql"
//   // },
//   // "production": {
//   //   "username": "root",
//   //   "password": null,
//   //   "database": "database_production",
//   //   "host": "127.0.0.1",
//   //   "dialect": "mysql"
//   // }
// }

// require("dotenv").config(); // Load .env variables

// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     // use_env_variable: process.env.DB_DATABASE,
//   },
// };
