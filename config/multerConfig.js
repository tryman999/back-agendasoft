import multer, { diskStorage } from "multer";
import { extname } from "path";

// Configuración del almacenamiento en disco
const storage = diskStorage({
  destination: (req, file, cb) => {
    // La carpeta donde se guardarán las imágenes
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});

// Filtro de archivos para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Acepta el archivo
  } else {
    // Rechaza el archivo con un mensaje de error
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y GIF."
      ),
      false
    );
  }
};

// Configuración final de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de tamaño a 5MB
  },
});

export default upload; // Exporta la instancia de Multer configurada
