// Elements
const accountBook = document.getElementById('account-book');

const monthlyRecord = document.getElementById('monthly-record');
const monthlyTable = document.getElementById('monthly-table');
const monthlyTableBody = document.getElementById('monthly-body');

const weeklyRecord = document.getElementById('weekly-record');
const weeklyTable = document.getElementById('weekly-table');
const weeklyTableBody = document.getElementById('weekly-body');

const dailyRecord = document.getElementById('daily-record');
const dailyTable = document.getElementById('daily-table');
const dailyTableBody = document.getElementById('daily-body');
const dailySum = document.getElementById('daily-sum');

const buttonAdd = document.getElementById('add');
const inputItem = document.getElementById('item');
const inputIncome = document.getElementById('income');
const inputSpending = document.getElementById('spending');

let flag;   // flag status : monthly or weekly or daily
const monthly = 'monthly';
const weekly = 'weekly';
const daily = 'daily';

/* Default ########################################*/
/**
 * connect with server
 * get data from server connecting my_db
 */
const socket = new WebSocket('ws://localhost:8090', 'tcp');

/**
 * Request a connection to a server
 */
socket.onopen = () => {
    console.log('socket.onopen');
};

/**
 * Handling messages from the server
 * @param {*} event : message from server
 */
socket.onmessage = (event) => {
    console.log('socket.onmessage');

    let jsonData = JSON.parse(event.data);
    console.log(event);
    console.log(jsonData);

    // Distinguish which functions to call based on flag status
    switch (flag) {
        case monthly:
            calculatingAccountMontly(jsonData);
            break;
        case weekly:
            calculatingAccountWeekly(jsonData);
            break;
        default:
            calculatingAccountDaily(jsonData);
    }
};

/**
 * Terminate the connection with the server
 */
socket.onclose = () => {
    console.log('socket.onclose');
};

/**
 * Error connecting to the server
 */
socket.onerror = (event) => {
    console.log('socket.error');
    console.log(event);
};

/* Set ############################################*/
/**
 * Setting up a accounting book
 * @param {*} month : The month of the accounting book to set up
 * @param {*} week  : The week of the accounting book to set up
 * @param {*} date  : The date of the accounting book to set up
 */
function todayAccountBook(month, week, date) {
    setRecordMonth(month);
    setRecordWeek(week);
    setRecordDate(date);
    setAccountBookDaily(year, month, date);
}

// change record text
const setRecordMonth = month => monthlyRecord.children[0].innerText = `month : ${month + 1}`;
const setRecordWeek = week => weeklyRecord.children[0].innerText = `week : ${week}`;
const setRecordDate = date => dailyRecord.children[0].innerText = `date : ${date}`;

/**
 * clearing account book before importing data from database
 */
function clearAccountBook() {
    let alreadyAccount = document.querySelector('#daily-body');
    Array.from(alreadyAccount.children).forEach(child => {
        console.log(child);
        if (child.className == 'show item-income-spend')
            alreadyAccount.removeChild(child);
    });

    dailySum.innerText = '';

    let tr = monthlyTableBody.children[0];
    tr.children[0].innerText = '';
    tr.children[1].innerText = '';
    tr.children[2].innerText = '';

    tr = weeklyTableBody.children[0];
    tr.children[0].innerText = '';
    tr.children[1].innerText = '';
    tr.children[2].innerText = '';
}

/**
 * To set up daily account book, send a message to the server requesting data from the database
 * @param {*} year  : The year of the accounting book to set up
 * @param {*} month : The month of the accounting book to set up
 * @param {*} date  : The date of the accounting book to set up
 */
function setAccountBookDaily(year, month, date) {
    const sql = 'SELECT * FROM account where date = ?';
    const values = [year + '-' + (month + 1) + '-' + date];
    const message = {
        sql: sql,
        values: values
    };

    flag = daily;
    console.dir(message);
    socket.send(JSON.stringify(message));
}

/**
 * To set up monthly account book, send a message to the server requesting data from the database
 * @param {*} month : The month of the accounting book to set up
 */
function setAccountBookMonthly(month) {
    const sql = 'SELECT * FROM account where month(date) = ?';
    const values = [`${month + 1}`];
    const message = {
        sql: sql,
        values: values
    };

    flag = monthly;
    console.dir(message);
    socket.send(JSON.stringify(message));
}

/**
 * To set up weekly account book, send a message to the server requesting data from the database
 */
function setAccountBookWeekly() {
    const str = String(weeklyRecord.children[0].innerText);
    const weekID = str.slice(str.length - 3, str.length);
    const week = document.getElementById(`${weekID}`);
    console.dir(week);

    let start = '';
    let end = '';
    Array.from(week.children).forEach(i => {
        if (i.innerText != '' && start == '') start = i.innerText;
        if (i.innerText != '') end = i.innerText;
    });

    const sql = 'SELECT * FROM account where date between ? and ?';
    const values = [
        year + '-' + (month + 1) + '-' + start,
        year + '-' + (month + 1) + '-' + end
    ];
    const message = {
        sql: sql,
        values: values
    };

    flag = weekly;
    console.dir(message);
    socket.send(JSON.stringify(message));
}

