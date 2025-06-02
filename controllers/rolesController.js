// controllers/rolesController.js
import pool from "../config/db.js";

const rolesController = {
  getAllRoles: async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM rol WHERE name_rol != 'admin'"
      );
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      res.status(500).json({ message: "Error al obtener roles" });
    }
  },

  getRolById: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query("SELECT * FROM rol WHERE id = ?", [id]);
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: "Rol no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener rol por ID:", error);
      res.status(500).json({ message: "Error al obtener rol" });
    }
  },
};

export default rolesController;
