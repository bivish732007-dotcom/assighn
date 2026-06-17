// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("records");

  // current user from localStorage / prop
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userEmail = storedUser?.email || user?.email || "";

  // Medical record form
  const [recordForm, setRecordForm] = useState({
    patientName: user?.name || "",
    doctorName: "",
    hospitalName: "",
    department: "Cardiology",
    description: "",
    date: "",
  });

  // Medicine form
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    dosage: "",
    schedule: "Morning",
    status: "Pending",
  });

  // Lab report form
  const [reportForm, setReportForm] = useState({
    title: "",
    type: "Blood Test",
    date: "",
    fileName: "",
    notes: "",
  });

  // actual file object
  const [reportFile, setReportFile] = useState(null);

  // Appointment form
  const [appointmentForm, setAppointmentForm] = useState({
    doctorName: "",
    department: "Cardiology",
    hospitalName: "",
    date: "",
    time: "",
    kind: "New",
  });

  const [formError, setFormError] = useState("");

  // Data lists (backend)
  const [records, setRecords] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // AI Assistant
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  // Dashboard stats
  const totalRecords = records.length;
  const activeMedicines = medicines.filter((m) => m.status === "Pending")
    .length;
  const totalReports = reports.length;
  const upcomingAppointments = appointments.length;

  // ===== LOAD DATA FROM BACKEND =====

  // Records
  useEffect(() => {
    if (!userEmail) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/records?userEmail=${encodeURIComponent(
            userEmail
          )}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Failed to load records:", data);
          return;
        }
        setRecords(data);
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    };

    fetchRecords();
  }, [userEmail]);

  // Medicines
  useEffect(() => {
    if (!userEmail) return;

    const fetchMedicines = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/medicines?userEmail=${encodeURIComponent(
            userEmail
          )}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Failed to load medicines:", data);
          return;
        }
        setMedicines(data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      }
    };

    fetchMedicines();
  }, [userEmail]);

  // Lab reports
  useEffect(() => {
    if (!userEmail) return;

    const fetchReports = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/labreports?userEmail=${encodeURIComponent(
            userEmail
          )}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Failed to load lab reports:", data);
          return;
        }
        setReports(data);
      } catch (err) {
        console.error("Error fetching lab reports:", err);
      }
    };

    fetchReports();
  }, [userEmail]);

  // Appointments
  useEffect(() => {
    if (!userEmail) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/appointments?userEmail=${encodeURIComponent(
            userEmail
          )}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Failed to load appointments:", data);
          return;
        }
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [userEmail]);

  // ========== Records (backend) ==========

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    const {
      patientName,
      doctorName,
      hospitalName,
      department,
      description,
      date,
    } = recordForm;

    if (!userEmail) {
      setFormError("Please login again. User email missing.");
      return;
    }

    if (
      !patientName ||
      !doctorName ||
      !hospitalName ||
      !department ||
      !description ||
      !date
    ) {
      setFormError("Please fill all medical record fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          patientName,
          doctorName,
          hospitalName,
          department,
          description,
          date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to save record");
        return;
      }

      setRecords((prev) => [data, ...prev]);

      setRecordForm({
        patientName: user?.name || "",
        doctorName: "",
        hospitalName: "",
        department: "Cardiology",
        description: "",
        date: "",
      });

      setFormError("");
    } catch (err) {
      console.error("Create record error:", err);
      setFormError("Server error. Please try again.");
    }
  };

  const deleteRecord = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/records/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Delete record failed:", data);
        return;
      }

      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  // ========== Medicines (backend) ==========

  const handleMedicineSubmit = async (e) => {
    e.preventDefault();
    const { name, dosage, schedule, status } = medicineForm;

    if (!userEmail) {
      setFormError("Please login again. User email missing.");
      return;
    }

    if (!name || !dosage || !schedule) {
      setFormError("Please fill all medicine fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/medicines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          name,
          dosage,
          schedule,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to save medicine");
        return;
      }

      setMedicines((prev) => [data, ...prev]);

      setMedicineForm({
        name: "",
        dosage: "",
        schedule: "Morning",
        status: "Pending",
      });

      setFormError("");
    } catch (err) {
      console.error("Create medicine error:", err);
      setFormError("Server error. Please try again.");
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/medicines/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Delete medicine failed:", data);
        return;
      }

      setMedicines((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Error deleting medicine:", err);
    }
  };

  const toggleMedicineStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/medicines/${id}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Toggle status failed:", data);
        return;
      }

      setMedicines((prev) => prev.map((m) => (m._id === id ? data : m)));
    } catch (err) {
      console.error("Error toggling medicine status:", err);
    }
  };

  // ========== Lab Reports (backend + file upload) ==========

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const { title, type, date, fileName, notes } = reportForm;

    if (!userEmail) {
      setFormError("Please login again. User email missing.");
      return;
    }

    if (!title || !type || !date) {
      setFormError("Please fill title, type and date for the report");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userEmail", userEmail);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("date", date);
      formData.append("notes", notes);
      formData.append("fileName", fileName || "");

      if (reportFile) {
        formData.append("file", reportFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/labreports/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to save lab report");
        return;
      }

      setReports((prev) => [data, ...prev]);

      setReportForm({
        title: "",
        type: "Blood Test",
        date: "",
        fileName: "",
        notes: "",
      });
      setReportFile(null);
      setFormError("");
    } catch (err) {
      console.error("Create lab report error:", err);
      setFormError("Server error. Please try again.");
    }
  };

  const deleteReport = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/labreports/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Delete lab report failed:", data);
        return;
      }

      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting lab report:", err);
    }
  };

  // ========== Appointments (backend) ==========

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const { doctorName, department, hospitalName, date, time, kind } =
      appointmentForm;

    if (!userEmail) {
      setFormError("Please login again. User email missing.");
      return;
    }

    if (!doctorName || !department || !hospitalName || !date || !time) {
      setFormError("Please fill all appointment fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          doctorName,
          department,
          hospitalName,
          date,
          time,
          kind,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to save appointment");
        return;
      }

      setAppointments((prev) => [data, ...prev]);

      setAppointmentForm({
        doctorName: "",
        department: "Cardiology",
        hospitalName: "",
        date: "",
        time: "",
        kind: "New",
      });

      setFormError("");
    } catch (err) {
      console.error("Create appointment error:", err);
      setFormError("Server error. Please try again.");
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Delete appointment failed:", data);
        return;
      }

      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  // ========== AI Assistant (demo) ==========

  const handleAskAI = () => {
    if (!question.trim()) {
      setAiAnswer("Please ask a general health or wellness question.");
      return;
    }
    setAiAnswer(
      "This is a demo response. In your full MERN app this box will use Gemini / Google AI Studio to provide general health guidance (not a diagnosis)."
    );
  };

  // ========== Form renderer ==========

  const renderForm = () => {
    switch (activeTab) {
      case "records":
        return (
          <form onSubmit={handleRecordSubmit} className="form-grid">
            <div className="form-row">
              <label className="form-label">Patient Name</label>
              <input
                className="form-input"
                value={recordForm.patientName}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, patientName: e.target.value })
                }
                placeholder="e.g. Bivish S"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Doctor Name</label>
              <input
                className="form-input"
                value={recordForm.doctorName}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, doctorName: e.target.value })
                }
                placeholder="e.g. Dr. Kumar"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Hospital</label>
              <input
                className="form-input"
                value={recordForm.hospitalName}
                onChange={(e) =>
                  setRecordForm({
                    ...recordForm,
                    hospitalName: e.target.value,
                  })
                }
                placeholder="e.g. ABC Medical Center"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={recordForm.department}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, department: e.target.value })
                }
              >
                <option>Cardiology</option>
                <option>Orthopedics</option>
                <option>Neurology</option>
                <option>Gynecology</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={recordForm.date}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, date: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label className="form-label">Medical History / Notes</label>
              <textarea
                className="form-textarea"
                value={recordForm.description}
                onChange={(e) =>
                  setRecordForm({
                    ...recordForm,
                    description: e.target.value,
                  })
                }
                placeholder="Diagnosis, symptoms, prescriptions..."
              />
            </div>
            {formError && <p className="error-text">{formError}</p>}
            <button type="submit" className="btn-primary">
              Add Record
            </button>
          </form>
        );

      case "medicines":
        return (
          <form onSubmit={handleMedicineSubmit} className="form-grid">
            <div className="form-row">
              <label className="form-label">Medicine Name</label>
              <input
                className="form-input"
                value={medicineForm.name}
                onChange={(e) =>
                  setMedicineForm({ ...medicineForm, name: e.target.value })
                }
                placeholder="e.g. Metformin"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Dosage</label>
              <input
                className="form-input"
                value={medicineForm.dosage}
                onChange={(e) =>
                  setMedicineForm({
                    ...medicineForm,
                    dosage: e.target.value,
                  })
                }
                placeholder="e.g. 500mg"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Schedule</label>
              <select
                className="form-select"
                value={medicineForm.schedule}
                onChange={(e) =>
                  setMedicineForm({
                    ...medicineForm,
                    schedule: e.target.value,
                  })
                }
              >
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={medicineForm.status}
                onChange={(e) =>
                  setMedicineForm({
                    ...medicineForm,
                    status: e.target.value,
                  })
                }
              >
                <option>Pending</option>
                <option>Taken</option>
              </select>
            </div>
            {formError && <p className="error-text">{formError}</p>}
            <button type="submit" className="btn-primary">
              Add Medicine
            </button>
          </form>
        );

      case "reports":
        return (
          <form onSubmit={handleReportSubmit} className="form-grid">
            <div className="form-row">
              <label className="form-label">Report Title</label>
              <input
                className="form-input"
                value={reportForm.title}
                onChange={(e) =>
                  setReportForm({ ...reportForm, title: e.target.value })
                }
                placeholder="e.g. Blood Test – June"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Report Type</label>
              <select
                className="form-select"
                value={reportForm.type}
                onChange={(e) =>
                  setReportForm({ ...reportForm, type: e.target.value })
                }
              >
                <option>Blood Test</option>
                <option>X-ray</option>
                <option>ECG</option>
                <option>Scan</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={reportForm.date}
                onChange={(e) =>
                  setReportForm({ ...reportForm, date: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                Upload Prescription / Report (optional)
              </label>
              <input
                type="file"
                className="form-input"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  setReportFile(file || null);
                  setReportForm({
                    ...reportForm,
                    fileName: file ? file.name : "",
                  });
                }}
              />
              {reportForm.fileName && (
                <span className="item-meta">
                  Selected file: {reportForm.fileName}
                </span>
              )}
            </div>

            <div className="form-row">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={reportForm.notes}
                onChange={(e) =>
                  setReportForm({ ...reportForm, notes: e.target.value })
                }
                placeholder="Any important observations..."
              />
            </div>

            {formError && <p className="error-text">{formError}</p>}

            <button type="submit" className="btn-primary">
              Add Report
            </button>
          </form>
        );

      case "appointments":
        return (
          <form onSubmit={handleAppointmentSubmit} className="form-grid">
            <div className="form-row">
              <label className="form-label">Doctor Name</label>
              <input
                className="form-input"
                value={appointmentForm.doctorName}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    doctorName: e.target.value,
                  })
                }
                placeholder="e.g. Dr. Kumar"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={appointmentForm.department}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    department: e.target.value,
                  })
                }
              >
                <option>Cardiology</option>
                <option>Orthopedics</option>
                <option>Neurology</option>
                <option>Gynecology</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Hospital / Clinic</label>
              <input
                className="form-input"
                value={appointmentForm.hospitalName}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    hospitalName: e.target.value,
                  })
                }
                placeholder="e.g. ABC Medical Center"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={appointmentForm.date}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    date: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-row">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-input"
                value={appointmentForm.time}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    time: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-row">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={appointmentForm.kind}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    kind: e.target.value,
                  })
                }
              >
                <option>New</option>
                <option>Follow-up</option>
              </select>
            </div>
            {formError && <p className="error-text">{formError}</p>}
            <button type="submit" className="btn-primary">
              Add Appointment
            </button>
          </form>
        );

      case "ai":
        return (
          <>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginBottom: "0.5rem",
              }}
            >
              Ask general health questions. This simulates the AI Health
              Assistant (Gemini API).
            </p>
            <div className="form-grid">
              <div className="form-row">
                <label className="form-label">Question</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Basic tips to control blood pressure?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={handleAskAI}
              >
                Ask AI
              </button>
            </div>
            {aiAnswer && <div className="ai-box">{aiAnswer}</div>}
          </>
        );

      default:
        return null;
    }
  };

  // ========== List renderer ==========

  const renderList = () => {
    switch (activeTab) {
      case "records":
        return records.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            No medical records yet. Use the form to add patient records.
          </p>
        ) : (
          <ul className="list">
            {records.map((r) => (
              <li key={r._id} className="list-item">
                <div>
                  <div className="item-pill-row">
                    <span className="pill">{r.department}</span>
                    <span className="pill-secondary">{r.hospitalName}</span>
                  </div>
                  <div className="item-title">
                    {r.patientName} – {r.doctorName}
                  </div>
                  <div className="item-meta">Date: {r.date}</div>
                  <div className="item-meta">Notes: {r.description}</div>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => deleteRecord(r._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        );

      case "medicines":
        return medicines.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            No medicines added. Use the form to track medicine schedule.
          </p>
        ) : (
          <ul className="list">
            {medicines.map((m) => (
              <li key={m._id} className="list-item">
                <div>
                  <div className="item-pill-row">
                    <span className="pill">
                      {m.schedule} • {m.status}
                    </span>
                  </div>
                  <div className="item-title">
                    {m.name} – {m.dosage}
                  </div>
                  <div className="item-meta">
                    Created:{" "}
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem",
                  }}
                >
                  <button
                    className="btn-delete"
                    onClick={() => toggleMedicineStatus(m._id)}
                  >
                    Toggle Status
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteMedicine(m._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        );

      case "reports":
        return reports.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            No lab reports uploaded. Use the form to add report details.
          </p>
        ) : (
          <ul className="list">
            {reports.map((r) => (
              <li key={r._id} className="list-item">
                <div>
                  <div className="item-pill-row">
                    <span className="pill">{r.type}</span>
                    {r.filePath ? (
                      <span className="pill-secondary">
                        <a
                          href={`${API_BASE_URL}${r.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {r.fileName || "View file"}
                        </a>
                      </span>
                    ) : (
                      r.fileName && (
                        <span className="pill-secondary">{r.fileName}</span>
                      )
                    )}
                  </div>
                  <div className="item-title">{r.title}</div>
                  <div className="item-meta">Date: {r.date}</div>
                  {r.notes && (
                    <div className="item-meta">Notes: {r.notes}</div>
                  )}
                </div>
                <button
                  className="btn-delete"
                  onClick={() => deleteReport(r._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        );

      case "appointments":
        return appointments.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            No appointments scheduled. Use the form to add a new appointment.
          </p>
        ) : (
          <ul className="list">
            {appointments.map((a) => (
              <li key={a._id} className="list-item">
                <div>
                  <div className="item-pill-row">
                    <span className="pill">{a.department}</span>
                    <span className="pill-secondary">{a.kind}</span>
                  </div>
                  <div className="item-title">
                    {a.doctorName} – {a.hospitalName}
                  </div>
                  <div className="item-meta">
                    {a.date} at {a.time}
                  </div>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => deleteAppointment(a._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        );

      case "ai":
        return (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            Ask a question in the AI assistant section to see a sample
            response.
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">
          HealthSync Dashboard – Hi, {user?.name || "Patient"}
        </h1>
        <p className="hero-subtitle">
          Manage your medical records, medicines, lab reports, appointments and
          AI‑based health assistance in one place.
        </p>
        <div className="hero-tags">
          <span className="hero-tag">Medical Records</span>
          <span className="hero-tag">Medicine Tracking</span>
          <span className="hero-tag">Lab Reports</span>
          <span className="hero-tag">Appointments</span>
          <span className="hero-tag">AI Health Assistant</span>
        </div>
      </section>

      {/* Dashboard stats */}
      <section>
        <h2 className="section-title">Dashboard Summary</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{totalRecords}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Medicines</div>
            <div className="stat-value">{activeMedicines}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Lab Reports</div>
            <div className="stat-value">{totalReports}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Upcoming Appointments</div>
            <div className="stat-value">{upcomingAppointments}</div>
          </div>
        </div>
      </section>

      {/* Module tabs */}
      <section style={{ marginTop: "0.75rem" }}>
        <div className="nav-menu">
          <span
            className={`nav-item ${activeTab === "records" ? "active" : ""}`}
            onClick={() => {
              setFormError("");
              setActiveTab("records");
            }}
          >
            Records
          </span>
          <span
            className={`nav-item ${activeTab === "medicines" ? "active" : ""}`}
            onClick={() => {
              setFormError("");
              setActiveTab("medicines");
            }}
          >
            Medicines
          </span>
          <span
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => {
              setFormError("");
              setActiveTab("reports");
            }}
          >
            Lab Reports
          </span>
          <span
            className={`nav-item ${
              activeTab === "appointments" ? "active" : ""
            }`}
            onClick={() => {
              setFormError("");
              setActiveTab("appointments");
            }}
          >
            Appointments
          </span>
          <span
            className={`nav-item ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => {
              setFormError("");
              setActiveTab("ai");
            }}
          >
            AI Assistant
          </span>
        </div>
      </section>

      {/* Main area */}
      <section className="main-grid">
        <div className="card">
          <h2 className="section-title">
            {activeTab === "records"
              ? "Medical Record Management"
              : activeTab === "medicines"
              ? "Medicine Tracking"
              : activeTab === "reports"
              ? "Lab Report Uploads"
              : activeTab === "appointments"
              ? "Appointment & Follow‑up"
              : "AI Health Assistant"}
          </h2>
          {renderForm()}
        </div>

        <div className="card">
          <h2 className="section-title">Recent Items</h2>
          {renderList()}
        </div>
      </section>
    </>
  );
}

export default Dashboard;