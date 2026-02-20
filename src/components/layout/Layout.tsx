import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

/**
 * Layout-Komponente: Gemeinsames Seitenlayout für alle Routen.
 *
 * Besteht aus der Navigationsleiste (Navbar) und dem Outlet,
 * welcher den Inhalt der jeweils aktiven Route rendert.
 * Wird als übergeordnete Route in App.tsx eingesetzt.
 */
export const Layout = () => {
  return (
    <>
      {/* Globale Navigationsleiste am oberen Seitenrand */}
      <Navbar />

      {/* Outlet: Platzhalter für die aktive Unterseite (Home oder Weather) */}
      <Outlet />
    </>
  );
};
