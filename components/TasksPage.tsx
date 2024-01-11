"use client";

// Importing necessary dependencies and components
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import EachTask from "./EachTask";
import TaskSubmitForm from "./TaskSubmitForm";

// Type definition for Task
export interface TaskType {
  id?: string;
  title: string;
  createdAt?: string;
}

// Function to fetch tasks from the server
const fetchTasks = async () => {
  const { data } = await axios.get("/api/get-tasks");
  return data.tasks;
};

// Main component for rendering tasks page
function TasksPage() {
  // Using react-query hook to fetch tasks
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<TaskType[]>("tasks", fetchTasks);

  // Using Clerk hook to get user information
  const { isLoaded, user } = useUser();

  // State to store user's first name and task length
  const [userFirstName, setUserFirstName] = useState<string | null>(() => {
    return localStorage.getItem("userFirstName") || null;
  });

  const [taskLength, setTaskLength] = useState<string | null>(() => {
    return localStorage.getItem("taskLength") || null;
  });

  // useEffect to update local storage when user or tasks change
  useEffect(() => {
    if (isLoaded && user) {
      const storedFirstName = localStorage.getItem("userFirstName");
      const storedTaskLength = localStorage.getItem("taskLength");

      if (tasks?.length !== parseInt(storedTaskLength as string)) {
        localStorage.setItem("taskLength", tasks!?.length.toString());
        setTaskLength(taskLength);
      }

      if (user.firstName !== storedFirstName) {
        localStorage.setItem("userFirstName", user.firstName as string);
        setUserFirstName(user.firstName);
      }
    }
  }, [isLoaded, user, tasks, taskLength]);

  // Rendering the main component
  return (
    <div
      className={`h-dvh flex flex-col py-5 pt-16 md:pt-20 lg:pt-24 max-w-2xl mx-auto`}
    >
      <h1 className="text-center my-5 mt-7 md:mt-3 lg:mt-0 lg:mb-6 text-xl font-semibold">
        Hi {userFirstName}🙋‍♂️
      </h1>
      <div
        className={`lg:order-last flex-1 max-h-full overflow-auto no-scrollbar ${
          !isLoading && !tasks?.length ? "justify-center items-center flex" : ""
        } `}
      >
        {isLoading ? (
          // Loading state when tasks are being fetched
          <>
            {Array.from({
              length: !parseInt(taskLength as string)
                ? 1
                : parseInt(taskLength as string),
            }).map((_, idx) => {
              return <Loading key={idx} />;
            })}
          </>
        ) : (
          // Rendering tasks or appropriate message based on the state
          <>
            {error ? (
              <Error />
            ) : tasks?.length === 0 ? (
              <NoTasks />
            ) : (
              <>
                {tasks?.map((task) => (
                  <EachTask
                    key={task.id}
                    title={task.title}
                    id={task.id as string}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>

      <div className="card p-4 lg:p-6 w-full lg:mb-4">
        {/* Task submit form component */}
        <TaskSubmitForm />
      </div>
    </div>
  );
}

// Exporting the main component
export default TasksPage;

// Additional components for displaying loading, error, and no tasks messages
function Error() {
  return (
    <p className="font-medium text-center text-xl animate-pulse">
      Error loading tasks
    </p>
  );
}

function Loading() {
  return (
    <div className="card p-7 w-full my-2 flex items-center justify-between">
      <div className="flex-1 space-y-2">
        <div className="w-1/2 h-4 bg-gray-200/20 rounded"></div>
      </div>
      <div className="p-4 rounded-full bg-gray-200/20 animate-pulse"></div>
    </div>
  );
}

function NoTasks() {
  return (
    <p className="font-medium text-center text-xl animate-pulse">
      No tasks found
    </p>
  );
}
