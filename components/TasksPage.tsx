/**
 * NotePage component fetches task data from API and displays it.
 * Uses React Query to fetch tasks from API and handle loading/error states.
 * Renders tasks list if available, or loading/error message.
 */
"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import EachTask from "./EachTask";
import TaskSubmitForm from "./TaskSubmitForm";

export interface TaskType {
  id?: string;
  title: string;
  createdAt?: string;
}

const fetchTasks = async () => {
  const { data } = await axios.get("/api/get-tasks");
  return data.tasks;
};

function TasksPage() {
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<TaskType[]>("tasks", fetchTasks);

  const { isLoaded, user } = useUser();

  const [userFullName, setUserFullName] = useState<string | null>(() => {
    return localStorage.getItem("userFullName") || null;
  });

  useEffect(() => {
    if (isLoaded && user) {
      const storedFullName = localStorage.getItem("userFullName");

      const fullName = `${user.firstName} ${user.lastName}`;

      if (fullName !== storedFullName) {
        localStorage.setItem("userFullName", fullName);
        setUserFullName(fullName);
      }
    }
  }, [isLoaded, user]);

  return (
    <div
      className={`h-dvh flex flex-col py-5 pt-16 md:pt-20 lg:pt-24 max-w-2xl mx-auto`}
    >
      <h1 className="text-center mb-6 text-xl font-semibold">
        Hi {userFullName}🙋‍♂️
      </h1>
      <div
        className={`lg:order-last flex-1 max-h-full overflow-auto no-scrollbar ${
          !error && !tasks!?.length ? "justify-center items-center flex" : ""
        } `}
      >
        {isLoading ? (
          <Loading />
        ) : (
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

      <div className="card p-7 w-full lg:mb-4">
        <TaskSubmitForm />
      </div>
    </div>
  );
}

export default TasksPage;

function Error() {
  return (
    <p className="font-medium text-center  text-xl animate-pulse">
      Error loading tasks
    </p>
  );
}
function Loading() {
  return <p className="font-medium text-center text-xl">Loading tasks</p>;
}
function NoTasks() {
  return (
    <p className="font-medium text-center text-xl animate-pulse">
      No tasks found
    </p>
  );
}
