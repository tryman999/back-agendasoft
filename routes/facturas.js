// routes/facturas.js
import express from "express";
import facturasController from "../controllers/facturasController.js";

const router = express.Router();

router.get("/facturas/:id", facturasController.getFacturaById);
router.post("/facturas", facturasController.createFactura);

export default router;
