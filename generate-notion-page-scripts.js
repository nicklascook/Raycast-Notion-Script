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

const Notion = require("notion-api-js").default;
require("dotenv").config();
const fs = require("fs");

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

open --hide -a Finder
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

(async () => {
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
