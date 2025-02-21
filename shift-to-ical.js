const readline = require("readline");

const calendarEvents = [];

const timestamp = (date = new Date(), time = new Date()) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = time.getHours().toString().padStart(2, "0");
  const minute = time.getMinutes().toString().padStart(2, "0");
  const second = time.getSeconds().toString().padStart(2, "0");

  return `${year}${month}${day}T${hour}${minute}${second}Z`;
};

const event = (event_type, title, date, start, end) => {
  const eventTimestamp = timestamp();

  const startTimestamp = timestamp(date, start);
  const endTimestamp = timestamp(date, end);

  return [
    "BEGIN:VEVENT",
    `DTSTART:${startTimestamp}`,
    `DTEND:${endTimestamp}`,
    `DTSTAMP:${eventTimestamp}`,
    `CREATED:${eventTimestamp}`,
    `DESCRIPTION:${title} - ${event_type}`,
    `LAST-MODIFIED:${eventTimestamp}`,
    "SEQUENCE:0",
    "STATUS:CONFIRMED",
    `SUMMARY:${title}`,
    "TRANSP:OPAQUE",
    "END:VEVENT",
  ];
};

const ics = (events) => {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//bobbin v0.1//NONSGML iCal Writer//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\n");
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  const shifts = line.split(",");

  const year = 2025;
  const month = 3;
  const startDate = new Date(`${year}-${month}-01`);

  let index = 0;
  for(const s of shifts) {
    // morning shift
    if (s === "m") {
        const shiftDate = new Date(startDate);
        shiftDate.setDate(shiftDate.getDate() + index);
        const startTime = new Date(shiftDate);
        startTime.setHours(7, 0, 0, 0);
        const endTime = new Date(shiftDate);
        endTime.setHours(13, 0, 0, 0);
        
        calendarEvents.push(...event(s, "Turno mañana", shiftDate, startTime, endTime));        
    }

    // afternoon shift
    if (s === "p") {
        const shiftDate = new Date(startDate);
        shiftDate.setDate(shiftDate.getDate() + index);
        const startTime = new Date(shiftDate);
        startTime.setHours(14, 0, 0, 0);
        const endTime = new Date(shiftDate);
        endTime.setHours(19, 0, 0, 0);
    
        calendarEvents.push(...event(s, "Turno tarde", shiftDate, startTime, endTime));
    }
    
    // increment day counter
    index ++;
  }

});

rl.once("close", () => {
  // end of input
  console.log(ics(calendarEvents));
});
