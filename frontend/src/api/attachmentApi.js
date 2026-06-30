import api from "./axios";

/**
 * Step 1 of S3 upload flow.
 * POST /tickets/:id/upload-url
 * Returns { uploadUrl, s3Key, expiresInSeconds }
 */
export const getUploadUrl = async (ticketId, payload) => {
  const res = await api.post(`/tickets/${ticketId}/upload-url`, payload);
  return res.data;
};

/**
 * Step 2 of S3 upload flow.
 * Direct PUT to S3 using the presigned URL — NOT to our backend.
 * Axios is NOT used here — raw fetch is used because:
 * 1. Our axios instance adds Authorization header — S3 rejects custom headers
 *    on presigned URLs (signature mismatch)
 * 2. S3 expects a raw binary PUT, not JSON
 *
 * @param {string} uploadUrl   - presigned S3 URL from Step 1
 * @param {File}   file        - the actual File object from input
 * @param {string} contentType - must match what was used to generate the URL
 */
export const uploadFileToS3 = async (uploadUrl, file, contentType) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(
      `S3 upload failed: ${response.status} ${response.statusText}`,
    );
  }
};

/**
 * Step 3 of S3 upload flow.
 * POST /tickets/:id/attachments
 * Tells our backend "upload succeeded, save the metadata"
 * Returns AttachmentResponse
 */
export const confirmUpload = async (ticketId, payload) => {
  const res = await api.post(`/tickets/${ticketId}/attachments`, payload);
  return res.data;
};

/**
 * GET /tickets/:id/attachments/:attId/view
 * Returns { viewUrl, expiresInSeconds }
 * Call this fresh every time — never cache the viewUrl
 */
export const getViewUrl = async (ticketId, attachmentId) => {
  const res = await api.get(
    `/tickets/${ticketId}/attachments/${attachmentId}/view`,
  );
  return res.data;
};
