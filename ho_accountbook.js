// Elements
const accountBook = document.getElementById('account-book');

const monthlyRecord = document.getElementById('monthly-record');
const weeklyRecord = document.getElementById('weekly-record');
const dailyRecord = document.getElementById('daily-record');

const accountTable = document.getElementById('daily-table');
const accountTable_body = document.getElementById('daily-body');
const itemSpendIncome = accountTable_body.childNodes[1];
const itemCell = itemSpendIncome.childNodes[1];

/**
 * when click this button, add table class "item-spend-income"
 * and save in DataBase
 */
const plusButton = dailyRecord.childNodes[7];
plusButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('plus');
});

/**
 * when click this button, delete table line,
 * and delete in DataBase
 */
const minusButton = [
    itemCell.childNodes[1],
];
minusButton[0].addEventListener('click', (e) => {
    e.preventDefault();
    console.log('minus');
});

/*check ###########################################*/
function checkElement() {
    console.dir(accountBook);

    console.dir(monthlyRecord);
    console.dir(weeklyRecord);
    console.dir(dailyRecord);

    console.dir(plusButton);
    console.dir(minusButton);
}
checkElement();
