export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isUpcoming = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const generateCalendarDays = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const startDay = start.getDay();
  const endDay = end.getDay();

  const days = [];

  // Fill in previous month's days
  for (let i = startDay - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, 1 - i - 1);
    days.push(prevDate);
  }

  // Fill in current month's days
  for (let d = 1; d <= end.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  // Fill in next month's days
  for (let i = 1; days.length % 7 !== 0; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push(nextDate);
  }

  return days;
};
export const getStartAndEndOfMonth = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Adjust start to the Sunday of that week
  const startDay = start.getDay();
  start.setDate(start.getDate() - startDay);
  start.setHours(0, 0, 0, 0);

  // Adjust end to the Saturday of that week
  const endDay = end.getDay();
  end.setDate(end.getDate() + (6 - endDay));
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getStartAndEndOfWeek = (date) => {
  const start = new Date(date);
  const end = new Date(date);
  const day = date.getDay(); // 0 (Sun) to 6 (Sat)

  start.setDate(date.getDate() - day);
  start.setHours(0, 0, 0, 0);

  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const parseLocalDateTime = (dateStr, timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  // 💡 Use new Date(year, month, day, hours, minutes) to avoid timezone shift
  const [year, month, day] = dateStr.split('-').map(Number);

  return new Date(year, month - 1, day, hours, minutes);  // ✅ No timezone issue
}