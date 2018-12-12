var IconService = require("icon-sdk-js");

const iconService = new IconService(new HttpProvider("http://127.0.0.1:9000/api/v3"));

console.log(iconService.getTotalSupply());