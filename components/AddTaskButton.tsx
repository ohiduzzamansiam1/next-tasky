function AddTaskButton({ handleClick }: { handleClick: () => void }) {
  return (
    <button onClick={handleClick} className="btn bg-primary px-5 py-2 mt-5">
      Add Notes
    </button>
  );
}

export default AddTaskButton;
