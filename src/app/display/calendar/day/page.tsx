"use client";

import Calendar from "../../../../components/calendar/Calendar";
import { useCalendarRouter } from "../../../../hooks/useCalendarRouter";

export default function CalendarDayView() {
  useCalendarRouter();
  return <Calendar mode={"day"} />;
}
