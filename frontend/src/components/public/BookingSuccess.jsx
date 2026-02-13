const BookingSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-3">
          Booking Confirmed 🎉
        </h1>
        <p>Check your email for confirmation.</p>
      </div>
    </div>
  );
};

export default BookingSuccess;
