import { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  SimpleGrid,
  Text,
  Box,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { HiTicket } from "react-icons/hi2";
import { createTicketSchema } from "../../validation/ticketSchema";
import {
  submitCreateTicket,
  clearActionError,
} from "../../store/slices/ticketSlice";

function CreateTicketModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const { actionLoading, actionError } = useSelector((s) => s.tickets);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "",
      location: "",
    },
  });

  // Show backend error as toast if action fails
  useEffect(() => {
    if (actionError) {
      toast({
        title: "Failed to create ticket",
        description: actionError,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      dispatch(clearActionError());
    }
  }, [actionError, toast, dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(submitCreateTicket(data));
    if (submitCreateTicket.fulfilled.match(result)) {
      toast({
        title: "Ticket created",
        description: `${result.payload.ticketNumber} has been submitted.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    dispatch(clearActionError());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="16px" mx={4}>
        {/* ── Header ── */}
        <ModalHeader pb={2}>
          <Box display="flex" alignItems="center" gap={3}>
            <Box
              w="36px"
              h="36px"
              borderRadius="10px"
              bg="brand.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <HiTicket size={18} color="white" />
            </Box>
            <div>
              <Text fontSize="16px" fontWeight="700" letterSpacing="-0.01em">
                Report an Issue
              </Text>
              <Text fontSize="12px" color="gray.500" fontWeight="400" mt={0.5}>
                Fill in the details below and our team will respond shortly.
              </Text>
            </div>
          </Box>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              {/* Title */}
              <FormControl isInvalid={!!errors.title}>
                <FormLabel
                  fontSize="13px"
                  fontWeight="600"
                  color="gray.700"
                  mb={1}
                >
                  Issue Title
                </FormLabel>
                <Input
                  {...register("title")}
                  placeholder="e.g. Leaking pipe under kitchen sink"
                  size="md"
                />
                <FormErrorMessage fontSize="12px">
                  {errors.title?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Category + Priority */}
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isInvalid={!!errors.category}>
                  <FormLabel
                    fontSize="13px"
                    fontWeight="600"
                    color="gray.700"
                    mb={1}
                  >
                    Category
                  </FormLabel>
                  <Select
                    {...register("category")}
                    placeholder="Select category"
                  >
                    <option value="PLUMBING">🔧 Plumbing</option>
                    <option value="ELECTRICAL">⚡ Electrical</option>
                    <option value="HVAC">❄️ HVAC</option>
                    <option value="CLEANING">🧹 Cleaning</option>
                    <option value="OTHER">📋 Other</option>
                  </Select>
                  <FormErrorMessage fontSize="12px">
                    {errors.category?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.priority}>
                  <FormLabel
                    fontSize="13px"
                    fontWeight="600"
                    color="gray.700"
                    mb={1}
                  >
                    Priority
                  </FormLabel>
                  <Select
                    {...register("priority")}
                    placeholder="Select priority"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">🚨 Urgent</option>
                  </Select>
                  <FormErrorMessage fontSize="12px">
                    {errors.priority?.message}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              {/* Location */}
              <FormControl isInvalid={!!errors.location}>
                <FormLabel
                  fontSize="13px"
                  fontWeight="600"
                  color="gray.700"
                  mb={1}
                >
                  Location
                </FormLabel>
                <Input
                  {...register("location")}
                  placeholder="e.g. Block A, Room 204 / 3rd Floor Kitchen"
                />
                <FormErrorMessage fontSize="12px">
                  {errors.location?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Description */}
              <FormControl isInvalid={!!errors.description}>
                <FormLabel
                  fontSize="13px"
                  fontWeight="600"
                  color="gray.700"
                  mb={1}
                >
                  Description
                </FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Describe the issue in detail — what you observed, when it started, and any relevant context."
                  rows={4}
                  resize="none"
                />
                <FormErrorMessage fontSize="12px">
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3} pt={4}>
            <Button
              variant="outline"
              onClick={handleClose}
              isDisabled={actionLoading}
              color="gray.600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={actionLoading}
              loadingText="Submitting..."
              px={6}
            >
              Submit Ticket
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default CreateTicketModal;
