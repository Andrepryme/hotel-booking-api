const {
  createApartmentService,
  advancedGetApartmentsService,
  getApartmentsService,
  getApartmentByIdService,
} = require("../../services/apartment/apartment.service");

async function createApartment(req, res, next) {
  try {
    const apartment = await createApartmentService(
      req.body,
      req.files,
      req.user.userId
    );

    res.status(201).json(apartment);
  } catch (err) {
    next(err);
  }
}

async function getApartments(req, res, next) {
  try {
    const data = await advancedGetApartmentsService(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getApartment(req, res, next) {
  try {
    const data = await getApartmentByIdService(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApartment,
  getApartments,
  getApartment,
};