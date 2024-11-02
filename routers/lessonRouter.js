const Router = require("express");
const controller = require("../controllers/lessonController");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = new Router();
router.patch("/cancel", roleMiddleware, controller.cancelLesson);
router.post("/get_lessons", roleMiddleware, controller.getLessons);

module.exports = router;
