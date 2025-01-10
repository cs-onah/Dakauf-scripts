(async function () {
  if (document.querySelector('html').getAttribute('lang') !== 'en-GB') {
    console.error("Please navigate to english version of this page.");
    return;
  }

  var specsListItemsSelector = 'div[class^="SpecsListstyle__StyledSpecsList"] > ul > li';
  var specsListItems = document.querySelectorAll(specsListItemsSelector);

  if (specsListItems.length === 0) {
    document
      .querySelector(
        'div[data-scrollpoint="specifications"] > button'
      )
      .click();

    var numAttempts = 7;

    for(var i = 0; i < numAttempts; i++) {
      console.log(`Polling specifications list items. Attempt ${i+1}...`);

      // Blocking sleep for 1 second.
      await new Promise(resolve => setTimeout(resolve, 1000));

      specsListItems = document.querySelectorAll(specsListItemsSelector);

      if (specsListItems.length > 0) {
        break;
      }
    }
  }

  if (specsListItems.length === 0) {
    console.error('Failed to locate specifications list items.');
    return
  }

  var svgCheckmarkHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" fill="currentColor"><path d="M23.57 5.35l-2.11-2.1a1.37 1.37 0 00-1.05-.43 1.48 1.48 0 00-1.05.43L9.19 13.45 4.61 8.84a1.44 1.44 0 00-1.05-.43 1.49 1.49 0 00-1.06.43l-2.1 2.1A1.54 1.54 0 000 12a1.58 1.58 0 00.4 1.05l7.73 7.73a1.5 1.5 0 001.06.4 1.41 1.41 0 001.05-.4L23.6 7.42a1.52 1.52 0 00.4-1 1.48 1.48 0 00-.43-1z"></path></svg>';

  var attributeGroups = Array.from(specsListItems).map(table => {
    var attributeGroupName = table.querySelector('button > span:first-child').innerText.trim();

    if (attributeGroupName === 'General' || attributeGroupName === 'Update policy') {
      return null;
    }

    var attributes = Array.from(table.querySelectorAll('table[class^="SpecsListstyle__StyledSpecTable"] > tbody > tr')).map(row => {
      var attributeLabelColumn = row.querySelector(
        'td:nth-child(2)'
      )

      var attributeValueColumn = row.querySelector(
        'td:nth-child(3)'
      )

      var attributeLabel = attributeLabelColumn.innerText.trim();
      var attributeValue = attributeValueColumn.innerText.trim();

      var svgIcon = attributeValueColumn.querySelector('svg');

      // Convert SVG checkmark icon into text string.
      if (svgIcon && svgIcon.outerHTML === svgCheckmarkHtml) {
        attributeValue = 'Yes'; 
      }

      return {
        name: attributeLabel,
        value: attributeValue
      };
    });
    
    attributes = attributes.filter(attribute => attribute !== null);

    return {
      name: attributeGroupName,
      attributes: attributes
    };
  });

  attributeGroups = attributeGroups.filter(attributeGroup => attributeGroup !== null);

  const style = document.createElement("style");
  style.textContent =
    "" +
    "#gomibo-copy-data-btn { z-index: 9999999999; position: fixed; bottom: 0; right: 0; left: 0; padding: 15px 20px; font-size: 18px; background-color: #b5e1b5; border: unset; border-top: 1px solid #99c997; }" +
    "#gomibo-copy-data-btn:hover { background-color: #a9dfa9; cursor: pointer; }";
  document.head.appendChild(style);

  var button = document.createElement("button");
  button.innerText = "Copy specifications";
  button.setAttribute("id", "gomibo-copy-data-btn");
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