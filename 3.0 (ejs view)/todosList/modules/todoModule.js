const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

class TodoModule{
    // 建構子
    constructor(){
        this.todos = [];
        // init flag
        this.initialized = false;
        // 初始化資料
        this.initPromise = this.initialization();
    }
    // 建立 DB連線
    static connection = mysql.createConnection({
        // 用dotenv 降低資料洩漏風險
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dateStrings: true,
    });
    // 關閉 DB連線
    disconnect(){
        if(TodoModule.connection){
            TodoModule.connection.end();
        }
    }

    // 初始化 this.todo
    initialization(){
        return new Promise((resolve,reject) => {
            TodoModule.connection.query("SELECT * FROM todolist",[],(error,results,fields) => {
                if(error){
                    reject(error);
                }else{
                    this.todos = results;
                    this.initialized = true;
                    resolve();
                }
            });
        });
    }
    // 初始化完才 resolve
    isInitialized(){
        // 確認 init flag
        if(this.initialized){
            // 已完成 resolve
            return Promise.resolve();
        }else{
            // 未完成 再去初始化一次 裡面也有resolve
            return this.initPromise;
        }
    }

    // 回傳全部資料
    getTodos(){
        //此function相較之下 較未依賴初始化後的資料 所以不用isInitialized

        //return Promise()物件
        return new Promise((reslove,reject) => {
            // 用query("SELECT")去取資料
            // query("SELECT (column1,column2,...) FORM tablename WHERE column1 = ? OR column2 = ?......",?的參數,結果)
            TodoModule.connection.query("SELECT * FROM todolist",[],(error,results,fields) => {
                
                if(error){
                    //丟出error
                    reject(error);
                }else{
                    //覆蓋這個class的todos
                    this.todos = results;
                    //回傳資料
                    reslove(this.todos);
                }
            });
        });
    }

    // 建立新資料
    createNewTodo(todo){
        // 初始化完成才開始作動
        return this.isInitialized().then(() => {
            // 取出json的'索引字'與'數值'
            const todokeys = Object.keys(todo);
            const todovalues = Object.values(todo);
            // 動態設定參數  VALUES後面接收的是陣列 用?也可以防止"SQL注入"攻擊
            // array.map(item => dosomething); 類似forEach 但會輸出一個新物件 而非改變array
            const sqlkey = todokeys.map( keys => `${keys}`).join(',');
            const sqlvalue = todovalues.map(value =>`?`).join(',');

            // query("INSERT INTO tablename (column1,column2,...) VALUES (?,?,...)",?的參數,結果)
            const sql =`INSERT INTO todolist (${sqlkey}) VALUES (${sqlvalue})`;

            return new Promise((resolve,reject) => {
                // 用query("INSERT INTO")新增資料
                TodoModule.connection.query(sql,todovalues,(error,results,fields) => {
                    
                    if(error){
                        reject(error);
                    }else{
                        // Object.assign(obj1,obj2,...) 輸出合併之後的物件
                        const newTodo = Object.assign({No : results.insertId},todo);
                        this.todos.push(newTodo);
                        resolve(newTodo);
                    }
                });
            });
        });
        
    }

    // 更新資料
    updateTodo(todo){
        // 初始化完成才開始作動
        return this.isInitialized().then(() => {
            // 對json Array的元素做indexOf()只會回傳第一個符合元素的索引值
            const index = this.todos.findIndex((item)=>{
                return item.No === todo.No;
            });
            // 檢測資料是否存在
            if(index==-1){
                return "data does not exist!";
            }

            // 取出json的'索引字'與'數值' 並去除No
            const todokeys = Object.keys(todo);
            const todovalues = Object.values(todo);
            todokeys.shift();
            todovalues.shift();

            const sqlset = todokeys.map( keys => `${keys} = ?`).join(',');

            // query("UPDATE tablename SET column1=?,column2=?,... WHERE column=?",?的參數,結果)
            const sql=`UPDATE todolist SET ${sqlset} WHERE No = ${todo.No}`;

            return new Promise((resolve,reject) => {
                // 用query("UPDATE")新增資料
                TodoModule.connection.query(sql,todovalues,(error,results,fields) => {
                    
                    if(error){
                        reject(error);
                    }else{
                        // 更新this.todos的資料
                        this.todos.splice(index,1,todo);
                        // splice(begin,deletecount,item1,item2,...); 從begin開始刪除deletecount個元素再依序插入item

                        resolve(todo);
                    }
                });
            });
        });
    }

    // 刪除資料
    deleteTodo(No){
        // 初始化完成才開始作動
        return this.isInitialized().then(() => {
            // 這裡要用await 不然有時下面用index的地方來不及
            const index = this.todos.findIndex((item)=>{
                return item.No === No;
            });
            // 檢測資料是否存在
            if(index==-1){
                return Promise.reject(404);
            }
            
            // 預先將該No的物件從this.todos取出 這麼做的理由在notion筆記No.1裡
            const deletedTodo = this.todos[index];
            // query("DELETE INTO tablename WHERE column1 = ? OR column2 = ?...",?的參數,結果)
            const sql ="DELETE FROM todolist WHERE No = ?";

            return new Promise((resolve,reject) => {
                // 用query("DELETE")刪除資料
                TodoModule.connection.query(sql,No,(error,results,fields) => {
                    
                    if(error){
                        reject(error);
                    }else if(results.affectedRows==1){

                        // >>>>>>>>在這裡取會有問題<<<<<<<<<
                        // const deletedTodo = this.todos[index];

                        // 把這筆資料也從這個class的todos移除
                        this.todos.splice(index,1);
                    
                        resolve(deletedTodo);
                    }    
                });
            });
        });
    }
}

module.exports = new TodoModule();