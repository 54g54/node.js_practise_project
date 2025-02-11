const mysql = require('mysql2');

class TodoModule{

    constructor(){

        this.todos = [];
        TodoModule.#initialization();
    }
    
    //建立資料庫連線
    static #connection = mysql.createConnection({
        host: 'localhost',
        user: 'user_todolist',
        password: '123456',
        database: 'test',
        dateStrings: true,
    });

    //初始化 this.todo
    static #initialization(){
        TodoModule.#connection.query("SELECT * FROM todolist",[],(error,results,fields) => {
            if(error){
                //丟出error
                throw error;
            }else{
                //覆蓋這個class的todos
                this.todos = results;
            }
        });
    }
    
    //回傳全部資料
    getAllTodos(){
        //return Promise()物件
        return new Promise((reslove,reject) => {

            // 用query("SELECT")去取資料
            //query("SELECT (column1,column2,...) FORM tablename WHERE column1 = ? OR column2 = ?......",?的參數,結果)
            TodoModule.#connection.query("SELECT * FROM todolist",[],(error,results,fields) => {
                
                if(error){
                    //丟出error
                    reject(error);
                }else{
                    //覆蓋這個class的todos
                    this.todos = results;
                    //將搜尋結果轉換格式
                    const strings =[];
                    this.todos.forEach((todo)=>{
                        
                        // 模板字串``取代'' todo.No是int轉成string再用padEnd()填充空格到字串後 達成類似printf的效果
                        strings.push(`No.${todo.No.toString().padEnd(4)} date: ${(todo.date??"null").padEnd(10)}  title: ${todo.title}`);
                    })
                    //回傳轉換後的資料
                    reslove(strings);
                }
            });
        });
    }

    //建立新資料
    createNewTodo(todo){
        
        //VALUES 後面接收的是陣列,todo是json資料不是陣列
        const newtodo = [todo.title,todo.date];

        //return Promise()物件
        return new Promise((resolve,reject) => {
            // 用query("INSERT INTO")新增資料
            //query("INSERT INTO tablename (column1,column2,...) VALUES (?,?,...)",?的參數,結果)
            TodoModule.#connection.query("INSERT INTO todolist (title,date) VALUES (?,?)",newtodo,(error,results,fields) => {
                
                if(error){
                    //丟出error
                    reject(error);
                }else{
                    //丟出結果
                    resolve(`insert new todo No.${results.insertId.toString()} date:${newtodo[1]??"null".padEnd(10)} title:${newtodo[0]}`);
                }
            });
        });
    }

    //更新資料
    updateTodo(todo){

        //對json Array的元素做indexOf()只會回傳第一個符合元素的索引值
        const index = this.todos.findIndex((item)=>{
            return item.No === todo.No;
        });
        //要用array帶入參數 不能用object
        const settodo =[todo.title,todo.date,todo.No];

        //return Promise()物件
        return new Promise((resolve,reject) => {
            // 用query("UPDATE")新增資料
            //query("UPDATE tablename column1=?,column2=?,...) WHERE column=?",?的參數,結果)
            TodoModule.#connection.query("UPDATE todolist SET title = ? , date = ? WHERE No = ?",settodo,(error,results,fields) => {
                
                if(error){
                    //丟出error
                    reject(error);
                }else{
                    //更新this.todos的資料
                    this.todos.splice(index,1,{ No:todo.No, title:todo.title, date:todo.date});
                    //splice(begin,deletecount,item1,item2,...); 從begin開始刪除deletecount個元素再依序插入item

                    //丟出結果
                    resolve(`updated todo No.${todo.No.toString().padEnd(4)} date:${todo.date??"null".padEnd(10)} title:${todo.title} `);
                }
            });
        });
    }

    //刪除資料
    deleteTodo(No){
        
        //對json Array的元素做indexOf()只會回傳第一個符合元素的索引值
        const index = this.todos.findIndex((item)=>{
            return item.No === No;
        });
        //預先將該No的物件從this.todos取出 這麼做的理由在notion筆記No.1裡
        const deletedTodo = this.todos[index];

        //return Promise()物件
        return new Promise((resolve,reject) => {
            // 用query("DELETE INTO")去取資料
            //query("DELETE INTO tablename WHERE column1 = ? OR column2 = ?...",?的參數,結果)
            TodoModule.#connection.query("DELETE FROM todolist WHERE No = ?",No,(error,results,fields) => {
                
                if(error){
                    //丟出error
                    reject(error);
                }else if(results.affectedRows==1){

                    //>>>>>>>>在這裡取會有問題<<<<<<<<<
                    //const deletedTodo = this.todos[index];

                    //丟出結果
                    resolve(`deleted todo No.${deletedTodo.No.toString().padEnd(4)} date: ${deletedTodo.date??"null".padEnd(12)} title: ${deletedTodo.title}`);
                    //把這筆資料也從這個class的todos移除
                    this.todos.splice(index,1);
                    //splice(begin,deletecount,item1,item2,...); 從begin開始刪除deletecount個元素再依序插入item
                }
            });
        });
    }
}

module.exports = new TodoModule();