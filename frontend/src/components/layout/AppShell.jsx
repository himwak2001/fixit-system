import { Outlet } from "react-router-dom";
import { Box, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileDrawer from "./MobileDrawer";

function AppShell() {
  // Reactive breakpoint check — true below Chakra's 'md' breakpoint (768px)
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="flex min-h-screen bg-[#F4F6F9]">
      {/* Desktop sidebar — hidden on mobile */}
      {!isMobile && <Sidebar />}

      {/* Mobile drawer — only mounted on mobile, controlled by hamburger */}
      {isMobile && <MobileDrawer isOpen={isOpen} onClose={onClose} />}

      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={isMobile ? onOpen : undefined} />

        <Box as="main" flex={1} p={{ base: 4, md: 6 }} overflowY="auto">
          <Outlet />
        </Box>
      </div>
    </div>
  );
}

export default AppShell;
