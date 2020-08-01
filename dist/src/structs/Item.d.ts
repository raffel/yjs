export function followRedone(store: StructStore, id: ID): {
    item: Item;
    diff: number;
};
export function keepItem(item: Item | null, keep: boolean): void;
export function splitItem(transaction: Transaction, leftItem: Item, diff: number): Item;
export function redoItem(transaction: Transaction, item: Item, redoitems: Set<Item>): Item | null;
/**
 * Abstract class that represents any content.
 */
export class Item extends AbstractStruct {
    /**
     * @param {ID} id
     * @param {Item | null} left
     * @param {ID | null} origin
     * @param {Item | null} right
     * @param {ID | null} rightOrigin
     * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
     * @param {string | null} parentSub
     * @param {AbstractContent} content
     */
    constructor(id: ID, left: Item | null, origin: ID | null, right: Item | null, rightOrigin: ID | null, parent: AbstractType<any> | ID | null, parentSub: string | null, content: AbstractContent);
    /**
     * The item that was originally to the left of this item.
     * @type {ID | null}
     */
    origin: ID | null;
    /**
     * The item that is currently to the left of this item.
     * @type {Item | null}
     */
    left: Item | null;
    /**
     * The item that is currently to the right of this item.
     * @type {Item | null}
     */
    right: Item | null;
    /**
     * The item that was originally to the right of this item.
     * @type {ID | null}
     */
    rightOrigin: ID | null;
    /**
     * @type {AbstractType<any>|ID|null}
     */
    parent: AbstractType<any> | ID | null;
    /**
     * If the parent refers to this item with some kind of key (e.g. YMap, the
     * key is specified here. The key is then used to refer to the list in which
     * to insert this item. If `parentSub = null` type._start is the list in
     * which to insert to. Otherwise it is `parent._map`.
     * @type {String | null}
     */
    parentSub: string | null;
    /**
     * If this type's effect is reundone this type refers to the type that undid
     * this operation.
     * @type {ID | null}
     */
    redone: ID | null;
    /**
     * @type {AbstractContent}
     */
    content: AbstractContent;
    info: number;
    set keep(arg: boolean);
    /**
     * If true, do not garbage collect this Item.
     */
    get keep(): boolean;
    get countable(): boolean;
    markDeleted(): void;
    /**
     * Return the creator clientID of the missing op or define missing items and return null.
     *
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing(transaction: Transaction, store: StructStore): null | number;
    /**
     * Returns the next non-deleted item
     */
    get next(): Item | null;
    /**
     * Returns the previous non-deleted item
     */
    get prev(): Item | null;
    /**
     * Computes the last content address of this Item.
     */
    get lastId(): ID;
    /**
     * Mark this Item as deleted.
     *
     * @param {Transaction} transaction
     */
    delete(transaction: Transaction): void;
    /**
     * @param {StructStore} store
     * @param {boolean} parentGCd
     */
    gc(store: StructStore, parentGCd: boolean): void;
}
/**
 * A lookup map for reading Item content.
 *
 * @type {Array<function(decoding.Decoder):AbstractContent>}
 */
export const contentRefs: Array<(arg0: decoding.Decoder) => AbstractContent>;
/**
 * Do not implement this class!
 */
export class AbstractContent {
    /**
     * @return {number}
     */
    getLength(): number;
    /**
     * @return {Array<any>}
     */
    getContent(): Array<any>;
    /**
     * Should return false if this Item is some kind of meta information
     * (e.g. format information).
     *
     * * Whether this Item should be addressable via `yarray.get(i)`
     * * Whether this Item should be counted when computing yarray.length
     *
     * @return {boolean}
     */
    isCountable(): boolean;
    /**
     * @return {AbstractContent}
     */
    copy(): AbstractContent;
    /**
     * @param {number} offset
     * @return {AbstractContent}
     */
    splice(offset: number): AbstractContent;
    /**
     * @param {AbstractContent} right
     * @return {boolean}
     */
    mergeWith(right: AbstractContent): boolean;
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction: Transaction, item: Item): void;
    /**
     * @param {Transaction} transaction
     */
    delete(transaction: Transaction): void;
    /**
     * @param {StructStore} store
     */
    gc(store: StructStore): void;
    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write(encoder: encoding.Encoder, offset: number): void;
    /**
     * @return {number}
     */
    getRef(): number;
}
export function readItem(decoder: decoding.Decoder, id: ID, info: number, doc: Doc): Item;
import { StructStore } from "../utils/StructStore.js";
import { ID } from "../utils/ID.js";
import { Transaction } from "../utils/Transaction.js";
import { AbstractStruct } from "./AbstractStruct.js";
import { AbstractType } from "../types/AbstractType.js";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import { Doc } from "../utils/Doc.js";
