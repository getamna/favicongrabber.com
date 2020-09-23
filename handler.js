/**
 * Favicon Grabber
 */
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

const routers = {
  api: require("./server/api/router"),
};

const server = express();

server.use(cors());
server.use("/api", routers.api);

module.exports.main = serverless(server);
