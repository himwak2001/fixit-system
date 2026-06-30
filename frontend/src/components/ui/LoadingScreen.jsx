import { Spinner, Text, VStack, Box } from "@chakra-ui/react";
import { HiWrenchScrewdriver } from "react-icons/hi2";

function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0F172A]">
      <VStack spacing={4}>
        {/* Brand mark */}
        <Box
          w="56px"
          h="56px"
          borderRadius="14px"
          bg="brand.500"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 8px 32px rgba(255,153,0,0.35)"
        >
          <HiWrenchScrewdriver size={28} color="white" />
        </Box>

        <Text
          fontSize="xl"
          fontWeight="700"
          color="white"
          letterSpacing="-0.02em"
        >
          FixIt
        </Text>

        <Spinner size="sm" color="brand.500" thickness="2px" speed="0.65s" />

        <Text fontSize="sm" color="whiteAlpha.500">
          {message}
        </Text>
      </VStack>
    </div>
  );
}

export default LoadingScreen;
