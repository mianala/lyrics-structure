# Lyrics Structure

A utility library for structuring and formatting song lyrics and text content.

## Features

- Split text into natural sections based on structure
- Process bracketed content while maintaining structure
- Intelligent text segmentation for readability

## Usage

```typescript
import { getParts, getSlideParts } from 'lyrics-structure';

// Split text into parts based on bracketed content
const parts = getParts(text);

// Split text into natural sections for presentation
const slideParts = getSlideParts(text, maxLinesPerSlide);
```

## Implementation

This library is used in the Stage app ([stage.loha.dev](https://stage.loha.dev)) for lyrics display and presentation.

## Installation

```bash
npm install lyrics-structure
```

## License

ISC 