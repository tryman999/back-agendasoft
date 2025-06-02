import express from "express";
import categoriasController from "../controllers/categoriasController.js";

const router = express.Router();

router.get("/categorias", categoriasController.getAllCategorias);

router.post("/categorias", categoriasController.createCategoria);

export default router;
