const express = require('express')
const chalk = require("chalk")
const mongoose = require("mongoose")
const taskRouter = require("./routes/tasksRoute")
require("dotenv").config()

// Создание сервера
const server = express()

// Библиотека для подключения mongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(chalk.blue("DB IS CONNECTED")))
    .catch(() => console.log(chalk.red("DB IS NOT CONNECTED")))

// Обработка данных в req.body
server.use(express.json())

// Роуты, которые начинаются с /api/tasks
server.use("/api/tasks", taskRouter)

// Если ни 1 роут не подошел, то выводим 404
server.use((req, res, next) => {
    const error = {message: "Not Found"}
    res.status(404).json(error)
    next()
})

// Запуск сервера
server.listen(process.env.PORT ||8000, () => {
    console.log('Server is running')
})