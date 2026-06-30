import { VStack, Box, Text, Button } from "@chakra-ui/react";
import { HiTicket } from "react-icons/hi2";

function EmptyTickets({ onCreateClick, isFiltered }) {
  return (
    <VStack spacing={4} py={20} textAlign="center">
      <Box
        w="72px"
        h="72px"
        borderRadius="20px"
        bg="orange.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <HiTicket size={36} color="#FF9900" />
      </Box>

      <div>
        <Text fontSize="17px" fontWeight="700" color="gray.700">
          {isFiltered ? "No tickets match your filters" : "No tickets yet"}
        </Text>
        <Text fontSize="13px" color="gray.400" mt={1.5}>
          {isFiltered
            ? "Try adjusting or clearing your filters to see more results."
            : "When you report a facility issue, it will appear here."}
        </Text>
      </div>

      {!isFiltered && onCreateClick && (
        <Button colorScheme="brand" size="sm" onClick={onCreateClick} mt={1}>
          Report an issue
        </Button>
      )}
    </VStack>
  );
}

export default EmptyTickets;
