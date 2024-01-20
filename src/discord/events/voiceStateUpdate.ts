import { log, settings } from "@/settings";
import { Event } from "@discord/base";
import { AudioPlayerStatus, DiscordGatewayAdapterCreator, NoSubscriberBehavior, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { hexToRgb, sleep } from "@magicyan/discord";
import ytdl from "ytdl-core";
import ck from "chalk";
import { EmbedBuilder, StageChannel, TextChannel, VoiceChannel } from "discord.js";
import { db } from "@/database";

new Event({
    name: "voiceStateUpdate", once: false,
    async run(oldMember, newMember) {
        if(oldMember.member?.user.bot) return;

        let newChannel = newMember.member?.voice.channel;
        let oldChannel = oldMember.member?.voice.channel;

        if(newChannel instanceof StageChannel) return;

        if(newChannel instanceof VoiceChannel){
            log.info(ck.yellow(`${newMember.member?.user.username} entrou no canal ${newChannel?.name}`));
            if(await db.guilds.get(`${newMember.member?.guild.id}.logs.joinAlert.on`) as boolean !== true) return;

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });

            const audioList: {
                url?: string | undefined;
                name?: string | undefined;
            }[] | null= await db.guilds.get(`${newChannel.guildId}.logs.joinAlert.audios`);

            if(audioList === null) return;

            const audio = await audioList![Math.floor(Math.random() * audioList!.length)] as {
                url: string;
                name: string;
            };

            log.info(ck.yellow(`ID do canal ${audioList}`));

            const connection = joinVoiceChannel({
                channelId: newChannel?.id || "",
                guildId: newChannel?.guild.id || "",
                adapterCreator: newChannel?.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
            });
            const resource = createAudioResource(ytdl(audio.url, { filter: "audioonly" }));
            player.play(resource);

            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, async () => {
                await sleep(500);
                connection.destroy();
            });

            await db.guilds.get(`${newMember.member?.guild.id}.logs.channel.id`).then(async (channelId) => {
                if(channelId === undefined) return;

                const channel = await newMember.guild.channels.cache.get(channelId as string);


                if(channel === undefined) return;


                const embed = new EmbedBuilder({
                    title: "Alerta de Entrada Tocado com sucesso!",
                    description: `O audio tocado foi ${audio.name}`,
                    color: hexToRgb(settings.colors.theme.success),
                });
                (channel as TextChannel).send({embeds: [embed]});
            });
        }
    },
});
