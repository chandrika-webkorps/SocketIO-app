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
    console.log("On getting scores: ",scores);
    playerScores.push(scores)   
    socket.emit("playerScores",playerScores)
    })
    socket.on("editData",(editedScores)=>{
        console.log("edited scores are : ",editedScores);
        let editDataIndex=playerScores.findIndex((score)=>score.id===editedScores.id)
        console.log("editIndex: ",editDataIndex);
        
        if(editDataIndex!==-1){
            playerScores[editDataIndex]={...playerScores[editDataIndex],...editedScores}
        }
    })

    socket.on("deleteScore",(deletedScore)=>{
        console.log("Score to be deleted: ",deletedScore);
        let deleteScoreInd=playerScores.findIndex((score)=>score.id===deletedScore.id)
        console.log("deleteed item index: ",deleteScoreInd);
        if(deleteScoreInd!==-1){
            playerScores.splice(deleteScoreInd,1)
        }
        console.log("player Scores: ",playerScores);
        
    })
    setInterval(()=>{
        socket.emit("playerScores",playerScores)
    },1000)
    
})


httpServer.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
