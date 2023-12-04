import { Box, Container, Flex, Heading, IconButton } from "@chakra-ui/react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BsArrowLeftSquare, BsCart2, BsInfoCircle } from "react-icons/bs";
import { useDataProvider } from "../components/data-provider";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lines, restaurantInfo } = useDataProvider();
  const hasCartItems = lines.length > 0;

  return (
    <Box p={4} bg="white" shadow="md">
      <Flex alignItems="center" justify="space-between">
        <Flex alignItems="center" gap={2}>
          {location.pathname !== "/" && (
            <IconButton
              aria-label="back"
              icon={<BsArrowLeftSquare />}
              onClick={() => {
                navigate("/", { replace: true });
              }}
            />
          )}
          <Heading fontSize={16}>{restaurantInfo?.name}</Heading>
        </Flex>
        <Flex alignItems="center" gap={2}>
          <IconButton
            aria-label="Information"
            icon={<BsInfoCircle />}
            onClick={() => {
              navigate("/info");
            }}
          />
          <IconButton
            aria-label="Cart"
            icon={<BsCart2 />}
            colorScheme={hasCartItems ? "red" : undefined}
            onClick={() => {
              navigate("/cart");
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export const Root = () => {
  return (
    <Box>
      <Navbar />
      <Container minH="100vh" p={0}>
        <Outlet />
      </Container>
    </Box>
  );
};
