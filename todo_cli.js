import {Command} from 'commander'
import prompts from 'prompts'
import { PrismaClient } from '@prisma/client'
import { data } from 'react-router-dom'
import  {nanoid } from 'nanoid'
import Table from 'cli-table3'
import chalk from 'chalk'


 const app = new Command()
const prisma = new PrismaClient()
 app.name("CLI Todo App")
 app.description(" The app implements a Todo List Application")
 app.version("1.0.0")


app.command("create todo")
.description("This command creates a new todo list")

 .action(async()=>{
   const Todo = await prompts([
        {
            type:"text",
            name: "tittle",
            message: "Add a todo title"
        },

        {
            type:"text",
            name: "description",
            message: "Add a todo description"   
        }
    ]);
  await prisma.todos.create({
    data:{
        id : nanoid(5),
        TodoTittle:Todo.tittle, 
        TodoDescription:Todo.description
    }
   });
  const table = new Table(
    {
        head: ["Title", "Description", "status"]
    }
  );
  table.push([Todo.tittle, Todo.description, Todo.Status])
   console.log(chalk.bgGreen("succesfully inserted a todo list"))
   console.log(table.toString())
 })



app.command("read")
.description("This command reads the contents of todos")
.option("-i, --id <value>", "id of todo list")
.action(async(options)=>{
    const idno = options.id
  try{
    if(idno){
        const foundTodo = await prisma.todos.findFirst({
             where:{
                id:idno
             }
         })
        const table = new Table({
         
         head:['ID', "Title", "Description"]
 
         })
         table.push([foundTodo.id, foundTodo.TodoTittle, foundTodo.TodoDescription])
         console.log(table.toString())
     }
     else{
         const readContent = await prisma.todos.findMany();
         const table = new Table({
             head: ["id", "Tittle", "Description", "Status"]
         })
     
         readContent.forEach((todo)=>{
             table.push([todo.id, todo.TodoTittle, todo.TodoDescription, todo.Status])
         })
         console.log(table.toString())
     }
 
  } catch(e){
    console.log(chalk.bgRed("There was an error"))
  }

   
})



app.command("update")
.description("Updates a todo")
.requiredOption("-i, --id <value>","Id of the todo")
.option("-t, --title <value>", " The title of the todo")
.option("-d, --description <value>", "The description of the todo")
.option("-s, --status <value>", "This changes the status of a todo")
.action(async(options)=>{
 const id = options.id
 const newTitle = options.title
 const newdescription = options.description
 const status = options.status
 try{
    const todoItem = await prisma.todos.update(
        {
            where:{id},
    
            data : {
                TodoTittle: newTitle && newTitle,
                TodoDescription: newdescription && newdescription,
                Status: status&&status
    
            }
        }
    
    )
    console.log(chalk.bgGreen("The update was a succesful one"))
    const table = new Table({
        
        head:['ID', "Title", "Description", "status"]
     
        })
        table.push([todoItem.id, todoItem.TodoTittle, todoItem.TodoDescription, todoItem.Status])
        console.log(table.toString())
 }
 catch(e){
    console.log(chalk.bgRed("There was an error"))
 }



 })


 app.command("status")
 .description(" This command changes the status of a particular todo")
 .action(async()=>{
   const status = await prompts([{
    type:"text",
    name: "todoID",
    message: "Enter Your Todo Id"
   },
    {
        type:"select",
        name: "status",
        message:"please select the status of your todo",
        choices:[{
            title: "Complete",
            value: "Completed"
        },
        {
          title: "Pending",
          value: "pending"
        }]
    }])
    console.log(status.status, status.todoID)
    if(status.status==="Completed"){
        await prisma.todos.update(
            {
                where:{id: status.todoID},
                data:{
                    Status: "completed"
                }
            }
        )
    }
    else{
        await prisma.todos.update({
            where: {id: status.todoID},
            data: {
                Status: "Pending"
            }
        })
    }
 })

app.command("delete")
.description("This command deletes a specific or the entire todo")
.option("-i, --id <value>", "This is the id of todo you want to delete")
.action(async(options)=>{
    const id = options.id

try{
    if(id){
    await prisma.todos.delete({
        where: {id}
    })
}
else{
    console.log(chalk.bgRed("Caution !!! You are about to delete all the todos"))
    const choice = await prompts({
        type: "select",
        name: "choice",
        message: "please select to continue",
        choices:
               [
                {
                    title: 'Yes', value: 'yes'
        
                },
                {
                    title: 'No', value: 'No'
        
                }
               ]
        
    })

    if(choice.choice === 'yes'){
await prisma.todos.deleteMany()
console.log(chalk.green("succesfully deleted all todos"))
    }
 
}

}
catch(e){
    console.log(chalk.bgYellow("You have an error"))
}

})

app.parseAsync()