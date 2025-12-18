import { Logo } from "@/components/logo";
import { Image } from "lucide-react";

export interface TeamNotificationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  location: string;
  availability: string;
  coverLetter?: string | null;
  experience?: string | null;
  applicationDate: string;
  applicationId?: string;
  applicationReference?: string; // ✅ add this
  jobCode?: string; // ✅ optional (if you pass it)
  reference?: string; // ✅ add
}

export function TeamNotificationEmail(props: TeamNotificationEmailProps) {
  const {
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
    applicationId,
  } = props;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          backgroundColor: "#000",
          color: "#fff",
          padding: 20,
          marginBottom: 30,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
          New Application Received
        </h1>
        <p style={{ fontSize: 14, margin: "5px 0 0 0", opacity: 0.9 }}>
          {applicationDate}
        </p>
        {applicationId ? (
          <p style={{ fontSize: 12, margin: "8px 0 0 0", opacity: 0.85 }}>
            Application ID: {applicationId}
          </p>
        ) : null}
      </div>

      <div style={{ marginBottom: 30 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 15,
            borderBottom: "2px solid #000",
            paddingBottom: 8,
          }}
        >
          Applicant Information
        </h2>

        <table style={{ width: "100%", fontSize: 14, lineHeight: 1.8 }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: 20,
                  paddingBottom: 10,
                  width: 150,
                }}
              >
                Name:
              </td>
              <td style={{ paddingBottom: 10 }}>
                {firstName} {lastName}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: 20,
                  paddingBottom: 10,
                }}
              >
                Position:
              </td>
              <td style={{ paddingBottom: 10 }}>
                <strong>{position}</strong>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: 20,
                  paddingBottom: 10,
                }}
              >
                Email:
              </td>
              <td style={{ paddingBottom: 10 }}>
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
                  paddingRight: 20,
                  paddingBottom: 10,
                }}
              >
                Phone:
              </td>
              <td style={{ paddingBottom: 10 }}>{phone}</td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: 20,
                  paddingBottom: 10,
                }}
              >
                Location:
              </td>
              <td style={{ paddingBottom: 10 }}>{location}</td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  paddingRight: 20,
                  paddingBottom: 10,
                }}
              >
                Availability:
              </td>
              <td style={{ paddingBottom: 10 }}>{availability}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {experience ? (
        <div style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Relevant Experience
          </h3>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: 15,
              borderRadius: 4,
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {experience}
          </div>
        </div>
      ) : null}

      {coverLetter ? (
        <div style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Cover Letter
          </h3>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: 15,
              borderRadius: 4,
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {coverLetter}
          </div>
        </div>
      ) : null}

      <div
        style={{
          backgroundColor: "#fffbeb",
          border: "1px solid #fbbf24",
          borderRadius: 4,
          padding: 15,
          marginTop: 30,
        }}
      >
        <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          <strong>Action Required:</strong> Please review the application and
          resume attachment.
        </p>
      </div>

      <div
        style={{
          borderTop: "1px solid #e0e0e0",
          marginTop: 40,
          paddingTop: 20,
          fontSize: 12,
          color: "#666",
        }}
      >
        <p style={{ margin: 0 }}>
          Automated notification from the careers application system.
        </p>
      </div>
    </div>
  );
}
export interface ApplicantConfirmationEmailProps {
  firstName: string;
  lastName: string;
  position: string;
  reference?: string; // ✅ add
}

export function ApplicantConfirmationEmail({
  firstName,
  lastName,
  position,
  reference,
}: ApplicantConfirmationEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: 600,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <div
        style={{
          borderBottom: "2px solid #000",
          paddingBottom: 20,
          marginBottom: 30,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
          Application Received
        </h1>
      </div>

      <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
        Dear {firstName} {lastName},
      </p>

      <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>
        Thank you for your interest in the <strong>{position}</strong> position.
        We’ve received your application and it’s now under review.
      </p>

      {reference ? (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            padding: 14,
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 12, color: "#666" }}>Reference</div>
          <div style={{ fontFamily: "monospace", fontSize: 14 }}>
            {reference}
          </div>
        </div>
      ) : null}

      <div
        style={{
          backgroundColor: "#f5f5f5",
          border: "1px solid #e0e0e0",
          borderRadius: 4,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          What Happens Next?
        </h2>
        <ul
          style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}
        >
          <li>Our team will review your application</li>
          <li>If there’s a match, we’ll contact you</li>
          <li>
            You may be invited for an interview or asked for additional info
          </li>
        </ul>
      </div>

      <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 10 }}>
        Best regards,
      </p>
      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        style={{ marginTop: 24 }}
      >
        <tr>
          <td style={{ paddingRight: 10, verticalAlign: "middle" }}>
            <img
              src="https://roarbyte.com/roarbyte-logo.png"
              alt="Roar Byte Tech Solutions"
              width={28}
              height={28}
              style={{ display: "block", borderRadius: 4 }}
            />
          </td>

          <td style={{ verticalAlign: "middle" }}>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.4,
                fontWeight: "bold",
                margin: 0,
                color: "#000",
              }}
            >
              The Recruitment Team
            </p>
            <p
              style={{
                fontSize: 13,
                margin: "2px 0 0 0",
                color: "#444",
              }}
            >
              Roar Byte Tech Solutions
            </p>
          </td>
        </tr>
      </table>

      <div
        style={{
          borderTop: "1px solid #e0e0e0",
          marginTop: 40,
          paddingTop: 20,
          fontSize: 12,
          color: "#666",
        }}
      >
        <p style={{ margin: 0 }}>
          This is an automated confirmation email. Please do not reply.
        </p>
      </div>
    </div>
  );
}
