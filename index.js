const { exec } = require("child_process");

//Must escape your \'s by adding a second one, and wrap everything in a second string to preserve spaces/treat as one complete string
const windowsPIAString = '"C:\\Program Files\\Private Internet Access\\piactl.exe"'; 
const macLinuxPIAString = 'piactl';
const loginFile = ".\\creds.txt";
let regions = '';

const piaGetRegions = () => {
    console.log('piaGetRegions firing');
    return new Promise(function(resolve, reject) { 
        exec(`${windowsPIAString} get regions`, (error, stdout, stderr) => {
            if (error) { reject(Error(`piaGetRegions error: ${error.message}`)); return; }
            if (stderr) { reject(Error(`piaGetRegions stderr: ${stderr}`)); return; }
            const stdArray = stdout.split("\n");
    
            // remove 'auto' as an option
            const index = stdArray.indexOf('auto');
            if (index > -1) { stdArray.splice(index, 1); }
            regions = [...stdArray];

            console.log(`piaGetRegions success, ${regions.length} regions found`);
            resolve(true);
        });
    });
}

const piaEnableBackground = () => {
    console.log('piaEnableBackground firing');
    return new Promise(function(resolve, reject) { 
        exec(`${windowsPIAString} background enable`, (error, stdout, stderr) => {
            if (error) { reject(Error(`piaEnableBackground error: ${error.message}`)); return; }
            if (stderr) { reject(Error(`piaEnableBackground stderr: ${stderr}`)); return; }
            console.log('piaEnableBackground success');
            resolve(true);
        });
    });
}

const piaLogin = () => {
    console.log('piaLogin firing');
    return new Promise(function(resolve, reject) { 
        exec(`${windowsPIAString} login ${loginFile}`, (error, stdout, stderr) => {
            if (error) { 
                if (error.message.includes('Already logged into account')){ console.log('piaLogin: Already logged into PIA'); resolve(true); return; }
                else{ reject(Error(`piaLogin error: ${error.message}`)); return; }
            }
            if (stderr) { reject(Error(`piaLogin stderr: ${stderr}`)); return; }
            console.log('piaLogin success, stdout:', stdout);
            resolve(true);
        });
    });
}

const piaSetRegion = (region) => {
    console.log('piaSetRegion firing, region:', region);
    return new Promise(function(resolve, reject) { 
        exec(`${windowsPIAString} set region ${region}`, (error, stdout, stderr) => {
            if (error) { reject(Error(`piaSetRegion error: ${error.message}`)); return; }
            if (stderr) { reject(Error(`piaSetRegion stderr: ${stderr}`)); return; }
            console.log('piaSetRegion success, region set to:', region);
            resolve(true);
        });
    });
}

const piaConnect = () => {
    console.log('piaConnect firing');
    return new Promise(function(resolve, reject) { 
        exec(`${windowsPIAString} connect`, (error, stdout, stderr) => {
            if (error) { reject(Error(`piaConnect error: ${error.message}`)); return; }
            if (stderr) { reject(Error(`piaConnect stderr: ${stderr}`)); return; }
            console.log('piaConnect success');
            resolve(true);
        });
    });
}

const piaSetup = async () => {
    try{
        //check if logged in, log in if not
        await piaLogin()
        //enable PIA running in the background without the PIA GUI running
        await piaEnableBackground();
        //get array of regions
        await piaGetRegions();
        //set first region
        await piaSetRegion(regions[0]);
        //connect to first region
        await piaConnect();
        //verify connection status and return
    }
    catch(err){ console.log('piaSetup error:', err)}
}

piaSetup();