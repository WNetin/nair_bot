import { db } from "@/database";
import { Component } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import { ComponentType, EmbedBuilder } from "discord.js";

new Component({
    customId: "selectAudiotoRemove",
    type: ComponentType.StringSelect, cache: "cached",
    async run(interaction) {
        const audio = JSON.parse(interaction.values[0]);

        const audioList = await db.guilds.get(interaction.guildId + ".logs.joinAlert.audios") as Array<{
            url: string;
            name: string;
        }>;

        const newAudioList = audioList?.filter((a: any) => a.url !== audio.url);

        await db.guilds.set(interaction.guildId + ".logs.joinAlert.audios", newAudioList);

        // reply an embed

        const embed = new EmbedBuilder()
        .setTitle("Audio removed!")
        .setDescription(`The audio ${audio.name} was removed from the list!`)
        .setColor(hexToRgb(settings.colors.theme.success))
        .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });

        interaction.message.delete();

    },
});
