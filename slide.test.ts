import { getSlideParts } from './slide.js';

describe('Comprehensive Tests', () => {
    test('handles all cases in one comprehensive input', () => {
        const comprehensiveInput = `
[verse]
First line of verse
Second line of verse
Third line of verse
Fourth line of verse
Fifth line of verse
[/verse]
[verse]
(inside parentheses)
Regular text line 1
Regular text line 2

[chorus]
First chorus line
Second chorus line
[/chorus]

[verse 1]
This is a very long line that should be considered too long for the slide
This is another very long line that should also be considered too long
Short line 1
Short line 2
[/verse 1]

Regular line 1
Regular line 2

More content

This is a very long line that exceeds forty characters for testing purposes
This is another very long line that also exceeds the forty character limit
Another very long line that should be considered too long for the slide
And yet another very long line that should be split into a new section
Regular line

[verse 2]
    First line with spaces
  Second line with spaces
[/verse 2]

[chorus]`;

        expect(getSlideParts(comprehensiveInput)).toEqual([
            'First line of verse\nSecond line of verse\nThird line of verse\nFourth line of verse',
            'Fifth line of verse',
            'First line of verse\nSecond line of verse\nThird line of verse\nFourth line of verse',
            'Fifth line of verse',
            '(inside parentheses)\nRegular text line 1\nRegular text line 2',
            'First chorus line\nSecond chorus line',
            'This is a very long line that should be considered too long for the slide\nThis is another very long line that should also be considered too long',
            'Short line 1\nShort line 2',
            'Regular line 1\nRegular line 2',
            'More content',
            'This is a very long line that exceeds forty characters for testing purposes\nThis is another very long line that also exceeds the forty character limit',
            'Another very long line that should be considered too long for the slide\nAnd yet another very long line that should be split into a new section',
            'Regular line',
            'First line with spaces\nSecond line with spaces',
            'First chorus line\nSecond chorus line'
        ]);
    });

});

describe('maxLines parameter', () => {
    const input = `
[verse]
Line one
Line two
Line three
Line four
Line five
[/verse]`;

    test('maxLines=1 outputs one line per slide', () => {
        expect(getSlideParts(input, 1)).toEqual([
            'Line one',
            'Line two',
            'Line three',
            'Line four',
            'Line five',
        ]);
    });

    test('maxLines=2 outputs at most two lines per slide', () => {
        expect(getSlideParts(input, 2)).toEqual([
            'Line one\nLine two',
            'Line three\nLine four',
            'Line five',
        ]);
    });

    test('default maxLines (4) groups up to four lines', () => {
        expect(getSlideParts(input)).toEqual([
            'Line one\nLine two\nLine three\nLine four',
            'Line five',
        ]);
    });

    test('maxLines=2 still splits on empty lines', () => {
        const inputWithGap = `
[verse]
Line one
Line two

Line three
Line four
Line five
[/verse]`;

        expect(getSlideParts(inputWithGap, 2)).toEqual([
            'Line one\nLine two',
            'Line three\nLine four',
            'Line five',
        ]);
    });

    test('maxLines=2 with long lines still breaks at 2 long lines', () => {
        const inputWithLongLines = `
[verse]
This is a very long line that should be considered too long for the slide
This is another very long line that should also be considered too long
Short line
[/verse]`;

        expect(getSlideParts(inputWithLongLines, 2)).toEqual([
            'This is a very long line that should be considered too long for the slide\nThis is another very long line that should also be considered too long',
            'Short line',
        ]);
    });
}); 