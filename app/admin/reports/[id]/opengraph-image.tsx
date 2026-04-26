import { ImageResponse } from "next/og";
import { mockJobs } from "../../../../shared/api/mock-data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = mockJobs.find((j) => j.id === id || j.legacy_id === id);

  const displayId = job?.wo_number || job?.legacy_id || id.substring(0, 8);
  const woId = displayId.toUpperCase().startsWith("WO-")
    ? displayId.toUpperCase()
    : "WO-" + displayId.toUpperCase();
  const clientName = job?.client_name || "VERIFIED CLIENT";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          border: "40px solid #000000",
        }}
      >
        {/* 'RS' Monolith */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "140px",
            height: "140px",
            backgroundColor: "#000000",
            border: "8px solid #cda03a",
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              color: "#cda03a",
              fontSize: "80px",
              fontWeight: 900,
              fontFamily: "monospace",
            }}
          >
            RS
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "4px solid #cda03a",
            padding: "30px 50px",
            backgroundColor: "#000000",
            width: "80%",
          }}
        >
          <span
            style={{
              color: "#cda03a",
              fontSize: "20px",
              fontWeight: 900,
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "15px",
            }}
          >
            JOB VERIFICATION REPORT
          </span>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "56px",
              margin: 0,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            {woId}
          </h1>
          <p
            style={{
              color: "#ffffff",
              fontSize: "28px",
              margin: "10px 0 0 0",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              textAlign: "center",
              opacity: 0.9,
            }}
          >
            {clientName}
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              color: "#cda03a",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
            }}
          >
            REAL STONE | FIELD OPERATIONS SYSTEM
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
