const fs =  require('fs')
const path = './task.json'

// ensure the task.json exist
if(!fs.existsSync(path)){
   fs.writeFileSync(path, JSON.stringify([]))
}

// command line argument
const args = process.argv.slice(2) // skip node and script name
const command = args[0] // the first argument is the  command (add, update, delete, lis)

// function to read tasks form JSON file 
function readTasks() {
   if (fs.existsSync(path) && fs.statSync(path).size > 0) {
     const data = fs.readFileSync(path, 'utf8');
     return JSON.parse(data);
   }
   return []; // Return an empty array if the file is empty or doesn't exist
 }
 

// function to write tasks to json file
const writeTasks = (tasks) => {
   fs.writeFileSync(path, JSON.stringify(tasks, null, 2))
}

// function to add a new task to json file
const addTask = (description, priority = 'medium') => {
   const tasks = readTasks()
   const newTask = {
      id: tasks.length ? tasks[tasks.length -1].id + 1: 1, 
      description,
      priority, 
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
   }
   tasks.push(newTask)
   writeTasks(tasks)
   console.log(`Added task: ${description} with priority : ${priority}`)
}

// Handle 'add' command
if(command === 'add'){
   const description = args[1]
   const priority = args[2] || 'medium'
   if(!description) {
      console.log('Error: Task description is required. ')
   }else {
      addTask(description, priority)
   }
}

// function to update task status
const updateTask = (id, newStatus) => {
   const tasks = readTasks()
   const task = tasks.find(t => t.id === Number(id))
   if(!task) {
      console.log('Error: Task not found')
      return;
   }
   task.status = newStatus
   task.updateAt = new Date().toISOString()
   writeTasks(tasks)
   console.log(`Updated task ${id} to ${newStatus}`)
}


// hanndle 'update' command 
if(command === 'update'){
   const id = args[1]
   const status = args[2]
   if(!id || !status){
      console.log('Error: Task Id and new status are required')
   }else {
      updateTask(id, status)
   }
}


// listening task
const listTask = (status = null) => {
   const tasks = readTasks()
   const filteredTask = status ? tasks.filter(t => t.status === status) : tasks
   console.log(filteredTask)
}

// handle list command
if(command === 'list'){
   const status = args[1] // can be done , in progress , or todo
   listTask(status)
}


// function to delete task

const deleteTask = (id) => {
   const tasks = readTasks()
   const newTask = tasks.filter(t => t.id !== Number(id))

   if (newTask.length === tasks.length){
      console.log('Error; Task not found')
      return;
   }
   writeTasks(newTask)
   console.log(`Deleted task with ID: ${id}`)
}

// handle delete task
if(command === 'delete'){
   const id = args[1]
   if(!id) {
      console.log('Error: Task Id is required')
   }else{
      deleteTask(id)
   }
  
}

// function to sort task
const sortTasks = ( tasks, field = 'createdAt') => {
   return tasks.sort((a,b) => new Date(a[field]) - new Date(b[field]))
}

// handle sorting command
if(command === 'sorting'){
   const status = args[1]
   const tasks = listTask(status)
   const sortedTasks = sortTasks(tasks, 'createdAt')
   console.log(sortedTasks)
}

const displayHelp = () => {
   console.log(`
      Available commands:
        add <description> [priority]  - Add a new task (default priority is medium)
        update <id> <status>          - Update the status of a task
        delete <id>                   - Delete a task by ID
        list [status]                 - List tasks (optional filter by status)
        help                          - Display this help message
        `);
      }


// handle help command 
if(command === 'help'){
   displayHelp()
}



const searchTasks = (keyword) => {
    const tasks = readTasks()
    const foundTasks = tasks.filter(task => task.description.includes(keyword))
    console.log(foundTasks)
}


// handle search command
if(command === 'search'){
   const keyword = args[1]
   if(!keyword) {
      console.log('Error: Keyword is required for search')
   }else{
      searchTasks(keyword)
   }
}