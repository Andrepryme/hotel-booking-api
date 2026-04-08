const express = require("express");
const router = express.Router();

const {
  createApartment,
  getApartments,
  getApartment,
} = require("../../controllers/apartment/apartment.controller");

const { authenticate, authorize } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload");

// Admin only
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    upload.array("images", 5),
    createApartment
);

// Public
router.get("/", getApartments);
router.get("/:id", getApartment);

module.exports = router;