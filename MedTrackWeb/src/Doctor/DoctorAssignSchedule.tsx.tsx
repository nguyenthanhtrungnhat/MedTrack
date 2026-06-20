import { useEffect, useState } from "react";
import API from "../api";

import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";

import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const TASK_OPTIONS = [
  { name: "Medication Round", color: "#dc3545" },
  { name: "Vital Signs Check", color: "#0d6efd" },
  { name: "Patient Admission", color: "#198754" },
  { name: "Patient Discharge", color: "#fd7e14" },
  { name: "Blood Sample Collection", color: "#6f42c1" },
  { name: "IV Therapy", color: "#20c997" },
  { name: "Wound Care", color: "#e83e8c" },
  { name: "ECG Monitoring", color: "#6610f2" },
  { name: "Emergency Support", color: "#000000" },
  { name: "General Ward Duty", color: "#6c757d" },
];

type RoomType = {
  roomID: number;
  location: string;
  departmentID: number;
};

type NurseType = {
  nurseID: number;
  fullName: string;
};

type ScheduleType = {
  scheduleID: number;
  name: string;
  date: string;
  start_at: string;
  working_hours: number;
  nurseID: number;
  roomID: number;
  color: string;
  fullName?: string;
  location?: string;
};

export default function DoctorAssignSchedule() {
  const [events, setEvents] = useState<any[]>([]);
  const [nurses, setNurses] = useState<NurseType[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [editingID, setEditingID] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("week");

  const departmentID = sessionStorage.getItem("departmentID");

  const [form, setForm] = useState({
    name: "",
    date: "",
    start_at: "",
    working_hours: 8,
    nurseID: "",
    roomID: "",
    color: "#3174ad",
  });

  useEffect(() => {
    loadSchedules();
    loadNurses();
    loadRooms();
  }, []);

  const loadNurses = async () => {
    try {
      const res = await API.get("/schedules/nurses");
      setNurses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRooms = async () => {
    if (!departmentID) return;
    try {
      const res = await API.get(`/rooms/department/${departmentID}`);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load rooms");
    }
  };

  // 🔥 FULL FIX HERE
  const loadSchedules = async () => {
    try {
      const res = await API.get("/schedules");

      const mapped = res.data.flatMap((s: ScheduleType) => {
        const start = moment(
          `${s.date} ${s.start_at}`,
          "YYYY-MM-DD HH:mm:ss"
        );

        const end = moment(start).add(
          Number(s.working_hours),
          "hours"
        );

        const base = {
          id: s.scheduleID,
          title: `${s.fullName} - ${s.name}`,
          resource: s,
        };

        // normal case (same day)
        if (end.isSame(start, "day")) {
          return [
            {
              ...base,
              start: start.toDate(),
              end: end.toDate(),
            },
          ];
        }

        // cross midnight → SPLIT EVENT
        return [
          {
            ...base,
            start: start.toDate(),
            end: start.clone().endOf("day").toDate(),
          },
          {
            ...base,
            start: start.clone().add(1, "day").startOf("day").toDate(),
            end: end.toDate(),
          },
        ];
      });

      setEvents(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load schedules");
    }
  };

  const saveSchedule = async () => {
    if (!form.name || !form.nurseID || !form.roomID) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        ...form,
        start_at: `${form.start_at}:00`,
        nurseID: Number(form.nurseID),
        roomID: Number(form.roomID),
      };

      if (editingID) {
        await API.put(`/schedules/${editingID}`, payload);
        toast.success("Updated");
      } else {
        await API.post("/schedules", payload);
        toast.success("Created");
      }

      setShowModal(false);
      loadSchedules();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const deleteSchedule = async () => {
    if (!editingID) return;
    if (!window.confirm("Delete this schedule?")) return;

    try {
      await API.delete(`/schedules/${editingID}`);
      toast.success("Deleted");
      setShowModal(false);
      loadSchedules();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header blueBg text-white d-flex justify-content-between">
        <h5>Nurse Schedule Management</h5>

        <Button onClick={() => setShowModal(true)}>
          + Add Schedule
        </Button>
      </div>

      <div style={{ height: 850 }} className="p-3">
        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          startAccessor="start"
          endAccessor="end"
          selectable
          popup
          views={["month", "week", "day", "agenda"]}

          onNavigate={(d) => setDate(d)}
          onView={(v) => setView(v)}
          onSelectEvent={(e: any) => {
            const s = e.resource;
            setEditingID(s.scheduleID);
            setForm({
              name: s.name,
              date: s.date.split("T")[0],
              start_at: s.start_at.substring(0, 5),
              working_hours: s.working_hours,
              nurseID: String(s.nurseID),
              roomID: String(s.roomID),
              color: s.color || "#3174ad",
            });
            setShowModal(true);
          }}

          onSelectSlot={(slot: any) => {
            setEditingID(null);
            setForm({
              name: "",
              date: moment(slot.start).format("YYYY-MM-DD"),
              start_at: moment(slot.start).format("HH:mm"),
              working_hours: 8,
              nurseID: "",
              roomID: "",
              color: "#3174ad",
            });
            setShowModal(true);
          }}

          step={30}
          timeslots={2}

          min={moment().startOf("day").toDate()}
          max={moment().endOf("day").toDate()}

          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.resource.color || "#3174ad",
              borderRadius: "6px",
              border: "none",
              padding: "2px",
              fontSize: "12px",
            },
          })}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingID ? "Edit Schedule" : "Create Schedule"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Label>Task</Form.Label>
              <Form.Select
                value={form.name}
                onChange={(e) => {
                  const t = TASK_OPTIONS.find(x => x.name === e.target.value);
                  setForm({
                    ...form,
                    name: e.target.value,
                    color: t?.color || "#3174ad",
                  });
                }}
              >
                <option value="">Select Task</option>
                {TASK_OPTIONS.map(t => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Nurse</Form.Label>
              <Form.Select
                value={form.nurseID}
                onChange={(e) =>
                  setForm({ ...form, nurseID: e.target.value })
                }
              >
                <option value="">Select Nurse</option>
                {nurses.map(n => (
                  <option key={n.nurseID} value={n.nurseID}>
                    {n.fullName}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={4}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </Col>

            <Col md={4}>
              <Form.Label>Start</Form.Label>
              <Form.Control
                type="time"
                value={form.start_at}
                onChange={(e) =>
                  setForm({ ...form, start_at: e.target.value })
                }
              />
            </Col>

            <Col md={4}>
              <Form.Label>Hours</Form.Label>
              <Form.Control
                type="number"
                value={form.working_hours}
                onChange={(e) =>
                  setForm({
                    ...form,
                    working_hours: Number(e.target.value),
                  })
                }
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          {editingID && (
            <Button variant="danger" onClick={deleteSchedule}>
              Delete
            </Button>
          )}

          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>

          <Button variant="primary" onClick={saveSchedule}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}