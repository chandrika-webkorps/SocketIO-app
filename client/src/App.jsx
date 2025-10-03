import { Fragment } from 'react';
import { useEffect,useState } from 'react'
import io from 'socket.io-client'
import Input from './components/Input';
import {v4 as uuidv4} from "uuid"

function App() {
  const [scores,setScores]=useState({})
  const [allScores, setAllScores]=useState([])
  const [isEdit,setIsEdit]=useState(false)
  const socket=io("http://localhost:3000")

  const connectSocket=()=>{
   socket.on("connection",(socket)=>{
    console.log("connected:",socket);
   })
  }
  useEffect(()=>{
   connectSocket()
   
  },[])

  const handleInput=(event)=>{
    let {name,value}=event.target
    let currentObj={[name]:value}
    setScores((prev)=> ({...prev,...currentObj}))
  }

  const sendScores=()=>{
    socket.emit("scores",{...scores,id:uuidv4()})
    console.log("scores: ",scores);
   socket.on("playerScores",(playerScores)=>{
   setAllScores(playerScores);
   })
   setScores({
    name:"",
    score:""
   })
  }

  useEffect(()=>{
    socket.on("playerScores",(playerScores)=>{
   setAllScores(playerScores);
   })
  },[])

  const getEditData=(data)=>{
    console.log("to edit: ",data);
   setScores({
    id:data.id,
    name:data.name,
    score:data.score
   })
   setIsEdit(true)
   
  }
 const handleEdit=()=>{
   console.log("Edited Scores:",scores);
   socket.emit("editData",scores)
   setScores({
    name:"",
    score:""
   })
  }

  const handleDeleteData=(deleteScore)=>{
    console.log("to delete: ",deleteScore);
    socket.emit("deleteScore",deleteScore)
  }
  return(
    <Fragment>
      <h1 className='text-black'>React Multiplayer Dashboard</h1>
      <Input name="name" placeholder="Enter your name.." type="text" handleInput={handleInput}  value={scores.name||""}/>
      <Input name="score" placeholder="Enter your score.."  type="number" handleInput={handleInput} value={scores.score||""}/>
      <button onClick={isEdit?handleEdit:sendScores} className='bg-black text-white p-2 rounded-lg m-2'>{isEdit?"Edit Score":"Publish Scores"}</button>
    {allScores.length>0?<table className="table-auto border-collapse border border-gray-400">
     <tbody>
     <tr>
      <th className='border border-gray-400 px-4 py-2'>Name</th>
      <th className='border border-gray-400 px-4 py-2'>Scores</th>
     </tr>
     {allScores.map((score,index)=>(
      <tr key={index}>
        <td className='border border-gray-400 px-4 py-2'>{score?.name}</td>
        <td className='border border-gray-400 px-4 py-2'>{score?.score}</td>
        <td className='border border-gray-400 px-4 py-2'>
          <button className='bg-black text-white p-1 rounded-lg' 
          onClick={()=>getEditData(score)}>Edit</button>
        </td>
        <td className='border border-gray-400 px-4 py-2'>
          <button className='bg-black text-white p-1 rounded-lg'
          onClick={()=>handleDeleteData(score)}>Delete</button>
        </td>
      </tr>
     ))}
     </tbody>
    </table>:<></>}
    </Fragment>

  )
}

export default App
