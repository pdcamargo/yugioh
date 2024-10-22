const fs = require("fs");
const path = require("path");

const cardPath = "./cards.json";

async function readCards() {
  try {
    const card = await fs.promises.readFile(
      path.resolve(process.cwd(), cardPath),
      "utf-8",
    );
    return JSON.parse(card);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function saveCards(cards, newPath) {
  try {
    await fs.promises.writeFile(
      path.resolve(process.cwd(), newPath),
      JSON.stringify(cards, null, 2),
    );
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  const card = await readCards();

  card.forEach((card) => {
    delete card.card_sets;

    card["cardImages"] = card.card_images;

    delete card.card_images;

    card.cardImages.forEach((cardImage) => {
      cardImage["imageUrl"] = cardImage.image_url;
      cardImage["imageUrlCropped"] = cardImage.image_url_cropped;

      delete cardImage.image_url;
      delete cardImage.image_url_cropped;
    });
  });

  saveCards(card, "./cards2.json").then(() => {
    console.log("Cards saved!");
  });
}

main();
