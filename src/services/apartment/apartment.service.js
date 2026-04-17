const { v4: uuidv4 } = require("uuid");
const AppError = require("../../utils/appError");

const {
  createApartment,
  insertImages,
  getApartments,
  countApartments,
  getApartmentById,
  updateApartment,
  getImagesByApartmentId,
  getImageById,
  addImages,
  deleteImage,
  deleteApartment,
} = require("../../repositories/apartment/apartment.repository");

const { deleteFile } = require("../../utils/files");
const { dbCodeTranslate } = require("../../utils/dbErrors");

async function createApartmentService(data, files, userId) {
  try {
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
  } catch (err) {
    dbCodeTranslate(err.code);
    throw err;
  }
}

async function getApartmentsService(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  const filters = {
    location: query.location,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    bedrooms: query.bedrooms,
  };

  const sort = query.sort;

  const [apartments, total] = await Promise.all([
    getApartments({ limit, offset, filters, sort }),
    countApartments(filters),
  ]);

  return {
    data: apartments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// async function getApartmentsService(query) {
//   const page = parseInt(query.page) || 1;
//   const limit = parseInt(query.limit) || 10;
//   const offset = (page - 1) * limit;

//   const filters = {
//     location: query.location,
//     minPrice: query.minPrice,
//     maxPrice: query.maxPrice,
//   };

//   return getApartments({ limit, offset, filters });
// }

// async function getApartmentByIdService(id) {
//   const apartment = await getApartmentById(id);

//   if (!apartment) {
//     throw new AppError("Apartment not found", 404);
//   }

//   return apartment;
// }

async function getApartmentByIdService(id) {
  const apartment = await getApartmentById(id);

  if (!apartment) {
    throw new AppError("Apartment not found", 404);
  }

  return apartment;
}

async function updateApartmentService(id, data) {
  try {
    const updated = await updateApartment(id, data);

    if (!updated) {
      throw new AppError("Apartment not found", 404);
    }

    return updated;
  } catch (err) {
    dbCodeTranslate(err.code);
    throw err;
  }
}

async function addImagesService(id, files) {
  if (!files || !files.length) {
    throw new AppError("No images provided", 400);
  }

  const images = files.map((file) => ({
    id: uuidv4(),
    apartment_id: id,
    url: `/uploads/${file.filename}`,
  }));

  await addImages(images);

  return { message: "Images added successfully" };
}

async function deleteImageService(imageId) {
  const image = await getImageById(imageId);
  if (!image) {
    throw new AppError("Image not found", 404);
  }
  await deleteFile(image.image_url);
  await deleteImage(imageId);
  
  return { message: "Image deleted" };
}

async function deleteApartmentService(id) {
  const images = await getImagesByApartmentId(id);
  await Promise.all(
    images.map((img) => deleteFile(img.image_url))
  );
  const deleted = await deleteApartment(id);
  if (!deleted) {
    throw new AppError("Apartment not found", 404);
  }

  return { message: "Apartment deleted" };
}

module.exports = {
  createApartmentService,
  getApartmentsService,
  getApartmentByIdService,
  updateApartmentService,
  addImagesService,
  deleteImageService,
  deleteApartmentService,
};