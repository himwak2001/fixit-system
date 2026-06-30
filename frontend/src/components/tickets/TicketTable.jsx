import { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  HStack,
  Badge,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiUserPlus } from "react-icons/hi2";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import AssignModal from "./AssignModal";
import { formatDistanceToNow } from "../../utils/dateUtils";
import { TICKET_STATUS } from "../../utils/constants";

function TicketTable({
  tickets,
  technicians,
  techniciansStatus,
  onAssign,
  assignLoading,
  assignError,
  onClearAssignError,
}) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const openAssignModal = (ticket) => {
    setSelectedTicket(ticket);
    onOpen();
  };

  if (tickets.length === 0) return null;

  return (
    <>
      <Box
        bg="white"
        borderRadius="12px"
        border="1px solid"
        borderColor="gray.100"
        overflow="hidden"
      >
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                {[
                  "Ticket",
                  "Category",
                  "Priority",
                  "Status",
                  "Reported By",
                  "Assigned To",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <Th
                    key={h}
                    fontSize="10px"
                    fontWeight="700"
                    letterSpacing="0.06em"
                    color="gray.500"
                    textTransform="uppercase"
                    py={3}
                    borderColor="gray.100"
                  >
                    {h}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {tickets.map((ticket) => (
                <Tr
                  key={ticket.ticketNumber}
                  _hover={{ bg: "gray.50" }}
                  transition="background 0.1s ease"
                >
                  <Td borderColor="gray.100" py={3}>
                    <Box>
                      <Text
                        fontFamily="mono"
                        fontSize="10px"
                        color="gray.400"
                        letterSpacing="0.05em"
                      >
                        {ticket.ticketNumber}
                      </Text>
                      <Text
                        fontSize="13px"
                        fontWeight="600"
                        color="gray.800"
                        noOfLines={1}
                        maxW="200px"
                      >
                        {ticket.title}
                      </Text>
                    </Box>
                  </Td>
                  <Td borderColor="gray.100" py={3}>
                    <Text fontSize="12px" color="gray.600">
                      {ticket.category}
                    </Text>
                  </Td>
                  <Td borderColor="gray.100" py={3}>
                    <PriorityBadge priority={ticket.priority} />
                  </Td>
                  <Td borderColor="gray.100" py={3}>
                    <StatusBadge status={ticket.status} />
                  </Td>
                  <Td borderColor="gray.100" py={3}>
                    <Text fontSize="12px" color="gray.600">
                      {ticket.createdByName}
                    </Text>
                  </Td>
                  <Td borderColor="gray.100" py={3}>
                    {ticket.assignedToName ? (
                      <Badge
                        colorScheme="blue"
                        borderRadius="6px"
                        fontSize="11px"
                      >
                        {ticket.assignedToName}
                      </Badge>
                    ) : (
                      <Text fontSize="12px" color="gray.400">
                        —
                      </Text>
                    )}
                  </Td>
                  <Td borderColor="gray.100" py={3}>
                    <Text fontSize="11px" color="gray.400">
                      {formatDistanceToNow(ticket.createdAt)}
                    </Text>
                  </Td>
                  <Td borderColor="gray.100" py={3}>
                    <HStack spacing={1}>
                      {/* View detail */}
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        leftIcon={<HiEye size={12} />}
                        onClick={() => navigate(`/app/tickets/${ticket.ticketNumber}`)}
                        fontSize="11px"
                      >
                        View
                      </Button>

                      {/* Assign — only for OPEN tickets */}
                      {ticket.status === TICKET_STATUS.OPEN && (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="outline"
                          leftIcon={<HiUserPlus size={12} />}
                          onClick={() => openAssignModal(ticket)}
                          fontSize="11px"
                        >
                          Assign
                        </Button>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      <AssignModal
        isOpen={isOpen}
        onClose={onClose}
        ticket={selectedTicket}
        technicians={technicians}
        techniciansStatus={techniciansStatus}
        onAssign={onAssign}
        assignLoading={assignLoading}
        assignError={assignError}
        onClearError={onClearAssignError}
      />
    </>
  );
}

export default TicketTable;
