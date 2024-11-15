// js/inject.js

/**
 * @file
 * Injected JavaScript to perform operations that cannot be accomplished with
 * CSS alone.
 */

"use strict";

const srcChecker = /url\(\s*['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;

/**
 * Add a class to all elements that have a background image.
 *
 * This allows CSS to override the image with a generic background.
 */
Array.from(document.querySelectorAll('[id],[class],[style]')).forEach(function (node) {
  const prop = window.getComputedStyle(node, null).getPropertyValue('background-image');
  const match = srcChecker.exec(prop);
  if (match) {
    node.classList.add('has-background-image');
  }
});
