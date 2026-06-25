import { createServer } from "node:http";

import { createApp } from "./app.js";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const host = "0.0.0.0";

const server = createServer(createApp());

server.listen(port, host, () => {
  console.log(`Tictactrip justify API is listening on http://${host}:${port}.`);
});
