let start = document.querySelector("#start");
let stoper = document.querySelector("#stop");
let reset = document.querySelector("#reset");
let time = document.getElementById("time");
let setting = document.querySelector('.set');
let changeSettings = document.querySelector('.change-settings');
let focusTime = document.getElementById('focusTime');
let shortBreak = document.getElementById('shortBreak');
let longBreak = document.getElementById('longBreak');
let longBreakIntervals = document.getElementById('longBreakIntervals');
let xmark = document.querySelector('.fa-xmark');
let addTask = document.querySelector('.t-add');
let save = document.getElementById('save');
let cancel = document.getElementById('cancel');
let pomodoroBtn = document.querySelector('.pomodoro');
let shortBreakBtn = document.querySelector('.shortBreak');
let longBreakBtn = document.querySelector('.longBreak');
let pomodoroAbout = document.querySelector('.pomo');

let minute, second;
let identifier;
let flag = 0, per = 0, inp = 1, bfr;

let data = JSON.parse(localStorage.getItem('data'));
if(data) {
    data.forEach((info) => {
        addNewTask();
        saveNewTask(info.text, info.done);
    });
    updateLocalStorage();
}

pomodoroAbout.addEventListener('click', displayInfo);
start.addEventListener("click", countStart);
stoper.addEventListener("click", countStop);
reset.addEventListener("click", countReset);
setting.addEventListener('click', openSettings);
addTask.addEventListener('click', addNewTask); 
document.body.addEventListener('click', (e) => {
    if(e.target.id === 'save')
        saveNewTask();
    if(e.target.classList.contains('fa-check'))
        finishTask(e.target.id);
    if(e.target.classList.contains('fa-rotate-right'))
        tryAgain(e.target.id);
    if(e.target.classList.contains('fa-trash-can'))
        deleteTask(e.target.id);
    if(e.target.id === 'newEmoji' || e.target.id === 'cancel')
        cancelTask();
});

pomodoroBtn.addEventListener('click', activatePomodoro);
shortBreakBtn.addEventListener('click', activateShortBreak);
longBreakBtn.addEventListener('click', activateLongBreak);

document.addEventListener('mouseup', function closeSettings(e) {
    if(!changeSettings.classList.contains('active') && (!changeSettings.contains(e.target) || xmark.contains(e.target))) {
        changeSettings.classList.add('active');
        document.querySelector('.container').classList.remove('active');
    }
});

function displayInfo() {
    if(document.querySelector('.footer-container').classList.contains('active'))
    document.querySelector('.footer-container').classList.remove('active');
}

function countStart() {
    if(flag === 0)
      identifier = setInterval(() => interval(), 1000);
    flag++;
}

function countStop() {
    clearInterval(identifier)
    flag = 0;
}

function countReset() {
    clearInterval(identifier)
    if(ch % 2 == 0)
        updateFocus();
    else {
        (per === Number(longBreakIntervals.value)) ? updateLong() : updateShort();
    }
    flag = 0;
}

let ch = 0;

function interval() {
    second = Number(second);
    minute = Number(minute);
    if(second === 0) {
        second = 60;
        if(minute === 0) {
            if(ch % 2 === 1) {
                ch = 0;
                if(per === Number(longBreakIntervals.value)) {
                    per = 0;
                    updateInterval() 
                } 
                else
                    per;
                activatePomodoro();
            }
            else {
                per++;
                updateInterval();
                if(per === Number(longBreakIntervals.value))
                    activateLongBreak();
                else
                    activateShortBreak();
                ch++;
            }
            countStop();
            return;
        }
        minute--;
    }
    second--;
    formatTime(second, minute);
}

function formatTime(second, minute) {
    second = (second < 10) ? "0" + second : second;
    minute = (minute < 10) ? "0" + minute : minute;
    time.innerText = `${minute}:${second}`;
}

function openSettings() {
    changeSettings.classList.remove('active');
    document.querySelector('.container').classList.add('active');
}

function updateFocus() {
    let newFocusTime = focusTime.options[focusTime.selectedIndex].value;
    if(pomodoroBtn.classList.contains('active')) {
        minute = newFocusTime;
        second = 0;
        formatTime(second, minute);
    }
}

