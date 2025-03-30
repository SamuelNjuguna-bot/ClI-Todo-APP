import {Command} from 'commander'


 const app = new Command()

 app.name("CLI Todo App")
 app.description(" The app implements a Todo List Application")
 app.version("1.0.0")


app.command("tst")
 .action(()=>{
    console.log("implenting testing")
 })

 app.parse()