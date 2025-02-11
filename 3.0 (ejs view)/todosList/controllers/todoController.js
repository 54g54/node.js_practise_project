const todoModule = require("../modules/todoModule");
//todoModule的function都是回傳Promise()物件所以都是用.then().catch()
exports.getAllTodo = (req,res) => {
    todoModule.getTodos().then((todos) => {
        //區分出取全部資料的API請求
        if(req.headers['x-requested-with']==='XMLHttpRequest'){
            res.status(200).send(todos);
        }else{
        //這是渲染網頁的GET
            console.log('Server is running on http://localhost:3000/todos');
            res.status(200).render('todoList',{todos:todos});
        }
    }).catch((err) => {
        res.status(500).send(`Server is not running Error code: ${err}`);
    });
};

exports.createTodo = (req,res) =>{
    // const {title,status,dateStart,dateEnd} = req.body;
    const inputErrors = inputError(req);
    if(inputErrors) {
        return res.status(400).send(inputErrors);
    };

    todoModule.createNewTodo(req.body).then( (result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(500).send(err);
    })
};

exports.updateTodo = (req,res) =>{
    //取出body與在URL的No的參數
    const settodo = Object.assign({No : parseInt(req.params.No,10)},req.body);

    const inputErrors = inputError(req);
    if(inputErrors) {
        return res.status(400).send(inputErrors);
    };
    todoModule.updateTodo(settodo).then( (result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(500).send(err);
    })
};

exports.deleteTodo = (req,res) =>{
    todoModule.deleteTodo(parseInt(req.params.No,10)).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        if (err === 404) {
            return res.status(404).send("Data does not exist!");
        }
        res.status(500).send(err);
    })
};

function inputError(req){
    const isStatus = ["Todo","Progressing","Completed","Cancelled"];
    const errors = [];

    if (!req.body.title || req.body.title.trim().length === 0) {
        errors.push("title");
    }
    if (!isStatus.includes(req.body.status)){
        errors.push("status");
    }
    if(!isDate(req.body.dateStart)){
        errors.push("dateStart");
    }
    if(!isDate(req.body.dateEnd)){
        errors.push("dateEnd");
    }

    return errors.length ? `${errors.join(", ")} 格式錯誤` : null ;
}

function isDate(dateString){ 
    // 不符合表示法 就不是日期 回傳不是日期
    const regex = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");
    if(!regex.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    const [year, month, day] = dateString.split('-').map(Number);
    
    return date.getFullYear() === year &&
           date.getMonth() + 1 === month &&  // 月份需要加 1
           date.getDate() === day;
}