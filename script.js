const express = require('express')
const fs = require('fs')
const server = express()
const {nanoid} = require('nanoid')

server.use(express.json())

const getAllUsers = (name) => {
    try {
        return JSON.parse(fs.readFileSync(`./tasks/${name}.json`, 'utf8'))
    } catch (e) {
        return []
    }
}

server.get('/api/tasks/:category', (req, res) => {
    try {
        const users = getAllUsers(req.params.category)
        const filteredUser = users.filter(item => !item._isDeleted)
            .map(item => {
                return {
                    id: item.taskId,
                    title: item.title,
                    status: item.status
                }
            })
        res.json(filteredUser)
    } catch (e) {
        res.status(404).json({message: 'File Not Found!'})
    }
})


server.post('/api/tasks/:category', (req, res) => {
    const newTask = {
        taskId: nanoid(5),
        title: req.body.title,
        _isDeleted: false,
        _createdAt: +new Date(),
        _deletedAt: null,
        status: 'new'
    }
    const data = getAllUsers(req.params.category)
    const updatedTask = [...data, newTask]
    fs.writeFileSync(`./tasks/${req.params.category}.json`, JSON.stringify(updatedTask, null, 2))
    res.json(newTask)
})


server.delete('/api/tasks/:category/:id', (req, res) => {
    const data = getAllUsers(req.params.category)
    const filteredTasks = data.map(item => item.taskId === req.params.id ? {...item, _isDeleted: true, _deletedAt: +new Date()} : item)
    fs.writeFileSync(`./tasks/${req.params.category}.json`, JSON.stringify(filteredTasks, null, 2))
    res.json({status: 'Successfully!'})
})


server.patch('/api/tasks/:category/:id', (req, res) => {
    const statuses = ['done', 'new', 'in progress', 'blocked']
    if (statuses.includes(req.body.status)) {
        const data = getAllUsers(req.params.category)
        const updatedTasks = data.map(item => item.taskId === req.params.id ? {...item, status: req.body.status} : item)
        fs.writeFileSync(`./tasks/${req.params.category}.json`, JSON.stringify(updatedTasks, null, 2))
        let updatedTask = updatedTasks.filter(item => item.status !== "new")
        res.json(updatedTask)
    } else {
        res.status(501).json({"status": "error", "message": "incorrect status"})
    }
})


server.get('/api/tasks/:category/:timespan', (req, res) => {
    const users = getAllUsers(req.params.category)
    const duration = {
        "day": 1000 * 60 * 60 * 24,
        "week": 1000 * 60 * 60 * 24 * 7,
        "month": 1000 * 60 * 60 * 24 * 30
    }
    const filteredUser = users
        .filter(item => +new Date() - item._createdAt < duration[req.params.timespan])
        .map(item => {
        return {
            id: item.taskId,
            title: item.title,
            status: item.status
        }
    })
    res.json(filteredUser)
})


server.listen(8000, () => {
    console.log('Server is running')
})