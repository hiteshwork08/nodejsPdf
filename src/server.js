const http = require("http");
const app = require("./index");
const { hostname } = require("os");
const port = process.env.port || 5000;
const server = http.createServer(app)

server.listen(port,hostname:()=>{
    console.log(`started on port ${port}`);
})