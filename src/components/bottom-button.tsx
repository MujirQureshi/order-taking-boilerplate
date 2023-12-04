import { Button, Flex, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface IBottomButtonProps {
  total: string;
  label: string;
  onClick?: () => void;
}

export const BottomButton: FunctionComponent<IBottomButtonProps> = ({
  total,
  label,
  onClick,
}) => {
  return (
    <Flex position="fixed" bottom={0} right={0} left={0}>
      <Button
        type="submit"
        w="100%"
        borderRadius={0}
        colorScheme="blue"
        onClick={onClick}
      >
        <Flex gap={4} w="100%">
          <Text>${total}</Text>
          <Flex justify="center" w="100%" borderLeftWidth={1}>
            <Text>{label}</Text>
          </Flex>
        </Flex>
      </Button>
    </Flex>
  );
};
