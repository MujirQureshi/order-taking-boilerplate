// @ts-ignore
import z from "zod";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { DynamicStructuredTool } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { useDataProvider } from "../components/data-provider";
import { useNavigate } from "react-router-dom";
import {
  calculateOrderSubtotal,
  calculateOrderTotal,
} from "../utils/calculations";

const model = new ChatOpenAI({
  temperature: 1,
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const useOrderPlacingAgent = () => {
  const navigate = useNavigate();
  const { checkout } = useDataProvider();
  const call = async (input: string) => {
    const tools = [
      new DynamicStructuredTool({
        name: "placeOrder",
        description: "useful for when you want to place the order",
        schema: z.object({
          items: z
            .array(
              z.object({
                label: z.string().describe("Menu item name"),
                price: z.number().describe("Menu item price"),
                quantity: z.number().describe("Quantity of menu item"),
                value: z
                  .array(
                    z.object({
                      variant: z.string().describe("Variant type"),
                      value: z.string().describe("Variant item selected"),
                      price: z.number().describe("Variant price").optional(),
                    })
                  )
                  .optional(),
              })
            )
            .describe("Array of menu items to add to cart"),
          firstName: z.string().describe("Customer first name"),
          lastName: z.string().describe("Customer last name"),
          phone: z.string().describe("Customer phone number"),
          email: z.string().describe("Customer email address"),
          paymentMethod: z
            .string()
            .describe("Customer preferred payment method"),
        }),
        func: async (args) => {
          const lines = args.items as any[];
          await checkout({
            ...args,
            lines: lines.map((line) => ({ value: [], ...line })),
            pickupTime: "",
            paymentMethod: args.paymentMethod as any,
            subTotal: calculateOrderSubtotal(lines),
            total: calculateOrderTotal(lines, 13).toFixed(2) as any,
          });
          navigate("/thankyou");
          return "Placed the order";
        },
        returnDirect: true,
      }),
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
    });
    console.log("Loaded agent.");
    console.log(`Executing with input "${input}"...`);

    const result = await executor.call({ input });

    return result;
  };

  return { call };
};
