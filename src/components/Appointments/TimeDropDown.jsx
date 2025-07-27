// components/TimeDropdown.jsx
import React from 'react';

const generateTimeOptions = () => {
    const times = [];
    let start = new Date();
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 48; i++) {
        const hour = start.getHours();
        const minute = start.getMinutes();
        const formatted = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(start);
        times.push(formatted);
        start.setMinutes(start.getMinutes() + 30);
    }

    return times;
};

const TimeDropdown = ({ value, onChange }) => {
    const options = generateTimeOptions();

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
            {options.map((time) => (
                <option key={time} value={time}>
                    {time}
                </option>
            ))}
        </select>
    );
};

export default TimeDropdown;
