import {createServer} from 'http'
import {Server} from 'socket.io'
const httpServer=createServer();
const io=new Server(httpServer,{
    cors:{
        origin: 'http://localhost:5173'
    }
})
let playerScores=[]

io.on('connection',(socket)=>{
    socket.on("scores",(scores)=>{ 

    playerScores.push(scores)   
    socket.emit("playerScores",playerScores)
    })
    socket.on("editData",(editedScores)=>{
       
        let editDataIndex=playerScores.findIndex((score)=>score.id===editedScores.id)
        if(editDataIndex!==-1){
            playerScores[editDataIndex]={...playerScores[editDataIndex],...editedScores}
        }
    })

    socket.on("deleteScore",(deletedScore)=>{
        let deleteScoreInd=playerScores.findIndex((score)=>score.id===deletedScore.id)
        if(deleteScoreInd!==-1){
            playerScores.splice(deleteScoreInd,1)
        }
    })
    setInterval(()=>{
        socket.emit("playerScores",playerScores)
    },1000)
    
})


httpServer.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
