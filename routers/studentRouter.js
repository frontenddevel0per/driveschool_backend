const Router = require("express");
const controller = require("../controllers/studentController");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = new Router();
router.get("/get/:id", roleMiddleware, controller.getStudent);
router.patch("/edit/:id", roleMiddleware, controller.editStudent);
router.post("/get_list", roleMiddleware, controller.getStudentList);

module.exports = router;
