import { FtpDataModel } from "@/db/models/ftpModel";
import { NextApiRequest, NextApiResponse } from "next";

const defaultFtpData = {
  cols: [
    "Tipo",
    "Tiempo",
    "Distancia",
    "Velocidad Prom",
    "Velocidad Max",
    "Ritmo Cardiaco Prom",
    "Ritmo Cardiaco Max",
    "Cadencia Prom",
    "Cadencia Max",
    "Potencia Prom",
    "Potencia Max",
    "Media W/Kg",
    "Potencia normalizada",
    "Peso",
    "Observaciones/Comentarios",
  ],
  rows: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  data: [
    [
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Comentarios..." },
    ],
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const username = req.query.username;

    if (username) {
      try {
        const data = await FtpDataModel.find({ username }).lean();

        if (data.length === 0) {
          res.status(200).json([defaultFtpData]);
        } else {
          res.status(200).json(data);
        }

        return;
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
        return;
      }
    }

    try {
      const data = await FtpDataModel.find();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else if (req.method === "PATCH") {
    try {
      const { username, updateData } = req.body;

      if (!username || !updateData) {
        return res.status(400).json({ error: "Missing id or data to update" });
      }

      const updatedFtp = await FtpDataModel.findOneAndUpdate(
        { username: username },
        updateData,
        {
          new: true,
          upsert: true,
        }
      );

      res.status(200).json(updatedFtp);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to update data" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
