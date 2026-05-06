import { useState } from "react";
import Tesseract from "tesseract.js";
import { parseForm } from "./parseForm.ts";
import { saveTreatment } from "./ORCapi";
import TreatmentTimeline from "./TreatmentTimeline";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TreatmentPDF } from "./TreatmentPDF.ts";

export default function TreatMentTimelineFull() {
  const [file,setFile]=useState<any>(null);
  const [form,setForm]=useState<any>({});
  const [logs,setLogs]=useState<any[]>([]);
  const [raw,setRaw]=useState("");

  const scan = async ()=>{
    const res = await Tesseract.recognize(file,"vie+eng");
    setRaw(res.data.text);
    setForm(parseForm(res.data.text));
    setLogs([{time:new Date().toLocaleString()}]);
  };

  return (
    <div className="container mt-3">
      <div className="row">

        <div className="col-md-4">
          <input type="file" className="form-control"
            onChange={(e)=>setFile(e.target.files?.[0])}
          />
          <button className="btn btn-primary w-100 mt-2" onClick={scan}>
            Scan OCR
          </button>

          <textarea className="form-control mt-2" value={raw}/>
        </div>

        <div className="col-md-8">
          <input className="form-control mb-1"
            value={form.admissionNumber||""}
            onChange={(e)=>setForm({...form,admissionNumber:e.target.value})}
          />

          <textarea className="form-control mb-2"
            value={form.diagnosis||""}
            onChange={(e)=>setForm({...form,diagnosis:e.target.value})}
          />

          <TreatmentTimeline logs={logs} setLogs={setLogs}/>

          <button className="btn btn-success w-100 mt-2"
            onClick={()=>saveTreatment({form,logs})}>
            Save DB
          </button>

          <PDFDownloadLink
            document={<TreatmentPDF form={form} logs={logs}/>}
            fileName="treatment.pdf"
            className="btn btn-danger w-100 mt-2"
          >
            Export PDF
          </PDFDownloadLink>

        </div>
      </div>
    </div>
  );
}