


/**
 * Splits text into natural sections based on text structure.
 * Works with plain text without requiring markdown or special formatting.
 * Empty lines are treated as natural separators between parts.
 * 
 * @param text - The input text to be split into sections
 * @param maxLinesPerSlide - Maximum number of lines to include in a single slide (default: 6)
 * @returns An array of content sections
 */

export const getSlideParts = (text?: string): string[]  => {
    if (!text) return [];
  
    const isLineTooLong = (line: string) => line.length > 40;
  
    // Process parts in brackets and create a map
    const partsMap = new Map<string, string>();
    
    // First pass: extract all content with closing tags
    const cleanedText = text.replace(
        /\[(.*?)\]([\s\S]*?)\[\/\1\]/g,
        (match, key: string, content) => {
            if (!partsMap.has(key)) {
                partsMap.set(key, content.trim());
            }
            return `[${key}]`;
        }
    );

    // Handle special command tags
    const processedText = cleanedText.replace(
        /\[!([^\]]+)\]/g,
        (match, command) => {
            // Store the command in the parts map with a special prefix
            const key = `!${command}`;
            if (!partsMap.has(key)) {
                partsMap.set(key, command);
            }
            return `[${key}]`;
        }
    );
  
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
                currentSlide.length >= 4 ||
                (currentSlide.length >= 2 &&
                currentSlide.filter(isLineTooLong).length >= 2)
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
  
    const result: string[] = [];
    const parts = processedText
        .trim()
        .split(/\[([^\]]+)\]/)
        .filter(Boolean);
  
    parts.forEach((part) => {
        if (partsMap.has(part)) {
            const partContent = partsMap.get(part)!;
            result.push(...processContent(partContent));
        } else if (part.trim()) {
            result.push(...processContent(part));
        }
    });
  
    return result;
};