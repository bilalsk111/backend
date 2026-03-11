import app from './src/app.js'
import { createServer } from "http";
import { Server } from "socket.io";


const httpServer = createServer(app)
const io = new Server(httpServer,{})

io.on("connection",(socket)=>{

})



httpServer.listen(5000,()=>{
    console.log(`server running on port 5000`);
    
})