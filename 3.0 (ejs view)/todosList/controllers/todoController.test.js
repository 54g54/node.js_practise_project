const request = require("supertest");
const app = require("../app");
const todoModule = require("../modules/todoModule");

beforeAll(async () => {
    while (!todoModule.initialized) {
        console.log("waiting init");
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
});

afterAll(() => {
    // 關閉伺服器
    todoModule.disconnect();
});

// describe("correct CRUD Todo",() => {
//     test("getAll todo",async() => {
//         // 送出請求
//         const res = await request(app).get("/todos").set({"X-Requested-With":"XMLHttpRequest"});
//         // 斷言
//         expect(res.body).toEqual(todoModule.todos);
//         expect(res.statusCode).toBe(200);
//     });
    
//     test("creat todo",async() => {
//         const data = {
//             title: "今天是好天氣",
//             status: "Completed",
//             dateStart: "2024-08-13",
//             dateEnd: "2024-08-13"
//         };
//         const res = await request(app).post("/todos").send(data);
    
//         expect(res.body).toEqual(todoModule.todos[todoModule.todos.length-1]);
//         expect(res.statusCode).toBe(200);
//     });
    
//     test("update todo",async() => {
//         const No = 64;
//         const data = {
//             title: "由test更新的資料",
//             status: "Completed",
//             dateStart: "2024-08-12",
//             dateEnd: "2024-08-12"
//         }
//         const res = await request(app).patch(`/todos/${No}`).send(data);
    
//         expect(res.body).toEqual(Object.assign({No: No},data));
//         expect(res.statusCode).toBe(200);
//     });
    
//     test("delete todo", async () => {
//         const No = 94;
    
//         const index = todoModule.todos.findIndex((item) => {
//             return item.No === No;
//         });
    
//         if (index === -1) {
//             throw new Error("Item not found in todoModule.todos");
//         }
    
//         const data = todoModule.todos[index];
    
//         const res = await request(app).delete(`/todos/${No}`);
//         expect(res.body).toEqual(data);
//         expect(res.statusCode).toBe(200);
//     });
// });
describe("incorrect CRUD Todo",() => {

    test("creat todo",async() => {
        const data = {
            title: "",
            status: "in Progressing",
            dateStart: "2024-08-13",
            dateEnd: "20aa-08-00"
        };
        const res = await request(app).post("/todos").send(data);
        
        expect(res.text).toEqual("title, status, dateEnd 格式錯誤");
        expect(res.statusCode).toBe(400);
    });
    
    test("update todo",async() => {
        const No = 64;
        const data = {
            title: "    ",
            status: "is Completed",
            dateStart: "2024-08-32",
            dateEnd: "2024-aa-44"
        }
        const res = await request(app).patch(`/todos/${No}`).send(data);
        
        expect(res.text).toEqual("title, status, dateStart, dateEnd 格式錯誤");
        expect(res.statusCode).toBe(400);
    });
    
    test("delete todo", async () => {
        const No = 11;

        const res = await request(app).delete(`/todos/${No}`);
        
        expect(res.text).toEqual("Data does not exist!");
        expect(res.statusCode).toBe(404);
    });
});