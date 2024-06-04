const applog = (msg, tag = "SERVER") => {
    const logMessage = `[${new Date().toLocaleString()}] [${tag}] ${msg}`;
    if (tag === "ERROR") console.error(logMessage);
    else console.log(logMessage);
    /*
          // commented to future
          fs.appendFile(logFilePath, logMessage + "\n", (err) => {
              if (err) {
                  console.error("Error al escribir en el archivo de registro:", err);
              }
          });
          */
};

const hash = (string) => createHash("sha256").update(string).digest("hex");

const error = (type, cause) => {
    return {
        status: "-1",
        error: type,
        cause: cause,
    };
};

module.exports = { applog, hash, error };
