const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");

const download = (uri, filename, callback) => {
    const pokemonPath = path.join(__dirname, "pokemon", filename);
    request(uri).pipe(fs.createWriteStream(pokemonPath)).on("close", callback);
};


const pokemon1 = "http://www.giantbomb.com/profile/wakka/lists/the-150-original-pokemon/59579/?page=1";
const pokemon2 = "http://www.giantbomb.com/profile/wakka/lists/the-150-original-pokemon/59579/?page=2";

let allPokemon = [];

request(pokemon1, (error, response, body) => {
    if (error || response.statusCode !== 200) {
        throw new Error("Error reaching pokemon site");
    }
    
    const $ = cheerio.load(body);

    const pokemonImgs = Array.from($(".img.imgboxart").map((idx, div) => {
        return $(div).find("img").attr("src");
    }));
    
    allPokemon = allPokemon.concat(pokemonImgs);

    request(pokemon2, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            throw new Error("Error reaching pokemon site");
        }
        
        const $ = cheerio.load(body);

        const pokemonImgs = Array.from($(".img.imgboxart").map((idx, div) => {
            return $(div).find("img").attr("src");
        }));

        allPokemon = allPokemon.concat(pokemonImgs);

        allPokemon.forEach((pokemonUrl) => {
            const pokemonName = pokemonUrl.split("-")[1];
            download(pokemonUrl, pokemonName, () => console.log(pokemonName));
        });
    });
});

