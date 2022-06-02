const { MSICreator } = require('electron-wix-msi');

async function main() {
    const msiCreator = new MSICreator({
        appDirectory: 'C:/Devz/kityminder-app-dist/KeepMinding-win32-x64',
        outputDirectory: 'C:/Devz/kityminder-app-dist',
        upgradeCode: '0D713134-7256-3C7E-BBCF-CC08EB76ABEC',
        arch: 'x64',
        exe: 'KeepMinding.exe',
        name: 'KeepMinding',
        version: '22.6.2',
        manufacturer: 'AppXI',
        description: 'KeepMinding',
        appIconPath: './app/static/favicon.ico',

        language: 2052,
        features: {
            autoUpdate: true,
            autoLaunch: false
        },
        shortName: "keepMinding",
        appUserModelId: 'keepMinding',
        defaultInstallMode: 'perUser',
        programFilesFolderName: 'keepMinding',
        shortcutFolderName: 'KeepMinding',
        shortcutName: 'KeepMinding',
        // ui: {
        //     chooseDirectory: false
        // },
    });
    const supportBinaries = await msiCreator.create();
    await msiCreator.compile();
}
main().catch(err => { console.log(err) })