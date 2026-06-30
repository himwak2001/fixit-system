import { Box, Text } from "@chakra-ui/react";
import { PRIORITY_COLOR } from "../../utils/constants";

function PriorityBadge({ priority }) {
  const colors = PRIORITY_COLOR[priority] || {
    bg: "#F1F5F9",
    color: "#475569",
  };

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      px="8px"
      py="3px"
      borderRadius="6px"
      bg={colors.bg}
    >
      <Text
        fontSize="10px"
        fontWeight="700"
        color={colors.color}
        letterSpacing="0.05em"
        textTransform="uppercase"
        lineHeight={1}
      >
        {priority}
      </Text>
    </Box>
  );
}

export default PriorityBadge;
