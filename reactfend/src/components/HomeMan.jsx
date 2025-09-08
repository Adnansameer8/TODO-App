import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import Home from './Home'
import HomeOut from './HomeOut'

import axios from 'axios'

const HomeMan = () => {
    const [tasks, setTasks] = useState([]);

    console.log("Current tasks in TaskManager:", tasks);
    console.log(" Type of tasks:", typeof tasks);
    console.log(" Is array?", Array.isArray(tasks));

    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/tasks");

            const tasksData = Array.isArray(response.data)
                ? response.data
                : JSON.parse(response.data);

            setTasks(tasksData);
        } catch (error) {
            console.error("error fetching tasks:", error.message);
            setTasks([]);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onAddTask = (task) => {
        console.log("ADD TASK RECEIVED:", task);
        if (!task || !task.text || !task.text.trim()) return;
        setTasks((prev) => [...prev, task]);
    };

    const handleToggle = async (id) => {
        try {
            const response = await axios.patch(
                `http://localhost:5000/tasks/${id}/toggle`
            );
            setTasks((prev) =>
                prev.map((task) => (task._id === id ? response.data : task))
            );
        } catch (error) {
            console.error("error toggling task:", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTasks((prev) => prev.filter((task) => task._id !== id));
        } catch (error) {
            console.error("error deleting task:", error.message);
        }
    };


    return (
        <div>
            <Home addTaskManager={onAddTask} />
            <HomeOut
                tasks={tasks}
                onToggle={handleToggle}
                onDelete={handleDelete} />
        </div>
    )
}

export default HomeMan
