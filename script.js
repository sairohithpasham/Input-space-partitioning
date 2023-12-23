
const charContainer = document.querySelector('[data-lists]')
const newCharForm = document.querySelector('[data-new-char-form]')
const newCharInput = document.querySelector('[data-new-char-input]')
const deleteCharbutton = document.querySelector('[data-delete-char-button]')
const blockDisplayContainer = document.querySelector('[data-char-display-container]')
const blockTitleElement = document.querySelector('[data-list-title]')
const blockCountElement = document.querySelector('[data-list-count]')
const blocksContainer = document.querySelector('[data-tasks]')
const blockTemplate = document.getElementById('task-template')
const newBlockForm = document.querySelector('[data-new-task-form]')
const newBlockInput = document.querySelector('[data-new-task-input]')
const clearblocks = document.querySelector('[data-delete-blocks]')
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

charContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
    document.getElementById("block-textfield").focus()
})

blocksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
    }
})

clearblocks.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

deleteCharbutton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

newCharForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newCharInput.value
    if (listName == null || listName === '') return
    const list = createChar(listName)
    newCharInput.value = null
    lists.push(list)
    saveAndRender()
})

newBlockForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newBlockInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newBlockInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createChar(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
    clearElement(charContainer)
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    if (selectedListId == null) {
        blockDisplayContainer.style.display = 'none'
    } else {
        blockDisplayContainer.style.display = ''
        blockTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(blocksContainer)
        renderTasks(selectedList)
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(blockTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        blocksContainer.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList) {
    const blocksCounts = selectedList.tasks.filter(task => !task.complete).length
    const taskString = blocksCounts === 1 ? "block" : "blocks"
    blockCountElement.innerText = `${blocksCounts} ${taskString} entered`

}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("char-name")
        listElement.innerText = list.name
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        charContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}


function allCombinations() {
    // var k = 0
    var numChars = lists.length
    var msg = ""
    numTests = 1
    var i
    for (i = 0; i < numChars; i++) {
        numTests = numTests * lists[i].tasks.length
        lists[i].k = 0;
    }
    for (i = 0; i < numTests; i++) {
        msg = msg + "Test #" + i + ": "
        for (var j = 0; j < numChars; j++) {
            msg = msg + lists[j].tasks[lists[j].k].name + " "
        }
        console.log(numChars)
        for (var x = numChars - 1; x > -1; x--) {
            console.log(x);
            if (lists[x].k == (lists[x].tasks.length) - 1) {
                lists[x].k = 0

            }
            else {
                lists[x].k++
                break
            }
        }
        msg = msg + "\n"
        // window.alert(k)
    }
    document.getElementById("show-result").innerText = msg
}

function eachChoice() {
    var mostBlocks = 0
    var msg = ""
    var numChars = lists.length
    for (var i = 0; i < numChars; i++) {
        if (lists[i].tasks.length > mostBlocks) {
            mostBlocks = lists[i].tasks.length
        }
    }
    for (var i = 0; i < mostBlocks; i++) {
        msg = msg + "Test #" + i + ": "

        for (var j = 0; j < numChars; j++) {
            if (i <= (lists[j].tasks.length) - 1) {
                msg = msg + lists[j].tasks[i].name + " "

            }
            else {
                msg = msg + "*" + " "
            }
        }
        msg = msg + "\n"
    }
    document.getElementById("show-result").innerText = msg
}

function baseChoice() {
    var numChars = lists.length
    var numTests = 0
    var msg = ""
    var base = []
    var other = []
    var counter = 1
    for (var i = 0; i < numChars; i++) {
        numTests = numTests + lists[i].tasks.length
    }
    numTests = numTests - (numChars - 1)
    msg = "Test #0: "
    for (var i = 0; i < numChars; i++) {
        for (var j = 0; j < lists[i].tasks.length; j++) {
            if (lists[i].tasks[j].complete == true) {
                base.push(lists[i].tasks[j].name)
                break
            }
        }
    }
    if (base.length != numChars) {
        window.alert("Please select one block from every characteristic.")
    }
    else {
        msg = msg + base + "\n"
        charNum = 0
        other = []
        for (var i = 0; i < numChars; i++) {
            other = base
            for (var j = 1; j < lists[i].tasks.length; j++) {
                msg = msg + "Test #" + counter + ": "
                counter++
                other[charNum] = lists[i].tasks[j].name
                msg = msg + other + "\n"
            }
            charNum++
        }
    }
    document.getElementById("show-result").innerText = msg
}

function clearRes() {
    document.getElementById("show-result").innerText = ""
}

function clearall() {
    document.getElementById("show-result").innerText = ""
    lists = []
    blockTitleElement.innerText = ""
    blockCountElement.innerText = ""
    selectedListId = null
    saveAndRender()
    
}


render()

