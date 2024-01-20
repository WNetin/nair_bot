import { log } from "@/settings";
import { Event } from "@discord/base";
import { hexToRgb, sleep } from "@magicyan/discord";
import ck from "chalk";
import { EmbedBuilder } from "discord.js";

new Event({
    name: "guildMemberAdd", once: false,
    async run(member) {
        await sleep(3000);

        const embed = new EmbedBuilder({
            title: "Bem vindo ao servidor!",
            description: `Seja bem vindo ${member.user} ao servidor!`,
            color: hexToRgb("#00FF00"),
            thumbnail: {
                url: member.user.displayAvatarURL(),
            },
            footer: {
                text: `ID: ${member.user.id}`,
            },
        });

        await member.send({ embeds: [embed] });
        log.info(ck.green("Alguem entrou no servidor!"));
    },
});
