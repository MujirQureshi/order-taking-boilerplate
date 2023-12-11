import { FC } from "react";
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

export const Chat: FC = () => {
  const { handleNewMessage, isLoading, messages } = useOrderBot();
  return (
    <div style={{ position: "relative", height: "300px" }}>
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
            disabled={isLoading}
            placeholder="Type message here"
            onSend={handleNewMessage}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
