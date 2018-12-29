/*
 * Copyright 2018 ICON Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ConfirmedTransaction from './ConfirmedTransaction';
import { add0xPrefix, addHxPrefix } from '../Hexadecimal';
import { toNumber } from '../Converter';
import { hasProperties } from '../Util';
import { FormatError } from '../../Exception';
import { checkDataInTransaction } from '../Validator';

/**
 * @description Convert confirmed transaction list in block data into the right format.
 */
function toConfirmedTransaction(data) {
	if (!hasProperties(data, [
		'version',
		'from',
		'to',
		'stepLimit',
		'timestamp',
		'nid',
		'txHash',
		'signature',
	]) || !checkDataInTransaction(data)) {
		const error = new FormatError('Confirmed transaction object is invalid.');
		throw error.toString();
	}

	return new ConfirmedTransaction(data);
}

export default class Block {
	constructor(data) {
		this.height = toNumber(data.height);
		this.blockHash = add0xPrefix(data.block_hash);
		this.merkleTreeRootHash = add0xPrefix(data.merkle_tree_root_hash);
		this.prevBlockHash = add0xPrefix(data.prev_block_hash);
		this.peerId = addHxPrefix(data.peer_id);
		this.confirmedTransactionList = (data.confirmed_transaction_list || []).map(
			transaction => toConfirmedTransaction(transaction),
		);
		this.signature = data.signature;
		this.timeStamp = toNumber(data.time_stamp);
		this.version = toNumber(data.version);
	}

	getTransactions() {
		return this.confirmedTransactionList;
	}
}
