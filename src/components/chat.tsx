import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useOrderBot } from "../hooks/useOrderBot";

export const Chat = () => {
  const { messages, handleNewMessage, isLoading, value, setValue } =
    useOrderBot();

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages
              .filter((message) => message._getType() !== "system")
              .map((message, index) => (
                <Message
                  key={index}
                  model={{
                    message: message.content,
                    direction:
                      message._getType() === "human" ? "outgoing" : "incoming",
                    position: "single",
                  }}
                />
              ))}
            {isLoading ? <TypingIndicator /> : null}
          </MessageList>
          <MessageInput
            value={value}
            onChange={(e) => setValue(e)}
            disabled={isLoading}
            placeholder="Type message here"
            onSend={handleNewMessage}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
