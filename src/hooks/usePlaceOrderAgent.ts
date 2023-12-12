import z from 'zod';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "langchain/tools";

const model = new ChatOpenAI({
	temperature: 1,
	modelName: 'gpt-4-1106-preview',
	openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
})
const schema = z.object({
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
});

export const usePlaceOrderAgent = () => {
	const call = async (input: string) => {
		const tools = [
			new DynamicStructuredTool({
				name: "placeOrder",
				description: "Useful for when customer wants to place an order",
				schema,
				func: async (args) => {
					console.log(args)
					return 'Places the order successfully';
				},
				returnDirect: false, // This is an option that allows the tool to return the output directly
			}),
		];
		const executor = await initializeAgentExecutorWithOptions(tools, model, {
			agentType: "structured-chat-zero-shot-react-description",
			verbose: true,
		});

		await executor.invoke({ input });
	}

	return { call };
}

