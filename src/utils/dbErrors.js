const DB_ERROR_CODES = {
  UNIQUE_VIOLATION: "23505",
  CHECK_VIOLATION: "23514",
  FOREIGN_KEY_VIOLATION: "23503",
  NOT_NULL_VIOLATION: "23502",
};

function dbCodeTranslate(code) {
    if (code === DB_ERROR_CODES.CHECK_VIOLATION) {
      throw new AppError("Invalid value provided (e.g., price >= 0)", 400);
    }

    if (code === DB_ERROR_CODES.NOT_NULL_VIOLATION) {
      throw new AppError("Missing required fields", 400);
    }

    if (code === DB_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
      throw new AppError("Invalid reference (user or apartment not found)", 400);
    }

    if (code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
      throw new AppError("Resource already exists", 400);
    }
}

module.exports = { dbCodeTranslate };