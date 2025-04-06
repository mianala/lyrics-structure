# Lyrics Parser

A TypeScript library for parsing lyrics with bracketed sections and special commands. Supports splitting text into structured parts with names and indications.

## Installation

```bash
npm install lyrics-parser
```

## Usage

```typescript
import { getLyricsParts } from 'lyrics-parser';

const lyrics = `[verse 1] (first time)
This is the first verse content
[/verse 1]

[chorus]
This is the chorus content
[/chorus]

[verse 2]
This is the second verse content
[/verse 2]`;

const parts = getLyricsParts(lyrics);
// Result: Array of LyricPart objects with name, repetition, indication, and content
```

## Features

- Extracts content from bracketed sections
- Handles section names and indications
- Supports repeated sections
- Preserves non-bracketed content
- TypeScript support

## Example Format

```text
[partname] (indication)
content
[/partname]

[another part]
more content
[/another part]
```

## License

MIT 