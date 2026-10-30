const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const { getOverview } = require("../../controllers/analyticsController");

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();
  return authenticate(req, res, next);
};

router.get("/overview", optionalAuth, getOverview);

module.exports = router;
