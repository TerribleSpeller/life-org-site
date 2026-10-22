import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const localStorageKey = 'toDoListData'
  const [currentData, setCurrentData] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [currentSelectedData, setCurrentSelectedData] = useState(null)
  const [currentDay, setCurrentDay] = useState(null)
  const [newTaskInput, setNewTaskInput] = useState('')

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const monthName = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const weekCount = Math.ceil((firstDayOfMonth.getDay() + daysInMonth) / 7);
  const calendarDays = Array.from({ length: weekCount * 7 }, (_, index) => {
    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      index - firstDayOfMonth.getDay() + 1,
    );
  });

  function changeMonth(offset) {
    setCurrentMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1),
    );
  }

  useEffect(() => {
    console.log("Initializing")
    try {
      const storedData = localStorage.getItem(localStorageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        setCurrentData(parsedData);
        localStorage.setItem(localStorageKey, JSON.stringify(parsedData));
      } else {
        const today = new Date();
        const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const baseStorage = {
          [todayDate]: {
            tasks: [],
          },
        };
        localStorage.setItem(localStorageKey, JSON.stringify(baseStorage));
        setCurrentData(baseStorage);
      }
    } catch (error) {
      console.log("Error parsing localStorage data:", error);
      const today = new Date();
      const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const baseStorage = {
        [todayDate]: {
          tasks: {},
        },
      };
      localStorage.setItem(localStorageKey, JSON.stringify(baseStorage));
      setCurrentData(baseStorage);
    }
    setLoaded(true)

  }, [loaded])

  function getData(date) {
    if (!loaded) return;
    //Get the data of that date.
    try {
      const dateData = currentData[date] ?? { tasks: [] };
      const updatedData = {
        ...currentData,
        [date]: dateData,
      };

      setCurrentData(updatedData);
      setCurrentSelectedData(dateData);
      setCurrentDay(date);

      if (!currentData[date]) {
        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }

  function addTask(date, newTask) {
    const task = {
      id: crypto.randomUUID(),
      text: newTask,
      completed: false,
    };
    const newData = {
      ...currentData,
      [date]: {
        tasks: [...(currentData[date]?.tasks || []), task],
      },
    }

    setCurrentData(newData);
    setCurrentSelectedData(newData[date]);
    localStorage.setItem(localStorageKey, JSON.stringify(newData));
  }

  function toggleTaskCompleted(date, taskId) {
    let addOrRemove = 0;
    if (currentData[date].tasks.filter(task => task.id === taskId).completed === undefined) {
      addOrRemove = 1;
    } else if (currentData[date].tasks.filter(task => task.id === taskId).completed === true) {
      addOrRemove = -1;
    }
    const completedCount = currentData[date].tasks.filter((task) => task.completed).length + addOrRemove;
    const newData = {
      ...currentData,
      [date]: {
        ...currentData[date],
        completed: completedCount,
        tasks: currentData[date].tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      },
    };

    setCurrentData(newData);
    setCurrentSelectedData(newData[date]);
    localStorage.setItem(localStorageKey, JSON.stringify(newData));
  }

  //TODO: Fix re-rendering issues

  function determineBackground(numOfTasks, numOfComplete) {
    if (numOfTasks === 0) {
      return "none-done";
    }
    const ratio = numOfComplete / numOfTasks;
    const convert = Math.round(ratio * 7);
    
    switch (convert) {
      case 0:
        return "none-done";
      case 1:
        return "fifteen-done";
      case 2:
        return "twenty-five-done";
      case 3:
        return "fourty-done";
      case 4:
        return "fifty-five-done";
      case 5:
        return "seventy-done";
      case 6:
        return "eighty-five-done";
      case 7: 
        return "hundred-done";
      default:
        return "none-done";
    }
  }

  return (
    <>
      <Head>
        <title>Daily ToDO App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.calendar}>
        <div id="theCLANEDER">
          <div className={styles.calendarHeader}>
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              Previous
            </button>
            <h1>{monthName}</h1>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              Next
            </button>
          </div>

          <table className={styles.calendarTable}>
            <caption className={styles.visuallyHidden}>{monthName} calendar</caption>
            <thead>
              <tr>
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                  (day) => (
                    <th key={day} scope="col">
                      {day}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: weekCount }, (_, weekIndex) => (
                <tr key={weekIndex}>
                  {calendarDays
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((date) => {
                      const isCurrentMonth =
                        date.getMonth() === currentMonth.getMonth() &&
                        date.getFullYear() === currentMonth.getFullYear();
                      const selectDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                      const numberCompleted = currentData[selectDate]?.tasks?.filter((task) => task.completed).length ?? 0;
                      const numberOfTasks = currentData[selectDate]?.tasks?.length ?? 0;
                      const isPastOrPresent = date <= new Date();
                      const resultingColour = determineBackground(numberOfTasks, numberCompleted);
                      return (
                        <td
                          key={selectDate}
                          className={
                            `${isCurrentMonth ? "" : styles.adjacentMonthDay}  ${isPastOrPresent ? resultingColour : ""}`
                          }
                          onClick={() => { getData(selectDate) }}
                        >
                          {date.getDate()}
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="theTASKS" className="col mt-3">
          <div className="row">
            <h3>Tasks of {currentDay}</h3>
          </div>
          <div className="col border border-2 rounded p-3">
            <div className="row " >
              <div className="col col-10  p-2 mb-2">
                <input className="form-control" type="text" placeholder="Add a new task" value={newTaskInput} onChange={(e) => setNewTaskInput(e.target.value)} >

                </input>
              </div>
              <div className="col-2 border border-1 rounded p-2 mb-2 bg-secondary text-white" onClick={() => addTask(currentDay, newTaskInput)} >
                <span>+ Add Task </span>
              </div>
            </div>
            <div className="col">
              {
                currentSelectedData?.tasks?.length > 0 ?
                  currentSelectedData?.tasks?.map((task) => (
                    <div key={task.id} className={`row border border-1 p-2 mb-2 ${task.completed ? "success-color-bg" : "notdone-color-bg"}`}>
                      <div className="col col-10 ">
                        <span>{task.text}</span>
                      </div>
                      <div className="col-2 border border-1 rounded p-2 mb-2 bg-secondary text-white" onClick={() => toggleTaskCompleted(currentDay, task.id)}>
                        <span>{task.completed ? "Undo" : "Done"}</span>
                      </div>
                    </div>
                  )) :
                  <div>
                    <span>No tasks for this day.</span>
                  </div>
              }
            </div>

          </div>


        </div>

      </main>
    </>
  );
}
