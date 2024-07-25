import { findByPropsLazy } from "@webpack";
import { MessageStore, Parser, TooltipContainer, useStateFromStores } from "@webpack/common";
import { MessagePeekProps } from "../types";
import "./styles.css";

const ChannelWrapperStyles = findByPropsLazy("muted", "subText");
const ChannelStyles = findByPropsLazy("closeButton", "subtext");

export default function MessagePeek(props: MessagePeekProps) {
    const { channel, channel_url } = props;
    if (!channel && !channel_url) return null;

    let channelId = "";
    if (channel) channelId = channel.id;
    else channelId = channel_url.split("/").pop() as string;

    if (!channelId) return null;
    const lastMessage = useStateFromStores([MessageStore], () => MessageStore.getMessages(channelId)?.last());
    if (!lastMessage) return null;
    const content =
        lastMessage.content ||
        lastMessage.embeds?.[0]?.rawDescription ||
        lastMessage.attachments.length && `${lastMessage.attachments.length} attachment${lastMessage.attachments.length > 1 ? "s" : ""}`;
    if (!content) return null;

    return (
        <div
            className={ChannelWrapperStyles.subText}
            style={{ marginBottom: "2px" }}
        >
            <TooltipContainer text={content.length > 256 ? Parser.parse(content.slice(0, 256).trim()) : Parser.parse(content)}>
                <div className={ChannelStyles.subtext}>
                    {`${lastMessage.author["globalName"] || lastMessage.author.username}: `}
                    {Parser.parseInlineReply(content)}
                </div>
            </TooltipContainer>
        </div>
    )
}
