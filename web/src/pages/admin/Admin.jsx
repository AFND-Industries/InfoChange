/**
 * Punto de entrada de la ruta /admin. Antes envolvia la pantalla en un
 * AdminProvider que descargaba la base de datos entera y recalculaba las
 * metricas en el navegador; ahora las agrega el servidor y la pantalla solo
 * necesita el hook useAdminOverview.
 */
export { default } from "./AdminPage";