function updateShort() {
    let newShortBreak = shortBreak.options[shortBreak.selectedIndex].value;
    if(shortBreakBtn.classList.contains('active')) {
        minute = newShortBreak;
        second = 0;
        formatTime(second, minute);
    }
}

function updateLong() {
    let newLongBreak = longBreak.options[longBreak.selectedIndex].value;
    if(longBreakBtn.classList.contains('active')) {
        minute = newLongBreak;
        second = 0;
        formatTime(second, minute);
    }
}

function updateInterval() {
    let newLongBreakIntervals = longBreakIntervals.options[longBreakIntervals.selectedIndex].value;
    document.querySelector('.steps').innerText = `Step: ${per}/${newLongBreakIntervals}`;

}

function updateCharacterNumbers(e) {
    let num = e.target.value.length;
    document.querySelector('.char-numbers').style.color = (num === 50) ? 'red' : 'grey';
    document.querySelector('.char-numbers').innerHTML = `Number of ${num < 2 ? 'character' : 'characters'} ${num}/50`    
}

function addNewTask() {
    addTask.classList.add('active');
    createNewTask();
}

function saveNewTask(text, done) {
    let newTask;
    if(document.getElementById(`newInput${inp - 1}`).value.length !== 0 || text) {
        newTask = document.createElement('div');
        newTask.classList.add('new-task-text');
        newTask.id = `newTask${inp - 1}`;
        if(text)
            newTask.innerText = text;
        else {
            newTask.innerText = document.getElementById(`newInput${inp - 1}`).value;
        }
        document.querySelector('.new-task-header').remove();
        document.querySelector('.new-task-footer').remove();
        document.querySelector('.new-task-icons').style.display = 'flex';    
        document.querySelector('.new-task').firstChild.before(newTask);
        document.querySelector('.tasks').firstChild.before(addTask);
        addTask.classList.remove('active');
        document.getElementById(`newDiv${inp - 1}`).classList.add('active');
        if(!done) {
            console.log('entru');
            updateLocalStorage();
        }
        if(done === 0) {
            finishTask(`newCheck${inp - 1}`);
        }   
    }
}

function createNewTask() {
    let newTaskDiv = document.createElement('div');
    let newTaskHeaderDiv = document.createElement('div');
    let newTaskHeaderXEmoji = document.createElement('i');
    let inputDiv = document.createElement('input');
    let newTaskFooterDiv = document.createElement('div');
    let newTaskFooterChars = document.createElement('div');
    let newTaskFooterButtons = document.createElement('div');
    let newTaskFooterCancel = document.createElement('button');
    let newTaskFooterSave = document.createElement('button');
    let newTaskIcons = document.createElement('div');
    let newTaskTrash = document.createElement('i');
    let newTaskCheck = document.createElement('i');
    let newTaskTrashCont = document.createElement('div');
    let newTaskCheckCont = document.createElement('div');
    newTaskDiv.classList.add('new-task');
    newTaskHeaderDiv.classList.add('new-task-header');
    newTaskHeaderXEmoji.classList.add('fa-sharp');
    newTaskHeaderXEmoji.classList.add('fa-solid');
    newTaskHeaderXEmoji.classList.add('fa-xmark');
    newTaskFooterDiv.classList.add('new-task-footer');
    newTaskDiv.id = `newDiv${inp}`;
    newTaskCheck.id = `newCheck${inp}`;
    newTaskTrash.id = `newTrash${inp}`;
    inputDiv.id = `newInput${inp}`;
    inputDiv.type = 'text';
    newTaskHeaderXEmoji.id = 'newEmoji';
    inputDiv.placeholder = 'Add your new task';
    inputDiv.onkeyup = (e) => updateCharacterNumbers(e);
    inputDiv.maxLength = 50;
    inputDiv.autofocus = true;
    inputDiv.autocomplete = 'off';
    newTaskHeaderDiv.appendChild(inputDiv);
    newTaskHeaderDiv.appendChild(newTaskHeaderXEmoji);
    newTaskDiv.appendChild(newTaskHeaderDiv);
    newTaskFooterChars.innerText = 'Number of character 0/50';
    newTaskFooterChars.classList.add('char-numbers');
    newTaskFooterCancel.id = 'cancel';
    newTaskFooterCancel.innerText = 'Cancel';
    newTaskFooterSave.id = 'save';
    newTaskFooterSave.innerText = 'Save';
    newTaskTrash.classList.add('fa-solid');
    newTaskTrash.classList.add('fa-trash-can');
    newTaskTrash.classList.add('fa-lg');
    newTaskCheck.classList.add('fa-solid');
    newTaskCheck.classList.add('fa-check');
    newTaskCheck.classList.add('fa-lg');
    newTaskCheckCont.classList.add('check-container');
    newTaskTrashCont.classList.add('trash-container');
    newTaskCheckCont.id = `check-container${inp}`;
    newTaskIcons.classList.add('new-task-icons');
    newTaskIcons.style.display = 'none';
    newTaskFooterButtons.appendChild(newTaskFooterCancel);
    newTaskFooterButtons.appendChild(newTaskFooterSave);
    newTaskFooterDiv.appendChild(newTaskFooterChars);
    newTaskFooterDiv.appendChild(newTaskFooterButtons);
    newTaskDiv.appendChild(newTaskFooterDiv);
    newTaskCheckCont.appendChild(newTaskCheck);
    newTaskTrashCont.appendChild(newTaskTrash);
    newTaskIcons.appendChild(newTaskCheckCont);
    newTaskIcons.appendChild(newTaskTrashCont);
    newTaskDiv.appendChild(newTaskIcons);
    document.querySelector('.t-add').after(newTaskDiv);
    inp++;
}

