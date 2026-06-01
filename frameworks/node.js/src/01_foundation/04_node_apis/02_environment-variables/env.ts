try {
  process.loadEnvFile("./.env"); // Added in "node v20 - v21" -> Used to load the .env from a particular file.

  // Let's print all .envs, every "environment variable" can be accessed through process.env can gave "environment variable" as object.
  // 👉 It gave all environment variables available into the system and using "dotenv", "loadEnvFile" it combine these with system environment variables.
  console.log("All environment variables are: ", process.env);

  // Let's access some particular one.
  console.log("PORT NO is: ", process.env["PORT"]);

  // 🟡 Like we are loading custom "environment variables" using "loadEnvFile", there are few CLI options also.
  // "--env-file=file" -> We can also add multiple files using it.
} catch {
  console.error("No .env file exists");
}
