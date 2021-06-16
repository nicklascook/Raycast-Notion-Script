# Notion Script Generator for Raycast ✍️

Easily generate scripts to open each of your Notion pages from within [Raycast](https://raycast.com/).

## Installation

1. Clone the repository to anywhere on your Mac.
2. Ensure Node.js is installed (and Yarn if you prefer)
3. Run either `npm install ` or `yarn install `
4. Get your Notion token_v2:
   1. Open to Notion in Chrome
   2. Open developer tools
   3. Go to Application -> Cookies
   4. Copy the value of token_v2
5. Create a .env file at the root of the project and add `NOTION_V2_TOKEN=YOUR TOKEN`
6. Add script to Raycast by searching for `Extensions`
7. Run `Create Notion Page Scripts` in Raycast (you may need to run `Reload Script Directories`)
8. Add `./output` to Raycast script directories

To refresh pages, simply run `Create Notion Page Scripts` and reload your scripts.

## Roadmap

- [ ] Ability to only select a certain "depth" of subpages
- [ ] 🤔💭
