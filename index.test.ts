import { getParts, getSlideParts } from './index.js';

describe('getParts', () => {
    test('handles empty or undefined input', () => {
        expect(getParts()).toEqual([]);
        expect(getParts('')).toEqual([]);
    });

    test('extracts simple bracketed content', () => {
        const input = '[verse]This is verse content[/verse]';
        expect(getParts(input)).toEqual(['This is verse content']);
    });

    test('handles multiple bracketed sections', () => {
        const input = `[verse]Verse content[/verse]
[chorus]Chorus content[/chorus]`;
        expect(getParts(input)).toEqual([
            'Verse content',
            'Chorus content'
        ]);
    });

    test('handles repeated sections', () => {
        const input = `[chorus]The chorus[/chorus]
[verse]The verse[/verse]
[chorus]`;
        expect(getParts(input)).toEqual([
            'The chorus',
            'The verse',
            'The chorus'
        ]);
    });

    test('preserves non-bracketed content', () => {
        const input = `Regular line
[verse]Verse content[/verse]
Another regular line`;
        expect(getParts(input)).toEqual([
            'Regular line',
            'Verse content',
            'Another regular line'
        ]);
    });

});

describe('getSlideParts', () => {
    test('handles empty or undefined input', () => {
        expect(getSlideParts()).toEqual([]);
        expect(getSlideParts('')).toEqual([]);
    });

    test('splits content based on line count', () => {
        const input = `Line 1
Line 2
Line 3
Line 4
Line 5`;
        expect(getSlideParts(input)).toEqual([
            'Line 1\nLine 2\nLine 3\nLine 4',
            'Line 5'
        ]);
    });

    test('splits on empty lines', () => {
        const input = `Line 1
Line 2

Line 3
Line 4`;
        expect(getSlideParts(input)).toEqual([
            'Line 1\nLine 2',
            'Line 3\nLine 4'
        ]);
    });

    test('handles long lines', () => {
        const input = `This is a very long line that exceeds forty characters for testing
This is another very long line that also exceeds forty characters
Short line
Another short line`;
        expect(getSlideParts(input)).toEqual([
            'This is a very long line that exceeds forty characters for testing\nThis is another very long line that also exceeds forty characters',
            'Short line\nAnother short line'
        ]);
    });

    test('processes bracketed content with proper splitting', () => {
        const input = `[verse]
First line of verse
Second line of verse
Third line of verse
Fourth line of verse
Fifth line of verse
[/verse]`;
        expect(getSlideParts(input)).toEqual([
            'First line of verse\nSecond line of verse\nThird line of verse\nFourth line of verse',
            'Fifth line of verse'
        ]);
    });

    test('handles repeated sections with proper splitting', () => {
        const input = `[chorus]
First chorus line
Second chorus line
[/chorus]

[verse]
Verse line 1
Verse line 2
[/verse]

[chorus]`;
        expect(getSlideParts(input)).toEqual([
            'First chorus line\nSecond chorus line',
            'Verse line 1\nVerse line 2',
            'First chorus line\nSecond chorus line'
        ]);
    });

    test('handles mixed content types', () => {
        const input = `Regular text line 1
Regular text line 2

[verse]
Verse line 1
Verse line 2
[/verse]

More regular text`;
        expect(getSlideParts(input)).toEqual([
            'Regular text line 1\nRegular text line 2',
            'Verse line 1\nVerse line 2',
            'More regular text'
        ]);
    });

    test('handles long lines in bracketed content', () => {
        const input = `[verse]
This is a very long line that should be considered too long for the slide
This is another very long line that should also be considered too long
Short line 1
Short line 2
[/verse]`;
        expect(getSlideParts(input)).toEqual([
            'This is a very long line that should be considered too long for the slide\nThis is another very long line that should also be considered too long',
            'Short line 1\nShort line 2'
        ]);
    });

    test('preserves whitespace within lines but trims line endings', () => {
        const input = `[verse]
    First line with spaces    
  Second line with spaces  
[/verse]`;
        expect(getSlideParts(input)).toEqual([
            'First line with spaces\nSecond line with spaces'
        ]);
    });

    test('handles special command tags', () => {
        const input = `[!section1]
Regular line 1
Regular line 2

[!section2]
More content`;
        expect(getSlideParts(input)).toEqual([
            'section1','Regular line 1\nRegular line 2',
            'section2','More content'
        ]);
    });

    test('handles special bracket', () => {
        expect(getSlideParts('[!instrumental]')).toEqual(['instrumental']);
    });

    test('handles special bracket with text', () => {
        expect(getSlideParts('[!🎸🎹🎺]Hello, world!')).toEqual(['🎸🎹🎺','Hello, world!']);
    });

    test('handles special command tags with long lines', () => {
        const input = `This is a very long line that exceeds forty characters for testing purposes
This is another very long line that also exceeds the forty character limit
Another very long line that should be considered too long for the slide
And yet another very long line that should be split into a new section
Regular line`;
        expect(getSlideParts(input)).toEqual([
            'This is a very long line that exceeds forty characters for testing purposes\nThis is another very long line that also exceeds the forty character limit',
            'Another very long line that should be considered too long for the slide\nAnd yet another very long line that should be split into a new section',
            'Regular line'
        ]);
    });
});

describe('getParts additional cases', () => {
    test('handles just text', () => {
        expect(getParts('Hello, world!')).toEqual(['Hello, world!']);
    });

    test('handles just bracket', () => {
        expect(getParts('[verse1] Hello, world!')).toEqual(['Hello, world!']);
    });

    test('handles open and closing brackets', () => {
        expect(getParts('[verse 1]Hello, world![/verse 1]')).toEqual(['Hello, world!']);
    });

    test('handles open and closing brackets with repetition', () => {
        const input = '[verse 1]Hello, world![/verse 1] [verse 1]';
        expect(getParts(input)).toEqual(['Hello, world!', 'Hello, world!']);
    });

}); 