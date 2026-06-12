import { NurseProps } from "./interface";

function InfoRow({ label, value, loading }: { label: string; value?: string; loading?: boolean }) {
  return (
    <div className="row mb-3">
      <div className="col-5 text-start blueText">
        <strong>{label}:</strong>
      </div>
      <div className="col-7 text-end">
        {loading ? (
          <span className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </span>
        ) : value ? (
          <span className="mb-0">{value}</span>
        ) : (
          <small className="text-muted fst-italic">N/A</small>
        )}
      </div>
    </div>
  );
}

export default function NurseInformation({
  image,
  fullName,
  gender,
  dob,
  phone,
  CIC,
  address,
  email,
  departmentID,
  loading
}: NurseProps & { loading?: boolean }) {
  return (
    <div className="col-lg-6 col-sm-12 d-flex">
      <div className="w-100 d-flex flex-column border whiteBg marginBottom dropShadow p-3">
        <div className="row">
          {/* Left section: Nurse info */}
          <div className="col-8">
            <h5 className="blueText mb-3">Nurse Information</h5>

            <InfoRow label="Full name" value={fullName} loading={loading} />
            <InfoRow label="Date of birth" value={dob} loading={loading} />
            <InfoRow label="Gender" value={gender} loading={loading} />
            <InfoRow label="Phone" value={phone} loading={loading} />
            <InfoRow label="ID card" value={String(CIC)} loading={loading} />
            <InfoRow label="Email" value={email} loading={loading} />
            <InfoRow label="Address" value={address} loading={loading} />
          </div>

          {/* Right section: Avatar */}
          <div className="col-4 d-flex justify-content-center align-items-start">
            {image ? (
              <img
                src={image}
                className="avtIMG img-fluid rounded"
                alt={`${fullName || "Nurse"}'s avatar`}
                loading="lazy"
              />
            ) : (
              <div
                className="placeholder-glow"
                style={{ width: "100px", height: "100px" }}
              >
                <div className="placeholder w-100 h-100 rounded"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
