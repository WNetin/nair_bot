import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, TextBasedChannel, TextChannel } from "discord.js";

new Command({
    name: "clone",
    description: "Imitate a user",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "Select a user",
            type: ApplicationCommandOptionType.User,
            required
        },
        {
            name: "message",
            description: "Select a message",
            type: ApplicationCommandOptionType.String,
            required
        }
    ],
    async run(interaction){
        const options = interaction.options;

        const user = options.getUser("user");
        const message = options.getString("message");

        if(!user || !message) return interaction.reply({ content: "Invalid arguments", ephemeral: true });

        if(interaction.channel instanceof TextChannel){
            const channel = interaction.channel;

            await channel.createWebhook({
                name: user.username,
                avatar: user.avatarURL()
            }).then(webhook => {
                webhook.send(message);
                webhook.delete();
            });

            const embed = new EmbedBuilder({
                title: "Clone",
                description: `User: ${user}\nMessage: ${message}`,
                footer: {
                    text: `Channel: ${channel.name}`
                },
                color: hexToRgb(settings.colors.theme.azoxo)
            });

            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
});
