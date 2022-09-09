const { JSDOM } = require( "jsdom" );
// initialize JSOM in the "https://scrapeme.live/" page
// to avoid CORS problems
const { window } = new JSDOM("", {
    url: "https://scrapeme.live/",
});
const $ = require( "jquery" )( window );

$.get("https://scrapeme.live/shop/", function(html) {
    // retrieve the list of all HTML products
    const productHTMLElements = $(html).find("li.product");

    const products = []
    // populate products with the scraped data
    productHTMLElements.each((i, productHTML) => {
        // scrape data from the product HTML element
        const product = {
            name: $(productHTML).find("h2").text(),
            url: $(productHTML).find("a").attr("href"),
            image: $(productHTML).find("img").attr("src"),
            price: $(productHTML).find("span").first().text(),
            // store the original HTML content
            html: $(productHTML).html()
        };

        products.push(product);
    });

    // store the product data on a db ...

    const prices = new Set()
    // use a regex to identify price span HTML elements
    $(html).find("span").each((i, spanHTMLElement) => {
        // keep only HTML elements whose text is a price
        if (/^£\d+.\d{2}$/.test($(spanHTMLElement).text())) {
            // add the scraped price to the prices set
            prices.add($(spanHTMLElement).text())
        }
    });
    // use the price data to achieve something ...

    console.log(JSON.stringify([...prices]))
    console.log(JSON.stringify(products))
});

