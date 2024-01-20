
import { db } from "@/database";
import { log } from "@/settings";
import { Event } from "@discord/base";
import ck from "chalk";
import { EmbedBuilder, WebhookClient } from "discord.js";

new Event({
    name: "messageCreate", once: false,
    async run(message) {
        if(message.author.bot) return;
        if(message.content === "") return;
        if(message.content.startsWith("$")) return;
        if(message.channel.isDMBased()) return;

        const webhookToken = await db.guilds.get(`${message.guildId}.logs.chatChannel.webhook.token`);
        const webhookId = await db.guilds.get(`${message.guildId}.logs.chatChannel.webhook.id`);

        //@ts-ignore
        const webhook = new WebhookClient({ id: webhookId, token: webhookToken });

        const embed = new EmbedBuilder({
            image: {
                // @ts-ignore
                url: message.attachments.first()?.url,
            },
            footer: {
                text: "canal: " + message.channel.name,
            },
        });

        webhook.send({
            content: message.content|| "imagem",
            username: message.author.username,
            avatarURL: message.author.displayAvatarURL(),
            embeds: [embed],
        }).catch(error => {
            log.error(error);
        });
    },
});
