/**
 * Splits text into parts based on bracketed content while maintaining its structure.
 * Does not consider line length or formatting.
 * 
 * @param text - The input text to be split into parts
 * @returns An array of content strings
 */
export const getParts = (text?: string): string[] => {
    if (!text) return [];
  
    // Add validation for malformed brackets
    const bracketPairs = text.match(/\[(.*?)\]([\s\S]*?)\[\/\1\]/g) || [];
    const openBrackets = text.match(/\[[^\]]*\]/g) || [];
    
    if (bracketPairs.length * 2 !== openBrackets.length) {
        console.warn('Warning: Text contains unmatched brackets');
    }
  
    // Process parts in brackets and create a map
    const partsMap = new Map<string, string>();
    const cleanedText = text.replace(
        /\[(.*?)\]([\s\S]*?)\[\/\1\]/g,
        (match, key, content) => {
            if (!partsMap.has(key)) {
                partsMap.set(key, content.trim());
            }
            return `[${key}]`;
        },
    );
  
    const result: string[] = [];
    const parts = cleanedText
        .trim()
        .split(/\[([^\]]+)\]/)
        .filter(Boolean);
  
    parts.forEach((part) => {
        if (partsMap.has(part)) {
            // Add the stored part content
            result.push(partsMap.get(part)!);
        } else if (part.trim()) {
            // Add non-bracketed content
            result.push(part.trim());
        }
    });
  
    return result;
}

/**
 * Splits text into natural sections based on text structure.
 * Works with plain text without requiring markdown or special formatting.
 * 
 * @param text - The input text to be split into sections
 * @returns An array of content sections
 */
export const getSlideParts = (text?: string): string[] => {
    if (!text) return [];

    // Extract bracketed content first
    const basicParts = getParts(text);
    const result: string[] = [];
    
    basicParts.forEach(part => {
        // Split by natural paragraph breaks (empty lines)
        const paragraphs = part.split(/\n\s*\n/)
            .filter(p => p.trim().length > 0)
            .map(p => p.trim());
        
        // If we have multiple paragraphs, use those as natural breaks
        if (paragraphs.length > 1) {
            result.push(...paragraphs);
        } else {
            // For single large paragraphs, try to find natural sentence groups
            // This handles cases with no paragraph breaks
            const sentences = part.split(/(?<=[.!?])\s+/)
                .filter(s => s.trim().length > 0);
            
            // Group sentences into reasonable chunks
            const sentenceGroups: string[] = [];
            let currentGroup: string[] = [];
            let currentLength = 0;
            
            sentences.forEach(sentence => {
                // Natural breakpoint based on content and length
                // Group 3-5 sentences together or until we reach ~300 chars
                if (currentGroup.length >= 4 || currentLength > 250) {
                    sentenceGroups.push(currentGroup.join(' '));
                    currentGroup = [];
                    currentLength = 0;
                }
                
                currentGroup.push(sentence);
                currentLength += sentence.length;
            });
            
            // Add the last group if it exists
            if (currentGroup.length > 0) {
                sentenceGroups.push(currentGroup.join(' '));
            }
            
            // If we created multiple groups, use them
            if (sentenceGroups.length > 1) {
                result.push(...sentenceGroups);
            } else {
                // Otherwise just use the whole part
                result.push(part);
            }
        }
    });

    return result;
}