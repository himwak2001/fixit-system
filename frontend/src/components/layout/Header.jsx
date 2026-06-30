import { Box, Text, HStack, IconButton, Divider } from "@chakra-ui/react";
import { HiBell } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import UserAvatar from "../ui/UserAvatar";
import { HiBars3 } from "react-icons/hi2";

// Maps path segments to human-readable page titles
const PAGE_TITLES = {
  "my-tickets": "My Tickets",
  "assigned-tickets": "Assigned Tickets",
  dashboard: "Dashboard",
  "all-tickets": "All Tickets",
};

function Header({ onMenuClick }) {
  const { profile, role } = useAuth();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  // Extract the last path segment for the page title
  const segment = pathname.split("/").filter(Boolean).pop();
  const title = PAGE_TITLES[segment] || "FixIt";

  return (
    <Box
      as="header"
      h="60px"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={6}
      position="sticky"
      top={0}
      zIndex={9}
    >
      <HStack spacing={3}>
        {/* Hamburger — only rendered when onMenuClick is passed (mobile) */}
        {onMenuClick && (
          <IconButton
            aria-label="Open menu"
            icon={<HiBars3 size={20} />}
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
          />
        )}
        <Text
          fontSize="16px"
          fontWeight="600"
          color="gray.800"
          letterSpacing="-0.01em"
        >
          {title}
        </Text>
      </HStack>

      

      {/* ── Right side actions ── */}
      <HStack spacing={2}>
        {/* Notification bell — placeholder, wired in Week 3 */}
        <IconButton
          aria-label="Notifications"
          icon={<HiBell size={18} />}
          variant="ghost"
          size="sm"
          color="gray.500"
          _hover={{ bg: "gray.100", color: "gray.700" }}
          borderRadius="8px"
        />

        <Divider orientation="vertical" h="24px" borderColor="gray.200" />

        {/* User info + avatar */}
        <HStack
          spacing={2.5}
          pl={1}
          cursor="pointer"
          onClick={() => navigate("/app/profile")}
          borderRadius="8px"
          px={2}
          py={1}
          _hover={{ bg: "gray.50" }}
          transition="background 0.15s ease"
        >
          <div className="text-right hidden sm:block">
            <Text
              fontSize="13px"
              fontWeight="600"
              color="gray.700"
              lineHeight={1.3}
            >
              {profile?.fullName || "—"}
            </Text>
            <Text fontSize="11px" color="gray.400" lineHeight={1.3}>
              {profile?.role || "—"}
            </Text>
          </div>
          <UserAvatar name={profile?.fullName} role={role} size="sm" />
        </HStack>
      </HStack>
    </Box>
  );
}

export default Header;
