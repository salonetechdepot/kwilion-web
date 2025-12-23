// server/lib/gcs.ts (or lib/gcs.ts — must match your @/lib/gcs import)
import { Storage as GCSStorage } from "@google-cloud/storage";

let _storage: GCSStorage | null = null;

function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function normalizePrivateKey(raw: string) {
  // Render/Vercel sometimes keep wrapping quotes; remove them
  const unquoted = raw
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");
  // Convert literal \n sequences into real newlines
  return unquoted.replace(/\\n/g, "\n").trim();
}

export function getGCS() {
  if (_storage) return _storage;

  const projectId = must("GCS_PROJECT_ID");
  const clientEmail = must("GCS_CLIENT_EMAIL");
  const privateKey = normalizePrivateKey(must("GCS_PRIVATE_KEY"));

  // sanity check to avoid silent bad config
  if (
    !privateKey.includes("BEGIN PRIVATE KEY") ||
    !privateKey.includes("END PRIVATE KEY")
  ) {
    throw new Error("GCS_PRIVATE_KEY does not look like a valid PEM key");
  }

  _storage = new GCSStorage({
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  });

  return _storage;
}

export async function uploadToGCS(params: {
  bucketName?: string; // optional: defaults to env GCS_BUCKET_NAME
  objectPath: string;
  buffer: Buffer;
  contentType?: string;
}) {
  const storage = getGCS();

  const bucketName = params.bucketName || must("GCS_BUCKET_NAME");
  const bucket = storage.bucket(bucketName);

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

  return `gs://${bucketName}/${params.objectPath}`;
}
