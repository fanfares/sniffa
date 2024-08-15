
type CreateRequestButtonProps = {
  handleNewRequest: () => void;
};

function CreateRequestButton({ handleNewRequest }: CreateRequestButtonProps) {
  return (
    <div className="pb-5 relative">
      <button
        className="bg-stone-500 text-white px-4 py-2 rounded hover:bg-stone-600"
        onClick={handleNewRequest}
      >
        New Sniff
      </button>
      {/* <span className="bg-[url('/download.png')] bg-left bg-contain bg-no-repeat block absolute h-full top-3 w-8">&nbsp;</span> */}
    </div>
  )
}

export default CreateRequestButton