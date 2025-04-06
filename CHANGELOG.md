# Changelog

## [1.2.2] - 2024-04-06

### Fixed

- Fixed issue where consecutive lines without part containers were incorrectly split into separate parts
- Improved handling of regular text lines to maintain proper grouping

## [1.2.0] - 2024-03-XX

### Changed

- Simplified the lyrics format to use clear section markers
- Updated documentation with clearer examples
- Improved type definitions for better TypeScript support

### Added

- Support for section indications in parentheses
- Better handling of repeated sections
- More intuitive content structure

### Removed

- Slide-based content splitting
- Special command tags
- Complex formatting options

## [1.1.0] - 2024-03-XX

### Added

- Initial release
- `getParts` function for basic content extraction
- `getSlideParts` function for slide-based content splitting
- Support for special command tags
- Comprehensive test suite
- TypeScript types and documentation

### Features

- Bracketed section parsing
- Special command tag handling
- Slide splitting based on content length
- Empty line separation
- Long line handling (>40 characters)
- Whitespace preservation
- Unicode support in tags

### Test Coverage

- Basic functionality tests
- Slide splitting tests
- Special command tests
- Edge case handling
