import { useEffect, useRef, useState } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

const ImagingDashboard = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Load file list
  useEffect(() => {
    fetch("http://localhost:3000/api/dicom/list")
      .then((res) => res.json())
      .then((data) => setFiles(data));
  }, []);

  // Setup loader once
  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneWADOImageLoader.configure({
      useWebWorkers: false,
    });
  }, []);

  // Load image
  useEffect(() => {
    if (!selectedFile || !viewerRef.current) return;

    const element = viewerRef.current;

    cornerstone.enable(element);

    const imageId = "wadouri:/dicom/image-00000.dcm";

    cornerstone.loadAndCacheImage(imageId).then((image) => {
      cornerstone.displayImage(element, image);
    });

    return () => {
      cornerstone.disable(element);
    };
  }, [selectedFile]);

  return (
    <div className="mt-5 pt-3" style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
        }}
      >
        <h3>DICOM Files</h3>

        {files.map((file) => (
          <div
            key={file}
            onClick={() => setSelectedFile(file)}
            style={{
              padding: "10px",
              margin: "5px 0",
              background:
                selectedFile === file ? "#2563eb" : "#374151",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {file}
          </div>
        ))}
      </div>

      {/* Viewer */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "black",
        }}
      >
        {selectedFile ? (
          <div
            ref={viewerRef}
            style={{ width: "700px", height: "700px" }}
          />
        ) : (
          <h2 style={{ color: "white" }}>
            Select a DICOM file
          </h2>
        )}
      </div>
    </div>
  );
};

export default ImagingDashboard;