"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";
import type { ScheduleDialogProps } from "./types";

export function ScheduleDialog({
  isOpen,
  onClose,
  onConfirm,
  platform,
}: ScheduleDialogProps) {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string>("");

  const handleSchedule = () => {
    if (!selectedDate) {
      setError("Please select a date and time");
      return;
    }

    if (selectedDate <= new Date()) {
      setError("Selected time must be in the future");
      return;
    }

    onConfirm(selectedDate);
    onClose();
  };

  const handlePostNow = () => {
    // Use current time plus 5 seconds for immediate posts
    const scheduledFor = new Date(Date.now() + 5000);
    onConfirm(scheduledFor);
    onClose();
  };

  if (!isOpen) return null;

  const userTimezone = session?.user?.timezone || "America/Los_Angeles";
  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() + 1); // Minimum 1 minute in the future

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Schedule Post</h3>
            <button
              onClick={handlePostNow}
              className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Post Now
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className="border-t border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-4">
              Schedule for later ({userTimezone})
            </h4>
            <div className="space-y-4">
              <div>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => {
                    setSelectedDate(date);
                    setError("");
                  }}
                  showTimeSelect
                  timeFormat="h:mm aa"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={minDate}
                  placeholderText="Select date and time"
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  calendarClassName="bg-gray-800 border-gray-700 text-white"
                  popperClassName="react-datepicker-popper"
                  timeCaption="Time"
                  wrapperClassName="w-full"
                  showPopperArrow={false}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!selectedDate}
                className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
