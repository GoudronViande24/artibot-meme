import Artibot, { Command, Module, TriggerGroup } from "artibot";
import Localizer from "artibot-localizer";
import { Message } from "discord.js";
import https from "https";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

/**
 * Meme module for Artibot
 * @author GoudronViande24
 * @license MIT
 * @param {Artibot} artibot
 * @returns {Module}
 */
export default ({ config: { lang } }) => {
	localizer.setLocale(lang);

	return new Module({
		id: "meme",
		name: "Meme",
		version,
		langs: [
			"fr",
			"en"
		],
		repo: "GoudronViande24/artibot-meme",
		parts: [
			new TriggerGroup({
				id: "69",
				triggers: [" 69 "],
				mainFunction: (message) => message.reply({ content: "Nice" })
			}),

			new TriggerGroup({
				id: "sus",
				triggers: ["sus "],
				mainFunction: (message) => message.reply({ content: "ඞ" })
			}),

			new Command({
				id: "chucknorris",
				name: "chucknorris",
				description: localizer._("Tells a Chuck Norris joke."),
				aliases: ["cn"],
				mainFunction: chuckNorris
			}),

			new Command({
				id: "dadjoke",
				name: "dadjoke",
				description: localizer._("Tells a dad joke."),
				mainFunction: dadJoke
			})
		]
	});
}

const localizer = new Localizer({
	filePath: path.join(__dirname, "locales.json")
});

/**
 * Dad joke command
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Artibot} artibot 
 */
function dadJoke(message, args, { createEmbed }) {
	const reponse = await axios(options);
	const joke = reponse.data.joke;

	let embed = createEmbed()
		.setTitle(localizer._("Dad joke"))
		.setDescription(joke);

	await message.reply({
		embeds: [embed]
	});
}

/**
 * Chuck norris command
 * @param {Message} message 
 * @param {string[]} args 
 * @param {Artibot} artibot 
 */
function chuckNorris(message, args, { log, createEmbed }) {
	const options = {
		hostname: 'api.chucknorris.io',
		port: 443,
		path: '/jokes/random',
		method: 'GET'
	};

	const req = https.request(options, res => {
		res.on('data', data => {
			let embed = createEmbed()
				.setTitle(localizer._("Chuck Norris joke"))
				.setDescription(JSON.parse(data).value)
				.setThumbnail(JSON.parse(data).icon_url);

			message.reply({
				embeds: [embed]
			});
		});
	});

	req.on('error', error => {
		message.reply(localizer._("An error occured while executing this command."));
		log("Meme", error);
	});

	req.end();
}