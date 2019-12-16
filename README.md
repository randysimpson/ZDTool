# ZDTool
Zendesk Tool for scraping and gaining details about tickets/correspondence from Zendesk case management system.

## Chrome Extension

The chrome extension is used after authentication into zendesk.  The button in the taskbar will allow for a user to scrape all the zendesk data into the backend application over https connection.  Therefore the connection to the backend server must have the certificate installed in chrome for the connection to work.

### Install

1. Zendesk/custom.js has environment variables that need to be setup at the top of the script.
2. Place Chrome into dev mode to allow addition of custom extensions
3. From `chrome://extensions/` click "Load Unpacked" button and select folder `chrome_extensions/Zendesk`.

## Backend

The backend of this application is used to save the zendesk information, as well as send the data out to a wavefront proxy.

### Required Dependencies

1. Mongodb instance running for the backend to connect with.
2. Certificates created and located in the root direction of the backend, which will be used in https communication.
  * `cert.key`
  * `cert.crt`
  
### Install

1. `npm install` from the root directory of the backend.
2. mongodb was hardcoded address `config.js`, this will need to be modified to current mongodb location.
3. wavefront proxy location was hardcoded and needs to be modified. `controller/wfQueue.js`.
4. sr stats application location was also hardcoded and needs to be modified `controller/srStats.js`.

There is a Dockerfile that can be used to build this into a docker container.  Future versions of this product would have certs and hardcoded addresses as environment variables.

## Operation

1. Start the backend `npm start` - backend will be running on port 4000.
2. Log into zendesk ticketing system
3. Click chrome extension for zendesk tool
4. Click Scrape button

## License

MIT License

Copyright (©) 2019 - Randall Simpson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.