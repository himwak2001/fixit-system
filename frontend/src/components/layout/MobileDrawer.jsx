import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";

/**
 * Wraps the same Sidebar component inside a Chakra Drawer
 * for mobile screens. The Sidebar itself doesn't need to know
 * whether it's rendered inline or inside a drawer.
 */
function MobileDrawer({ isOpen, onClose }) {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
      <DrawerOverlay bg="blackAlpha.600" />
      <DrawerContent maxW="240px">
        <DrawerBody p={0}>
          <Sidebar onNavigate={onClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default MobileDrawer;
