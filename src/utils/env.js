import "dotenv/config";

export const { env_PORT, MONGO_DB_COMPASS } = process.env;
console.log(MONGO_DB_COMPASS);
if (!MONGO_DB_COMPASS) {
  throw new Error("MONGO_DB_COMPASS is missing in env");
}
