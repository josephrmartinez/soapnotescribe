// import { Revenue } from './definitions';

export function calculateAge(patientDOB: string, appointmentDate: string) {
    const dob = new Date(patientDOB);
    const appointment = new Date(appointmentDate);
    let age = appointment.getFullYear() - dob.getFullYear();
    const monthDifference = appointment.getMonth() - dob.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && appointment.getDate() < dob.getDate())
    ) {
      age--;
    }
    return age;
  }

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string | null,
  locale: string = 'en-US',
) => {

  if (dateStr === null) {
    return '';
 }
 
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatTime = (timeString: string) => {
  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

// export const generateYAxis = (revenue: Revenue[]) => {
//   // Calculate what labels we need to display on the y-axis
//   // based on highest record and in 1000s
//   const yAxisLabels = [];
//   const highestRecord = Math.max(...revenue.map((month) => month.revenue));
//   const topLabel = Math.ceil(highestRecord / 1000) * 1000;

//   for (let i = topLabel; i >= 0; i -= 1000) {
//     yAxisLabels.push(`$${i / 1000}K`);
//   }

//   return { yAxisLabels, topLabel };
// };

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
