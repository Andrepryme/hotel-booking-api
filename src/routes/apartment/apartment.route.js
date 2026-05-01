const express = require("express");
const router = express.Router();

const {
  createApartment,
  getApartments,
  getApartment,
  updateOwnApartment,
  addImages,
  deleteImage,
  deleteApartment,
} = require("../../controllers/apartment/apartment.controller");

const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/rbac.middleware");
const { apartmentValidator, validate } = require("../../middlewares/validators/apartment.validator");
const upload = require("../../middlewares/upload");

// Admin only
router.post(
  "/",
  authenticate,
  authorize(['create']),
  upload.array("images", 5),
  apartmentValidator,
  validate,
  createApartment
);

router.patch(
  "/:id",
  authenticate,
  authorize(['update_own']),
  apartmentValidator,
  validate,
  updateOwnApartment
);

router.post(
  "/:id/images",
  authenticate,
  authorize(['create']),
  upload.array("images", 5),
  addImages
);

router.delete(
  "/images/:imageId",
  authenticate,
  authorize(['delete_own']),
  deleteImage
);

router.delete(
  "/:id",
  authenticate,
  authorize(['delete_own']),
  deleteApartment
);

// Public
router.get("/", getApartments);
router.get("/:id", getApartment);

module.exports = router;