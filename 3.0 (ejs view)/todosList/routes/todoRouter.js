const express = require('express');
const router = express.Router();
const todoController = require("../controllers/todoController");

/* RESTful API
1.透過URL指定資源
2.要有CRUD(Creat,Read,Update,Delete) 且對應POST,GET,PATCH,DELETE
  ***** PUT 與 PATCH 的選擇在筆記No.2 *****
3.通過表現形式來操作資源 取決於不同的讀取者
4.資源的表現可以是HTML或XML，若有別的應用也可以是JSON。
*/

router.get('/',
  /* 	#swagger.tags = ['Todo']
      #swagger.description = '取得所有Todo' 
  
      #swagger.parameters['x-requested-with'] = {
        in: 'header',
        description: 'Chinese:\n
          預設:渲染todos頁面\n
          XMLHttpRequest: 取得全部todo\n
          English:\n
          default: render todos page\n
          XMLHttpRequest: get all todo',
        schema:"XMLHttpRequest",
      }
     
      #swagger.responses[200] = { 
        schema: [
          {
            "No": 1,
            "title": "這是第一筆資料!",
            "status": "Todo",
            "dateStart": "2024-07-15",
            "dateEnd": "2024-07-15"
          }
        ]
      } */      
  todoController.getAllTodo);

router.post('/',
  /* 	#swagger.tags = ['Todo']
      #swagger.description = '建立新Todo'
      
      #swagger.parameters['todo detail'] = {
        in: 'body',
        description: '傳入參數:\n
          status only can be one of Todo,Progressing,Completed,Cancelled',
        schema:{
          title: "any",
          status: "option",
          dateStart: "yyyy-mm-dd",
          dateEnd: "yyyy-mm-dd"
        }
      } 
      #swagger.responses[200] = { 
        schema: {
          "No": 45,
          "title": "新增資料",
          "status": "Completed",
          "dateStart": "2024-08-14",
          "dateEnd": "2024-08-14"
        }
      } 
      #swagger.responses[400] = { 
        schema: "title,status,dateStart,dateEnd 格式錯誤!"
      }*/
  todoController.createTodo);

router.patch('/:No',
    /* 	#swagger.tags = ['Todo']
      #swagger.description = '更新現有Todo'
      #swagger.parameters['No'] = {
        in: 'header',
        description: 'Number of todo',
      }

      #swagger.parameters['todo detail'] = {
        in: 'body',
        description: '傳入參數:\n
          status only can be one of Todo,Progressing,Completed,Cancelled',
        schema:{
          title: "any",
          status: "option",
          dateStart: "yyyy-mm-dd",
          dateEnd: "yyyy-mm-dd"
        }
      } 
      #swagger.responses[200] = { 
        description:'object after patch',
        schema: {
          "No": 45,
          "title": "新增資料",
          "status": "Completed",
          "dateStart": "2024-08-14",
          "dateEnd": "2024-08-14",
        }
      }
        #swagger.responses[400] = { 
        schema: "title,status,dateStart,dateEnd 格式錯誤!",
      }
        #swagger.responses[404] = {
        description:'When todo is not exist will get this text.',
        schema: "Data is not exist!",
      }*/
  todoController.updateTodo);

router.delete('/:No',
  /* 	#swagger.tags = ['Todo']
      #swagger.description = '刪除現有Todo'
      #swagger.parameters['No'] = {
        in: 'header',
        description: 'Number of todo',
      }
      
      #swagger.responses[200] = { 
        description:'deleted object',
        schema: {
          "No": 45,
          "title": "新增資料",
          "status": "Completed",
          "dateStart": "2024-08-14",
          "dateEnd": "2024-08-14",
        }
      }
      #swagger.responses[404] = {
        description:'When todo is not exist will get this text.',
        schema: "Data is not exist!",
        }*/
  todoController.deleteTodo);

module.exports = router;