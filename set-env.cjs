const fs = require("fs");

let envFile;
envFile = "prod";
fs.copyFileSync(envFile, "./bin/.env");
console.log(`Set environment variables from ${envFile}`);
