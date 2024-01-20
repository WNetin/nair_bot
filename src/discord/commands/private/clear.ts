import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, TextChannel } from "discord.js";

new Command({
    name: "clear",
    description: "clear x messages from channel",
    dmPermission:false,
    defaultMemberPermissions: ["ManageMessages"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "amount",
            description: "Amount of messages to clear",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    async run(interaction){
        const amount = interaction.options.getInteger("amount");
        if(!amount) return interaction.reply({ content: "Invalid amount", ephemeral: true });

        if(amount < 1 || amount > 100) return interaction.reply({ content: "Invalid amount", ephemeral: true });

        await (interaction.channel as TextChannel).bulkDelete(amount);

        let embed = new EmbedBuilder({
            title: "Clear",
            description: `Deleted ${amount} messages`,
            color: hexToRgb(settings.colors.theme.success),
        });

        await interaction.reply({ embeds: [embed], ephemeral: true }).then(async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await msg.delete();
        });
    }
});
