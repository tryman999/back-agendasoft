// controllers/entregasController.js
import pool from "../config/db.js";

const entregasController = {
  getAllEntregas: async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT e.*, v.venta_id AS venta_numero, v.fecha_venta, c.nombre_cliente, c.documento FROM Entrega e JOIN Ventas v ON e.venta_id = v.venta_id JOIN Clientes c ON v.cliente_id = c.usuario_id"
      );
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener entregas:", error);
      res.status(500).json({ message: "Error al obtener entregas" });
    }
  },

  getEntregaById: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query(
        "SELECT e.*, v.venta_id AS venta_numero, c.nombre_cliente FROM Entregas e JOIN Ventas v ON e.venta_id = v.venta_id JOIN Clientes c ON v.cliente_id = c.cliente_id WHERE e.entrega_id = ?",
        [id]
      );
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: "Entrega no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener entrega por ID:", error);
      res.status(500).json({ message: "Error al obtener entrega" });
    }
  },

  createEntrega: async (req, res) => {
    const {
      direccion_entrega,
      estado,
      fecha_envio,
      venta_id,
      cliente_id,
      observacion,
    } = req.body;
    try {
      const [result] = await pool.query(
        `INSERT INTO Entrega (direccion_entrega,
      estado,
      fecha_envio,
      venta_id,
      cliente_id, observacion) VALUES (?, ?, ?, ?, ?)`,
        [
          direccion_entrega,
          estado,
          fecha_envio,
          venta_id,
          cliente_id,
          observacion,
        ]
      );
      res
        .status(201)
        .json({ message: "Entrega registrada", entrega_id: result.insertId });
    } catch (error) {
      console.error("Error al crear entrega:", error);
      res.status(500).json({ message: "Error al crear entrega" });
    }
  },

  updateEntrega: async (req, res) => {
    const { id } = req.params;
    const {
      fecha_envio,
      direccion_entrega,
      ciudad_entrega,
      departamento_entrega,
      codigo_postal_entrega,
      metodo_envio,
      numero_seguimiento,
      estado_entrega,
      fecha_entrega_estimada,
      fecha_entrega_real,
      observaciones,
      usuario_responsable_id,
    } = req.body;
    try {
      const [result] = await pool.query(
        "UPDATE Entregas SET fecha_envio = ?, direccion_entrega = ?, ciudad_entrega = ?, departamento_entrega = ?, codigo_postal_entrega = ?, metodo_envio = ?, numero_seguimiento = ?, estado_entrega = ?, fecha_entrega_estimada = ?, fecha_entrega_real = ?, observaciones = ?, usuario_responsable_id = ? WHERE entrega_id = ?",
        [
          fecha_envio,
          direccion_entrega,
          ciudad_entrega,
          departamento_entrega,
          codigo_postal_entrega,
          metodo_envio,
          numero_seguimiento,
          estado_entrega,
          fecha_entrega_estimada,
          fecha_entrega_real,
          observaciones,
          usuario_responsable_id,
          id,
        ]
      );
      if (result.affectedRows > 0) {
        res.json({ message: "Entrega actualizada" });
      } else {
        res.status(404).json({ message: "Entrega no encontrada" });
      }
    } catch (error) {
      console.error("Error al actualizar entrega:", error);
      res.status(500).json({ message: "Error al actualizar entrega" });
    }
  },

  deleteEntrega: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query(
        "DELETE FROM Entregas WHERE entrega_id = ?",
        [id]
      );
      if (result.affectedRows > 0) {
        res.json({ message: "Entrega eliminada" });
      } else {
        res.status(404).json({ message: "Entrega no encontrada" });
      }
    } catch (error) {
      console.error("Error al eliminar entrega:", error);
      res.status(500).json({ message: "Error al eliminar entrega" });
    }
  },

  updateEstado: async (req, res) => {
    const { id } = req.params; // El ID de la entrega viene de los parámetros de la URL
    const { estado, fecha_envio, observacion } = req.body; // Los datos a actualizar vienen del cuerpo de la petición

    // 1. Construir dinámicamente la parte SET de la consulta SQL
    const fieldsToUpdate = []; // Almacenará las partes 'campo = ?'
    const queryParams = []; // Almacenará los valores correspondientes a los campos

    if (estado !== undefined) {
      // Verifica si el 'estado' fue enviado en el body
      fieldsToUpdate.push("estado = ?");
      queryParams.push(estado);
    }
    if (fecha_envio !== undefined || fecha_envio !== "") {
      // Verifica si 'fecha_envio' fue enviado
      fieldsToUpdate.push("fecha_envio = ?");
      queryParams.push(fecha_envio);
    }
    if (observacion !== undefined) {
      // Verifica si 'observacion' fue enviado
      fieldsToUpdate.push("observacion = ?");
      queryParams.push(observacion);
    }

    // 2. Validar que al menos un campo sea enviado para actualizar
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({
        message:
          "No se proporcionaron campos para actualizar. Por favor, envía al menos 'estado', 'fecha_envio' u 'observacion'.",
      });
    }

    // 3. Unir las partes de la consulta SQL
    const setClause = fieldsToUpdate.join(", "); // Ejemplo: "estado = ?, fecha_envio = ?"
    const sql = `UPDATE Entrega SET ${setClause} WHERE entrega_id = ?`;

    // 4. Añadir el ID de la entrega al final de los parámetros
    queryParams.push(Number(id));

    try {
      const [result] = await pool.query(sql, queryParams);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: `Entrega con ID ${id} no encontrada.` });
      }

      res.json({
        message: "Entrega actualizada exitosamente.",
        id_entrega: id,
        updated_fields: req.body, // Opcional: devolver los campos que se actualizaron
      });
    } catch (error) {
      console.error(`Error al actualizar la entrega con ID ${id}: `, error); // Mensaje de error más específico
      res.status(500).json({
        message: "Error interno del servidor al actualizar la entrega.",
      });
    }
  },

  updateCita: async (req, res) => {
    // Extraemos todos los campos posibles del cuerpo de la solicitud
    const {
      fecha_inicio,
      direccion_servicio,
      cliente_id,
      garantia,
      estado,
      descripcion,
    } = req.body;

    // --- Validación inicial: Asegurarse de que el ID del servicio a actualizar exista ---
    if (!cliente_id) {
      return res.status(400).json({
        message: "ID del servicio técnico no proporcionado en la URL.",
      });
    }

    // --- Construcción dinámica de la consulta SQL ---
    const fieldsToUpdate = []; // Almacenará las partes 'campo = ?'
    const queryParams = []; // Almacenará los valores correspondientes a los campos

    // Verifica cada campo y lo añade a la consulta si está definido en req.body
    if (fecha_inicio !== undefined) {
      fieldsToUpdate.push("fecha_inicio = ?");
      queryParams.push(fecha_inicio);
    }
    if (direccion_servicio !== undefined) {
      fieldsToUpdate.push("direccion_servicio = ?");
      queryParams.push(direccion_servicio);
    }

    if (garantia !== undefined) {
      fieldsToUpdate.push("garantia = ?");
      queryParams.push(garantia);
    }
    if (estado !== undefined) {
      fieldsToUpdate.push("estado = ?");
      queryParams.push(estado);
    }
    if (descripcion !== undefined) {
      fieldsToUpdate.push("descripcion_problema = ?");
      queryParams.push(descripcion);
    }

    // --- Validación: Asegurarse de que al menos un campo sea enviado para actualizar ---
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({
        message:
          "No se proporcionaron campos para actualizar. Envía al menos fecha_inicio, direccion_servicio, cliente_id, garantia o estado.",
      });
    }

    // --- Unir las partes de la consulta SQL ---
    const setClause = fieldsToUpdate.join(", "); // Ejemplo: "fecha_inicio = ?, direccion_servicio = ?"
    const sql = `UPDATE Servicios_Tecnicos SET ${setClause} WHERE servicio_id = ?`;
    console.log(sql);
    // --- Añadir el ID del servicio al final de los parámetros de la consulta ---
    queryParams.push(Number(cliente_id)); // Convertimos a número por seguridad

    try {
      const [result] = await pool.query(sql, queryParams);

      // Si no se afectó ninguna fila, significa que el servicio con ese ID no fue encontrado
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: `Servicio técnico con ID ${id} no encontrado.` });
      }

      // Respuesta exitosa
      res.json({
        message: "Servicio técnico actualizado con éxito.",
        servicio_id: cliente_id,
        campos_actualizados: req.body, // Opcional: devuelve los campos que se intentaron actualizar
      });
    } catch (error) {
      console.error(
        `Error al actualizar el servicio técnico con ID ${cliente_id}: `,
        error
      );
      res.status(500).json({
        message:
          "Error interno del servidor al actualizar el servicio técnico.",
        error: error.message, // Proporcionar el mensaje de error para depuración
      });
    }
  },

  deleteCita: async (req, res) => {
    // El ID del servicio técnico a eliminar DEBE venir de los parámetros de la URL.
    // Ejemplo: DELETE /api/servicios_tecnicos/:id
    const { id } = req.params; // Capturamos el ID del servicio desde la URL

    // --- Validación básica ---
    // Es crucial asegurarse de que se ha proporcionado un ID.
    if (!id) {
      return res.status(400).json({
        message: "ID de servicio técnico no proporcionado en la URL.",
      });
    }

    try {
      // Consulta SQL para eliminar un registro por su 'servicio_id'
      const sql = `
            DELETE FROM Servicios_Tecnicos
            WHERE servicio_id = ?;
        `;

      // Ejecutamos la consulta. pool.query() devolverá un array [result, fields].
      // 'result' contendrá la información sobre la operación (por ejemplo, affectedRows).
      const [result] = await pool.query(sql, [id]);

      // Si affectedRows es 0, significa que no se encontró ningún servicio con ese ID para eliminar.
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: `Servicio técnico con ID ${id} no encontrado para eliminar.`,
        });
      }

      // Si la eliminación fue exitosa
      res.status(200).json({
        message: `Servicio técnico con ID ${id} eliminado exitosamente.`,
        rowsAffected: result.affectedRows,
      });
    } catch (error) {
      // Capturamos cualquier error que ocurra durante la operación de la base de datos
      console.error(
        `Error al eliminar el servicio técnico con ID ${id}:`,
        error
      );
      res.status(500).json({
        message: "Error interno del servidor al eliminar el servicio técnico.",
      });
    }
  },

  updateEvidenciaCita: async (req, res) => {
    const { id } = req.params;
    const { imagen_evidencia } = req.body;

    if (!imagen_evidencia) {
      return res.status(400).json({
        message:
          "El campo 'imagen_evidencia' es requerido en el cuerpo de la solicitud.",
      });
    }

    try {
      const [result] = await pool.query(
        "UPDATE Servicios_Tecnicos SET imagen_evidencia = ? WHERE servicio_id = ?",
        [imagen_evidencia, id]
      );

      if (result.affectedRows > 0) {
        res.json({ message: "imagen subida." });
      } else {
        res.status(404).json({ message: "imagen no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la imagen:", error);
      res
        .status(500)
        .json({ message: "Error al actualizar el estado de la imagen" });
    }
  },
};

export default entregasController;
