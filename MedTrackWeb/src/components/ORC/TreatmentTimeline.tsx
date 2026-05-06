export default function TreatmentTimeline({ logs, setLogs }: any) {
  const update = (i: number, key: string, value: string) => {
    const newLogs = [...logs];
    newLogs[i][key] = value;
    setLogs(newLogs);
  };

  return (
    <div>
      {logs.map((log: any, i: number) => (
        <div className="card mb-2" key={i}>
          <div className="card-header">
            ⏱ {log.time}
          </div>

          <div className="card-body">
            <textarea placeholder="S" className="form-control mb-1"
              value={log.subjective}
              onChange={(e)=>update(i,"subjective",e.target.value)}
            />
            <textarea placeholder="O" className="form-control mb-1"
              value={log.objective}
              onChange={(e)=>update(i,"objective",e.target.value)}
            />
            <textarea placeholder="A" className="form-control mb-1"
              value={log.assessment}
              onChange={(e)=>update(i,"assessment",e.target.value)}
            />
            <textarea placeholder="P" className="form-control mb-1"
              value={log.plan}
              onChange={(e)=>update(i,"plan",e.target.value)}
            />
            <textarea placeholder="Chỉ định" className="form-control"
              value={log.instruction}
              onChange={(e)=>update(i,"instruction",e.target.value)}
            />
          </div>
        </div>
      ))}

      <button className="btn btn-primary w-100"
        onClick={()=>setLogs([...logs,{
          time:new Date().toLocaleString(),
          subjective:"",objective:"",assessment:"",plan:"",instruction:""
        }])}>
        + Thêm
      </button>
    </div>
  );
}