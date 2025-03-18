import * as assert from 'assert';
import { getParts, getSlideParts } from './index';

// Test data
const lyricsSample = `
[verse1]
I still hear your voice when you sleep next to me
I still feel your touch in my dreams
Forgive me my weakness, but I don't know why
Without you it's hard to survive
[/verse1]

[chorus]
'Cause every time we touch, I get this feeling
And every time we kiss, I swear I could fly
Can't you feel my heart beat fast?
I want this to last
Need you by my side
[/chorus]

[verse2]
Your arms are my castle, your heart is my sky
They wipe away tears that I cry
The good and the bad times, we've been through them all
You make me rise when I fall
[/verse2]

[chorus]
`;

const bibleSample = `
In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.

And God said, "Let there be light," and there was light. God saw that the light was good, and he separated the light from the darkness. God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.

[psalm23]
The LORD is my shepherd, I lack nothing. 
He makes me lie down in green pastures, 
he leads me beside quiet waters, 
he refreshes my soul.
[/psalm23]

five
short
lines
should
be one slide

very long line that should be split into two lines but has been sent on one line intead
`;

console.log('Running tests for text processing functions...');

// Test getParts with lyrics
console.log('\n----- Testing getParts with lyrics -----');
const lyricsParts = getParts(lyricsSample);
console.log(`Found ${lyricsParts.length} parts`);
lyricsParts.forEach((part, i) => {
    console.log(`\nPart ${i + 1}:`);
    console.log(part);
});
assert.strictEqual(lyricsParts.length, 4, 'Should extract 4 parts from lyrics (verse1, chorus, verse2, repeated chorus)');

// Test that the repeated chorus matches the original chorus
const chorusContent = lyricsParts[1]; // First chorus (index 1)
const repeatedChorus = lyricsParts[3]; // Last part (index 3) should be repeated chorus
console.log('\nVerifying repeated chorus:');
console.log(`Original chorus: "${chorusContent.substring(0, 20)}..."`);
console.log(`Repeated chorus: "${repeatedChorus.substring(0, 20)}..."`);
assert.strictEqual(repeatedChorus, chorusContent, 'Repeated chorus should match the original chorus content');

// Test getParts with Bible verses
console.log('\n----- Testing getParts with Bible verses -----');
const bibleParts = getParts(bibleSample);
console.log(`Found ${bibleParts.length} parts`);
bibleParts.forEach((part, i) => {
    console.log(`\nPart ${i + 1}:`);
    console.log(part);
});
assert.strictEqual(bibleParts.length, 2, 'Should extract 2 parts from Bible verses (main text and psalm23)');

// Test getSlideParts with lyrics
console.log('\n----- Testing getSlideParts with lyrics -----');
const lyricsSlides = getSlideParts(lyricsSample);
console.log(`Found ${lyricsSlides.length} slides`);
lyricsSlides.forEach((slide, i) => {
    console.log(`\nSlide ${i + 1}:`);
    console.log(slide);
});
// This should now include the repeated chorus
assert.strictEqual(lyricsSlides.length, 4, 'Should have 4 slides including the repeated chorus');

// Test getSlideParts with Bible verses (default maxLinesPerSlide: 6)
console.log('\n----- Testing getSlideParts with Bible verses (default maxLinesPerSlide) -----');
const bibleSlides = getSlideParts(bibleSample);
console.log(`Found ${bibleSlides.length} slides`);
bibleSlides.forEach((slide, i) => {
    console.log(`\nSlide ${i + 1} (${slide.length} characters):`);
    console.log('-'.repeat(40));
    console.log(slide);
    console.log('-'.repeat(40));
});

// Test getSlideParts with Bible verses and custom maxLinesPerSlide = 2
console.log('\n----- Testing getSlideParts with Bible verses (maxLinesPerSlide: 2) -----');
const bibleSlidesTighter = getSlideParts(bibleSample, 2);
console.log(`Found ${bibleSlidesTighter.length} slides (with maxLinesPerSlide: 2)`);
bibleSlidesTighter.forEach((slide, i) => {
    console.log(`\nSlide ${i + 1} (${slide.length} characters):`);
    console.log('-'.repeat(40));
    console.log(slide);
    console.log('-'.repeat(40));
});

console.log('\nAll tests completed successfully!'); 