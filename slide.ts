/**
 * Splits text into natural sections based on text structure.
 * Works with plain text without requiring markdown or special formatting.
 * Empty lines are treated as natural separators between parts.
 * 
 * @param text - The input text to be split into sections
 * @param maxLinesPerSlide - Maximum number of lines to include in a single slide (default: 6)
 * @returns An array of content sections
 */

import { getLyricsParts } from "./lyrics";

    const isLineTooLong = (line: string) => line.length > 40;
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
export const getSlideParts = (text?: string): string[]  => {
    if (!text) return [];
  
    // Remove text between parentheses
    const textWithoutParentheses = text.replace(/\([^)]*\)/g, '');
    const partsText = getLyricsParts(textWithoutParentheses).map((part) => part.content);

    const result: string[] = [];


    partsText.forEach((part) => {
        if (part) {
            result.push(...processContent(part));
        }
    });
  
    return result;
};