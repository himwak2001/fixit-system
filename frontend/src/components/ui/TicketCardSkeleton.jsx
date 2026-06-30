import { Box, Skeleton, SkeletonText, HStack, VStack } from "@chakra-ui/react";

function TicketCardSkeleton() {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="12px"
      p={4}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Skeleton height="12px" width="80px" borderRadius="4px" />
          <Skeleton height="20px" width="70px" borderRadius="full" />
        </HStack>
        <SkeletonText noOfLines={2} spacing={2} skeletonHeight="10px" />
        <Skeleton height="10px" width="120px" borderRadius="4px" />
        <HStack justify="space-between">
          <Skeleton height="18px" width="60px" borderRadius="6px" />
          <Skeleton height="10px" width="50px" borderRadius="4px" />
        </HStack>
      </VStack>
    </Box>
  );
}

/**
 * Renders a grid of skeleton cards — used while the real
 * ticket list is loading, matching the SimpleGrid layout
 * used by the actual TicketCard grid.
 */
export function TicketCardSkeletonGrid({ count = 6 }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        xl: "repeat(3, 1fr)",
      }}
      gap={4}
    >
      {Array.from({ length: count }).map((_, i) => (
        <TicketCardSkeleton key={i} />
      ))}
    </Box>
  );
}

export default TicketCardSkeleton;
