import { createBrowserRouter } from "react-router";
import { KinesiologoLayout } from "./components/KinesiologoLayout";
import { PatientLayout } from "./components/PatientLayout";
import { PatientHome } from "./pages/PatientHome";
import { SesionActiva } from "./pages/SesionActiva";
import { PatientLogin } from "./pages/LoginPaciente";
import { KinesiologoLogin } from "./pages/LoginKinesiologo";
import { Register } from "./pages/Register";
import { Landing } from "./pages/Landing";
import { PatientList } from "./pages/kinesiologo/PatientList";
import { PatientDetail } from "./pages/kinesiologo/PatientDetail";
import { ExerciseLibrary } from "./pages/kinesiologo/ExerciseLibrary";
import { PatientCalendar } from "./pages/paciente/PatientCalendar";
import { SessionHistory } from "./pages/paciente/SessionHistory";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login/paciente",
    Component: PatientLogin,
  },
  {
    path: "/login/kinesiologo",
    Component: KinesiologoLogin,
  },
  {
    path: "/registro",
    Component: Register,
  },
  {
    path: "/sesion/:id",
    Component: SesionActiva,
  },
  {
    path: "/kinesiologo",
    Component: KinesiologoLayout,
    children: [
      { path: "pacientes", Component: PatientList },
      { path: "pacientes/:id", Component: PatientDetail },
      { path: "ejercicios", Component: ExerciseLibrary },
    ],
  },
  {
    path: "/paciente",
    Component: PatientLayout,
    children: [
      { index: true, Component: PatientHome },
      { path: "calendario", Component: PatientCalendar },
      { path: "historial", Component: SessionHistory },
    ],
  },
]);