/**
 * Deleting a selected line in a daily account book
 * @param {*} item  : What to delete
 * @param {*} year  : The year of the item to be deleted
 * @param {*} month : Month of the item to be deleted
 * @param {*} date  : Day of the item to be deleted
 */
function deleteAccountBook(item, year, month, date) {
    const sql = 'DELETE FROM account where user_num = ? and date = ? and item = ?';
    const values = [
        1,
        year + '-' + (month + 1) + '-' + date,
        item
    ];
    const message = {
        sql: sql,
        values: values
    };

    flag = daily;
    console.dir(message);
    socket.send(JSON.stringify(message));
}

/**
 * Manipulate the jsonData to insert the results into the daily account book.
 * When a line of items is created, a delete button is created.
 * Once the daily account book is complete, call the function to create the monthly account book.
 * @param {*} jsonData : A message from the server containing the data requested by the client to the database.
 */
function calculatingAccountDaily(jsonData) {
    let dailyIncome, dailySpending;

    dailyIncome = 0;
    dailySpending = 0;
    jsonData.forEach(j => {
        console.log(j);

        const item = j.item;
        const income = j.income;
        const spending = j.spending;

        const saveNdelete = document.createElement('tr');
        saveNdelete.className = 'show item-income-spend';
        for (let i = 0; i < 4; i++) {
            const child = document.createElement('td');

            switch (i) {
                case 0:
                    child.className = 'Save & Delete';
                    const b = document.createElement('button');
                    b.className = 'delete';
                    b.innerText = 'Delete';
                    b.style.width = '55px';
                    b.addEventListener('click', () => {
                        dailyTableBody.removeChild(saveNdelete);
                        deleteAccountBook(item, year, month, date);
                    });
                    child.appendChild(b);
                    break;
                case 1:
                    child.className = 'item';
                    child.innerText = item;
                    break;
                case 2:
                    child.className = 'income';
                    child.innerText = income;
                    dailyIncome += Number(income);
                    break;
                case 3:
                    child.className = 'spending';
                    child.innerText = spending;
                    dailySpending += Number(spending);
                    break;
            }

            saveNdelete.appendChild(child);
        }
        dailyTableBody.insertAdjacentElement('afterbegin', saveNdelete);
    });
    dailySum.innerText = Number(dailyIncome - dailySpending);

    setAccountBookMonthly(month);
}

/**
 * Manipulate the jsonData to insert the results into the monthly account book.
 * Once the daily account book is complete, call the function to create the weekly account book.
 * @param {*} jsonData : A message from the server containing the data requested by the client to the database.
 */
function calculatingAccountMontly(jsonData) {
    let monthlyIncome, monthlySpending;
    const tr = monthlyTableBody.children[0];
    console.dir(tr);  // tr

    monthlyIncome = 0;
    monthlySpending = 0;
    jsonData.forEach(j => {
        monthlyIncome += j.income;
        monthlySpending += j.spending;
    });

    tr.children[0].innerText = Number(monthlyIncome);
    tr.children[1].innerText = Number(monthlySpending);
    tr.children[2].innerText = Number(monthlyIncome - monthlySpending);

    setAccountBookWeekly();
}

/**
 * Manipulate the jsonData to insert the results into the weekly account book.
 * @param {*} jsonData : A message from the server containing the data requested by the client to the database.
 */
function calculatingAccountWeekly(jsonData) {
    let weeklyIncome, weeklySpending;
    const tr = weeklyTableBody.children[0];
    console.dir(tr);   // tr

    weeklyIncome = 0;
    weeklySpending = 0;
    jsonData.forEach(j => {
        weeklyIncome += j.income;
        weeklySpending += j.spending;
    });

    tr.children[0].innerText = Number(weeklyIncome);
    tr.children[1].innerText = Number(weeklySpending);
    tr.children[2].innerText = Number(weeklyIncome - weeklySpending);
}

/* Button #########################################*/
/**
 * When click this button, saving in DataBase
 */
buttonAdd.addEventListener('click', () => {
    // block when input isn't correct
    if (inputItem.value === "" || inputIncome.value === "" || inputSpending.value === "") {
        console.log("input isn't correct");
        return;
    }
    console.log(inputItem.value + ' ' + inputIncome.value + ' ' + inputSpending.value);

    const sql = 'INSERT INTO account (user_num, date, item, income, spending) VALUES (?, ?, ?, ?, ?)';
    const values = [
        1,
        year + '-' + (month + 1) + '-' + date,
        inputItem.value,
        inputIncome.value,
        inputSpending.value
    ];
    const message = {
        sql: sql,
        values: values
    };

    flag = daily;
    console.dir(message);
    socket.send(JSON.stringify(message));

    inputItem.value = "";
    inputIncome.value = "";
    inputSpending.value = "";

    setAccountBookDaily(year, month, date);
});

/* Check ##########################################*/

/* Run  ###########################################*/