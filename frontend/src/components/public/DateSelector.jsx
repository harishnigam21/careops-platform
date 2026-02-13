import useApi from "../../hooks/Api";
const DateSelector = ({
  setSelectedDate,
  setSelectedSlot,
  setSlots,
  showInfoFunc,
  slug,
}) => {
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  const fetchSlots = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    sendRequest(`public/availability/${slug}?date=${date}`).then((result) => {
      const data = result?.data;
      showInfoFunc(result.success ? "green" : "red", data.message);
      if (result && result.success) {
        setSlots(data.slots);
      }
    });
  };
  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium after:content-['*'] after:text-red-500">
        Select Date
      </label>
      <div className="flex items-center gap-4">
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          className="w-full border border-border/20 rounded-lg p-2"
          onChange={(e) => fetchSlots(e.target.value)}
        />
        <p className={`${loading && "spinner"}`}></p>
      </div>
    </div>
  );
};

export default DateSelector;
