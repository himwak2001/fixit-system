import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  Text,
  Divider,
  Button,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import {
  HiWrenchScrewdriver,
  HiTicket,
  HiChartBarSquare,
  HiClipboardDocumentList,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import useAuth from "../../hooks/useAuth";
import UserAvatar from "../ui/UserAvatar";

// ── Navigation config per role ──────────────────────────
const NAV_ITEMS = {
  TENANT: [{ label: "My Tickets", icon: HiTicket, path: "/app/my-tickets" }],
  TECHNICIAN: [
    {
      label: "Assigned Tickets",
      icon: HiWrenchScrewdriver,
      path: "/app/assigned-tickets",
    },
  ],
  ADMIN: [
    { label: "Dashboard", icon: HiChartBarSquare, path: "/app/dashboard" },
    {
      label: "All Tickets",
      icon: HiClipboardDocumentList,
      path: "/app/all-tickets",
    },
  ],
};

// ── Role → Badge color ───────────────────────────────────
const ROLE_BADGE = {
  TENANT: { colorScheme: "green", label: "Tenant" },
  TECHNICIAN: { colorScheme: "blue", label: "Technician" },
  ADMIN: { colorScheme: "orange", label: "Admin" },
};

function Sidebar({ onNavigate }) {
  const { profile, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = NAV_ITEMS[role] || [];
  const badge = ROLE_BADGE[role] || { colorScheme: "gray", label: role };

  return (
    <Box
      as="aside"
      w="240px"
      minH="100vh"
      bg="#0F172A"
      display="flex"
      flexDirection="column"
      flexShrink={0}
      boxShadow="sidebar"
      position="sticky"
      top={0}
      zIndex={10}
    >
      {/* ── Logo ─────────────────────────────── */}
      <Box px={5} py={5}>
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate(NAV_ITEMS[role]?.[0]?.path || "/")}
        >
          <Box
            w="36px"
            h="36px"
            borderRadius="10px"
            bg="brand.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <HiWrenchScrewdriver size={20} color="white" />
          </Box>
          <div>
            <Text
              fontSize="17px"
              fontWeight="800"
              color="white"
              letterSpacing="-0.02em"
              lineHeight={1}
            >
              FixIt
            </Text>
            <Text fontSize="10px" color="whiteAlpha.400" mt="1px">
              Facility Management
            </Text>
          </div>
        </div>
      </Box>

      <Divider borderColor="whiteAlpha.100" />

      {/* ── Navigation ───────────────────────── */}
      <VStack spacing={1} align="stretch" px={3} py={4} flex={1}>
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink key={path} to={path} onClick={onNavigate}>
            {({ isActive }) => (
              <Box
                display="flex"
                alignItems="center"
                gap={3}
                px={3}
                py={2.5}
                borderRadius="8px"
                bg={isActive ? "rgba(255,153,0,0.12)" : "transparent"}
                borderLeft="3px solid"
                borderLeftColor={isActive ? "brand.500" : "transparent"}
                cursor="pointer"
                transition="all 0.15s ease"
                _hover={{
                  bg: "rgba(255,255,255,0.06)",
                  borderLeftColor: isActive
                    ? "brand.500"
                    : "rgba(255,153,0,0.4)",
                }}
              >
                <Icon size={18} color={isActive ? "#FF9900" : "#94A3B8"} />
                <Text
                  fontSize="14px"
                  fontWeight={isActive ? "600" : "400"}
                  color={isActive ? "#FF9900" : "#94A3B8"}
                  transition="color 0.15s ease"
                >
                  {label}
                </Text>
              </Box>
            )}
          </NavLink>
        ))}
      </VStack>

      {/* ── User Section ─────────────────────── */}
      <Box>
        <Divider borderColor="whiteAlpha.100" />
        <Box px={4} py={4}>
          {/* User info */}
          <div className="flex items-center gap-3 mb-3">
            <UserAvatar name={profile?.fullName} role={role} size="md" />
            <div className="min-w-0 flex-1">
              <Text
                fontSize="13px"
                fontWeight="600"
                color="white"
                noOfLines={1}
              >
                {profile?.fullName || "User"}
              </Text>
              <Text fontSize="11px" color="whiteAlpha.500" noOfLines={1}>
                {profile?.email || ""}
              </Text>
            </div>
          </div>

          {/* Role badge */}
          <Badge
            colorScheme={badge.colorScheme}
            variant="subtle"
            mb={3}
            px={2}
            py={0.5}
            borderRadius="6px"
          >
            {badge.label}
          </Badge>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            w="full"
            justifyContent="flex-start"
            gap={2}
            color="whiteAlpha.600"
            _hover={{ bg: "rgba(255,255,255,0.08)", color: "white" }}
            onClick={logout}
            leftIcon={<HiArrowRightOnRectangle size={16} />}
          >
            Sign out
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
