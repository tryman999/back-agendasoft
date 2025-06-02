// controllers/authController.js
import pool from "../config/db.js";
import { encryptPassword, HashingMatch } from "./pass-hash.js";

const authController = {
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Buscar al usuario por su email
      const [rows] = await pool.query(
        "SELECT * FROM Usuarios WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: "Credenciales inválidas" }); // Usuario no encontrado
      }

      const user = rows[0];

      // Comparar la contraseña proporcionada con la contraseña hasheada en la base de datos
      const passwordMatch = await HashingMatch(password, user.contrasena);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciales inválidas" }); // Contraseña incorrecta
      }

      // Si las credenciales son válidas, puedes generar un token JWT aquí para mantener la sesión del usuario
      // (Esto requerirá instalar y configurar la librería jsonwebtoken)
      // Por ahora, simplemente devolvemos un mensaje de éxito y la información del usuario
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: {
          usuario_id: user.usuario_id,
          nombre_usuario: user.nombre_usuario,
          email: user.email,
          rol_id: user.rol_id,
          // ... otros datos del usuario que quieras incluir
        },
      });
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      res.status(500).json({ message: "Error durante el inicio de sesión" });
    }
  },
  forgotPassword: async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      const [rows] = await pool.query(
        "SELECT * FROM Usuarios WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const otherpassword = await encryptPassword(newPassword);

      const [result] = await pool.query(
        "UPDATE Usuarios SET contrasena = ? WHERE email = ?",
        [otherpassword, email]
      );
      if (result.affectedRows > 0) {
        res.json({ message: "Contraseña actualizada exitosamente" });
      } else {
        res.status(500).json({ message: "Error al actualizar la contraseña" });
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      res.status(500).json({ message: "Error al actualizar la contraseña" });
    }
  },
};

export default authController;
