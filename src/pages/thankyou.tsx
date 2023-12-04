import { Box, Heading, Icon, VStack, Text } from "@chakra-ui/react";
import { useDataProvider } from "../components/data-provider";
import {
  MdOutlineCelebration,
  MdCancel,
  MdHourglassBottom,
} from "react-icons/md";

const ThankyouContent = () => {
  const { order } = useDataProvider();

  if (!order) return null;

  if (order.status === "pending") {
    return (
      <>
        <Icon as={MdHourglassBottom} w={24} h={24} color="gray.700" />
        <Heading textAlign="center">Waiting for a confirmation</Heading>
        <Text textAlign="center">
          Your order has been placed. Please wait for a confirmation from the
          restraunt.
        </Text>
      </>
    );
  }

  if (order.status === "cancelled") {
    return (
      <>
        <Icon as={MdCancel} w={24} h={24} color="gray.700" />
        <Heading textAlign="center">Order Cancelled</Heading>
        <Text textAlign="center">
          Your order has been cancelled. Please contact the restraunt for more
          information.
        </Text>
      </>
    );
  }

  return (
    <>
      <Icon as={MdOutlineCelebration} w={24} h={24} color="gray.700" />
      <Heading textAlign="center">Order Confirmed</Heading>
      <Text textAlign="center">
        See you soon! Your order has been confirmed and will be ready for pickup
      </Text>
    </>
  );
};

export const ThankYou = () => {
  return (
    <VStack gap={4} mt={4} mx={4}>
      <ThankyouContent />
    </VStack>
  );
};
