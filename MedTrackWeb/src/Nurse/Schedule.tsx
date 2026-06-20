import { useState, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Event,
  View,
} from "react-big-calendar";

import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";

import { enUS } from "date-fns/locale";
import API from "../api";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/Schedule.css";

import {
  Modal,
  Button,
  Badge,
} from "react-bootstrap";

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
  title: string;
  subject: string;
  room: string;
  nurseID: number | null;
  color?: string;
}

export default function Schedule() {
  const nurseID = Number(sessionStorage.getItem("nurseID"));

  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("week");

  // ✅ FIX: SAFE LOCAL DATE PARSER (NO UTC SHIFT)
  const parseEventDate = (dateStr: string, timeStr: string) => {
    const [year, month, day] = dateStr
      .split("T")[0]
      .split("-")
      .map(Number);

    const [h, m, s = 0] = timeStr.split(":").map(Number);

    return new Date(year, month - 1, day, h, m, s);
  };

  const fetchSchedules = async () => {
    if (!nurseID) {
      setError("No nurse ID found in sessionStorage");
      return;
    }

    try {
      const res = await API.get(`/schedules/nurse/${nurseID}`);

      const mapped: ScheduleEvent[] = res.data.map((item: any) => {
        const start = parseEventDate(item.date, item.start_at);

        const end = new Date(start);
        end.setHours(end.getHours() + Number(item.working_hours));

        return {
          id: item.scheduleID,
          title: item.name,
          subject: item.name,
          room: item.location || "N/A",
          nurseID,
          color: item.color || "#3174ad",
          start,
          end,
        };
      });

      setEvents(mapped);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load schedules");
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [nurseID]);

  const handleSelectEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event: ScheduleEvent) => {
    return {
      style: {
        backgroundColor: event.color || "#3174ad",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "12px",
        padding: "2px 6px",
      },
    };
  };

  return (
    <div className="mb-3">
      <div className="radius10 shadow-sm">
        <div className="p-2 ps-3 radius10b0 blueBg text-white">
          <h5 className="mb-0">My Schedule</h5>
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
              date={currentDate}
              view={view}
              onNavigate={(date) => setCurrentDate(date)}
              onView={(newView) => setView(newView)}
              selectable
              popup
              views={["month", "week", "day", "agenda"]}
              defaultView="week"
              style={{ height: "80vh" }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
            />

            {/* ================= MODAL ================= */}
            <Modal
              show={!!selectedEvent}
              onHide={handleCloseModal}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Schedule Detail</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {selectedEvent && (
                  <>
                    <p><strong>Task:</strong></p>
                    <Badge bg="primary">
                      {selectedEvent.subject}
                    </Badge>

                    <hr />

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

                    <p>
                      <strong>Duration:</strong>{" "}
                      {(
                        (selectedEvent.end!.getTime() -
                          selectedEvent.start!.getTime()) /
                        3600000
                      ).toFixed(1)}{" "}
                      hours
                    </p>
                  </>
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