function finishTask(id) {
    let newIcon;
    let divId = id.split('newCheck')[1];
    document.getElementById(`newTask${divId}`).classList.add('active');
    document.getElementById(`newCheck${divId}`).style.display = 'none';
    if(document.getElementById(`newRotate${divId}`))
        document.getElementById(`newRotate${divId}`).style.display = 'block';
    else {
        newIcon = document.createElement('i');
        newIcon.classList.add('fa-solid');
        newIcon.classList.add('fa-rotate-right');
        newIcon.id = `newRotate${divId}`;
        document.getElementById(`check-container${divId}`).appendChild(newIcon);
    }
    updateLocalStorage();
}

function tryAgain(id) {
    let divId = id.split('newRotate')[1];
    document.getElementById(`newRotate${divId}`).style.display = 'none';
    document.getElementById(`newTask${divId}`).classList.remove('active');
    document.getElementById(`newCheck${divId}`).style.display = 'block';
    updateLocalStorage();
}

function deleteTask(id) {
    let divId = id.split('newTrash')[1];
    document.getElementById(`newDiv${divId}`).remove();
    updateLocalStorage();
}

function cancelTask() {
    document.getElementById(`newDiv${inp - 1}`).remove();
    addTask.classList.remove('active');
}

function activatePomodoro() {
    if(!pomodoroBtn.classList.contains('active')) {
        if(bfr !== undefined)
            bfr.classList.remove('active')
        pomodoroBtn.classList.add('active');
        bfr = pomodoroBtn;
        updateFocus();
    }
}

function activateShortBreak() {
    if(per == 0)
        alert('Before break you should work on');
    else    
    if(!shortBreakBtn.classList.contains('active')) {
        bfr.classList.remove('active');
        shortBreakBtn.classList.add('active');
        bfr = shortBreakBtn;
        updateShort();
    }
}

function activateLongBreak() {
    if(per == 0)
        alert('Before break you should work on');
    else
    if(!longBreakBtn.classList.contains('active')) {
        bfr.classList.remove('active');
        longBreakBtn.classList.add('active');
        bfr = longBreakBtn;
        updateLong();
    }
}

function updateLocalStorage() {
    const tasksSave = document.querySelectorAll('.new-task.active');
    data = [];

    console.log(tasksSave);
    tasksSave.forEach((taskSave) => {
        let divId = taskSave.id.split('newDiv')[1];
        data.push(
            {
                text: document.getElementById(`newTask${divId}`).innerText,
                done: (document.getElementById(`newCheck${divId}`).style.display === 'none') ? 0 : 1,
            }
        );
    })

    console.log(data);
    data.reverse();
    localStorage.setItem('data', JSON.stringify(data));    
}

activatePomodoro();
updateInterval();