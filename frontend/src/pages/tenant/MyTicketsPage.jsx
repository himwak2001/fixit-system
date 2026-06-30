import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi2";
import useTickets from "../../hooks/useTickets";
import TicketCard from "../../components/tickets/TicketCard";
import FilterBar from "../../components/tickets/FilterBar";
import EmptyTickets from "../../components/tickets/EmptyTickets";
import CreateTicketModal from "../../components/tickets/CreateTicketModal";
import { TicketCardSkeletonGrid } from "../../components/ui/TicketCardSkeleton";

function MyTicketsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    tickets,
    status,
    error,
    pagination,
    filters,
    onFilterChange,
    onResetFilters,
    onPageChange,
  } = useTickets();

  const isFiltered = Object.values(filters).some((v) => v !== "");

  return (
    <Box>
      {/* ── Page header ── */}
      <HStack justify="space-between" align="flex-start" mb={6}>
        <div>
          <Text
            fontSize="20px"
            fontWeight="700"
            color="gray.800"
            letterSpacing="-0.02em"
          >
            My Tickets
          </Text>
          <Text fontSize="13px" color="gray.500" mt={1}>
            Track and manage your reported facility issues
          </Text>
        </div>
        <Button
          colorScheme="brand"
          leftIcon={<HiPlus size={16} />}
          onClick={onOpen}
          size="md"
          flexShrink={0}
        >
          New Ticket
        </Button>
      </HStack>

      {/* ── Filters ── */}
      <Box mb={5}>
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          totalElements={pagination.totalElements}
        />
      </Box>

      {/* ── Content ── */}
      {status === "loading" && <TicketCardSkeletonGrid count={6} />}

      {status === "failed" && (
        <Alert status="error" borderRadius="10px" mb={4}>
          <AlertIcon />
          {error || "Failed to load tickets. Please try again."}
        </Alert>
      )}

      {status === "succeeded" && tickets.length === 0 && (
        <EmptyTickets onCreateClick={onOpen} isFiltered={isFiltered} />
      )}

      {status === "succeeded" && tickets.length > 0 && (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </SimpleGrid>

          {/* ── Pagination ── */}
          {pagination.totalPages > 1 && (
            <HStack justify="center" mt={8} spacing={3}>
              <Button
                size="sm"
                variant="outline"
                isDisabled={pagination.page === 0}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <Text fontSize="13px" color="gray.500">
                Page {pagination.page + 1} of {pagination.totalPages}
              </Text>
              <Button
                size="sm"
                variant="outline"
                isDisabled={pagination.last}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </HStack>
          )}
        </>
      )}

      {/* ── Create Ticket Modal ── */}
      <CreateTicketModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default MyTicketsPage;
