import { createBrowserRouter } from "react-router";
import { DesktopLayout } from "./components/DesktopLayout";
import { Home } from "./pages/Home";
import { MiRutina } from "./pages/MiRutina";
import { Ejercicios } from "./pages/Ejercicios";
import { DetalleEjercicio } from "./pages/DetalleEjercicio";
import { SesionActiva } from "./pages/SesionActiva";

export const router = createBrowserRouter([
  {
    path: "/",
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
]);
