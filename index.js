const { exec } = require("child_process");

//Must escape your \'s by adding a second one, and wrap everything in a second string to preserve spaces/treat as one complete string
const windowsPIAString = '"C:\\Program Files\\Private Internet Access\\piactl.exe"'; 
const macLinuxPIAString = 'piactl';
const loginFile = ".\\creds.txt";
let regions = '';

exec(`${windowsPIAString} get regions`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    // const stdArray = stdout.split("\n");
    console.log(`stdout: ${stdout}`);
    // console.log(`stdArray[0]: ${stdArray[0]}`);
});

const getRegions = () => {
    exec(`${windowsPIAString} get regions`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return false;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return false;
        }
        const stdArray = stdout.split("\n");

        // remove 'auto' as an option
        const index = stdArray.indexOf('auto');
        if (index > -1) { stdArray.splice(index, 1); }

        regions = [...stdArray];
        console.log(`getRegions success, ${regions.length} regions found`);
        return true;
    });
}

const enableBackground = () => {
    exec(`${windowsPIAString} background enable`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return false;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return false;
        }
        console.log('enableBackground success, stdout:', stdout);
        return true;
    });
}

const piaLogin = () => {
    exec(`${windowsPIAString} login ${loginFile}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return false;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return false;
        }
        console.log('login success, stdout:', stdout);
        return true;
    });
}

const piaSetup = () => {
    //check if logged in, log in if not
    //enable PIA running in the background without the PIA GUI running
    //get array of regions
    //
}