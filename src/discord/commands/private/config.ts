import { db } from "@/database";
import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, EmbedBuilder } from "discord.js";

new Command({
    name: "config",
    description: "Config command",
    dmPermission: false,
    defaultMemberPermissions: ["BanMembers"],
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name: "logs",
            description: "Config logs system",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "channel",
                    description: "Set a logs channel",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "Select a channel",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required
                        }
                    ]
                },
                {
                    name: "chat",
                    description: "Config chat logs",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "Select a channel",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required
                        },
                        {
                            name: "url",
                            description: "Select a url",
                            type: ApplicationCommandOptionType.String,
                            required
                        }
                    ]
                }
            ]
        },
        {
            name: "bot",
            description: "Config bot profile",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "activity",
                    description: "Set bot activity",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "activity_name",
                            description: "Select a activity",
                            type: ApplicationCommandOptionType.String,
                            required
                        }
                    ]
                },
                {
                    name: "pfp",
                    description: "Set bot profile picture",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "url",
                            description: "Select a url",
                            type: ApplicationCommandOptionType.String,
                            required
                        }
                    ]
                },
                {
                    name: "name",
                    description: "Set bot name",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "name",
                            description: "Select a name",
                            type: ApplicationCommandOptionType.String,
                            required
                        }
                    ]
                },
            ]
        },
        {
            name: "alert",
            description: "Config join alert",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "on",
                    description: "Set join alert on",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "on",
                            description: "Select a on",
                            type: ApplicationCommandOptionType.Boolean,
                            required
                        }
                    ]
                },
                {
                    name: "audios",
                    description: "Set join alert audios",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "url",
                            description: "Select a url",
                            type: ApplicationCommandOptionType.String,
                            required
                        },
                        {
                            name: "name",
                            description: "Select a name",
                            type: ApplicationCommandOptionType.String,
                            required
                        }
                    ]
                }
            ]
        }
    ],
    async run(interaction){
        const { options, guild } = interaction;

        const group = options.getSubcommandGroup(true);
        const subCommand = options.getSubcommand(true);

        switch(group){
            case "logs":{
                switch(subCommand){
                    case "channel":{
                        const channel = options.getChannel("channel", true, [ChannelType.GuildText]);

                        await db.guilds.set(guild.id + ".logs.channel.id", channel.id);

                        interaction.reply({ ephemeral, content: "Logs channel defined successfully" });
                        return;
                    }
                    case "chat":{
                        const url = options.getString("url", true);
                        const channel = options.getChannel("channel", true, [ChannelType.GuildText]);

                        const data =  url.split("/");

                        await db.guilds.set(guild.id + ".logs.chatChannel.webhook.id", data[5]);
                        await db.guilds.set(guild.id + ".logs.chatChannel.webhook.token", data[6]);
                        await db.guilds.set(guild.id + ".logs.chatChannel.id", channel.id);

                        const embed = new EmbedBuilder({
                            title: "Chat Logs Definido com Sucesso!",
                            description: `Definido para: \`${channel.name}\``,
                            color: hexToRgb(settings.colors.theme.azoxo),
                            footer:{
                                text: `definido por ${interaction.user.tag}`
                            }
                        });

                        interaction.reply({ embeds: [embed] });
                        return;
                    }
                }
                return;
            }
            case "bot":{
                switch(subCommand){
                    case "activity":{
                        const activity = options.getString("activity_name", true);

                        interaction.client.user.setActivity(activity);

                        const embed = new EmbedBuilder({
                            title: "Atividade Definida com Sucesso!",
                            description: `Definido para: \`${activity}\``,
                            color: hexToRgb(settings.colors.theme.success),
                            footer:{
                                text: `definido por ${interaction.user.tag}`
                            }
                        });

                        interaction.reply({ embeds: [embed] });
                        return;
                    }
                    case "pfp":{
                        const url = options.getString("url", true);

                        interaction.client.user.setAvatar(url);

                        const embed = new EmbedBuilder({
                            title: "Foto de Perfil Definida com Sucesso!",
                            description: "Definido para:",
                            image: { url },
                            color: hexToRgb(settings.colors.theme.success),
                            footer:{
                                text: `definido por ${interaction.user.tag}`
                            }
                        });

                        interaction.reply({ embeds: [embed] });
                        return;
                    }
                    case "name":{
                        const name = options.getString("name", true);

                        interaction.client.user.setUsername(name);

                        const embed = new EmbedBuilder({
                            title: "Nome Definido com Sucesso!",
                            description: `Definido para: \`${name}\``,
                            color: hexToRgb(settings.colors.theme.success),
                            footer:{
                                text: `definido por ${interaction.user.tag}`
                            }
                        });

                        interaction.reply({ embeds: [embed] });
                        return;
                    }
                }
            }
            case "alert":{
                switch(subCommand){
                    case "on":{
                        const on = options.getBoolean("on", true);

                        await db.guilds.set(guild.id + ".logs.joinAlert.on", on);

                        const embed = new EmbedBuilder({
                            title: "Alerta de Entrada Definido com Sucesso!",
                            description: `Definido para: \`${on ? "ligado" : "desligado"}\``,
                            color: hexToRgb(settings.colors.theme.success),
                            footer:{
                                text: `definido por ${interaction.user.tag}`
                            }
                        });

                        interaction.reply({ embeds: [embed] });
                        return;
                    }
                    case "audios":{
                        const url = options.getString("url", true);
                        const name = options.getString("name", true);

                        //check if is a youtube url
                        if(!url.includes("youtube.com")) return interaction.reply({ content: "URL inválida" });

                        await db.guilds.push(guild.id + ".logs.joinAlert.audios", { url, name });

                        const embed = new EmbedBuilder({
                            title: "Audio Adicionado com Sucesso!",
                            description: `Adicionado: \`${name}\``,
                            color: hexToRgb(settings.colors.theme.success),
                            footer:{
                                text: `definido por ${interaction.user.tag}`
                            }
                        });

                        interaction.reply({ embeds: [embed] });
                        return;
                    }
            }
        }
    }
    }
});
