import {
  Box,
  HStack,
  VStack,
  Text,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import useTickets from "../../hooks/useTickets";
import TicketCard from "../../components/tickets/TicketCard";
import FilterBar from "../../components/tickets/FilterBar";
import EmptyTickets from "../../components/tickets/EmptyTickets";

function AssignedTicketsPage() {
  const {
    tickets,
    status,
    error,
    pagination,
    filters,
    onFilterChange,
    onResetFilters,
  } = useTickets();

  const isFiltered = Object.values(filters).some((v) => v !== "");

  return (
    <Box>
      <HStack justify="space-between" align="flex-start" mb={6}>
        <div>
          <Text
            fontSize="20px"
            fontWeight="700"
            color="gray.800"
            letterSpacing="-0.02em"
          >
            Assigned Tickets
          </Text>
          <Text fontSize="13px" color="gray.500" mt={1}>
            Issues assigned to you — keep statuses updated as you work.
          </Text>
        </div>
      </HStack>

      <Box mb={5}>
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          totalElements={pagination.totalElements}
        />
      </Box>

      {status === "loading" && (
        <VStack py={20}>
          <Spinner size="md" color="brand.500" thickness="2px" />
          <Text fontSize="13px" color="gray.400">
            Loading assignments...
          </Text>
        </VStack>
      )}

      {status === "failed" && (
        <Alert status="error" borderRadius="10px">
          <AlertIcon />
          {error || "Failed to load assigned tickets."}
        </Alert>
      )}

      {status === "succeeded" && tickets.length === 0 && (
        <EmptyTickets isFiltered={isFiltered} />
      )}

      {status === "succeeded" && tickets.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default AssignedTicketsPage;
