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
  Select,
  Text,
  Box,
  HStack,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { assignTicketSchema } from "../../validation/assignTicketSchema";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

function AssignModal({
  isOpen,
  onClose,
  ticket,
  technicians,
  techniciansStatus,
  onAssign,
  assignLoading,
  assignError,
  onClearError,
}) {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignTicketSchema),
    defaultValues: { ticketNumber: " ", technicianId: "" },
  });

  // Show backend error as toast
  useEffect(() => {
    if (assignError) {
      toast({
        title: "Assignment failed",
        description: assignError,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      onClearError();
    }
  }, [assignError, toast, onClearError]);

  const onSubmit = async ({ ticketNumber, technicianId }) => {
    console.log("in assign button...");
    const success = await onAssign(ticket.ticketNumber, technicianId);
    if (success) {
      toast({
        title: "Ticket assigned",
        description: `${ticket.ticketNumber} has been assigned successfully.`,
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
    onClose();
  };

  if (!ticket) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="16px" mx={4}>
        <ModalHeader pb={2}>
          <HStack spacing={3}>
            <Box
              w="36px"
              h="36px"
              borderRadius="10px"
              bg="blue.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <HiWrenchScrewdriver size={18} color="white" />
            </Box>
            <div>
              <Text fontSize="15px" fontWeight="700">
                Assign Ticket
              </Text>
              <Text fontSize="12px" color="gray.500" fontWeight="400" mt={0.5}>
                Select a technician to handle this issue
              </Text>
            </div>
          </HStack>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              {/* Ticket info summary */}
              <Box
                w="full"
                bg="gray.50"
                borderRadius="10px"
                p={4}
                border="1px solid"
                borderColor="gray.100"
              >
                <Text
                  fontFamily="mono"
                  fontSize="10px"
                  color="gray.400"
                  letterSpacing="0.05em"
                  mb={1}
                >
                  {ticket.ticketNumber}
                </Text>
                <Text fontSize="13px" fontWeight="600" color="gray.800" mb={2}>
                  {ticket.title}
                </Text>
                <HStack spacing={2}>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </HStack>
              </Box>

              {/* Technician select */}
              <FormControl isInvalid={!!errors.technicianId}>
                <FormLabel
                  fontSize="13px"
                  fontWeight="600"
                  color="gray.700"
                  mb={1}
                >
                  Assign To
                </FormLabel>

                {techniciansStatus === "loading" ? (
                  <HStack py={2}>
                    <Spinner size="sm" color="brand.500" />
                    <Text fontSize="13px" color="gray.400">
                      Loading technicians...
                    </Text>
                  </HStack>
                ) : (
                  <Select
                    {...register("technicianId")}
                    placeholder="Select a technician"
                  >
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.fullName}
                        {tech.specialization ? ` - ${tech.specialization}` : ""}
                      </option>
                    ))}
                  </Select>
                )}

                <FormErrorMessage fontSize="12px">
                  {errors.technicianId?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              variant="outline"
              onClick={handleClose}
              isDisabled={assignLoading}
              color="gray.600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={assignLoading}
              loadingText="Assigning..."
            >
              Assign
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AssignModal;
