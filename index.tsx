import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin from "@utils/types";
import MessagePeek from "./components/MessagePeek";
import { MessagePeekProps } from "./types";

export default definePlugin({
    name: "MessagePeek",
    description: "See the last message in a Channel like on mobile",
    authors: [{ name: "domi.btnr", id: 354191516979429376n }],
    patches: [
        {
            find: /avatar:[^],decorators:[^],name:[^],subText:[^],/,
            replacement: {
                match: /(?<=avatar:([^])[^]*)(?<=decorators:([^])[^]*)(children:\[[^]*?null)\]/,
                replace: "$3,$self.renderMessagePeek({ DM: $2?.[0]?.props?.children?.props?.user || $1?.props?.src || $1?.props?.recipients })]"
            }
        }
    ],
    renderMessagePeek: (props: MessagePeekProps) => {
        return (
            <ErrorBoundary noop>
                <MessagePeek {...props} />
            </ErrorBoundary>
        );
    }
});