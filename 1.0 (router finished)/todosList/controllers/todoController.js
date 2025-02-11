const todoModule = require("../modules/todoModule");

exports.getAllTodo = (req,res) => {

    const todos = todoModule.getAllTodos();
    
    res.send({
        status: 'success',
        todos,
    });
};

exports.createTodo = (req,res) =>{
    
    const {title} = req.body;

    const newTodo = todoModule.createNewTodo({
        title,
    });
     
    res.send({
        status: 'success',
        todo: newTodo,
    });
};