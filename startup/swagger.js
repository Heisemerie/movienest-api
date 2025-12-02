const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movienest API",
      version: "1.0.0",
      description: "Movienest API documentation using Swagger",
    },
  },
  apis: ["../routes/*.js"],
};

module.exports.swaggerSpec = swaggerJsdoc(options);
module.exports.swaggerUi = swaggerUi