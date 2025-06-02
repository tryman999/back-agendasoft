// controllers/ventasController.js
import pool from "../config/db.js";

const ventasController = {
  getAllVentas: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `
SELECT
    dv.*,
    v.*,
    p.*,
    u.*    
FROM
    Detalle_Venta dv
LEFT JOIN
    Ventas v ON dv.venta_id = v.venta_id
LEFT JOIN
    Productos p ON dv.producto_id = p.producto_id
LEFT JOIN
    Usuarios u ON v.cliente_id = u.usuario_id
GROUP BY
    v.venta_id, dv.detalle_id, dv.venta_id, dv.producto_id, dv.cantidad, dv.precio_unitario, dv.subtotal,
    v.fecha_venta, v.cliente_id, v.auxiliar_ventas_id, -- Incluye todas las columnas de v
    p.producto_id, p.nombre_producto, p.descripcion, p.precio_venta, p.stock -- Incluye todas las columnas de p
ORDER BY
    v.venta_id;
        `
      );
      const ventasAgrupadas = {};
      rows.forEach((row) => {
        const ventaId = row.venta_id;
        if (!ventasAgrupadas[ventaId]) {
          ventasAgrupadas[ventaId] = [];
        }
        ventasAgrupadas[ventaId].push(row);
      });

      const resultadoFinal = Object.entries(ventasAgrupadas).map(
        ([ventaId, detalles]) => ({
          venta_id: parseInt(ventaId), // Convertir la clave a número si es necesario
          detalles: detalles,
        })
      );

      res.json(resultadoFinal);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      res.status(500).json({ message: "Error al obtener ventas" });
    }
  },

  getVentaById: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query(
        "SELECT v.*, c.nombre_cliente, u.nombre_usuario AS auxiliar_nombre FROM Ventas v JOIN Clientes c ON v.cliente_id = c.cliente_id JOIN Usuarios u ON v.auxiliar_ventas_id = u.usuario_id WHERE v.venta_id = ?",
        [id]
      );
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: "Venta no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener venta por ID:", error);
      res.status(500).json({ message: "Error al obtener venta" });
    }
  },

  createVenta: async (req, res) => {
    const { cliente_id, total_venta, auxiliar_ventas_id } = req.body;
    const auxiliar_id = auxiliar_ventas_id === 0 ? null : auxiliar_ventas_id;
    try {
      const [result] = await pool.query(
        "INSERT INTO Ventas (cliente_id, total_venta, auxiliar_ventas_id) VALUES (?, ?, ?)",
        [cliente_id, total_venta, auxiliar_id]
      );
      res
        .status(201)
        .json({ message: "Venta creada", venta_id: result.insertId });
    } catch (error) {
      console.error("Error al crear venta:", error);
      res.status(500).json({ message: "Error al crear venta" });
    }
  },

  createVentaDetalle: async (req, res) => {
    const { venta_id, products } = req.body;
    try {
      for (const product of products) {
        const { producto_id, quantity, precio_venta } = product;
        const subtotal = parseInt(precio_venta) * quantity;
        await pool.query(
          "INSERT INTO Detalle_Venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
          [venta_id, producto_id, quantity, precio_venta, subtotal]
        );
        // Aquí podrías también actualizar el stock de los productos si es necesario
      }

      res.status(201).json({ message: "detalle de Venta creada" });
    } catch (error) {
      console.error("Error al crear venta:", error);
      res.status(500).json({ message: "Error al crear venta" });
    }
  },

  createCambio: async (req, res) => {
    const { cambios } = req.body;

    try {
      cambios.forEach(async (items) => {
        const {
          venta_original_id,
          producto_original_id,
          cantidad_original,
          producto_nuevo_id,
          cantidad_nueva,
          fecha_cambio,
          motivo_cambio,
          estado_cambio,
          observaciones,
        } = items;

        await pool.query(
          "INSERT INTO Cambios (venta_original_id,producto_original_id,cantidad_original,producto_nuevo_id,cantidad_nueva,fecha_cambio,motivo_cambio,estado_cambio,observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            venta_original_id,
            producto_original_id,
            cantidad_original,
            producto_nuevo_id,
            cantidad_nueva,
            fecha_cambio,
            motivo_cambio,
            estado_cambio,
            observaciones,
          ]
        );
      });

      // Aquí podrías también actualizar el stock de los productos si es necesario

      res.status(201).json({ message: "cambio hecho" });
    } catch (error) {
      console.error("Error al crear cambio:", error);
      res.status(500).json({ message: "Error al crear cambio" });
    }
  },

  getAllCambios: async (req, res) => {
    try {
      const [rows] = await pool.query(`
      SELECT
        c.*,
        v.*,
        u.*,
         po.nombre_producto AS nombre_producto_original,
        po.precio_venta AS precio_venta_original,
        pn.nombre_producto AS nombre_producto_nuevo,
        pn.precio_venta AS precio_venta_nuevo
      FROM
        Cambios c
      LEFT JOIN
        Ventas v ON c.venta_original_id = v.venta_id
      LEFT JOIN
        Usuarios u ON v.cliente_id = u.usuario_id
      LEFT JOIN
        Productos po ON c.producto_original_id = po.producto_id
      LEFT JOIN
        Productos pn ON c.producto_nuevo_id = pn.producto_id
          ;`);
      const cambiosAgrupados = {};
      rows.forEach((row) => {
        const clienteId = row.usuario_id;
        if (!cambiosAgrupados[clienteId]) {
          cambiosAgrupados[clienteId] = {
            cliente_id: clienteId,
            email: row.email,
            cambios: [],
          };
        }
        cambiosAgrupados[clienteId].cambios.push({
          ...row,
        });
      });

      const resultadoFinal = Object.values(cambiosAgrupados);

      res.json(resultadoFinal);
    } catch (error) {
      console.error("Error al obtener los cambios:", error);
      res.status(500).json({ message: "Error al obtener los cambios" });
    }
  },

  // ... (Implementar updateVenta y deleteVenta si es necesario)
};

export default ventasController;
