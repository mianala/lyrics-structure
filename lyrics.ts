export type LyricPart = {
    name: string | undefined;
    repetition: boolean;
    indication: string | null;
    content: string | undefined;
};

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

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check for part start
        const partStartMatch = line.match(/^\[([^\]]+)\](?:\s*\(([^)]+)\))?$/);
        if (partStartMatch) {
            const partName = partStartMatch[1];
            const indication = partStartMatch[2] || null;
            
            // Check if this part has been seen before
            const partCount = (seenParts.get(partName) || 0) + 1;
            seenParts.set(partName, partCount);

            currentPart = {
                name: partName,
                repetition: partCount > 1,
                indication,
                content: partContentMap.get(partName)
            };
            parts.push(currentPart);
            continue;
        }

        // Handle content without a part container
        if (line && !line.startsWith('[') && !line.startsWith('[/')) {
            parts.push({
                name: undefined,
                repetition: false,
                indication: null,
                content: line
            });
        }
    }

    return parts;
} 