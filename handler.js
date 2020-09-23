/**
 * Favicon Grabber
 */
const serverless = require("serverless-http");
const express = require("express");

const routers = {
  api: require("./server/api/router"),
};

const server = express();

server.use("/api", routers.api);

module.exports.main = serverless(server);
