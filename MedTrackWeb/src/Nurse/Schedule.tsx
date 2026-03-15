import { useState, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Event,
  View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/Schedule.css";
import { Modal, Button } from "react-bootstrap";
import ErrorPage from "../ErrorPage";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface ScheduleEvent extends Event {
  id: number;
  subject: string;
  room: string;
  nurseID: string | null;
  color?: string;
}

export default function Schedule() {
  const nurseID = sessionStorage.getItem("nurseID");

  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] =
    useState<ScheduleEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("week");

  const parseEventDate = (dateStr: string, timeStr: string) =>
    new Date(`${dateStr}T${timeStr}`);

  const fetchSchedules = async () => {
    if (!nurseID) {
      setError("No nurse ID found in sessionStorage");
      return;
    }

    try {
      const res = await axios.get(
        `https://projectb-medtrack.onrender.com/api/schedules/${nurseID}`
      );
      const data = res.data;

      const mapped: ScheduleEvent[] = data.flatMap((item: any) => {
        const start = parseEventDate(item.date, item.start_at);
        const end = new Date(
          start.getTime() + item.working_hours * 60 * 60 * 1000
        );

        if (start.getDate() !== end.getDate()) {
          const endOfDay = new Date(start);
          endOfDay.setHours(23, 59, 59);

          const startOfNextDay = new Date(end);
          startOfNextDay.setHours(0, 0, 0);

          return [
            {
              id: item.scheduleID,
              title: item.subject,
              subject: item.subject,
              room: item.room_location,
              nurseID,
              color: item.color || "lightblue",
              start,
              end: endOfDay,
            },
            {
              id: item.scheduleID,
              title: item.subject,
              subject: item.subject,
              room: item.room_location,
              nurseID,
              color: item.color || "lightblue",
              start: startOfNextDay,
              end,
            },
          ];
        } else {
          return [
            {
              id: item.scheduleID,
              title: item.subject,
              subject: item.subject,
              room: item.room_location,
              nurseID,
              color: item.color || "lightblue",
              start,
              end,
            },
          ];
        }
      });

      setEvents(mapped);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load schedules");
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [nurseID]);

  const handleSelectEvent = (event: ScheduleEvent) =>
    setSelectedEvent(event);

  const handleCloseModal = () => setSelectedEvent(null);

  const eventStyleGetter = (event: ScheduleEvent) => ({
    style: {
      backgroundColor: event.color || "lightblue",
      color: "white",
      borderRadius: "4px",
      border: "none",
      padding: "2px",
    },
  });

  return (
    <div className="mb-3">
      <div className="radius10 shadow-sm ">
        <div className="p-2 ps-3 radius10b0 blueBg text-white">
          <h5 className="mb-0">Schedule</h5>
        </div>
      </div>
      <div className="p-4 whiteBg dropShadow radius10t0">
        {error ? (
          <ErrorPage />
        ) : (
          <>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              titleAccessor={(event: ScheduleEvent) =>
                `${event.subject} - ${event.room}`
              }
              onSelectEvent={handleSelectEvent}
              date={currentDate}
              onNavigate={setCurrentDate}
              view={view}
              onView={(newView) => setView(newView)}
              views={["day", "week", "month"]}
              defaultView="week"
              step={30}
              timeslots={2}
              style={{ height: "80vh" }}
              eventPropGetter={eventStyleGetter}
              toolbar={true}
            />

            <Modal show={!!selectedEvent} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Task Detail</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedEvent && (
                  <div>
                    <p>
                      <strong>Subject:</strong> {selectedEvent.subject}
                    </p>
                    <p>
                      <strong>Room:</strong> {selectedEvent.room}
                    </p>
                    <p>
                      <strong>Start:</strong>{" "}
                      {selectedEvent.start?.toLocaleString()}
                    </p>
                    <p>
                      <strong>End:</strong>{" "}
                      {selectedEvent.end?.toLocaleString()}
                    </p>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}