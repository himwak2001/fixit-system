import { useState } from "react";
import {
  SimpleGrid,
  Box,
  Text,
  Icon,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { HiPhoto, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { formatDistanceToNow } from "../../utils/dateUtils";
import useAttachments from "../../hooks/useAttachments";

function AttachmentGallery({ ticketId, attachments = [] }) {
  const { getViewUrl } = useAttachments(ticketId);
  const toast = useToast();

  // Track loading state per attachment id
  const [loadingId, setLoadingId] = useState(null);

  const handleView = async (attachment) => {
    setLoadingId(attachment.id);
    try {
      // Always fetch a fresh presigned URL — never use a cached one
      const url = await getViewUrl(attachment.id);
      // Open in a new tab — browser handles image display
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast({
        title: "Could not open file",
        description: "Failed to generate view URL. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (attachments.length === 0) {
    return (
      <Box
        bg="gray.50"
        borderRadius="10px"
        p={5}
        textAlign="center"
        border="1px dashed"
        borderColor="gray.200"
      >
        <Icon as={HiPhoto} w={6} h={6} color="gray.300" mb={2} />
        <Text fontSize="12px" color="gray.400">
          No attachments yet
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
      {attachments.map((att) => (
        <Tooltip
          key={att.id}
          label={`Click to view · ${att.uploadedBy}`}
          fontSize="12px"
          placement="top"
        >
          <Box
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="10px"
            p={3}
            cursor="pointer"
            transition="all 0.15s ease"
            _hover={{
              borderColor: "brand.300",
              bg: "orange.50",
              boxShadow: "0 2px 8px rgba(255,153,0,0.12)",
            }}
            onClick={() => handleView(att)}
            position="relative"
          >
            {/* Loading overlay per attachment */}
            {loadingId === att.id && (
              <Box
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="whiteAlpha.700"
                borderRadius="10px"
                zIndex={1}
              >
                <Spinner size="sm" color="brand.500" />
              </Box>
            )}

            <Box
              w="full"
              h="70px"
              bg="gray.100"
              borderRadius="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <Icon as={HiPhoto} w={7} h={7} color="gray.300" />
            </Box>

            <HStack justify="space-between" align="flex-end">
              <Box minW={0}>
                <Text
                  fontSize="11px"
                  fontWeight="600"
                  color="gray.700"
                  noOfLines={1}
                >
                  {att.fileName}
                </Text>
                <Text fontSize="10px" color="gray.400" mt={0.5}>
                  {formatDistanceToNow(att.uploadedAt)}
                </Text>
              </Box>
              <Icon
                as={HiArrowTopRightOnSquare}
                w={3.5}
                h={3.5}
                color="gray.400"
                flexShrink={0}
              />
            </HStack>
          </Box>
        </Tooltip>
      ))}
    </SimpleGrid>
  );
}

export default AttachmentGallery;
