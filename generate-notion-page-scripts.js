#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Create Notion Page Scripts
// @raycast.mode compact

// Optional parameters:
// @raycast.icon 🤖
// @raycast.packageName Create Notion Page Scripts

// Documentation:
// @raycast.description Shortcuts for opening directly to your notion pages
// @raycast.author Nicklas Cook
// @raycast.authorURL https://github.com/nicklascook

import Notion from "notion-api-js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const writeToRaycastScript = async ({ title, icon, notionURL }) => {
  const data = `#!/bin/bash
# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title ${title}
# @raycast.mode compact

# Optional parameters:
# @raycast.icon ${icon}
# @raycast.packageName Open in Notion

# Documentation:
# @raycast.author Nicklas Cook
# @raycast.authorURL https://github.com/nicklascook

frontMostApplication=$(osascript \
-e 'tell application "System Events"' \
-e 'set frontApp to name of first application process whose frontmost is true' \
-e 'end tell')

if [$frontMostApplication = "Notion"]
then
  originalPosition=$(osascript -e 'tell application "Finder" to get the position of the front Finder window')
  osascript -e 'tell application "Finder" to set the position of the front Finder window to {-1700, -1700}'
  osascript -e 'tell application "Finder" to activate'
  osascript -e 'tell application "Finder" to set the position of the front Finder window to {$originalPositions}'
fi	

open ${notionURL}
`;
  await fs.writeFileSync(
    `./output/raycast-notion-page-${encodeTitleForURL(title)}.sh`,
    data
  );
};

const encodeTitleForURL = (title) => {
  // TODO: handle all characters
  return title.replace(/ /g, "_");
};

const main = (async () => {
  const notion = new Notion({
    token: process.env.NOTION_V2_TOKEN,
  });

  const pages = await notion.getPages();

  const settledPageChildren = await Promise.allSettled(
    pages.map((page) => notion.getPagesByIndexId(page))
  );

  const pageChildren = settledPageChildren
    .filter((res) => res.status === "fulfilled")
    .map((res) => res.value);

  if (pageChildren.length !== settledPageChildren.length)
    console.error("Failed during subpage call, some pages may be missing");

  for (const children of pageChildren) {
    for (const subpage of children) {
      const { title, icon, id } = subpage.Attributes;

      const notionURL = `notion://www.notion.so/native/${encodeTitleForURL(
        title
      )}-${id.replace(/-/g, "")}`;

      writeToRaycastScript({
        icon: icon ?? "",
        title,
        notionURL,
      });
    }
  }
})();

export default main;
