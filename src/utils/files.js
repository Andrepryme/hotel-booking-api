const fs = require("fs/promises");
const path = require("path");

async function deleteFile(filePath) {
  try {
    const fullPath = path.join(__dirname, "../../", filePath);
    await fs.unlink(fullPath);
  } catch (err) {
    console.error("File delete error:", err.message);
  }
}

module.exports = { deleteFile };