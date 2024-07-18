import { useEffect, useState } from "react";
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import ShowTask from "./components/ShowTask";

export default function App() {
  const [list, setList] = useState([]);
  const [trigger, setTrigger] = useState(true);
  const [dataSent, setDataSent] = useState(false);

  useEffect(() => {
    if (list.length != 0 && dataSent) {
      try {
        fetch("http://localhost:3002/add-task", {
          body: JSON.stringify(list),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        })
          .then((response) => {
            if (!response.ok) {
              console.log("Error: while connecting to database..!!!");
            } else {
              console.log("Successfuly Connected..!!!!");
            }
          })
          .catch((err) => {
            throw err;
          });
      } catch (error) {
        console.log("Check Your Connection..!!!");
      }
    }
  }, [trigger]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3002/get-tasks");
      if (!response.ok) {
        throw new Error("Error fetching tasks data");
      }
      const data = await response.json();
      // console.log(data);
      setList(data);
    } catch (err) {
      console.error("Error: while fetching or connecting...!!!", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  function handleList(todo) {
    setList((prevList) => {
      return [todo, ...prevList];
    });
  }
  function handleTrigger() {
    setTrigger((prevState) => {
      return !prevState;
    });
    setDataSent(true);
  }

  function DeleteHandler(taskName) {
    // setList((prevList) => prevList.filter((todoList) => todoList.task !== taskName));
  }

  function updateList(taskId, updatedTaskData) {
    // setList((prevList) =>
    //   prevList.map((task) =>
    //     task.task === taskId ? { ...task, ...updatedTaskData } : task
    //   )
    // );
  }

  return (
    <>
      <Header />
      <InputBox handleList={handleList} handleTrigger={handleTrigger} />
      {list.length > 0 ? (
        <ShowTask
          list={list}
          DeleteHandler={DeleteHandler}
          updateList={updateList}
        />
      ) : (
        <h2 style={{ textAlign: "center" }}>No Tasks</h2>
      )}
    </>
  );
}
