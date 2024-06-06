const fs = require("fs");
const { execSync } = require("child_process");

// Obtener la rama actual
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

let envFile;
if (branch === "prod-frontend") {
  envFile = ".env.main";
} else if (branch === "develop") {
  envFile = ".env.develop";
} else {
  console.error(`No env file for branch: ${branch}`);
  process.exit(1);
}

fs.copyFileSync(envFile, ".env");
console.log(`Set environment variables from ${envFile}`);
