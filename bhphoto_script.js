(function () {
  const brandImg = document.querySelector(
    'img[data-selenium="authorizeDealerBrandImage"]'
  );
  const brandText = document.querySelector(
    'a[data-selenium="authorizedDealerLink"] > span'
  );

  const mpnText = document
    .querySelector('div[data-selenium="codeCrumb"]')
    .innerText.trim();
  const mpnParts = mpnText.split("MFR #");
  const mpn = mpnParts.length > 1 ? mpnParts[1].split(" ")[0] ?? "" : "";

  const productData = {
    url: window.location.href,
    mpn: mpn.trim(),
    name: document
      .querySelector('h1[data-selenium="productTitle"]')
      .innerText.trim(),
    brand: brandImg
      ? brandImg.getAttribute("alt").trim()
      : brandText?.innerText.trim() ?? "",
    categories: Array.from(
      document.querySelectorAll('a[data-selenium="linkCrumb"]')
    )
      .map((a) => {
        return a.innerText.trim();
      })
      .slice(1, -1)
      .join("|"),
    shortDescription: Array.from(
      document.querySelectorAll('li[data-selenium="sellingPointsListItem"]')
    ).map((li) => {
      return li.innerText.trim();
    }),
    attributeGroups: Array.from(
      document.querySelectorAll('table[data-selenium="specsItemGroupTable"]')
    ).map((table) => {
      return {
        name:
          table.parentElement
            .querySelector('div[data-selenium="specsItemGroupName"]')
            ?.innerText.trim() ?? "",
        attributes: Array.from(
          table.querySelectorAll('tr[data-selenium="specsItemGroupTableRow"]')
        ).map((row) => {
          var nameElement = row.querySelector('td[data-selenium="specsItemGroupTableColumnLabel"]')
          var valueElement = row.querySelector('td[data-selenium="specsItemGroupTableColumnValue"]')

          nameElement.innerHTML = nameElement.innerHTML.replaceAll('<br>', "\n")
          valueElement.innerHTML = valueElement.innerHTML.replaceAll('<br>', "\n")

          var name = nameElement.innerText.trim()
          var value = valueElement.innerText.trim()

          return {
            name: name,
            value: value,
          };
        }),
      };
    }),
  };

  const data = productData["attributeGroups"];

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
