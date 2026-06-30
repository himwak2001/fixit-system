import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi2";
import useAuth from "../hooks/useAuth";

function NotFoundPage() {
  const navigate = useNavigate();
  const { roleHome } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9]">
      <VStack spacing={5} textAlign="center" maxW="400px" px={6}>
        <Box
          w="72px"
          h="72px"
          borderRadius="20px"
          bg="orange.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <HiExclamationCircle size={36} color="#DD6B20" />
        </Box>
        <div>
          <Text
            fontSize="40px"
            fontWeight="800"
            color="gray.200"
            letterSpacing="-0.04em"
          >
            404
          </Text>
          <Text fontSize="20px" fontWeight="700" color="gray.800" mt={-2}>
            Page not found
          </Text>
          <Text fontSize="14px" color="gray.500" mt={2}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </div>
        <Button
          colorScheme="brand"
          onClick={() => navigate(roleHome, { replace: true })}
        >
          Back to Home
        </Button>
      </VStack>
    </div>
  );
}

export default NotFoundPage;
