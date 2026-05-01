const { userHasPermission } = require("../repositories/rbac.repository");
const AppError = require("../utils/appError");

function authorize(permissionNames) {
  return async function (req, res, next) {
    try {
      const userId = req.user.userId;
      for (const thisPermission of permissionNames) { 
        const allowed = await userHasPermission(userId, thisPermission);
        if (allowed) {
          req.matchedPermission = thisPermission;
          return next();
        }
      }
      return next(new AppError("Forbidden: insufficient permissions", 403));

    } catch (err) {
      return next(new AppError("Authorization check failed hhh", 500));
    }
  };
}

module.exports = authorize;