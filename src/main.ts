import { createServer } from "node:http";

import { createApp } from "./app.js";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const server = createServer(createApp());

server.listen(port, () => {
  console.log(`Tictactrip justify API is listening on port ${port}.`);
});
