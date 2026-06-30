import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Textarea,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  SimpleGrid,
  Badge,
  Icon,
  useToast,
} from "@chakra-ui/react";
import {
  HiArrowLeft,
  HiMapPin,
  HiClock,
  HiUser,
  HiWrenchScrewdriver,
  HiPaperAirplane,
} from "react-icons/hi2";
import useTicketDetail from "../../hooks/useTicketDetail";
import useAuth from "../../hooks/useAuth";
import StatusBadge from "../../components/tickets/StatusBadge";
import PriorityBadge from "../../components/tickets/PriorityBadge";
import UserAvatar from "../../components/ui/UserAvatar";
import { formatDateTime, formatDistanceToNow } from "../../utils/dateUtils";
import { TICKET_STATUS, USER_ROLE } from "../../utils/constants";
import AttachmentUploader from "../../components/tickets/AttachmentUploader";
import AttachmentGallery from "../../components/tickets/AttachmentGallery";
import { useDisclosure } from "@chakra-ui/react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { role } = useAuth();

  const {
    ticket,
    status,
    error,
    actionLoading,
    handleStart,
    handleResolve,
    handleClose,
    handleAddComment,
  } = useTicketDetail(id);

  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [attachments, setAttachments] = useState(ticket?.attachments || []);

  useEffect(() => {
    if (ticket?.attachments) {
      setAttachments(ticket.attachments);
    }
  }, [ticket]);

  const onSendComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      await handleAddComment(commentText.trim());
      setCommentText("");
    } catch (err) {
      toast({
        title: "Failed to add comment",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const {
    isOpen: isCloseDialogOpen,
    onOpen: onOpenCloseDialog,
    onClose: onCloseCloseDialog,
  } = useDisclosure();

  const confirmCloseTicket = async () => {
    await handleClose();
    onCloseCloseDialog();
  };

  // Loading
  if (status === "loading") {
    return (
      <VStack py={20}>
        <Spinner size="md" color="brand.500" thickness="2px" />
        <Text fontSize="13px" color="gray.400">
          Loading ticket...
        </Text>
      </VStack>
    );
  }

  // Error
  if (status === "failed") {
    return (
      <Alert status="error" borderRadius="10px">
        <AlertIcon />
        {error || "Failed to load ticket details."}
      </Alert>
    );
  }

  if (!ticket) return null;

  // Determine which action button to show based on role + status
  const showStartBtn =
    role === USER_ROLE.TECHNICIAN && ticket.status === TICKET_STATUS.ASSIGNED;
  const showResolveBtn =
    role === USER_ROLE.TECHNICIAN &&
    ticket.status === TICKET_STATUS.IN_PROGRESS;
  const showCloseBtn =
    role === USER_ROLE.TENANT && ticket.status === TICKET_STATUS.RESOLVED;

  const handleUploadSuccess = (newAttachment) => {
    setAttachments((prev) => [...prev, newAttachment]);
  };

  return (
    <Box maxW="800px">
      {/* ── Back button ── */}
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<HiArrowLeft size={14} />}
        color="gray.500"
        mb={5}
        onClick={() => navigate(-1)}
        _hover={{ color: "gray.800", bg: "gray.100" }}
      >
        Back
      </Button>

      {/* ── Ticket header ── */}
      <Box
        bg="white"
        borderRadius="14px"
        border="1px solid"
        borderColor="gray.100"
        p={6}
        mb={4}
      >
        <HStack justify="space-between" align="flex-start" mb={4}>
          <div>
            <Text
              fontFamily="mono"
              fontSize="11px"
              fontWeight="600"
              color="gray.400"
              letterSpacing="0.05em"
              mb={1}
            >
              {ticket.ticketNumber}
            </Text>
            <Text
              fontSize="20px"
              fontWeight="700"
              color="gray.800"
              letterSpacing="-0.02em"
              lineHeight={1.3}
            >
              {ticket.title}
            </Text>
          </div>
          <StatusBadge status={ticket.status} />
        </HStack>

        {/* ── Meta grid ── */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={5}>
          <Box>
            <Text
              fontSize="11px"
              color="gray.400"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={1}
            >
              Priority
            </Text>
            <PriorityBadge priority={ticket.priority} />
          </Box>
          <Box>
            <Text
              fontSize="11px"
              color="gray.400"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={1}
            >
              Category
            </Text>
            <Text fontSize="13px" fontWeight="500" color="gray.700">
              {ticket.category}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="11px"
              color="gray.400"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={1}
            >
              Location
            </Text>
            <HStack spacing={1}>
              <Icon as={HiMapPin} w={3} h={3} color="gray.400" />
              <Text fontSize="13px" fontWeight="500" color="gray.700">
                {ticket.location}
              </Text>
            </HStack>
          </Box>
          <Box>
            <Text
              fontSize="11px"
              color="gray.400"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={1}
            >
              Assigned To
            </Text>
            <HStack spacing={1.5}>
              <Icon as={HiWrenchScrewdriver} w={3} h={3} color="gray.400" />
              <Text fontSize="13px" fontWeight="500" color="gray.700">
                {ticket.assignedToName || "Unassigned"}
              </Text>
            </HStack>
          </Box>
        </SimpleGrid>

        {/* ── Description ── */}
        <Box bg="gray.50" borderRadius="10px" p={4} mb={5}>
          <Text
            fontSize="11px"
            color="gray.400"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.06em"
            mb={2}
          >
            Description
          </Text>
          <Text fontSize="14px" color="gray.700" lineHeight={1.7}>
            {ticket.description}
          </Text>
        </Box>

        {/* ── Attachments ── */}
        <Box mb={5}>
          <Text
            fontSize="11px"
            color="gray.400"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.06em"
            mb={3}
          >
            Attachments ({attachments.length}/3)
          </Text>

          <VStack spacing={3} align="stretch">
            <AttachmentGallery
              ticketId={ticket.ticketNumber}
              attachments={attachments}
            />

            {/* Upload — only available to ticket creator and not on closed tickets */}
            {role === USER_ROLE.TENANT &&
              ticket.status !== TICKET_STATUS.CLOSED &&
              ticket.status !== TICKET_STATUS.RESOLVED && (
                <AttachmentUploader
                  ticketId={ticket.ticketNumber}
                  attachments={attachments}
                  onUploadSuccess={handleUploadSuccess}
                />
              )}
          </VStack>
        </Box>

        {/* ── Timestamps ── */}
        <HStack spacing={5}>
          <HStack spacing={1.5}>
            <Icon as={HiClock} w={3.5} h={3.5} color="gray.300" />
            <Text fontSize="12px" color="gray.400">
              Created {formatDateTime(ticket.createdAt)}
            </Text>
          </HStack>
          {ticket.resolvedAt && (
            <HStack spacing={1.5}>
              <Icon as={HiClock} w={3.5} h={3.5} color="green.300" />
              <Text fontSize="12px" color="gray.400">
                Resolved {formatDateTime(ticket.resolvedAt)}
              </Text>
            </HStack>
          )}
        </HStack>

        {/* ── Action buttons ── */}
        {(showStartBtn || showResolveBtn || showCloseBtn) && (
          <>
            <Divider my={4} />
            <HStack>
              {showStartBtn && (
                <Button
                  colorScheme="purple"
                  size="sm"
                  isLoading={actionLoading}
                  onClick={handleStart}
                >
                  Start Work
                </Button>
              )}
              {showResolveBtn && (
                <Button
                  colorScheme="green"
                  size="sm"
                  isLoading={actionLoading}
                  onClick={handleResolve}
                >
                  Mark as Resolved
                </Button>
              )}
              {showCloseBtn && (
                <Button
                  colorScheme="gray"
                  size="sm"
                  onClick={onOpenCloseDialog} // opens confirm dialog instead of closing directly
                >
                  Close Ticket
                </Button>
              )}
            </HStack>
          </>
        )}
      </Box>

      {/* ── Comments thread ── */}
      <Box
        bg="white"
        borderRadius="14px"
        border="1px solid"
        borderColor="gray.100"
        p={6}
      >
        <Text
          fontSize="14px"
          fontWeight="700"
          color="gray.800"
          mb={5}
          letterSpacing="-0.01em"
        >
          Activity
          {ticket.comments?.length > 0 && (
            <Badge ml={2} colorScheme="gray" borderRadius="full" px={2}>
              {ticket.comments.length}
            </Badge>
          )}
        </Text>

        {/* Comment list */}
        <VStack spacing={4} align="stretch" mb={5}>
          {ticket.comments?.length === 0 && (
            <Text fontSize="13px" color="gray.400" textAlign="center" py={4}>
              No comments yet. Be the first to add an update.
            </Text>
          )}
          {ticket.comments?.map((c) => (
            <HStack key={c.id} align="flex-start" spacing={3}>
              <UserAvatar name={c.commentedBy} role={c.role} size="sm" />
              <Box flex={1}>
                <HStack spacing={2} mb={0.5}>
                  <Text fontSize="13px" fontWeight="600" color="gray.800">
                    {c.commentedBy}
                  </Text>
                  <Badge
                    colorScheme={
                      c.role === "ADMIN"
                        ? "orange"
                        : c.role === "TECHNICIAN"
                          ? "blue"
                          : "green"
                    }
                    fontSize="9px"
                    borderRadius="4px"
                  >
                    {c.role}
                  </Badge>
                  <Text fontSize="11px" color="gray.400">
                    {formatDistanceToNow(c.createdAt)}
                  </Text>
                </HStack>
                <Box bg="gray.50" borderRadius="0 10px 10px 10px" px={3} py={2}>
                  <Text fontSize="13px" color="gray.700" lineHeight={1.6}>
                    {c.comment}
                  </Text>
                </Box>
              </Box>
            </HStack>
          ))}
        </VStack>

        {/* Add comment — only shown if ticket is not CLOSED */}
        {ticket.status !== TICKET_STATUS.CLOSED && (
          <Box pt={4} borderTop="1px solid" borderColor="gray.100">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment or update..."
              rows={3}
              resize="none"
              mb={3}
            />
            <HStack justify="flex-end">
              <Button
                colorScheme="brand"
                size="sm"
                rightIcon={<HiPaperAirplane size={14} />}
                isLoading={commentLoading}
                isDisabled={!commentText.trim()}
                onClick={onSendComment}
              >
                Send
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
      <ConfirmDialog
        isOpen={isCloseDialogOpen}
        onClose={onCloseCloseDialog}
        onConfirm={confirmCloseTicket}
        title="Close this ticket?"
        message="Once closed, no further comments or updates can be added to this ticket. This action cannot be undone."
        confirmText="Yes, Close Ticket"
        confirmColorScheme="gray"
        isLoading={actionLoading}
      />
    </Box>
  );
}

export default TicketDetailPage;
