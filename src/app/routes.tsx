import { createBrowserRouter } from "react-router";
import { DesktopLayout } from "./components/DesktopLayout";
import { KinesiologoLayout } from "./components/KinesiologoLayout";
import { PatientLayout } from "./components/PatientLayout";
import { Home } from "./pages/Home";
import { MiRutina } from "./pages/MiRutina";
import { Ejercicios } from "./pages/Ejercicios";
import { DetalleEjercicio } from "./pages/DetalleEjercicio";
import { SesionActiva } from "./pages/SesionActiva";
import { Login } from "./pages/Login";
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
    path: "/login",
    Component: Login,
  },
  {
    path: "/registro",
    Component: Register,
  },
  {
    path: "/app",
    Component: DesktopLayout,
    children: [
      { index: true, Component: Home },
      { path: "mi-rutina", Component: MiRutina },
      { path: "ejercicios", Component: Ejercicios },
      { path: "ejercicios/:id", Component: DetalleEjercicio },
    ],
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
      { path: "calendario", Component: PatientCalendar },
      { path: "historial", Component: SessionHistory },
    ],
  },
]);
