import z from 'zod';

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
	return null;
}

