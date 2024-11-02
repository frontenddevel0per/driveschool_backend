const Router = require("express");
const controller = require("../controllers/instructorController");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = new Router();
router.get("/get/:id", roleMiddleware, controller.getInstructor);
router.put("/add", roleMiddleware, controller.addInstructor);
router.patch("/edit/:id", roleMiddleware, controller.updateInstructor);
router.post("/get_list", roleMiddleware, controller.getInstructorsList);
router.get("/get_lessons/:id", roleMiddleware, controller.getInstructorLessons);

module.exports = router;
