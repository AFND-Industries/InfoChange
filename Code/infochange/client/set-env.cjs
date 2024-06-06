const fs = require("fs");
let envFile;
envFile = "prod";
fs.copyFileSync(envFile, ".env");
console.log(`Set environment variables from ${envFile}`);
