import { useState } from "react";
import './css/Introduce.css';

export default function Introduce() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="container-fluid">
      <hr />
      <h4 className="blueText headd1">About Us</h4>

      <div className="row p-3">
        {/* Left Column – Hospital Info */}
        <div className="col-md-6">
          <h6 className="blueText">Hospital Information</h6>
          <hr />
          <div className={`text-content ${showMore ? "expanded" : ""}`}>
            <p>
              International Hospital (IH) covers an area of 12.76 hectares,
              located in Lai Thieu Ward, Thuan An City, Binh Duong Province.
            </p>
            <p>
              Operating with the motto <strong>"Patient-centered care"</strong>,
              the hospital continuously strives to improve the quality of its medical
              examination and treatment services. It regularly invests in and upgrades
              modern medical equipment while maintaining a clean, comfortable, and
              friendly environment.
            </p>
            <p>
              In addition, IH focuses on research and the application of the latest
              medical technologies and scientific advancements in both treatment
              procedures and management operations.
            </p>
            <p>
              The hospital also aims to build a high-quality management system that
              meets the international JCI (Joint Commission International) accreditation
              standards.
            </p>
            <p>
              Officially opened on <strong>December 30, 2016</strong>, BIH has a capacity
              of <strong>1,200 beds</strong>, including <strong>300 inpatient beds</strong>
              and <strong>45 examination rooms</strong> covering all medical specialties.
            </p>
          </div>

          <button
            className="btn btn-link show-more-btn d-md-none"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less ▲" : "Show More ▼"}
          </button>
        </div>

        {/* Right Column – Working Hours */}
        <div className="col-md-6">
          <h6 className="blueText">Working Hours</h6>
          <hr />
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-primary">
              <tr>
                <th scope="col">Session</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Morning</td>
                <td>07:30 AM – 12:00 PM</td>
              </tr>
              <tr>
                <td>Afternoon</td>
                <td>01:00 PM – 03:30 PM</td>
              </tr>
              <tr>
                <td>Emergency Department</td>
                <td>Open 24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
