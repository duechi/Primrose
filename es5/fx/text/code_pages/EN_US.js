"use strict";

/* global Primrose, pliny */

Primrose.Text.CodePages.EN_US = function () {
  "use strict";

  var CodePage = Primrose.Text.CodePage;

  pliny.record({
    parent: "Primrose.Text.CodePages",
    name: "EN_US",
    description: "| [under construction]"
  });
  return new CodePage("English: USA", "en-US", {
    NORMAL: {
      "32": " ",
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "59": ";",
      "61": "=",
      "173": "-",
      "186": ";",
      "187": "=",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "/",
      "219": "[",
      "220": "\\",
      "221": "]",
      "222": "'"
    },
    SHIFT: {
      "32": " ",
      "48": ")",
      "49": "!",
      "50": "@",
      "51": "#",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "59": ":",
      "61": "+",
      "173": "_",
      "186": ":",
      "187": "+",
      "188": "<",
      "189": "_",
      "190": ">",
      "191": "?",
      "219": "{",
      "220": "|",
      "221": "}",
      "222": "\""
    }
  });
}();

pliny.issue({
  parent: "Primrose.Text.CodePages.EN_US",
  name: "document EN_US",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CodePages.EN_US](#Primrose_Text_CodePages_EN_US) class in the code_pages/ directory"
});