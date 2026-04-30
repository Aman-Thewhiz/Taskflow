/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Textarea,
} from "../chakra";

const defaultValues = {
  title: "",
  description: "",
  category: "",
  status: "Pending",
  deadline: "",
};

const formatInputDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TaskFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title,
  submitLabel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState(defaultValues);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({
      ...defaultValues,
      ...initialValues,
      deadline: formatInputDate(initialValues?.deadline),
    });
    setFormErrors({});
  }, [isOpen, initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const success = await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      status: formData.status,
      deadline: formData.deadline || null,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent bg="slate.850" borderColor="whiteAlpha.200">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="4" as="form" onSubmit={handleSubmit}>
            <FormControl isInvalid={Boolean(formErrors.title)}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title"
              />
              <FormErrorMessage>{formErrors.title}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add more detail"
                resize="vertical"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Work, Personal, Urgent"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Deadline</FormLabel>
              <Input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
              />
            </FormControl>

            <ModalFooter px="0">
              <Button variant="ghost" mr="3" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {submitLabel}
              </Button>
            </ModalFooter>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskFormModal;
