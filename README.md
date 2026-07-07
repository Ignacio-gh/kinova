# Kinova

Aplicación web de asistencia biomecánica para rehabilitación física domiciliaria, desarrollada por **SANMAIN S.A.** como proyecto universitario en UADE.

## ¿Qué es Kinova?

Kinova es un MVP que utiliza visión artificial para mapear los puntos articulares del usuario en tiempo real mientras realiza sus ejercicios de rehabilitación. El sistema emite alertas preventivas si detecta una postura incorrecta antes de que ocurra una lesión, reemplazando el modelo tradicional de hojas de papel o videos genéricos.

## Problema que resuelve

Los pacientes en rehabilitación ambulatoria ejecutan sus rutinas solos en casa, sin supervisión profesional. Esto genera:

- Re-lesiones por mala ejecución
- Abandono del protocolo por inseguridad y desmotivación
- Doble gasto económico en sesiones no planificadas

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Hook Form

## Requisitos previos

- [Node.js](https://nodejs.org) (LTS)
- [pnpm](https://pnpm.io)

```bash
npm install -g pnpm
```

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd kinova-app

# Instalar dependencias
pnpm install

# Correr en desarrollo
pnpm dev
```

La app queda disponible en `http://localhost:5173`

## Estructura del proyecto

```
src/
  components/     # Componentes reutilizables (Layout, Sidebar, etc.)
  pages/          # Páginas de la app (Home, Ejercicios, MiRutina, etc.)
  context/        # Contextos globales (ThemeContext)
  imports/        # Assets e imágenes
  styles/         # Estilos globales
```

## Equipo

SANMAIN S.A. — Proyecto universitario UADE
Integrantes: Ignacio Almanza, Agustin Fernandez, Ivan Cupito, Santiago Torres, Santiago Valentino Rossi y Maria Paz Traversi.
