const fetch = require('node-fetch');
const urlFund = "https://codequiz.azurewebsites.net/";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Create function for Retrieve data from page
async function retrieveNav() {
    let result = null;

    // There's require opts to retrieve data as cookie: 'hasCookie=true'
    const opts = {
        headers: {
            cookie: 'hasCookie=true'
        }
    };

    // Use fetch modul for retrieve with opts
    await fetch(urlFund,opts)
    .then(res => res.text())
    .then(res => {
        result = res;
    })
    return result;
}

// Create exec function for init this file
async function exec() {

    // Use nav for get result from retrieveNav function
    // Use JSDOM to transform nav to HTML cause nav is string that can't tag by anything
    const nav = await retrieveNav();
    const dom = new JSDOM(nav.trim());
    const tr = dom.window.document.getElementsByTagName("tr")
    
    //Create fundList to keep fundName and fundNav for express 
    const fundList = [];
    for(let index = 0; index < tr.length; index++) {
        const obj = {fundName: null , fundNav: null};
        const trItem= tr.item(index);
        const trItemLength = trItem.childNodes.length
        let indexForName = 0;
        let indexForNav = 1;
        for(let tdIndex = 0; tdIndex < trItemLength; tdIndex++){
            const tdItem = trItem.childNodes.item(tdIndex);
            console.log('original item from td', tdItem.textContent)
            // There are empties content in HTML so have to prevent it before
            if(tdItem.textContent === ' ') {
                indexForName += 1;
                indexForNav += 1;
            // Then keep fundName and fundNave in same object
            } else {
                if(tdIndex === indexForName) {
                    obj.fundName = tdItem.textContent.trim();
                } else if(tdIndex === indexForNav) {
                    obj.fundNav = tdItem.textContent;
                }
            }
           
        }
        fundList.push(obj);
    }
    console.log('fundList', fundList)

    // Create variable to keep argument when running
    // find obj which fundName match with myArgs and keep the obj
    const myArgs = process.argv.slice(2).toString();
    const foundFun = fundList.find(item => item.fundName === myArgs)
    // If it match console.log fundNav
    if(foundFun) {
        console.log(foundFun.fundNav)
    } else {
        console.log('Not found')
    }
}
exec();