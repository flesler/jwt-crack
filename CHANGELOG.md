# jwt-crack

## 1.1.1 - 2017-01-19
### Fixed
- Hyphens and underscore on signatures are now normalized, they wouldn't match with Node crypto's output before
### Changed
- Instead of removing the potential trailing `=` on each hash, letting Node add it to the incoming signature. Better performance

## 1.1.0 - 2016-10-26
### Changed
- Renamed --max to --maxlen

## 1.0.0 - 2016-10-26
### Added
- First version