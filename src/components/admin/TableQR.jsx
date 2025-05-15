import { useState } from "react";
import QRCode from "react-qr-code";
import { PencilIcon, PrinterIcon } from "@heroicons/react/24/solid";

const TableQR = () => {
  const [qrUrl, setQrUrl] = useState("https://yourrestaurant.com/menu");
  const [editing, setEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(qrUrl);

  const handleSave = () => {
    if (tempUrl.trim()) {
      setQrUrl(tempUrl.trim());
      setEditing(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Print QR Code</title></head>
        <body style="display: flex; align-items: center; justify-content: center; height: 100vh;">
          <div>
            <h1 style="text-align: center;">Scan to View Menu</h1>
            <div style="display: flex; justify-content: center; padding: 20px;">
              <div>${document.getElementById("qr-code").innerHTML}</div>
            </div>
            <p style="text-align: center;">${qrUrl}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">QR Code</h1>

      {editing ? (
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-2">
          <p className="text-gray-700 text-center">{qrUrl}</p>
          <button
            onClick={() => {
              setTempUrl(qrUrl);
              setEditing(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      <div id="qr-code" className="bg-white p-6 rounded-2xl shadow-lg">
        <QRCode value={qrUrl} size={160} />
      </div>

      <button
        onClick={handlePrint}
        className="mt-6 inline-flex items-center bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
      >
        <PrinterIcon className="w-5 h-5 mr-2" />
        Print QR Code
      </button>
    </div>
  );
};

export default TableQR;
