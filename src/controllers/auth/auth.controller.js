const {
  registerUser,
  loginUser,
} = require("../../services/auth/auth.service");

async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = await loginUser(req.body.email, req.body.password);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};