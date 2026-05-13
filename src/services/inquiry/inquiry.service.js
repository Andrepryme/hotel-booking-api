const {
  createInquiry,
  getAllInquiries
} = require("../../repositories/inquiry/inquiry.repository");

const { v4:uuidv4 } = require("uuid");

async function createInquiryService(data) {
  return await createInquiry({
    id: uuidv4(),
    ...data,
  });
}

async function getAllInquiriesService(userId, limit = 10, offset = 0) {
  return await getAllInquiries({
    userId,
    limit,
    offset
  });
}

module.exports = {
    createInquiryService,
    getAllInquiriesService
}