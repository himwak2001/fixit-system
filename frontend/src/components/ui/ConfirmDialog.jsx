import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";

/**
 * Generic confirmation dialog — reused for any "are you sure?"
 * interaction across the app (closing tickets, destructive actions).
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmColorScheme = "brand",
  isLoading = false,
}) {
  // AlertDialog requires a ref to the least destructive element
  // (usually Cancel) so focus lands there by default, not on Confirm
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay bg="blackAlpha.500" backdropFilter="blur(2px)">
        <AlertDialogContent borderRadius="14px" mx={4}>
          <AlertDialogHeader fontSize="16px" fontWeight="700" pb={2}>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text fontSize="14px" color="gray.600" lineHeight={1.6}>
              {message}
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter gap={3}>
            <Button
              ref={cancelRef}
              variant="outline"
              onClick={onClose}
              isDisabled={isLoading}
              color="gray.600"
            >
              Cancel
            </Button>
            <Button
              colorScheme={confirmColorScheme}
              onClick={onConfirm}
              isLoading={isLoading}
              loadingText="Please wait..."
            >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ConfirmDialog;
