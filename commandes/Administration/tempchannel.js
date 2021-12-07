const { MessageEmbed } = require("discord.js"), 
fs = require("fs"), 
ms = require("ms"),
getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };

function update(message, db) {
    fs.writeFile(`./serveur/${message.guild.id}.json`, JSON.stringify(db), (x) => {
        if (x) console.error(x)
      });
};

module.exports.run = async (client, message, args) => {
    if(!message.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
   let db = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8")),
   config = require("../../config.json"),
   winner = null,
   presence = {
   "false": "Désactivé",
   "true": "Activé"
   },
   filter = (reaction, user) => ['✨', '🏷️','✅','❌','📖','🎗️'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };
   const msgembed = new MessageEmbed()
   .setAuthor(`🕙 Modification des salons temporaires de ${message.guild.name}`, message.author.avatarURL({ dynamic: true }))
   .setColor(db.color)
   .addField("`📖` Catégorie", db.tempo.category, true)
   .addField("`🏷️` Salon", db.tempo.channel, true)
   .addField("`🎗️` Emoji", db.tempo.emoji, true)
   .addField(`✨`, "Crée une configuration automatique")
   .addField(`📖`, "Modifier la catégorie")
   .addField(`🏷️`, "Modifier le salon de création")
   .addField(`🎗️`, "Modifier l'emoji en prefixe des salons temporaires")
   .addField(`✅`, "Activer le module")
   .addField(`❌`, "Désactiver le module")
   .setTimestamp()  
   .setFooter(client.user.username,client.user.displayAvatarURL({dynamic : true }))
   .setColor(db.color)
    message.channel.send(msgembed).then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 
    if(r.emoji.name === "✨") {
        message.channel.send(`✨ Création de la catégorie des salons personnalisé en cours..`).then(msg => {
            m.guild.channels.create('Salon temporaire', {
                type: 'category',
                permissionsOverwrites: [{
                  id: message.guild.id,
                  allow: ['VIEW_CHANNEL','CONNECT','SPEAK']
                }]
              }).then(c => {
                db.tempo.category = c.id
                c.guild.channels.create('➕ Crée ton salon', {
                    type: 'voice',
                    parent: c.id,
                    permissionOverwrites: [
                       {
                         id: message.guild.id,
                         allow: ['VIEW_CHANNEL','CONNECT','SPEAK']
                      },
                    ],
                  }).then(v => {
                db.tempo.channel = v.id
                update(message, db)
                m.edit({ embed: { author: { name: `🕙 Modification des salons temporaires de ${message.guild.name}`}, color: db.color, description:  "`✨` Crée une configuration automatique\n`📖` Modifier la catégorie\n`🏷️` Modifier le salon de création\n`🎗️` Modifier l'emoji en prefixe des salons temporaires\n`✅`Activer le module\n`❌` Désactiver" , fields: [ {name: "`📖` Catégorie", value: db.tempo.category, inline: true }, { name: "`🏷️` Salon", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });         
                msg.edit(`✨ Création de la catégorie des salons personnalisé effectué avec succès.`)
                  });
              })
        })
    } else if(r.emoji.name === "📖") {
        message.channel.send(`📖 Veuillez entrée l'ID de la catégorie.`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
            var msg = cld.first();
            var category = message.guild.channels.cache.get(msg.content)
            if(!category) return  message.channel.send(`📖 Salon incorrect.`);
            if(category.type !== "category") return message.channel.send(` 📖 Salon incorrect.`);
            db.tempo.channel = category.id 
            message.channel.send(` 📖 Vous avez changé le salon de la catégorie à \`${category.name}\``)
            update(message, db)
            m.edit({ embed: { author: { name: `🕙 Modification des salons temporaires de ${message.guild.name}`}, color: db.color, description:  "`✨` Crée une configuration automatique\n`📖` Modifier la catégorie\n`🏷️` Modifier le salon de création\n`🎗️` Modifier l'emoji en prefixe des salons temporaires\n`✅`Activer le module\n`❌` Désactiver" , fields: [ {name: "`📖` Catégorie", value: db.tempo.category, inline: true }, { name: "`🏷️` Salon", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });         
            });
            });
    } else if(r.emoji.name === "🏷️") {
        message.channel.send(`🏷️ Veuillez entrée l'ID du salon vocaux.`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
            var msg = cld.first();
            var category = message.guild.channels.cache.get(msg.content)
            if(!category) return  message.channel.send(`🏷️ Salon incorrect.`);
            if(category.type !== "voice") return message.channel.send(`🏷️ Salon incorrect.`);
            db.tempo.channel = category.id 
            message.channel.send(`🏷️ Vous avez changé le salon de création à \`${category.name}\``)
            update(message, db)
            m.edit({ embed: { author: { name: `🕙 Modification des salons temporaires de ${message.guild.name}`}, color: db.color, description:  "`✨` Crée une configuration automatique\n`📖` Modifier la catégorie\n`🏷️` Modifier le salon de création\n`🎗️` Modifier l'emoji en prefixe des salons temporaires\n`✅`Activer le module\n`❌` Désactiver" , fields: [ {name: "`📖` Catégorie", value: db.tempo.category, inline: true }, { name: "`🏷️` Salon", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });         
            });
            });
    } else if(r.emoji.name === "🎗️") {
        message.channel.send(`🎗️ Veuillez envoyer l'emoji que vous souhaitez.`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
            var msg = cld.first();
            db.tempo.emoji = msg.content
            message.channel.send(`🎗️ Vous avez modifié l'emoji à \`${db.tempo.emoji}\`.`)
            update(message, db)
            m.edit({ embed: { author: { name: `🕙 Modification des salons temporaires de ${message.guild.name}`}, color: db.color, description:  "`✨` Crée une configuration automatique\n`📖` Modifier la catégorie\n`🏷️` Modifier le salon de création\n`🎗️` Modifier l'emoji en prefixe des salons temporaires\n`✅`Activer le module\n`❌` Désactiver" , fields: [ {name: "`📖` Catégorie", value: db.tempo.category, inline: true }, { name: "`🏷️` Salon", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });         
            });
        });
    } else if(r.emoji.name === '✅') {
        if(db.tempo.module === true) { return message.channel.send(`<:yes:845285875466371073> Le module est déjà activé.`); }
        db.tempo.module = true
        update(message, db)
        m.edit({ embed: { author: { name: `🕙 Modification des salons temporaires de ${message.guild.name}`}, color: db.color, description:  "`✨` Crée une configuration automatique\n`📖` Modifier la catégorie\n`🏷️` Modifier le salon de création\n`🎗️` Modifier l'emoji en prefixe des salons temporaires\n`✅`Activer le module\n`❌` Désactiver" , fields: [ {name: "`📖` Catégorie", value: db.tempo.category, inline: true }, { name: "`🏷️` Salon", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });         
        message.channel.send(`<:yes:845285875466371073> Vous avez activé les salons temporaire`)
    } else if(r.emoji.name === '❌') {
            if(db.tempo.module === false) return message.channel.send(`<:no:845285837259931697> Le module est déjà désactivé.`);
            db.tempo.module = false
            update(message, db)
            m.edit({ embed: { author: { name: `🕙 Modification des salons temporaires de ${message.guild.name}`}, color: db.color, description:  "`✨` Crée une configuration automatique\n`📖` Modifier la catégorie\n`🏷️` Modifier le salon de création\n`🎗️` Modifier l'emoji en prefixe des salons temporaires\n`✅`Activer le module\n`❌` Désactiver" , fields: [ {name: "`📖` Catégorie", value: db.tempo.category, inline: true }, { name: "`🏷️` Salon", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });         
            message.channel.send(`<:no:845285837259931697> Vous avez désactivé les salons temporaires`)
    }
// --
});
await m.react("✨")
await m.react("📖")
await m.react("🏷️")
await m.react("🎗️")
await m.react("✅")
await m.react("❌")
    });

};


module.exports.help = {
    name: "tempchannel",
    aliases: ["tempvoc"],
    category: 'Gestion de serveur',
    description: "- Permet d'afficher le panel de configuration des salons temporaires.",
  };