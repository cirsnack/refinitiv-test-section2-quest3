const fetch = require('node-fetch');
const page_in_text_string = 'https://codequiz.azurewebsites.net';
const jsdom = require('jsdom');
async function retrieveNav() {
    let result = null;
    const opts = {
        headers: {
            cookie: 'hasCookie=true'
        }
    };
    await fetch(page_in_text_string, opts)
    .then(res => res.text())
    .then((response) =>    {
        result = response;
    });
    return result;
}

async function exec () {
    const nav =  await retrieveNav();
    const dom = new jsdom.JSDOM(nav.trim());
    const tr = dom.window.document.getElementsByTagName("tr");
    const fundList = [];
    for(let index = 0; index< tr.length; index ++) {
        const obj = { fundName: null, fundNav: null};
        const trItem = tr.item(index);
        let fundNameIndex = 0;
        let fundNavIndex = 1;
        for(let indexTd = 0; indexTd < trItem.childNodes.length; indexTd ++) {
            const tdItem = trItem.childNodes.item(indexTd);
            if(tdItem.textContent === ' ') {
                fundNameIndex = + 1;
                fundNavIndex = + 2;
            } else {
                if(indexTd === fundNameIndex) {
                    obj.fundName = tdItem.textContent.trim();
                } else if (indexTd === fundNavIndex){
                    obj.fundNav = tdItem.textContent;
                }
            }
            
        }
        fundList.push(obj)
    }
    var myArgs = process.argv.slice(2).toString();
    const foundFund = fundList.find(el=> el.fundName === myArgs);
    if(foundFund) {
        console.log(foundFund.fundNav)
    } else {
        console.log('Not Found FUND')
    }
}

exec();