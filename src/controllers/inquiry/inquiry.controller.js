const {
  createInquiryService,
  getAllInquiriesService
} = require("../../services/inquiry/inquiry.service");

async function createInquiry(req, res, next) {
  try {
    const data = await createInquiryService(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function getAllInquiries(req, res, next) {
  try {
    const data = await getAllInquiriesService(req.user.userId, req.query.limit, req.query.offset);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createInquiry,
  getAllInquiries
};