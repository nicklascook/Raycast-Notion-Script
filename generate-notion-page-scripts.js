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

  const notionLinks = pageChildren.map((children) => {
    return children.map((subpage) => {
      // TODO: create function to format title for URL
      return `notion://www.notion.so/${subpage.Attributes.title.replace(
        / /g,
        "_"
      )}-${subpage.Attributes.id}`;
    });
  });

  // TODO: Generate raycast scripts
  // TODO: Save raycast scripts to file
  // TODO: Write README
  // TODO: Write tests

  console.log(notionLinks);
})();
