import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingSuccess from "../public/BookingSuccess";
import DateSelector from "../public/DateSelector";
import BookingForm from "../public/BookingForm";
import SlotList from "../public/SlotList";
import useApi from "../../hooks/Api";

const PublicBookingPage = () => {
  const { slug } = useParams();
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  const [workspace, setWorkspace] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  //store message to show user
  const [showInfo, setShowInfo] = useState({
    status: false,
    message: "",
    color: "white",
  });
  // & this function reflect the message to user
  const showInfoFunc = (color, message) => {
    setShowInfo({ status: true, message, color });
    setTimeout(() => {
      setShowInfo({ status: false, message: "", color: "" });
    }, 4000);
  };
  useEffect(() => {
    sendRequest(`public/workspace/${slug}`).then((result) => {
      const data = result?.data;
      showInfoFunc(result.success ? "green" : "red", data.message);
      if (result && result.success) {
        setWorkspace(data);
      }
    });
  }, [slug]);

  if (bookingSuccess) {
    return <BookingSuccess />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bgprimary p-4">
      <div className="bg-bgprimary shadow-lg rounded-2xl w-full max-w-2xl p-8 border border-border/50">
        {workspace && (
          <h1 className="text-2xl font-bold text-center mb-6">
            {workspace.name}
          </h1>
        )}

        <DateSelector
          setSelectedDate={setSelectedDate}
          setSelectedSlot={setSelectedSlot}
          setSlots={setSlots}
          showInfoFunc={showInfoFunc}
          slug={slug}
        />

        {!loading ? (
          slots ? (
            slots.length > 0 ? (
              <SlotList
                slots={slots}
                onSelect={setSelectedSlot}
                selectedSlot={selectedSlot}
              />
            ) : (
              <p className="text-red-500 text-center text-xl">
                No Slot Available
              </p>
            )
          ) : (
            <p className="text-blue-500 text-center text-xl">
              Please select date to get slots..
            </p>
          )
        ) : (
          <div className="flex items-center justify-center">
            <p className="spinner h-18 w-18" />
          </div>
        )}

        {selectedSlot && (
          <BookingForm
            slot={selectedSlot}
            slug={slug}
            onSuccess={() => setBookingSuccess(true)}
            showInfoFunc={showInfoFunc}
          />
        )}
      </div>

      {/*backend information handler */}
      {showInfo.status && (
        <p style={{ color: showInfo.color }} className="text-center font-bold text-xl">
          {showInfo.message}
        </p>
      )}
    </div>
  );
};

export default PublicBookingPage;
