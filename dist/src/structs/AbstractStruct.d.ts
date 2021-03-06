export class AbstractStruct {
    /**
     * @param {ID} id
     * @param {number} length
     */
    constructor(id: ID, length: number);
    id: ID;
    length: number;
    /**
     * @type {boolean}
     */
    get deleted(): boolean;
    /**
     * Merge this struct with the item to the right.
     * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
     * Also this method does *not* remove right from StructStore!
     * @param {AbstractStruct} right
     * @return {boolean} wether this merged with right
     */
    mergeWith(right: AbstractStruct): boolean;
    /**
     * @param {encoding.Encoder} encoder The encoder to write data to.
     * @param {number} offset
     * @param {number} encodingRef
     */
    write(encoder: encoding.Encoder, offset: number, encodingRef: number): void;
    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate(transaction: Transaction, offset: number): void;
}
import { ID } from "../utils/ID.js";
import * as encoding from "lib0/encoding";
import { Transaction } from "../utils/Transaction.js";
