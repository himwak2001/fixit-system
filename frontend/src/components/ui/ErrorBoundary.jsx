import { Component } from "react";
import { Box, Button, Text, VStack, Code } from "@chakra-ui/react";
import { HiExclamationTriangle } from "react-icons/hi2";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // React calls this when a descendant component throws during render
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Used for logging — in production this would send to a service
  // like Sentry. For this project we just log to console.
  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught render error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Force a full reload to clear any corrupted state
    window.location.href = "/login";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9]">
          <VStack spacing={5} textAlign="center" maxW="480px" px={6}>
            <Box
              w="72px"
              h="72px"
              borderRadius="20px"
              bg="red.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <HiExclamationTriangle size={36} color="#E53E3E" />
            </Box>

            <div>
              <Text
                fontSize="20px"
                fontWeight="700"
                color="gray.800"
                letterSpacing="-0.02em"
              >
                Something went wrong
              </Text>
              <Text fontSize="14px" color="gray.500" mt={2} lineHeight={1.7}>
                An unexpected error occurred while rendering this page. Try
                refreshing — if the problem persists, please contact support.
              </Text>
            </div>

            {/* Only show technical details in dev mode — never in production */}
            {import.meta.env.DEV && this.state.error && (
              <Box
                bg="gray.900"
                borderRadius="8px"
                p={3}
                w="full"
                textAlign="left"
                maxH="120px"
                overflowY="auto"
              >
                <Code
                  fontSize="11px"
                  bg="transparent"
                  color="red.300"
                  whiteSpace="pre-wrap"
                  fontFamily="mono"
                >
                  {this.state.error.toString()}
                </Code>
              </Box>
            )}

            <Button colorScheme="brand" onClick={this.handleReset}>
              Back to Login
            </Button>
          </VStack>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
