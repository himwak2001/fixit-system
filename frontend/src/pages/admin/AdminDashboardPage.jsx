import {
  Box,
  SimpleGrid,
  Text,
  HStack,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  HiTicket,
  HiUserPlus,
  HiWrenchScrewdriver,
  HiCheckCircle,
  HiArchiveBox,
} from "react-icons/hi2";
import useAdminStats from "../../hooks/useAdminStats";

// ── Stat card component ──────────────────────────────────
function StatCard({ label, value, icon, iconBg, iconColor }) {
  return (
    <Box
      bg="white"
      borderRadius="12px"
      p={5}
      border="1px solid"
      borderColor="gray.100"
    >
      <HStack justify="space-between" align="flex-start">
        <VStack align="flex-start" spacing={1}>
          <Text
            fontSize="12px"
            fontWeight="600"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            {label}
          </Text>
          <Text
            fontSize="28px"
            fontWeight="800"
            color="gray.800"
            letterSpacing="-0.03em"
            lineHeight={1}
          >
            {value ?? 0}
          </Text>
        </VStack>
        <Box
          w="40px"
          h="40px"
          borderRadius="10px"
          bg={iconBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Icon as={icon} w={5} h={5} color={iconColor} />
        </Box>
      </HStack>
    </Box>
  );
}

// ── Chart colors ─────────────────────────────────────────
const STATUS_PIE_COLORS = {
  OPEN: "#F59E0B",
  ASSIGNED: "#3B82F6",
  IN_PROGRESS: "#8B5CF6",
  RESOLVED: "#10B981",
  CLOSED: "#64748B",
};

const CATEGORY_BAR_COLOR = "#FF9900";

// ── Custom tooltip for Recharts ──────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      bg="white"
      borderRadius="8px"
      px={3}
      py={2}
      boxShadow="0 4px 14px rgba(0,0,0,0.12)"
      border="1px solid"
      borderColor="gray.100"
    >
      {label && (
        <Text fontSize="11px" color="gray.500" mb={1}>
          {label}
        </Text>
      )}
      {payload.map((entry) => (
        <Text
          key={entry.name}
          fontSize="13px"
          fontWeight="600"
          color={entry.color || "gray.800"}
        >
          {entry.name}: {entry.value}
        </Text>
      ))}
    </Box>
  );
}

// ── Custom pie label ─────────────────────────────────────
function renderPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) {
  if (percent < 0.06) return null; // hide labels for tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ── Main page component ──────────────────────────────────
function AdminDashboardPage() {
  const { stats, status, error } = useAdminStats();

  if (status === "loading") {
    return (
      <VStack py={20}>
        <Spinner size="md" color="brand.500" thickness="2px" />
        <Text fontSize="13px" color="gray.400">
          Loading dashboard...
        </Text>
      </VStack>
    );
  }

  if (status === "failed") {
    return (
      <Alert status="error" borderRadius="10px">
        <AlertIcon />
        {error || "Failed to load dashboard stats."}
      </Alert>
    );
  }

  // ── Prepare chart data from API response ──
  const pieData = stats
    ? Object.entries(STATUS_PIE_COLORS)
        .map(([key, color]) => ({
          name: key.replace("_", " "),
          value:
            stats[`${key.toLowerCase().replace("_", "")}Count`] ??
            stats[`${key.toLowerCase()}Count`] ??
            0,
          color,
        }))
        .filter((d) => d.value > 0)
    : [];

  const barData =
    stats?.byCategory?.map((c) => ({
      name: c.category,
      count: c.count,
    })) || [];

  return (
    <Box>
      <Text
        fontSize="20px"
        fontWeight="700"
        color="gray.800"
        letterSpacing="-0.02em"
        mb={6}
      >
        Dashboard
      </Text>

      {/* ── Stat cards ── */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4} mb={6}>
        <StatCard
          label="Open"
          value={stats?.openCount}
          icon={HiTicket}
          iconBg="orange.50"
          iconColor="orange.500"
        />
        <StatCard
          label="Assigned"
          value={stats?.assignedCount}
          icon={HiUserPlus}
          iconBg="blue.50"
          iconColor="blue.500"
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgressCount}
          icon={HiWrenchScrewdriver}
          iconBg="purple.50"
          iconColor="purple.500"
        />
        <StatCard
          label="Resolved"
          value={stats?.resolvedCount}
          icon={HiCheckCircle}
          iconBg="green.50"
          iconColor="green.500"
        />
        <StatCard
          label="Closed"
          value={stats?.closedCount}
          icon={HiArchiveBox}
          iconBg="gray.100"
          iconColor="gray.500"
        />
      </SimpleGrid>

      {/* ── Charts ── */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
        {/* Pie — by status */}
        <Box
          bg="white"
          borderRadius="14px"
          p={6}
          border="1px solid"
          borderColor="gray.100"
        >
          <Text
            fontSize="14px"
            fontWeight="700"
            color="gray.800"
            letterSpacing="-0.01em"
            mb={5}
          >
            Tickets by Status
          </Text>
          {pieData.length === 0 ? (
            <Text fontSize="13px" color="gray.400" textAlign="center" py={10}>
              No data available
            </Text>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#4A5568",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* Bar — by category */}
        <Box
          bg="white"
          borderRadius="14px"
          p={6}
          border="1px solid"
          borderColor="gray.100"
        >
          <Text
            fontSize="14px"
            fontWeight="700"
            color="gray.800"
            letterSpacing="-0.01em"
            mb={5}
          >
            Tickets by Category
          </Text>
          {barData.length === 0 ? (
            <Text fontSize="13px" color="gray.400" textAlign="center" py={10}>
              No data available
            </Text>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={barData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F1F5F9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: "#94A3B8",
                    fontFamily: "Inter, sans-serif",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#94A3B8",
                    fontFamily: "Inter, sans-serif",
                  }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#F8FAFC" }}
                />
                <Bar
                  dataKey="count"
                  name="Tickets"
                  fill={CATEGORY_BAR_COLOR}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </SimpleGrid>

      {/* ── Total summary ── */}
      {stats && (
        <Box
          mt={4}
          bg="white"
          borderRadius="12px"
          p={4}
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack justify="space-between">
            <Text fontSize="13px" color="gray.500">
              Total tickets in the system
            </Text>
            <Text fontSize="15px" fontWeight="700" color="gray.800">
              {stats.totalTickets}
            </Text>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

export default AdminDashboardPage;
