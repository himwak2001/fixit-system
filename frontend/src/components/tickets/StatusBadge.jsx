import { Box, Text } from "@chakra-ui/react";
import { STATUS_COLOR } from "../../utils/constants";

const STATUS_LABEL = {
  OPEN: "Open",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

function StatusBadge({ status }) {
  const colors = STATUS_COLOR[status] || {
    bg: "#F1F5F9",
    color: "#475569",
    dot: "#94A3B8",
  };

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap="5px"
      px="9px"
      py="3px"
      borderRadius="full"
      bg={colors.bg}
    >
      {/* Colored dot */}
      <Box w="6px" h="6px" borderRadius="full" bg={colors.dot} flexShrink={0} />
      <Text
        fontSize="11px"
        fontWeight="600"
        color={colors.color}
        letterSpacing="0.03em"
        textTransform="uppercase"
        lineHeight={1}
      >
        {STATUS_LABEL[status] || status}
      </Text>
    </Box>
  );
}

export default StatusBadge;
