const {
  createApartmentService,
  getApartmentsService,
  getApartmentByIdService,
  updateOwnApartmentService,
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

async function updateOwnApartment(req, res, next) {
  try {
    const data = await updateOwnApartmentService(
      req.params.id,
      req.body,
      req.user.userId
    );
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

async function addImages(req, res, next) {
  try {
    const data = await addImagesService(
      req.params.id,
      req.files,
      req.user.userId
    );
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function deleteImage(req, res, next) {
  try {
    const data = await deleteImageService(req.params.imageId, req.user.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function deleteApartment(req, res, next) {
  try {
    const data = await deleteApartmentService(req.params.id, req.user.userId);
    res.status(204).send()
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApartment,
  getApartments,
  getApartment,
  updateOwnApartment,
  addImages,
  deleteImage,
  deleteApartment,
};