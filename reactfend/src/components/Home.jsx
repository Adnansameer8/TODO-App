import axios from 'axios';
import React from 'react'
import { useState } from 'react'


const Home = ({addTaskManager}) => {
    const [task,setTask]=useState("");

    const API = import.meta.env.VITE_API_BASE_URL;

    const handlechange=(e)=>{
        setTask(e.target.value);
    }
    const handleSubmit= async(e)=>{
        e.preventDefault();

        try{
            const response = await axios.post("http://localhost:5000/submit",{
                text:task,
                completed:false,
            });

            addTaskManager(response.data);//it is commimg from manager
            setTask("");
        }catch(error){
          console.log( 
             "error submitting form :",
            error.response?.data||error.message
        )};
          
        
        
    }
  return (
    <div>
        <h2> Task Keeper</h2>
        <form onSubmit={handleSubmit}>
            
            <label htmlFor="task"> ENTER TASKS </label> 
            <input type="text" placeholder='Enter Your Tasks' value={task} required onChange={handlechange}  />
            <br />

            <button type='submit'>ADD TASK</button>
        </form>
    </div>
  )
}

export default Home
