import { useEffect, useRef, useState } from "react";
import type { Html5QrcodeScanner } from "html5-qrcode";
import './css/QRScanner.css';

interface QRScannerProps {
  onScanComplete?: (decodedText: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanComplete }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scannerReady, setScannerReady] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Preload library only once
    import("html5-qrcode").then((module) => {
      if (!isMounted) return;
      const { Html5QrcodeScanner } = module;
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
        },
        false
      );
      setScannerReady(true);
    });

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const startScanning = () => {
    if (!scannerRef.current) return;
    setScanning(true);
    scannerRef.current.render(
      (decodedText: string) => {
        if (onScanComplete) onScanComplete(decodedText);

        // Pause briefly to prevent multiple scans
        scannerRef.current?.pause(true);
        setTimeout(() => {
          scannerRef.current?.resume();
        }, 2000);
      },
      (errorMessage: string) => {
        if (!errorMessage.includes("NotFoundException")) {
          console.warn("QR scan error:", errorMessage);
        }
      }
    );
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      await scannerRef.current.clear().catch(() => {});
    }
    setScanning(false);
  };

  return (
    <>
      <h5 className="text-center mb-3">Scan CIC / QR Code</h5>

      {/* Control buttons */}
      <div className="text-center mb-3">
        {!scanning ? (
          <button
            className="btn btn-success"
            onClick={startScanning}
            disabled={!scannerReady}
          >
            📷 Start Scanning
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopScanning}>
            ✖ Stop Scanning
          </button>
        )}
      </div>

      {/* Scanner area */}
      <div
        id="reader"
        className="mx-auto border rounded shadow-sm"
        style={{
          width: "320px",
          height: "320px",
          backgroundColor: scanning ? "#fff" : "#f0f0f0",
          display: scanning ? "block" : "none",
        }}
      ></div>
    </>
  );
};

export default QRScanner;
