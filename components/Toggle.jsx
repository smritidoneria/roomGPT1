import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export interface ToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  sideBySide: boolean;
  setSideBySide: (sideBySide: boolean) => void;
}

export default function Toggle({
  sideBySide,
  setSideBySide,
  ...props
}: ToggleProps) {
  return (
    <div {...props}>
      <div className="flex items-center">
        <span
          className={`text-sm mr-3 font-medium ${
            !sideBySide ? 'text-white' : 'text-gray-500'
          }`}
        >
          Side by Side
        </span>
        <label htmlFor="toggle" className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              id="toggle"
              type="checkbox"
              checked={sideBySide}
              onChange={() => setSideBySide(!sideBySide)}
              className="sr-only"
            />
            <div className={classNames(
              sideBySide ? 'bg-blue-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'
            )}>
              <span
                aria-hidden="true"
                className={classNames(
                  sideBySide ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </div>
          </div>
          <span className="ml-3 text-sm font-medium">
            Compare
          </span>
        </label>
      </div>
    </div>
  );
}
