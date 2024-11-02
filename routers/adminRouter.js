const Router = require("express");
const controller = require("../controllers/adminController");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = new Router();
router.post("/add", roleMiddleware, controller.registerAdmin);
router.patch("/edit/:id", roleMiddleware, controller.editAdmin);

module.exports = router;
