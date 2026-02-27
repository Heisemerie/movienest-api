import { availableParallelism } from "node:os";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import cluster from "node:cluster";

const cpuCount = availableParallelism();
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(`CPU Count: ${cpuCount}; Primary pid: ${process.pid}`);

cluster.setupPrimary({
  exec: `${__dirname}/dist/index.js`,
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}

cluster.on("exit", (worker, code, signal) => {
  console.log(`Worker ${worker.process.pid} has terminated`);
  console.log(`Initiating replacement...`);
  cluster.fork();
});

// to test run:
// npx autocannon -d 10 renderStatusCodes http://localhost:3000/shops
