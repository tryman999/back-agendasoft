// routes/usuarios.js
import express from "express";
import usuariosController from "../controllers/usuariosController.js";

const router = express.Router();

router.post("/usuarios", usuariosController.createUser);
router.get("/usuarios/email/:email", usuariosController.getUserByEmail);
router.get("/usuarios", usuariosController.getUsers);
router.patch(
  "/usuarios/:usuario_id/status",
  usuariosController.updateUserStatus
);

export default router;
