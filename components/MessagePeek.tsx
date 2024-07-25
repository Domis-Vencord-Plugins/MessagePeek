import { findByPropsLazy } from "@webpack";
import { ChannelStore, MessageStore } from "@webpack/common";
import { MessagePeekProps } from "../types";
import "./styles.css";

const ChannelWrapperStyles = findByPropsLazy("muted", "subText");
const ChannelStyles = findByPropsLazy("closeButton", "subtext");

export default function MessagePeek(props: MessagePeekProps) {
    const { user } = props;
    if (!user || !Object.keys(user).length) return null;

    const channelId = ChannelStore.getDMFromUserId(user.id);
    const channel = ChannelStore.getChannel(channelId);
    const lastMessage = MessageStore.getMessage(channelId, channel.lastMessageId);
    if (!lastMessage) return null;

    return (
        <div
            className={ChannelWrapperStyles.subText}
            style={{ marginBottom: "2px" }}
        >
            <div className={ChannelStyles.subtext}>
                {`${lastMessage.author["globalName"] || lastMessage.author.username}: ${lastMessage.content}`}
            </div>
        </div>
    )
}
