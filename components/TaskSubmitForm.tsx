"use client";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TaskType } from "./TasksPage";

function TaskSubmitForm() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const submitMutation = useMutation(
    async (newTask: TaskType) => {
      const response = await axios.post("/api/create-task", {
        title: newTask.title,
      });

      return response.data;
    },
    {
      onMutate: async (newTask) => {
        await queryClient.cancelQueries("tasks");

        const previousTasks =
          queryClient.getQueryData<TaskType[]>("tasks") || [];

        queryClient.setQueryData("tasks", (old: any) => [newTask, ...old]);

        return { previousTasks };
      },
      onError: (err, newTask, context) => {
        queryClient.setQueryData("tasks", context?.previousTasks);
      },
      onSettled: () => {
        queryClient.invalidateQueries("tasks");
      },
    }
  );

  const handleTaskSubmit = async (e: any) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    submitMutation.mutate({ title, id: Date.now().toString() });

    setTitle("");
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleTaskSubmit}>
      <input
        type="text"
        placeholder="So, what's your plan?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn bg-primary p-2 btn-rounded" type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </form>
  );
}

export default TaskSubmitForm;
