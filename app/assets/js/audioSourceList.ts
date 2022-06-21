const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const {remote} = require('electron');
const {app} = remote;
import {persistantData} from './index';
export const entertainmentItems = [
  {label: 'USB A', menuItem: 'UsbAudioAPos', pos: 1},
  {label: 'USB B', menuItem: 'UsbAudioBPos', pos: 2},
  {label: 'Aux In', menuItem: 'AuxInPos', pos: 3},
  {label: 'Bluetooth', menuItem: 'BluetoothPos', pos: 4},
  {label: 'Android Auto', menuItem: 'aaAudioPos', pos: 15},
  {label: 'Car Play', menuItem: 'cpAudioPos', pos: 16},
  {label: 'FM Radio', menuItem: 'FmRadioPos', pos: 5},
  {label: 'AM Radio', menuItem: 'AmRadioPos', pos: 6},
  {label: 'XM Radio', menuItem: 'SdarsRadioPos', pos: 7},
  {label: 'XM Audio', menuItem: 'xmRadioPos', pos: 17},
  {label: 'DAB Radio', menuItem: 'DabRadioPos', pos: 14},
  {label: 'Aha Radio', menuItem: 'AhaRadioPos', pos: 8},
  {label: 'Pandora', menuItem: 'PandoraPos', pos: 9},
  {label: 'Stitcher', menuItem: 'StitcherItemPos', pos: 10},
  {label: 'CD Player', menuItem: 'CdPlayerPos', pos: 11},
  {label: 'DVD', menuItem: 'DVDItemPos', pos: 12},
  {label: 'TV', menuItem: 'TVItemPos', pos: 13},
];

export const buildEntList = (user) => {
  const tmpdir = path.normalize(path.join(persistantData.get('copyFolderLocation', app.getPath('desktop')), '_copy_to_usb')); // Place to hold USB drive files before copying
  let listOrder = '';
  mkdirp.sync(`${tmpdir}/config/audio_order_AND_no_More_Disclaimer/both/jci/gui/apps/system/js/`);
  for (const item in user.entertainmentItems) {
    listOrder += 'var ' + user.entertainmentItems[item].menuItem + ' = ' + user.entertainmentItems[item].pos + ';\n';
  }
  fs.writeFileSync(`${tmpdir}/config/audio_order_AND_no_More_Disclaimer/systemApp.js.audio`, listOrder);
};
