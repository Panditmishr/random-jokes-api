const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');

const URL = 'https://www.myntra.com/men-tshirts';

async function scrapeMyntra() {
    try {
        const { data } = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const $ = cheerio.load(data);
        const products = [];

        $('.product-base').each((i, el) => {
            const name = $(el).find('.product-product').text().trim();
            const price = $(el).find('.product-discountedPrice').text().trim() ||
                          $(el).find('.product-price').text().trim();
            const originalPrice = $(el).find('.product-strike').text().trim() || '';
            const brand = $(el).find('.product-brand').text().trim();
            const rating = $(el).find('.product-ratingsContainer').text().trim() || 'N/A';

            products.push({
                name: `${brand} ${name}`,
                price,
                originalPrice,
                availability: 'In Stock', // Assuming all visible items are in stock
                rating
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(products);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Myntra Products');
        XLSX.writeFile(workbook, 'myntra_products.xlsx');

        console.log('✅ Scraping completed. Data saved to myntra_products.xlsx');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

scrapeMyntra();
