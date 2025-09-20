import https from "https";
import fs from "fs";
import app from "./app.mjs";

const PORT = 3000;

const server = https.createServer({
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
},app)

server.listen(PORT);