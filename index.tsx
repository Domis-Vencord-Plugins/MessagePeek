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
                match: /(?<=decorators:([^])[^]*)(children:\[[^]*?null)\]/,
                replace: "$2,$self.renderMessagePeek({ user: $1?.[0]?.props?.children?.props?.user })]"
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