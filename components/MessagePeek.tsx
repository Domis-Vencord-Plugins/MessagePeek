import { findByPropsLazy } from "@webpack";
import { ChannelStore, MessageStore, TooltipContainer, useStateFromStores } from "@webpack/common";
import { MessagePeekProps } from "../types";
import "./styles.css";

const ChannelWrapperStyles = findByPropsLazy("muted", "subText");
const ChannelStyles = findByPropsLazy("closeButton", "subtext");

// Could lead to wrong group if multiple groups with same members
const getGroupFromRecipients = (recipients: string[]) => {
    const groups = ChannelStore.getSortedPrivateChannels().filter(c => c.isGroupDM());
    return groups.find(g => g.recipients.every(r => recipients.includes(r)));
};

export default function MessagePeek(props: MessagePeekProps) {
    const { DM } = props;
    if (!DM) return null;

    let channelId = "";
    switch (typeof DM) {
        case "string":
            [, channelId] = DM.match(/avatars|channel-icons\/([^\/]*)/) || [];
            break;
        case "object":
            if (Array.isArray(DM)) {
                const group = getGroupFromRecipients(DM);
                if (group) channelId = group.id;
            } else {
                channelId = ChannelStore.getDMFromUserId(DM.id);
                break;
            }
    }

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
            <TooltipContainer text={content.length > 128 ? `${content.slice(0, 128).trim()}...` : content}>
                <div className={ChannelStyles.subtext}>
                    {`${lastMessage.author["globalName"] || lastMessage.author.username}: ${content}`}
                </div>
            </TooltipContainer>
        </div>
    )
}
