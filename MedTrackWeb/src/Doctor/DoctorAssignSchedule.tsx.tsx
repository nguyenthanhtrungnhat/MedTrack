import { useEffect, useState } from "react";
import axios from "axios";

import {
  Calendar,
  momentLocalizer,
  View,
} from "react-big-calendar";

import moment from "moment";

import {
  Modal,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";

import { toast } from "react-toastify";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

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
  const token = sessionStorage.getItem("token");

  const [events, setEvents] = useState<any[]>([]);
  const [nurses, setNurses] = useState<NurseType[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [editingID, setEditingID] =
    useState<number | null>(null);

  const [date, setDate] = useState(new Date());

  const [view, setView] =
    useState<View>("week");

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
  }, []);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadNurses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/schedules/nurses",
        authHeader
      );

      setNurses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSchedules = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/schedules",
        authHeader
      );

      const mapped = res.data.map(
        (s: ScheduleType) => {
          const start = new Date(
            `${s.date.split("T")[0]}T${s.start_at}`
          );

          const end = new Date(start);

          end.setHours(
            end.getHours() +
              Number(s.working_hours)
          );

          return {
            id: s.scheduleID,
            title: `${s.fullName} - ${s.name}`,
            start,
            end,
            resource: s,
          };
        }
      );

      setEvents(mapped);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to load schedules"
      );
    }
  };

  const resetForm = () => {
    setEditingID(null);

    setForm({
      name: "",
      date: "",
      start_at: "",
      working_hours: 8,
      nurseID: "",
      roomID: "",
      color: "#3174ad",
    });
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (event: any) => {
    const s = event.resource;

    setEditingID(s.scheduleID);

    setForm({
      name: s.name,
      date: s.date.split("T")[0],
      start_at: s.start_at.substring(
        0,
        5
      ),
      working_hours: s.working_hours,
      nurseID: String(s.nurseID),
      roomID: String(s.roomID),
      color: s.color || "#3174ad",
    });

    setShowModal(true);
  };

  const handleSelectSlot = ({
    start,
  }: any) => {
    resetForm();

    setForm({
      name: "",
      date: moment(start).format(
        "YYYY-MM-DD"
      ),
      start_at: moment(start).format(
        "HH:mm"
      ),
      working_hours: 8,
      nurseID: "",
      roomID: "",
      color: "#3174ad",
    });

    setShowModal(true);
  };

  const saveSchedule = async () => {
    if (
      !form.name ||
      !form.nurseID ||
      !form.roomID
    ) {
      toast.warning(
        "Please fill all required fields"
      );
      return;
    }

    try {
      const payload = {
        ...form,
        nurseID: Number(form.nurseID),
        roomID: Number(form.roomID),
      };

      if (editingID) {
        await axios.put(
          `http://localhost:3000/schedules/${editingID}`,
          payload,
          authHeader
        );

        toast.success(
          "Schedule updated"
        );
      } else {
        await axios.post(
          "http://localhost:3000/schedules",
          payload,
          authHeader
        );

        toast.success(
          "Schedule created"
        );
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

    if (
      !window.confirm(
        "Delete this schedule?"
      )
    )
      return;

    try {
      await axios.delete(
        `http://localhost:3000/schedules/${editingID}`,
        authHeader
      );

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
      <div className="card-header blueBg text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          Nurse Schedule Management
        </h5>

        <Button
          variant="light"
          onClick={openCreate}
        >
          + Add Schedule
        </Button>
      </div>

      <div
        className="p-3"
        style={{ height: 850 }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          startAccessor="start"
          endAccessor="end"
          selectable
          popup
          views={[
            "month",
            "week",
            "day",
            "agenda",
          ]}
          onNavigate={(newDate) =>
            setDate(newDate)
          }
          onView={(newView) =>
            setView(newView)
          }
          onSelectEvent={openEdit}
          onSelectSlot={
            handleSelectSlot
          }
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                event.resource.color ||
                "#3174ad",
              borderRadius: "5px",
              border: "none",
            },
          })}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() =>
          setShowModal(false)
        }
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingID
              ? "Edit Schedule"
              : "Create Schedule"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Label>
                Schedule Name
              </Form.Label>

              <Form.Control
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </Col>

            <Col md={6}>
              <Form.Label>
                Nurse
              </Form.Label>

              <Form.Select
                value={form.nurseID}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nurseID:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Nurse
                </option>

                {nurses.map((n) => (
                  <option
                    key={n.nurseID}
                    value={n.nurseID}
                  >
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
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
              />
            </Col>

            <Col md={4}>
              <Form.Label>
                Start Time
              </Form.Label>

              <Form.Control
                type="time"
                value={form.start_at}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_at:
                      e.target.value,
                  })
                }
              />
            </Col>

            <Col md={4}>
              <Form.Label>
                Hours
              </Form.Label>

              <Form.Control
                type="number"
                value={
                  form.working_hours
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    working_hours:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Label>
                Room ID
              </Form.Label>

              <Form.Control
                type="number"
                value={form.roomID}
                onChange={(e) =>
                  setForm({
                    ...form,
                    roomID:
                      e.target.value,
                  })
                }
              />
            </Col>

            <Col md={6}>
              <Form.Label>
                Color
              </Form.Label>

              <Form.Control
                type="color"
                value={form.color}
                onChange={(e) =>
                  setForm({
                    ...form,
                    color:
                      e.target.value,
                  })
                }
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          {editingID && (
            <Button
              variant="danger"
              onClick={deleteSchedule}
            >
              Delete
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() =>
              setShowModal(false)
            }
          >
            Close
          </Button>

          <Button
            variant="primary"
            onClick={saveSchedule}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

