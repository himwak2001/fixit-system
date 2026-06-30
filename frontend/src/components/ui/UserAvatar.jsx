import { Box, Text } from "@chakra-ui/react";
import { getInitials } from "../../utils/avatarUtils";
import { ROLE_AVATAR_COLOR } from "../../utils/constants";

const SIZES = {
  sm: { box: "32px", fontSize: "11px" },
  md: { box: "40px", fontSize: "14px" },
  lg: { box: "48px", fontSize: "16px" },
};

/**
 * Renders a colored circle with the user's initials.
 * Color is role-based: ADMIN=orange, TECHNICIAN=blue, TENANT=green.
 */
function UserAvatar({ name, role, size = "md" }) {
  const initials = getInitials(name);
  const colors = ROLE_AVATAR_COLOR[role] || { bg: "#64748B", color: "white" };
  const dim = SIZES[size] || SIZES.md;

  return (
    <Box
      w={dim.box}
      h={dim.box}
      borderRadius="full"
      bg={colors.bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      userSelect="none"
    >
      <Text
        fontSize={dim.fontSize}
        fontWeight="700"
        color={colors.color}
        letterSpacing="0.05em"
        lineHeight={1}
      >
        {initials}
      </Text>
    </Box>
  );
}

export default UserAvatar;
