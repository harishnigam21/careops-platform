export default function Loading({ width }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p
        style={{ width: width || "100px", height: width || "100px" }}
        className=" aspect-square rounded-full border-6 animate-[spin_0.3s_linear_infinite] duration-75 border-l-violet-500 border-r-green-500 border-b-orange-600 border-t-red-500"
      ></p>
    </div>
  );
}
