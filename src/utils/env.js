export const {
  PORT,
  MONGO_DB_COMPASS,
  JWT_SECRET,
  MONGO_DB_ATLAS,
  TEST_KEY_SECRET,
  TEST_API_KEY,
} = process.env;

if (!MONGO_DB_COMPASS || !MONGO_DB_ATLAS) {
  throw new Error("MONGO_DB_COMPASS is missing in env");
}
