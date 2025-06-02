import { createTransport, getTestMessageUrl } from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const uploadFileController = {
  uploadSingleImage: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message:
          "No se subió ningún archivo o el archivo no es válido (ej. tipo o tamaño).",
      });
    }

    console.log("Archivo subido exitosamente:", req.file);
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "No se subió ningún archivo o el archivo no es válido (tipo o tamaño incorrecto).",
        });
      }

      console.log("Archivo subido exitosamente:", req.file);

      // Construye respuesta con los metadatos del archivo
      const { filename, path, mimetype, size } = req.file;

      res.status(200).json({
        message: "Archivo subido con éxito.",
        filename,
        path,
        mimetype,
        size,
        url: `/uploads/${filename}`, // Asegúrate que 'uploads/' esté siendo servido como estático
      });
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      res
        .status(500)
        .json({ message: "Error interno al procesar el archivo." });
    }
  },

  email: async (req, res) => {
    const { email } = req.params;
    const { fecha, estado, codigo } = req.body;
    let html = `Hola ! tu codigo es : ${codigo}`;
    if (estado) {
      html = `<b>Hola te asignaron una Cita. <br/> 
        Estado : ${estado}. <br/>
        Fecha : ${fecha}
        </b>`;
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({
        message: "Correo electrónico del destinatario no válido o faltante.",
      });
    }

    try {
      let transporter = createTransport({
        service: "gmail",
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_PASSWORD,
        },
      });

      let info = await transporter.sendMail({
        from: '"Bienvenido." <secure@agendasoft.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Bienvenido ✔", // Subject line
        text: "Asinacion de Cita", // plain text body
        html: html, // html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", getTestMessageUrl(info));

      res.status(200).json({
        message: "Correo electrónico enviado con éxito.",
        messageId: info.messageId,
        codigo,
        // previewUrl: getTestMessageUrl(info) // Opcional: si sigues usando para desarrollo
      });
    } catch (error) {
      console.error(`Error al enviar correo electrónico a ${email}:`, error);
      res.status(500).json({
        message: "Error interno del servidor al enviar el correo electrónico.",
        error: error.message, // Proporciona el mensaje de error para depuración
      });
    }
  },
};

export default uploadFileController;
