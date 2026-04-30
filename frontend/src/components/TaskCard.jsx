import {
  Badge,
  Box,
  Button,
  HStack,
  Select,
  Stack,
  Text,
  VStack,
} from "../chakra";
import { keyframes } from "@emotion/react";

const statusColors = {
  Pending: "amber.500",
  "In Progress": "blue.400",
  Completed: "green.400",
};

const priorityConfig = {
  overdue: {
    label: "Overdue",
    accent: "red.400",
    badgeBg: "red.500",
    badgeColor: "white",
  },
  critical: {
    label: "Critical",
    accent: "orange.400",
    badgeBg: "orange.400",
    badgeColor: "slate.900",
  },
  high: {
    label: "High",
    accent: "amber.400",
    badgeBg: "amber.400",
    badgeColor: "slate.900",
  },
  medium: {
    label: "Medium",
    accent: "brand.400",
    badgeBg: "brand.500",
    badgeColor: "slate.900",
  },
  low: {
    label: "Low",
    accent: "whiteAlpha.300",
    badgeBg: "whiteAlpha.200",
    badgeColor: "whiteAlpha.800",
  },
  none: {
    label: "None",
    accent: "whiteAlpha.200",
    badgeBg: "whiteAlpha.100",
    badgeColor: "whiteAlpha.600",
  },
};

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 99, 71, 0.35);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 99, 71, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 99, 71, 0);
  }
`;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString();
};

const getDeadlineMeta = (task) => {
  if (!task?.deadline) {
    return { label: "No deadline", color: "whiteAlpha.600" };
  }

  const date = new Date(task.deadline);
  if (Number.isNaN(date.getTime())) {
    return { label: "No deadline", color: "whiteAlpha.600" };
  }

  if (task.status === "Completed") {
    return { label: `Completed on ${formatDate(date)}`, color: "whiteAlpha.500" };
  }

  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / MS_PER_DAY);

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays) || 1;
    return {
      label: `Overdue by ${overdueDays} day${overdueDays === 1 ? "" : "s"}`,
      color: "red.400",
    };
  }

  if (diffDays === 0) {
    return { label: "Due today", color: "amber.400" };
  }

  if (diffDays <= 2) {
    return {
      label: `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
      color: "amber.400",
    };
  }

  return { label: `Due ${formatDate(date)}`, color: "whiteAlpha.700" };
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isBusy }) => {
  const deadlineMeta = getDeadlineMeta(task);
  const categoryLabel = task.category?.trim() ? task.category : "General";
  const priorityLevel = task.priorityLevel || "low";
  const priorityStyle = priorityConfig[priorityLevel] || priorityConfig.low;
  const isCompleted = task.status === "Completed";
  const isOverdue = priorityLevel === "overdue";

  return (
    <Box
      bg={isOverdue ? "rgba(255, 99, 71, 0.08)" : "whiteAlpha.50"}
      borderWidth="1px"
      borderColor={priorityStyle.accent}
      borderLeftWidth="4px"
      borderRadius="18px"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
      backdropFilter="blur(12px)"
      transition="transform 0.2s ease, border-color 0.2s ease"
      _hover={{ transform: "translateY(-2px)", borderColor: "whiteAlpha.400" }}
      boxShadow={isOverdue ? "0 0 18px rgba(255, 99, 71, 0.25)" : "none"}
      opacity={isCompleted ? 0.7 : 1}
    >
      <Stack spacing="3">
        <HStack justify="space-between">
          <Badge
            px="2.5"
            py="1"
            borderRadius="full"
            bg="whiteAlpha.200"
            color={statusColors[task.status] || "whiteAlpha.800"}
          >
            {task.status}
          </Badge>
          <HStack spacing="2">
            <Badge
              px="2.5"
              py="1"
              borderRadius="full"
              bg={priorityStyle.badgeBg}
              color={priorityStyle.badgeColor}
              animation={isOverdue ? `${pulse} 2s ease-in-out infinite` : "none"}
            >
              {priorityStyle.label}
            </Badge>
            <Text fontSize="xs" color="whiteAlpha.600">
              Priority {task.priorityScore ?? 0}
            </Text>
          </HStack>
        </HStack>

        <VStack align="start" spacing="1">
          <Text
            fontSize="lg"
            fontWeight="600"
            textDecoration={isCompleted ? "line-through" : "none"}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text color="whiteAlpha.700" fontSize="sm" noOfLines={2}>
              {task.description}
            </Text>
          ) : null}
        </VStack>

        <HStack spacing="3" flexWrap="wrap">
          <Badge
            px="2"
            py="0.5"
            borderRadius="full"
            bg="whiteAlpha.200"
            color="whiteAlpha.800"
          >
            {categoryLabel}
          </Badge>
          <Text fontSize="sm" color={deadlineMeta.color} fontWeight="500">
            {deadlineMeta.label}
          </Text>
        </HStack>

        <HStack justify="space-between" flexWrap="wrap" gap="3">
          <Select
            size="sm"
            value={task.status}
            onChange={(event) => onStatusChange(task, event.target.value)}
            maxW="180px"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
            isDisabled={isBusy}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
          <HStack spacing="2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
              isDisabled={isBusy}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              color="red.300"
              _hover={{ bg: "red.500", color: "white" }}
              onClick={() => onDelete(task)}
              isDisabled={isBusy}
            >
              Delete
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </Box>
  );
};

export default TaskCard;
