export function countWords(text: string): number {
  return splitIntoWords(text).length;
}

export function justifyText(text: string, width: number): string {
  assertValidWidth(width);

  const paragraphs = splitIntoParagraphs(text);

  return paragraphs
    .map((paragraph) => justifyParagraph(paragraph, width))
    .join("\n");
}

function justifyParagraph(paragraph: string, width: number): string {
  const words = splitIntoWords(paragraph).flatMap((word) =>
    splitLongWord(word, width),
  );

  if (words.length === 0) {
    return "";
  }

  const lines: string[] = [];
  let currentWords: string[] = [];
  let currentLettersLength = 0;

  for (const word of words) {
    const minimumLengthWithWord =
      currentLettersLength + word.length + currentWords.length;

    if (currentWords.length > 0 && minimumLengthWithWord > width) {
      lines.push(justifyLine(currentWords, currentLettersLength, width));
      currentWords = [];
      currentLettersLength = 0;
    }

    currentWords.push(word);
    currentLettersLength += word.length;
  }

  if (currentWords.length > 0) {
    lines.push(currentWords.join(" "));
  }

  return lines.join("\n");
}

function justifyLine(
  words: readonly string[],
  lettersLength: number,
  width: number,
): string {
  if (words.length === 1) {
    return words[0] ?? "";
  }

  const spacesToDistribute = width - lettersLength;
  const gapCount = words.length - 1;
  const minimumSpacesPerGap = Math.floor(spacesToDistribute / gapCount);
  let extraSpaces = spacesToDistribute % gapCount;

  return words.reduce((line, word, index) => {
    if (index === 0) {
      return word;
    }

    const spaces =
      minimumSpacesPerGap + (extraSpaces > 0 ? 1 : 0);
    extraSpaces = Math.max(0, extraSpaces - 1);

    return `${line}${" ".repeat(spaces)}${word}`;
  }, "");
}

function splitIntoParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.replace(/\s+/gu, " ").trim())
    .filter((paragraph) => paragraph.length > 0);
}

function splitIntoWords(text: string): string[] {
  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    return [];
  }

  return trimmedText.split(/\s+/u);
}

function splitLongWord(word: string, width: number): string[] {
  if (word.length <= width) {
    return [word];
  }

  const chunks: string[] = [];

  for (let index = 0; index < word.length; index += width) {
    chunks.push(word.slice(index, index + width));
  }

  return chunks;
}

function assertValidWidth(width: number): void {
  if (!Number.isInteger(width) || width <= 0) {
    throw new Error("Line width must be a positive integer.");
  }
}
