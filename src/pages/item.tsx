import {
  Text,
  Image,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  FormErrorMessage,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { useDataProvider } from "../components/data-provider";
import { ILine } from "../models";
import { useEffect } from "react";
import { BottomButton } from "../components/bottom-button";
import { calculateItemTotal } from "../utils/calculations";

const Variant = ({ allowMultiple, defaultValue, ...props }: any) =>
  allowMultiple ? (
    <CheckboxGroup {...props} defaultValue={[defaultValue]} />
  ) : (
    <RadioGroup {...props} defaultValue={defaultValue} />
  );

const Choice = ({ allowMultiple, ...props }: any) =>
  allowMultiple ? <Checkbox {...props} /> : <Radio {...props} />;

export const Item = () => {
  const { id } = useParams();
  const { getItemById, addToCart } = useDataProvider();
  const item = getItemById(id!);
  const { register, handleSubmit, formState, watch, control } = useForm<ILine>({
    defaultValues: {
      quantity: 1,
      value: [],
      price: item!.price,
      label: item!.label,
    },
  });
  const { append, remove, fields } = useFieldArray<ILine, "value">({
    control,
    name: "value",
  });

  const onSubmit = (values: ILine) => addToCart(values);

  useEffect(() => {
    if (!item?.variants.length) return;

    item.variants
      .filter((variant) => variant.isRequired)
      .forEach((variant) =>
        append({
          price: variant.choices[0].price,
          value: variant.choices[0].label,
          variant: variant.type,
        })
      );
  }, []);

  if (!item) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={4} pb={100} alignItems="flex-start">
        <Image src={item.image?.src} w="100%" maxH="280px" objectFit="cover" />
        <VStack gap={4} p={4} w="100%" alignItems="flex-start">
          <Text>{item.description}</Text>
          {item.variants.map((variant) => (
            <FormControl>
              <FormLabel>
                {variant.type}{" "}
                {variant.isRequired && (
                  <Text as="span" fontSize={12} color="gray.500">
                    (Required)
                  </Text>
                )}
              </FormLabel>
              <Variant
                defaultValue={
                  variant.isRequired ? `${variant.type}:0` : undefined
                }
                allowMultiple={variant.allowMultiple}
                onChange={(index: string | string[]) => {
                  const removeAll = fields.reduce((acc, field: any, index) => {
                    if (field.variant !== variant.type) return acc;
                    return [...acc, index];
                  }, [] as number[]);
                  remove(removeAll);
                  if (Array.isArray(index)) {
                    const currIndexs = index
                      .filter((i) => !!i)
                      .map((i) => parseInt(i.split(":")[1]));

                    currIndexs.forEach((i) =>
                      append({
                        price: variant.choices[i].price,
                        value: variant.choices[i].label,
                        variant: variant.type,
                      })
                    );
                  } else {
                    const currIndex = parseInt(index.split(":")[1]);
                    append({
                      price: variant.choices[currIndex].price,
                      value: variant.choices[currIndex].label,
                      variant: variant.type,
                    });
                  }
                }}
              >
                <VStack
                  alignItems="flex-start"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius={4}
                >
                  {variant.choices.map((choice, index, arr) => (
                    <Box
                      px={4}
                      py={2}
                      w="100%"
                      borderColor="gray.200"
                      borderBottomWidth={arr.length - 1 === index ? 0 : 1}
                      mt="0px !important"
                    >
                      <Choice
                        value={`${variant.type}:${index}`}
                        allowMultiple={variant.allowMultiple}
                      >
                        <Flex gap={3}>
                          <Text>{choice.label}</Text>
                          {choice.price > 0 && (
                            <Text color="gray.500" fontSize={12}>
                              +${choice.price.toFixed(2)}
                            </Text>
                          )}
                        </Flex>
                      </Choice>
                    </Box>
                  ))}
                </VStack>
              </Variant>
            </FormControl>
          ))}
          <FormControl>
            <FormLabel>Special Instructions</FormLabel>
            <Textarea
              placeholder="pepper / salt / cutluty..."
              {...register("instructions")}
            />
          </FormControl>
          <FormControl isInvalid={!!formState.errors.quantity?.type}>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              defaultValue={1}
              {...register("quantity", { min: 1, valueAsNumber: true })}
            />
            {!!formState.errors.quantity?.type && (
              <FormErrorMessage>Invalid</FormErrorMessage>
            )}
          </FormControl>
        </VStack>
      </VStack>
      <BottomButton
        label="Add to Cart"
        total={calculateItemTotal(
          fields,
          item.price,
          watch("quantity")
        ).toFixed(2)}
      />
    </form>
  );
};
