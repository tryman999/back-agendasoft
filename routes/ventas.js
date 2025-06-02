// routes/ventas.js
import express from "express";
import ventasController from "../controllers/ventasController.js";

const router = express.Router();

router.get("/ventas", ventasController.getAllVentas);
router.get("/ventas/:id", ventasController.getVentaById);
router.post("/ventas", ventasController.createVenta);
router.post("/ventasDetalles", ventasController.createVentaDetalle);
router.post("/cambios", ventasController.createCambio);
router.get("/cambios", ventasController.getAllCambios);
// router.put('/ventas/:id', ventasController.updateVenta);
// router.delete('/ventas/:id', ventasController.deleteVenta);

export default router;
