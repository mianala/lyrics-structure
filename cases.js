const cases = [
    {
        "name": "just text",
        "input": "Hello, world!",
        "expected": "Hello, world!"
    },
    {
        'name': 'just bracket',
        'input': '[verse1] Hello, world!',
        'expected': 'Hello, world!'
    },
    {
        'name': 'open and closing brackets',
        'input': '[verse 1]Hello, world![/verse 1]',
        'expected': 'Hello, world!'
    },
    {
        'name': 'open and closing brackets with repetition',
        'input': '[verse 1]Hello, world![/verse 1] [verse 1]',
        'expected': 'Hello, world! Hello, world!'
    },
    {
        'name': 'special bracket',
        'input': '[!instrumental]',
        'expected':"instrumental"
    },
    {
        'name': 'special bracket with text',
        'input': '[!🎸🎹🎺]Hello, world!',
        'expected': "🎸🎹🎺 Hello, world!"
    },
]
