const fs = require("fs");
const chalk = require("chalk");
// colors
const error = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.bold.cyan
const warning = chalk.bold.yellow;
//
/**
 * Load Events
 */
const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./events");
    for (const folder of eventFolders) {
        const eventFiles = fs
            .readdirSync(`./events/${folder}`)
            .filter((file) => file.endsWith(".js"));

        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);

            if (event.name) {
                console.log(info("[LOG]") + ` ✔️  => [ Event ] ${file} is being loaded `);
            } else {
                console.log(warning("[LOG]") + ` ❌  => [ Event ] ${file} missing a help.name or help.name is not in string `);
                continue;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

/**
 * Load Prefix Commands
 */
const loadCommands = async function (client) {
    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`./commands/${folder}`)
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);

            if (command.name) {
                client.commands.set(command.name, command);
                console.log(success("[LOG]") + ` ✔️  => [ Prefix ] ${file} is being loaded `);
            } else {
                console.log(warning("[LOG]"), ` ❌  => Prefix Command ${file} missing a help.name or help.name is not in string `);
                continue;
            }

            if (command.aliases && Array.isArray(command))
                command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
        }
    }
}

/**
 * Load SlashCommands
 */
const loadSlashCommands = async function (client) {
    let slash = []

    const commandFolders = fs.readdirSync("./slashCommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`./slashCommands/${folder}`)
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`../slashCommands/${folder}/${file}`);

            if (command.name) {
                client.slash.set(command.name, command);
                slash.push(command)
                console.log(success("[LOG]") + ` ✔️  => [Slash Command] ${file} is being loaded `);
            } else {
                console.log(warning("[LOG]") + ` ❌  => [Slash Command] ${file} missing a help.name or help.name is not in string `);
                continue;
            }
        }
    }

    client.on("ready", async () => {
        // Register Slash Commands for a single guild
        // await client.guilds.cache
        //    .get("YOUR_GUILD_ID")
        //    .commands.set(slash);

        // Register Slash Commands for all the guilds
        await client.application.commands.set(slash)
    })
}

module.exports = {
    loadEvents,
    loadCommands,
    loadSlashCommands
}
