/* jshint esversion:6, -W117, -W116 */
const xml2js = require('xml2js');
// var settingsData = new Config({ 'name': 'msgSettings' })
let data2edit; const msgLangs = [];
let currLangMsgs = [];
let currMsgLang;
const parser = new xml2js.Parser();

function getMsgLangs() {
  let messageFile = (fs.existsSync(`${varDir}/message_replies/jci/settings/configurations/blm_msg-system.xml`) ? `${varDir}` : `${builddir}/config`);
  messageFile += `/message_replies/jci/settings/configurations/blm_msg-system.xml`;
  fs.readFile(path.resolve(messageFile), function(err, data) {
    if (err) console.log(err);
    parser.parseString(data, function(err, result) {
      if (err) console.log(err);
      if (data2edit !== result) {
        data2edit = result;
        //   console.dir(data2edit.Node.Node[0].Node[0].$.key)
        for (const x in data2edit.Node.Node[0].Node) msgLangs.push(data2edit.Node.Node[0].Node[x].$.key);
        // getMsgsForLang(msgLangs[currentMsgLang])
        // console.dir(msgLangs)
        // return msgLangs
      }
    });
  });
}
function resetMsgLang() {
  rimraf.sync(`${varDir}/message_replies/`);
  getMsgLangs();
}
function getMsgsForLang(msgLang) {
  currLangMsgs = [];
  for (const x in data2edit.Node.Node[0].Node) {
    if (data2edit.Node.Node[0].Node[x].$.key === msgLang) {
      for (const y in data2edit.Node.Node[0].Node[x].Node) {
        currLangMsgs.push(data2edit.Node.Node[0].Node[x].Node[y].$.value);
        // console.dir(data2edit.Node.Node[0].Node[x].Node[y].$.value)
      }
    }
  }
}
getMsgLangs();

function rebuildMessageXml(msgLang, newMsgs) {
  const builder = new xml2js.Builder({headless: true});
  for (const x in data2edit.Node.Node[0].Node) {
    if (data2edit.Node.Node[0].Node[x].$.key === msgLang) {
      for (const y in data2edit.Node.Node[0].Node[x].Node) {
        data2edit.Node.Node[0].Node[x].Node[y].$.value = newMsgs[y];
        // console.dir(data2edit.Node.Node[0].Node[x].Node[y].$.value)
      }
    }
  }
  const xml = builder.buildObject(data2edit);
  writePresetMessageFile(xml);
}
