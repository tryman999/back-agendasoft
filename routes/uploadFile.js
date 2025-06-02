// routes/entregas.js
import express from "express";
import uploadFileController from "./../controllers/uploadController.js";
import upload from "../config/multerConfig.js"; // Asegúrate de que la ruta sea correcta

const router = express.Router();

//router.get("/upload", uploadFileController.getAllEntregas);
router.post(
  "/upload",
  upload.single("imagen"),
  uploadFileController.uploadSingleImage
);

router.post("/email/:email", uploadFileController.email);

export default router;
