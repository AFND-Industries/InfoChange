const fs = require("fs");
let envFile;
envFile = ".main";
fs.copyFileSync(envFile, ".env");
console.log(`Set environment variables from ${envFile}`);
