// Elements
const accountBook = document.getElementById('account-book');

const monthlyRecord = document.getElementById('monthly-record');
const monthlyTable = document.getElementById('monthly-table');

const weeklyRecord = document.getElementById('weekly-record');
const weeklyTable = document.getElementById('weekly-table');

const dailyRecord = document.getElementById('daily-record');
const dailyTable = document.getElementById('daily-table');
const dailyTableBody = document.getElementById('daily-body');

const buttonAdd = document.getElementById('add');
const inputItem = document.getElementById('item');
const inputIncome = document.getElementById('income');
const inputSpending = document.getElementById('spending');

/**
 * connect with server
 * get data from server connecting my_db
 */
const socket = new WebSocket('ws://localhost:8090', 'tcp');

socket.onopen = () => {
    console.log('socket.onopen');
};
socket.onmessage = (event) => {
    console.log('socket.onmessage');

    let jsonData = JSON.parse(event.data);
    // console.log(jsonData);

    jsonData.forEach(j => {
        // const utcTimestamp = j.date;
        // const dateUtc = new Date(utcTimestamp);
        // const options = { timeZone: "Asia/Seoul" };
        // const koreanTime = dateUtc.toLocaleString("en-US", options);
        // console.log(koreanTime);

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
                    break;
                case 3:
                    child.className = 'spending';
                    child.innerText = spending;
                    break;
            }

            console.dir(child);
            saveNdelete.appendChild(child);
        }
        dailyTableBody.insertAdjacentElement('afterbegin', saveNdelete);

        // console.dir(saveNdelete);
        // console.dir(dailyTableBody);

        // console.log(item);
        // console.log(income);
        // console.log(spending);
    });
};
socket.onclose = () => {
    console.log('socket.onclose');
};
socket.onerror = (event) => {
    console.log('socket.error');
    console.log(event);
};

/* Default ########################################*/
function todayAccountBook() {

}

/* Set ############################################*/
const setRecordDate = date => dailyRecord.children[0].innerText = `${date}`;

function clearAccountBook() {
    let alreadyAccount = document.querySelector('#daily-body');
    Array.from(alreadyAccount.children).forEach(child => {
        console.log(child);
        if (child.className == 'show item-income-spend')
            alreadyAccount.removeChild(child);
    });
}

function setAccountBook(year, month, date) {
    const sql = 'SELECT * FROM account where date = ?';
    const values = [year + '-' + (month + 1) + '-' + date];
    const message = {
        sql: sql,
        values: values
    };

    console.dir(message);
    socket.send(JSON.stringify(message));
}

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

    console.dir(message);
    socket.send(JSON.stringify(message));
}

/* Button #########################################*/
/**
 * when click this button, saving in DataBase
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

    console.dir(message);
    socket.send(JSON.stringify(message));

    inputItem.value = "";
    inputIncome.value = "";
    inputSpending.value = "";

    setAccountBook(year, month, date);
});


/*check ###########################################*/
function checkElement() {

}
// checkElement();

function checkToday() {
    console.log(today);
}
// checkToday();

/*#################################################*/