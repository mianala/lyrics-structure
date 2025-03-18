# Lyrics Structure

A utility library for structuring and formatting song lyrics and text content.

## Features

- Split text into natural sections based on structure
- Process bracketed content while maintaining structure
- Intelligent text segmentation for readability
- Efficient handling of repeated sections with simple tag references

## Usage

```typescript
import { getParts, getSlideParts } from 'lyrics-structure';

// Split text into parts based on bracketed content
const parts = getParts(text);

// Split text into natural sections for presentation
const slideParts = getSlideParts(text, maxLinesPerSlide);
```

## Bracketed Content Format

When structuring your lyrics or text content:
- Define a section with both opening and closing tags: `[section]content[/section]`
- For repeated sections, simply use the tag name again: `[section]`
- The library will automatically reuse the content from the first definition

This approach eliminates redundancy and makes lyric management much simpler, especially for songs with repeated choruses or sections.

## Example

```typescript
// Example with bracketed content
const lyrics = `[verse1]
Morning light breaks through my window
Another day to find my way
The journey starts with just one step
I'm moving forward, come what may
[/verse1]

[chorus]
This is the moment, this is the time
Hearts united, rhythm and rhyme
Together we rise, together we stand
Voices in harmony across the land
[/chorus]

[verse2]
Challenges come and challenges go
But strength inside continues to grow
With every obstacle that I face
I find my courage, I find my place
[/verse2]

[chorus]`;

// Get the individual parts (verses and chorus)
const parts = getParts(lyrics);
console.log(parts);
// Output will be an array with the content of verse1, chorus, verse2, and chorus again
// Note that [chorus] is referenced twice but only defined once

// Get slide-friendly sections
const slides = getSlideParts(lyrics, 4);
console.log(slides);
// Output will break the content into slide-sized chunks with at most 4 lines each
```

## Implementation

This library is used in the Stage app ([stage.loha.dev](https://stage.loha.dev)) for lyrics display and presentation.

## Installation

```bash
npm install lyrics-structure
```

## License

ISC 