const {
  createApartmentService,
  getApartmentsService,
  getApartmentByIdService,
  updateApartmentService,
  addImagesService,
  deleteImageService,
  deleteApartmentService,
} = require("../../services/apartment/apartment.service");

async function createApartment(req, res, next) {
  try {
    const data = await createApartmentService(
      req.body,
      req.files,
      req.user.userId
    );

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function getApartments(req, res, next) {
  try {
    const data = await getApartmentsService(req.query);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

async function getApartment(req, res, next) {
  try {
    const data = await getApartmentByIdService(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

async function updateApartment(req, res, next) {
  try {
    const data = await updateApartmentService(
      req.params.id,
      req.body
    );
    res.status(204).json(data);
  } catch (err) {
    next(err);
  }
}

async function addImages(req, res, next) {
  try {
    const data = await addImagesService(
      req.params.id,
      req.files
    );
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function deleteImage(req, res, next) {
  try {
    const data = await deleteImageService(req.params.imageId);
    res.status(204).json(data);
  } catch (err) {
    next(err);
  }
}

async function deleteApartment(req, res, next) {
  try {
    const data = await deleteApartmentService(req.params.id);
    res.status(204).json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApartment,
  getApartments,
  getApartment,
  updateApartment,
  addImages,
  deleteImage,
  deleteApartment,
};