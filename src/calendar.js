// Elements
const calendar = document.getElementById('calendar');

const navBar = document.getElementById('nav-bar');
const navBottons = [
    document.getElementById('prev-month'),
    document.getElementById('this-month'),
    document.getElementById('this-year'),
    document.getElementById('next-month'),
];

const calendarTable = document.getElementById('calendar-table');
const calendarHead = document.getElementById('calendar-head');
const calendarBody = document.getElementById('calendar-body');
const calendarWeeks = [
    document.getElementById('1st'),
    document.getElementById('2nd'),
    document.getElementById('3rd'),
    document.getElementById('4th'),
    document.getElementById('5th'),
    document.getElementById('6th'),
];

// date var
const Today = new Date();               // Today
const todayYear = Today.getFullYear();
const todayMonth = Today.getMonth();

let todayCell = {                       // TodayCell
    cell: null,
    week: '',
    day: ''
};
const bgColor = '#A8C879';

let today;
let year, month, date, day;
let firstDate, lastDate;
let prevMonth, nextMonth;
const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",];

/* Default ########################################*/
/**
 * Default making of calendar
 */
function mkCalendar() {
    // 요일만큼 -로 시작해서 cnt++
    let dayCnt = -firstDate.getDay() + 1;

    for (let i = 0; i < 6; i++) {
        const cwi = calendarWeeks[i];
        for (let j = 0; j < 7; j++, dayCnt++) {
            // 각 날짜 칸 추가하고 날짜 기입
            cwi.appendChild(document.createElement('td'));

            // 각 cell에 element 추가 등 가능

            const cell = cwi.cells[j];
            cell.addEventListener('click', (e) => {

                // 달력에 날짜가 표시되지 않는 cell에 대해 반응 금지
                if (cell.innerText == '') return;

                setDate(new Date(year, month, cell.innerText));
                clearAccountBook();
                todayAccountBook(month, cwi.id, date);
            });
        }
    }
}

/**
 * 오늘 날짜 셀 색칠 함수
 * @param {*} color
 */
const findToday = (color) => todayCell.cell.style.backgroundColor = color;

/**
 * month, year selectable option add
 */
function mkOptions() {
    // month
    for (let i = 0; i < 12; i++) {
        const monthOption = document.createElement('option');
        monthOption.innerText = monthList[i];
        monthOption.value = monthList[i];
        navBottons[1].appendChild(monthOption);
    }

    // year
    for (let i = year + 5; i >= year - 5; i--) {
        const yearOption = document.createElement('option');
        yearOption.innerText = i;
        yearOption.value = i;
        navBottons[2].appendChild(yearOption);
    }

    setSelectIndex();
}

/* Set ############################################*/
/**
 * Setting of Date
 * @param {*} d : date
 */
function setDate(d) {
    today = new Date(d);

    year = today.getFullYear();     // 년도
    month = today.getMonth();       // 월   : 0부터
    date = today.getDate();         // 날짜
    day = today.getDay();           // 요일 : 0부터

    firstDate = new Date(year, month, 1);
    lastDate = new Date(year, month + 1, 0);

    prevMonth = new Date(year, month - 1, 1);
    nextMonth = new Date(year, month + 1, 1);

    setSelectIndex();
}

/**
 * when option(month, year) is selected, this func changes selection box mark
 */
function setSelectIndex() {
    navBottons[1].selectedIndex = month;
    navBottons[2].selectedIndex = findYearIndex(year);
}

/**
 * 바뀐 년도에 대한 selection box 인덱스 반환
 * @param {*} value : year
 * @returns : year index
 */
const findYearIndex = (value) => todayYear - value + 5;

/**
 * Setting of dates in Calendar
 */
function setCalendar() {
    // 요일만큼 -로 시작해서 cnt++
    let dayCnt = -firstDate.getDay() + 1;

    for (let i = 0; i < 6; i++) {
        const cwi = calendarWeeks[i];
        for (let j = 0; j < 7; j++, dayCnt++) {
            const cell = cwi.cells[j];

            // init
            cell.innerText = '';

            // 1 ~ 달의 마지막 날 까지만 입력
            if (dayCnt > 0 && dayCnt <= lastDate.getDate())
                cell.innerText = dayCnt;

            // 오늘 날짜 셀 저장
            if (Today.getDate() == dayCnt &&
                todayMonth === month &&
                todayYear === year) {
                todayCell.cell = cell;
                todayCell.week = i;
                todayCell.day = j;
            }
        }
    }
}

/**
 * Make today cell's bg Green   
 */
function setTodayBg() {
    if (todayMonth === month && todayYear === year)
        findToday(bgColor);
    else
        findToday('white');
}

/* Button #########################################*/
/**
 * Move to previous month
 */
navBottons[0].addEventListener('click', (e) => {
    setDate(prevMonth);
    setCalendar();
    setTodayBg();
    clearAccountBook()
});

/**
 * Move to next month
 */
navBottons[3].addEventListener('click', (e) => {
    setDate(nextMonth);
    setCalendar();
    setTodayBg();
    clearAccountBook()
});

/**
 * Move to selected month
 */
navBottons[1].addEventListener('change', (e) => {
    e.preventDefault();

    setDate(new Date(year, navBottons[1].selectedIndex, date, day));
    setCalendar();
    setTodayBg();
    clearAccountBook()
});

/**
 * Move to selected year
 */
navBottons[2].addEventListener('change', (e) => {
    e.preventDefault();

    setDate(new Date(findYearIndex(navBottons[2].selectedIndex), month, date, day));
    setCalendar();
    setTodayBg();
    clearAccountBook()
});

/* check ##########################################*/

/* run ############################################*/
setDate(new Date());
mkOptions();
mkCalendar();
setCalendar();
findToday(bgColor);