export interface TeamNotificationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  location: string;
  availability: string;
  coverLetter?: string;
  experience?: string;
  applicationDate: string;
  applicationId?: string; // ✅ ADD THIS
  applicationReference?: string; // ✅ add this
  jobCode?: string; // ✅ optional (if you pass it)
}

export function TeamNotificationEmail({
  firstName,
  lastName,
  email,
  phone,
  position,
  location,
  availability,
  coverLetter,
  experience,
  applicationDate,
  applicationReference,
  jobCode,
}: TeamNotificationEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          backgroundColor: "#000",
          color: "#fff",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
          New Application Received
        </h1>
        <p style={{ fontSize: "14px", margin: "5px 0 0 0", opacity: "0.9" }}>
          {applicationDate}
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "15px",
            borderBottom: "2px solid #000",
            paddingBottom: "8px",
          }}
        >
          Applicant Information
        </h2>

        <table style={{ width: "100%", fontSize: "14px", lineHeight: "1.8" }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                  width: "150px",
                }}
              >
                Name:
              </td>
              <td style={{ paddingBottom: "10px" }}>
                {firstName} {lastName}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                }}
              >
                Position:
              </td>
              <td style={{ paddingBottom: "10px" }}>
                <strong>{position}</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                }}
              >
                Email:
              </td>
              <td style={{ paddingBottom: "10px" }}>
                <a
                  href={`mailto:${email}`}
                  style={{ color: "#000", textDecoration: "underline" }}
                >
                  {email}
                </a>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                }}
              >
                Phone:
              </td>
              <td style={{ paddingBottom: "10px" }}>{phone}</td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                }}
              >
                Location:
              </td>
              <td style={{ paddingBottom: "10px" }}>{location}</td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                }}
              >
                Availability:
              </td>
              <td style={{ paddingBottom: "10px" }}>{availability}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {experience && (
        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Relevant Experience
          </h3>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "4px",
              fontSize: "14px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {experience}
          </div>
        </div>
      )}

      {applicationReference ? (
        <p style={{ fontSize: 12, margin: "8px 0 0 0", opacity: 0.85 }}>
          Reference:{" "}
          <span style={{ fontFamily: "monospace" }}>
            {applicationReference}
          </span>
        </p>
      ) : null}

      {jobCode ? (
        <p style={{ fontSize: 12, margin: "6px 0 0 0", opacity: 0.85 }}>
          Job Code: <span style={{ fontFamily: "monospace" }}>{jobCode}</span>
        </p>
      ) : null}

      {coverLetter && (
        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Cover Letter
          </h3>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "4px",
              fontSize: "14px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {coverLetter}
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: "#fffbeb",
          border: "1px solid #fbbf24",
          borderRadius: "4px",
          padding: "15px",
          marginTop: "30px",
        }}
      >
        <p style={{ fontSize: "14px", margin: "0", lineHeight: "1.6" }}>
          <strong>Action Required:</strong> Please review the attached resume
          and contact the applicant if they meet the requirements for the
          position.
        </p>
      </div>

      <div
        style={{
          borderTop: "1px solid #e0e0e0",
          marginTop: "40px",
          paddingTop: "20px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <p style={{ margin: "0" }}>
          This is an automated notification from the careers application system.
        </p>
      </div>
    </div>
  );
}
