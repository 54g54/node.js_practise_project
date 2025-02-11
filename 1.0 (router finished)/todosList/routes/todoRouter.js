const express = require('express');
const router = express.Router();
const todoController = require("../controllers/todoController");
/*
router.get('/',(req,res) =>{

    const todos = todosModule.getAllTodos();
    
    res.send({
        status: 'success',
        todos,
    });
});*/
router.get('/',todoController.getAllTodo);
/*
router.post('/',(req,res) =>{
    
    const {title} = req.body;

    const newTodo = todosModule.creatNewTodo({
        title,
    });
     
    res.send({
        status: 'success',
        todo: newTodo,
    });
});*/
router.post('/',todoController.createTodo);
module.exports = router;