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

// Add these at the top of the file
const MAX_LINE_LENGTH = 40;
const MAX_SLIDES_PER_SECTION = 4;
const MIN_LONG_LINES_THRESHOLD = 2;

/**
 * Splits text into paragraphs based on content length and formatting rules.
 * Uses getParts to handle bracketed content and then applies additional formatting.
 * 
 * @param text - The input text to be split into paragraphs
 * @returns An array of paragraph strings
 */
export const getSlideParts = (text?: string): string[] => {
    if (!text) return [];

    const isLineTooLong = (line: string): boolean => line.length > MAX_LINE_LENGTH;

    const processContent = (content: string): string[] => {
        const slides: string[] = [];
        let currentSlide: string[] = [];
    
        content.split("\n").forEach((line) => {
            const trimmedLine = line.trim();
    
            if (!trimmedLine) {
                if (currentSlide.length > 0) {
                    slides.push(currentSlide.join("\n"));
                    currentSlide = [];
                }
                return;
            }
    
            if (
                currentSlide.length >= MAX_SLIDES_PER_SECTION ||
                (currentSlide.length >= MIN_LONG_LINES_THRESHOLD &&
                currentSlide.filter(isLineTooLong).length >= MIN_LONG_LINES_THRESHOLD)
            ) {
                slides.push(currentSlide.join("\n"));
                currentSlide = [];
            }
    
            currentSlide.push(trimmedLine);
        });
    
        if (currentSlide.length > 0) {
            slides.push(currentSlide.join("\n"));
        }
    
        return slides;
    };

    // Get the basic parts first
    const basicParts = getParts(text);
    
    // Process each part according to the slide rules
    const result: string[] = [];
    basicParts.forEach(part => {
        result.push(...processContent(part));
    });

    return result;
}