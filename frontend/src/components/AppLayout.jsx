/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from "../chakra";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import useSocket from "../hooks/useSocket";
import { getSocket } from "../socket";

const navItems = [
  { label: "Dashboard / Insights", to: "/dashboard" },
  { label: "Tasks", to: "/tasks" },
];

const AppLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [socketState, setSocketState] = useState("disconnected");

  useSocket();

  const activeRoute = useMemo(() => location.pathname, [location.pathname]);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setSocketState("connected");
    const handleDisconnect = () => setSocketState("disconnected");
    const handleReconnectAttempt = () => setSocketState("reconnecting");

    setSocketState(socket.connected ? "connected" : "disconnected");
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect_attempt", handleReconnectAttempt);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect_attempt", handleReconnectAttempt);
    };
  }, []);

  const connectionTone = {
    connected: "green.400",
    reconnecting: "amber.400",
    disconnected: "whiteAlpha.500",
  }[socketState];

  const connectionLabel = {
    connected: "Connected",
    reconnecting: "Reconnecting",
    disconnected: "Offline",
  }[socketState];

  const renderNavButton = (item) => (
    <Button
      key={item.to}
      as={NavLink}
      to={item.to}
      variant="ghost"
      justifyContent="flex-start"
      px="4"
      py="3"
      borderRadius="14px"
      textDecoration="none"
      color={activeRoute === item.to ? "white" : "whiteAlpha.800"}
      bg={activeRoute === item.to ? "whiteAlpha.200" : "transparent"}
      _hover={{ bg: "whiteAlpha.150", textDecoration: "none" }}
      _activeLink={{ bg: "whiteAlpha.200", color: "white" }}
    >
      {item.label}
    </Button>
  );

  return (
    <Flex minH="100vh" bg="transparent">
      <Box
        w="280px"
        bg="whiteAlpha.50"
        borderRightWidth="1px"
        borderColor="whiteAlpha.200"
        px="6"
        py="8"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        position="sticky"
        top="0"
        h="100vh"
        backdropFilter="blur(16px)"
      >
        <VStack align="start" spacing="1">
          <Text fontSize="lg" fontWeight="800" letterSpacing="0.4px">
            TaskFlow
          </Text>
          <Text color="whiteAlpha.600" fontSize="sm">
            Real-time productivity command center
          </Text>
        </VStack>

        <VStack align="stretch" spacing="2" mt="10">
          {navItems.map((item) => renderNavButton(item))}
        </VStack>

        <Box mt="auto" pt="8">
          <Box
            borderWidth="1px"
            borderColor="whiteAlpha.200"
            borderRadius="18px"
            p="4"
            bg="whiteAlpha.100"
          >
            <Text fontSize="sm" color="whiteAlpha.600">
              Signed in as
            </Text>
            <Text fontSize="sm" fontWeight="700" mt="1">
              {user?.name || "User"}
            </Text>
            <HStack mt="3" spacing="2">
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg={connectionTone}
                boxShadow={`0 0 0 6px ${connectionTone}22`}
              />
              <Text fontSize="xs" color="whiteAlpha.700">
                {connectionLabel}
              </Text>
            </HStack>
          </Box>
          <Button
            variant="ghost"
            mt="4"
            w="full"
            onClick={() => dispatch(logout())}
            borderRadius="14px"
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Flex flex="1" direction="column" minW="0">
        <HStack
          px="5"
          py="4"
          bg="whiteAlpha.50"
          borderBottomWidth="1px"
          borderColor="whiteAlpha.200"
          display={{ base: "flex", md: "none" }}
          justify="space-between"
          align="center"
          backdropFilter="blur(16px)"
        >
          <Box>
            <Text fontWeight="800">TaskFlow</Text>
            <HStack spacing="2" mt="1">
              <Box w="8px" h="8px" borderRadius="full" bg={connectionTone} />
              <Text fontSize="xs" color="whiteAlpha.600">
                {connectionLabel}
              </Text>
            </HStack>
            <Text fontSize="xs" color="whiteAlpha.500" mt="1">
              {user?.name || "User"}
            </Text>
          </Box>
          <Button size="sm" variant="ghost" onClick={() => dispatch(logout())}>
            Logout
          </Button>
        </HStack>

        <Box
          flex="1"
          px={{ base: "4", md: "10" }}
          py={{ base: "6", md: "10" }}
          pb={{ base: "24", md: "10" }}
          minW="0"
        >
          <Outlet />
        </Box>

        <HStack
          display={{ base: "flex", md: "none" }}
          position="fixed"
          left="0"
          right="0"
          bottom="0"
          zIndex="20"
          px="3"
          py="3"
          bg="slate.850"
          borderTopWidth="1px"
          borderColor="whiteAlpha.200"
          backdropFilter="blur(16px)"
          justify="space-between"
        >
          {navItems.map((item) => (
            <Button
              key={item.to}
              as={NavLink}
              to={item.to}
              variant="ghost"
              flex="1"
              size="sm"
              borderRadius="14px"
              bg={activeRoute === item.to ? "whiteAlpha.200" : "transparent"}
              color={activeRoute === item.to ? "white" : "whiteAlpha.800"}
            >
              {item.label}
            </Button>
          ))}
        </HStack>
      </Flex>
    </Flex>
  );
};

export default AppLayout;
