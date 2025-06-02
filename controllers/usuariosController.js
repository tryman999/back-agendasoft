// controllers/usuariosController.js
import pool from "../config/db.js";
import { encryptPassword } from "./pass-hash.js";

const usuariosController = {
  createUser: async (req, res) => {
    const {
      nombre_usuario,
      contrasena,
      email,
      rol_id,
      documento,
      direccion,
      telefono,
    } = req.body;

    try {
      // Verificar si el nombre de usuario o el email ya existen
      const [existingUser] = await pool.query(
        "SELECT * FROM Usuarios WHERE email = ?",
        [email]
      );
      if (existingUser.length > 0) {
        return res.status(409).json({
          message: "el email ya están registrados",
        });
      }

      // Hashear la contraseña
      const hashedPassword = await encryptPassword(contrasena);

      // Insertar el nuevo usuario en la base de datos
      const [result] = await pool.query(
        "INSERT INTO Usuarios (nombre_usuario, contrasena, email, rol_id) VALUES (?, ?, ?, ?)",
        [nombre_usuario, hashedPassword, email, rol_id]
      );

      const [result2] = await pool.query(
        "INSERT INTO Clientes (nombre_cliente, documento, direccion, telefono, email, usuario_id) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre_usuario, documento, direccion, telefono, email, result.insertId]
      );

      res.status(201).json({
        message: "Usuario creado exitosamente",
        usuario_id: result.insertId,
        nombre_usuario,
        email,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({ message: "Error al crear usuario" });
    }
  },

  getUserByEmail: async (req, res) => {
    const { email } = req.params; // El email se espera en los parámetros de la ruta

    try {
      const [rows] = await pool.query(
        "SELECT * FROM Usuarios WHERE email = ?",
        [email]
      );

      if (rows.length > 0) {
        res.json(rows[0]); // Devuelve el primer usuario encontrado (debería ser único por email)
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al buscar usuario por email:", error);
      res.status(500).json({ message: "Error al buscar usuario" });
    }
  },

  getUsers: async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT
    Usuarios.*,
    Clientes.documento,
    rol.name_rol
FROM
    Usuarios
JOIN rol ON Usuarios.rol_id = rol.id
JOIN Clientes ON Usuarios.usuario_id = Clientes.usuario_id
        `);

      if (rows.length > 0) {
        const data = rows.filter((item) => item.rol_id !== 1);
        res.json(data);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al buscar usuario por email:", error);
      res.status(500).json({ message: "Error al buscar usuario" });
    }
  },

  updateUserStatus: async (req, res) => {
    const { usuario_id } = req.params; // Obtener el ID del usuario de los parámetros de la ruta
    const { estado } = req.body; // Obtener el nuevo estado del cuerpo de la petición

    try {
      // Verificar si el usuario existe
      const [existingUser] = await pool.query(
        "SELECT * FROM Usuarios WHERE usuario_id = ?",
        [usuario_id]
      );

      if (existingUser.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Actualizar el estado del usuario en la base de datos
      const [result] = await pool.query(
        "UPDATE Usuarios SET estado = ? WHERE usuario_id = ?",
        [estado, usuario_id]
      );

      if (result.affectedRows > 0) {
        res.json({ message: "Estado del usuario actualizado exitosamente" });
      } else {
        res
          .status(500)
          .json({ message: "Error al actualizar el estado del usuario" });
      }
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
      res
        .status(500)
        .json({ message: "Error al actualizar el estado del usuario" });
    }
  },
};

export default usuariosController;
