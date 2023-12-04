// @ts-ignore
import YAML from "json-to-pretty-yaml";
import { useDataProvider } from "../components/data-provider";
import { useCallback, useEffect, useState } from "react";
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { loadEvaluator } from "langchain/evaluation";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "langchain/schema";
import { useOrderPlacingAgent } from "./useOrderPlacingAgent";

const model = new ChatOpenAI({
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  temperature: 1,
  modelName: "gpt-3.5-turbo",
});

export const useOrderBot = () => {
  const [value, setValue] = useState<string>("");
  const { call } = useOrderPlacingAgent();
  const { items } = useDataProvider();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [executor, setExecutor] = useState<AgentExecutor>();
  const [messages, setMessages] = useState<BaseMessage[]>([
    new SystemMessage(
      `You are OrderBot, an automated service to collect orders for a restraunt.

	1. You first greet the customer, then collect the order.

	2. and then asks the customer for their first name, last name, email address and phone number.

	3. And then you collect the payment method. Payment method can be cash or card.

	You wait to collect the entire order, then summarize it and check for a final \
	time if the customer wants to add anything else.

  Finally ask the user to pick up the order in 20 minutes.

	Some menu items have variants, for example:
	TANDOORI KABOB DINNER has 2 variants:
	1. Rice Choice of Regular Rice or Qabilee Rice
	2. Salad Choice of Afghan Salad or Greek Salad or Caesar Salad.
	Make sure to clarify all variant selections to uniquely identiy items \
	You respond in a short, very conversational friendly style.
	The menu includes \
	${YAML.stringify(
    items.map(
      ({ image, category, createdate, createby, lastupdate, ...item }) => item
    )
  )}
				`
    ),
  ]);

  const handleMount = useCallback(async () => {
    const initExecutor = await initializeAgentExecutorWithOptions([], model, {
      agentType: "chat-conversational-react-description",
      verbose: true,
    });
    const response = await model.generate([
      [
        ...messages,
        new AIMessage("say Hi, you are OrderBot, say how may I help you?"),
      ],
    ]);
    setMessages((prevState) => [
      ...prevState,
      new AIMessage(response.generations[0][0].text),
    ]);
    setExecutor(initExecutor);
    setIsLoading(false);
  }, [messages]);

  const handleNewMessage = async (message: string) => {
    if (!executor) return;
    setValue("");
    setIsLoading(true);
    const tmpMessages = messages;
    setMessages((prevState) => [...prevState, new HumanMessage(message)]);
    const response = await model.generate([
      [...tmpMessages, new HumanMessage(message)],
    ]);
    setMessages((prevState) => [
      ...prevState,
      new AIMessage(response.generations[0][0].text),
    ]);
    setIsLoading(false);
    try {
      const evaluator = await loadEvaluator("criteria", {
        llm: model,
        criteria: {
          name: "orderPlacingCheck",
          critiqueRequest:
            "Identify specific ways in which the assistant’s last response is asking to pick up the order in 20 mins",
        },
      });
      const res = await evaluator.evaluateStrings({
        input: "message",
        prediction: response.generations[0][0].text,
      });
      console.log(res);
      if (res.score) {
        const summaryResponse = await model.generate([
          [
            ...tmpMessages,
            new HumanMessage(message),
            new AIMessage(response.generations[0][0].text),
            new AIMessage(
              `Summarize the customer's order, personal information and payment method perferrance. Include menu item name, price, quantity, and variants. For variants include the variant title, the selected option and variant selection price. 

  Desired output For example:
  name: John Doe
  phone: 1234567890
  email: john@exmaple.com
  paymentMethod: cash
  order summary:
  - 1x Apple juice: $2.49
  - 1x Build your own pizza: $7.99
    - Size: Large (+ $5.00)
    - Crust: Thick
    - Toppings: 
			- No cheese
			- Chicken (+2.25)
			- Mushrooms (+ $2.25)
              `
            ),
          ],
        ]);
        await call(summaryResponse.generations[0][0].text);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  return {
    isLoading,
    messages,
    handleNewMessage,
    value,
    setValue,
  };
};
