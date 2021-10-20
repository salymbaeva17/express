const express = require("express")
const {getAllTasks, getByTime, addTask, deleteTask, updateTask} = require("../controllers/tasks");

const router = express.Router()

router.get("/", getAllTasks)
router.get("/:timespan", getByTime)
router.post("/", addTask)
router.delete("/:id", deleteTask)
router.patch("/:id", updateTask)

module.exports = router