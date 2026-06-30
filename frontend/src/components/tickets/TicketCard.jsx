import { Box, Text, HStack, VStack, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HiMapPin, HiClock } from "react-icons/hi2";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { formatDistanceToNow } from "../../utils/dateUtils";

// Category icons mapping
const CATEGORY_EMOJI = {
  PLUMBING: "🔧",
  ELECTRICAL: "⚡",
  HVAC: "❄️",
  CLEANING: "🧹",
  OTHER: "📋",
};

function TicketCard({ ticket }) {
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="12px"
      p={4}
      cursor="pointer"
      transition="all 0.15s ease"
      _hover={{
        borderColor: "brand.300",
        boxShadow: "0 4px 16px rgba(255,153,0,0.10)",
        transform: "translateY(-1px)",
      }}
      onClick={() => navigate(`/app/tickets/${ticket.ticketNumber}`)}
    >
      <VStack align="stretch" spacing={3}>
        {/* ── Top row: ticket number + status ── */}
        <HStack justify="space-between" align="flex-start">
          <Text
            fontFamily="mono"
            fontSize="11px"
            fontWeight="600"
            color="gray.400"
            letterSpacing="0.05em"
          >
            {ticket.ticketNumber}
          </Text>
          <StatusBadge status={ticket.status} />
        </HStack>

        {/* ── Title ── */}
        <Text
          fontSize="14px"
          fontWeight="600"
          color="gray.800"
          letterSpacing="-0.01em"
          lineHeight={1.4}
          noOfLines={2}
        >
          {CATEGORY_EMOJI[ticket.category] || "📋"} {ticket.title}
        </Text>

        {/* ── Location ── */}
        <HStack spacing={1.5}>
          <Icon as={HiMapPin} w={3} h={3} color="gray.400" />
          <Text fontSize="12px" color="gray.500" noOfLines={1}>
            {ticket.location}
          </Text>
        </HStack>

        {/* ── Bottom row: priority + time + assigned ── */}
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <PriorityBadge priority={ticket.priority} />
            {ticket.assignedToName && (
              <Text fontSize="11px" color="gray.400">
                → {ticket.assignedToName}
              </Text>
            )}
          </HStack>

          <HStack spacing={1}>
            <Icon as={HiClock} w={3} h={3} color="gray.300" />
            <Text fontSize="11px" color="gray.400">
              {formatDistanceToNow(ticket.createdAt)}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}

export default TicketCard;
