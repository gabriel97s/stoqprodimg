#!/usr/bin/env node

const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const myArgs = process.argv.slice(2);

if ( myArgs[0] ) {
    const urlProduct = myArgs[0];

    request(urlProduct ,(err, res, body) => {
        if (err) console.log(err);
    
        const $ = cheerio.load(body);

        const folderProductImages = process.env.HOME + "/stoq-prod-img/";

        if (!fs.existsSync(folderProductImages)) fs.mkdirSync(folderProductImages);

        const nameFolder = urlProduct.split("/")[3].split("?")[0];
        const nameFolderPath = folderProductImages + nameFolder;

        if (!fs.existsSync(nameFolderPath)) fs.mkdirSync(nameFolderPath);

        $('#gallery > a').each((index, element) => {
            let imageUrl  = element.attribs["data-image"];
            let nameImage = index + "_" + imageUrl.split("/")[6];
            let pathImgSalve = nameFolderPath + "/" + nameImage;
            
            request(imageUrl).pipe(fs.createWriteStream(pathImgSalve));
        });
    })
}