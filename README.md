# Lyrics Parser

A TypeScript library for parsing lyrics with bracketed sections and special commands. Supports splitting text into slides and handling special command tags.

## Installation

```bash
npm install lyrics-parser
```

## Usage

```typescript
import { getParts, getSlideParts } from 'lyrics-parser';

// Basic usage with bracketed sections
const lyrics = `[verse]First verse content[/verse]
[chorus]Chorus content[/chorus]
[verse]Second verse content[/verse]`;

const parts = getParts(lyrics);
// Result: ['First verse content', 'Chorus content', 'Second verse content']

// Using special command tags
const withCommands = `[!section1]
First section content

[!section2]
Second section content`;

const slides = getSlideParts(withCommands);
// Result: ['section1', 'First section content', 'section2', 'Second section content']
```

## Features

### getParts
- Extracts content from bracketed sections
- Handles repeated sections
- Supports special command tags
- Preserves non-bracketed content

### getSlideParts
- Splits content into natural sections
- Handles long lines (>40 characters)
- Splits on empty lines
- Maximum 4 lines per slide
- Supports special command tags
- Preserves whitespace within lines

## Test Cases

The library includes comprehensive tests for various scenarios:

1. Basic Functionality
   - Empty/undefined input handling
   - Simple bracketed content
   - Multiple sections
   - Repeated sections
   - Non-bracketed content

2. Slide Splitting
   - Line count based splits
   - Empty line separation
   - Long line handling
   - Mixed content types
   - Whitespace preservation

3. Special Commands
   - Basic command tags
   - Commands with following text
   - Commands with long content
   - Unicode command tags

4. Edge Cases
   - Single line content
   - Missing closing tags
   - Invalid tags
   - Nested tags

## License

MIT 