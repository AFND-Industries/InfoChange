const fs = require("fs");
const { execSync } = require("child_process");

let envFile;
envFile = ".env.main";
fs.copyFileSync(envFile, ".env");
console.log(`Set environment variables from ${envFile}`);
