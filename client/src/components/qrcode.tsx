"use client";
import { getTableLink } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";
const QrCodeTable = ({
  token,
  tableNumber,
  witdh = 250,
}: {
  token: string;
  tableNumber: number;
  witdh?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = witdh + 50;
    canvas.width = witdh;
    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "17px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "black";
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    );
    canvasContext.fillText(
      `Quét mã QR để gọi món`,
      canvas.width / 2,
      canvas.width + 40
    );
    // tao qr code
    const virtalCanvas = document.createElement("canvas");
    QRCode.toCanvas(
      virtalCanvas,
      getTableLink({
        token: token,
        tableNumber: tableNumber,
      }),
      {
        width: witdh,
        margin: 2,
      },
      function (error) {
        if (error) console.error(error);
        canvasContext.drawImage(virtalCanvas, 0, 0, witdh, witdh);
      }
    );
  }, [token, tableNumber, witdh]);
  return <canvas ref={canvasRef}></canvas>;
};

export default QrCodeTable;
