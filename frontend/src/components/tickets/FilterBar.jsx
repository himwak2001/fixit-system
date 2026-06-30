import { HStack, Select, Button, Text } from "@chakra-ui/react";
import { HiFunnel, HiXMark } from "react-icons/hi2";
import {
  TICKET_STATUS,
  TICKET_CATEGORY,
  TICKET_PRIORITY,
} from "../../utils/constants";

function FilterBar({ filters, onFilterChange, onResetFilters, totalElements }) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <HStack spacing={3} flexWrap="wrap">
      {/* Status filter */}
      <Select
        size="sm"
        w="150px"
        borderRadius="8px"
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        placeholder="All statuses"
        icon={<HiFunnel />}
      >
        {Object.values(TICKET_STATUS).map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </Select>

      {/* Category filter */}
      <Select
        size="sm"
        w="150px"
        borderRadius="8px"
        value={filters.category}
        onChange={(e) => onFilterChange({ category: e.target.value })}
        placeholder="All categories"
      >
        {Object.values(TICKET_CATEGORY).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      {/* Priority filter — admin and technician get this */}
      <Select
        size="sm"
        w="140px"
        borderRadius="8px"
        value={filters.priority}
        onChange={(e) => onFilterChange({ priority: e.target.value })}
        placeholder="All priorities"
      >
        {Object.values(TICKET_PRIORITY).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </Select>

      {/* Result count */}
      <Text fontSize="13px" color="gray.500" pl={1}>
        {totalElements} ticket{totalElements !== 1 ? "s" : ""}
      </Text>

      {/* Clear filters — only shown when filters are active */}
      {hasActiveFilters && (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray"
          leftIcon={<HiXMark size={14} />}
          onClick={onResetFilters}
          color="gray.500"
          _hover={{ color: "gray.700" }}
        >
          Clear
        </Button>
      )}
    </HStack>
  );
}

export default FilterBar;
