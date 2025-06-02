// routes/entregas.js
import express from "express";
import entregasController from "../controllers/entregasController.js";

const router = express.Router();

router.get("/entregas", entregasController.getAllEntregas);
router.get("/entregas/:id", entregasController.getEntregaById);
router.post("/entregas", entregasController.createEntrega);
//router.put("/entregas/:id", entregasController.updateEntrega);
router.delete("/entregas/:id", entregasController.deleteEntrega);
router.put("/entregas/:id", entregasController.updateEstado);
router.put(
  "/citas/update_evidencia/:id",
  entregasController.updateEvidenciaCita
);
router.put("/citas/update", entregasController.updateCita);

router.delete("/citas/delete/:id", entregasController.deleteCita);
export default router;
