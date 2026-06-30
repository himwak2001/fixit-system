import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HiShieldExclamation } from "react-icons/hi2";
import useAuth from "../hooks/useAuth";

function UnauthorizedPage() {
  const navigate = useNavigate();
  const { roleHome } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9]">
      <VStack spacing={5} textAlign="center" maxW="420px" px={6}>
        <Box
          w="72px"
          h="72px"
          borderRadius="20px"
          bg="red.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <HiShieldExclamation size={36} color="#E53E3E" />
        </Box>
        <div>
          <Text
            fontSize="22px"
            fontWeight="700"
            color="gray.800"
            letterSpacing="-0.02em"
          >
            Access Denied
          </Text>
          <Text fontSize="14px" color="gray.500" mt={2} lineHeight={1.7}>
            You don't have permission to view this page. Please contact your
            administrator if you think this is a mistake.
          </Text>
        </div>
        <Button
          colorScheme="brand"
          onClick={() => navigate(roleHome, { replace: true })}
        >
          Go to My Dashboard
        </Button>
      </VStack>
    </div>
  );
}

export default UnauthorizedPage;
