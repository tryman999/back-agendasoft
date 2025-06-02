// routes/roles.js
import express from "express";
import rolesController from "../controllers/rolesController.js";

const router = express.Router();

router.get("/roles", rolesController.getAllRoles);

export default router;
