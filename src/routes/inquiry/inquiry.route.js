const router = require("express").Router();

const {
  createInquiry,
} = require("../../controllers/inquiry/inquiry.controller");

router.post("/", createInquiry);

module.exports = router;