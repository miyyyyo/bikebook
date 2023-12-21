import { getNextMonth } from "@/utils/ftpHelpers";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import Spreadsheet, { Matrix } from "react-spreadsheet";

interface FtpData {
  cols: string[];
  rows: string[];
  data: {
    value: string;
    readOnly?: boolean;
  }[][];
}

type Status = "Guardado" | "Guardando" | "Error";

const ftpMock = {
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
      { value: "MTB" },
      { value: "20:00" },
      { value: "11,16" },
      { value: "33,4" },
      { value: "40,4" },
      { value: "168" },
      { value: "173" },
      { value: "74" },
      { value: "104" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "" },
      { value: "Comentarios..." },
    ],
  ],
};

const ProfileFtp = () => {
  const [ftpData, setFtpData] = useState<FtpData | null>();
  const [status, setStatus] = useState<Status | null>();

  useEffect(() => {
    // fetch data and modif as needed and set state

    setFtpData(ftpMock);
    setStatus("Guardado");
  }, []);

  //   save the data in the db
  const saveData = debounce(
    () => {
      console.log("guardando...");
    },
    2000,
    {
      leading: true,
      trailing: false,
    }
  );

  //   handle change
  const handleChange = (
    data: Matrix<{
      value: string;
    }>
  ) => {
    setStatus("Guardando");

    saveData();

    setTimeout(() => {
      setStatus("Guardado");
    }, 2000);
  };

  //   add a new month
  const handleAddRow = () => {
    setFtpData((prevFtpData) => {
      if (prevFtpData === null) {
        return null;
      }

      return {
        ...prevFtpData,
        rows: [
          ...prevFtpData!.rows,
          getNextMonth(prevFtpData!.rows[prevFtpData!.rows.length - 1]),
        ],
        cols: prevFtpData!.cols,
        data: prevFtpData!.data,
      };
    });
  };

  if (!ftpData) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <div className="border-2 w-full h-96 overflow-scroll">
        <Spreadsheet
          data={ftpData.data}
          columnLabels={ftpData.cols}
          rowLabels={ftpData.rows}
          onChange={(data) => {
            handleChange(data);
          }}
        />
      </div>
      <div className="w-full border p-4 bg-white flex justify-between">
        <button
          onClick={handleAddRow}
          className="border font-semibold p-2"
        >
          Agregar una fila
        </button>

        <div>{status}</div>
      </div>
    </div>
  );
};

export default ProfileFtp;
