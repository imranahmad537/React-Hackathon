import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  Paper,
  TextField,
  List,
  ListItem,
  IconButton as MuiIconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ListIcon from "@mui/icons-material/List";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AlarmIcon from "@mui/icons-material/Alarm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const initialTasks = {
  todo: [],
  inProgress: [],
  completed: [],
};

const TaskManagementSystem = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskInput, setTaskInput] = useState("");
  const [selectedSection, setSelectedSection] = useState("todo");
  const [editTask, setEditTask] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const navigate = useNavigate("");
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Logout

  const logout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.log("not signed in", error.message);
    }
  };
  const handleAddOrUpdateTask = () => {
    if (taskInput) {
      if (editTask) {
        const updatedTasks = tasks[editTask.section].map((task) =>
          task.id === editTask.id ? { ...task, content: taskInput } : task
        );
        setTasks((prev) => ({
          ...prev,
          [editTask.section]: updatedTasks,
        }));
        updateHistory(editTask.id, "Updated");
        setEditTask(null);
      } else {
        const newTask = {
          id: `${Date.now()}`,
          content: taskInput,
          deadline: null,
        };
        setTasks((prev) => ({
          ...prev,
          [selectedSection]: [...prev[selectedSection], newTask],
        }));
        updateHistory(newTask.id, "Added");
      }
      setTaskInput("");
    }
  };

  const handleEditTask = (section, task) => {
    setTaskInput(task.content);
    setEditTask({ ...task, section });
  };

  const handleDeleteTask = (section, taskId) => {
    const updatedTasks = tasks[section].filter((task) => task.id !== taskId);
    setTasks((prev) => ({
      ...prev,
      [section]: updatedTasks,
    }));
    updateHistory(taskId, "Deleted");
  };

  const handleSetDeadline = (taskId, deadline) => {
    const updatedTasks = tasks["todo"].map((task) =>
      task.id === taskId ? { ...task, deadline } : task
    );
    setTasks((prev) => ({
      ...prev,
      todo: updatedTasks,
    }));
    updateHistory(taskId, `Deadline set to ${deadline}`);
  };

  const updateHistory = (taskId, action) => {
    const timestamp = new Date().toLocaleString();
    setHistory((prev) => [...prev, { taskId, action, timestamp }]);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceSection = source.droppableId;
    const destinationSection = destination.droppableId;

    const sourceTasks = Array.from(tasks[sourceSection]);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const destinationTasks = Array.from(tasks[destinationSection]);
    destinationTasks.splice(destination.index, 0, movedTask);

    setTasks((prev) => ({
      ...prev,
      [sourceSection]: sourceTasks,
      [destinationSection]: destinationTasks,
    }));
    updateHistory(movedTask.id, `Moved to ${destinationSection}`);
  };

  const renderTasks = (section) => (
    <Droppable droppableId={section}>
      {(provided) => (
        <List
          {...provided.droppableProps}
          ref={provided.innerRef}
          sx={{
            minHeight: "200px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            p: 1,
            mb: 1,
            overflow: "auto",
          }}
        >
          {tasks[section].map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided, snapshot) => (
                <ListItem
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  sx={{
                    mb: 0.5,
                    backgroundColor: snapshot.isDragging ? "#e0e0e0" : "#fff",
                    borderRadius: "4px",
                    boxShadow: snapshot.isDragging
                      ? "0 4px 8px rgba(0,0,0,0.2)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                    p: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {task.content}
                    {task.deadline && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        <AlarmIcon fontSize="small" />{" "}
                        {Math.max(
                          0,
                          Math.floor(
                            (new Date(task.deadline) - currentTime) / 1000
                          )
                        )}
                        s
                      </Typography>
                    )}
                  </Typography>
                  <Box>
                    {section === "todo" && (
                      <>
                        <MuiIconButton
                          color="primary"
                          onClick={() => handleEditTask(section, task)}
                        >
                          <EditIcon fontSize="small" />
                        </MuiIconButton>
                        <MuiIconButton
                          color="error"
                          onClick={() => handleDeleteTask(section, task.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </MuiIconButton>
                      </>
                    )}
                    {section === "todo" && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          handleSetDeadline(
                            task.id,
                            prompt("Enter deadline (yyyy-mm-ddThh:mm:ss)")
                          )
                        }
                      >
                        Set Deadline
                      </Button>
                    )}
                  </Box>
                </ListItem>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  );

  return (
    <>
      {/* <Box
      sx={{
        p: 2, // Padding around the container
        display: 'flex', // Flexbox layout
        flexDirection: 'column', // Arrange items in a column
        height: '100vh', // Full viewport height
        overflow: 'hidden', // Prevent scrollbars
        background: 'linear-gradient(, #0000ff, #ffffff)', // Gradient background from blue to light white
      }}
    > */}

      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Management System
          </Typography>
        
            <Button
              onClick={logout}
              color="inherit"
              startIcon={<LogoutIcon />}
              sx={{
                minWidth: 120,
                height: 40,
                display: "flex",
                alignItems: "center",
              }}
            >
              Logout
            </Button>
        </Toolbar>
      </AppBar>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            p: 2,
            margin:'0 100px',
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Task Input Section */}

          {/* <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: "#f7f7f7",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {editTask ? "Edit Task" : "Add a New Task"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Enter task description"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "40px", // Set height for the input
                    padding: "0 14px", // Adjust padding for consistency
                  },
                }}
              />
              <TextField
                select
                SelectProps={{ native: true }}
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                sx={{
                  width: "150px",
                  "& .MuiInputBase-root": {
                    height: "40px", // Set height for the select input
                    padding: "0 14px", // Adjust padding for consistency
                  },
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  },
                }}
                label="Section"
                disabled={!!editTask}
              >
                <option value="todo">ToDo</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </TextField>
              <Button
                variant="contained"
                color={editTask ? "warning" : "primary"}
                onClick={handleAddOrUpdateTask}
                sx={{
                  height: "40px", // Match height with the input
                  minWidth: "120px",
                }}
              >
                {editTask ? "Update" : "Add Task"}
              </Button>
            </Box>
          </Paper> */}
           {/* Task Input Section */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
           backgroundColor: '#f7f7f7',
          // backgroundColor: '#1976d2',
          // borderColor:'#1976d2',
          
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editTask ? 'Edit Task' : 'Add a New Task'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Enter task description"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                height: '40px', // Set height for the input
                padding: '0 14px', // Adjust padding for consistency
              },
            }}
          />
          <TextField
            select
            SelectProps={{ native: true }}
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            sx={{
              width: '150px',
              '& .MuiInputBase-root': {
                height: '40px', // Set height for the select input
                padding: '0 14px', // Adjust padding for consistency
              },
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
              },
            }}
            label="Section"
            disabled={!!editTask}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </TextField>
          <Button
            variant="contained"
            color={editTask ? 'warning' : 'primary'}
            onClick={handleAddOrUpdateTask}
            sx={{
              height: '40px', // Match height with the input
              minWidth: '120px',
            }}
          >
            {editTask ? 'Update' : 'Add Task'}
          </Button>
        </Box>
      </Paper>


          {/* Task Sections */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                 backgroundColor: "#fafafa",
                // backgroundColor: '#1976d2',
                borderRadius: "8px",
                mb: 2,
                flexGrow: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                <Box display="flex" alignItems="center">
                  <ListIcon fontSize="large" sx={{ mr: 1 }} />
                  To Do
                </Box>
              </Typography>
              {renderTasks("todo")}
            </Paper>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                  flex: 1,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  <Box display="flex" alignItems="center">
                    <BuildIcon
                      fontSize="large"
                      sx={{ mr: 1, color: "#ff9800" }}
                    />
                    In Progress
                  </Box>
                </Typography>
                {renderTasks("inProgress")}
              </Paper>

              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                  flex: 1,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon
                      fontSize="large"
                      sx={{ mr: 1, color: "#4caf50" }}
                    />
                    Completed
                  </Box>
                </Typography>
                {renderTasks("completed")}
              </Paper>
            </Box>
          </Box>

          {/* Task History */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mt: 2,
              backgroundColor: "#f7f7f7",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Task History
            </Typography>
            <List sx={{ maxHeight: "200px", overflowY: "auto" }}>
              {history.map((entry, index) => (
                <ListItem key={index}>
                  <Typography variant="body2">
                    Task ID: {entry.taskId} - {entry.action} at{" "}
                    {entry.timestamp}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </DragDropContext>
    </>
  );
};

export default TaskManagementSystem;
