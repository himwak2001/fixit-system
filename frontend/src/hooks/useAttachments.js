import { useState, useCallback } from "react";
import {
  getUploadUrl,
  uploadFileToS3,
  confirmUpload,
  getViewUrl as fetchViewUrl,
} from "../api/attachmentApi";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function useAttachments(ticketId) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  /**
   * Full three-step S3 upload:
   * 1. Get presigned PUT URL from backend
   * 2. PUT file directly to S3
   * 3. Confirm to backend — saves metadata
   *
   * Returns the saved AttachmentResponse or throws on failure.
   */
  const upload = useCallback(
    async (file) => {
      setUploadError(null);

      // Client-side validation before hitting the server
      if (!ALLOWED_TYPES.includes(file.type)) {
        const msg = "Only JPG and PNG images are allowed.";
        setUploadError(msg);
        throw new Error(msg);
      }

      if (file.size > MAX_SIZE_BYTES) {
        const msg = "File size must be under 5MB.";
        setUploadError(msg);
        throw new Error(msg);
      }

      setUploading(true);
      try {
        // ── Step 1: get presigned URL ──
        const { uploadUrl, s3Key } = await getUploadUrl(ticketId, {
          fileName: file.name,
          contentType: file.type,
        });

        // ── Step 2: upload directly to S3 ──
        await uploadFileToS3(uploadUrl, file, file.type);

        // ── Step 3: confirm to backend ──
        const attachment = await confirmUpload(ticketId, {
          s3Key,
          fileName: file.name,
        });

        return attachment;
      } catch (err) {
        setUploadError(err.message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [ticketId],
  );

  /**
   * Fetches a fresh presigned GET URL for viewing one attachment.
   * Always fetched fresh — never cached because URLs expire.
   */
  const getViewUrl = useCallback(
    async (attachmentId) => {
      const { viewUrl } = await fetchViewUrl(ticketId, attachmentId);
      return viewUrl;
    },
    [ticketId],
  );

  const clearError = useCallback(() => setUploadError(null), []);

  return {
    upload,
    getViewUrl,
    uploading,
    uploadError,
    clearError,
  };
}

export default useAttachments;
