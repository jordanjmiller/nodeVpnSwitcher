const { exec } = require("child_process");

//Must escape your \'s by adding a second one, and wrap everything in a second string to preserve spaces/treat as one complete string
const windowsPIAString = '"C:\\Program Files\\Private Internet Access\\piactl.exe"'; 
const macLinuxPIAString = 'piactl';
const loginFile = ".\\creds.txt";
let regions = '';

const piaGetRegions = () => {
    console.log('piaGetRegions firing');
    // exec(`${windowsPIAString} get regions`, (error, stdout, stderr) => {
    //     if (error) { console.log(`piaGetRegions error: ${error.message}`); return false; }
    //     if (stderr) { console.log(`piaGetRegions stderr: ${stderr}`); return false; }
    //     const stdArray = stdout.split("\n");

    //     // remove 'auto' as an option
    //     const index = stdArray.indexOf('auto');
    //     if (index > -1) { stdArray.splice(index, 1); }

    //     regions = [...stdArray];
    //     console.log(`piaGetRegions success, ${regions.length} regions found`);
    //     return true;
    // });
    return new Promise(function(resolve, reject) { 
        exec(`${windowsPIAString} get regions`, (error, stdout, stderr) => {
            if (error) { console.log(`piaGetRegions error: ${error.message}`); reject(error.message); return; }
            if (stderr) { console.log(`piaGetRegions stderr: ${stderr}`); reject(stderr); return; }
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
    // exec(`${windowsPIAString} background enable`, (error, stdout, stderr) => {
    //     if (error) { console.log(`piaEnableBackground error: ${error.message}`); return false; }
    //     if (stderr) { console.log(`piaEnableBackground stderr: ${stderr}`); return false; }
    //     console.log('piaEnableBackground success, stdout:', stdout);
    //     return true;
    // });
    return new Promise(function(resolve, reject) { 
        exec(`${windowsPIAString} background enable`, (error, stdout, stderr) => {
            if (error) { console.log(`piaEnableBackground error: ${error.message}`); reject(error.message); return; }
            if (stderr) { console.log(`piaEnableBackground stderr: ${stderr}`); reject(stderr); return; }
            console.log('piaEnableBackground success, stdout:', stdout);
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
                else{ console.log(`piaLogin error: ${error.message}`); reject(error.message); return; }
            }
            if (stderr) { console.log(`piaLogin stderr: ${stderr}`); reject(stderr); return; }
            console.log('piaLogin success, stdout:', stdout);
            resolve(true);
        });
    });
}

const piaConnect = (region) => {
    console.log('piaConnect firing, region:', region);
    return new Promise(function(resolve, reject) { 
        exec(`${windowsPIAString} connect ${region}`, (error, stdout, stderr) => {
            if (error) { console.log(`piaConnect error: ${error.message}`); reject(error.message); return; }
            if (stderr) { console.log(`piaConnect stderr: ${stderr}`); reject(stderr); return; }
            console.log('piaConnect success, stdout:', stdout);
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
        //connect to first region
        await piaConnect(regions[0]);
        //verify connection status and return
    }
    catch(err){ console.log('piaSetup error:', err)}
}

piaSetup();