"use client";

// Importing necessary dependencies and types
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { TaskType } from "./TasksPage";

// Interface for the props of EachTask component
interface EachTaskProps {
  title: string;
  id: string;
}

// Component for rendering each individual task
function EachTask({ title, id }: EachTaskProps) {
  // Query client for managing queries
  const queryClient = useQueryClient();

  // Mutation for handling task deletion
  const deleteTaskMutation = useMutation(
    // Async function for deleting a task
    async () => {
      await axios.post(`/api/delete-task`, { id });
    },
    {
      // onMutate is called before the mutation is executed
      onMutate: async () => {
        // Canceling any ongoing "tasks" queries
        await queryClient.cancelQueries("tasks");

        // Getting the previous tasks from the cache
        const previousTasks =
          queryClient.getQueryData<TaskType[]>("tasks") || [];

        // Updating the cache by removing the deleted task
        queryClient.setQueryData("tasks", (old: any) =>
          old.filter((task: TaskType) => task.id !== id)
        );

        // Returning the previous tasks for potential rollback on error
        return { previousTasks };
      },
      // onError is called if the mutation encounters an error
      onError: (_, __, context) => {
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

  // Function to handle task deletion
  const handleDelete = async () => {
    // Initiating the mutation to delete the task
    deleteTaskMutation.mutate();
  };

  // Rendering each task as a card with title and delete button
  return (
    <div className="card p-7 w-full my-2 flex items-center justify-between">
      <span>{title}</span>
      <button className="text-red-500" onClick={handleDelete}>
        {/* Icon for the delete button */}
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
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}

// Exporting the EachTask component
export default EachTask;
