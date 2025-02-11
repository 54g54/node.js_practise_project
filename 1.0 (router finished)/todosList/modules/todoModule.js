const { v4 : uuidv4 } = require('uuid'); 

class TodoModule{

    constructor(){
        this.todos = [
            {
                title:'原始資料',
                id:uuidv4()
            }
        ];
    }


    getAllTodos(){
        return this.todos;
    }


    createNewTodo(todo){
        const {title} = todo;

        const newTodo = {
            title,
            id:uuidv4()
        }
        
        this.todos.push(newTodo);
        return newTodo;
    }
}

module.exports = new TodoModule();