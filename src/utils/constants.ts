export type PaymentMethodType = 'cash' | 'card' | 'phone';

export interface IPaymentMethod {
	id: PaymentMethodType;
	name: string;
}

export const PAYMENT_METHODS: IPaymentMethod[] = [
	{ id: 'card', name: 'Credit Card' },
	{ id: 'cash', name: 'Cash at the counter' },
	{ id: 'phone', name: 'Call me back to get payment information' },
];


export type OrderStatusType = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface IOrderStatus {
	id: OrderStatusType;
	name: string;
}

export const ORDER_STATUS: IOrderStatus[] = [
	{ id: "pending", name: "Pending" },
	{ id: "confirmed", name: "Confirmed" },
	{ id: "cancelled", name: "Cancelled" },
	{ id: "completed", name: "Completed" },
];
