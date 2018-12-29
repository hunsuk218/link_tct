
const iconService = new IconService(new HttpProvider("http://127.0.0.1:9000/api/v3"));
console.log(iconService);
const scoreAddress = "cx35d6a348d9adeef024fc04de09ef18d74f552e47";
const wallet = Wallet.load("../keystores/keystore_test1.json", "test1_Account");
console.log(wallet);