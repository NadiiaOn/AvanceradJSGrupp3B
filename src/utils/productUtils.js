export function getCategories(products) {
  return [...new Set(products.map((c) => c.category))];
}

export function stringFormat(category) {
  const formattedWords = category.split("-").map((word) => {
    const firstLetter = word[0].toUpperCase();
    const restOfWord = word.slice(1);
    return firstLetter + restOfWord;
  });

  return formattedWords.join(" ");
}
