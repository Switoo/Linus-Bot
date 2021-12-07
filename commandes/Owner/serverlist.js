const Discord = require("discord.js")
const config = require("../../config.json")
const db = require("quick.db")
const fs = require('fs')
const emotes = require("../../emotes.json")
module.exports.run = async (client, message, args) => {
    if(!message.guild) return;
    var config = require("../../config.json"),
    db = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8"));
var config = require("../../config.json")
let authorized = [`${config.bot.owner}`, `${config.bot.owner1}`, `${config.bot.owner2}`, `${config.bot.owner3}`, `${config.bot.owner4}`, `${config.bot.owner5}`, `${config.bot.owner6}`, `${config.bot.owner7}`, `${config.bot.owner8}`, `${config.bot.owner9}`, `${config.bot.owner10}`]
if(!authorized.includes(message.author.id)) return message.channel.send(`${emotes.general.no} ERREUR: Vous devez être \`OWNER\` du bot pour éxecuter cette commande.`);


  this.client = message.client;
        let i0 = 0;
        let i1 = 10;
        let page = 1;
        let description =
            `Nombre de serveurs : ${this.client.guilds.cache.size}\n\n` +
            this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
            .map((r, i) => `**${i + 1}** - ${r.name}・ \`(${r.id})\`・ \`[${r.memberCount}]\``)
            .slice(0, 10)
            .join("\n");
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
            .setColor(db.color)
            .setTimestamp()
            .setFooter(client.user.username,client.user.displayAvatarURL({dynamic : true }))
        .setDescription(description);
        const msg = await message.channel.send(embed);
        await msg.react("⬅");
        await msg.react("➡");
        await msg.react("❌");
        const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
        collector.on("collect", async(reaction) => {
            if (reaction._emoji.name === "⬅") {
                // Updates variables
                i0 = i0 - 10;
                i1 = i1 - 10;
                page = page - 1;

                // if there is no guild to display, delete the message
                if (i0 < 0) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }

                description = `Serveurs: ${this.client.guilds.cache.size}\n\n` +
                    this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
                    .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membres`)
                    .slice(i0, i1)
                    .join("\n");

                // Update the embed with new informations
                embed.setTitle(`Page: ${page}/${Math.round(this.client.guilds.cache.size/10)}`)
                    .setDescription(description);
                // Edit the message 
                msg.edit(embed);
            }
            if (reaction._emoji.name === "➡") {

                // Updates variables
                i0 = i0 + 10;
                i1 = i1 + 10;
                page = page + 1;

                // if there is no guild to display, delete the message
                if (i1 > this.client.guilds.cache.size + 10) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }
                description = `Serveurs: ${this.client.guilds.cache.size}\n\n` +
                    this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
                    .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} membres`)
                    .slice(i0, i1)
                    .join("\n");
                // Update the embed with new informations
                embed.setTitle(`Page: ${page}/${Math.round(this.client.guilds.cache.size/10)}`)
                    .setDescription(description);
                // Edit the message 
                msg.edit(embed);
            }
            if (reaction._emoji.name === "❌") {
                return msg.delete();
            }
            // Remove the reaction when the user react to the message
            await reaction.users.remove(message.author.id);
        });


}
  module.exports.help = {
    name: "servlist",
    aliases: ["serveurlist", "serveur-list", "serverlist", "server-list"],
    category: 'Administration',
    description: "Permet de changer le statut du Bot",
  };