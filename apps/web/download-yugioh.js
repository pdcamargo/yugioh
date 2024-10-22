const path = require("path");

const fs = require("fs");
const fsPromise = require("fs/promises");
const https = require("https");

const dest = path.resolve(process.cwd(), "public");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function artToLocalPath(art) {
  return art.replace("https://images.ygoprodeck.com", "");
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

async function downloadYugiohProDatabase() {
  const api = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

  const response = await fetch(api);
  const data = await response.json();

  const keysToDelete = ["ygoprodeck_url", "card_prices"];

  const cards = data.data.map((card) => {
    keysToDelete.forEach((key) => {
      delete card[key];
    });

    return card;
  });

  // replace all image urls with local paths
  cards.forEach((card) => {
    const { card_images } = card;

    card_images.forEach((image) => {
      image.image_url = artToLocalPath(image.image_url);
      image.image_url_cropped = artToLocalPath(image.image_url_cropped);

      delete image.image_url_small;
    });
  });

  const cardsPath = path.resolve(dest, "cards.json");

  await fsPromise.writeFile(cardsPath, JSON.stringify(cards, null, 2));

  console.log(`Saved cards to ${cardsPath}`);
}

downloadYugiohProDatabase();
