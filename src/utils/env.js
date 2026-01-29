export const { PORT, MONGO_DB_COMPASS } = process.env;

if (!MONGO_DB_COMPASS) {
  throw new Error("MONGO_DB_COMPASS is missing in env");
}
