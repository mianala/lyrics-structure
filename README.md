# lyrics-structure

A TypeScript library for parsing lyrics with bracketed sections into structured parts, with built-in slide generation for presentations.

## Installation

```bash
npm install lyrics-structure
```

## Usage

### Parsing Lyrics into Structured Parts

```typescript
import { getLyricsParts } from 'lyrics-structure';

const lyrics = `[verse 1] (first time)
This is the first verse
[/verse 1]

[chorus]
This is the chorus
[/chorus]

[verse 1] (second time)
[/verse 1]`;

const parts = getLyricsParts(lyrics);
```

Result:

```typescript
[
  { name: "verse 1", repetition: false, indication: "first time", content: "This is the first verse" },
  { name: "chorus", repetition: false, indication: null, content: "This is the chorus" },
  { name: "verse 1", repetition: true, indication: "second time", content: "This is the first verse" }
]
```

Repeated sections automatically carry forward the content from their first occurrence.

### Generating Slides

```typescript
import { getSlideParts } from 'lyrics-structure';

const slides = getSlideParts(lyrics);       // default: 4 lines per slide
const slides2 = getSlideParts(lyrics, 2);   // custom: 2 lines per slide
```

Each slide is a string. The function splits content at:

- The configured `maxLines` limit (default 4)
- Empty lines (natural paragraph breaks)
- When 2+ lines in a slide exceed 60 characters

## API

### `getLyricsParts(lyrics: string): LyricPart[]`

Parses raw lyrics text into an array of structured parts.

**Section format:**

```text
[section name] (optional indication)
content lines
[/section name]
```

- Sections are delimited by `[name]` and `[/name]` brackets
- Indications are optional parenthesized text after the opening bracket: `[verse] (softly)`
- Repeated section names are flagged with `repetition: true` and inherit content from the first occurrence
- Text outside any brackets is captured as unnamed parts

### `getSlideParts(text?: string, maxLines?: number): string[]`

Splits lyrics into presentation-ready slide strings.

| Parameter  | Type     | Default | Description                        |
|------------|----------|---------|------------------------------------|
| `text`     | `string` | —       | Raw lyrics text                    |
| `maxLines` | `number` | `4`     | Maximum number of lines per slide  |

Returns an empty array if `text` is `undefined` or `null`.

### `LyricPart`

```typescript
type LyricPart = {
  name: string | undefined;       // section name, undefined for unbracketed content
  repetition: boolean;            // true if this section name appeared earlier
  indication: string | null;      // parenthesized text, e.g. "(softly)"
  content: string | undefined;    // the lyrics text of the section
};
```

## Features

- Parse bracketed lyric sections into structured data
- Automatic repetition detection across sections
- Optional per-section indications/annotations
- Preserve content outside of bracketed sections
- Slide generation with configurable line limits
- Smart slide breaking on empty lines and long lines
- Full TypeScript type support

## License

MIT
