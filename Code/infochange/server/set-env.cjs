const fs = require("fs");

let envFile;
envFile = ".env.main";
fs.copyFileSync(envFile, ".env");
console.log(`Set environment variables from ${envFile}`);
