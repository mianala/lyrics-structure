import { getLyricsParts } from './lyrics';

const testLyrics = `[partname 1] (indication 1)

content 1

[/partname 1]

[partname 1] (indication 2)

[partname 2]

content 2

[/partname 2]

[interlude 1]

[partname 3]

content without partname container

content standalone 1
content standalone 2
`;

describe('getLyricsParts', () => {
  it('should correctly parse lyrics into parts', () => {
    const result = getLyricsParts(testLyrics);

    expect(result).toEqual([
      {
        name: 'partname 1',
        repetition: false,
        indication: 'indication 1',
        content: 'content 1',
      },
      {
        name: 'partname 1',
        repetition: true,
        indication: 'indication 2',
        content: 'content 1',
      },
      {
        name: 'partname 2',
        repetition: false,
        indication: null,
        content: 'content 2',
      },
      {
        name: 'interlude 1',
        repetition: false,
        indication: null,
        content: undefined,
      },
      {
        name: 'partname 3',
        repetition: false,
        indication: null,
        content: undefined,
      },
      {
        name: undefined,
        repetition: false,
        indication: null,
        content: 'content without partname container',
      },
      {
        name: undefined,
        repetition: false,
        indication: null,
        content: 'content standalone 1\ncontent standalone 2',
      },
    ]);
  });
});
