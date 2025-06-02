// controllers/facturasController.js
import pool from "../config/db.js";

const facturasController = {
  getFacturaById: async (req, res) => {
    const { id } = req.params;
    try {
      const [factura] = await pool.query(
        "SELECT * FROM Facturas WHERE factura_id = ?",
        [id]
      );
      if (factura.length === 0) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }
      const [detalles] = await pool.query(
        "SELECT df.*, p.nombre_producto FROM Detalle_Factura df JOIN Productos p ON df.producto_id = p.producto_id WHERE df.factura_id = ?",
        [id]
      );
      res.json({ ...factura[0], detalles });
    } catch (error) {
      console.error("Error al obtener factura:", error);
      res.status(500).json({ message: "Error al obtener factura" });
    }
  },

  createFactura: async (req, res) => {
    const { cliente_id, total_factura, detalles_productos } = req.body;

    try {
      // Iniciar una transacción para asegurar la integridad de los datos
      await pool.beginTransaction();

      // Crear la factura
      const [facturaResult] = await pool.query(
        "INSERT INTO Facturas (cliente_id, total_factura) VALUES (?, ?)",
        [cliente_id, total_factura]
      );
      const facturaId = facturaResult.insertId;

      // Insertar los detalles de la factura
      for (const detalle of detalles_productos) {
        const { producto_id, cantidad, precio_unitario, subtotal } = detalle;
        await pool.query(
          "INSERT INTO Detalle_Factura (factura_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
          [facturaId, producto_id, cantidad, precio_unitario, subtotal]
        );
        // Aquí podrías también actualizar el stock de los productos si es necesario
      }

      // Asociar la factura a la venta (asumiendo que tienes el ID de la venta en req.body o lo obtienes de alguna manera)
      const { venta_id } = req.body; // Ejemplo: asumiendo que recibes el ID de la venta
      if (venta_id) {
        await pool.query(
          "UPDATE Ventas SET factura_id = ? WHERE venta_id = ?",
          [facturaId, venta_id]
        );
      }

      // Commit de la transacción
      await pool.commit();

      res
        .status(201)
        .json({ message: "Factura creada", factura_id: facturaId });
    } catch (error) {
      // Rollback en caso de error
      await pool.rollback();
      console.error("Error al crear factura:", error);
      res.status(500).json({ message: "Error al crear factura" });
    }
  },

  // ... (Otras funciones como getAllFacturas, etc.)
};

export default facturasController;
