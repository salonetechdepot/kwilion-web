interface ContactConfirmationEmailProps {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}

export function ContactConfirmationEmail({
  name,
  email,
  phone,
  company,
  message,
}: ContactConfirmationEmailProps) {
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: "1.6",
        color: "#333",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "8px 8px 0 0",
          textAlign: "center",
        }}
      >
        <div
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}
        >
          Kwilion
        </div>
        <div style={{ fontSize: "14px", opacity: 0.9 }}>
          Adapting your business for what's next
        </div>
      </div>

      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          border: "1px solid #e5e7eb",
          borderTop: "none",
        }}
      >
        <h2 style={{ color: "#1e3a8a", marginTop: 0 }}>
          Thank You for Reaching Out!
        </h2>

        <p>Hi {name},</p>

        <p>
          We have received your message and appreciate you taking the time to
          contact us. Our team at Kwilion Solutions will review your inquiry and
          get back to you within 24-48 hours.
        </p>

        <div
          style={{
            background: "#f9fafb",
            borderLeft: "4px solid #f97316",
            padding: "15px",
            margin: "20px 0",
            borderRadius: "4px",
          }}
        >
          <strong>Your Message:</strong>
          <p style={{ margin: "10px 0 0 0", whiteSpace: "pre-wrap" }}>
            {message}
          </p>
        </div>

        <p>
          <strong>Contact Details:</strong>
          <br />
          Email: {email}
          <br />
          Phone: {phone}
          <br />
          {company && `Company: ${company}`}
        </p>

        <p>
          In the meantime, feel free to explore our services and case studies to
          learn more about how we help businesses adapt and thrive in the
          digital landscape.
        </p>

        <div style={{ textAlign: "center" }}>
          <a
            href="https://kwilion.com/services"
            style={{
              display: "inline-block",
              background: "#f97316",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "6px",
              margin: "20px 0",
              fontWeight: 600,
            }}
          >
            Explore Our Services
          </a>
        </div>

        <p>
          If you have any urgent questions, please don't hesitate to reach out
          directly at{" "}
          <a href="mailto:info@kwilion.com" style={{ color: "#f97316" }}>
            info@kwilion.com
          </a>
          .
        </p>

        <p>
          Best regards,
          <br />
          <strong>The Kwilion Team</strong>
        </p>
      </div>

      <div
        style={{
          background: "#f9fafb",
          padding: "20px 30px",
          borderRadius: "0 0 8px 8px",
          textAlign: "center",
          fontSize: "14px",
          color: "#6b7280",
          border: "1px solid #e5e7eb",
          borderTop: "none",
        }}
      >
        <p>
          <strong>Kwilion</strong>
          <br />
          Freetown, Sierra Leone
          <br />
          <a href="mailto:info@kwilion.com" style={{ color: "#f97316" }}>
            info@kwilion.com
          </a>
        </p>
        <p style={{ marginTop: "15px", fontSize: "12px" }}>
          © {new Date().getFullYear()} Kwilion. All rights reserved.
        </p>
      </div>
    </div>
  );
}
