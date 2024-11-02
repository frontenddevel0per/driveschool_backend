const Router = require("express");
const controller = require("../controllers/imageController");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = new Router();
router.put("/add/:id", roleMiddleware, controller.addImage);
router.get("/get/:id", roleMiddleware, controller.getImage);
router.patch("/edit/:id", roleMiddleware, controller.editImage);

module.exports = router;
