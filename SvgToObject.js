const dep = ``
const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(dep);

const output = [];

$('path').each((i, item) => {
  let departement = {
    id: $(item).attr('id'),
    title: $(item).attr('title'),
    class: $(item).attr('class'),
    draw: $(item).attr('d')
  };
  output.push(departement);
})

fs.writeFile('./src/assets/maps/departements.json', JSON.stringify(output), (err) => {

})

console.log('File generated!')





