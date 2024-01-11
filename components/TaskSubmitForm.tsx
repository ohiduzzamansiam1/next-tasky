"use client";
// Importing necessary dependencies and types
import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TaskType } from "./TasksPage";

// TaskSubmitForm component for submitting new tasks
function TaskSubmitForm() {
  // State for managing the task title input
  const [title, setTitle] = useState("");
  // Query client for managing queries
  const queryClient = useQueryClient();

  // Mutation for handling task submission
  const submitMutation = useMutation(
    async (newTask: TaskType) => {
      // Sending a request to create a new task
      const response = await axios.post("/api/create-task", {
        title: newTask.title,
      });

      return response.data;
    },
    {
      // onMutate is called before the mutation is executed
      onMutate: async (newTask) => {
        // Canceling any ongoing "tasks" queries
        await queryClient.cancelQueries("tasks");

        // Getting the previous tasks from the cache
        const previousTasks =
          queryClient.getQueryData<TaskType[]>("tasks") || [];

        // Updating the cache with the new task
        queryClient.setQueryData("tasks", (old: any) => [newTask, ...old]);

        // Returning the previous tasks for potential rollback on error
        return { previousTasks };
      },
      // onError is called if the mutation encounters an error
      onError: (err, newTask, context) => {
        // Rolling back to the previous tasks in case of an error
        queryClient.setQueryData("tasks", context?.previousTasks);
      },
      // onSettled is called after the mutation is either resolved or rejected
      onSettled: () => {
        // Invalidating the "tasks" query to refetch the updated data
        queryClient.invalidateQueries("tasks");
      },
    }
  );

  // Function to handle task submission
  const handleTaskSubmit = async (e: any) => {
    e.preventDefault();

    // Checking if the title is not empty or only contains whitespace
    if (!title.trim()) {
      return;
    }

    // Initiating the mutation to submit the new task
    submitMutation.mutate({ title, id: Date.now().toString() });

    // Clearing the input field after submission
    setTitle("");
  };

  // Rendering the task submission form
  return (
    <form className="flex items-center gap-2" onSubmit={handleTaskSubmit}>
      <input
        type="text"
        placeholder="So, what's your plan?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn bg-primary p-2 btn-rounded" type="submit">
        {/* Icon for the submit button */}
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

// Exporting the TaskSubmitForm component
export default TaskSubmitForm;
