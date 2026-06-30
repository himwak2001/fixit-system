import { useRef } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Progress,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { HiArrowUpTray, HiPhoto } from "react-icons/hi2";
import useAttachments from "../../hooks/useAttachments";

const MAX_ATTACHMENTS = 3;

function AttachmentUploader({ ticketId, attachments = [], onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const { upload, uploading, uploadError, clearError } =
    useAttachments(ticketId);

  const remaining = MAX_ATTACHMENTS - attachments.length;
  const isAtLimit = remaining <= 0;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so selecting the same file again triggers onChange
    e.target.value = "";

    try {
      const attachment = await upload(file);
      onUploadSuccess(attachment);
    } catch {
      // Error is already set in the hook — displayed below
    }
  };

  return (
    <Box>
      {/* Drop zone / upload button */}
      {!isAtLimit && (
        <Box
          border="1.5px dashed"
          borderColor={uploading ? "brand.300" : "gray.200"}
          borderRadius="10px"
          p={5}
          textAlign="center"
          cursor={uploading ? "not-allowed" : "pointer"}
          transition="all 0.15s ease"
          _hover={
            !uploading ? { borderColor: "brand.400", bg: "orange.50" } : {}
          }
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <VStack spacing={2}>
            <Box
              w="40px"
              h="40px"
              borderRadius="10px"
              bg={uploading ? "brand.50" : "gray.50"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon
                as={uploading ? HiArrowUpTray : HiPhoto}
                w={5}
                h={5}
                color={uploading ? "brand.500" : "gray.400"}
              />
            </Box>

            {uploading ? (
              <Box w="full" px={4}>
                <Text fontSize="13px" color="brand.600" fontWeight="500" mb={2}>
                  Uploading to S3...
                </Text>
                <Progress
                  isIndeterminate
                  size="xs"
                  colorScheme="orange"
                  borderRadius="full"
                />
              </Box>
            ) : (
              <>
                <Text fontSize="13px" fontWeight="600" color="gray.600">
                  Click to upload a photo
                </Text>
                <Text fontSize="11px" color="gray.400">
                  JPG or PNG · Max 5MB · {remaining} of {MAX_ATTACHMENTS}{" "}
                  remaining
                </Text>
              </>
            )}
          </VStack>
        </Box>
      )}

      {/* Max limit reached */}
      {isAtLimit && (
        <Box
          bg="orange.50"
          borderRadius="10px"
          p={3}
          border="1px solid"
          borderColor="orange.200"
        >
          <Text fontSize="12px" color="orange.700" fontWeight="500">
            Maximum of {MAX_ATTACHMENTS} attachments reached for this ticket.
          </Text>
        </Box>
      )}

      {/* Error message */}
      {uploadError && (
        <Alert status="error" borderRadius="8px" mt={3} py={2}>
          <AlertIcon />
          <Text fontSize="13px">{uploadError}</Text>
          <Button size="xs" variant="ghost" ml="auto" onClick={clearError}>
            Dismiss
          </Button>
        </Alert>
      )}
    </Box>
  );
}

export default AttachmentUploader;
