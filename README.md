# jwt-crack

Multi-threaded JWT cracker in pure Node.js

## TODO

- Implement --minlen option
- Pass payload to worker directly as JSON? Either IPC, or env var
- Find a faster HMAC SHA256 module
- Add forecasts to progress notifications (either ETA or estimated finish time)
- Use a CLI progress bar module for progress?
- Output string secret instead of number when aborting? If so also accept it on --start
- Resume if worker dies? Maybe not needed why would they die?