import process from "node:process";

// 👉 Used to catch the "Node.process" level events like, "catching errors", "when user process CTRL + C".
// Below their are important "events" are their:
// 1. "uncaughtException"   --> Fires when unhandled throw happen, Used to exit the process ("process.exit(1)"), or logging the issue
// 2. "unhandledRejection"  --> Fires when unhandled promise reject, Used same as below one.
// 3. "SIGTERM"             --> Fire when deployment platform stopping app, Used to graceful shutdown
// 4. "SIGINT"              --> Fire when "Ctrl + C" happen in the terminal, Used to graceful shutdown in "dev" environments
// 5. "exit"                --> Fires Right before process ends, Sync cleanup only

// Happens when deployment platform stopping the app
process.on("SIGTERM", (signal) => {
  console.log(signal);
});

// Happen right after pressing the "CTRL + C" in the terminal
process.on("SIGINT", (signal) => {
  console.log("Process is closing");
  console.log("Stopping the database");
});

// Happens right after process got exit.
process.on("exit", (code) => {
  console.log("Process is existing");
  console.log("Stopping the database");
});
