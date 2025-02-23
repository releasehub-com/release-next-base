"use client";

import { useState } from "react";
import type { ScheduleDialogProps } from "./types";

export function ScheduleDialog({
  isOpen,
  onClose,
  onConfirm,
  platform,
}: ScheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    if (scheduledDateTime <= new Date()) {
      setError("Selected time must be in the future");
      return;
    }

    onConfirm(scheduledDateTime);
    onClose();
  };

  const handlePostNow = () => {
    // Schedule for 1 minute in the future to pass validation
    const scheduledFor = new Date(Date.now() + 60000);
    onConfirm(scheduledFor);
    onClose();
  };

  if (!isOpen) return null;

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
              Schedule for later
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                disabled={!selectedDate || !selectedTime}
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
