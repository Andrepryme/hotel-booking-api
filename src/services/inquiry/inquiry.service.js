const {
  createInquiry,
} = require("../../repositories/inquiry/inquiry.repository");


async function createInquiryService(data) {
  if (!data.name || !data.email || !data.message) {
    throw new AppError("All fields are required", 400);
  }

  return await createInquiry({
    id: uuidv4(),
    ...data,
  });
}

module.exports = {
    createInquiryService,
}