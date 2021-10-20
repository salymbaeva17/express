const fs = require("fs")
const {nanoid} = require("nanoid");

const readData = () => {
    try {
        return JSON.parse(fs.readFileSync(`./tasks/shop.json`, 'utf8'))
    } catch (e) {
        return []
    }
}
const writeData = (data) => {
    fs.writeFileSync(`./tasks/shop.json`, JSON.stringify(data, null, 2))
}

const getAllTasks = (req, res) => {
    const data = readData()
    const filteredData = data
        .filter(item => !item._isDeleted)
        .map(item => {
            return {
                id: item.taskId,
                title: item.title,
                status: item.status
            }
        })
    res.json(filteredData)
}
const getByTime = (req, res) => {
    const data = readData()
    const duration = {
        "day": 1000 * 60 * 60 * 24,
        "week": 1000 * 60 * 60 * 24 * 7,
        "month": 1000 * 60 * 60 * 24 * 30,
        "year": 1000 * 60 * 60 * 24 * 365
    }
    const filteredData = data
        .filter(item => +new Date() - item._createdAt < duration[req.params.timespan])
        .map(item => {
            return {
                id: item.taskId,
                title: item.title,
                status: item.status
            }
        })
    res.json(filteredData)
}
const addTask = (req, res) => {
    const newTask = {
        "taskId": nanoid(5),
        "title": req.body.title,
        "_isDeleted": false,
        "_createdAt": +new Date(),
        "_deletedAt": null,
        "status": "new"
    }
    const data = readData()
    const updatedTasks = [...data, newTask]
    writeData(updatedTasks)
    res.json(newTask)
}
const deleteTask = (req, res) => {
    const data = readData()
    const updatedTasks = data.map(item => item.taskId === req.params.id ? {
        ...item,
        _isDeleted: true,
        _deletedAt: +new Date()
    } : item)
    const deletedTask = data.filter(item => item.taskId === req.params.id)
    console.log(deletedTask)
    writeData(updatedTasks)
    res.json(deletedTask)
}
const updateTask = (req, res) => {
    const statuses = ['done', 'new', 'in progress', 'blocked']
    if (statuses.includes(req.body.status)) {
        const data = readData()
        const updatedTasks = data.map(item => item.taskId === req.params.id ? {
            ...item,
            status: req.body.status
        } : item)
        writeData(updatedTasks)
        let updatedTask = updatedTasks.filter(item => item.status !== "new")
        res.json(updatedTask)
    } else {
        res.status(501).json({"status": "error", "message": "incorrect status"})
    }
}

module.exports = {
    getAllTasks,
    getByTime,
    addTask,
    deleteTask,
    updateTask
}