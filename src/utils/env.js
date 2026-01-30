export const { PORT, MONGO_DB_COMPASS, JWT_SECRET } = process.env;

if (!MONGO_DB_COMPASS) {
  throw new Error("MONGO_DB_COMPASS is missing in env");
}
