export const { PORT, MONGO_DB_COMPASS } = process.env;
console.log(MONGO_DB_COMPASS);
console.log(PORT);
if (!MONGO_DB_COMPASS) {
  throw new Error("MONGO_DB_COMPASS is missing in env");
}
