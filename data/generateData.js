const fs = require('fs');
const path = require('path');

const requireDir = dir => {
    if(!fs.existsSync(dir)) fs.mkdirSync(dir);
};

requireDir(path.join(__dirname, '../static/results'));

fs.readdirSync(path.join(__dirname, '.')).forEach(file => {
    if(fs.lstatSync(path.join(__dirname, `./${file}`)).isDirectory()) {
        if(fs.existsSync(path.join(__dirname, `./${file}/extractData.js`))) {
            requireDir(path.join(__dirname, `../static/results/${file}`));
            console.log('Extracting data from CIK files');
            const extractData = require(path.join(__dirname, `./${file}/extractData.js`));
            const units = extractData();
            let c = 0;
            console.log(`Writing data for ${file}`);
            for(const key of Object.keys(units)) {
                //requireDir(path.join(__dirname, `../static/results/${file}/${key}`));
                
                let fileUrl;

                if(key === 'index') {
                    fileUrl = path.join(__dirname, `../static/results/${file}/total.json`);
                } else {
                    fileUrl = path.join(__dirname, `../static/results/${file}/${key}.json`);
                }

                fs.writeFileSync(fileUrl, units[key]);
            }
            console.log('Done');
        }
    }
});