// controllers/productosController.js
import pool from "../config/db.js";

const categoriasController = {
  getAllCategorias: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM Categorias");
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
      res.status(500).json({ message: "Error al obtener categorias" });
    }
  },

  createCategoria: async (req, res) => {
    const { nombre_categorias } = req.body;
    try {
      const [result] = await pool.query(
        "INSERT INTO Categorias (nombre_categorias) VALUES (?)",
        [nombre_categorias]
      );
      res
        .status(201)
        .json({ message: "Categoria creado", categoria_id: result.insertId });
    } catch (error) {
      console.error("Error al crear categorias:", error);
      res.status(500).json({ message: "Error al crear categorias" });
    }
  },
};

export default categoriasController;
