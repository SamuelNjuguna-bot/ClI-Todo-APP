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
        head: ["Title", "Description"]
    }
  );
  table.push([Todo.tittle, Todo.description])
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
             head: ["id", "Tittle", "Description"]
         })
     
         readContent.forEach((todo)=>{
             table.push([todo.id, todo.TodoTittle, todo.TodoDescription])
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
.action(async(options)=>{
 const id = options.id
 const newTitle = options.title
 const newdescription = options.description
 try{
    const todoItem = await prisma.todos.update(
        {
            where:{id},
    
            data : {
                TodoTittle: newTitle && newTitle,
                TodoDescription: newdescription && newdescription
    
            }
        }
    
    )
    console.log(chalk.bgGreen("The update was a succesful one"))
    const table = new Table({
        
        head:['ID', "Title", "Description"]
     
        })
        table.push([todoItem.id, todoItem.TodoTittle, todoItem.TodoDescription])
        console.log(table.toString())
 }
 catch(e){
    console.log(chalk.bgRed("There was an error"))
 }



 })


app.parse()