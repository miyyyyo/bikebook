import { getNextMonth } from "@/utils/ftpHelpers";
import { debounce, isEqual, throttle } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

const ProfileFtp = ({ username }: { username: string }) => {
  const [ftpData, setFtpData] = useState<FtpData | null>();
  const [status, setStatus] = useState<Status | null>();
  const latestFtpDataRef = useRef(ftpData);

  useEffect(() => {
    latestFtpDataRef.current = ftpData;
  }, [ftpData]);

  useEffect(() => {
    const fetchFtp = async () => {
      try {
        const response = await fetch(
          `/api/ftp?username=${encodeURIComponent(username)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch:", error);
        setStatus("Error");
      }
    };

    fetchFtp().then((data) => {
      if (data) {
        setFtpData(data[0]);
        setStatus("Guardado");
      }
    });
  }, [username]);

  const sendFtpData = (currentFtpData: FtpData) => {
    if (!currentFtpData) return;

    setStatus("Guardando");

    fetch(`/api/ftp?username=${username}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, updateData: currentFtpData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setStatus("Guardado");
      })
      .catch((error) => {
        console.error("Failed to send ftp data:", error);
        setStatus("Error");
      });
  };

  const throttledSendFtpData = useCallback(
    throttle(() => {
      if (latestFtpDataRef.current) {
        sendFtpData(latestFtpDataRef.current);
      }
    }, 2000),
    []
  );

  const handleChange = (data: Matrix<{ value: string }>) => {
    setStatus("Guardando");

    const newData: FtpData["data"] = data.map((row) =>
      row.map((cell) => ({
        value: cell?.value || "",
      }))
    );

    if (ftpData) {
      const newFtpData: FtpData = {
        cols: ftpData.cols,
        rows: ftpData.rows,
        data: newData,
      };

      latestFtpDataRef.current = newFtpData;
      throttledSendFtpData();
    }
  };

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
            if (!isEqual(data, ftpData.data)) {
              handleChange(data);
            }
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
