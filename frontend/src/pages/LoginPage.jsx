import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Text, VStack, HStack, Icon } from "@chakra-ui/react";
import {
  HiWrenchScrewdriver,
  HiShieldCheck,
  HiBoltSlash,
  HiClock,
} from "react-icons/hi2";
import useAuth from "../hooks/useAuth";

// Feature highlights shown on the login page
const FEATURES = [
  {
    icon: HiShieldCheck,
    title: "Secure & Role-Based",
    desc: "Tenants, Technicians, and Admins each see only what they need.",
  },
  {
    icon: HiBoltSlash,
    title: "Real-Time Tracking",
    desc: "Follow every ticket from OPEN to RESOLVED in one place.",
  },
  {
    icon: HiClock,
    title: "Fast Resolution",
    desc: "Streamlined assignment and status updates cut resolution time.",
  },
];

function LoginPage() {
  const { isAuthenticated, roleHome, isInitializing, login } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, skip login page and go straight to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate(roleHome, { replace: true });
    }
  }, [isAuthenticated, roleHome, navigate]);

  return (
    <div className="min-h-screen flex bg-[#0F172A]">
      {/* ── Left panel — Branding ──────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[520px] p-12 border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Box
            w="44px"
            h="44px"
            borderRadius="12px"
            bg="brand.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 8px 24px rgba(255,153,0,0.3)"
          >
            <HiWrenchScrewdriver size={24} color="white" />
          </Box>
          <Text
            fontSize="22px"
            fontWeight="800"
            color="white"
            letterSpacing="-0.03em"
          >
            FixIt
          </Text>
        </div>

        {/* Headline */}
        <div>
          <Text
            fontSize="36px"
            fontWeight="800"
            color="white"
            letterSpacing="-0.04em"
            lineHeight={1.15}
            mb={4}
          >
            Resolve faster.{" "}
            <Text as="span" color="brand.500">
              Report smarter.
            </Text>
          </Text>
          <Text
            fontSize="16px"
            color="whiteAlpha.500"
            lineHeight={1.7}
            maxW="380px"
          >
            A unified platform for tenants to report facility issues and for
            teams to resolve them - efficiently and transparently.
          </Text>

          {/* Features */}
          <VStack spacing={5} align="flex-start" mt={10}>
            {FEATURES.map(({ icon, title, desc }) => (
              <HStack key={title} spacing={4} align="flex-start">
                <Box
                  w="36px"
                  h="36px"
                  borderRadius="10px"
                  bg="rgba(255,153,0,0.12)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  mt="1px"
                >
                  <Icon as={icon} w={4} h={4} color="brand.500" />
                </Box>
                <div>
                  <Text fontSize="14px" fontWeight="600" color="white">
                    {title}
                  </Text>
                  <Text
                    fontSize="13px"
                    color="whiteAlpha.500"
                    mt={0.5}
                    lineHeight={1.6}
                  >
                    {desc}
                  </Text>
                </div>
              </HStack>
            ))}
          </VStack>
        </div>

        {/* Footer */}
        <Text fontSize="12px" color="whiteAlpha.300">
          © {new Date().getFullYear()} FixIt. All rights reserved.
        </Text>
      </div>

      {/* ── Right panel — Login card ───────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Box
          bg="white"
          borderRadius="20px"
          p={{ base: 8, md: 10 }}
          w="full"
          maxW="420px"
          boxShadow="0 24px 64px rgba(0,0,0,0.4)"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <Box
              w="36px"
              h="36px"
              borderRadius="10px"
              bg="brand.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <HiWrenchScrewdriver size={20} color="white" />
            </Box>
            <Text fontSize="18px" fontWeight="800" letterSpacing="-0.02em">
              FixIt
            </Text>
          </div>

          <Text
            fontSize="24px"
            fontWeight="800"
            color="gray.800"
            letterSpacing="-0.03em"
          >
            Welcome back
          </Text>
          <Text fontSize="14px" color="gray.500" mt={2} mb={8}>
            Sign in to access your facility management dashboard.
          </Text>

          {/* Sign in button */}
          <Button
            w="full"
            size="lg"
            colorScheme="brand"
            isLoading={isInitializing}
            loadingText="Checking session..."
            onClick={login}
            height="50px"
            fontSize="15px"
            fontWeight="600"
            leftIcon={<HiShieldCheck size={18} />}
            boxShadow="0 4px 14px rgba(255,153,0,0.3)"
          >
            Continue with Keycloak
          </Button>

          <Text fontSize="12px" color="gray.400" textAlign="center" mt={5}>
            Secured by Keycloak OAuth2 / OIDC. Your credentials are never stored
            here.
          </Text>
        </Box>
      </div>
    </div>
  );
}

export default LoginPage;
