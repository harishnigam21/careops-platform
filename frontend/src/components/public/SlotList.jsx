const SlotList = ({ slots, onSelect, selectedSlot }) => {
  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-3 after:content-['*'] after:text-red-500">Available Slots</h2>

      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot, index) => {
          const time = new Date(slot.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const isSelected =
            selectedSlot?.start === slot.start;

          return (
            <button
            type="button"
              key={index}
              onClick={() => onSelect(slot)}
              className={`border border-border/20 rounded-lg p-2 transition
                ${isSelected
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 hover:text-black"
                }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlotList;
