const fs = require("fs");
const { trycatch } = require("./trycatch");
const { ErrorHandler } = require("./errrorHandling");

function logActivity(userId, activity, callback) {
  try {
    if (!userId) {
      return callback(false, "Logging Failed, please provide valid details.");
    }

    const logEntry = `${new Date().toISOString()} - User ${userId}: ${activity}\n`;

    const filePath = "./logs/user-logs.txt";

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(filePath, "", (err) => {
          if (err) {
            return callback(false, "Error creating log file.");
          }

          appendLog(filePath, logEntry, (success) => {
            if (success) {
              return callback(true, "Log entry added successfully.");
            } else {
              return callback(false, "Error appending log entry.");
            }
          });
        });
      } else {
        appendLog(filePath, logEntry, (success) => {
          if (success) {
            return callback(true, "Log entry added successfully.");
          } else {
            return callback(false, "Error appending log entry.");
          }
        });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    return callback(false, "Internal server error.");
  }
}

function appendLog(filePath, logEntry, callback) {
  try {
    fs.appendFile(filePath, logEntry, (err) => {
      if (err) {
        return callback(false);
      }

      return callback(true);
    });
  } catch (err) {
    return callback(false);
  }
}

function getUserLogs(userId, callback) {
  fs.readFile("./logs/user-logs.txt", "utf8", (err, data) => {
    if (err) {
      return callback([]);
    }

    const userLogs = data
      .split("\n")
      .filter((log) => log.includes(`User ${userId}`));

    callback(userLogs);
  });
}

const deleteLog = trycatch(async (req, res, next) => {
  const filePath = "./logs/user-logs.txt";

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        return next(new ErrorHandler(500, `${err}`));
      }
      return res.redirect("/admin/highlands/cuisine/profile");
    });
  }
});

module.exports = { logActivity, getUserLogs, deleteLog };
