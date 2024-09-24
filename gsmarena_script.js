(function () {
  var data = Array.from(document.querySelectorAll("#specs-list > table")).map(
    (table) => {
      var groupName = table
        .querySelector(":scope > tbody > tr:first-child th")
        ?.innerText.trim();
      var groupAttributes = [];

      if (groupName === undefined) {
        return;
      }

      table.querySelectorAll(":scope > tbody > tr").forEach(function (row) {
        var attributeName = row.querySelector(".ttl")?.innerText.trim();
        var attributeValue = row.querySelector(".nfo")?.innerText.trim();

        if (attributeName === undefined || attributeValue === undefined) return;

        if (
          attributeName === "" &&
          groupAttributes[groupAttributes.length - 1] !== undefined
        ) {
          groupAttributes[groupAttributes.length - 1].value +=
            "\r\n" + attributeValue; // attach value to previous attribute
          return;
        }

        if (
          groupName === "CAMERA" &&
          attributeName === "" &&
          attributeValue === "No"
        ) {
          return;
        }

        groupAttributes.push({
          name: attributeName
            .split(" ")
            .map((word) => word[0].toUpperCase() + word.substr(1))
            .join(" "),
          value: attributeValue,
        });
      });

      return {
        name: groupName
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.substr(1).toLowerCase())
          .join(" "),
        attributes: groupAttributes,
      };
    }
  );

  data = data.filter(
    (attributeGroup) =>
      attributeGroup !== null &&
      !["tests", "misc", "launch"].includes(
        attributeGroup.name.toLowerCase()
      ) &&
      attributeGroup.attributes.length > 0
  );

  const style = document.createElement("style");
  style.textContent =
    "" +
    "#gsm-copy-data-btn { position: fixed; bottom: 0; right: 0; left: 0; padding: 15px 20px; font-size: 18px; background-color: #b5e1b5; border: unset; border-top: 1px solid #99c997; }" +
    "#gsm-copy-data-btn:hover { background-color: #a9dfa9; cursor: pointer; }";
  document.head.appendChild(style);

  var button = document.createElement("button");
  button.innerText = "Copy specifications";
  button.setAttribute("id", "gsm-copy-data-btn");
  button.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var blob = new Blob([JSON.stringify(data, null, 4)], {
      type: "text/plain",
    });
    var item = new ClipboardItem({ "text/plain": blob });
    navigator.clipboard.write([item]);
    button.innerText = "Copied!";
  });

  document.body.append(button);
})();
