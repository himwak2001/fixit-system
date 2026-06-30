import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { HiArrowPath } from "react-icons/hi2";
import useAdminTickets from "../../hooks/useAdminTickets";
import FilterBar from "../../components/tickets/FilterBar";
import TicketTable from "../../components/tickets/TicketTable";
import EmptyTickets from "../../components/tickets/EmptyTickets";
import TableSkeleton from "../../components/ui/TableSkeleton";

function AllTicketsPage() {
  const {
    tickets,
    status,
    error,
    pagination,
    filters,
    technicians,
    techniciansStatus,
    assignLoading,
    assignError,
    refetch,
    onFilterChange,
    onResetFilters,
    onPageChange,
    onAssign,
    clearAssignError,
  } = useAdminTickets();

  const isFiltered = Object.values(filters).some((v) => v !== "");

  return (
    <Box>
      {/* ── Header ── */}
      <HStack justify="space-between" align="flex-start" mb={6}>
        <div>
          <Text
            fontSize="20px"
            fontWeight="700"
            color="gray.800"
            letterSpacing="-0.02em"
          >
            All Tickets
          </Text>
          <Text fontSize="13px" color="gray.500" mt={1}>
            Manage and assign facility tickets across the organization
          </Text>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<HiArrowPath size={14} />}
          onClick={() => refetch()}
          color="gray.600"
          isLoading={status === "loading"}
        >
          Refresh
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
      {status === 'loading' && <TableSkeleton rows={6} columns={8} />}

      {status === "failed" && (
        <Alert status="error" borderRadius="10px" mb={4}>
          <AlertIcon />
          {error || "Failed to load tickets."}
        </Alert>
      )}

      {status === "succeeded" && tickets.length === 0 && (
        <EmptyTickets isFiltered={isFiltered} />
      )}

      {status === "succeeded" && tickets.length > 0 && (
        <>
          <TicketTable
            tickets={tickets}
            technicians={technicians}
            techniciansStatus={techniciansStatus}
            onAssign={onAssign}
            assignLoading={assignLoading}
            assignError={assignError}
            onClearAssignError={clearAssignError}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <HStack justify="center" mt={6} spacing={3}>
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
    </Box>
  );
}

export default AllTicketsPage;
