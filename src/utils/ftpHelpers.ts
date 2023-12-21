export const getNextMonth = (currentMonth: string) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const currentMonthIndex = months.indexOf(currentMonth);
  if (currentMonthIndex === -1) {
    throw new Error("Invalid month name provided.");
  }

  // If the current month is 'Diciembre', wrap around to 'Enero'
  const nextMonthIndex = (currentMonthIndex + 1) % months.length;
  return months[nextMonthIndex];
};
