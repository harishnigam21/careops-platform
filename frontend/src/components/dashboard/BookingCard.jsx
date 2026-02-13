import {
  formatDateCustom,
  getDaysBetween,
  matchTime,
  separateTime,
} from "../../utils/getDate";
import { MdDelete } from "react-icons/md";
export default function BookingCard({ bk }) {
  return (
    <div className="relative flex flex-col justify-between gap-3 bg-bgprimary border p-3 rounded-md border-txlight/10 overflow-hidden">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 whitespace-nowrap">
            <h3 className="text-xl md:text-xl [font-variant:small-caps] font-bold">
              {bk.name}
            </h3>
          </div>
          <div className="flex items-center whitespace-nowrap text-xl">
            <strong>
              {formatDateCustom(bk.startTime)} at {separateTime(bk.startTime)}
            </strong>
          </div>
        </div>
      </div>
      <hr className="border-t border-border/10 scale-x-150 w-full" />
      <div className="flex flex-col justify-center gap-3 whitespace-nowrap grow">
        <div className="flex gap-2">
          <span>Current Status</span>
          <span>:</span>
          {matchTime(bk.startTime) ? (
            <span className="text-red-500">expired</span>
          ) : (
            <span
              className={`${bk.status.toLowerCase() == "accepted" ? "text-green-500" : bk.status.toLowerCase() == "declined" ? "text-red-500" : ""}`}
            >
              {bk.status}
            </span>
          )}
        </div>
        {bk.status == "confirmed" && !matchTime(bk.startTime) && (
          <div className="flex flex-wrap gap-2 text-sm">
            <button className="py-0.5 px-3 rounded-md bg-green-800 text-white cursor-pointer font-bold">
              Accept
            </button>
            <button className="py-0.5 px-1 rounded-md bg-red-600 text-white cursor-pointer font-bold">
              Decline
            </button>
            <button className="py-0.5 px-1 rounded-md bg-orange-600 text-white cursor-pointer font-bold">
              Completed
            </button>
          </div>
        )}
      </div>
      <hr className="border-t border-border/10 scale-x-150 w-full" />
      <div className="flex justify-between gap-2 whitespace-nowrap overflow-scroll noscrollbar">
        <small>Booked by : {bk.booked_by},</small>
        <small>{getDaysBetween(bk.createdAt)}</small>
      </div>
      <div className="absolute top-2 right-2 flex items-center cursor-pointer z-2">
        <MdDelete className="text-red-500 text-xl" />
      </div>
    </div>
  );
}
