import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import productosRoutes from "./routes/productos.js";
import clientesRoutes from "./routes/clientes.js";
import ventasRoutes from "./routes/ventas.js";
import facturasRoutes from "./routes/facturas.js";
import entregasRoutes from "./routes/entregas.js"; // Importar rutas de entregas
import rolesRoutes from "./routes/roles.js";
import usuariosRoutes from "./routes/usuarios.js";
import authRoutes from "./routes/auth.js";
import proveedoresRoutes from "./routes/proveedor.js";
import categoriasRoutes from "./routes/categoria.js";
import uploadRoutes from "./routes/uploadFile.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", proveedoresRoutes);
app.use("/api", categoriasRoutes);

app.use("/api", productosRoutes);
app.use("/api", clientesRoutes);
app.use("/api", ventasRoutes);
app.use("/api", facturasRoutes);
app.use("/api", entregasRoutes);
app.use("/api", rolesRoutes);
app.use("/api", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.get("/", (req, res) => {
  res.send("¡API de Inventario!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
