import Artibot, { Command, Module, TriggerGroup } from "artibot";
import Localizer from "artibot-localizer";
import { Message } from "discord.js";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

/**
 * Meme module for Artibot
 * @author GoudronViande24
 * @license MIT
 */
export default ({ config: { lang } }: Artibot): Module => {
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
		packageName: "artibot-meme",
		parts: [
			new TriggerGroup({
				id: "69",
				triggers: [" 69 "],
				mainFunction: async (message): Promise<void> => {
					await message.reply({ content: "Nice" });
				}
			}),

			new TriggerGroup({
				id: "sus",
				triggers: ["sus "],
				mainFunction: async (message) => {
					await message.reply({ content: "ඞ" });
				}
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

/** Dad joke command */
async function dadJoke(message: Message, args: string[], { createEmbed, version }: Artibot): Promise<void> {
	const reponse = await axios({
		method: "GET",
		url: "https://icanhazdadjoke.com/",
		headers: {
			"User-Agent": "Artibot " + version,
			"Accept": "application/json"
		}
	});
	const joke = reponse.data.joke;

	const embed = createEmbed()
		.setTitle(localizer._("Dad joke"))
		.setDescription(joke);

	await message.reply({
		embeds: [embed]
	});
}

/** Chuck norris command */
async function chuckNorris(message: Message, args: string[], { log, createEmbed }: Artibot): Promise<void> {
	const response = await axios({
		method: "GET",
		url: "https://api.chucknorris.io/jokes/random",
		headers: {
			"User-Agent": "Artibot " + version,
			"Accept": "application/json"
		}
	});

	const embed = createEmbed()
		.setTitle(localizer._("Chuck Norris joke"))
		.setDescription(response.data.value)
		.setThumbnail(response.data.icon_url);

	await message.reply({
		embeds: [embed]
	});
}