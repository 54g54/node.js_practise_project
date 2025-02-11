const todoModule = require("../modules/todoModule");
//todoModule的function都是回傳Promise()物件所以都是用.then().catch()
exports.getAllTodo = (req,res) => {
    todoModule.getAllTodos().then((todos) => {

        res.send({todos});

    }).catch((err) => {

        res.send(err);

    });
    
};

exports.createTodo = (req,res) =>{
    
    const {title,date} = req.body;
    if(typeof title !== "String"){
        return res.ststus(400),send("title 格式錯誤");
    }

    todoModule.createNewTodo({title,date}).then( (result) => {

        res.send({result});

    }).catch((err) => {

        res.send(err);

    })
    
};

exports.updateTodo = (req,res) =>{

    const {No,title,date} = req.body;
    if(!No){
        return res.status(400).send("未選擇欲改變資料");
    }
    if(typeof title !=="string"){
        return res.status(400).send("title 格式錯誤");
    }

    todoModule.updateTodo({No,title,date}).then( (result) => {

        res.send({result});

    }).catch((err) => {

        res.send(err);

    })
    
};

exports.deleteTodo = (req,res) =>{
    
    const {No} = req.body;

    todoModule.deleteTodo(No).then((result) => {

        res.send({result});

    }).catch((err) => {

        res.send(err);

    })
    
};