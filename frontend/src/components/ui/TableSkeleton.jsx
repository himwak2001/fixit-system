import {
  Box,
  Skeleton,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
} from "@chakra-ui/react";

function TableSkeleton({ rows = 6, columns = 8 }) {
  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
    >
      <Table variant="simple" size="sm">
        <Thead bg="gray.50">
          <Tr>
            {Array.from({ length: columns }).map((_, i) => (
              <Th key={i} py={3}>
                <Skeleton height="10px" width="60px" />
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <Tr key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <Td key={c} py={3}>
                  <Skeleton height="12px" width={c === 0 ? "140px" : "70px"} />
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default TableSkeleton;
