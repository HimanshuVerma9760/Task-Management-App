import { useState } from "react";
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import ShowTask from "./components/ShowTask";

export default function App() {
  const [list, setList] = useState([]);

  function handleList(todo) {
    setList((prevTodo) => [todo, ...prevTodo]);
  }

  function DeleteHandler(taskName) {
    setList((prevList) => prevList.filter((todoList) => todoList.task !== taskName));
  }

  function updateList(taskId, updatedTaskData) {
    setList((prevList) => 
      prevList.map((task) => 
        task.task === taskId ? { ...task, ...updatedTaskData } : task
      )
    );
  }

  return (
    <>
      <Header />
      <InputBox handleList={handleList} />
      {list.length > 0 ? (
        <ShowTask list={list} DeleteHandler={DeleteHandler} updateList={updateList} />
      ) : (
        <h2 style={{ textAlign: "center" }}>No Tasks</h2> 
      )}
    </>
  );
}
