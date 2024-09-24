(function () {
  if (!window.location.href.includes("euronics.ee/en/")) {
    console.error("Please navigate to english version of this page.");
    return;
  }

  var brandText = document.querySelector(".overview-producer__info > a.value");
  var categories = Array.from(
    document.querySelectorAll(".product-header a.breadcrumbs__link")
  )
    .map((a) => {
      return a.innerText.trim();
    })
    .join("|");

  var mpnText = document.querySelector(".overview-producer__code > .value");
  var mpn = mpnText?.innerText.trim() ?? "";

  var attributeGroups = Array.from(
    document.querySelectorAll(".specification__item")
  ).map((table) => {
    return {
      name:
        table.querySelector(".specification__heading")?.innerText.trim() ?? "",
      attributes: Array.from(table.querySelectorAll(".specification__row")).map(
        (row) => {
          var attributeLabel =
            row.querySelector(".specification__title")?.innerText.trim() ?? "";
          var attributeValue =
            row.querySelector(".specification__value")?.innerText.trim() ?? "";

          return {
            name: (
              attributeLabel.charAt(0).toUpperCase() +
              attributeLabel.substring(1)
            ).replace(
              "\n                                            \n    \n        \n            \n                \n            \n        \n        \n            \n            ",
              ""
            ),
            value: (
              attributeValue.charAt(0).toUpperCase() +
              attributeValue.substring(1)
            ).replace(
              "                                                \n    \n        \n            \n                \n            \n        \n        \n            \n            ",
              ""
            ),
          };
        }
      ),
    };
  });

  attributeGroups = attributeGroups.filter((attributeGroup) => {
    if (["links"].includes(attributeGroup.name.toLowerCase())) {
      return false;
    }

    return true;
  });

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

    var blob = new Blob([JSON.stringify(attributeGroups, null, 4)], {
      type: "text/plain",
    });
    var item = new ClipboardItem({ "text/plain": blob });
    navigator.clipboard.write([item]);
    button.innerText = "Copied!";
  });

  document.body.append(button);
})();
