// routes/clientes.js
import express from "express";
import clientesController from "../controllers/clientesController.js";

const router = express.Router();

router.get("/clientes", clientesController.getAllClientes);
router.get("/clientes/:id", clientesController.getClienteById);
router.get("/clientes/tecnico", clientesController.getTecnicos);
router.post("/clientes", clientesController.createCliente);
router.put("/clientes/:id", clientesController.updateCliente);
router.delete("/clientes/:id", clientesController.deleteCliente);

router.post("/crearServicioTecnico", clientesController.crearServicioTecnico);
router.get("/getServicioTecnico", clientesController.getServicioTecnico);
router.get(
  "/getServicioTecnico/:id",
  clientesController.getServicioTecnicoByTecnico
);
router.get("/getDateTecnico/:id", clientesController.getDateTecnicoByTecnico);

export default router;
