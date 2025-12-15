// server/lib/gcs.ts
import { Storage as GCSStorage } from "@google-cloud/storage";

let _storage: GCSStorage | null = null;

function decodeMaybeBase64(raw: string) {
  const s = raw.trim();

  // If it's already JSON, return as-is
  if (s.startsWith("{")) return s;

  // Otherwise assume base64
  return Buffer.from(s, "base64").toString("utf8").trim();
}

export function getGCS() {
  if (_storage) return _storage;

  const raw = process.env.GCP_PRIVATE_KEY;
  if (!raw) throw new Error("GCP_PRIVATE_KEY is not set");

  // Strip common copy/paste junk
  const cleaned = raw
    .trim()
    .replace(/%$/, "")
    .replace(/^"(.*)"$/, "$1");

  const jsonText = decodeMaybeBase64(cleaned);
  const credentials = JSON.parse(jsonText);

  // Fix escaped newlines in private_key
  if (typeof credentials.private_key === "string") {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }

  if (!credentials.client_email) {
    throw new Error("Service account JSON missing client_email.");
  }

  _storage = new GCSStorage({
    projectId: credentials.project_id,
    credentials,
  });

  return _storage;
}

export async function uploadToGCS(params: {
  bucketName: string;
  objectPath: string;
  buffer: Buffer;
  contentType?: string;
}) {
  const storage = getGCS();
  const bucket = storage.bucket(params.bucketName);

  const [exists] = await bucket.exists();
  if (!exists) {
    throw new Error(
      `GCS bucket "${params.bucketName}" not found or not accessible by this service account.`
    );
  }

  const file = bucket.file(params.objectPath);

  await new Promise<void>((resolve, reject) => {
    const stream = file.createWriteStream({
      resumable: false,
      contentType: params.contentType || "application/octet-stream",
      metadata: { cacheControl: "private, max-age=0" },
    });

    stream.on("error", reject);
    stream.on("finish", resolve);
    stream.end(params.buffer);
  });

  return `gs://${params.bucketName}/${params.objectPath}`;
}
