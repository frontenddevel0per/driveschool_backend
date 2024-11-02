const Router = require("express");
const controller = require("../controllers/applicationController");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = new Router();
router.get("/get/:id", roleMiddleware, controller.getApplication);
router.put("/add", roleMiddleware, controller.addApplication);
router.patch("/edit/:id", roleMiddleware, controller.editApplication);
router.post("/get_list", roleMiddleware, controller.getApplicationList);

module.exports = router;
