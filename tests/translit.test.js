/*
 * Latin -> Cyrillic spelling checks. Run with: node tests/translit.test.js
 */
'use strict';

global.window = {};
require('../js/translit.js');
const { toCyrillic } = window.Translit;

const cases = [
    // letters and digraphs
    ["O'zbek", 'Ўзбек'],
    ["g'alaba", 'ғалаба'],
    ['Shirin', 'Ширин'],
    ['choy', 'чой'],
    ['Hoshimjon', 'Ҳошимжон'],
    ['Buxoro', 'Бухоро'],
    ['Samarqand', 'Самарқанд'],
    ['yangi tong', 'янги тонг'],
    // e / э
    ['ertak', 'эртак'],
    ['Bir bor ekan, bir yo\'q ekan', 'Бир бор экан, бир йўқ экан'],
    ['keldi', 'келди'],
    ['poeziya', 'поэзия'],
    ['bahor elchisi', 'баҳор элчиси'],
    // y + vowel
    ["yo'l", 'йўл'],
    ["Yo'q", 'Йўқ'],
    ['yoz', 'ёз'],
    ['ayol', 'аёл'],
    ['Sayohati', 'Саёҳати'],
    ['daryo', 'дарё'],
    ['ayyor', 'айёр'],
    ['yulduz', 'юлдуз'],
    ['kelyapti', 'келяпти'],
    ['yer', 'ер'],
    ['Yetti', 'Етти'],
    ['poyezd', 'поезд'],
    ['qayerga', 'қаерга'],
    ["To'xtaboyev", 'Тўхтабоев'],
    ['obyekt', 'объект'],
    ['Keyingi', 'Кейинги'],
    ['yigit', 'йигит'],
    // tutuq belgisi
    ["ma'no", 'маъно'],
    ["San'at", 'Санъат'],
    ["E'tibor", 'Эътибор'],
    ["qat'iy", 'қатъий'],
    ["mo''jiza", 'мўъжиза'],
    ["Is'hoq", 'Исҳоқ'],
    // words ending in g'
    ["tog' ortida", 'тоғ ортида'],
    ["urug'", 'уруғ'],
    // t + s stays two letters (native conditional forms)
    ['ketsa', 'кетса'],
    ['Mehnatsevarlik', 'Меҳнатсеварлик'],
    // case
    ['SHOH', 'ШОҲ'],
    ["O'ZBEK", 'ЎЗБЕК'],
    ["Zo'r!", 'Зўр!'],
    // loanword exceptions
    ['kompyuter', 'компьютер'],
    ['Oktabr', 'Октябрь'],
    // left alone
    ['3D', '3D'],
    ['12-sahifa', '12-саҳифа'],
    ['«Assalomu alaykum!»', '«Ассалому алайкум!»'],
    ['Кирилл 한국어 ⭐', 'Кирилл 한국어 ⭐'],
];

let failed = 0;
for (const [lat, want] of cases) {
    const got = toCyrillic(lat);
    if (got !== want) {
        failed++;
        console.log(`✗ ${lat} -> ${got} (want ${want})`);
    }
}
console.log(`${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
