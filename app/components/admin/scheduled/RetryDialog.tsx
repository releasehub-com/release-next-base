import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface RetryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: (scheduledFor: Date) => void;
  originalScheduledFor: Date;
}

export function RetryDialog({
  isOpen,
  onClose,
  onRetry,
  originalScheduledFor,
}: RetryDialogProps) {
  const [retryOption, setRetryOption] = useState<"now" | "future">("now");
  const [scheduledFor, setScheduledFor] = useState<Date>(() => {
    // Set default to 15 minutes from now
    const date = new Date();
    date.setMinutes(date.getMinutes() + 15);
    return date;
  });

  if (!isOpen) return null;

  const handleRetry = () => {
    if (retryOption === "now") {
      // For "now", set to 5 minutes from now (minimum required time)
      const date = new Date();
      date.setMinutes(date.getMinutes() + 5);
      onRetry(date);
    } else {
      onRetry(scheduledFor);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Retry Failed Post</h3>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-300 text-sm">
            This post failed to publish. When would you like to retry?
          </p>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="retry-now"
                name="retry-option"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                checked={retryOption === "now"}
                onChange={() => setRetryOption("now")}
              />
              <label
                htmlFor="retry-now"
                className="ml-2 block text-sm text-gray-300"
              >
                Retry as soon as possible (5 minutes from now)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="retry-future"
                name="retry-option"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                checked={retryOption === "future"}
                onChange={() => setRetryOption("future")}
              />
              <label
                htmlFor="retry-future"
                className="ml-2 block text-sm text-gray-300"
              >
                Schedule for a specific time
              </label>
            </div>

            {retryOption === "future" && (
              <div className="pl-6 pt-2">
                <div className="relative">
                  <DatePicker
                    selected={scheduledFor}
                    onChange={(date: Date | null) =>
                      date && setScheduledFor(date)
                    }
                    showTimeSelect
                    timeFormat="h:mm aa"
                    timeIntervals={15}
                    dateFormat="MMM d, yyyy h:mm aa"
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    popperClassName="react-datepicker-dark"
                    calendarClassName="bg-gray-800 border-gray-700"
                    minDate={new Date()}
                    minTime={new Date(new Date().setHours(0, 0, 0, 0))}
                    maxTime={new Date(new Date().setHours(23, 59, 0, 0))}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Must be at least 5 minutes in the future
                </p>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              <span className="font-medium text-gray-300">
                Originally scheduled for:
              </span>{" "}
              {originalScheduledFor.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-700">
          <button
            onClick={handleRetry}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Retry Post
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 sm:mt-0 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
