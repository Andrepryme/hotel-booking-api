const {
  createInquiryService,
} = require("../../services/inquiry/inquiry.service");

async function createInquiry(req, res, next) {
  try {
    const data = await createInquiryService(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createInquiry,
};