if (window.location.host.endsWith('daydeal.ch')) {
  var priceNodes = document.querySelectorAll('.product-pricing__prices-new-price, .product-pricing__prices-old-price');
  roundPricesInNodes(priceNodes);
}
if (window.location.host.endsWith('brack.ch')) {
  var priceNodes = document.querySelectorAll('.currentPrice .specialOffer, .productList__itemOldPrice, .item-price .price, .item-price .old-price');
  roundPricesInNodes(priceNodes);
}
if (window.location.host.endsWith('digitec.ch') || window.location.host.endsWith('galaxus.ch')) {
  // TODO: fix prices with ' in the name
  // like https://www.galaxus.ch/en/s14/product/giardimo-celina-corner-sofa-anthracite-garden-lounges-5992260

  var priceNodes = document.querySelectorAll('.product-price, .product-price-appendix');
  roundPricesInNodes(priceNodes);
  setTimeout(function() {
    var priceNodes = document.querySelectorAll('.product-price, .product-price-appendix');
    roundPricesInNodes(priceNodes);
  }, 2000);
  document.querySelector('a.load-more__trigger').addEventListener('click', function() {
    setTimeout(function() {
      var priceNodes = document.querySelectorAll('.product-price, .product-price-appendix');
      roundPricesInNodes(priceNodes);
    }, 2000);
  });
}

function roundPricesInNodes(priceNodes) {
  for (let i = 0; i < priceNodes.length; i++) {
    const childNodes = priceNodes[i].childNodes;
    for (let j = 0; j < childNodes.length; j++) {
      const n = childNodes[j];
      if (n.nodeType !== 3) { // skip non text nodes
        continue;
      }
      if (n.textContent.trim().length === 0) { // skip empty text nodes
        continue;
      }
      var regex = /[+-]?\d+(\.\d+)?/g;
      var res = n.textContent.match(regex);
      if (res === null) {
        continue;
      }
      var number = res[0];
      var newText = String(n.textContent).replace(number, roundPrice(number));
      if (!newText.includes('.–')) { // make it look good
        newText = newText + '.–';
        // TODO: add thousand separator
      }
      n.textContent = newText;
    }
  }
}

function roundPrice(price) {
  price = price.replace('.00', '');
  if (price.includes('.')) {
    var n = Number(price);
    if (isNaN(n)) {
      console.info('Was not able to convert float price into a number', price);
      return price;
    }
    var r = Math.ceil(n);
    return String(r);
  }
  var lastChar = price.slice(-1);
  if (lastChar === '9' || lastChar === '8') {
    var n = Number(price);
    if (isNaN(n)) {
      console.info('Was not able to convert price into a number', price);
      return price;
    }
    var r = Math.round(n/10) * 10;
    return String(r);
  }
  return price;
}

function extractDomain(url) {
  var domain = url;
  // find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
  } else {
      domain = url.split('/')[0];
  }
  // find & remove port number
  return domain.split(':')[0];
}
