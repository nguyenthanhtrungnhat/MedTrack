import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS with Popper
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import AdminScreen from "./Admin/Admin";
import BedDetails from "./BedDetails";
import BedsInRoom from "./BedsInRoom";
import DoctorScreen from "./Doctor/DoctorScreen";
import HomePage from "./HomePage";
import HospitalServices from "./HospitalServices";
import LoginScreen from "./Login/Login";
import Register from "./Login/Register";
import DailyCheckingForm from "./Nurse/DailyCheckingForm";
import NurseScreen from "./Nurse/NurseScreen";
import ShiftChange from "./Nurse/ShiftChange";
import CompletePatientForm from "./Patient/CompletePatientForm";
import MakeAppointment from "./Patient/MakeAppointment";
import PatientScreen from "./Patient/PatientScreen";
import Schedule from "./Nurse/Schedule";
import Services from "./Services";
import AllAppointment from './Doctor/AllAppointment';
import AllShiftRequest from './Doctor/AllShiftRequest';
import TestResult from './Doctor/TestResult';
import "bootstrap/dist/css/bootstrap.min.css";
import MedicinesList from './Medicine/MedicineList';
import PrescriptionForm from './Doctor/Prescription/PrescriptionForm';
import SideBarLayout from './Layout/SideBarLayout';
import PrescriptionList from './Doctor/Prescription/PrescriptionList';
import PrescriptionDetail from './Doctor/Prescription/PrescriptionDetail';
import SideBarLayoutV2 from './Layout/SideBarLayoutV2';
import DoctorRoute from './routes/DoctorRoute';
import NurseRoute from './routes/NurseRoute';
import PatientRoute from './routes/PatientRoute';
import AdminRoute from './routes/AdminRoute';
import Layout from './Layout/Layout';

const router = createBrowserRouter([
  {
    path: "/",
    children: [{
      path: "/",
      element: <Layout />, // Wrap children with layout
      children: [
        { index: true, element: <HomePage /> },
        { path: "login", element: <LoginScreen /> },
        { path: "register", element: <Register /> },
        { path: "services", element: <Services /> },
        { path: "hservices", element: <HospitalServices /> },

      ],
    },],
  },
  {
    path: "/home",
    element: <NurseRoute />,
    children: [

      // Pages using normal Layout
      {
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },

          { path: "services", element: <Services /> },
          { path: "hservices", element: <HospitalServices /> }
        ]
      },

      // Pages using SidebarLayout
      {
        element: <SideBarLayout />,
        children: [
          { path: "nurse-profile", element: <NurseScreen /> },
          { path: "beds-in-room/:roomID", element: <BedsInRoom /> },
          { path: "shift-change", element: <ShiftChange /> },
          { path: "daily-checking", element: <DailyCheckingForm /> },
          { path: "schedule", element: <Schedule /> }
        ]
      },
      // Pages using SidebarLayoutV2
      {
        element: <SideBarLayoutV2 />,
        children: [
          { path: "bed-details/:patientID", element: <BedDetails /> }
        ]
      }

    ]
  },
  {
    path: "/doctor",
    element: <DoctorRoute />,
    children: [

      // Pages using normal Layout
      {
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },

          { path: "services", element: <Services /> },
          { path: "hservices", element: <HospitalServices /> }
        ]
      },

      // Pages using SidebarLayout
      {
        element: <SideBarLayout />,
        children: [
          { path: "doctor-profile", element: <DoctorScreen /> },
          { path: "beds-in-room/:roomID", element: <BedsInRoom /> },
          { path: "allappointment", element: <AllAppointment /> },
          { path: "allshiftrequest", element: <AllShiftRequest /> },
          { path: "medicine-list", element: <MedicinesList /> },
          { path: "testresultlist", element: <TestResult /> },
          { path: "prescription-form", element: <PrescriptionForm /> },
          { path: "prescriptions", element: <PrescriptionList /> },
          { path: "prescriptions/:id", element: <PrescriptionDetail /> }
        ]
      },
      // Pages using SidebarLayoutV2
      {
        element: <SideBarLayoutV2 />,
        children: [
          { path: "bed-details/:patientID", element: <BedDetails /> }
        ]
      }
    ]
  },
  {
    path: "/patient",
    element: <PatientRoute />, // Wrap in ProtectedRoute
    children: [
      {
        path: "/patient", element: <Layout />, children: [
          { index: true, element: <HomePage /> },
          { path: "make-appointment", element: <MakeAppointment /> },
          { path: "patient-profile", element: <PatientScreen /> },
          { path: "services", element: <Services /> },
          { path: "hservices", element: <HospitalServices /> },
          { path: "completedata", element: <CompletePatientForm /> },
        ]
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <Layout />,
        children: [
          { index: true, element: <AdminScreen /> },
        ],
      },
    ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
