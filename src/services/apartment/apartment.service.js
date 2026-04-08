const { v4: uuidv4 } = require("uuid");
const AppError = require("../../utils/appError");

const {
  createApartment,
  insertImages,
  getApartments,
  getApartmentById,
} = require("../../repositories/apartment/apartment.repository");

async function createApartmentService(data, files, userId) {

  const apartmentId = uuidv4();

  const apartment = await createApartment({
    id: apartmentId,
    ...data,
    created_by: userId,
  });

  // Handle images
  if (files && files.length > 0) {
    const images = files.map((file) => ({
      id: uuidv4(),
      apartment_id: apartmentId,
      url: `/uploads/${file.filename}`,
    }));

    await insertImages(images);
  }

  return apartment;
}

async function getApartmentsService(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  const filters = {
    location: query.location,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
  };

  return getApartments({ limit, offset, filters });
}

async function getApartmentByIdService(id) {
  const apartment = await getApartmentById(id);

  if (!apartment) {
    throw new AppError("Apartment not found", 404);
  }

  return apartment;
}

module.exports = {
  createApartmentService,
  getApartmentsService,
  getApartmentByIdService,
};