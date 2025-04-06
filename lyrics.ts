export type LyricPart = {
  name: string | undefined;
  repetition: boolean;
  indication: string | null;
  content: string | undefined;
};
/**
 * Splits lyrics into structured parts, handling named sections, repetitions, and indications.
 * Works with lyrics formatted using square brackets for section names and optional parentheses for indications.
 *
 * Example input:
 * ```
 * [verse 1] (first time)
 * Lyrics content here
 * [/verse 1]
 *
 * [chorus]
 * Chorus lyrics
 * [/chorus]
 * ```
 *
 * @param lyrics - The input lyrics text to be parsed into parts
 * @returns Array of LyricPart objects containing structured lyrics data
 */

export function getLyricsParts(lyrics: string): LyricPart[] {
  const parts: LyricPart[] = [];
  const seenParts = new Map<string, number>();
  const partContentMap = new Map<string, string>();

  // First pass: extract all content with closing tags
  const cleanedText = lyrics.replace(
    /\[([^\]]+)\](?:\s*\(([^)]+)\))?\s*([\s\S]*?)\[\/\1\]/g,
    (match, key: string, indication: string | undefined, content: string) => {
      if (!partContentMap.has(key)) {
        partContentMap.set(key, content.trim());
      }
      return `[${key}]${indication ? ` (${indication})` : ''}`;
    }
  );

  // Split the lyrics into lines and process them
  const lines = cleanedText.split('\n');
  let currentPart: LyricPart | null = null;
  let currentUnnamedContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for part start
    const partStartMatch = line.match(/^\[([^\]]+)\](?:\s*\(([^)]+)\))?$/);
    if (partStartMatch) {
      // If we have accumulated unnamed content, add it as a part
      if (currentUnnamedContent.length > 0) {
        parts.push({
          name: undefined,
          repetition: false,
          indication: null,
          content: currentUnnamedContent.join('\n'),
        });
        currentUnnamedContent = [];
      }

      const partName = partStartMatch[1];
      const indication = partStartMatch[2] || null;

      // Check if this part has been seen before
      const partCount = (seenParts.get(partName) || 0) + 1;
      seenParts.set(partName, partCount);

      currentPart = {
        name: partName,
        repetition: partCount > 1,
        indication,
        content: partContentMap.get(partName),
      };
      parts.push(currentPart);
      continue;
    }

    // Handle content without a part container
    if (line && !line.startsWith('[') && !line.startsWith('[/')) {
      currentUnnamedContent.push(line);
    } else if (currentUnnamedContent.length > 0) {
      // If we hit a part marker or empty line, add the accumulated content
      parts.push({
        name: undefined,
        repetition: false,
        indication: null,
        content: currentUnnamedContent.join('\n'),
      });
      currentUnnamedContent = [];
    }
  }

  // Add any remaining unnamed content
  if (currentUnnamedContent.length > 0) {
    parts.push({
      name: undefined,
      repetition: false,
      indication: null,
      content: currentUnnamedContent.join('\n'),
    });
  }

  return parts;
}
