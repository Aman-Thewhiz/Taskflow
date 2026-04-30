import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "../chakra";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "../components/TaskCard";
import TaskFormModal from "../components/TaskFormModal";
import {
  createTask,
  deleteTask,
  fetchTasks,
  setFilters,
  updateTask,
} from "../store/tasksSlice";

const Tasks = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const cancelRef = useRef();
  const { items, loading, error, filters } = useSelector((state) => state.tasks);
  const [activeTask, setActiveTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    if (filters.status === "All") {
      return items;
    }

    return items.filter((task) => task.status === filters.status);
  }, [filters.status, items]);

  const handleCreateClick = () => {
    setActiveTask(null);
    formModal.onOpen();
  };

  const handleEditClick = (task) => {
    setActiveTask(task);
    formModal.onOpen();
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    deleteDialog.onOpen();
  };

  const handleCreateSubmit = async (payload) => {
    try {
      await dispatch(createTask(payload)).unwrap();
      dispatch(fetchTasks());
      toast({
        title: "Task created",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return true;
    } catch (err) {
      toast({
        title: "Unable to create task",
        description: err,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }
  };

  const handleEditSubmit = async (payload) => {
    if (!activeTask) {
      return false;
    }

    try {
      await dispatch(updateTask({ id: activeTask._id, updates: payload })).unwrap();
      dispatch(fetchTasks());
      toast({
        title: "Task updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return true;
    } catch (err) {
      toast({
        title: "Unable to update task",
        description: err,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return false;
    }
  };

  const handleStatusChange = async (task, status) => {
    if (task.status === status) {
      return;
    }

    try {
      await dispatch(updateTask({ id: task._id, updates: { status } })).unwrap();
      dispatch(fetchTasks());
      toast({
        title: "Status updated",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      toast({
        title: "Unable to update status",
        description: err,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) {
      return;
    }

    try {
      await dispatch(deleteTask(taskToDelete._id)).unwrap();
      dispatch(fetchTasks());
      toast({
        title: "Task deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      deleteDialog.onClose();
      setTaskToDelete(null);
    } catch (err) {
      toast({
        title: "Unable to delete task",
        description: err,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const formInitialValues = useMemo(() => {
    if (!activeTask) {
      return null;
    }

    return {
      title: activeTask.title,
      description: activeTask.description,
      category: activeTask.category,
      status: activeTask.status,
      deadline: activeTask.deadline,
    };
  }, [activeTask]);

  const isEditing = Boolean(activeTask);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={{ base: 6, md: 8 }}>
        <Box>
          <Heading size="lg">Tasks</Heading>
          <Text color="whiteAlpha.700" mt="1">
            Organize your day and keep priorities in view.
          </Text>
        </Box>
        <Button onClick={handleCreateClick}>Create Task</Button>
      </Flex>

      <HStack spacing="3" mb={{ base: 5, md: 6 }} flexWrap="wrap">
        {[
          "All",
          "Pending",
          "In Progress",
          "Completed",
        ].map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filters.status === status ? "solid" : "ghost"}
            onClick={() => dispatch(setFilters({ status }))}
          >
            {status}
          </Button>
        ))}
      </HStack>

      {error ? (
        <Alert status="error" mb="6" borderRadius="12px">
          <AlertIcon />
          {error}
        </Alert>
      ) : null}

      {loading && items.length === 0 ? (
        <Stack spacing="4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              borderRadius="18px"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              bg="whiteAlpha.50"
              px={{ base: 4, md: 5 }}
              py={{ base: 4, md: 5 }}
            >
              <Skeleton height="14px" mb="3" />
              <Skeleton height="18px" mb="2" />
              <SkeletonText noOfLines={2} spacing="3" />
            </Box>
          ))}
        </Stack>
      ) : filteredItems.length === 0 ? (
        <Box
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          borderRadius="20px"
          px={{ base: 6, md: 10 }}
          py={{ base: 10, md: 12 }}
          textAlign="center"
          bg="whiteAlpha.50"
          backdropFilter="blur(12px)"
        >
          <Heading size="md" mb="2">
            No tasks yet
          </Heading>
          <Text color="whiteAlpha.700" mb="6">
            Create your first task to start tracking progress.
          </Text>
          <Button onClick={handleCreateClick}>Create Task</Button>
        </Box>
      ) : (
        <Stack spacing="4">
          {/* Render in API order; do not reorder on the client. */}
          {filteredItems.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
              isBusy={loading}
            />
          ))}
        </Stack>
      )}

      <TaskFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={isEditing ? handleEditSubmit : handleCreateSubmit}
        initialValues={formInitialValues}
        title={isEditing ? "Edit task" : "Create new task"}
        submitLabel={isEditing ? "Save changes" : "Create task"}
        isSubmitting={loading}
      />

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent bg="slate.850" borderColor="whiteAlpha.200">
          <AlertDialogHeader fontSize="lg" fontWeight="600">
            Delete task
          </AlertDialogHeader>
          <AlertDialogBody>
            This action cannot be undone. Delete this task?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={deleteDialog.onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={confirmDelete}
              isLoading={loading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default Tasks;
