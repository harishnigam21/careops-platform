export default function Clock({ time = "09:43" }) {
  const [hours, minutes] = time.split(":").map(Number);
  const minDegrees = minutes * 6;
  const hourDegrees = (hours % 12) * 30 + (minutes / 60) * 30;
  return (
    <div className="relative w-25 h-25 aspect-square border-4 border-gray-800 rounded-full bg-white shadow-lg">
      {/* Center Point */}
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-600 rounded-full -translate-x-1/2 -translate-y-1/2 z-30" />

      {/* Hour Hand */}
      <div
        className="absolute bottom-1/2 left-1/2 w-1 h-4 bg-gray-800 rounded-full origin-bottom -translate-x-1/2 transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-50%) rotate(${hourDegrees}deg)` }}
      />

      {/* Minute Hand */}
      <div
        className="absolute bottom-1/2 left-1/2 w-0.5 h-6 bg-gray-500 rounded-full origin-bottom -translate-x-1/2 transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-50%) rotate(${minDegrees}deg)` }}
      />

      {/* Simple Hour Markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-1 text-center font-bold text-gray-300"
          style={{ transform: `rotate(${i * 30}deg)` }}
        >
          |
        </div>
      ))}
    </div>
  );
}
