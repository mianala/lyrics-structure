/**
 * Splits text into parts based on bracketed content while maintaining its structure.
 * Does not consider line length or formatting.
 * 
 * @param text - The input text to be split into parts
 * @returns An array of content strings
 */
export const getParts = (text?: string): string[] => {
    if (!text) return [];
  
    // Process parts in brackets and create a map
    const partsMap = new Map<string, string>();
    
    // First pass: extract all content with closing tags
    const cleanedText = text.replace(
        /\[(.*?)\]([\s\S]*?)\[\/\1\]/g,
        (match, key, content) => {
            if (!partsMap.has(key)) {
                partsMap.set(key, content.trim());
            }
            return `[${key}]`;
        },
    );
    
    // Second pass: handle validation and solo tags that should reuse content
    const processedText = cleanedText.replace(
        /\[([^\]]+)\](?!\s*\[\/)(?!\s*\])/g, // Match tags that don't have a closing tag after them
        (match, key) => {
            if (partsMap.has(key)) {
                return match; // Keep the reference if we already have content for this key
            } else {
                console.warn(`Warning: Tag [${key}] has no content and was not previously defined`);
                return ''; // Remove invalid tags
            }
        }
    );
  
    const result: string[] = [];
    const parts = processedText
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
 * Empty lines are treated as natural separators between parts.
 * 
 * @param text - The input text to be split into sections
 * @param maxLinesPerSlide - Maximum number of lines to include in a single slide (default: 6)
 * @returns An array of content sections
 */
export const getSlideParts = (text?: string, maxLinesPerSlide: number = 6): string[] => {
    if (!text) return [];

    // First split by empty lines to respect user-defined separations
    const paragraphBlocks = text.split(/\n\s*\n/)
        .filter(block => block.trim().length > 0)
        .map(block => block.trim());
    
    const result: string[] = [];
    
    // Process each paragraph block separately
    paragraphBlocks.forEach(block => {
        // Process bracketed content within each block
        const blockParts = getParts(block);
        
        blockParts.forEach(part => {
            // Check if content has line breaks that should be respected
            const lines = part.split('\n').filter(line => line.trim().length > 0);
            
            // If we have multiple lines and more than maxLinesPerSlide, create slides based on line count
            if (lines.length > 1) {
                if (lines.length > maxLinesPerSlide) {
                    // Break into multiple slides based on maxLinesPerSlide
                    let currentSlide: string[] = [];
                    
                    lines.forEach(line => {
                        if (currentSlide.length >= maxLinesPerSlide) {
                            result.push(currentSlide.join('\n'));
                            currentSlide = [];
                        }
                        currentSlide.push(line);
                    });
                    
                    // Add the final slide if it exists
                    if (currentSlide.length > 0) {
                        result.push(currentSlide.join('\n'));
                    }
                } else {
                    // Just use the whole part as a single slide
                    result.push(part);
                }
            } else {
                // For single large paragraphs (no line breaks), try to find natural sentence groups
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
    });

    return result;
}