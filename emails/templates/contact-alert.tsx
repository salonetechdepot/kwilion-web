interface ContactAlertEmailProps {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  submittedAt: string;
}

export function ContactAlertEmail({
  name,
  email,
  phone,
  company,
  service,
  budget,
  message,
  submittedAt,
}: ContactAlertEmailProps) {
  const dt = new Date(submittedAt);

  const ny = dt.toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  });

  const freetown = dt.toLocaleString("en-US", {
    timeZone: "Africa/Freetown",
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: "1.6",
        color: "#333",
        maxWidth: "600px",
        margin: "0 auto",
        background: "#f9fafb",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #f97316 100%)",
            color: "white",
            padding: "20px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.2)",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px",
            }}
          >
            🔔 New Contact Form Submission
          </div>
          <h1 style={{ margin: "10px 0 5px 0", fontSize: "24px" }}>
            New Lead Alert
          </h1>

          <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
            Submitted on
            <br />
            {freetown} (Freetown)
            <br />
            {ny} (New York)
          </p>
        </div>

        <div style={{ padding: "30px" }}>
          <h2 style={{ color: "#1e3a8a", marginTop: 0 }}>
            Contact Information
          </h2>

          <div style={{ display: "grid", gap: "15px", margin: "20px 0" }}>
            <div
              style={{
                background: "#f9fafb",
                padding: "12px 15px",
                borderRadius: "6px",
                borderLeft: "3px solid #f97316",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Full Name
              </div>
              <div style={{ color: "#1f2937", fontSize: "15px" }}>{name}</div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px 15px",
                borderRadius: "6px",
                borderLeft: "3px solid #f97316",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Email Address
              </div>
              <div style={{ color: "#1f2937", fontSize: "15px" }}>
                <a href={`mailto:${email}`} style={{ color: "#f97316" }}>
                  {email}
                </a>
              </div>
            </div>

            {phone && (
              <div
                style={{
                  background: "#f9fafb",
                  padding: "12px 15px",
                  borderRadius: "6px",
                  borderLeft: "3px solid #f97316",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Phone Number
                </div>
                <div style={{ color: "#1f2937", fontSize: "15px" }}>
                  <a href={`tel:${phone}`} style={{ color: "#f97316" }}>
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {company && (
              <div
                style={{
                  background: "#f9fafb",
                  padding: "12px 15px",
                  borderRadius: "6px",
                  borderLeft: "3px solid #f97316",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Company
                </div>
                <div style={{ color: "#1f2937", fontSize: "15px" }}>
                  {company}
                </div>
              </div>
            )}

            {service && (
              <div
                style={{
                  background: "#f9fafb",
                  padding: "12px 15px",
                  borderRadius: "6px",
                  borderLeft: "3px solid #f97316",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Service Interest
                </div>
                <div style={{ color: "#1f2937", fontSize: "15px" }}>
                  {service}
                </div>
              </div>
            )}

            {budget && (
              <div
                style={{
                  background: "#f9fafb",
                  padding: "12px 15px",
                  borderRadius: "6px",
                  borderLeft: "3px solid #f97316",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Budget Range
                </div>
                <div style={{ color: "#1f2937", fontSize: "15px" }}>
                  {budget}
                </div>
              </div>
            )}
          </div>

          <h2 style={{ color: "#1e3a8a" }}>Message</h2>
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fcd34d",
              padding: "20px",
              margin: "20px 0",
              borderRadius: "6px",
            }}
          >
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message}</p>
          </div>

          {budget &&
            (budget.includes("$10,000+") || budget.includes("$5,000")) && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "2px solid #dc2626",
                  padding: "15px",
                  borderRadius: "6px",
                  margin: "20px 0",
                  textAlign: "center",
                }}
              >
                <strong>⚡ High-Value Lead</strong>
                <p style={{ margin: "10px 0 0 0" }}>
                  This prospect has indicated a significant budget. Consider
                  prioritizing this inquiry.
                </p>
              </div>
            )}

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <a
              href={`mailto:${email}`}
              style={{
                display: "inline-block",
                background: "#1e3a8a",
                color: "white",
                padding: "12px 24px",
                textDecoration: "none",
                borderRadius: "6px",
                margin: "10px 5px",
                fontWeight: 600,
              }}
            >
              Reply to {name}
            </a>
            <a
              href={`mailto:${email}?subject=Re: Your Inquiry to RoarByte&body=Hi ${name},%0D%0A%0D%0AThank you for reaching out to Roar Byte...`}
              style={{
                display: "inline-block",
                background: "#1e3a8a",
                color: "white",
                padding: "12px 24px",
                textDecoration: "none",
                borderRadius: "6px",
                margin: "10px 5px",
                fontWeight: 600,
              }}
            >
              Use Template Reply
            </a>
          </div>
        </div>

        <div
          style={{
            background: "#f9fafb",
            padding: "20px 30px",
            textAlign: "center",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          <p>
            This is an automated notification from your Roar Byte website
            contact form.
            <br />
            Respond promptly to maintain high conversion rates.
          </p>
        </div>
      </div>
    </div>
  );
}
