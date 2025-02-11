window.addEventListener('DOMContentLoaded', (event) => {
    // console.log(todos);

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Toggle the side navigation
    const sidebarToggle = document.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    // fullcalender
    // detail on https://fullcalendar.io/docs
    const calendarEl = document.querySelector("#calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: 'zh-tw',
        height: 700,
        headerToolbar: {
            left: "prev",
            center: "title",
            right: "next"
        },
        /* 
        event:{
        title,start,end,url,
        classNames:(TodoEvent,ProgressingEvent,CompletedEvent,CancelledEvent),}
        */
        events:[],
        selectable: true,
        dateClick: (info) => {
            // console.log(info);
            Swal.fire({
                icon:"success",
                title: "Add a new to-do",
                html:swal_html({
                    date: info.dateStr
                }),
                preConfirm: () => {
                    if(!document.getElementById("newtitle").value||document.getElementById("newtitle").value.trim().length === 0){
                        return Swal.showValidationMessage("Title is empty!");
                    }else if(!document.getElementById("newdate").value){
                        return Swal.showValidationMessage("Date is empty!");
                    }
                    return {
                        title: document.getElementById("newtitle").value,
                        status: document.getElementById("newstatus").value,
                        dateStart: document.getElementById("newdate").value,
                        dateEnd: document.getElementById("newdate").value
                    };
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Save",
                cancelButtonText: "Close",
                returnFocus: false
            }).then((result)=>{
                if(result.isConfirmed){
                    if(result.value.title===""){
                        alert("Title is empty!")
                        return;
                    }
                    creattodo({
                        title: `${result.value.title}`,
                        status: `${result.value.status}`,
                        dateStart: `${result.value.dateStart}`,
                        dateEnd: `${result.value.dateEnd}`
                    });
                }
            });
        },
        select: (info) => {
            // console.log(info);
            Swal.fire({
                icon:"success",
                title:"Add a new to-do",
                html:swal_html({
                    start: info.startStr,
                    end: info.endStr
                }),
                preConfirm: () => {
                    if(!document.getElementById("newtitle").value||document.getElementById("newtitle").value.trim().length === 0){
                        return Swal.showValidationMessage("Title is empty!");
                    }else if(!document.getElementById("newstart").value||!document.getElementById("newend").value){
                        return Swal.showValidationMessage("Date is empty!");
                    }
                    return {
                        title: document.getElementById("newtitle").value,
                        status: document.getElementById("newstatus").value,
                        dateStart: document.getElementById("newstart").value,
                        dateEnd: document.getElementById("newend").value,
                    };
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Save",
                cancelButtonText: "Close",
                returnFocus: false
            }).then((result)=>{
                // console.log(result);
                if(result.isConfirmed){
                    if(result.value.title===""){
                        alert("Title is empty!")
                        return;
                    }
                    creattodo({
                        title: `${result.value.title}`,
                        status: `${result.value.status}`,
                        dateStart: `${result.value.dateStart}`,
                        dateEnd: `${result.value.dateEnd}`
                    });
                }
            });
        },
        eventClick: (info) => {
            const No = info.event.title.slice(0,info.event.title.indexOf(" "));
            const title = info.event.title.slice(info.event.title.indexOf(" ")+1,info.event.title.length);
            const statusEvent = (classlist)=>{
                if(classlist.contains("TodoEvent"))return "Todo";
                if(classlist.contains("ProgressingEvent"))return "Progressing";
                if(classlist.contains("CompletedEvent"))return "Completed";
                if(classlist.contains("CancelledEvent"))return "Cancelled";
            }
            
            Swal.fire({
                icon:"info",
                title:`Currently editing
                to-do No.${No}`,
                html:swal_html({
                    title: title,
                    status: statusEvent(info.el.classList),
                    start: yyyy_mm_dd(info.event.start),
                    end: yyyy_mm_dd(info.event.end??info.event.start)
                }),
                preConfirm: () => {
                    if(!document.getElementById("newtitle").value||document.getElementById("newtitle").value.trim().length === 0){
                        return Swal.showValidationMessage("Title is empty!");
                    }else if(!document.getElementById("newstart").value||!document.getElementById("newend").value){
                        return Swal.showValidationMessage("Date is empty!");
                    }
                    return {
                        title: document.getElementById("newtitle").value,
                        status: document.getElementById("newstatus").value,
                        dateStart: document.getElementById("newstart").value,
                        dateEnd: document.getElementById("newend").value,
                    };
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Save",
                cancelButtonText: "Close",
                returnFocus: false
            }).then((result)=>{
                if(result.isConfirmed){
                    if(result.value.title===""){
                        alert("Title is empty!")
                        return;
                    }
                    edittodo({
                        No:No,
                        title:`${result.value.title}`,
                        status:`${result.value.status}`,
                        dateStart:`${result.value.dateStart}`,
                        dateEnd:`${result.value.dateEnd}`
                    },info.event);
                }
            });
        },
    });
    calendar.render();

    // ALL Todos data table
    // methods on https://datatables.net/manual/
    const TodoDataTable = new DataTable("#TodoTable",{
        lengthMenu:[[10,20,50,-1],
        [10,20,50,"All"]],
        pageLength:'10',
        autoWidth: false,
        columns: [
            { width: '10%' },
            { width: '30%' },
            { width: '20%' },
            { width: '20%' },
            { width: '20%' }
        ],
    })
    // datatable click event toggle single tr selected
    TodoDataTable.on('click', 'tbody tr', (e) => {
        let classList = e.currentTarget.classList;
        
        if (classList.contains('selected')) {
            //remove target selected
            classList.remove('selected');
        }
        else {
            //remove all selected then add select
            TodoDataTable.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
            classList.add('selected');
        }
    });

    $(".card-table").on("click","tr",function(e){
        let classList = this.classList;
        
        if (classList.contains('selected')) {
            //remove target selected
            classList.remove('selected');
        }
        else {
            //remove all selected then add select
            $(this).closest(".card-table").find("tr.selected").removeClass("selected");
            classList.add('selected');
        }
    });
    $(".btnadd").on("click",function(e){
        const date = yyyy_mm_dd(new Date());
        console.log(date)
        Swal.fire({
            icon:"success",
            title: "Add a new to-do",
            html:swal_html({
                start: date,
                end: date,
                status:$(this).val()
            }),
            preConfirm: () => {
                if(!document.getElementById("newtitle").value||document.getElementById("newtitle").value.trim().length === 0){
                    return Swal.showValidationMessage("Title is empty!");
                }else if(!document.getElementById("newstart").value||!document.getElementById("newend").value){
                    return Swal.showValidationMessage("Date is empty!");
                }
                return {
                    title: document.getElementById("newtitle").value,
                    status: document.getElementById("newstatus").value,
                    dateStart: document.getElementById("newdate").value,
                    dateEnd: document.getElementById("newdate").value
                };
            },
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Close",
            returnFocus: false
        }).then((result)=>{
            if(result.isConfirmed){
                if(result.value.title===" "){
                    alert("Title is empty!")
                    return;
                }
                creattodo({
                    title: `${result.value.title}`,
                    status: `${result.value.status}`,
                    dateStart: `${result.value.dateStart}`,
                    dateEnd: `${result.value.dateEnd}`
                }).catch(err => {
                    alert(`Adding fail error code:${err}`);
                });
            }
        });

    });
    $(".btnedit").on("click",function(e){
        const card= $(this).closest(".card");
        const selectedRow= card.find(".todo-card-body tr.selected");

        if(selectedRow.length>0){
            const No = selectedRow.find("th").text();
            
            // getEventById(targetId) is from Fullcalendar return target event
            var event = calendar.getEventById(No);
            // eventClick need event's DOM
            var eventEl = calendarEl.querySelector(`.event-${No}`);

            if (event) {
                
                // 創建模擬的 eventClick 事件對象
                var eventClickInfo = {
                    event: event,
                    el: eventEl,
                    jsEvent: new MouseEvent('click'),
                    view: calendar.view
                };

                // 手動觸發 eventClick 事件
                calendar.trigger('eventClick', eventClickInfo);
            } else {
                console.log('Event not found');
            }
        }else{
            alert("Select one row to edit!");
        }
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // put data to entire page
    todos.forEach((todo)=>{

        $(`#table-${todo.status}`).append(
            `<tr>
                <th>${todo.No}</th>
                <td>${todo.title}</td>
            </tr>`
        );
        calendar.addEvent({
            id: todo.No,
            title: `${todo.No} ${todo.title}`,
            start: `${todo.dateStart}`,
            end: `${todo.dateEnd}`,
            classNames: [`${todo.status}Event`,`event-${todo.No}`],
            allDay: true
        });
        TodoDataTable.row.add(Object.values(todo));
    });
    TodoDataTable.draw(false);
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // functions
    function swal_html(data){
        const h = 
            `<div class="form-group" style="text-align: left;">
                <input type="text" class="form-control" id="newtitle" 
                ${ data.title ? `value="${data.title}"`:`placeholder="Enter to-do title"`}>
                <label style="margin-top:5px;">Status:</label>
                <select class="form-select" id="newstatus">
                    <option value="Todo" ${ data.status === "Todo"?"selected":""}>Todo</option>
                    <option value="Progressing" ${ data.status === "Progressing"?"selected":""}>Progressing</option>
                    <option value="Completed" ${ data.status === "Completed"?"selected":""}>Completed</option>
                    <option value="Cancelled" ${ data.status === "Cancelled"?"selected":""}>Cancelled</option>
                </select>
                ${ data.start && data.end ? `
                <label style="margin-top:5px;">Start Date:</label>
                <input type="date" class="form-control" id="newstart" value=${data.start}>
                <label style="margin-top:5px;">End Date:</label>
                <input type="date" class="form-control" id="newend" value=${data.end}>
                ` : `
                <label style="margin-top:5px;">Date:</label>
                <input type="date" class="form-control" id="newdate" value=${data.date}>`}
            </div>`;
        return h;
    }
    function yyyy_mm_dd(string){
        const date = new Date(string);
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    function creattodo(todo){
        // todo ={title,status,dateStart,dateEnd}
        return new Promise((resolve,reject)=>{
            $.ajax({
                rul: `/todos`,
                type: `POST`,
                data: todo,
                success:(result,status,xhr)=>{
                    if(!result.code){
                        // 上 4個table
                        $(`#table-${result.status}`).append(
                            `<tr>
                                <th>${result.No}</th>
                                <td>${result.title}</td>
                            </tr>`
                        );
                        // 中 行事曆
                        calendar.addEvent({
                            id: result.No,
                            title: `${result.No} ${result.title}`,
                            start: result.dateStart,
                            end: result.dateEnd,
                            classNames: `${result.status}Event`,
                            allDay: true
                        });
                        // 下 datatable
                        TodoDataTable.row.add(Object.values(result)).draw(false);

                        resolve(alert(`Successfully added a record`));
                    }else{
                        resolve(alert(JSON.stringify(result)));
                    }
                },
                error:(xhr,status,error)=>{
                    reject(error);
                }
            });
        });
    }
    function edittodo(todo,event){
        // todo = {No,title,status,dateStart,dateEnd}

        // 上 4個table
        $(`.todo-card-body`).find("th").each(function(index,e){
            if($(e).text()==todo.No){
                $(e).parentsUntil("table").remove();
            }
        });
        $(`#table-${todo.status}`).find("th").each(function(index,e){
            if($(e).text()>todo.No){
                $(e).parentsUntil("table").before(`<tr><th>${todo.No}</th><td>${todo.title}</td></tr>`);
            }
        });
        // 中 行事曆
        event.setProp("title",`${todo.No} ${todo.title}`);
        event.setProp("classNames",`${todo.status}Event`);
        event.setDates(
            todo.dateStart,
            (todo.dateStart===todo.dateEnd) ? null : todo.dateEnd,
            {allDay:true}
        );
        //下
        // rowindexs是屬於DataTable的IndexCollection 不是JS array
        // 除了array方法之外還有其他DataTable的function
        const rowindexs = TodoDataTable.rows((index,data,node)=> {
            return data[0]==todo.No;
        });
        //轉成JS array
        const indexs = rowindexs.toArray();
        //改變資料用row 不是rows
        TodoDataTable.row(indexs).data([
            todo.No,
            todo.title,
            todo.status,
            todo.dateStart,
            todo.dateEnd
        ]);
        // return new Promise((resolve,reject)=>{
        //     $.ajax({
        //         rul: `/todos/${todo.No}`,
        //         type: `PATCH`,
        //         data: todo,
        //         success:(result,status,xhr)=>{
        //             resolve(result);
        //         },
        //         error:(xhr,status,error)=>{
        //             reject(error);
        //         }
        //     });
        // });
    }
});
