const express = require('express');
const router = express.Router();
const todoController = require("../controllers/todoController");

router.get('/',todoController.getAllTodo);

router.post('/',todoController.createTodo);

router.patch('/',todoController.updateTodo);

router.delete('/',todoController.deleteTodo);

// router.get('/', (req, res) => {
//     res.render('todos', { todos });
// });
module.exports = router;