const Router = require("express");
const controller = require("../controllers/authController");

const router = new Router();
router.post("/login", controller.login);
router.post("/token", controller.token);

module.exports = router;
