
type CreateRequestButtonProps = {
  handleNewRequest: () => void;
};

function CreateRequestButton({ handleNewRequest }: CreateRequestButtonProps) {
  return (
    <div className="mt-10">
      <button
        className="bg-stone-500 text-white px-4 py-2 rounded hover:bg-stone-600"
        onClick={handleNewRequest}
      >
        Create New Request
      </button>
    </div>
  )
}

export default CreateRequestButton