tbears start ../ folder

../keysotres/keystore_test1 password : test1_Account

tbears deploy TCT -k ../keystores/keystore_test1 -c ../config/tbears_cli_config.json
 --> txnhash

tbears txresult [txnhash]
 --> scoreAddress

tbears scoreapi [scoreAddress]
 --> json interface

tbears call -c config/tbears_cli_config.json call/[method].json
