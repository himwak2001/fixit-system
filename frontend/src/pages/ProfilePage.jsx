import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Button,
} from "@chakra-ui/react";
import {
  HiEnvelope,
  HiPhone,
  HiIdentification,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import useAuth from "../hooks/useAuth";
import UserAvatar from "../components/ui/UserAvatar";

const ROLE_BADGE = {
  TENANT: { colorScheme: "green", label: "Tenant" },
  TECHNICIAN: { colorScheme: "blue", label: "Technician" },
  ADMIN: { colorScheme: "orange", label: "Admin" },
};

function InfoRow({ icon: Icon, label, value }) {
  return (
    <HStack spacing={3} py={3}>
      <Box
        w="36px"
        h="36px"
        borderRadius="10px"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <Icon size={16} color="#64748B" />
      </Box>
      <Box>
        <Text
          fontSize="11px"
          color="gray.400"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          {label}
        </Text>
        <Text fontSize="14px" color="gray.800" fontWeight="500" mt={0.5}>
          {value || "—"}
        </Text>
      </Box>
    </HStack>
  );
}

function ProfilePage() {
  const { profile, role, logout } = useAuth();
  const badge = ROLE_BADGE[role] || { colorScheme: "gray", label: role };

  return (
    <Box maxW="560px">
      <Text
        fontSize="20px"
        fontWeight="700"
        color="gray.800"
        letterSpacing="-0.02em"
        mb={6}
      >
        Profile
      </Text>

      <Box
        bg="white"
        borderRadius="16px"
        p={7}
        border="1px solid"
        borderColor="gray.100"
      >
        {/* ── Avatar + name header ── */}
        <VStack spacing={3} mb={6}>
          <UserAvatar name={profile?.fullName} role={role} size="lg" />
          <div className="text-center">
            <Text
              fontSize="18px"
              fontWeight="700"
              color="gray.800"
              letterSpacing="-0.01em"
            >
              {profile?.fullName || "—"}
            </Text>
            <Badge
              colorScheme={badge.colorScheme}
              variant="subtle"
              mt={2}
              px={2.5}
              py={0.5}
              borderRadius="6px"
            >
              {badge.label}
            </Badge>
          </div>
        </VStack>

        <Divider borderColor="gray.100" />

        {/* ── Info rows ── */}
        <VStack
          align="stretch"
          divider={<Divider borderColor="gray.100" />}
          spacing={0}
        >
          <InfoRow icon={HiEnvelope} label="Email" value={profile?.email} />
          <InfoRow icon={HiPhone} label="Phone" value={profile?.phone} />
          <InfoRow
            icon={HiIdentification}
            label="Account ID"
            value={profile?.id?.slice(0, 8) + "..."}
          />
        </VStack>

        <Divider borderColor="gray.100" my={5} />

        {/* ── Sign out ── */}
        <Button
          w="full"
          variant="outline"
          colorScheme="red"
          leftIcon={<HiArrowRightOnRectangle size={16} />}
          onClick={logout}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}

export default ProfilePage;
