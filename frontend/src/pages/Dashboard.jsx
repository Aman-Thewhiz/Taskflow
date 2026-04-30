import { useEffect, useMemo } from "react";
import {
  Badge,
  Box,
  Grid,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "../chakra";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "../store/analyticsSlice";

const statConfig = [
  { key: "totalTasks", label: "Total Tasks", color: "white" },
  { key: "completedTasks", label: "Completed", color: "green.300" },
  { key: "pendingTasks", label: "Pending", color: "amber.300" },
  { key: "inProgressTasks", label: "In Progress", color: "blue.300" },
  { key: "overdueTasks", label: "Overdue", color: "red.300" },
];

const StatCard = ({ label, value, color, isLoading }) => (
  <Box
    borderWidth="1px"
    borderColor="whiteAlpha.200"
    borderRadius="18px"
    bg="whiteAlpha.50"
    backdropFilter="blur(12px)"
    px={{ base: 4, md: 6 }}
    py={{ base: 4, md: 5 }}
  >
    <Text color="whiteAlpha.600" fontSize="sm">
      {label}
    </Text>
    {isLoading ? (
      <Skeleton height="28px" mt="2" />
    ) : (
      <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" color={color}>
        {value}
      </Text>
    )}
  </Box>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const insights = useMemo(() => data?.insights || [], [data]);
  const mostActiveCategory = data?.mostActiveCategory || "None";

  return (
    <Stack spacing={{ base: 6, md: 8 }}>
      <Box>
        <Heading size="lg">Insights</Heading>
        <Text color="whiteAlpha.700" mt="1">
          Track momentum and stay ahead of your priorities.
        </Text>
      </Box>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
        gap="4"
      >
        {statConfig.map((stat) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={data?.[stat.key] ?? 0}
            color={stat.color}
            isLoading={loading && !data}
          />
        ))}
      </Grid>

      <Box
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        borderRadius="20px"
        bg="whiteAlpha.50"
        backdropFilter="blur(12px)"
        px={{ base: 5, md: 7 }}
        py={{ base: 6, md: 7 }}
      >
        <HStack justify="space-between" flexWrap="wrap" gap="4">
          <Box>
            <Text color="whiteAlpha.600" fontSize="sm">
              Completed Today
            </Text>
            {loading && !data ? (
              <Skeleton height="32px" mt="2" />
            ) : (
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700">
                {data?.completedToday ?? 0}
              </Text>
            )}
          </Box>
          <Badge
            px="3"
            py="1"
            borderRadius="full"
            bg="brand.500"
            color="slate.900"
          >
            Most active: {mostActiveCategory}
          </Badge>
        </HStack>
      </Box>

      <Stack
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        borderRadius="20px"
        bg="whiteAlpha.50"
        backdropFilter="blur(12px)"
        px={{ base: 5, md: 7 }}
        py={{ base: 6, md: 7 }}
        spacing="4"
      >
        <Heading size="md">Insights</Heading>
        {loading && !data ? (
          <Stack spacing="3">
            <Skeleton height="16px" />
            <Skeleton height="16px" />
            <Skeleton height="16px" />
          </Stack>
        ) : (
          <VStack align="start" spacing="3">
            {insights.map((insight, index) => (
              <Box
                key={`${insight}-${index}`}
                px="4"
                py="3"
                borderRadius="14px"
                bg="whiteAlpha.100"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                w="100%"
              >
                <Text color="whiteAlpha.800">{insight}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Stack>
    </Stack>
  );
};

export default Dashboard;
