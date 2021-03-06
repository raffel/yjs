(function () {
  'use strict';

  /**
   * Utility module to work with Arrays.
   *
   * @module array
   */

  /**
   * Return the last element of an array. The element must exist
   *
   * @template L
   * @param {Array<L>} arr
   * @return {L}
   */
  const last = arr => arr[arr.length - 1];

  /**
   * Append elements from src to dest
   *
   * @template M
   * @param {Array<M>} dest
   * @param {Array<M>} src
   */
  const appendTo = (dest, src) => {
    for (let i = 0; i < src.length; i++) {
      dest.push(src[i]);
    }
  };

  /**
   * Transforms something array-like to an actual Array.
   *
   * @function
   * @template T
   * @param {ArrayLike<T>|Iterable<T>} arraylike
   * @return {T}
   */
  const from = Array.from;

  /**
   * Common Math expressions.
   *
   * @module math
   */

  const floor = Math.floor;
  const ceil = Math.ceil;
  const round = Math.round;
  const log10 = Math.log10;

  /**
   * @function
   * @param {number} a
   * @param {number} b
   * @return {number} The sum of a and b
   */
  const add = (a, b) => a + b;

  /**
   * @function
   * @param {number} a
   * @param {number} b
   * @return {number} The smaller element of a and b
   */
  const min = (a, b) => a < b ? a : b;

  /**
   * @function
   * @param {number} a
   * @param {number} b
   * @return {number} The bigger element of a and b
   */
  const max = (a, b) => a > b ? a : b;
  /**
   * Base 10 exponential function. Returns the value of 10 raised to the power of pow.
   *
   * @param {number} exp
   * @return {number}
   */
  const exp10 = exp => Math.pow(10, exp);

  /**
   * @param {number} n
   * @return {boolean} Wether n is negative. This function also differentiates between -0 and +0
   */
  const isNegativeZero = n => n !== 0 ? n < 0 : 1 / n < 0;

  /**
   * Utility module to work with key-value stores.
   *
   * @module map
   */

  /**
   * Creates a new Map instance.
   *
   * @function
   * @return {Map<any, any>}
   *
   * @function
   */
  const create = () => new Map();

  /**
   * Copy a Map object into a fresh Map object.
   *
   * @function
   * @template X,Y
   * @param {Map<X,Y>} m
   * @return {Map<X,Y>}
   */
  const copy = m => {
    const r = create();
    m.forEach((v, k) => { r.set(k, v); });
    return r
  };

  /**
   * Get map property. Create T if property is undefined and set T on map.
   *
   * ```js
   * const listeners = map.setIfUndefined(events, 'eventName', set.create)
   * listeners.add(listener)
   * ```
   *
   * @function
   * @template T,K
   * @param {Map<K, T>} map
   * @param {K} key
   * @param {function():T} createT
   * @return {T}
   */
  const setIfUndefined = (map, key, createT) => {
    let set = map.get(key);
    if (set === undefined) {
      map.set(key, set = createT());
    }
    return set
  };

  /**
   * Creates an Array and populates it with the content of all key-value pairs using the `f(value, key)` function.
   *
   * @function
   * @template K
   * @template V
   * @template R
   * @param {Map<K,V>} m
   * @param {function(V,K):R} f
   * @return {Array<R>}
   */
  const map = (m, f) => {
    const res = [];
    for (const [key, value] of m) {
      res.push(f(value, key));
    }
    return res
  };

  /**
   * Tests whether any key-value pairs pass the test implemented by `f(value, key)`.
   *
   * @todo should rename to some - similarly to Array.some
   *
   * @function
   * @template K
   * @template V
   * @param {Map<K,V>} m
   * @param {function(V,K):boolean} f
   * @return {boolean}
   */
  const any = (m, f) => {
    for (const [key, value] of m) {
      if (f(value, key)) {
        return true
      }
    }
    return false
  };

  /**
   * Utility module to work with strings.
   *
   * @module string
   */

  const fromCharCode = String.fromCharCode;
  const fromCodePoint = String.fromCodePoint;

  /**
   * @param {string} s
   * @return {string}
   */
  const toLowerCase = s => s.toLowerCase();

  const trimLeftRegex = /^\s*/g;

  /**
   * @param {string} s
   * @return {string}
   */
  const trimLeft = s => s.replace(trimLeftRegex, '');

  const fromCamelCaseRegex = /([A-Z])/g;

  /**
   * @param {string} s
   * @param {string} separator
   * @return {string}
   */
  const fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, match => `${separator}${toLowerCase(match)}`));

  /* istanbul ignore next */
  const utf8TextEncoder = /** @type {TextEncoder} */ (typeof TextEncoder !== 'undefined' ? new TextEncoder() : null);

  /* istanbul ignore next */
  let utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

  /* istanbul ignore next */
  if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
    // Safari doesn't handle BOM correctly.
    // This fixes a bug in Safari 13.0.5 where it produces a BOM the first time it is called.
    // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the first call and
    // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the second call
    // Another issue is that from then on no BOM chars are recognized anymore
    /* istanbul ignore next */
    utf8TextDecoder = null;
  }

  /**
   * Often used conditions.
   *
   * @module conditions
   */

  /**
   * @template T
   * @param {T|null|undefined} v
   * @return {T|null}
   */
  /* istanbul ignore next */
  const undefinedToNull = v => v === undefined ? null : v;

  /* global localStorage */

  /**
   * Isomorphic variable storage.
   *
   * Uses LocalStorage in the browser and falls back to in-memory storage.
   *
   * @module storage
   */

  /* istanbul ignore next */
  class VarStoragePolyfill {
    constructor () {
      this.map = new Map();
    }

    /**
     * @param {string} key
     * @param {any} value
     */
    setItem (key, value) {
      this.map.set(key, value);
    }

    /**
     * @param {string} key
     */
    getItem (key) {
      return this.map.get(key)
    }
  }

  /* istanbul ignore next */
  /**
   * @type {any}
   */
  let _localStorage = new VarStoragePolyfill();

  try {
    // if the same-origin rule is violated, accessing localStorage might thrown an error
    /* istanbul ignore next */
    if (typeof localStorage !== 'undefined') {
      _localStorage = localStorage;
    }
  } catch (e) { }

  /* istanbul ignore next */
  /**
   * This is basically localStorage in browser, or a polyfill in nodejs
   */
  const varStorage = _localStorage;

  /**
   * Isomorphic module to work access the environment (query params, env variables).
   *
   * @module map
   */

  /* istanbul ignore next */
  // @ts-ignore
  const isNode = typeof process !== 'undefined' && process.release && /node|io\.js/.test(process.release.name);
  /* istanbul ignore next */
  const isBrowser = typeof window !== 'undefined' && !isNode;
  /* istanbul ignore next */
  const isMac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

  /**
   * @type {Map<string,string>}
   */
  let params;

  /* istanbul ignore next */
  const computeParams = () => {
    if (params === undefined) {
      if (isNode) {
        params = create();
        const pargs = process.argv;
        let currParamName = null;
        /* istanbul ignore next */
        for (let i = 0; i < pargs.length; i++) {
          const parg = pargs[i];
          if (parg[0] === '-') {
            if (currParamName !== null) {
              params.set(currParamName, '');
            }
            currParamName = parg;
          } else {
            if (currParamName !== null) {
              params.set(currParamName, parg);
              currParamName = null;
            }
          }
        }
        if (currParamName !== null) {
          params.set(currParamName, '');
        }
      } else {
        params = create()
        // eslint-disable-next-line no-undef
        ;(location.search || '?').slice(1).split('&').forEach(kv => {
          if (kv.length !== 0) {
            const [key, value] = kv.split('=');
            params.set(`--${fromCamelCase(key, '-')}`, value);
            params.set(`-${fromCamelCase(key, '-')}`, value);
          }
        });
      }
    }
    return params
  };

  /**
   * @param {string} name
   * @return {boolean}
   */
  /* istanbul ignore next */
  const hasParam = name => computeParams().has(name);

  /**
   * @param {string} name
   * @param {string} defaultVal
   * @return {string}
   */
  /* istanbul ignore next */
  const getParam = (name, defaultVal) => computeParams().get(name) || defaultVal;
  // export const getArgs = name => computeParams() && args

  /**
   * @param {string} name
   * @return {string|null}
   */
  /* istanbul ignore next */
  const getVariable = name => isNode ? undefinedToNull(process.env[name.toUpperCase()]) : undefinedToNull(varStorage.getItem(name));

  /**
   * @param {string} name
   * @return {boolean}
   */
  /* istanbul ignore next */
  const hasConf = name => hasParam('--' + name) || getVariable(name) !== null;

  /* istanbul ignore next */
  const production = hasConf('production');

  /* eslint-env browser */

  /**
   * Binary data constants.
   *
   * @module binary
   */

  /**
   * n-th bit activated.
   *
   * @type {number}
   */
  const BIT1 = 1;
  const BIT2 = 2;
  const BIT3 = 4;
  const BIT6 = 32;
  const BIT7 = 64;
  const BIT8 = 128;
  const BITS5 = 31;
  const BITS6 = 63;
  const BITS7 = 127;
  const BITS31 = 0x7FFFFFFF;
  const BITS32 = 0xFFFFFFFF;

  /**
   * Efficient schema-less binary decoding with support for variable length encoding.
   *
   * Use [lib0/decoding] with [lib0/encoding]. Every encoding function has a corresponding decoding function.
   *
   * Encodes numbers in little-endian order (least to most significant byte order)
   * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
   * which is also used in Protocol Buffers.
   *
   * ```js
   * // encoding step
   * const encoder = new encoding.createEncoder()
   * encoding.writeVarUint(encoder, 256)
   * encoding.writeVarString(encoder, 'Hello world!')
   * const buf = encoding.toUint8Array(encoder)
   * ```
   *
   * ```js
   * // decoding step
   * const decoder = new decoding.createDecoder(buf)
   * decoding.readVarUint(decoder) // => 256
   * decoding.readVarString(decoder) // => 'Hello world!'
   * decoding.hasContent(decoder) // => false - all data is read
   * ```
   *
   * @module decoding
   */

  /**
   * A Decoder handles the decoding of an Uint8Array.
   */
  class Decoder {
    /**
     * @param {Uint8Array} uint8Array Binary data to decode
     */
    constructor (uint8Array) {
      /**
       * Decoding target.
       *
       * @type {Uint8Array}
       */
      this.arr = uint8Array;
      /**
       * Current decoding position.
       *
       * @type {number}
       */
      this.pos = 0;
    }
  }

  /**
   * @function
   * @param {Uint8Array} uint8Array
   * @return {Decoder}
   */
  const createDecoder = uint8Array => new Decoder(uint8Array);

  /**
   * Create an Uint8Array view of the next `len` bytes and advance the position by `len`.
   *
   * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
   *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
   *
   * @function
   * @param {Decoder} decoder The decoder instance
   * @param {number} len The length of bytes to read
   * @return {Uint8Array}
   */
  const readUint8Array = (decoder, len) => {
    const view = createUint8ArrayViewFromArrayBuffer(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
    decoder.pos += len;
    return view
  };

  /**
   * Read variable length Uint8Array.
   *
   * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
   *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
   *
   * @function
   * @param {Decoder} decoder
   * @return {Uint8Array}
   */
  const readVarUint8Array = decoder => readUint8Array(decoder, readVarUint(decoder));

  /**
   * Read one byte as unsigned integer.
   * @function
   * @param {Decoder} decoder The decoder instance
   * @return {number} Unsigned 8-bit integer
   */
  const readUint8 = decoder => decoder.arr[decoder.pos++];

  /**
   * Read unsigned integer (32bit) with variable length.
   * 1/8th of the storage is used as encoding overhead.
   *  * numbers < 2^7 is stored in one bytlength
   *  * numbers < 2^14 is stored in two bylength
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.length
   */
  const readVarUint = decoder => {
    let num = 0;
    let len = 0;
    while (true) {
      const r = decoder.arr[decoder.pos++];
      num = num | ((r & BITS7) << len);
      len += 7;
      if (r < BIT8) {
        return num >>> 0 // return unsigned number!
      }
      /* istanbul ignore if */
      if (len > 35) {
        throw new Error('Integer out of range!')
      }
    }
  };

  /**
   * Read signed integer (32bit) with variable length.
   * 1/8th of the storage is used as encoding overhead.
   *  * numbers < 2^7 is stored in one bytlength
   *  * numbers < 2^14 is stored in two bylength
   * @todo This should probably create the inverse ~num if unmber is negative - but this would be a breaking change.
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.length
   */
  const readVarInt = decoder => {
    let r = decoder.arr[decoder.pos++];
    let num = r & BITS6;
    let len = 6;
    const sign = (r & BIT7) > 0 ? -1 : 1;
    if ((r & BIT8) === 0) {
      // don't continue reading
      return sign * num
    }
    while (true) {
      r = decoder.arr[decoder.pos++];
      num = num | ((r & BITS7) << len);
      len += 7;
      if (r < BIT8) {
        return sign * (num >>> 0)
      }
      /* istanbul ignore if */
      if (len > 41) {
        throw new Error('Integer out of range!')
      }
    }
  };

  /**
   * Read string of variable length
   * * varUint is used to store the length of the string
   *
   * Transforming utf8 to a string is pretty expensive. The code performs 10x better
   * when String.fromCodePoint is fed with all characters as arguments.
   * But most environments have a maximum number of arguments per functions.
   * For effiency reasons we apply a maximum of 10000 characters at once.
   *
   * @function
   * @param {Decoder} decoder
   * @return {String} The read String.
   */
  const readVarString = decoder => {
    let remainingLen = readVarUint(decoder);
    if (remainingLen === 0) {
      return ''
    } else {
      let encodedString = String.fromCodePoint(readUint8(decoder)); // remember to decrease remainingLen
      if (--remainingLen < 100) { // do not create a Uint8Array for small strings
        while (remainingLen--) {
          encodedString += String.fromCodePoint(readUint8(decoder));
        }
      } else {
        while (remainingLen > 0) {
          const nextLen = remainingLen < 10000 ? remainingLen : 10000;
          // this is dangerous, we create a fresh array view from the existing buffer
          const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
          decoder.pos += nextLen;
          // Starting with ES5.1 we can supply a generic array-like object as arguments
          encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes));
          remainingLen -= nextLen;
        }
      }
      return decodeURIComponent(escape(encodedString))
    }
  };

  /**
   * @param {Decoder} decoder
   * @param {number} len
   * @return {DataView}
   */
  const readFromDataView = (decoder, len) => {
    const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
    decoder.pos += len;
    return dv
  };

  /**
   * @param {Decoder} decoder
   */
  const readFloat32 = decoder => readFromDataView(decoder, 4).getFloat32(0);

  /**
   * @param {Decoder} decoder
   */
  const readFloat64 = decoder => readFromDataView(decoder, 8).getFloat64(0);

  /**
   * @param {Decoder} decoder
   */
  const readBigInt64 = decoder => /** @type {any} */ (readFromDataView(decoder, 8)).getBigInt64(0);

  /**
   * @type {Array<function(Decoder):any>}
   */
  const readAnyLookupTable = [
    decoder => undefined, // CASE 127: undefined
    decoder => null, // CASE 126: null
    readVarInt, // CASE 125: integer
    readFloat32, // CASE 124: float32
    readFloat64, // CASE 123: float64
    readBigInt64, // CASE 122: bigint
    decoder => false, // CASE 121: boolean (false)
    decoder => true, // CASE 120: boolean (true)
    readVarString, // CASE 119: string
    decoder => { // CASE 118: object<string,any>
      const len = readVarUint(decoder);
      /**
       * @type {Object<string,any>}
       */
      const obj = {};
      for (let i = 0; i < len; i++) {
        const key = readVarString(decoder);
        obj[key] = readAny(decoder);
      }
      return obj
    },
    decoder => { // CASE 117: array<any>
      const len = readVarUint(decoder);
      const arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(readAny(decoder));
      }
      return arr
    },
    readVarUint8Array // CASE 116: Uint8Array
  ];

  /**
   * @param {Decoder} decoder
   */
  const readAny = decoder => readAnyLookupTable[127 - readUint8(decoder)](decoder);

  /**
   * Utility functions to work with buffers (Uint8Array).
   *
   * @module buffer
   */

  /**
   * @param {number} len
   */
  const createUint8ArrayFromLen = len => new Uint8Array(len);

  /**
   * Create Uint8Array with initial content from buffer
   *
   * @param {ArrayBuffer} buffer
   * @param {number} byteOffset
   * @param {number} length
   */
  const createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length) => new Uint8Array(buffer, byteOffset, length);

  /**
   * Copy the content of an Uint8Array view to a new ArrayBuffer.
   *
   * @param {Uint8Array} uint8Array
   * @return {Uint8Array}
   */
  const copyUint8Array = uint8Array => {
    const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
    newBuf.set(uint8Array);
    return newBuf
  };

  /**
   * Utility helpers for working with numbers.
   *
   * @module number
   */

  /**
   * @module number
   */

  /* istanbul ignore next */
  const isInteger = Number.isInteger || (num => typeof num === 'number' && isFinite(num) && floor(num) === num);

  /**
   * Efficient schema-less binary encoding with support for variable length encoding.
   *
   * Use [lib0/encoding] with [lib0/decoding]. Every encoding function has a corresponding decoding function.
   *
   * Encodes numbers in little-endian order (least to most significant byte order)
   * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
   * which is also used in Protocol Buffers.
   *
   * ```js
   * // encoding step
   * const encoder = new encoding.createEncoder()
   * encoding.writeVarUint(encoder, 256)
   * encoding.writeVarString(encoder, 'Hello world!')
   * const buf = encoding.toUint8Array(encoder)
   * ```
   *
   * ```js
   * // decoding step
   * const decoder = new decoding.createDecoder(buf)
   * decoding.readVarUint(decoder) // => 256
   * decoding.readVarString(decoder) // => 'Hello world!'
   * decoding.hasContent(decoder) // => false - all data is read
   * ```
   *
   * @module encoding
   */

  /**
   * A BinaryEncoder handles the encoding to an Uint8Array.
   */
  class Encoder {
    constructor () {
      this.cpos = 0;
      this.cbuf = new Uint8Array(100);
      /**
       * @type {Array<Uint8Array>}
       */
      this.bufs = [];
    }
  }

  /**
   * @function
   * @return {Encoder}
   */
  const createEncoder = () => new Encoder();

  /**
   * The current length of the encoded data.
   *
   * @function
   * @param {Encoder} encoder
   * @return {number}
   */
  const length = encoder => {
    let len = encoder.cpos;
    for (let i = 0; i < encoder.bufs.length; i++) {
      len += encoder.bufs[i].length;
    }
    return len
  };

  /**
   * Transform to Uint8Array.
   *
   * @function
   * @param {Encoder} encoder
   * @return {Uint8Array} The created ArrayBuffer.
   */
  const toUint8Array = encoder => {
    const uint8arr = new Uint8Array(length(encoder));
    let curPos = 0;
    for (let i = 0; i < encoder.bufs.length; i++) {
      const d = encoder.bufs[i];
      uint8arr.set(d, curPos);
      curPos += d.length;
    }
    uint8arr.set(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
    return uint8arr
  };

  /**
   * Verify that it is possible to write `len` bytes wtihout checking. If
   * necessary, a new Buffer with the required length is attached.
   *
   * @param {Encoder} encoder
   * @param {number} len
   */
  const verifyLen = (encoder, len) => {
    const bufferLen = encoder.cbuf.length;
    if (bufferLen - encoder.cpos < len) {
      encoder.bufs.push(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos));
      encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
      encoder.cpos = 0;
    }
  };

  /**
   * Write one byte to the encoder.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The byte that is to be encoded.
   */
  const write = (encoder, num) => {
    const bufferLen = encoder.cbuf.length;
    if (encoder.cpos === bufferLen) {
      encoder.bufs.push(encoder.cbuf);
      encoder.cbuf = new Uint8Array(bufferLen * 2);
      encoder.cpos = 0;
    }
    encoder.cbuf[encoder.cpos++] = num;
  };

  /**
   * Write one byte as an unsigned integer.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeUint8 = write;

  /**
   * Write a variable length unsigned integer.
   *
   * Encodes integers in the range from [0, 4294967295] / [0, 0xffffffff]. (max 32 bit unsigned integer)
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeVarUint = (encoder, num) => {
    while (num > BITS7) {
      write(encoder, BIT8 | (BITS7 & num));
      num >>>= 7;
    }
    write(encoder, BITS7 & num);
  };

  /**
   * Write a variable length integer.
   *
   * Encodes integers in the range from [-2147483648, -2147483647].
   *
   * We don't use zig-zag encoding because we want to keep the option open
   * to use the same function for BigInt and 53bit integers (doubles).
   *
   * We use the 7th bit instead for signaling that this is a negative number.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeVarInt = (encoder, num) => {
    const isNegative = isNegativeZero(num);
    if (isNegative) {
      num = -num;
    }
    //             |- whether to continue reading         |- whether is negative     |- number
    write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | (BITS6 & num));
    num >>>= 6;
    // We don't need to consider the case of num === 0 so we can use a different
    // pattern here than above.
    while (num > 0) {
      write(encoder, (num > BITS7 ? BIT8 : 0) | (BITS7 & num));
      num >>>= 7;
    }
  };

  /**
   * Write a variable length string.
   *
   * @function
   * @param {Encoder} encoder
   * @param {String} str The string that is to be encoded.
   */
  const writeVarString = (encoder, str) => {
    const encodedString = unescape(encodeURIComponent(str));
    const len = encodedString.length;
    writeVarUint(encoder, len);
    for (let i = 0; i < len; i++) {
      write(encoder, /** @type {number} */ (encodedString.codePointAt(i)));
    }
  };

  /**
   * Append fixed-length Uint8Array to the encoder.
   *
   * @function
   * @param {Encoder} encoder
   * @param {Uint8Array} uint8Array
   */
  const writeUint8Array = (encoder, uint8Array) => {
    const bufferLen = encoder.cbuf.length;
    const cpos = encoder.cpos;
    const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
    const rightCopyLen = uint8Array.length - leftCopyLen;
    encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
    encoder.cpos += leftCopyLen;
    if (rightCopyLen > 0) {
      // Still something to write, write right half..
      // Append new buffer
      encoder.bufs.push(encoder.cbuf);
      // must have at least size of remaining buffer
      encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
      // copy array
      encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
      encoder.cpos = rightCopyLen;
    }
  };

  /**
   * Append an Uint8Array to Encoder.
   *
   * @function
   * @param {Encoder} encoder
   * @param {Uint8Array} uint8Array
   */
  const writeVarUint8Array = (encoder, uint8Array) => {
    writeVarUint(encoder, uint8Array.byteLength);
    writeUint8Array(encoder, uint8Array);
  };

  /**
   * Create an DataView of the next `len` bytes. Use it to write data after
   * calling this function.
   *
   * ```js
   * // write float32 using DataView
   * const dv = writeOnDataView(encoder, 4)
   * dv.setFloat32(0, 1.1)
   * // read float32 using DataView
   * const dv = readFromDataView(encoder, 4)
   * dv.getFloat32(0) // => 1.100000023841858 (leaving it to the reader to find out why this is the correct result)
   * ```
   *
   * @param {Encoder} encoder
   * @param {number} len
   * @return {DataView}
   */
  const writeOnDataView = (encoder, len) => {
    verifyLen(encoder, len);
    const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
    encoder.cpos += len;
    return dview
  };

  /**
   * @param {Encoder} encoder
   * @param {number} num
   */
  const writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num);

  /**
   * @param {Encoder} encoder
   * @param {number} num
   */
  const writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num);

  /**
   * @param {Encoder} encoder
   * @param {bigint} num
   */
  const writeBigInt64 = (encoder, num) => /** @type {any} */ (writeOnDataView(encoder, 8)).setBigInt64(0, num);

  const floatTestBed = new DataView(new ArrayBuffer(4));
  /**
   * Check if a number can be encoded as a 32 bit float.
   *
   * @param {number} num
   * @return {boolean}
   */
  const isFloat32 = num => {
    floatTestBed.setFloat32(0, num);
    return floatTestBed.getFloat32(0) === num
  };

  /**
   * Encode data with efficient binary format.
   *
   * Differences to JSON:
   * • Transforms data to a binary format (not to a string)
   * • Encodes undefined, NaN, and ArrayBuffer (these can't be represented in JSON)
   * • Numbers are efficiently encoded either as a variable length integer, as a
   *   32 bit float, as a 64 bit float, or as a 64 bit bigint.
   *
   * Encoding table:
   *
   * | Data Type           | Prefix   | Encoding Method    | Comment |
   * | ------------------- | -------- | ------------------ | ------- |
   * | undefined           | 127      |                    | Functions, symbol, and everything that cannot be identified is encoded as undefined |
   * | null                | 126      |                    | |
   * | integer             | 125      | writeVarInt        | Only encodes 32 bit signed integers |
   * | float32             | 124      | writeFloat32       | |
   * | float64             | 123      | writeFloat64       | |
   * | bigint              | 122      | writeBigInt64      | |
   * | boolean (false)     | 121      |                    | True and false are different data types so we save the following byte |
   * | boolean (true)      | 120      |                    | - 0b01111000 so the last bit determines whether true or false |
   * | string              | 119      | writeVarString     | |
   * | object<string,any>  | 118      | custom             | Writes {length} then {length} key-value pairs |
   * | array<any>          | 117      | custom             | Writes {length} then {length} json values |
   * | Uint8Array          | 116      | writeVarUint8Array | We use Uint8Array for any kind of binary data |
   *
   * Reasons for the decreasing prefix:
   * We need the first bit for extendability (later we may want to encode the
   * prefix with writeVarUint). The remaining 7 bits are divided as follows:
   * [0-30]   the beginning of the data range is used for custom purposes
   *          (defined by the function that uses this library)
   * [31-127] the end of the data range is used for data encoding by
   *          lib0/encoding.js
   *
   * @param {Encoder} encoder
   * @param {undefined|null|number|bigint|boolean|string|Object<string,any>|Array<any>|Uint8Array} data
   */
  const writeAny = (encoder, data) => {
    switch (typeof data) {
      case 'string':
        // TYPE 119: STRING
        write(encoder, 119);
        writeVarString(encoder, data);
        break
      case 'number':
        if (isInteger(data) && data <= BITS31) {
          // TYPE 125: INTEGER
          write(encoder, 125);
          writeVarInt(encoder, data);
        } else if (isFloat32(data)) {
          // TYPE 124: FLOAT32
          write(encoder, 124);
          writeFloat32(encoder, data);
        } else {
          // TYPE 123: FLOAT64
          write(encoder, 123);
          writeFloat64(encoder, data);
        }
        break
      case 'bigint':
        // TYPE 122: BigInt
        write(encoder, 122);
        writeBigInt64(encoder, data);
        break
      case 'object':
        if (data === null) {
          // TYPE 126: null
          write(encoder, 126);
        } else if (data instanceof Array) {
          // TYPE 117: Array
          write(encoder, 117);
          writeVarUint(encoder, data.length);
          for (let i = 0; i < data.length; i++) {
            writeAny(encoder, data[i]);
          }
        } else if (data instanceof Uint8Array) {
          // TYPE 116: ArrayBuffer
          write(encoder, 116);
          writeVarUint8Array(encoder, data);
        } else {
          // TYPE 118: Object
          write(encoder, 118);
          const keys = Object.keys(data);
          writeVarUint(encoder, keys.length);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            writeVarString(encoder, key);
            writeAny(encoder, data[key]);
          }
        }
        break
      case 'boolean':
        // TYPE 120/121: boolean (true/false)
        write(encoder, data ? 120 : 121);
        break
      default:
        // TYPE 127: undefined
        write(encoder, 127);
    }
  };

  class DeleteItem {
    /**
     * @param {number} clock
     * @param {number} len
     */
    constructor (clock, len) {
      /**
       * @type {number}
       */
      this.clock = clock;
      /**
       * @type {number}
       */
      this.len = len;
    }
  }

  /**
   * We no longer maintain a DeleteStore. DeleteSet is a temporary object that is created when needed.
   * - When created in a transaction, it must only be accessed after sorting, and merging
   *   - This DeleteSet is send to other clients
   * - We do not create a DeleteSet when we send a sync message. The DeleteSet message is created directly from StructStore
   * - We read a DeleteSet as part of a sync/update message. In this case the DeleteSet is already sorted and merged.
   */
  class DeleteSet {
    constructor () {
      /**
       * @type {Map<number,Array<DeleteItem>>}
       */
      this.clients = new Map();
    }
  }

  /**
   * Iterate over all structs that the DeleteSet gc's.
   *
   * @param {Transaction} transaction
   * @param {DeleteSet} ds
   * @param {function(GC|Item):void} f
   *
   * @function
   */
  const iterateDeletedStructs = (transaction, ds, f) =>
    ds.clients.forEach((deletes, clientid) => {
      const structs = /** @type {Array<GC|Item>} */ (transaction.doc.store.clients.get(clientid));
      for (let i = 0; i < deletes.length; i++) {
        const del = deletes[i];
        iterateStructs(transaction, structs, del.clock, del.len, f);
      }
    });

  /**
   * @param {Array<DeleteItem>} dis
   * @param {number} clock
   * @return {number|null}
   *
   * @private
   * @function
   */
  const findIndexDS = (dis, clock) => {
    let left = 0;
    let right = dis.length - 1;
    while (left <= right) {
      const midindex = floor((left + right) / 2);
      const mid = dis[midindex];
      const midclock = mid.clock;
      if (midclock <= clock) {
        if (clock < midclock + mid.len) {
          return midindex
        }
        left = midindex + 1;
      } else {
        right = midindex - 1;
      }
    }
    return null
  };

  /**
   * @param {DeleteSet} ds
   * @param {ID} id
   * @return {boolean}
   *
   * @private
   * @function
   */
  const isDeleted = (ds, id) => {
    const dis = ds.clients.get(id.client);
    return dis !== undefined && findIndexDS(dis, id.clock) !== null
  };

  /**
   * @param {DeleteSet} ds
   *
   * @private
   * @function
   */
  const sortAndMergeDeleteSet = ds => {
    ds.clients.forEach(dels => {
      dels.sort((a, b) => a.clock - b.clock);
      // merge items without filtering or splicing the array
      // i is the current pointer
      // j refers to the current insert position for the pointed item
      // try to merge dels[i] into dels[j-1] or set dels[j]=dels[i]
      let i, j;
      for (i = 1, j = 1; i < dels.length; i++) {
        const left = dels[j - 1];
        const right = dels[i];
        if (left.clock + left.len === right.clock) {
          left.len += right.len;
        } else {
          if (j < i) {
            dels[j] = right;
          }
          j++;
        }
      }
      dels.length = j;
    });
  };

  /**
   * @param {Array<DeleteSet>} dss
   * @return {DeleteSet} A fresh DeleteSet
   */
  const mergeDeleteSets = dss => {
    const merged = new DeleteSet();
    for (let dssI = 0; dssI < dss.length; dssI++) {
      dss[dssI].clients.forEach((delsLeft, client) => {
        if (!merged.clients.has(client)) {
          // Write all missing keys from current ds and all following.
          // If merged already contains `client` current ds has already been added.
          /**
           * @type {Array<DeleteItem>}
           */
          const dels = delsLeft.slice();
          for (let i = dssI + 1; i < dss.length; i++) {
            appendTo(dels, dss[i].clients.get(client) || []);
          }
          merged.clients.set(client, dels);
        }
      });
    }
    sortAndMergeDeleteSet(merged);
    return merged
  };

  /**
   * @param {DeleteSet} ds
   * @param {ID} id
   * @param {number} length
   *
   * @private
   * @function
   */
  const addToDeleteSet = (ds, id, length) => {
    setIfUndefined(ds.clients, id.client, () => []).push(new DeleteItem(id.clock, length));
  };

  const createDeleteSet = () => new DeleteSet();

  /**
   * @param {StructStore} ss
   * @return {DeleteSet} Merged and sorted DeleteSet
   *
   * @private
   * @function
   */
  const createDeleteSetFromStructStore = ss => {
    const ds = createDeleteSet();
    ss.clients.forEach((structs, client) => {
      /**
       * @type {Array<DeleteItem>}
       */
      const dsitems = [];
      for (let i = 0; i < structs.length; i++) {
        const struct = structs[i];
        if (struct.deleted) {
          const clock = struct.id.clock;
          let len = struct.length;
          if (i + 1 < structs.length) {
            for (let next = structs[i + 1]; i + 1 < structs.length && next.id.clock === clock + len && next.deleted; next = structs[++i + 1]) {
              len += next.length;
            }
          }
          dsitems.push(new DeleteItem(clock, len));
        }
      }
      if (dsitems.length > 0) {
        ds.clients.set(client, dsitems);
      }
    });
    return ds
  };

  /**
   * @param {encoding.Encoder} encoder
   * @param {DeleteSet} ds
   *
   * @private
   * @function
   */
  const writeDeleteSet = (encoder, ds) => {
    writeVarUint(encoder, ds.clients.size);
    ds.clients.forEach((dsitems, client) => {
      writeVarUint(encoder, client);
      const len = dsitems.length;
      writeVarUint(encoder, len);
      for (let i = 0; i < len; i++) {
        const item = dsitems[i];
        writeVarUint(encoder, item.clock);
        writeVarUint(encoder, item.len);
      }
    });
  };

  /**
   * @param {decoding.Decoder} decoder
   * @return {DeleteSet}
   *
   * @private
   * @function
   */
  const readDeleteSet = decoder => {
    const ds = new DeleteSet();
    const numClients = readVarUint(decoder);
    for (let i = 0; i < numClients; i++) {
      const client = readVarUint(decoder);
      const numberOfDeletes = readVarUint(decoder);
      for (let i = 0; i < numberOfDeletes; i++) {
        addToDeleteSet(ds, createID(client, readVarUint(decoder)), readVarUint(decoder));
      }
    }
    return ds
  };

  /**
   * @param {decoding.Decoder} decoder
   * @param {Transaction} transaction
   * @param {StructStore} store
   *
   * @private
   * @function
   */
  const readAndApplyDeleteSet = (decoder, transaction, store) => {
    const unappliedDS = new DeleteSet();
    const numClients = readVarUint(decoder);
    for (let i = 0; i < numClients; i++) {
      const client = readVarUint(decoder);
      const numberOfDeletes = readVarUint(decoder);
      const structs = store.clients.get(client) || [];
      const state = getState(store, client);
      for (let i = 0; i < numberOfDeletes; i++) {
        const clock = readVarUint(decoder);
        const len = readVarUint(decoder);
        if (clock < state) {
          if (state < clock + len) {
            addToDeleteSet(unappliedDS, createID(client, state), clock + len - state);
          }
          let index = findIndexSS(structs, clock);
          /**
           * We can ignore the case of GC and Delete structs, because we are going to skip them
           * @type {Item}
           */
          // @ts-ignore
          let struct = structs[index];
          // split the first item if necessary
          if (!struct.deleted && struct.id.clock < clock) {
            structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
            index++; // increase we now want to use the next struct
          }
          while (index < structs.length) {
            // @ts-ignore
            struct = structs[index++];
            if (struct.id.clock < clock + len) {
              if (!struct.deleted) {
                if (clock + len < struct.id.clock + struct.length) {
                  structs.splice(index, 0, splitItem(transaction, struct, clock + len - struct.id.clock));
                }
                struct.delete(transaction);
              }
            } else {
              break
            }
          }
        } else {
          addToDeleteSet(unappliedDS, createID(client, clock), len);
        }
      }
    }
    if (unappliedDS.clients.size > 0) {
      // TODO: no need for encoding+decoding ds anymore
      const unappliedDSEncoder = createEncoder();
      writeDeleteSet(unappliedDSEncoder, unappliedDS);
      store.pendingDeleteReaders.push(createDecoder(toUint8Array(unappliedDSEncoder)));
    }
  };

  /**
   * Utility module to work with sets.
   *
   * @module set
   */

  const create$1 = () => new Set();

  /**
   * Observable class prototype.
   *
   * @module observable
   */

  /**
   * Handles named events.
   *
   * @template N
   */
  class Observable {
    constructor () {
      /**
       * Some desc.
       * @type {Map<N, any>}
       */
      this._observers = create();
    }

    /**
     * @param {N} name
     * @param {function} f
     */
    on (name, f) {
      setIfUndefined(this._observers, name, create$1).add(f);
    }

    /**
     * @param {N} name
     * @param {function} f
     */
    once (name, f) {
      /**
       * @param  {...any} args
       */
      const _f = (...args) => {
        this.off(name, f);
        f(...args);
      };
      this.on(name, _f);
    }

    /**
     * @param {N} name
     * @param {function} f
     */
    off (name, f) {
      const observers = this._observers.get(name);
      if (observers !== undefined) {
        observers.delete(f);
        if (observers.size === 0) {
          this._observers.delete(name);
        }
      }
    }

    /**
     * Emit a named event. All registered event listeners that listen to the
     * specified name will receive the event.
     *
     * @todo This should catch exceptions
     *
     * @param {N} name The event name.
     * @param {Array<any>} args The arguments that are applied to the event listener.
     */
    emit (name, args) {
      // copy all listeners to an array first to make sure that no event is emitted to listeners that are subscribed while the event handler is called.
      return from((this._observers.get(name) || create()).values()).forEach(f => f(...args))
    }

    destroy () {
      this._observers = create();
    }
  }

  /* eslint-env browser */
  const perf = typeof performance === 'undefined' ? null : performance;

  const isoCrypto = typeof crypto === 'undefined' ? null : crypto;

  /**
   * @type {function(number):ArrayBuffer}
   */
  const cryptoRandomBuffer = isoCrypto !== null
    ? len => {
      // browser
      const buf = new ArrayBuffer(len);
      const arr = new Uint8Array(buf);
      isoCrypto.getRandomValues(arr);
      return buf
    }
    : len => {
      // polyfill
      const buf = new ArrayBuffer(len);
      const arr = new Uint8Array(buf);
      for (let i = 0; i < len; i++) {
        arr[i] = Math.ceil((Math.random() * 0xFFFFFFFF) >>> 0);
      }
      return buf
    };

  var performance_1 = perf;
  var cryptoRandomBuffer_1 = cryptoRandomBuffer;

  var isoBrowser = {
  	performance: performance_1,
  	cryptoRandomBuffer: cryptoRandomBuffer_1
  };

  /**
   * Isomorphic library exports from isomorphic.js.
   *
   * @module isomorphic
   */

  const performance$1 = /** @type {any} */ (isoBrowser.performance);
  const cryptoRandomBuffer$1 = /** @type {any} */ (isoBrowser.cryptoRandomBuffer);

  /* istanbul ignore next */
  const uint32 = () => new Uint32Array(cryptoRandomBuffer$1(4))[0];

  /**
   * @module Y
   */

  const generateNewClientId = uint32;

  /**
   * A Yjs instance handles the state of shared data.
   * @extends Observable<string>
   */
  class Doc extends Observable {
    /**
     * @param {Object} conf configuration
     * @param {boolean} [conf.gc] Disable garbage collection (default: gc=true)
     * @param {function(Item):boolean} [conf.gcFilter] Will be called before an Item is garbage collected. Return false to keep the Item.
     */
    constructor ({ gc = true, gcFilter = () => true } = {}) {
      super();
      this.gc = gc;
      this.gcFilter = gcFilter;
      this.clientID = generateNewClientId();
      /**
       * @type {Map<string, AbstractType<YEvent>>}
       */
      this.share = new Map();
      this.store = new StructStore();
      /**
       * @type {Transaction | null}
       */
      this._transaction = null;
      /**
       * @type {Array<Transaction>}
       */
      this._transactionCleanups = [];
    }

    /**
     * Changes that happen inside of a transaction are bundled. This means that
     * the observer fires _after_ the transaction is finished and that all changes
     * that happened inside of the transaction are sent as one message to the
     * other peers.
     *
     * @param {function(Transaction):void} f The function that should be executed as a transaction
     * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
     *
     * @public
     */
    transact (f, origin = null) {
      transact(this, f, origin);
    }

    /**
     * Get a shared data type by name. If it does not yet exist, define its type.
     *
     * Multiple calls of `y.get(name, TypeConstructor)` yield the same result
     * and do not overwrite each other, i.e.
     *   `y.get(name, Y.Array) === y.get(name, Y.Array)`
     *
     * After this method is called, the type is also available on `y.share.get(name)`.
     *
     * *Best Practices:*
     * Define all types right after the Yjs instance is created and store them in a separate object.
     * Also use the typed methods `getText(name)`, `getArray(name)`, `getMap(name)`, etc.
     *
     * @example
     *   const y = new Y(..)
     *   const appState = {
     *     document: y.getText('document')
     *     comments: y.getArray('comments')
     *   }
     *
     * @param {string} name
     * @param {Function} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
     * @return {AbstractType<any>} The created type. Constructed with TypeConstructor
     *
     * @public
     */
    get (name, TypeConstructor = AbstractType) {
      const type = setIfUndefined(this.share, name, () => {
        // @ts-ignore
        const t = new TypeConstructor();
        t._integrate(this, null);
        return t
      });
      const Constr = type.constructor;
      if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
        if (Constr === AbstractType) {
          // @ts-ignore
          const t = new TypeConstructor();
          t._map = type._map;
          type._map.forEach(/** @param {Item?} n */ n => {
            for (; n !== null; n = n.left) {
              // @ts-ignore
              n.parent = t;
            }
          });
          t._start = type._start;
          for (let n = t._start; n !== null; n = n.right) {
            n.parent = t;
          }
          t._length = type._length;
          this.share.set(name, t);
          t._integrate(this, null);
          return t
        } else {
          throw new Error(`Type with the name ${name} has already been defined with a different constructor`)
        }
      }
      return type
    }

    /**
     * @template T
     * @param {string} name
     * @return {YArray<T>}
     *
     * @public
     */
    getArray (name) {
      // @ts-ignore
      return this.get(name, YArray)
    }

    /**
     * @param {string} name
     * @return {YText}
     *
     * @public
     */
    getText (name) {
      // @ts-ignore
      return this.get(name, YText)
    }

    /**
     * @param {string} name
     * @return {YMap<any>}
     *
     * @public
     */
    getMap (name) {
      // @ts-ignore
      return this.get(name, YMap)
    }

    /**
     * @param {string} name
     * @return {YXmlFragment}
     *
     * @public
     */
    getXmlFragment (name) {
      // @ts-ignore
      return this.get(name, YXmlFragment)
    }

    /**
     * Emit `destroy` event and unregister all event handlers.
     */
    destroy () {
      this.emit('destroyed', [true]);
      super.destroy();
    }

    /**
     * @param {string} eventName
     * @param {function} f
     */
    on (eventName, f) {
      super.on(eventName, f);
    }

    /**
     * @param {string} eventName
     * @param {function} f
     */
    off (eventName, f) {
      super.off(eventName, f);
    }
  }

  /**
   * @param {encoding.Encoder} encoder
   * @param {Array<GC|Item>} structs All structs by `client`
   * @param {number} client
   * @param {number} clock write structs starting with `ID(client,clock)`
   *
   * @function
   */
  const writeStructs = (encoder, structs, client, clock) => {
    // write first id
    const startNewStructs = findIndexSS(structs, clock);
    // write # encoded structs
    writeVarUint(encoder, structs.length - startNewStructs);
    writeID(encoder, createID(client, clock));
    const firstStruct = structs[startNewStructs];
    // write first struct with an offset
    firstStruct.write(encoder, clock - firstStruct.id.clock);
    for (let i = startNewStructs + 1; i < structs.length; i++) {
      structs[i].write(encoder, 0);
    }
  };

  /**
   * @param {encoding.Encoder} encoder
   * @param {StructStore} store
   * @param {Map<number,number>} _sm
   *
   * @private
   * @function
   */
  const writeClientsStructs = (encoder, store, _sm) => {
    // we filter all valid _sm entries into sm
    const sm = new Map();
    _sm.forEach((clock, client) => {
      // only write if new structs are available
      if (getState(store, client) > clock) {
        sm.set(client, clock);
      }
    });
    getStateVector(store).forEach((clock, client) => {
      if (!_sm.has(client)) {
        sm.set(client, 0);
      }
    });
    // write # states that were updated
    writeVarUint(encoder, sm.size);
    // Write items with higher client ids first
    // This heavily improves the conflict algorithm.
    Array.from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
      // @ts-ignore
      writeStructs(encoder, store.clients.get(client), client, clock);
    });
  };

  /**
   * @param {decoding.Decoder} decoder The decoder object to read data from.
   * @param {Map<number,Array<GC|Item>>} clientRefs
   * @param {Doc} doc
   * @return {Map<number,Array<GC|Item>>}
   *
   * @private
   * @function
   */
  const readClientsStructRefs = (decoder, clientRefs, doc) => {
    const numOfStateUpdates = readVarUint(decoder);
    for (let i = 0; i < numOfStateUpdates; i++) {
      const numberOfStructs = readVarUint(decoder);
      /**
       * @type {Array<GC|Item>}
       */
      const refs = [];
      let { client, clock } = readID(decoder);
      let info, struct;
      clientRefs.set(client, refs);
      for (let i = 0; i < numberOfStructs; i++) {
        info = readUint8(decoder);
        struct = (BITS5 & info) === 0 ? new GC(createID(client, clock), readVarUint(decoder)) : readItem(decoder, createID(client, clock), info, doc);
        refs.push(struct);
        clock += struct.length;
      }
    }
    return clientRefs
  };

  /**
   * Resume computing structs generated by struct readers.
   *
   * While there is something to do, we integrate structs in this order
   * 1. top element on stack, if stack is not empty
   * 2. next element from current struct reader (if empty, use next struct reader)
   *
   * If struct causally depends on another struct (ref.missing), we put next reader of
   * `ref.id.client` on top of stack.
   *
   * At some point we find a struct that has no causal dependencies,
   * then we start emptying the stack.
   *
   * It is not possible to have circles: i.e. struct1 (from client1) depends on struct2 (from client2)
   * depends on struct3 (from client1). Therefore the max stack size is eqaul to `structReaders.length`.
   *
   * This method is implemented in a way so that we can resume computation if this update
   * causally depends on another update.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   *
   * @private
   * @function
   */
  const resumeStructIntegration = (transaction, store) => {
    const stack = store.pendingStack;
    const clientsStructRefs = store.pendingClientsStructRefs;
    // sort them so that we take the higher id first, in case of conflicts the lower id will probably not conflict with the id from the higher user.
    const clientsStructRefsIds = Array.from(clientsStructRefs.keys()).sort((a, b) => a - b);
    let curStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */ (clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]));
    // iterate over all struct readers until we are done
    while (stack.length !== 0 || clientsStructRefsIds.length > 0) {
      if (stack.length === 0) {
        // take any first struct from clientsStructRefs and put it on the stack
        if (curStructsTarget.i < curStructsTarget.refs.length) {
          stack.push(curStructsTarget.refs[curStructsTarget.i++]);
        } else {
          clientsStructRefsIds.pop();
          if (clientsStructRefsIds.length > 0) {
            curStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */ (clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]));
          }
          continue
        }
      }
      const ref = stack[stack.length - 1];
      const refID = ref.id;
      const client = refID.client;
      const refClock = refID.clock;
      const localClock = getState(store, client);
      const offset = refClock < localClock ? localClock - refClock : 0;
      if (refClock + offset !== localClock) {
        // A previous message from this client is missing
        // check if there is a pending structRef with a smaller clock and switch them
        const structRefs = clientsStructRefs.get(client) || { refs: [], i: 0 };
        if (structRefs.refs.length !== structRefs.i) {
          const r = structRefs.refs[structRefs.i];
          if (r.id.clock < refClock) {
            // put ref with smaller clock on stack instead and continue
            structRefs.refs[structRefs.i] = ref;
            stack[stack.length - 1] = r;
            // sort the set because this approach might bring the list out of order
            structRefs.refs = structRefs.refs.slice(structRefs.i).sort((r1, r2) => r1.id.clock - r2.id.clock);
            structRefs.i = 0;
            continue
          }
        }
        // wait until missing struct is available
        return
      }
      const missing = ref.getMissing(transaction, store);
      if (missing !== null) {
        // get the struct reader that has the missing struct
        const structRefs = clientsStructRefs.get(missing) || { refs: [], i: 0 };
        if (structRefs.refs.length === structRefs.i) {
          // This update message causally depends on another update message.
          return
        }
        stack.push(structRefs.refs[structRefs.i++]);
      } else {
        if (offset < ref.length) {
          ref.integrate(transaction, offset);
        }
        stack.pop();
      }
    }
    store.pendingClientsStructRefs.clear();
  };

  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   *
   * @private
   * @function
   */
  const tryResumePendingDeleteReaders = (transaction, store) => {
    const pendingReaders = store.pendingDeleteReaders;
    store.pendingDeleteReaders = [];
    for (let i = 0; i < pendingReaders.length; i++) {
      readAndApplyDeleteSet(pendingReaders[i], transaction, store);
    }
  };

  /**
   * @param {encoding.Encoder} encoder
   * @param {Transaction} transaction
   *
   * @private
   * @function
   */
  const writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);

  /**
   * @param {StructStore} store
   * @param {Map<number, Array<GC|Item>>} clientsStructsRefs
   *
   * @private
   * @function
   */
  const mergeReadStructsIntoPendingReads = (store, clientsStructsRefs) => {
    const pendingClientsStructRefs = store.pendingClientsStructRefs;
    for (const [client, structRefs] of clientsStructsRefs) {
      const pendingStructRefs = pendingClientsStructRefs.get(client);
      if (pendingStructRefs === undefined) {
        pendingClientsStructRefs.set(client, { refs: structRefs, i: 0 });
      } else {
        // merge into existing structRefs
        const merged = pendingStructRefs.i > 0 ? pendingStructRefs.refs.slice(pendingStructRefs.i) : pendingStructRefs.refs;
        for (let i = 0; i < structRefs.length; i++) {
          merged.push(structRefs[i]);
        }
        pendingStructRefs.i = 0;
        pendingStructRefs.refs = merged.sort((r1, r2) => r1.id.clock - r2.id.clock);
      }
    }
  };

  /**
   * @param {Map<number,{refs:Array<GC|Item>,i:number}>} pendingClientsStructRefs
   */
  const cleanupPendingStructs = pendingClientsStructRefs => {
    // cleanup pendingClientsStructs if not fully finished
    for (const [client, refs] of pendingClientsStructRefs) {
      if (refs.i === refs.refs.length) {
        pendingClientsStructRefs.delete(client);
      } else {
        refs.refs.splice(0, refs.i);
        refs.i = 0;
      }
    }
  };

  /**
   * Read the next Item in a Decoder and fill this Item with the read data.
   *
   * This is called when data is received from a remote peer.
   *
   * @param {decoding.Decoder} decoder The decoder object to read data from.
   * @param {Transaction} transaction
   * @param {StructStore} store
   *
   * @private
   * @function
   */
  const readStructs = (decoder, transaction, store) => {
    const clientsStructRefs = new Map();
    readClientsStructRefs(decoder, clientsStructRefs, transaction.doc);
    mergeReadStructsIntoPendingReads(store, clientsStructRefs);
    resumeStructIntegration(transaction, store);
    cleanupPendingStructs(store.pendingClientsStructRefs);
    tryResumePendingDeleteReaders(transaction, store);
  };

  /**
   * Read and apply a document update.
   *
   * This function has the same effect as `applyUpdate` but accepts an decoder.
   *
   * @param {decoding.Decoder} decoder
   * @param {Doc} ydoc
   * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
   *
   * @function
   */
  const readUpdate = (decoder, ydoc, transactionOrigin) =>
    transact(ydoc, transaction => {
      readStructs(decoder, transaction, ydoc.store);
      readAndApplyDeleteSet(decoder, transaction, ydoc.store);
    }, transactionOrigin, false);

  /**
   * Apply a document update created by, for example, `y.on('update', update => ..)` or `update = encodeStateAsUpdate()`.
   *
   * This function has the same effect as `readUpdate` but accepts an Uint8Array instead of a Decoder.
   *
   * @param {Doc} ydoc
   * @param {Uint8Array} update
   * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
   *
   * @function
   */
  const applyUpdate = (ydoc, update, transactionOrigin) =>
    readUpdate(createDecoder(update), ydoc, transactionOrigin);

  /**
   * Write all the document as a single update message. If you specify the state of the remote client (`targetStateVector`) it will
   * only write the operations that are missing.
   *
   * @param {encoding.Encoder} encoder
   * @param {Doc} doc
   * @param {Map<number,number>} [targetStateVector] The state of the target that receives the update. Leave empty to write all known structs
   *
   * @function
   */
  const writeStateAsUpdate = (encoder, doc, targetStateVector = new Map()) => {
    writeClientsStructs(encoder, doc.store, targetStateVector);
    writeDeleteSet(encoder, createDeleteSetFromStructStore(doc.store));
  };

  /**
   * Write all the document as a single update message that can be applied on the remote document. If you specify the state of the remote client (`targetState`) it will
   * only write the operations that are missing.
   *
   * Use `writeStateAsUpdate` instead if you are working with lib0/encoding.js#Encoder
   *
   * @param {Doc} doc
   * @param {Uint8Array} [encodedTargetStateVector] The state of the target that receives the update. Leave empty to write all known structs
   * @return {Uint8Array}
   *
   * @function
   */
  const encodeStateAsUpdate = (doc, encodedTargetStateVector) => {
    const encoder = createEncoder();
    const targetStateVector = encodedTargetStateVector == null ? new Map() : decodeStateVector(encodedTargetStateVector);
    writeStateAsUpdate(encoder, doc, targetStateVector);
    return toUint8Array(encoder)
  };

  /**
   * Read state vector from Decoder and return as Map
   *
   * @param {decoding.Decoder} decoder
   * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
   *
   * @function
   */
  const readStateVector = decoder => {
    const ss = new Map();
    const ssLength = readVarUint(decoder);
    for (let i = 0; i < ssLength; i++) {
      const client = readVarUint(decoder);
      const clock = readVarUint(decoder);
      ss.set(client, clock);
    }
    return ss
  };

  /**
   * Read decodedState and return State as Map.
   *
   * @param {Uint8Array} decodedState
   * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
   *
   * @function
   */
  const decodeStateVector = decodedState => readStateVector(createDecoder(decodedState));

  /**
   * Write State Vector to `lib0/encoding.js#Encoder`.
   *
   * @param {encoding.Encoder} encoder
   * @param {Map<number,number>} sv
   * @function
   */
  const writeStateVector = (encoder, sv) => {
    writeVarUint(encoder, sv.size);
    sv.forEach((clock, client) => {
      writeVarUint(encoder, client);
      writeVarUint(encoder, clock);
    });
    return encoder
  };

  /**
   * Write State Vector to `lib0/encoding.js#Encoder`.
   *
   * @param {encoding.Encoder} encoder
   * @param {Doc} doc
   *
   * @function
   */
  const writeDocumentStateVector = (encoder, doc) => writeStateVector(encoder, getStateVector(doc.store));

  /**
   * Encode State as Uint8Array.
   *
   * @param {Doc} doc
   * @return {Uint8Array}
   *
   * @function
   */
  const encodeStateVector = doc => {
    const encoder = createEncoder();
    writeDocumentStateVector(encoder, doc);
    return toUint8Array(encoder)
  };

  /**
   * Utility functions for working with EcmaScript objects.
   *
   * @module object
   */

  /**
   * @param {Object<string,any>} obj
   */
  const keys = Object.keys;

  /**
   * @param {Object<string,any>} obj
   * @param {function(any,string):any} f
   */
  const forEach = (obj, f) => {
    for (const key in obj) {
      f(obj[key], key);
    }
  };

  /**
   * @template R
   * @param {Object<string,any>} obj
   * @param {function(any,string):R} f
   * @return {Array<R>}
   */
  const map$1 = (obj, f) => {
    const results = [];
    for (const key in obj) {
      results.push(f(obj[key], key));
    }
    return results
  };

  /**
   * @param {Object<string,any>} obj
   * @return {number}
   */
  const length$1 = obj => keys(obj).length;

  /**
   * @param {Object<string,any>} obj
   * @param {function(any,string):boolean} f
   * @return {boolean}
   */
  const every = (obj, f) => {
    for (const key in obj) {
      if (!f(obj[key], key)) {
        return false
      }
    }
    return true
  };

  /**
   * Calls `Object.prototype.hasOwnProperty`.
   *
   * @param {any} obj
   * @param {string|symbol} key
   * @return {boolean}
   */
  const hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  /**
   * @param {Object<string,any>} a
   * @param {Object<string,any>} b
   * @return {boolean}
   */
  const equalFlat = (a, b) => a === b || (length$1(a) === length$1(b) && every(a, (val, key) => (val !== undefined || hasProperty(b, key)) && b[key] === val));

  /**
   * Common functions and function call helpers.
   *
   * @module function
   */

  /**
   * Calls all functions in `fs` with args. Only throws after all functions were called.
   *
   * @param {Array<function>} fs
   * @param {Array<any>} args
   */
  const callAll = (fs, args, i = 0) => {
    try {
      for (; i < fs.length; i++) {
        fs[i](...args);
      }
    } finally {
      if (i < fs.length) {
        callAll(fs, args, i + 1);
      }
    }
  };

  /**
   * General event handler implementation.
   *
   * @template ARG0, ARG1
   *
   * @private
   */
  class EventHandler {
    constructor () {
      /**
       * @type {Array<function(ARG0, ARG1):void>}
       */
      this.l = [];
    }
  }

  /**
   * @template ARG0,ARG1
   * @returns {EventHandler<ARG0,ARG1>}
   *
   * @private
   * @function
   */
  const createEventHandler = () => new EventHandler();

  /**
   * Adds an event listener that is called when
   * {@link EventHandler#callEventListeners} is called.
   *
   * @template ARG0,ARG1
   * @param {EventHandler<ARG0,ARG1>} eventHandler
   * @param {function(ARG0,ARG1):void} f The event handler.
   *
   * @private
   * @function
   */
  const addEventHandlerListener = (eventHandler, f) =>
    eventHandler.l.push(f);

  /**
   * Removes an event listener.
   *
   * @template ARG0,ARG1
   * @param {EventHandler<ARG0,ARG1>} eventHandler
   * @param {function(ARG0,ARG1):void} f The event handler that was added with
   *                     {@link EventHandler#addEventListener}
   *
   * @private
   * @function
   */
  const removeEventHandlerListener = (eventHandler, f) => {
    eventHandler.l = eventHandler.l.filter(g => f !== g);
  };

  /**
   * Removes all event listeners.
   * @template ARG0,ARG1
   * @param {EventHandler<ARG0,ARG1>} eventHandler
   *
   * @private
   * @function
   */
  const removeAllEventHandlerListeners = eventHandler => {
    eventHandler.l.length = 0;
  };

  /**
   * Call all event listeners that were added via
   * {@link EventHandler#addEventListener}.
   *
   * @template ARG0,ARG1
   * @param {EventHandler<ARG0,ARG1>} eventHandler
   * @param {ARG0} arg0
   * @param {ARG1} arg1
   *
   * @private
   * @function
   */
  const callEventHandlerListeners = (eventHandler, arg0, arg1) =>
    callAll(eventHandler.l, [arg0, arg1]);

  /**
   * Error helpers.
   *
   * @module error
   */

  /**
   * @param {string} s
   * @return {Error}
   */
  /* istanbul ignore next */
  const create$2 = s => new Error(s);

  /**
   * @throws {Error}
   * @return {never}
   */
  /* istanbul ignore next */
  const methodUnimplemented = () => {
    throw create$2('Method unimplemented')
  };

  /**
   * @throws {Error}
   * @return {never}
   */
  /* istanbul ignore next */
  const unexpectedCase = () => {
    throw create$2('Unexpected case')
  };

  class ID {
    /**
     * @param {number} client client id
     * @param {number} clock unique per client id, continuous number
     */
    constructor (client, clock) {
      /**
       * Client id
       * @type {number}
       */
      this.client = client;
      /**
       * unique per client id, continuous number
       * @type {number}
       */
      this.clock = clock;
    }
  }

  /**
   * @param {ID | null} a
   * @param {ID | null} b
   * @return {boolean}
   *
   * @function
   */
  const compareIDs = (a, b) => a === b || (a !== null && b !== null && a.client === b.client && a.clock === b.clock);

  /**
   * @param {number} client
   * @param {number} clock
   *
   * @private
   * @function
   */
  const createID = (client, clock) => new ID(client, clock);

  /**
   * @param {encoding.Encoder} encoder
   * @param {ID} id
   *
   * @private
   * @function
   */
  const writeID = (encoder, id) => {
    writeVarUint(encoder, id.client);
    writeVarUint(encoder, id.clock);
  };

  /**
   * Read ID.
   * * If first varUint read is 0xFFFFFF a RootID is returned.
   * * Otherwise an ID is returned
   *
   * @param {decoding.Decoder} decoder
   * @return {ID}
   *
   * @private
   * @function
   */
  const readID = decoder =>
    createID(readVarUint(decoder), readVarUint(decoder));

  /**
   * The top types are mapped from y.share.get(keyname) => type.
   * `type` does not store any information about the `keyname`.
   * This function finds the correct `keyname` for `type` and throws otherwise.
   *
   * @param {AbstractType<any>} type
   * @return {string}
   *
   * @private
   * @function
   */
  const findRootTypeKey = type => {
    // @ts-ignore _y must be defined, otherwise unexpected case
    for (const [key, value] of type.doc.share) {
      if (value === type) {
        return key
      }
    }
    throw unexpectedCase()
  };

  /**
   * Check if `parent` is a parent of `child`.
   *
   * @param {AbstractType<any>} parent
   * @param {Item|null} child
   * @return {Boolean} Whether `parent` is a parent of `child`.
   *
   * @private
   * @function
   */
  const isParentOf = (parent, child) => {
    while (child !== null) {
      if (child.parent === parent) {
        return true
      }
      child = /** @type {AbstractType<any>} */ (child.parent)._item;
    }
    return false
  };

  class PermanentUserData {
    /**
     * @param {Doc} doc
     * @param {YMap<any>} [storeType]
     */
    constructor (doc, storeType = doc.getMap('users')) {
      /**
       * @type {Map<string,DeleteSet>}
       */
      const dss = new Map();
      this.yusers = storeType;
      this.doc = doc;
      /**
       * Maps from clientid to userDescription
       *
       * @type {Map<number,string>}
       */
      this.clients = new Map();
      this.dss = dss;
      /**
       * @param {YMap<any>} user
       * @param {string} userDescription
       */
      const initUser = (user, userDescription) => {
        /**
         * @type {YArray<Uint8Array>}
         */
        const ds = user.get('ds');
        const ids = user.get('ids');
        const addClientId = /** @param {number} clientid */ clientid => this.clients.set(clientid, userDescription);
        ds.observe(/** @param {YArrayEvent<any>} event */ event => {
          event.changes.added.forEach(item => {
            item.content.getContent().forEach(encodedDs => {
              if (encodedDs instanceof Uint8Array) {
                this.dss.set(userDescription, mergeDeleteSets([this.dss.get(userDescription) || createDeleteSet(), readDeleteSet(createDecoder(encodedDs))]));
              }
            });
          });
        });
        this.dss.set(userDescription, mergeDeleteSets(ds.map(encodedDs => readDeleteSet(createDecoder(encodedDs)))));
        ids.observe(/** @param {YArrayEvent<any>} event */ event =>
          event.changes.added.forEach(item => item.content.getContent().forEach(addClientId))
        );
        ids.forEach(addClientId);
      };
      // observe users
      storeType.observe(event => {
        event.keysChanged.forEach(userDescription =>
          initUser(storeType.get(userDescription), userDescription)
        );
      });
      // add intial data
      storeType.forEach(initUser);
    }

    /**
     * @param {Doc} doc
     * @param {number} clientid
     * @param {string} userDescription
     * @param {Object} [conf]
     * @param {function(Transaction, DeleteSet):boolean} [conf.filter]
     */
    setUserMapping (doc, clientid, userDescription, { filter = () => true } = {}) {
      const users = this.yusers;
      let user = users.get(userDescription);
      if (!user) {
        user = new YMap();
        user.set('ids', new YArray());
        user.set('ds', new YArray());
        users.set(userDescription, user);
      }
      user.get('ids').push([clientid]);
      users.observe(event => {
        setTimeout(() => {
          const userOverwrite = users.get(userDescription);
          if (userOverwrite !== user) {
            // user was overwritten, port all data over to the next user object
            // @todo Experiment with Y.Sets here
            user = userOverwrite;
            // @todo iterate over old type
            this.clients.forEach((_userDescription, clientid) => {
              if (userDescription === _userDescription) {
                user.get('ids').push([clientid]);
              }
            });
            const encoder = createEncoder();
            const ds = this.dss.get(userDescription);
            if (ds) {
              writeDeleteSet(encoder, ds);
              user.get('ds').push([toUint8Array(encoder)]);
            }
          }
        }, 0);
      });
      doc.on('afterTransaction', /** @param {Transaction} transaction */ transaction => {
        setTimeout(() => {
          const yds = user.get('ds');
          const ds = transaction.deleteSet;
          if (transaction.local && ds.clients.size > 0 && filter(transaction, ds)) {
            const encoder = createEncoder();
            writeDeleteSet(encoder, ds);
            yds.push([toUint8Array(encoder)]);
          }
        });
      });
    }

    /**
     * @param {number} clientid
     * @return {any}
     */
    getUserByClientId (clientid) {
      return this.clients.get(clientid) || null
    }

    /**
     * @param {ID} id
     * @return {string | null}
     */
    getUserByDeletedId (id) {
      for (const [userDescription, ds] of this.dss) {
        if (isDeleted(ds, id)) {
          return userDescription
        }
      }
      return null
    }
  }

  /**
   * A relative position is based on the Yjs model and is not affected by document changes.
   * E.g. If you place a relative position before a certain character, it will always point to this character.
   * If you place a relative position at the end of a type, it will always point to the end of the type.
   *
   * A numeric position is often unsuited for user selections, because it does not change when content is inserted
   * before or after.
   *
   * ```Insert(0, 'x')('a|bc') = 'xa|bc'``` Where | is the relative position.
   *
   * One of the properties must be defined.
   *
   * @example
   *   // Current cursor position is at position 10
   *   const relativePosition = createRelativePositionFromIndex(yText, 10)
   *   // modify yText
   *   yText.insert(0, 'abc')
   *   yText.delete(3, 10)
   *   // Compute the cursor position
   *   const absolutePosition = createAbsolutePositionFromRelativePosition(y, relativePosition)
   *   absolutePosition.type === yText // => true
   *   console.log('cursor location is ' + absolutePosition.index) // => cursor location is 3
   *
   */
  class RelativePosition {
    /**
     * @param {ID|null} type
     * @param {string|null} tname
     * @param {ID|null} item
     */
    constructor (type, tname, item) {
      /**
       * @type {ID|null}
       */
      this.type = type;
      /**
       * @type {string|null}
       */
      this.tname = tname;
      /**
       * @type {ID | null}
       */
      this.item = item;
    }
  }

  /**
   * @param {any} json
   * @return {RelativePosition}
   *
   * @function
   */
  const createRelativePositionFromJSON = json => new RelativePosition(json.type == null ? null : createID(json.type.client, json.type.clock), json.tname || null, json.item == null ? null : createID(json.item.client, json.item.clock));

  class AbsolutePosition {
    /**
     * @param {AbstractType<any>} type
     * @param {number} index
     */
    constructor (type, index) {
      /**
       * @type {AbstractType<any>}
       */
      this.type = type;
      /**
       * @type {number}
       */
      this.index = index;
    }
  }

  /**
   * @param {AbstractType<any>} type
   * @param {number} index
   *
   * @function
   */
  const createAbsolutePosition = (type, index) => new AbsolutePosition(type, index);

  /**
   * @param {AbstractType<any>} type
   * @param {ID|null} item
   *
   * @function
   */
  const createRelativePosition = (type, item) => {
    let typeid = null;
    let tname = null;
    if (type._item === null) {
      tname = findRootTypeKey(type);
    } else {
      typeid = createID(type._item.id.client, type._item.id.clock);
    }
    return new RelativePosition(typeid, tname, item)
  };

  /**
   * Create a relativePosition based on a absolute position.
   *
   * @param {AbstractType<any>} type The base type (e.g. YText or YArray).
   * @param {number} index The absolute position.
   * @return {RelativePosition}
   *
   * @function
   */
  const createRelativePositionFromTypeIndex = (type, index) => {
    let t = type._start;
    while (t !== null) {
      if (!t.deleted && t.countable) {
        if (t.length > index) {
          // case 1: found position somewhere in the linked list
          return createRelativePosition(type, createID(t.id.client, t.id.clock + index))
        }
        index -= t.length;
      }
      t = t.right;
    }
    return createRelativePosition(type, null)
  };

  /**
   * @param {encoding.Encoder} encoder
   * @param {RelativePosition} rpos
   *
   * @function
   */
  const writeRelativePosition = (encoder, rpos) => {
    const { type, tname, item } = rpos;
    if (item !== null) {
      writeVarUint(encoder, 0);
      writeID(encoder, item);
    } else if (tname !== null) {
      // case 2: found position at the end of the list and type is stored in y.share
      writeUint8(encoder, 1);
      writeVarString(encoder, tname);
    } else if (type !== null) {
      // case 3: found position at the end of the list and type is attached to an item
      writeUint8(encoder, 2);
      writeID(encoder, type);
    } else {
      throw unexpectedCase()
    }
    return encoder
  };

  /**
   * @param {RelativePosition} rpos
   * @return {Uint8Array}
   */
  const encodeRelativePosition = rpos => {
    const encoder = createEncoder();
    writeRelativePosition(encoder, rpos);
    return toUint8Array(encoder)
  };

  /**
   * @param {decoding.Decoder} decoder
   * @return {RelativePosition|null}
   *
   * @function
   */
  const readRelativePosition = decoder => {
    let type = null;
    let tname = null;
    let itemID = null;
    switch (readVarUint(decoder)) {
      case 0:
        // case 1: found position somewhere in the linked list
        itemID = readID(decoder);
        break
      case 1:
        // case 2: found position at the end of the list and type is stored in y.share
        tname = readVarString(decoder);
        break
      case 2: {
        // case 3: found position at the end of the list and type is attached to an item
        type = readID(decoder);
      }
    }
    return new RelativePosition(type, tname, itemID)
  };

  /**
   * @param {Uint8Array} uint8Array
   * @return {RelativePosition|null}
   */
  const decodeRelativePosition = uint8Array => readRelativePosition(createDecoder(uint8Array));

  /**
   * @param {RelativePosition} rpos
   * @param {Doc} doc
   * @return {AbsolutePosition|null}
   *
   * @function
   */
  const createAbsolutePositionFromRelativePosition = (rpos, doc) => {
    const store = doc.store;
    const rightID = rpos.item;
    const typeID = rpos.type;
    const tname = rpos.tname;
    let type = null;
    let index = 0;
    if (rightID !== null) {
      if (getState(store, rightID.client) <= rightID.clock) {
        return null
      }
      const res = followRedone(store, rightID);
      const right = res.item;
      if (!(right instanceof Item)) {
        return null
      }
      type = /** @type {AbstractType<any>} */ (right.parent);
      if (type._item === null || !type._item.deleted) {
        index = right.deleted || !right.countable ? 0 : res.diff;
        let n = right.left;
        while (n !== null) {
          if (!n.deleted && n.countable) {
            index += n.length;
          }
          n = n.left;
        }
      }
    } else {
      if (tname !== null) {
        type = doc.get(tname);
      } else if (typeID !== null) {
        if (getState(store, typeID.client) <= typeID.clock) {
          // type does not exist yet
          return null
        }
        const { item } = followRedone(store, typeID);
        if (item instanceof Item && item.content instanceof ContentType) {
          type = item.content.type;
        } else {
          // struct is garbage collected
          return null
        }
      } else {
        throw unexpectedCase()
      }
      index = type._length;
    }
    return createAbsolutePosition(type, index)
  };

  /**
   * @param {RelativePosition|null} a
   * @param {RelativePosition|null} b
   *
   * @function
   */
  const compareRelativePositions = (a, b) => a === b || (
    a !== null && b !== null && a.tname === b.tname && compareIDs(a.item, b.item) && compareIDs(a.type, b.type)
  );

  class Snapshot {
    /**
     * @param {DeleteSet} ds
     * @param {Map<number,number>} sv state map
     */
    constructor (ds, sv) {
      /**
       * @type {DeleteSet}
       */
      this.ds = ds;
      /**
       * State Map
       * @type {Map<number,number>}
       */
      this.sv = sv;
    }
  }

  /**
   * @param {Snapshot} snap1
   * @param {Snapshot} snap2
   * @return {boolean}
   */
  const equalSnapshots = (snap1, snap2) => {
    const ds1 = snap1.ds.clients;
    const ds2 = snap2.ds.clients;
    const sv1 = snap1.sv;
    const sv2 = snap2.sv;
    if (sv1.size !== sv2.size || ds1.size !== ds2.size) {
      return false
    }
    for (const [key, value] of sv1) {
      if (sv2.get(key) !== value) {
        return false
      }
    }
    for (const [client, dsitems1] of ds1) {
      const dsitems2 = ds2.get(client) || [];
      if (dsitems1.length !== dsitems2.length) {
        return false
      }
      for (let i = 0; i < dsitems1.length; i++) {
        const dsitem1 = dsitems1[i];
        const dsitem2 = dsitems2[i];
        if (dsitem1.clock !== dsitem2.clock || dsitem1.len !== dsitem2.len) {
          return false
        }
      }
    }
    return true
  };

  /**
   * @param {Snapshot} snapshot
   * @return {Uint8Array}
   */
  const encodeSnapshot = snapshot => {
    const encoder = createEncoder();
    writeDeleteSet(encoder, snapshot.ds);
    writeStateVector(encoder, snapshot.sv);
    return toUint8Array(encoder)
  };

  /**
   * @param {Uint8Array} buf
   * @return {Snapshot}
   */
  const decodeSnapshot = buf => {
    const decoder = createDecoder(buf);
    return new Snapshot(readDeleteSet(decoder), readStateVector(decoder))
  };

  /**
   * @param {DeleteSet} ds
   * @param {Map<number,number>} sm
   * @return {Snapshot}
   */
  const createSnapshot = (ds, sm) => new Snapshot(ds, sm);

  const emptySnapshot = createSnapshot(createDeleteSet(), new Map());

  /**
   * @param {Doc} doc
   * @return {Snapshot}
   */
  const snapshot = doc => createSnapshot(createDeleteSetFromStructStore(doc.store), getStateVector(doc.store));

  /**
   * @param {Item} item
   * @param {Snapshot|undefined} snapshot
   *
   * @protected
   * @function
   */
  const isVisible = (item, snapshot) => snapshot === undefined ? !item.deleted : (
    snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id)
  );

  /**
   * @param {Transaction} transaction
   * @param {Snapshot} snapshot
   */
  const splitSnapshotAffectedStructs = (transaction, snapshot) => {
    const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create$1);
    const store = transaction.doc.store;
    // check if we already split for this snapshot
    if (!meta.has(snapshot)) {
      snapshot.sv.forEach((clock, client) => {
        if (clock < getState(store, client)) {
          getItemCleanStart(transaction, createID(client, clock));
        }
      });
      iterateDeletedStructs(transaction, snapshot.ds, item => {});
      meta.add(snapshot);
    }
  };

  class StructStore {
    constructor () {
      /**
       * @type {Map<number,Array<GC|Item>>}
       */
      this.clients = new Map();
      /**
       * Store incompleted struct reads here
       * `i` denotes to the next read operation
       * We could shift the array of refs instead, but shift is incredible
       * slow in Chrome for arrays with more than 100k elements
       * @see tryResumePendingStructRefs
       * @type {Map<number,{i:number,refs:Array<GC|Item>}>}
       */
      this.pendingClientsStructRefs = new Map();
      /**
       * Stack of pending structs waiting for struct dependencies
       * Maximum length of stack is structReaders.size
       * @type {Array<GC|Item>}
       */
      this.pendingStack = [];
      /**
       * @type {Array<decoding.Decoder>}
       */
      this.pendingDeleteReaders = [];
    }
  }

  /**
   * Return the states as a Map<client,clock>.
   * Note that clock refers to the next expected clock id.
   *
   * @param {StructStore} store
   * @return {Map<number,number>}
   *
   * @public
   * @function
   */
  const getStateVector = store => {
    const sm = new Map();
    store.clients.forEach((structs, client) => {
      const struct = structs[structs.length - 1];
      sm.set(client, struct.id.clock + struct.length);
    });
    return sm
  };

  /**
   * @param {StructStore} store
   * @param {number} client
   * @return {number}
   *
   * @public
   * @function
   */
  const getState = (store, client) => {
    const structs = store.clients.get(client);
    if (structs === undefined) {
      return 0
    }
    const lastStruct = structs[structs.length - 1];
    return lastStruct.id.clock + lastStruct.length
  };

  /**
   * @param {StructStore} store
   *
   * @private
   * @function
   */
  const integretyCheck = store => {
    store.clients.forEach(structs => {
      for (let i = 1; i < structs.length; i++) {
        const l = structs[i - 1];
        const r = structs[i];
        if (l.id.clock + l.length !== r.id.clock) {
          throw new Error('StructStore failed integrety check')
        }
      }
    });
  };

  /**
   * @param {StructStore} store
   * @param {GC|Item} struct
   *
   * @private
   * @function
   */
  const addStruct = (store, struct) => {
    let structs = store.clients.get(struct.id.client);
    if (structs === undefined) {
      structs = [];
      store.clients.set(struct.id.client, structs);
    } else {
      const lastStruct = structs[structs.length - 1];
      if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
        throw unexpectedCase()
      }
    }
    structs.push(struct);
  };

  /**
   * Perform a binary search on a sorted array
   * @param {Array<Item|GC>} structs
   * @param {number} clock
   * @return {number}
   *
   * @private
   * @function
   */
  const findIndexSS = (structs, clock) => {
    let left = 0;
    let right = structs.length - 1;
    let mid = structs[right];
    let midclock = mid.id.clock;
    if (midclock === clock) {
      return right
    }
    // @todo does it even make sense to pivot the search?
    // If a good split misses, it might actually increase the time to find the correct item.
    // Currently, the only advantage is that search with pivoting might find the item on the first try.
    let midindex = floor((clock / (midclock + mid.length - 1)) * right); // pivoting the search
    while (left <= right) {
      mid = structs[midindex];
      midclock = mid.id.clock;
      if (midclock <= clock) {
        if (clock < midclock + mid.length) {
          return midindex
        }
        left = midindex + 1;
      } else {
        right = midindex - 1;
      }
      midindex = floor((left + right) / 2);
    }
    // Always check state before looking for a struct in StructStore
    // Therefore the case of not finding a struct is unexpected
    throw unexpectedCase()
  };

  /**
   * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
   *
   * @param {StructStore} store
   * @param {ID} id
   * @return {GC|Item}
   *
   * @private
   * @function
   */
  const find = (store, id) => {
    /**
     * @type {Array<GC|Item>}
     */
    // @ts-ignore
    const structs = store.clients.get(id.client);
    return structs[findIndexSS(structs, id.clock)]
  };

  /**
   * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
   * @private
   * @function
   */
  const getItem = /** @type {function(StructStore,ID):Item} */ (find);

  /**
   * @param {Transaction} transaction
   * @param {Array<Item|GC>} structs
   * @param {number} clock
   */
  const findIndexCleanStart = (transaction, structs, clock) => {
    const index = findIndexSS(structs, clock);
    const struct = structs[index];
    if (struct.id.clock < clock && struct instanceof Item) {
      structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
      return index + 1
    }
    return index
  };

  /**
   * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
   *
   * @param {Transaction} transaction
   * @param {ID} id
   * @return {Item}
   *
   * @private
   * @function
   */
  const getItemCleanStart = (transaction, id) => {
    const structs = /** @type {Array<Item>} */ (transaction.doc.store.clients.get(id.client));
    return structs[findIndexCleanStart(transaction, structs, id.clock)]
  };

  /**
   * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @param {ID} id
   * @return {Item}
   *
   * @private
   * @function
   */
  const getItemCleanEnd = (transaction, store, id) => {
    /**
     * @type {Array<Item>}
     */
    // @ts-ignore
    const structs = store.clients.get(id.client);
    const index = findIndexSS(structs, id.clock);
    const struct = structs[index];
    if (id.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
      structs.splice(index + 1, 0, splitItem(transaction, struct, id.clock - struct.id.clock + 1));
    }
    return struct
  };

  /**
   * Replace `item` with `newitem` in store
   * @param {StructStore} store
   * @param {GC|Item} struct
   * @param {GC|Item} newStruct
   *
   * @private
   * @function
   */
  const replaceStruct = (store, struct, newStruct) => {
    const structs = /** @type {Array<GC|Item>} */ (store.clients.get(struct.id.client));
    structs[findIndexSS(structs, struct.id.clock)] = newStruct;
  };

  /**
   * Iterate over a range of structs
   *
   * @param {Transaction} transaction
   * @param {Array<Item|GC>} structs
   * @param {number} clockStart Inclusive start
   * @param {number} len
   * @param {function(GC|Item):void} f
   *
   * @function
   */
  const iterateStructs = (transaction, structs, clockStart, len, f) => {
    if (len === 0) {
      return
    }
    const clockEnd = clockStart + len;
    let index = findIndexCleanStart(transaction, structs, clockStart);
    let struct;
    do {
      struct = structs[index++];
      if (clockEnd < struct.id.clock + struct.length) {
        findIndexCleanStart(transaction, structs, clockEnd);
      }
      f(struct);
    } while (index < structs.length && structs[index].id.clock < clockEnd)
  };

  /**
   * Utility module to work with EcmaScript Symbols.
   *
   * @module symbol
   */

  /**
   * Return fresh symbol.
   *
   * @return {Symbol}
   */
  const create$3 = Symbol;

  /**
   * Working with value pairs.
   *
   * @module pair
   */

  /**
   * @template L,R
   */
  class Pair {
    /**
     * @param {L} left
     * @param {R} right
     */
    constructor (left, right) {
      this.left = left;
      this.right = right;
    }
  }

  /**
   * @template L,R
   * @param {L} left
   * @param {R} right
   * @return {Pair<L,R>}
   */
  const create$4 = (left, right) => new Pair(left, right);

  /**
   * @template L,R
   * @param {Array<Pair<L,R>>} arr
   * @param {function(L, R):any} f
   */
  const forEach$1 = (arr, f) => arr.forEach(p => f(p.left, p.right));

  /* eslint-env browser */

  /* istanbul ignore next */
  /**
   * @type {Document}
   */
  const doc = /** @type {Document} */ (typeof document !== 'undefined' ? document : {});

  /**
   * @param {string} name
   * @return {HTMLElement}
   */
  /* istanbul ignore next */
  const createElement = name => doc.createElement(name);

  /**
   * @return {DocumentFragment}
   */
  /* istanbul ignore next */
  const createDocumentFragment = () => doc.createDocumentFragment();

  /**
   * @param {string} text
   * @return {Text}
   */
  /* istanbul ignore next */
  const createTextNode = text => doc.createTextNode(text);

  /* istanbul ignore next */
  const domParser = /** @type {DOMParser} */ (typeof DOMParser !== 'undefined' ? new DOMParser() : null);

  /**
   * @param {Element} el
   * @param {Array<pair.Pair<string,string|boolean>>} attrs Array of key-value pairs
   * @return {Element}
   */
  /* istanbul ignore next */
  const setAttributes = (el, attrs) => {
    forEach$1(attrs, (key, value) => {
      if (value === false) {
        el.removeAttribute(key);
      } else if (value === true) {
        el.setAttribute(key, '');
      } else {
        // @ts-ignore
        el.setAttribute(key, value);
      }
    });
    return el
  };

  /**
   * @param {Array<Node>|HTMLCollection} children
   * @return {DocumentFragment}
   */
  /* istanbul ignore next */
  const fragment = children => {
    const fragment = createDocumentFragment();
    for (let i = 0; i < children.length; i++) {
      appendChild(fragment, children[i]);
    }
    return fragment
  };

  /**
   * @param {Element} parent
   * @param {Array<Node>} nodes
   * @return {Element}
   */
  /* istanbul ignore next */
  const append = (parent, nodes) => {
    appendChild(parent, fragment(nodes));
    return parent
  };

  /**
   * @param {EventTarget} el
   * @param {string} name
   * @param {EventListener} f
   */
  /* istanbul ignore next */
  const addEventListener = (el, name, f) => el.addEventListener(name, f);

  /**
   * @param {string} name
   * @param {Array<pair.Pair<string,string>|pair.Pair<string,boolean>>} attrs Array of key-value pairs
   * @param {Array<Node>} children
   * @return {Element}
   */
  /* istanbul ignore next */
  const element = (name, attrs = [], children = []) =>
    append(setAttributes(createElement(name), attrs), children);

  /**
   * @param {string} t
   * @return {Text}
   */
  /* istanbul ignore next */
  const text = createTextNode;

  /**
   * @param {Map<string,string>} m
   * @return {string}
   */
  /* istanbul ignore next */
  const mapToStyleString = m => map(m, (value, key) => `${key}:${value};`).join('');

  /**
   * @param {Node} parent
   * @param {Node} child
   * @return {Node}
   */
  /* istanbul ignore next */
  const appendChild = (parent, child) => parent.appendChild(child);

  /**
   * JSON utility functions.
   *
   * @module json
   */

  /**
   * Transform JavaScript object to JSON.
   *
   * @param {any} object
   * @return {string}
   */
  const stringify = JSON.stringify;

  /* global requestIdleCallback, requestAnimationFrame, cancelIdleCallback, cancelAnimationFrame */

  /**
   * Utility module to work with EcmaScript's event loop.
   *
   * @module eventloop
   */

  /**
   * @type {Array<function>}
   */
  let queue = [];

  const _runQueue = () => {
    for (let i = 0; i < queue.length; i++) {
      queue[i]();
    }
    queue = [];
  };

  /**
   * @param {function():void} f
   */
  const enqueue = f => {
    queue.push(f);
    if (queue.length === 1) {
      setTimeout(_runQueue, 0);
    }
  };

  /**
   * Utility module to convert metric values.
   *
   * @module metric
   */

  const prefixUp = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  const prefixDown = ['', 'm', 'μ', 'n', 'p', 'f', 'a', 'z', 'y'];

  /**
   * Calculate the metric prefix for a number. Assumes E.g. `prefix(1000) = { n: 1, prefix: 'k' }`
   *
   * @param {number} n
   * @param {number} [baseMultiplier] Multiplier of the base (10^(3*baseMultiplier)). E.g. `convert(time, -3)` if time is already in milli seconds
   * @return {{n:number,prefix:string}}
   */
  const prefix = (n, baseMultiplier = 0) => {
    const nPow = n === 0 ? 0 : log10(n);
    let mult = 0;
    while (nPow < mult * 3 && baseMultiplier > -8) {
      baseMultiplier--;
      mult--;
    }
    while (nPow >= 3 + mult * 3 && baseMultiplier < 8) {
      baseMultiplier++;
      mult++;
    }
    const prefix = baseMultiplier < 0 ? prefixDown[-baseMultiplier] : prefixUp[baseMultiplier];
    return {
      n: round((mult > 0 ? n / exp10(mult * 3) : n * exp10(mult * -3)) * 1e12) / 1e12,
      prefix
    }
  };

  /**
   * Utility module to work with time.
   *
   * @module time
   */

  /**
   * Return current unix time.
   *
   * @return {number}
   */
  const getUnixTime = Date.now;

  /**
   * Transform time (in ms) to a human readable format. E.g. 1100 => 1.1s. 60s => 1min. .001 => 10μs.
   *
   * @param {number} d duration in milliseconds
   * @return {string} humanized approximation of time
   */
  const humanizeDuration = d => {
    if (d < 60000) {
      const p = prefix(d, -1);
      return round(p.n * 100) / 100 + p.prefix + 's'
    }
    d = floor(d / 1000);
    const seconds = d % 60;
    const minutes = floor(d / 60) % 60;
    const hours = floor(d / 3600) % 24;
    const days = floor(d / 86400);
    if (days > 0) {
      return days + 'd' + ((hours > 0 || minutes > 30) ? ' ' + (minutes > 30 ? hours + 1 : hours) + 'h' : '')
    }
    if (hours > 0) {
      /* istanbul ignore next */
      return hours + 'h' + ((minutes > 0 || seconds > 30) ? ' ' + (seconds > 30 ? minutes + 1 : minutes) + 'min' : '')
    }
    return minutes + 'min' + (seconds > 0 ? ' ' + seconds + 's' : '')
  };

  /**
   * Isomorphic logging module with support for colors!
   *
   * @module logging
   */

  const BOLD = create$3();
  const UNBOLD = create$3();
  const BLUE = create$3();
  const GREY = create$3();
  const GREEN = create$3();
  const RED = create$3();
  const PURPLE = create$3();
  const ORANGE = create$3();
  const UNCOLOR = create$3();

  /**
   * @type {Object<Symbol,pair.Pair<string,string>>}
   */
  const _browserStyleMap = {
    [BOLD]: create$4('font-weight', 'bold'),
    [UNBOLD]: create$4('font-weight', 'normal'),
    [BLUE]: create$4('color', 'blue'),
    [GREEN]: create$4('color', 'green'),
    [GREY]: create$4('color', 'grey'),
    [RED]: create$4('color', 'red'),
    [PURPLE]: create$4('color', 'purple'),
    [ORANGE]: create$4('color', 'orange'), // not well supported in chrome when debugging node with inspector - TODO: deprecate
    [UNCOLOR]: create$4('color', 'black')
  };

  const _nodeStyleMap = {
    [BOLD]: '\u001b[1m',
    [UNBOLD]: '\u001b[2m',
    [BLUE]: '\x1b[34m',
    [GREEN]: '\x1b[32m',
    [GREY]: '\u001b[37m',
    [RED]: '\x1b[31m',
    [PURPLE]: '\x1b[35m',
    [ORANGE]: '\x1b[38;5;208m',
    [UNCOLOR]: '\x1b[0m'
  };

  /* istanbul ignore next */
  /**
   * @param {Array<string|Symbol|Object|number>} args
   * @return {Array<string|object|number>}
   */
  const computeBrowserLoggingArgs = args => {
    const strBuilder = [];
    const styles = [];
    const currentStyle = create();
    /**
     * @type {Array<string|Object|number>}
     */
    let logArgs = [];
    // try with formatting until we find something unsupported
    let i = 0;

    for (; i < args.length; i++) {
      const arg = args[i];
      // @ts-ignore
      const style = _browserStyleMap[arg];
      if (style !== undefined) {
        currentStyle.set(style.left, style.right);
      } else {
        if (arg.constructor === String || arg.constructor === Number) {
          const style = mapToStyleString(currentStyle);
          if (i > 0 || style.length > 0) {
            strBuilder.push('%c' + arg);
            styles.push(style);
          } else {
            strBuilder.push(arg);
          }
        } else {
          break
        }
      }
    }

    if (i > 0) {
      // create logArgs with what we have so far
      logArgs = styles;
      logArgs.unshift(strBuilder.join(''));
    }
    // append the rest
    for (; i < args.length; i++) {
      const arg = args[i];
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs
  };

  /**
   * @param {Array<string|Symbol|Object|number>} args
   * @return {Array<string|object|number>}
   */
  const computeNodeLoggingArgs = args => {
    const strBuilder = [];
    const logArgs = [];

    // try with formatting until we find something unsupported
    let i = 0;

    for (; i < args.length; i++) {
      const arg = args[i];
      // @ts-ignore
      const style = _nodeStyleMap[arg];
      if (style !== undefined) {
        strBuilder.push(style);
      } else {
        if (arg.constructor === String || arg.constructor === Number) {
          strBuilder.push(arg);
        } else {
          break
        }
      }
    }
    if (i > 0) {
      // create logArgs with what we have so far
      strBuilder.push('\x1b[0m');
      logArgs.push(strBuilder.join(''));
    }
    // append the rest
    for (; i < args.length; i++) {
      const arg = args[i];
      /* istanbul ignore else */
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs
  };

  /* istanbul ignore next */
  const computeLoggingArgs = isNode ? computeNodeLoggingArgs : computeBrowserLoggingArgs;

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  const print = (...args) => {
    console.log(...computeLoggingArgs(args));
    /* istanbul ignore next */
    vconsoles.forEach(vc => vc.print(args));
  };

  /* istanbul ignore next */
  /**
   * @param {Error} err
   */
  const printError = err => {
    console.error(err);
    vconsoles.forEach(vc => vc.printError(err));
  };

  /* istanbul ignore next */
  /**
   * @param {string} url image location
   * @param {number} height height of the image in pixel
   */
  const printImg = (url, height) => {
    if (isBrowser) {
      console.log('%c                      ', `font-size: ${height}px; background-size: contain; background-repeat: no-repeat; background-image: url(${url})`);
      // console.log('%c                ', `font-size: ${height}x; background: url(${url}) no-repeat;`)
    }
    vconsoles.forEach(vc => vc.printImg(url, height));
  };

  /* istanbul ignore next */
  /**
   * @param {string} base64
   * @param {number} height
   */
  const printImgBase64 = (base64, height) => printImg(`data:image/gif;base64,${base64}`, height);

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  const group = (...args) => {
    console.group(...computeLoggingArgs(args));
    /* istanbul ignore next */
    vconsoles.forEach(vc => vc.group(args));
  };

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  const groupCollapsed = (...args) => {
    console.groupCollapsed(...computeLoggingArgs(args));
    /* istanbul ignore next */
    vconsoles.forEach(vc => vc.groupCollapsed(args));
  };

  const groupEnd = () => {
    console.groupEnd();
    /* istanbul ignore next */
    vconsoles.forEach(vc => vc.groupEnd());
  };

  const vconsoles = new Set();

  /* istanbul ignore next */
  /**
   * @param {Array<string|Symbol|Object|number>} args
   * @return {Array<Element>}
   */
  const _computeLineSpans = args => {
    const spans = [];
    const currentStyle = new Map();
    // try with formatting until we find something unsupported
    let i = 0;
    for (; i < args.length; i++) {
      const arg = args[i];
      // @ts-ignore
      const style = _browserStyleMap[arg];
      if (style !== undefined) {
        currentStyle.set(style.left, style.right);
      } else {
        if (arg.constructor === String || arg.constructor === Number) {
          // @ts-ignore
          const span = element('span', [create$4('style', mapToStyleString(currentStyle))], [text(arg)]);
          if (span.innerHTML === '') {
            span.innerHTML = '&nbsp;';
          }
          spans.push(span);
        } else {
          break
        }
      }
    }
    // append the rest
    for (; i < args.length; i++) {
      let content = args[i];
      if (!(content instanceof Symbol)) {
        if (content.constructor !== String && content.constructor !== Number) {
          content = ' ' + stringify(content) + ' ';
        }
        spans.push(element('span', [], [text(/** @type {string} */ (content))]));
      }
    }
    return spans
  };

  const lineStyle = 'font-family:monospace;border-bottom:1px solid #e2e2e2;padding:2px;';

  /* istanbul ignore next */
  class VConsole {
    /**
     * @param {Element} dom
     */
    constructor (dom) {
      this.dom = dom;
      /**
       * @type {Element}
       */
      this.ccontainer = this.dom;
      this.depth = 0;
      vconsoles.add(this);
    }

    /**
     * @param {Array<string|Symbol|Object|number>} args
     * @param {boolean} collapsed
     */
    group (args, collapsed = false) {
      enqueue(() => {
        const triangleDown = element('span', [create$4('hidden', collapsed), create$4('style', 'color:grey;font-size:120%;')], [text('▼')]);
        const triangleRight = element('span', [create$4('hidden', !collapsed), create$4('style', 'color:grey;font-size:125%;')], [text('▶')]);
        const content = element('div', [create$4('style', `${lineStyle};padding-left:${this.depth * 10}px`)], [triangleDown, triangleRight, text(' ')].concat(_computeLineSpans(args)));
        const nextContainer = element('div', [create$4('hidden', collapsed)]);
        const nextLine = element('div', [], [content, nextContainer]);
        append(this.ccontainer, [nextLine]);
        this.ccontainer = nextContainer;
        this.depth++;
        // when header is clicked, collapse/uncollapse container
        addEventListener(content, 'click', event => {
          nextContainer.toggleAttribute('hidden');
          triangleDown.toggleAttribute('hidden');
          triangleRight.toggleAttribute('hidden');
        });
      });
    }

    /**
     * @param {Array<string|Symbol|Object|number>} args
     */
    groupCollapsed (args) {
      this.group(args, true);
    }

    groupEnd () {
      enqueue(() => {
        if (this.depth > 0) {
          this.depth--;
          // @ts-ignore
          this.ccontainer = this.ccontainer.parentElement.parentElement;
        }
      });
    }

    /**
     * @param {Array<string|Symbol|Object|number>} args
     */
    print (args) {
      enqueue(() => {
        append(this.ccontainer, [element('div', [create$4('style', `${lineStyle};padding-left:${this.depth * 10}px`)], _computeLineSpans(args))]);
      });
    }

    /**
     * @param {Error} err
     */
    printError (err) {
      this.print([RED, BOLD, err.toString()]);
    }

    /**
     * @param {string} url
     * @param {number} height
     */
    printImg (url, height) {
      enqueue(() => {
        append(this.ccontainer, [element('img', [create$4('src', url), create$4('height', `${round(height * 1.5)}px`)])]);
      });
    }

    /**
     * @param {Node} node
     */
    printDom (node) {
      enqueue(() => {
        append(this.ccontainer, [node]);
      });
    }

    destroy () {
      enqueue(() => {
        vconsoles.delete(this);
      });
    }
  }

  /* istanbul ignore next */
  /**
   * @param {Element} dom
   */
  const createVConsole = dom => new VConsole(dom);

  /**
   * A transaction is created for every change on the Yjs model. It is possible
   * to bundle changes on the Yjs model in a single transaction to
   * minimize the number on messages sent and the number of observer calls.
   * If possible the user of this library should bundle as many changes as
   * possible. Here is an example to illustrate the advantages of bundling:
   *
   * @example
   * const map = y.define('map', YMap)
   * // Log content when change is triggered
   * map.observe(() => {
   *   console.log('change triggered')
   * })
   * // Each change on the map type triggers a log message:
   * map.set('a', 0) // => "change triggered"
   * map.set('b', 0) // => "change triggered"
   * // When put in a transaction, it will trigger the log after the transaction:
   * y.transact(() => {
   *   map.set('a', 1)
   *   map.set('b', 1)
   * }) // => "change triggered"
   *
   * @public
   */
  class Transaction {
    /**
     * @param {Doc} doc
     * @param {any} origin
     * @param {boolean} local
     */
    constructor (doc, origin, local) {
      /**
       * The Yjs instance.
       * @type {Doc}
       */
      this.doc = doc;
      /**
       * Describes the set of deleted items by ids
       * @type {DeleteSet}
       */
      this.deleteSet = new DeleteSet();
      /**
       * Holds the state before the transaction started.
       * @type {Map<Number,Number>}
       */
      this.beforeState = getStateVector(doc.store);
      /**
       * Holds the state after the transaction.
       * @type {Map<Number,Number>}
       */
      this.afterState = new Map();
      /**
       * All types that were directly modified (property added or child
       * inserted/deleted). New types are not included in this Set.
       * Maps from type to parentSubs (`item.parentSub = null` for YArray)
       * @type {Map<AbstractType<YEvent>,Set<String|null>>}
       */
      this.changed = new Map();
      /**
       * Stores the events for the types that observe also child elements.
       * It is mainly used by `observeDeep`.
       * @type {Map<AbstractType<YEvent>,Array<YEvent>>}
       */
      this.changedParentTypes = new Map();
      /**
       * @type {Array<AbstractStruct>}
       */
      this._mergeStructs = [];
      /**
       * @type {any}
       */
      this.origin = origin;
      /**
       * Stores meta information on the transaction
       * @type {Map<any,any>}
       */
      this.meta = new Map();
      /**
       * Whether this change originates from this doc.
       * @type {boolean}
       */
      this.local = local;
    }
  }

  /**
   * @param {Transaction} transaction
   */
  const computeUpdateMessageFromTransaction = transaction => {
    if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
      return null
    }
    const encoder = createEncoder();
    sortAndMergeDeleteSet(transaction.deleteSet);
    writeStructsFromTransaction(encoder, transaction);
    writeDeleteSet(encoder, transaction.deleteSet);
    return encoder
  };

  /**
   * @param {Transaction} transaction
   *
   * @private
   * @function
   */
  const nextID = transaction => {
    const y = transaction.doc;
    return createID(y.clientID, getState(y.store, y.clientID))
  };

  /**
   * If `type.parent` was added in current transaction, `type` technically
   * did not change, it was just added and we should not fire events for `type`.
   *
   * @param {Transaction} transaction
   * @param {AbstractType<YEvent>} type
   * @param {string|null} parentSub
   */
  const addChangedTypeToTransaction = (transaction, type, parentSub) => {
    const item = type._item;
    if (item === null || (item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted)) {
      setIfUndefined(transaction.changed, type, create$1).add(parentSub);
    }
  };

  /**
   * @param {Array<AbstractStruct>} structs
   * @param {number} pos
   */
  const tryToMergeWithLeft = (structs, pos) => {
    const left = structs[pos - 1];
    const right = structs[pos];
    if (left.deleted === right.deleted && left.constructor === right.constructor) {
      if (left.mergeWith(right)) {
        structs.splice(pos, 1);
        if (right instanceof Item && right.parentSub !== null && /** @type {AbstractType<any>} */ (right.parent)._map.get(right.parentSub) === right) {
          /** @type {AbstractType<any>} */ (right.parent)._map.set(right.parentSub, /** @type {Item} */ (left));
        }
      }
    }
  };

  /**
   * @param {DeleteSet} ds
   * @param {StructStore} store
   * @param {function(Item):boolean} gcFilter
   */
  const tryGcDeleteSet = (ds, store, gcFilter) => {
    for (const [client, deleteItems] of ds.clients) {
      const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
      for (let di = deleteItems.length - 1; di >= 0; di--) {
        const deleteItem = deleteItems[di];
        const endDeleteItemClock = deleteItem.clock + deleteItem.len;
        for (
          let si = findIndexSS(structs, deleteItem.clock), struct = structs[si];
          si < structs.length && struct.id.clock < endDeleteItemClock;
          struct = structs[++si]
        ) {
          const struct = structs[si];
          if (deleteItem.clock + deleteItem.len <= struct.id.clock) {
            break
          }
          if (struct instanceof Item && struct.deleted && !struct.keep && gcFilter(struct)) {
            struct.gc(store, false);
          }
        }
      }
    }
  };

  /**
   * @param {DeleteSet} ds
   * @param {StructStore} store
   */
  const tryMergeDeleteSet = (ds, store) => {
    // try to merge deleted / gc'd items
    // merge from right to left for better efficiecy and so we don't miss any merge targets
    for (const [client, deleteItems] of ds.clients) {
      const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
      for (let di = deleteItems.length - 1; di >= 0; di--) {
        const deleteItem = deleteItems[di];
        // start with merging the item next to the last deleted item
        const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
        for (
          let si = mostRightIndexToCheck, struct = structs[si];
          si > 0 && struct.id.clock >= deleteItem.clock;
          struct = structs[--si]
        ) {
          tryToMergeWithLeft(structs, si);
        }
      }
    }
  };

  /**
   * @param {DeleteSet} ds
   * @param {StructStore} store
   * @param {function(Item):boolean} gcFilter
   */
  const tryGc = (ds, store, gcFilter) => {
    tryGcDeleteSet(ds, store, gcFilter);
    tryMergeDeleteSet(ds, store);
  };

  /**
   * @param {Array<Transaction>} transactionCleanups
   * @param {number} i
   */
  const cleanupTransactions = (transactionCleanups, i) => {
    if (i < transactionCleanups.length) {
      const transaction = transactionCleanups[i];
      const doc = transaction.doc;
      const store = doc.store;
      const ds = transaction.deleteSet;
      const mergeStructs = transaction._mergeStructs;
      try {
        sortAndMergeDeleteSet(ds);
        transaction.afterState = getStateVector(transaction.doc.store);
        doc._transaction = null;
        doc.emit('beforeObserverCalls', [transaction, doc]);
        /**
         * An array of event callbacks.
         *
         * Each callback is called even if the other ones throw errors.
         *
         * @type {Array<function():void>}
         */
        const fs = [];
        // observe events on changed types
        transaction.changed.forEach((subs, itemtype) =>
          fs.push(() => {
            if (itemtype._item === null || !itemtype._item.deleted) {
              itemtype._callObserver(transaction, subs);
            }
          })
        );
        fs.push(() => {
          // deep observe events
          transaction.changedParentTypes.forEach((events, type) =>
            fs.push(() => {
              // We need to think about the possibility that the user transforms the
              // Y.Doc in the event.
              if (type._item === null || !type._item.deleted) {
                events = events
                  .filter(event =>
                    event.target._item === null || !event.target._item.deleted
                  );
                events
                  .forEach(event => {
                    event.currentTarget = type;
                  });
                // We don't need to check for events.length
                // because we know it has at least one element
                callEventHandlerListeners(type._dEH, events, transaction);
              }
            })
          );
          fs.push(() => doc.emit('afterTransaction', [transaction, doc]));
        });
        callAll(fs, []);
      } finally {
        // Replace deleted items with ItemDeleted / GC.
        // This is where content is actually remove from the Yjs Doc.
        if (doc.gc) {
          tryGcDeleteSet(ds, store, doc.gcFilter);
        }
        tryMergeDeleteSet(ds, store);

        // on all affected store.clients props, try to merge
        for (const [client, clock] of transaction.afterState) {
          const beforeClock = transaction.beforeState.get(client) || 0;
          if (beforeClock !== clock) {
            const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
            // we iterate from right to left so we can safely remove entries
            const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
            for (let i = structs.length - 1; i >= firstChangePos; i--) {
              tryToMergeWithLeft(structs, i);
            }
          }
        }
        // try to merge mergeStructs
        // @todo: it makes more sense to transform mergeStructs to a DS, sort it, and merge from right to left
        //        but at the moment DS does not handle duplicates
        for (let i = 0; i < mergeStructs.length; i++) {
          const { client, clock } = mergeStructs[i].id;
          const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
          const replacedStructPos = findIndexSS(structs, clock);
          if (replacedStructPos + 1 < structs.length) {
            tryToMergeWithLeft(structs, replacedStructPos + 1);
          }
          if (replacedStructPos > 0) {
            tryToMergeWithLeft(structs, replacedStructPos);
          }
        }
        if (!transaction.local && transaction.afterState.get(doc.clientID) !== transaction.beforeState.get(doc.clientID)) {
          doc.clientID = generateNewClientId();
          print(ORANGE, BOLD, '[yjs] ', UNBOLD, RED, 'Changed the client-id because another client seems to be using it.');
        }
        // @todo Merge all the transactions into one and provide send the data as a single update message
        doc.emit('afterTransactionCleanup', [transaction, doc]);
        if (doc._observers.has('update')) {
          const updateMessage = computeUpdateMessageFromTransaction(transaction);
          if (updateMessage !== null) {
            doc.emit('update', [toUint8Array(updateMessage), transaction.origin, doc]);
          }
        }
        if (transactionCleanups.length <= i + 1) {
          doc._transactionCleanups = [];
        } else {
          cleanupTransactions(transactionCleanups, i + 1);
        }
      }
    }
  };

  /**
   * Implements the functionality of `y.transact(()=>{..})`
   *
   * @param {Doc} doc
   * @param {function(Transaction):void} f
   * @param {any} [origin=true]
   *
   * @function
   */
  const transact = (doc, f, origin = null, local = true) => {
    const transactionCleanups = doc._transactionCleanups;
    let initialCall = false;
    if (doc._transaction === null) {
      initialCall = true;
      doc._transaction = new Transaction(doc, origin, local);
      transactionCleanups.push(doc._transaction);
      doc.emit('beforeTransaction', [doc._transaction, doc]);
    }
    try {
      f(doc._transaction);
    } finally {
      if (initialCall && transactionCleanups[0] === doc._transaction) {
        // The first transaction ended, now process observer calls.
        // Observer call may create new transactions for which we need to call the observers and do cleanup.
        // We don't want to nest these calls, so we execute these calls one after
        // another.
        // Also we need to ensure that all cleanups are called, even if the
        // observes throw errors.
        // This file is full of hacky try {} finally {} blocks to ensure that an
        // event can throw errors and also that the cleanup is called.
        cleanupTransactions(transactionCleanups, 0);
      }
    }
  };

  class StackItem {
    /**
     * @param {DeleteSet} ds
     * @param {Map<number,number>} beforeState
     * @param {Map<number,number>} afterState
     */
    constructor (ds, beforeState, afterState) {
      this.ds = ds;
      this.beforeState = beforeState;
      this.afterState = afterState;
      /**
       * Use this to save and restore metadata like selection range
       */
      this.meta = new Map();
    }
  }

  /**
   * @param {UndoManager} undoManager
   * @param {Array<StackItem>} stack
   * @param {string} eventType
   * @return {StackItem?}
   */
  const popStackItem = (undoManager, stack, eventType) => {
    /**
     * Whether a change happened
     * @type {StackItem?}
     */
    let result = null;
    const doc = undoManager.doc;
    const scope = undoManager.scope;
    transact(doc, transaction => {
      while (stack.length > 0 && result === null) {
        const store = doc.store;
        const stackItem = /** @type {StackItem} */ (stack.pop());
        /**
         * @type {Set<Item>}
         */
        const itemsToRedo = new Set();
        /**
         * @type {Array<Item>}
         */
        const itemsToDelete = [];
        let performedChange = false;
        stackItem.afterState.forEach((endClock, client) => {
          const startClock = stackItem.beforeState.get(client) || 0;
          const len = endClock - startClock;
          // @todo iterateStructs should not need the structs parameter
          const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
          if (startClock !== endClock) {
            // make sure structs don't overlap with the range of created operations [stackItem.start, stackItem.start + stackItem.end)
            // this must be executed before deleted structs are iterated.
            getItemCleanStart(transaction, createID(client, startClock));
            if (endClock < getState(doc.store, client)) {
              getItemCleanStart(transaction, createID(client, endClock));
            }
            iterateStructs(transaction, structs, startClock, len, struct => {
              if (struct instanceof Item) {
                if (struct.redone !== null) {
                  let { item, diff } = followRedone(store, struct.id);
                  if (diff > 0) {
                    item = getItemCleanStart(transaction, createID(item.id.client, item.id.clock + diff));
                  }
                  if (item.length > len) {
                    getItemCleanStart(transaction, createID(item.id.client, endClock));
                  }
                  struct = item;
                }
                if (!struct.deleted && scope.some(type => isParentOf(type, /** @type {Item} */ (struct)))) {
                  itemsToDelete.push(struct);
                }
              }
            });
          }
        });
        iterateDeletedStructs(transaction, stackItem.ds, struct => {
          const id = struct.id;
          const clock = id.clock;
          const client = id.client;
          const startClock = stackItem.beforeState.get(client) || 0;
          const endClock = stackItem.afterState.get(client) || 0;
          if (
            struct instanceof Item &&
            scope.some(type => isParentOf(type, struct)) &&
            // Never redo structs in [stackItem.start, stackItem.start + stackItem.end) because they were created and deleted in the same capture interval.
            !(clock >= startClock && clock < endClock)
          ) {
            itemsToRedo.add(struct);
          }
        });
        itemsToRedo.forEach(struct => {
          performedChange = redoItem(transaction, struct, itemsToRedo) !== null || performedChange;
        });
        // We want to delete in reverse order so that children are deleted before
        // parents, so we have more information available when items are filtered.
        for (let i = itemsToDelete.length - 1; i >= 0; i--) {
          const item = itemsToDelete[i];
          if (undoManager.deleteFilter(item)) {
            item.delete(transaction);
            performedChange = true;
          }
        }
        result = stackItem;
        if (result != null) {
          undoManager.emit('stack-item-popped', [{ stackItem: result, type: eventType }, undoManager]);
        }
      }
    }, undoManager);
    return result
  };

  /**
   * @typedef {Object} UndoManagerOptions
   * @property {number} [UndoManagerOptions.captureTimeout=500]
   * @property {function(Item):boolean} [UndoManagerOptions.deleteFilter=()=>true] Sometimes
   * it is necessary to filter whan an Undo/Redo operation can delete. If this
   * filter returns false, the type/item won't be deleted even it is in the
   * undo/redo scope.
   * @property {Set<any>} [UndoManagerOptions.trackedOrigins=new Set([null])]
   */

  /**
   * Fires 'stack-item-added' event when a stack item was added to either the undo- or
   * the redo-stack. You may store additional stack information via the
   * metadata property on `event.stackItem.meta` (it is a `Map` of metadata properties).
   * Fires 'stack-item-popped' event when a stack item was popped from either the
   * undo- or the redo-stack. You may restore the saved stack information from `event.stackItem.meta`.
   *
   * @extends {Observable<'stack-item-added'|'stack-item-popped'>}
   */
  class UndoManager extends Observable {
    /**
     * @param {AbstractType<any>|Array<AbstractType<any>>} typeScope Accepts either a single type, or an array of types
     * @param {UndoManagerOptions} options
     */
    constructor (typeScope, { captureTimeout, deleteFilter = () => true, trackedOrigins = new Set([null]) } = {}) {
      if (captureTimeout == null) {
        captureTimeout = 500;
      }
      super();
      this.scope = typeScope instanceof Array ? typeScope : [typeScope];
      this.deleteFilter = deleteFilter;
      trackedOrigins.add(this);
      this.trackedOrigins = trackedOrigins;
      /**
       * @type {Array<StackItem>}
       */
      this.undoStack = [];
      /**
       * @type {Array<StackItem>}
       */
      this.redoStack = [];
      /**
       * Whether the client is currently undoing (calling UndoManager.undo)
       *
       * @type {boolean}
       */
      this.undoing = false;
      this.redoing = false;
      this.doc = /** @type {Doc} */ (this.scope[0].doc);
      this.lastChange = 0;
      this.doc.on('afterTransaction', /** @param {Transaction} transaction */ transaction => {
        // Only track certain transactions
        if (!this.scope.some(type => transaction.changedParentTypes.has(type)) || (!this.trackedOrigins.has(transaction.origin) && (!transaction.origin || !this.trackedOrigins.has(transaction.origin.constructor)))) {
          return
        }
        const undoing = this.undoing;
        const redoing = this.redoing;
        const stack = undoing ? this.redoStack : this.undoStack;
        if (undoing) {
          this.stopCapturing(); // next undo should not be appended to last stack item
        } else if (!redoing) {
          // neither undoing nor redoing: delete redoStack
          this.redoStack = [];
        }
        const beforeState = transaction.beforeState;
        const afterState = transaction.afterState;
        const now = getUnixTime();
        if (now - this.lastChange < captureTimeout && stack.length > 0 && !undoing && !redoing) {
          // append change to last stack op
          const lastOp = stack[stack.length - 1];
          lastOp.ds = mergeDeleteSets([lastOp.ds, transaction.deleteSet]);
          lastOp.afterState = afterState;
        } else {
          // create a new stack op
          stack.push(new StackItem(transaction.deleteSet, beforeState, afterState));
        }
        if (!undoing && !redoing) {
          this.lastChange = now;
        }
        // make sure that deleted structs are not gc'd
        iterateDeletedStructs(transaction, transaction.deleteSet, /** @param {Item|GC} item */ item => {
          if (item instanceof Item && this.scope.some(type => isParentOf(type, item))) {
            keepItem(item, true);
          }
        });
        this.emit('stack-item-added', [{ stackItem: stack[stack.length - 1], origin: transaction.origin, type: undoing ? 'redo' : 'undo' }, this]);
      });
    }

    clear () {
      this.doc.transact(transaction => {
        /**
         * @param {StackItem} stackItem
         */
        const clearItem = stackItem => {
          iterateDeletedStructs(transaction, stackItem.ds, item => {
            if (item instanceof Item && this.scope.some(type => isParentOf(type, item))) {
              keepItem(item, false);
            }
          });
        };
        this.undoStack.forEach(clearItem);
        this.redoStack.forEach(clearItem);
      });
      this.undoStack = [];
      this.redoStack = [];
    }

    /**
     * UndoManager merges Undo-StackItem if they are created within time-gap
     * smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next
     * StackItem won't be merged.
     *
     *
     * @example
     *     // without stopCapturing
     *     ytext.insert(0, 'a')
     *     ytext.insert(1, 'b')
     *     um.undo()
     *     ytext.toString() // => '' (note that 'ab' was removed)
     *     // with stopCapturing
     *     ytext.insert(0, 'a')
     *     um.stopCapturing()
     *     ytext.insert(0, 'b')
     *     um.undo()
     *     ytext.toString() // => 'a' (note that only 'b' was removed)
     *
     */
    stopCapturing () {
      this.lastChange = 0;
    }

    /**
     * Undo last changes on type.
     *
     * @return {StackItem?} Returns StackItem if a change was applied
     */
    undo () {
      this.undoing = true;
      let res;
      try {
        res = popStackItem(this, this.undoStack, 'undo');
      } finally {
        this.undoing = false;
      }
      return res
    }

    /**
     * Redo last undo operation.
     *
     * @return {StackItem?} Returns StackItem if a change was applied
     */
    redo () {
      this.redoing = true;
      let res;
      try {
        res = popStackItem(this, this.redoStack, 'redo');
      } finally {
        this.redoing = false;
      }
      return res
    }
  }

  /**
   * YEvent describes the changes on a YType.
   */
  class YEvent {
    /**
     * @param {AbstractType<any>} target The changed type.
     * @param {Transaction} transaction
     */
    constructor (target, transaction) {
      /**
       * The type on which this event was created on.
       * @type {AbstractType<any>}
       */
      this.target = target;
      /**
       * The current target on which the observe callback is called.
       * @type {AbstractType<any>}
       */
      this.currentTarget = target;
      /**
       * The transaction that triggered this event.
       * @type {Transaction}
       */
      this.transaction = transaction;
      /**
       * @type {Object|null}
       */
      this._changes = null;
    }

    /**
     * Computes the path from `y` to the changed type.
     *
     * The following property holds:
     * @example
     *   let type = y
     *   event.path.forEach(dir => {
     *     type = type.get(dir)
     *   })
     *   type === event.target // => true
     */
    get path () {
      // @ts-ignore _item is defined because target is integrated
      return getPathTo(this.currentTarget, this.target)
    }

    /**
     * Check if a struct is deleted by this event.
     *
     * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
     *
     * @param {AbstractStruct} struct
     * @return {boolean}
     */
    deletes (struct) {
      return isDeleted(this.transaction.deleteSet, struct.id)
    }

    /**
     * Check if a struct is added by this event.
     *
     * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
     *
     * @param {AbstractStruct} struct
     * @return {boolean}
     */
    adds (struct) {
      return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0)
    }

    /**
     * @return {{added:Set<Item>,deleted:Set<Item>,delta:Array<{insert:Array<any>}|{delete:number}|{retain:number}>}}
     */
    get changes () {
      let changes = this._changes;
      if (changes === null) {
        const target = this.target;
        const added = create$1();
        const deleted = create$1();
        /**
         * @type {Array<{insert:Array<any>}|{delete:number}|{retain:number}>}
         */
        const delta = [];
        /**
         * @type {Map<string,{ action: 'add' | 'update' | 'delete', oldValue: any}>}
         */
        const keys = new Map();
        changes = {
          added, deleted, delta, keys
        };
        const changed = /** @type Set<string|null> */ (this.transaction.changed.get(target));
        if (changed.has(null)) {
          /**
           * @type {any}
           */
          let lastOp = null;
          const packOp = () => {
            if (lastOp) {
              delta.push(lastOp);
            }
          };
          for (let item = target._start; item !== null; item = item.right) {
            if (item.deleted) {
              if (this.deletes(item) && !this.adds(item)) {
                if (lastOp === null || lastOp.delete === undefined) {
                  packOp();
                  lastOp = { delete: 0 };
                }
                lastOp.delete += item.length;
                deleted.add(item);
              } // else nop
            } else {
              if (this.adds(item)) {
                if (lastOp === null || lastOp.insert === undefined) {
                  packOp();
                  lastOp = { insert: [] };
                }
                lastOp.insert = lastOp.insert.concat(item.content.getContent());
                added.add(item);
              } else {
                if (lastOp === null || lastOp.retain === undefined) {
                  packOp();
                  lastOp = { retain: 0 };
                }
                lastOp.retain += item.length;
              }
            }
          }
          if (lastOp !== null && lastOp.retain === undefined) {
            packOp();
          }
        }
        changed.forEach(key => {
          if (key !== null) {
            const item = /** @type {Item} */ (target._map.get(key));
            /**
             * @type {'delete' | 'add' | 'update'}
             */
            let action;
            let oldValue;
            if (this.adds(item)) {
              let prev = item.left;
              while (prev !== null && this.adds(prev)) {
                prev = prev.left;
              }
              if (this.deletes(item)) {
                if (prev !== null && this.deletes(prev)) {
                  action = 'delete';
                  oldValue = last(prev.content.getContent());
                } else {
                  return
                }
              } else {
                if (prev !== null && this.deletes(prev)) {
                  action = 'update';
                  oldValue = last(prev.content.getContent());
                } else {
                  action = 'add';
                  oldValue = undefined;
                }
              }
            } else {
              if (this.deletes(item)) {
                action = 'delete';
                oldValue = last(/** @type {Item} */ item.content.getContent());
              } else {
                return // nop
              }
            }
            keys.set(key, { action, oldValue });
          }
        });
        this._changes = changes;
      }
      return /** @type {any} */ (changes)
    }
  }

  /**
   * Compute the path from this type to the specified target.
   *
   * @example
   *   // `child` should be accessible via `type.get(path[0]).get(path[1])..`
   *   const path = type.getPathTo(child)
   *   // assuming `type instanceof YArray`
   *   console.log(path) // might look like => [2, 'key1']
   *   child === type.get(path[0]).get(path[1])
   *
   * @param {AbstractType<any>} parent
   * @param {AbstractType<any>} child target
   * @return {Array<string|number>} Path to the target
   *
   * @private
   * @function
   */
  const getPathTo = (parent, child) => {
    const path = [];
    while (child._item !== null && child !== parent) {
      if (child._item.parentSub !== null) {
        // parent is map-ish
        path.unshift(child._item.parentSub);
      } else {
        // parent is array-ish
        let i = 0;
        let c = /** @type {AbstractType<any>} */ (child._item.parent)._start;
        while (c !== child._item && c !== null) {
          if (!c.deleted) {
            i++;
          }
          c = c.right;
        }
        path.unshift(i);
      }
      child = /** @type {AbstractType<any>} */ (child._item.parent);
    }
    return path
  };

  /**
   * Utility module to create and manipulate Iterators.
   *
   * @module iterator
   */

  /**
   * @template T
   * @param {function():IteratorResult<T>} next
   * @return {IterableIterator<T>}
   */
  const createIterator = next => ({
    /**
     * @return {IterableIterator<T>}
     */
    [Symbol.iterator] () {
      return this
    },
    // @ts-ignore
    next
  });

  /**
   * @template T
   * @param {Iterator<T>} iterator
   * @param {function(T):boolean} filter
   */
  const iteratorFilter = (iterator, filter) => createIterator(() => {
    let res;
    do {
      res = iterator.next();
    } while (!res.done && !filter(res.value))
    return res
  });

  /**
   * @template T,M
   * @param {Iterator<T>} iterator
   * @param {function(T):M} fmap
   */
  const iteratorMap = (iterator, fmap) => createIterator(() => {
    const { done, value } = iterator.next();
    return { done, value: done ? undefined : fmap(value) }
  });

  /**
   * Accumulate all (list) children of a type and return them as an Array.
   *
   * @param {AbstractType<any>} t
   * @return {Array<Item>}
   */
  const getTypeChildren = t => {
    let s = t._start;
    const arr = [];
    while (s) {
      arr.push(s);
      s = s.right;
    }
    return arr
  };

  /**
   * Call event listeners with an event. This will also add an event to all
   * parents (for `.observeDeep` handlers).
   *
   * @template EventType
   * @param {AbstractType<EventType>} type
   * @param {Transaction} transaction
   * @param {EventType} event
   */
  const callTypeObservers = (type, transaction, event) => {
    const changedType = type;
    const changedParentTypes = transaction.changedParentTypes;
    while (true) {
      // @ts-ignore
      setIfUndefined(changedParentTypes, type, () => []).push(event);
      if (type._item === null) {
        break
      }
      type = /** @type {AbstractType<any>} */ (type._item.parent);
    }
    callEventHandlerListeners(changedType._eH, event, transaction);
  };

  /**
   * @template EventType
   * Abstract Yjs Type class
   */
  class AbstractType {
    constructor () {
      /**
       * @type {Item|null}
       */
      this._item = null;
      /**
       * @type {Map<string,Item>}
       */
      this._map = new Map();
      /**
       * @type {Item|null}
       */
      this._start = null;
      /**
       * @type {Doc|null}
       */
      this.doc = null;
      this._length = 0;
      /**
       * Event handlers
       * @type {EventHandler<EventType,Transaction>}
       */
      this._eH = createEventHandler();
      /**
       * Deep event handlers
       * @type {EventHandler<Array<YEvent>,Transaction>}
       */
      this._dEH = createEventHandler();
    }

    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item|null} item
     */
    _integrate (y, item) {
      this.doc = y;
      this._item = item;
    }

    /**
     * @return {AbstractType<EventType>}
     */
    _copy () {
      throw methodUnimplemented()
    }

    /**
     * @param {encoding.Encoder} encoder
     */
    _write (encoder) { }

    /**
     * The first non-deleted item
     */
    get _first () {
      let n = this._start;
      while (n !== null && n.deleted) {
        n = n.right;
      }
      return n
    }

    /**
     * Creates YEvent and calls all type observers.
     * Must be implemented by each type.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver (transaction, parentSubs) { /* skip if no type is specified */ }

    /**
     * Observe all events that are created on this type.
     *
     * @param {function(EventType, Transaction):void} f Observer function
     */
    observe (f) {
      addEventHandlerListener(this._eH, f);
    }

    /**
     * Observe all events that are created by this type and its children.
     *
     * @param {function(Array<YEvent>,Transaction):void} f Observer function
     */
    observeDeep (f) {
      addEventHandlerListener(this._dEH, f);
    }

    /**
     * Unregister an observer function.
     *
     * @param {function(EventType,Transaction):void} f Observer function
     */
    unobserve (f) {
      removeEventHandlerListener(this._eH, f);
    }

    /**
     * Unregister an observer function.
     *
     * @param {function(Array<YEvent>,Transaction):void} f Observer function
     */
    unobserveDeep (f) {
      removeEventHandlerListener(this._dEH, f);
    }

    /**
     * @abstract
     * @return {any}
     */
    toJSON () {}
  }

  /**
   * @param {AbstractType<any>} type
   * @return {Array<any>}
   *
   * @private
   * @function
   */
  const typeListToArray = type => {
    const cs = [];
    let n = type._start;
    while (n !== null) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          cs.push(c[i]);
        }
      }
      n = n.right;
    }
    return cs
  };

  /**
   * @param {AbstractType<any>} type
   * @param {Snapshot} snapshot
   * @return {Array<any>}
   *
   * @private
   * @function
   */
  const typeListToArraySnapshot = (type, snapshot) => {
    const cs = [];
    let n = type._start;
    while (n !== null) {
      if (n.countable && isVisible(n, snapshot)) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          cs.push(c[i]);
        }
      }
      n = n.right;
    }
    return cs
  };

  /**
   * Executes a provided function on once on overy element of this YArray.
   *
   * @param {AbstractType<any>} type
   * @param {function(any,number,any):void} f A function to execute on every element of this YArray.
   *
   * @private
   * @function
   */
  const typeListForEach = (type, f) => {
    let index = 0;
    let n = type._start;
    while (n !== null) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          f(c[i], index++, type);
        }
      }
      n = n.right;
    }
  };

  /**
   * @template C,R
   * @param {AbstractType<any>} type
   * @param {function(C,number,AbstractType<any>):R} f
   * @return {Array<R>}
   *
   * @private
   * @function
   */
  const typeListMap = (type, f) => {
    /**
     * @type {Array<any>}
     */
    const result = [];
    typeListForEach(type, (c, i) => {
      result.push(f(c, i, type));
    });
    return result
  };

  /**
   * @param {AbstractType<any>} type
   * @return {IterableIterator<any>}
   *
   * @private
   * @function
   */
  const typeListCreateIterator = type => {
    let n = type._start;
    /**
     * @type {Array<any>|null}
     */
    let currentContent = null;
    let currentContentIndex = 0;
    return {
      [Symbol.iterator] () {
        return this
      },
      next: () => {
        // find some content
        if (currentContent === null) {
          while (n !== null && n.deleted) {
            n = n.right;
          }
          // check if we reached the end, no need to check currentContent, because it does not exist
          if (n === null) {
            return {
              done: true,
              value: undefined
            }
          }
          // we found n, so we can set currentContent
          currentContent = n.content.getContent();
          currentContentIndex = 0;
          n = n.right; // we used the content of n, now iterate to next
        }
        const value = currentContent[currentContentIndex++];
        // check if we need to empty currentContent
        if (currentContent.length <= currentContentIndex) {
          currentContent = null;
        }
        return {
          done: false,
          value
        }
      }
    }
  };

  /**
   * Executes a provided function on once on overy element of this YArray.
   * Operates on a snapshotted state of the document.
   *
   * @param {AbstractType<any>} type
   * @param {function(any,number,AbstractType<any>):void} f A function to execute on every element of this YArray.
   * @param {Snapshot} snapshot
   *
   * @private
   * @function
   */
  const typeListForEachSnapshot = (type, f, snapshot) => {
    let index = 0;
    let n = type._start;
    while (n !== null) {
      if (n.countable && isVisible(n, snapshot)) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          f(c[i], index++, type);
        }
      }
      n = n.right;
    }
  };

  /**
   * @param {AbstractType<any>} type
   * @param {number} index
   * @return {any}
   *
   * @private
   * @function
   */
  const typeListGet = (type, index) => {
    for (let n = type._start; n !== null; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index < n.length) {
          return n.content.getContent()[index]
        }
        index -= n.length;
      }
    }
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {Item?} referenceItem
   * @param {Array<Object<string,any>|Array<any>|boolean|number|string|Uint8Array>} content
   *
   * @private
   * @function
   */
  const typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
    let left = referenceItem;
    const doc = transaction.doc;
    const ownClientId = doc.clientID;
    const store = doc.store;
    const right = referenceItem === null ? parent._start : referenceItem.right;
    /**
     * @type {Array<Object|Array<any>|number>}
     */
    let jsonContent = [];
    const packJsonContent = () => {
      if (jsonContent.length > 0) {
        left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
        left.integrate(transaction, 0);
        jsonContent = [];
      }
    };
    content.forEach(c => {
      switch (c.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          jsonContent.push(c);
          break
        default:
          packJsonContent();
          switch (c.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(/** @type {Uint8Array} */ (c))));
              left.integrate(transaction, 0);
              break
            default:
              if (c instanceof AbstractType) {
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                left.integrate(transaction, 0);
              } else {
                throw new Error('Unexpected content type in insert operation')
              }
          }
      }
    });
    packJsonContent();
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {number} index
   * @param {Array<Object<string,any>|Array<any>|number|string|Uint8Array>} content
   *
   * @private
   * @function
   */
  const typeListInsertGenerics = (transaction, parent, index, content) => {
    if (index === 0) {
      return typeListInsertGenericsAfter(transaction, parent, null, content)
    }
    let n = parent._start;
    for (; n !== null; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index <= n.length) {
          if (index < n.length) {
            // insert in-between
            getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
          }
          break
        }
        index -= n.length;
      }
    }
    return typeListInsertGenericsAfter(transaction, parent, n, content)
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {number} index
   * @param {number} length
   *
   * @private
   * @function
   */
  const typeListDelete = (transaction, parent, index, length) => {
    if (length === 0) { return }
    let n = parent._start;
    // compute the first item to be deleted
    for (; n !== null && index > 0; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        index -= n.length;
      }
    }
    // delete all items until done
    while (length > 0 && n !== null) {
      if (!n.deleted) {
        if (length < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length));
        }
        n.delete(transaction);
        length -= n.length;
      }
      n = n.right;
    }
    if (length > 0) {
      throw create$2('array length exceeded')
    }
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {string} key
   *
   * @private
   * @function
   */
  const typeMapDelete = (transaction, parent, key) => {
    const c = parent._map.get(key);
    if (c !== undefined) {
      c.delete(transaction);
    }
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {string} key
   * @param {Object|number|Array<any>|string|Uint8Array|AbstractType<any>} value
   *
   * @private
   * @function
   */
  const typeMapSet = (transaction, parent, key, value) => {
    const left = parent._map.get(key) || null;
    const doc = transaction.doc;
    const ownClientId = doc.clientID;
    let content;
    if (value == null) {
      content = new ContentAny([value]);
    } else {
      switch (value.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          content = new ContentAny([value]);
          break
        case Uint8Array:
          content = new ContentBinary(/** @type {Uint8Array} */ (value));
          break
        default:
          if (value instanceof AbstractType) {
            content = new ContentType(value);
          } else {
            throw new Error('Unexpected content type')
          }
      }
    }
    new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
  };

  /**
   * @param {AbstractType<any>} parent
   * @param {string} key
   * @return {Object<string,any>|number|Array<any>|string|Uint8Array|AbstractType<any>|undefined}
   *
   * @private
   * @function
   */
  const typeMapGet = (parent, key) => {
    const val = parent._map.get(key);
    return val !== undefined && !val.deleted ? val.content.getContent()[val.length - 1] : undefined
  };

  /**
   * @param {AbstractType<any>} parent
   * @return {Object<string,Object<string,any>|number|Array<any>|string|Uint8Array|AbstractType<any>|undefined>}
   *
   * @private
   * @function
   */
  const typeMapGetAll = (parent) => {
    /**
     * @type {Object<string,any>}
     */
    const res = {};
    for (const [key, value] of parent._map) {
      if (!value.deleted) {
        res[key] = value.content.getContent()[value.length - 1];
      }
    }
    return res
  };

  /**
   * @param {AbstractType<any>} parent
   * @param {string} key
   * @return {boolean}
   *
   * @private
   * @function
   */
  const typeMapHas = (parent, key) => {
    const val = parent._map.get(key);
    return val !== undefined && !val.deleted
  };

  /**
   * @param {AbstractType<any>} parent
   * @param {string} key
   * @param {Snapshot} snapshot
   * @return {Object<string,any>|number|Array<any>|string|Uint8Array|AbstractType<any>|undefined}
   *
   * @private
   * @function
   */
  const typeMapGetSnapshot = (parent, key, snapshot) => {
    let v = parent._map.get(key) || null;
    while (v !== null && (!snapshot.sv.has(v.id.client) || v.id.clock >= (snapshot.sv.get(v.id.client) || 0))) {
      v = v.left;
    }
    return v !== null && isVisible(v, snapshot) ? v.content.getContent()[v.length - 1] : undefined
  };

  /**
   * @param {Map<string,Item>} map
   * @return {IterableIterator<Array<any>>}
   *
   * @private
   * @function
   */
  const createMapIterator = map => iteratorFilter(map.entries(), /** @param {any} entry */ entry => !entry[1].deleted);

  /**
   * @module YArray
   */

  /**
   * Event that describes the changes on a YArray
   * @template T
   */
  class YArrayEvent extends YEvent {
    /**
     * @param {YArray<T>} yarray The changed type
     * @param {Transaction} transaction The transaction object
     */
    constructor (yarray, transaction) {
      super(yarray, transaction);
      this._transaction = transaction;
    }
  }

  /**
   * A shared Array implementation.
   * @template T
   * @extends AbstractType<YArrayEvent<T>>
   * @implements {Iterable<T>}
   */
  class YArray extends AbstractType {
    constructor () {
      super();
      /**
       * @type {Array<any>?}
       * @private
       */
      this._prelimContent = [];
    }

    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate (y, item) {
      super._integrate(y, item);
      this.insert(0, /** @type {Array<any>} */ (this._prelimContent));
      this._prelimContent = null;
    }

    _copy () {
      return new YArray()
    }

    get length () {
      return this._prelimContent === null ? this._length : this._prelimContent.length
    }

    /**
     * Creates YArrayEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver (transaction, parentSubs) {
      callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
    }

    /**
     * Inserts new content at an index.
     *
     * Important: This function expects an array of content. Not just a content
     * object. The reason for this "weirdness" is that inserting several elements
     * is very efficient when it is done as a single operation.
     *
     * @example
     *  // Insert character 'a' at position 0
     *  yarray.insert(0, ['a'])
     *  // Insert numbers 1, 2 at position 1
     *  yarray.insert(1, [1, 2])
     *
     * @param {number} index The index to insert content at.
     * @param {Array<T>} content The array of content
     */
    insert (index, content) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          typeListInsertGenerics(transaction, this, index, content);
        });
      } else {
        /** @type {Array<any>} */ (this._prelimContent).splice(index, 0, ...content);
      }
    }

    /**
     * Appends content to this YArray.
     *
     * @param {Array<T>} content Array of content to append.
     */
    push (content) {
      this.insert(this.length, content);
    }

    /**
     * Preppends content to this YArray.
     *
     * @param {Array<T>} content Array of content to preppend.
     */
    unshift (content) {
      this.insert(0, content);
    }

    /**
     * Deletes elements starting from an index.
     *
     * @param {number} index Index at which to start deleting elements
     * @param {number} length The number of elements to remove. Defaults to 1.
     */
    delete (index, length = 1) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          typeListDelete(transaction, this, index, length);
        });
      } else {
        /** @type {Array<any>} */ (this._prelimContent).splice(index, length);
      }
    }

    /**
     * Returns the i-th element from a YArray.
     *
     * @param {number} index The index of the element to return from the YArray
     * @return {T}
     */
    get (index) {
      return typeListGet(this, index)
    }

    /**
     * Transforms this YArray to a JavaScript Array.
     *
     * @return {Array<T>}
     */
    toArray () {
      return typeListToArray(this)
    }

    /**
     * Transforms this Shared Type to a JSON object.
     *
     * @return {Array<any>}
     */
    toJSON () {
      return this.map(c => c instanceof AbstractType ? c.toJSON() : c)
    }

    /**
     * Returns an Array with the result of calling a provided function on every
     * element of this YArray.
     *
     * @template T,M
     * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
     * @return {Array<M>} A new array with each element being the result of the
     *                 callback function
     */
    map (f) {
      return typeListMap(this, /** @type {any} */ (f))
    }

    /**
     * Executes a provided function on once on overy element of this YArray.
     *
     * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
     */
    forEach (f) {
      typeListForEach(this, f);
    }

    /**
     * @return {IterableIterator<T>}
     */
    [Symbol.iterator] () {
      return typeListCreateIterator(this)
    }

    /**
     * @param {encoding.Encoder} encoder
     */
    _write (encoder) {
      writeVarUint(encoder, YArrayRefID);
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   *
   * @private
   * @function
   */
  const readYArray = decoder => new YArray();

  /**
   * @template T
   * Event that describes the changes on a YMap.
   */
  class YMapEvent extends YEvent {
    /**
     * @param {YMap<T>} ymap The YArray that changed.
     * @param {Transaction} transaction
     * @param {Set<any>} subs The keys that changed.
     */
    constructor (ymap, transaction, subs) {
      super(ymap, transaction);
      this.keysChanged = subs;
    }
  }

  /**
   * @template T number|string|Object|Array|Uint8Array
   * A shared Map implementation.
   *
   * @extends AbstractType<YMapEvent<T>>
   * @implements {Iterable<T>}
   */
  class YMap extends AbstractType {
    /**
     *
     * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
     */
    constructor (entries) {
      super();
      /**
       * @type {Map<string,any>?}
       * @private
       */
      this._prelimContent = null;

      if (entries === undefined) {
        this._prelimContent = new Map();
      } else {
        this._prelimContent = new Map(entries);
      }
    }

    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate (y, item) {
      super._integrate(y, item);
      for (const [key, value] of /** @type {Map<string, any>} */ (this._prelimContent)) {
        this.set(key, value);
      }
      this._prelimContent = null;
    }

    _copy () {
      return new YMap()
    }

    /**
     * Creates YMapEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver (transaction, parentSubs) {
      callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
    }

    /**
     * Transforms this Shared Type to a JSON object.
     *
     * @return {Object<string,T>}
     */
    toJSON () {
      /**
       * @type {Object<string,T>}
       */
      const map = {};
      for (const [key, item] of this._map) {
        if (!item.deleted) {
          const v = item.content.getContent()[item.length - 1];
          map[key] = v instanceof AbstractType ? v.toJSON() : v;
        }
      }
      return map
    }

    /**
     * Returns the size of the YMap (count of key/value pairs)
     *
     * @return {number}
     */
    get size () {
      return [...createMapIterator(this._map)].length
    }

    /**
     * Returns the keys for each element in the YMap Type.
     *
     * @return {IterableIterator<string>}
     */
    keys () {
      return iteratorMap(createMapIterator(this._map), /** @param {any} v */ v => v[0])
    }

    /**
     * Returns the keys for each element in the YMap Type.
     *
     * @return {IterableIterator<string>}
     */
    values () {
      return iteratorMap(createMapIterator(this._map), /** @param {any} v */ v => v[1].content.getContent()[v[1].length - 1])
    }

    /**
     * Returns an Iterator of [key, value] pairs
     *
     * @return {IterableIterator<any>}
     */
    entries () {
      return iteratorMap(createMapIterator(this._map), /** @param {any} v */ v => [v[0], v[1].content.getContent()[v[1].length - 1]])
    }

    /**
     * Executes a provided function on once on every key-value pair.
     *
     * @param {function(T,string,YMap<T>):void} f A function to execute on every element of this YArray.
     */
    forEach (f) {
      /**
       * @type {Object<string,T>}
       */
      const map = {};
      for (const [key, item] of this._map) {
        if (!item.deleted) {
          f(item.content.getContent()[item.length - 1], key, this);
        }
      }
      return map
    }

    /**
     * @return {IterableIterator<T>}
     */
    [Symbol.iterator] () {
      return this.entries()
    }

    /**
     * Remove a specified element from this YMap.
     *
     * @param {string} key The key of the element to remove.
     */
    delete (key) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          typeMapDelete(transaction, this, key);
        });
      } else {
        /** @type {Map<string, any>} */ (this._prelimContent).delete(key);
      }
    }

    /**
     * Adds or updates an element with a specified key and value.
     *
     * @param {string} key The key of the element to add to this YMap
     * @param {T} value The value of the element to add
     */
    set (key, value) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          typeMapSet(transaction, this, key, value);
        });
      } else {
        /** @type {Map<string, any>} */ (this._prelimContent).set(key, value);
      }
      return value
    }

    /**
     * Returns a specified element from this YMap.
     *
     * @param {string} key
     * @return {T|undefined}
     */
    get (key) {
      return /** @type {any} */ (typeMapGet(this, key))
    }

    /**
     * Returns a boolean indicating whether the specified key exists or not.
     *
     * @param {string} key The key to test.
     * @return {boolean}
     */
    has (key) {
      return typeMapHas(this, key)
    }

    /**
     * @param {encoding.Encoder} encoder
     */
    _write (encoder) {
      writeVarUint(encoder, YMapRefID);
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   *
   * @private
   * @function
   */
  const readYMap = decoder => new YMap();

  /**
   * @param {any} a
   * @param {any} b
   * @return {boolean}
   */
  const equalAttrs = (a, b) => a === b || (typeof a === 'object' && typeof b === 'object' && a && b && equalFlat(a, b));

  class ItemListPosition {
    /**
     * @param {Item|null} left
     * @param {Item|null} right
     */
    constructor (left, right) {
      this.left = left;
      this.right = right;
    }
  }

  class ItemTextListPosition extends ItemListPosition {
    /**
     * @param {Item|null} left
     * @param {Item|null} right
     * @param {Map<string,any>} currentAttributes
     */
    constructor (left, right, currentAttributes) {
      super(left, right);
      this.currentAttributes = currentAttributes;
    }
  }

  class ItemInsertionResult extends ItemListPosition {
    /**
     * @param {Item|null} left
     * @param {Item|null} right
     * @param {Map<string,any>} negatedAttributes
     */
    constructor (left, right, negatedAttributes) {
      super(left, right);
      this.negatedAttributes = negatedAttributes;
    }
  }

  /**
   * @param {Transaction} transaction
   * @param {Map<string,any>} currentAttributes
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} count
   * @return {ItemTextListPosition}
   *
   * @private
   * @function
   */
  const findNextPosition = (transaction, currentAttributes, left, right, count) => {
    while (right !== null && count > 0) {
      switch (right.content.constructor) {
        case ContentEmbed:
        case ContentString:
          if (!right.deleted) {
            if (count < right.length) {
              // split right
              getItemCleanStart(transaction, createID(right.id.client, right.id.clock + count));
            }
            count -= right.length;
          }
          break
        case ContentFormat:
          if (!right.deleted) {
            updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (right.content));
          }
          break
      }
      left = right;
      right = right.right;
    }
    return new ItemTextListPosition(left, right, currentAttributes)
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {number} index
   * @return {ItemTextListPosition}
   *
   * @private
   * @function
   */
  const findPosition = (transaction, parent, index) => {
    const currentAttributes = new Map();
    const right = parent._start;
    return findNextPosition(transaction, currentAttributes, null, right, index)
  };

  /**
   * Negate applied formats
   *
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {ItemListPosition} currPos
   * @param {Map<string,any>} negatedAttributes
   *
   * @private
   * @function
   */
  const insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
    let { left, right } = currPos;
    // check if we really need to remove attributes
    while (
      right !== null && (
        right.deleted === true || (
          right.content.constructor === ContentFormat &&
          equalAttrs(negatedAttributes.get(/** @type {ContentFormat} */ (right.content).key), /** @type {ContentFormat} */ (right.content).value)
        )
      )
    ) {
      if (!right.deleted) {
        negatedAttributes.delete(/** @type {ContentFormat} */ (right.content).key);
      }
      left = right;
      right = right.right;
    }
    const doc = transaction.doc;
    const ownClientId = doc.clientID;
    for (const [key, val] of negatedAttributes) {
      left = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      left.integrate(transaction, 0);
    }
    currPos.left = left;
    currPos.right = right;
  };

  /**
   * @param {Map<string,any>} currentAttributes
   * @param {ContentFormat} format
   *
   * @private
   * @function
   */
  const updateCurrentAttributes = (currentAttributes, format) => {
    const { key, value } = format;
    if (value === null) {
      currentAttributes.delete(key);
    // @ts-ignore
    } else if (value['data-coding-id']) {
      // FIXME unique attribute names for nested coding marks
      // @ts-ignore
      currentAttributes.set(`coding-${value['data-coding-id']}`, value);
    } else {
      currentAttributes.set(key, value);
    }
  };

  /**
   * @param {ItemListPosition} currPos
   * @param {Map<string,any>} currentAttributes
   * @param {Object<string,any>} attributes
   *
   * @private
   * @function
   */
  const minimizeAttributeChanges = (currPos, currentAttributes, attributes) => {
    // go right while attributes[right.key] === right.value (or right is deleted)
    let { left, right } = currPos;
    while (true) {
      if (right === null) {
        break
      } else if (right.deleted) ; else if (right.content.constructor === ContentFormat && equalAttrs(attributes[(/** @type {ContentFormat} */ (right.content)).key] || null, /** @type {ContentFormat} */ (right.content).value)) {
        // found a format, update currentAttributes and continue
        updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (right.content));
      } else {
        break
      }
      left = right;
      right = right.right;
    }
    currPos.left = left;
    currPos.right = right;
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {ItemListPosition} currPos
   * @param {Map<string,any>} currentAttributes
   * @param {Object<string,any>} attributes
   * @return {Map<string,any>}
   *
   * @private
   * @function
   **/
  const insertAttributes = (transaction, parent, currPos, currentAttributes, attributes) => {
    const doc = transaction.doc;
    const ownClientId = doc.clientID;
    const negatedAttributes = new Map();
    // insert format-start items
    for (const key in attributes) {
      const val = attributes[key];
      const currentVal = currentAttributes.get(key) || null;
      if (!equalAttrs(currentVal, val)) {
        // save negated attribute (set null if currentVal undefined)
        negatedAttributes.set(key, currentVal);
        const { left, right } = currPos;
        currPos.left = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
        currPos.left.integrate(transaction, 0);
      }
    }
    return negatedAttributes
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {ItemListPosition} currPos
   * @param {Map<string,any>} currentAttributes
   * @param {string|object} text
   * @param {Object<string,any>} attributes
   *
   * @private
   * @function
   **/
  const insertText = (transaction, parent, currPos, currentAttributes, text, attributes) => {
    for (const [key] of currentAttributes) {
      if (attributes[key] === undefined) {
        attributes[key] = null;
      }
    }
    const doc = transaction.doc;
    const ownClientId = doc.clientID;
    minimizeAttributeChanges(currPos, currentAttributes, attributes);
    const negatedAttributes = insertAttributes(transaction, parent, currPos, currentAttributes, attributes);
    // insert content
    const content = text.constructor === String ? new ContentString(/** @type {string} */ (text)) : new ContentEmbed(text);
    const { left, right } = currPos;
    currPos.left = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
    currPos.left.integrate(transaction, 0);
    return insertNegatedAttributes(transaction, parent, currPos, negatedAttributes)
  };

  /**
   * @param {Transaction} transaction
   * @param {AbstractType<any>} parent
   * @param {ItemListPosition} currPos
   * @param {Map<string,any>} currentAttributes
   * @param {number} length
   * @param {Object<string,any>} attributes
   *
   * @private
   * @function
   */
  const formatText = (transaction, parent, currPos, currentAttributes, length, attributes) => {
    const doc = transaction.doc;
    const ownClientId = doc.clientID;
    minimizeAttributeChanges(currPos, currentAttributes, attributes);
    const negatedAttributes = insertAttributes(transaction, parent, currPos, currentAttributes, attributes);
    let { left, right } = currPos;
    // iterate until first non-format or null is found
    // delete all formats with attributes[format.key] != null
    while (length > 0 && right !== null) {
      if (!right.deleted) {
        switch (right.content.constructor) {
          case ContentFormat: {
            const { key, value } = /** @type {ContentFormat} */ (right.content);
            const attr = attributes[key];
            if (attr !== undefined) {
              if (equalAttrs(attr, value)) {
                negatedAttributes.delete(key);
              } else {
                negatedAttributes.set(key, value);
              }
              right.delete(transaction);
            }
            updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (right.content));
            break
          }
          case ContentEmbed:
          case ContentString:
            if (length < right.length) {
              getItemCleanStart(transaction, createID(right.id.client, right.id.clock + length));
            }
            length -= right.length;
            break
        }
      }
      left = right;
      right = right.right;
    }
    // Quill just assumes that the editor starts with a newline and that it always
    // ends with a newline. We only insert that newline when a new newline is
    // inserted - i.e when length is bigger than type.length
    if (length > 0) {
      let newlines = '';
      for (; length > 0; length--) {
        newlines += '\n';
      }
      left = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentString(newlines));
      left.integrate(transaction, 0);
    }
    currPos.left = left;
    currPos.right = right;
    insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
  };

  /**
   * Call this function after string content has been deleted in order to
   * clean up formatting Items.
   *
   * @param {Transaction} transaction
   * @param {Item} start
   * @param {Item|null} end exclusive end, automatically iterates to the next Content Item
   * @param {Map<string,any>} startAttributes
   * @param {Map<string,any>} endAttributes This attribute is modified!
   * @return {number} The amount of formatting Items deleted.
   *
   * @function
   */
  const cleanupFormattingGap = (transaction, start, end, startAttributes, endAttributes) => {
    while (end && end.content.constructor !== ContentString && end.content.constructor !== ContentEmbed) {
      if (!end.deleted && end.content.constructor === ContentFormat) {
        updateCurrentAttributes(endAttributes, /** @type {ContentFormat} */ (end.content));
      }
      end = end.right;
    }
    let cleanups = 0;
    while (start !== end) {
      if (!start.deleted) {
        const content = start.content;
        switch (content.constructor) {
          case ContentFormat: {
            const { key, value } = /** @type {ContentFormat} */ (content);
            if ((endAttributes.get(key) || null) !== value || (startAttributes.get(key) || null) === value) {
              // Either this format is overwritten or it is not necessary because the attribute already existed.
              start.delete(transaction);
              cleanups++;
            }
            break
          }
        }
      }
      start = /** @type {Item} */ (start.right);
    }
    return cleanups
  };

  /**
   * @param {Transaction} transaction
   * @param {Item | null} item
   */
  const cleanupContextlessFormattingGap = (transaction, item) => {
    // iterate until item.right is null or content
    while (item && item.right && (item.right.deleted || (item.right.content.constructor !== ContentString && item.right.content.constructor !== ContentEmbed))) {
      item = item.right;
    }
    const attrs = new Set();
    // iterate back until a content item is found
    while (item && (item.deleted || (item.content.constructor !== ContentString && item.content.constructor !== ContentEmbed))) {
      if (!item.deleted && item.content.constructor === ContentFormat) {
        const key = /** @type {ContentFormat} */ (item.content).key;
        if (attrs.has(key)) {
          item.delete(transaction);
        } else {
          attrs.add(key);
        }
      }
      item = item.left;
    }
  };

  /**
   * This function is experimental and subject to change / be removed.
   *
   * Ideally, we don't need this function at all. Formatting attributes should be cleaned up
   * automatically after each change. This function iterates twice over the complete YText type
   * and removes unnecessary formatting attributes. This is also helpful for testing.
   *
   * This function won't be exported anymore as soon as there is confidence that the YText type works as intended.
   *
   * @param {YText} type
   * @return {number} How many formatting attributes have been cleaned up.
   */
  const cleanupYTextFormatting = type => {
    let res = 0;
    transact(/** @type {Doc} */ (type.doc), transaction => {
      let start = /** @type {Item} */ (type._start);
      let end = type._start;
      let startAttributes = create();
      const currentAttributes = copy(startAttributes);
      while (end) {
        if (end.deleted === false) {
          switch (end.content.constructor) {
            case ContentFormat:
              updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (end.content));
              break
            case ContentEmbed:
            case ContentString:
              res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
              startAttributes = copy(currentAttributes);
              start = end;
              break
          }
        }
        end = end.right;
      }
    });
    return res
  };

  /**
   * @param {Transaction} transaction
   * @param {ItemListPosition} currPos
   * @param {Map<string,any>} currentAttributes
   * @param {number} length
   * @return {ItemListPosition}
   *
   * @private
   * @function
   */
  const deleteText = (transaction, currPos, currentAttributes, length) => {
    const startAttrs = copy(currentAttributes);
    const start = currPos.right;
    let { left, right } = currPos;
    while (length > 0 && right !== null) {
      if (right.deleted === false) {
        switch (right.content.constructor) {
          case ContentFormat:
            updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (right.content));
            break
          case ContentEmbed:
          case ContentString:
            if (length < right.length) {
              getItemCleanStart(transaction, createID(right.id.client, right.id.clock + length));
            }
            length -= right.length;
            right.delete(transaction);
            break
        }
      }
      left = right;
      right = right.right;
    }
    if (start) {
      cleanupFormattingGap(transaction, start, right, startAttrs, copy(currentAttributes));
    }
    currPos.left = left;
    currPos.right = right;
    return currPos
  };

  /**
   * The Quill Delta format represents changes on a text document with
   * formatting information. For mor information visit {@link https://quilljs.com/docs/delta/|Quill Delta}
   *
   * @example
   *   {
   *     ops: [
   *       { insert: 'Gandalf', attributes: { bold: true } },
   *       { insert: ' the ' },
   *       { insert: 'Grey', attributes: { color: '#cccccc' } }
   *     ]
   *   }
   *
   */

  /**
    * Attributes that can be assigned to a selection of text.
    *
    * @example
    *   {
    *     bold: true,
    *     font-size: '40px'
    *   }
    *
    * @typedef {Object} TextAttributes
    */

  /**
   * @typedef {Object} DeltaItem
   * @property {number|undefined} DeltaItem.delete
   * @property {number|undefined} DeltaItem.retain
   * @property {string|undefined} DeltaItem.string
   * @property {Object<string,any>} DeltaItem.attributes
   */

  /**
   * Event that describes the changes on a YText type.
   */
  class YTextEvent extends YEvent {
    /**
     * @param {YText} ytext
     * @param {Transaction} transaction
     */
    constructor (ytext, transaction) {
      super(ytext, transaction);
      /**
       * @type {Array<DeltaItem>|null}
       */
      this._delta = null;
    }

    /**
     * Compute the changes in the delta format.
     * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
     *
     * @type {Array<DeltaItem>}
     *
     * @public
     */
    get delta () {
      if (this._delta === null) {
        const y = /** @type {Doc} */ (this.target.doc);
        this._delta = [];
        transact(y, transaction => {
          const delta = /** @type {Array<DeltaItem>} */ (this._delta);
          const currentAttributes = new Map(); // saves all current attributes for insert
          const oldAttributes = new Map();
          let item = this.target._start;
          /**
           * @type {string?}
           */
          let action = null;
          /**
           * @type {Object<string,any>}
           */
          const attributes = {}; // counts added or removed new attributes for retain
          /**
           * @type {string|object}
           */
          let insert = '';
          let retain = 0;
          let deleteLen = 0;
          const addOp = () => {
            if (action !== null) {
              /**
               * @type {any}
               */
              let op;
              switch (action) {
                case 'delete':
                  op = { delete: deleteLen };
                  deleteLen = 0;
                  break
                case 'insert':
                  op = { insert };
                  if (currentAttributes.size > 0) {
                    op.attributes = {};
                    for (const [key, value] of currentAttributes) {
                      if (value !== null) {
                        op.attributes[key] = value;
                      }
                    }
                  }
                  insert = '';
                  break
                case 'retain':
                  op = { retain };
                  if (Object.keys(attributes).length > 0) {
                    op.attributes = {};
                    for (const key in attributes) {
                      op.attributes[key] = attributes[key];
                    }
                  }
                  retain = 0;
                  break
              }
              delta.push(op);
              action = null;
            }
          };
          while (item !== null) {
            switch (item.content.constructor) {
              case ContentEmbed:
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    addOp();
                    action = 'insert';
                    insert = /** @type {ContentEmbed} */ (item.content).embed;
                    addOp();
                  }
                } else if (this.deletes(item)) {
                  if (action !== 'delete') {
                    addOp();
                    action = 'delete';
                  }
                  deleteLen += 1;
                } else if (!item.deleted) {
                  if (action !== 'retain') {
                    addOp();
                    action = 'retain';
                  }
                  retain += 1;
                }
                break
              case ContentString:
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    if (action !== 'insert') {
                      addOp();
                      action = 'insert';
                    }
                    insert += /** @type {ContentString} */ (item.content).str;
                  }
                } else if (this.deletes(item)) {
                  if (action !== 'delete') {
                    addOp();
                    action = 'delete';
                  }
                  deleteLen += item.length;
                } else if (!item.deleted) {
                  if (action !== 'retain') {
                    addOp();
                    action = 'retain';
                  }
                  retain += item.length;
                }
                break
              case ContentFormat: {
                const { key, value } = /** @type {ContentFormat} */ (item.content);
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    const curVal = currentAttributes.get(key) || null;
                    if (!equalAttrs(curVal, value)) {
                      if (action === 'retain') {
                        addOp();
                      }
                      if (equalAttrs(value, (oldAttributes.get(key) || null))) {
                        delete attributes[key];
                      } else {
                        attributes[key] = value;
                      }
                    } else {
                      item.delete(transaction);
                    }
                  }
                } else if (this.deletes(item)) {
                  oldAttributes.set(key, value);
                  const curVal = currentAttributes.get(key) || null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === 'retain') {
                      addOp();
                    }
                    attributes[key] = curVal;
                  }
                } else if (!item.deleted) {
                  oldAttributes.set(key, value);
                  const attr = attributes[key];
                  if (attr !== undefined) {
                    if (!equalAttrs(attr, value)) {
                      if (action === 'retain') {
                        addOp();
                      }
                      if (value === null) {
                        attributes[key] = value;
                      } else {
                        delete attributes[key];
                      }
                    } else {
                      item.delete(transaction);
                    }
                  }
                }
                if (!item.deleted) {
                  if (action === 'insert') {
                    addOp();
                  }
                  updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (item.content));
                }
                break
              }
            }
            item = item.right;
          }
          addOp();
          while (delta.length > 0) {
            const lastOp = delta[delta.length - 1];
            if (lastOp.retain !== undefined && lastOp.attributes === undefined) {
              // retain delta's if they don't assign attributes
              delta.pop();
            } else {
              break
            }
          }
        });
      }
      return this._delta
    }
  }

  /**
   * Type that represents text with formatting information.
   *
   * This type replaces y-richtext as this implementation is able to handle
   * block formats (format information on a paragraph), embeds (complex elements
   * like pictures and videos), and text formats (**bold**, *italic*).
   *
   * @extends AbstractType<YTextEvent>
   */
  class YText extends AbstractType {
    /**
     * @param {String} [string] The initial value of the YText.
     */
    constructor (string) {
      super();
      /**
       * Array of pending operations on this type
       * @type {Array<function():void>?}
       */
      this._pending = string !== undefined ? [() => this.insert(0, string)] : [];
    }

    /**
     * Number of characters of this text type.
     *
     * @type {number}
     */
    get length () {
      return this._length
    }

    /**
     * @param {Doc} y
     * @param {Item} item
     */
    _integrate (y, item) {
      super._integrate(y, item);
      try {
        /** @type {Array<function>} */ (this._pending).forEach(f => f());
      } catch (e) {
        console.error(e);
      }
      this._pending = null;
    }

    _copy () {
      return new YText()
    }

    /**
     * Creates YTextEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver (transaction, parentSubs) {
      const event = new YTextEvent(this, transaction);
      const doc = transaction.doc;
      // If a remote change happened, we try to cleanup potential formatting duplicates.
      if (!transaction.local) {
        // check if another formatting item was inserted
        let foundFormattingItem = false;
        for (const [client, afterClock] of transaction.afterState) {
          const clock = transaction.beforeState.get(client) || 0;
          if (afterClock === clock) {
            continue
          }
          iterateStructs(transaction, /** @type {Array<Item|GC>} */ (doc.store.clients.get(client)), clock, afterClock, item => {
            // @ts-ignore
            if (!item.deleted && item.content.constructor === ContentFormat) {
              foundFormattingItem = true;
            }
          });
          if (foundFormattingItem) {
            break
          }
        }
        transact(doc, t => {
          if (foundFormattingItem) {
            // If a formatting item was inserted, we simply clean the whole type.
            // We need to compute currentAttributes for the current position anyway.
            cleanupYTextFormatting(this);
          } else {
            // If no formatting attribute was inserted, we can make due with contextless
            // formatting cleanups.
            // Contextless: it is not necessary to compute currentAttributes for the affected position.
            iterateDeletedStructs(t, transaction.deleteSet, item => {
              if (item instanceof GC) {
                return
              }
              if (item.parent === this) {
                cleanupContextlessFormattingGap(t, item);
              }
            });
          }
        });
      }
      callTypeObservers(this, transaction, event);
    }

    /**
     * Returns the unformatted string representation of this YText type.
     *
     * @public
     */
    toString () {
      let str = '';
      /**
       * @type {Item|null}
       */
      let n = this._start;
      while (n !== null) {
        if (!n.deleted && n.countable && n.content.constructor === ContentString) {
          str += /** @type {ContentString} */ (n.content).str;
        }
        n = n.right;
      }
      return str
    }

    /**
     * Returns the unformatted string representation of this YText type.
     *
     * @return {string}
     * @public
     */
    toJSON () {
      return this.toString()
    }

    /**
     * Apply a {@link Delta} on this shared YText type.
     *
     * @param {any} delta The changes to apply on this element.
     * @param {object}  [opts]
     * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
     *
     *
     * @public
     */
    applyDelta (delta, { sanitize = true } = {}) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          /**
           * @type {ItemListPosition}
           */
          const currPos = new ItemListPosition(null, this._start);
          const currentAttributes = new Map();
          for (let i = 0; i < delta.length; i++) {
            const op = delta[i];
            if (op.insert !== undefined) {
              // Quill assumes that the content starts with an empty paragraph.
              // Yjs/Y.Text assumes that it starts empty. We always hide that
              // there is a newline at the end of the content.
              // If we omit this step, clients will see a different number of
              // paragraphs, but nothing bad will happen.
              const ins = (!sanitize && typeof op.insert === 'string' && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === '\n') ? op.insert.slice(0, -1) : op.insert;
              if (typeof ins !== 'string' || ins.length > 0) {
                insertText(transaction, this, currPos, currentAttributes, ins, op.attributes || {});
              }
            } else if (op.retain !== undefined) {
              formatText(transaction, this, currPos, currentAttributes, op.retain, op.attributes || {});
            } else if (op.delete !== undefined) {
              deleteText(transaction, currPos, currentAttributes, op.delete);
            }
          }
        });
      } else {
        /** @type {Array<function>} */ (this._pending).push(() => this.applyDelta(delta));
      }
    }

    /**
     * Returns the Delta representation of this YText type.
     *
     * @param {Snapshot} [snapshot]
     * @param {Snapshot} [prevSnapshot]
     * @param {function('removed' | 'added', ID):any} [computeYChange]
     * @return {any} The Delta representation of this type.
     *
     * @public
     */
    toDelta (snapshot, prevSnapshot, computeYChange) {
      /**
       * @type{Array<any>}
       */
      const ops = [];
      const currentAttributes = new Map();
      const doc = /** @type {Doc} */ (this.doc);
      let str = '';
      let n = this._start;
      function packStr () {
        if (str.length > 0) {
          // pack str with attributes to ops
          /**
           * @type {Object<string,any>}
           */
          const attributes = {};
          let addAttributes = false;
          for (const [key, value] of currentAttributes) {
            addAttributes = true;
            attributes[key] = value;
          }
          /**
           * @type {Object<string,any>}
           */
          const op = { insert: str };
          if (addAttributes) {
            op.attributes = attributes;
          }
          ops.push(op);
          str = '';
        }
      }
      // snapshots are merged again after the transaction, so we need to keep the
      // transalive until we are done
      // transact(doc, transaction => {
        // if (snapshot) {
        //   splitSnapshotAffectedStructs(transaction, snapshot)
        // }
        // if (prevSnapshot) {
        //   splitSnapshotAffectedStructs(transaction, prevSnapshot)
        // }
        while (n !== null) {
          if (isVisible(n, snapshot) || (prevSnapshot !== undefined && isVisible(n, prevSnapshot))) {
            switch (n.content.constructor) {
              case ContentString: {
                const cur = currentAttributes.get('ychange');
                if (snapshot !== undefined && !isVisible(n, snapshot)) {
                  if (cur === undefined || cur.user !== n.id.client || cur.state !== 'removed') {
                    packStr();
                    currentAttributes.set('ychange', computeYChange ? computeYChange('removed', n.id) : { type: 'removed' });
                  }
                } else if (prevSnapshot !== undefined && !isVisible(n, prevSnapshot)) {
                  if (cur === undefined || cur.user !== n.id.client || cur.state !== 'added') {
                    packStr();
                    currentAttributes.set('ychange', computeYChange ? computeYChange('added', n.id) : { type: 'added' });
                  }
                } else if (cur !== undefined) {
                  packStr();
                  currentAttributes.delete('ychange');
                }
                str += /** @type {ContentString} */ (n.content).str;
                break
              }
              case ContentEmbed: {
                packStr();
                /**
                 * @type {Object<string,any>}
                 */
                const op = {
                  insert: /** @type {ContentEmbed} */ (n.content).embed
                };
                if (currentAttributes.size > 0) {
                  const attrs = /** @type {Object<string,any>} */ ({});
                  op.attributes = attrs;
                  for (const [key, value] of currentAttributes) {
                    attrs[key] = value;
                  }
                }
                ops.push(op);
                break
              }
              case ContentFormat:
                if (isVisible(n, snapshot)) {
                  packStr();
                  updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (n.content));
                }
                break
            }
          }
          n = n.right;
        }
        packStr();
      // }, splitSnapshotAffectedStructs)
      return ops
    }

    /**
     * Insert text at a given index.
     *
     * @param {number} index The index at which to start inserting.
     * @param {String} text The text to insert at the specified position.
     * @param {TextAttributes} [attributes] Optionally define some formatting
     *                                    information to apply on the inserted
     *                                    Text.
     * @public
     */
    insert (index, text, attributes) {
      if (text.length <= 0) {
        return
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, transaction => {
          const { left, right, currentAttributes } = findPosition(transaction, this, index);
          if (!attributes) {
            attributes = {};
            // @ts-ignore
            currentAttributes.forEach((v, k) => { attributes[k] = v; });
          }
          insertText(transaction, this, new ItemListPosition(left, right), currentAttributes, text, attributes);
        });
      } else {
        /** @type {Array<function>} */ (this._pending).push(() => this.insert(index, text, attributes));
      }
    }

    /**
     * Inserts an embed at a index.
     *
     * @param {number} index The index to insert the embed at.
     * @param {Object} embed The Object that represents the embed.
     * @param {TextAttributes} attributes Attribute information to apply on the
     *                                    embed
     *
     * @public
     */
    insertEmbed (index, embed, attributes = {}) {
      if (embed.constructor !== Object) {
        throw new Error('Embed must be an Object')
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, transaction => {
          const { left, right, currentAttributes } = findPosition(transaction, this, index);
          insertText(transaction, this, new ItemListPosition(left, right), currentAttributes, embed, attributes);
        });
      } else {
        /** @type {Array<function>} */ (this._pending).push(() => this.insertEmbed(index, embed, attributes));
      }
    }

    /**
     * Deletes text starting from an index.
     *
     * @param {number} index Index at which to start deleting.
     * @param {number} length The number of characters to remove. Defaults to 1.
     *
     * @public
     */
    delete (index, length) {
      if (length === 0) {
        return
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, transaction => {
          const { left, right, currentAttributes } = findPosition(transaction, this, index);
          deleteText(transaction, new ItemListPosition(left, right), currentAttributes, length);
        });
      } else {
        /** @type {Array<function>} */ (this._pending).push(() => this.delete(index, length));
      }
    }

    /**
     * Assigns properties to a range of text.
     *
     * @param {number} index The position where to start formatting.
     * @param {number} length The amount of characters to assign properties to.
     * @param {TextAttributes} attributes Attribute information to apply on the
     *                                    text.
     *
     * @public
     */
    format (index, length, attributes) {
      if (length === 0) {
        return
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, transaction => {
          const { left, right, currentAttributes } = findPosition(transaction, this, index);
          if (right === null) {
            return
          }
          formatText(transaction, this, new ItemListPosition(left, right), currentAttributes, length, attributes);
        });
      } else {
        /** @type {Array<function>} */ (this._pending).push(() => this.format(index, length, attributes));
      }
    }

    /**
     * @param {encoding.Encoder} encoder
     */
    _write (encoder) {
      writeVarUint(encoder, YTextRefID);
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @return {YText}
   *
   * @private
   * @function
   */
  const readYText = decoder => new YText();

  /**
   * @module YXml
   */

  /**
   * Define the elements to which a set of CSS queries apply.
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors|CSS_Selectors}
   *
   * @example
   *   query = '.classSelector'
   *   query = 'nodeSelector'
   *   query = '#idSelector'
   *
   * @typedef {string} CSS_Selector
   */

  /**
   * Dom filter function.
   *
   * @callback domFilter
   * @param {string} nodeName The nodeName of the element
   * @param {Map} attributes The map of attributes.
   * @return {boolean} Whether to include the Dom node in the YXmlElement.
   */

  /**
   * Represents a subset of the nodes of a YXmlElement / YXmlFragment and a
   * position within them.
   *
   * Can be created with {@link YXmlFragment#createTreeWalker}
   *
   * @public
   * @implements {Iterable<YXmlElement|YXmlText|YXmlElement|YXmlHook>}
   */
  class YXmlTreeWalker {
    /**
     * @param {YXmlFragment | YXmlElement} root
     * @param {function(AbstractType<any>):boolean} [f]
     */
    constructor (root, f = () => true) {
      this._filter = f;
      this._root = root;
      /**
       * @type {Item}
       */
      this._currentNode = /** @type {Item} */ (root._start);
      this._firstCall = true;
    }

    [Symbol.iterator] () {
      return this
    }

    /**
     * Get the next node.
     *
     * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
     *
     * @public
     */
    next () {
      /**
       * @type {Item|null}
       */
      let n = this._currentNode;
      let type = /** @type {any} */ (n.content).type;
      if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) { // if first call, we check if we can use the first item
        do {
          type = /** @type {any} */ (n.content).type;
          if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
            // walk down in the tree
            n = type._start;
          } else {
            // walk right or up in the tree
            while (n !== null) {
              if (n.right !== null) {
                n = n.right;
                break
              } else if (n.parent === this._root) {
                n = null;
              } else {
                n = /** @type {AbstractType<any>} */ (n.parent)._item;
              }
            }
          }
        } while (n !== null && (n.deleted || !this._filter(/** @type {ContentType} */ (n.content).type)))
      }
      this._firstCall = false;
      if (n === null) {
        // @ts-ignore
        return { value: undefined, done: true }
      }
      this._currentNode = n;
      return { value: /** @type {any} */ (n.content).type, done: false }
    }
  }

  /**
   * Represents a list of {@link YXmlElement}.and {@link YXmlText} types.
   * A YxmlFragment is similar to a {@link YXmlElement}, but it does not have a
   * nodeName and it does not have attributes. Though it can be bound to a DOM
   * element - in this case the attributes and the nodeName are not shared.
   *
   * @public
   * @extends AbstractType<YXmlEvent>
   */
  class YXmlFragment extends AbstractType {
    constructor () {
      super();
      /**
       * @type {Array<any>|null}
       */
      this._prelimContent = [];
    }

    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate (y, item) {
      super._integrate(y, item);
      this.insert(0, /** @type {Array<any>} */ (this._prelimContent));
      this._prelimContent = null;
    }

    _copy () {
      return new YXmlFragment()
    }

    get length () {
      return this._prelimContent === null ? this._length : this._prelimContent.length
    }

    /**
     * Create a subtree of childNodes.
     *
     * @example
     * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
     * for (let node in walker) {
     *   // `node` is a div node
     *   nop(node)
     * }
     *
     * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
     *                          returns a Boolean indicating whether the child
     *                          is to be included in the subtree.
     * @return {YXmlTreeWalker} A subtree and a position within it.
     *
     * @public
     */
    createTreeWalker (filter) {
      return new YXmlTreeWalker(this, filter)
    }

    /**
     * Returns the first YXmlElement that matches the query.
     * Similar to DOM's {@link querySelector}.
     *
     * Query support:
     *   - tagname
     * TODO:
     *   - id
     *   - attribute
     *
     * @param {CSS_Selector} query The query on the children.
     * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
     *
     * @public
     */
    querySelector (query) {
      query = query.toUpperCase();
      // @ts-ignore
      const iterator = new YXmlTreeWalker(this, element => element.nodeName && element.nodeName.toUpperCase() === query);
      const next = iterator.next();
      if (next.done) {
        return null
      } else {
        return next.value
      }
    }

    /**
     * Returns all YXmlElements that match the query.
     * Similar to Dom's {@link querySelectorAll}.
     *
     * @todo Does not yet support all queries. Currently only query by tagName.
     *
     * @param {CSS_Selector} query The query on the children
     * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
     *
     * @public
     */
    querySelectorAll (query) {
      query = query.toUpperCase();
      // @ts-ignore
      return Array.from(new YXmlTreeWalker(this, element => element.nodeName && element.nodeName.toUpperCase() === query))
    }

    /**
     * Creates YXmlEvent and calls observers.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     */
    _callObserver (transaction, parentSubs) {
      callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
    }

    /**
     * Get the string representation of all the children of this YXmlFragment.
     *
     * @return {string} The string representation of all children.
     */
    toString () {
      return typeListMap(this, xml => xml.toString()).join('')
    }

    /**
     * @return {string}
     */
    toJSON () {
      return this.toString()
    }

    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM (_document = document, hooks = {}, binding) {
      const fragment = _document.createDocumentFragment();
      if (binding !== undefined) {
        binding._createAssociation(fragment, this);
      }
      typeListForEach(this, xmlType => {
        fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
      });
      return fragment
    }

    /**
     * Inserts new content at an index.
     *
     * @example
     *  // Insert character 'a' at position 0
     *  xml.insert(0, [new Y.XmlText('text')])
     *
     * @param {number} index The index to insert content at
     * @param {Array<YXmlElement|YXmlText>} content The array of content
     */
    insert (index, content) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          typeListInsertGenerics(transaction, this, index, content);
        });
      } else {
        // @ts-ignore _prelimContent is defined because this is not yet integrated
        this._prelimContent.splice(index, 0, ...content);
      }
    }

    /**
     * Deletes elements starting from an index.
     *
     * @param {number} index Index at which to start deleting elements
     * @param {number} [length=1] The number of elements to remove. Defaults to 1.
     */
    delete (index, length = 1) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          typeListDelete(transaction, this, index, length);
        });
      } else {
        // @ts-ignore _prelimContent is defined because this is not yet integrated
        this._prelimContent.splice(index, length);
      }
    }

    /**
     * Transforms this YArray to a JavaScript Array.
     *
     * @return {Array<YXmlElement|YXmlText|YXmlHook>}
     */
    toArray () {
      return typeListToArray(this)
    }

    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {encoding.Encoder} encoder The encoder to write data to.
     */
    _write (encoder) {
      writeVarUint(encoder, YXmlFragmentRefID);
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @return {YXmlFragment}
   *
   * @private
   * @function
   */
  const readYXmlFragment = decoder => new YXmlFragment();

  /**
   * An YXmlElement imitates the behavior of a
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}.
   *
   * * An YXmlElement has attributes (key value pairs)
   * * An YXmlElement has childElements that must inherit from YXmlElement
   */
  class YXmlElement extends YXmlFragment {
    constructor (nodeName = 'UNDEFINED') {
      super();
      this.nodeName = nodeName;
      /**
       * @type {Map<string, any>|null}
       */
      this._prelimAttrs = new Map();
    }

    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item} item
     */
    _integrate (y, item) {
      super._integrate(y, item)
      ;(/** @type {Map<string, any>} */ (this._prelimAttrs)).forEach((value, key) => {
        this.setAttribute(key, value);
      });
      this._prelimAttrs = null;
    }

    /**
     * Creates an Item with the same effect as this Item (without position effect)
     *
     * @return {YXmlElement}
     */
    _copy () {
      return new YXmlElement(this.nodeName)
    }

    /**
     * Returns the XML serialization of this YXmlElement.
     * The attributes are ordered by attribute-name, so you can easily use this
     * method to compare YXmlElements
     *
     * @return {string} The string representation of this type.
     *
     * @public
     */
    toString () {
      const attrs = this.getAttributes();
      const stringBuilder = [];
      const keys = [];
      for (const key in attrs) {
        keys.push(key);
      }
      keys.sort();
      const keysLen = keys.length;
      for (let i = 0; i < keysLen; i++) {
        const key = keys[i];
        stringBuilder.push(key + '="' + attrs[key] + '"');
      }
      const nodeName = this.nodeName.toLocaleLowerCase();
      const attrsString = stringBuilder.length > 0 ? ' ' + stringBuilder.join(' ') : '';
      return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`
    }

    /**
     * Removes an attribute from this YXmlElement.
     *
     * @param {String} attributeName The attribute name that is to be removed.
     *
     * @public
     */
    removeAttribute (attributeName) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          typeMapDelete(transaction, this, attributeName);
        });
      } else {
        /** @type {Map<string,any>} */ (this._prelimAttrs).delete(attributeName);
      }
    }

    /**
     * Sets or updates an attribute.
     *
     * @param {String} attributeName The attribute name that is to be set.
     * @param {String} attributeValue The attribute value that is to be set.
     *
     * @public
     */
    setAttribute (attributeName, attributeValue) {
      if (this.doc !== null) {
        transact(this.doc, transaction => {
          typeMapSet(transaction, this, attributeName, attributeValue);
        });
      } else {
        /** @type {Map<string, any>} */ (this._prelimAttrs).set(attributeName, attributeValue);
      }
    }

    /**
     * Returns an attribute value that belongs to the attribute name.
     *
     * @param {String} attributeName The attribute name that identifies the
     *                               queried value.
     * @return {String} The queried attribute value.
     *
     * @public
     */
    getAttribute (attributeName) {
      return /** @type {any} */ (typeMapGet(this, attributeName))
    }

    /**
     * Returns all attribute name/value pairs in a JSON Object.
     *
     * @param {Snapshot} [snapshot]
     * @return {Object<string, any>} A JSON Object that describes the attributes.
     *
     * @public
     */
    getAttributes (snapshot) {
      return typeMapGetAll(this)
    }

    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM (_document = document, hooks = {}, binding) {
      const dom = _document.createElement(this.nodeName);
      const attrs = this.getAttributes();
      for (const key in attrs) {
        dom.setAttribute(key, attrs[key]);
      }
      typeListForEach(this, yxml => {
        dom.appendChild(yxml.toDOM(_document, hooks, binding));
      });
      if (binding !== undefined) {
        binding._createAssociation(dom, this);
      }
      return dom
    }

    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {encoding.Encoder} encoder The encoder to write data to.
     */
    _write (encoder) {
      writeVarUint(encoder, YXmlElementRefID);
      writeVarString(encoder, this.nodeName);
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @return {YXmlElement}
   *
   * @function
   */
  const readYXmlElement = decoder => new YXmlElement(readVarString(decoder));

  /**
   * An Event that describes changes on a YXml Element or Yxml Fragment
   */
  class YXmlEvent extends YEvent {
    /**
     * @param {YXmlElement|YXmlFragment} target The target on which the event is created.
     * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
     *                   child list changed.
     * @param {Transaction} transaction The transaction instance with wich the
     *                                  change was created.
     */
    constructor (target, subs, transaction) {
      super(target, transaction);
      /**
       * Whether the children changed.
       * @type {Boolean}
       * @private
       */
      this.childListChanged = false;
      /**
       * Set of all changed attributes.
       * @type {Set<string|null>}
       */
      this.attributesChanged = new Set();
      subs.forEach((sub) => {
        if (sub === null) {
          this.childListChanged = true;
        } else {
          this.attributesChanged.add(sub);
        }
      });
    }
  }

  /**
   * You can manage binding to a custom type with YXmlHook.
   *
   * @extends {YMap<any>}
   */
  class YXmlHook extends YMap {
    /**
     * @param {string} hookName nodeName of the Dom Node.
     */
    constructor (hookName) {
      super();
      /**
       * @type {string}
       */
      this.hookName = hookName;
    }

    /**
     * Creates an Item with the same effect as this Item (without position effect)
     */
    _copy () {
      return new YXmlHook(this.hookName)
    }

    /**
     * Creates a Dom Element that mirrors this YXmlElement.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type
     * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM (_document = document, hooks = {}, binding) {
      const hook = hooks[this.hookName];
      let dom;
      if (hook !== undefined) {
        dom = hook.createDom(this);
      } else {
        dom = document.createElement(this.hookName);
      }
      dom.setAttribute('data-yjs-hook', this.hookName);
      if (binding !== undefined) {
        binding._createAssociation(dom, this);
      }
      return dom
    }

    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {encoding.Encoder} encoder The encoder to write data to.
     */
    _write (encoder) {
      super._write(encoder);
      writeVarUint(encoder, YXmlHookRefID);
      writeVarString(encoder, this.hookName);
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @return {YXmlHook}
   *
   * @private
   * @function
   */
  const readYXmlHook = decoder =>
    new YXmlHook(readVarString(decoder));

  /**
   * Represents text in a Dom Element. In the future this type will also handle
   * simple formatting information like bold and italic.
   */
  class YXmlText extends YText {
    _copy () {
      return new YXmlText()
    }

    /**
     * Creates a Dom Element that mirrors this YXmlText.
     *
     * @param {Document} [_document=document] The document object (you must define
     *                                        this when calling this method in
     *                                        nodejs)
     * @param {Object<string, any>} [hooks] Optional property to customize how hooks
     *                                             are presented in the DOM
     * @param {any} [binding] You should not set this property. This is
     *                               used if DomBinding wants to create a
     *                               association to the created DOM type.
     * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
     *
     * @public
     */
    toDOM (_document = document, hooks, binding) {
      const dom = _document.createTextNode(this.toString());
      if (binding !== undefined) {
        binding._createAssociation(dom, this);
      }
      return dom
    }

    // https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
    // @ts-ignore
    escapeXml (unsafe) {
      // @ts-ignore
      return unsafe.replace(/[<>&'"]/g, function (c) {
          switch (c) {
              case '<': return '&lt;';
              case '>': return '&gt;';
              case '&': return '&amp;';
              case '\'': return '&apos;';
              case '"': return '&quot;';
          }
      });
    }

    toString () {
      // @ts-ignore
      return this.toDelta().map(delta => {
        const nestedNodes = [];
        for (const nodeName in delta.attributes) {
          const attrs = [];
          for (const key in delta.attributes[nodeName]) {
            attrs.push({ key, value: delta.attributes[nodeName][key] });
          }
          // sort attributes to get a unique order
          attrs.sort((a, b) => a.key < b.key ? -1 : 1);
          nestedNodes.push({ nodeName, attrs });
        }
        // sort node order to get a unique order
        nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
        // now convert to dom string
        let str = '';
        for (let i = 0; i < nestedNodes.length; i++) {
          const node = nestedNodes[i];
          str += `<${node.nodeName}`;
          for (let j = 0; j < node.attrs.length; j++) {
            const attr = node.attrs[j];
            str += ` ${attr.key}="${attr.value}"`;
          }
          str += '>';
        }
        str += this.escapeXml(delta.insert);
        for (let i = nestedNodes.length - 1; i >= 0; i--) {
          str += `</${nestedNodes[i].nodeName}>`;
        }
        return str
      }).join('')
    }

    /**
     * @return {string}
     */
    toJSON () {
      return this.toString()
    }

    /**
     * @param {encoding.Encoder} encoder
     */
    _write (encoder) {
      writeVarUint(encoder, YXmlTextRefID);
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @return {YXmlText}
   *
   * @private
   * @function
   */
  const readYXmlText = decoder => new YXmlText();

  class AbstractStruct {
    /**
     * @param {ID} id
     * @param {number} length
     */
    constructor (id, length) {
      this.id = id;
      this.length = length;
    }

    /**
     * @type {boolean}
     */
    get deleted () {
      throw methodUnimplemented()
    }

    /**
     * Merge this struct with the item to the right.
     * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
     * Also this method does *not* remove right from StructStore!
     * @param {AbstractStruct} right
     * @return {boolean} wether this merged with right
     */
    mergeWith (right) {
      return false
    }

    /**
     * @param {encoding.Encoder} encoder The encoder to write data to.
     * @param {number} offset
     * @param {number} encodingRef
     */
    write (encoder, offset, encodingRef) {
      throw methodUnimplemented()
    }

    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate (transaction, offset) {
      throw methodUnimplemented()
    }
  }

  const structGCRefNumber = 0;

  /**
   * @private
   */
  class GC extends AbstractStruct {
    get deleted () {
      return true
    }

    delete () {}

    /**
     * @param {GC} right
     * @return {boolean}
     */
    mergeWith (right) {
      this.length += right.length;
      return true
    }

    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate (transaction, offset) {
      if (offset > 0) {
        this.id.clock += offset;
        this.length -= offset;
      }
      addStruct(transaction.doc.store, this);
    }

    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      writeUint8(encoder, structGCRefNumber);
      writeVarUint(encoder, this.length - offset);
    }

    /**
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing (transaction, store) {
      return null
    }
  }

  class ContentBinary {
    /**
     * @param {Uint8Array} content
     */
    constructor (content) {
      this.content = content;
    }

    /**
     * @return {number}
     */
    getLength () {
      return 1
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      return [this.content]
    }

    /**
     * @return {boolean}
     */
    isCountable () {
      return true
    }

    /**
     * @return {ContentBinary}
     */
    copy () {
      return new ContentBinary(this.content)
    }

    /**
     * @param {number} offset
     * @return {ContentBinary}
     */
    splice (offset) {
      throw methodUnimplemented()
    }

    /**
     * @param {ContentBinary} right
     * @return {boolean}
     */
    mergeWith (right) {
      return false
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {}
    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {}
    /**
     * @param {StructStore} store
     */
    gc (store) {}
    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      writeVarUint8Array(encoder, this.content);
    }

    /**
     * @return {number}
     */
    getRef () {
      return 3
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @return {ContentBinary}
   */
  const readContentBinary = decoder => new ContentBinary(copyUint8Array(readVarUint8Array(decoder)));

  class ContentDeleted {
    /**
     * @param {number} len
     */
    constructor (len) {
      this.len = len;
    }

    /**
     * @return {number}
     */
    getLength () {
      return this.len
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      return []
    }

    /**
     * @return {boolean}
     */
    isCountable () {
      return false
    }

    /**
     * @return {ContentDeleted}
     */
    copy () {
      return new ContentDeleted(this.len)
    }

    /**
     * @param {number} offset
     * @return {ContentDeleted}
     */
    splice (offset) {
      const right = new ContentDeleted(this.len - offset);
      this.len = offset;
      return right
    }

    /**
     * @param {ContentDeleted} right
     * @return {boolean}
     */
    mergeWith (right) {
      this.len += right.len;
      return true
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {
      addToDeleteSet(transaction.deleteSet, item.id, this.len);
      item.markDeleted();
    }

    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {}
    /**
     * @param {StructStore} store
     */
    gc (store) {}
    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      writeVarUint(encoder, this.len - offset);
    }

    /**
     * @return {number}
     */
    getRef () {
      return 1
    }
  }

  /**
   * @private
   *
   * @param {decoding.Decoder} decoder
   * @return {ContentDeleted}
   */
  const readContentDeleted = decoder => new ContentDeleted(readVarUint(decoder));

  /**
   * @private
   */
  class ContentEmbed {
    /**
     * @param {Object} embed
     */
    constructor (embed) {
      this.embed = embed;
    }

    /**
     * @return {number}
     */
    getLength () {
      return 1
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      return [this.embed]
    }

    /**
     * @return {boolean}
     */
    isCountable () {
      return true
    }

    /**
     * @return {ContentEmbed}
     */
    copy () {
      return new ContentEmbed(this.embed)
    }

    /**
     * @param {number} offset
     * @return {ContentEmbed}
     */
    splice (offset) {
      throw methodUnimplemented()
    }

    /**
     * @param {ContentEmbed} right
     * @return {boolean}
     */
    mergeWith (right) {
      return false
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {}
    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {}
    /**
     * @param {StructStore} store
     */
    gc (store) {}
    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      writeVarString(encoder, JSON.stringify(this.embed));
    }

    /**
     * @return {number}
     */
    getRef () {
      return 5
    }
  }

  /**
   * @private
   *
   * @param {decoding.Decoder} decoder
   * @return {ContentEmbed}
   */
  const readContentEmbed = decoder => new ContentEmbed(JSON.parse(readVarString(decoder)));

  /**
   * @private
   */
  class ContentFormat {
    /**
     * @param {string} key
     * @param {Object} value
     */
    constructor (key, value) {
      this.key = key;
      this.value = value;
    }

    /**
     * @return {number}
     */
    getLength () {
      return 1
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      return []
    }

    /**
     * @return {boolean}
     */
    isCountable () {
      return false
    }

    /**
     * @return {ContentFormat}
     */
    copy () {
      return new ContentFormat(this.key, this.value)
    }

    /**
     * @param {number} offset
     * @return {ContentFormat}
     */
    splice (offset) {
      throw methodUnimplemented()
    }

    /**
     * @param {ContentFormat} right
     * @return {boolean}
     */
    mergeWith (right) {
      return false
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {}
    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {}
    /**
     * @param {StructStore} store
     */
    gc (store) {}
    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      writeVarString(encoder, this.key);
      writeVarString(encoder, JSON.stringify(this.value));
    }

    /**
     * @return {number}
     */
    getRef () {
      return 6
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @return {ContentFormat}
   */
  const readContentFormat = decoder => new ContentFormat(readVarString(decoder), JSON.parse(readVarString(decoder)));

  /**
   * @private
   */
  class ContentJSON {
    /**
     * @param {Array<any>} arr
     */
    constructor (arr) {
      /**
       * @type {Array<any>}
       */
      this.arr = arr;
    }

    /**
     * @return {number}
     */
    getLength () {
      return this.arr.length
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      return this.arr
    }

    /**
     * @return {boolean}
     */
    isCountable () {
      return true
    }

    /**
     * @return {ContentJSON}
     */
    copy () {
      return new ContentJSON(this.arr)
    }

    /**
     * @param {number} offset
     * @return {ContentJSON}
     */
    splice (offset) {
      const right = new ContentJSON(this.arr.slice(offset));
      this.arr = this.arr.slice(0, offset);
      return right
    }

    /**
     * @param {ContentJSON} right
     * @return {boolean}
     */
    mergeWith (right) {
      this.arr = this.arr.concat(right.arr);
      return true
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {}
    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {}
    /**
     * @param {StructStore} store
     */
    gc (store) {}
    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      const len = this.arr.length;
      writeVarUint(encoder, len - offset);
      for (let i = offset; i < len; i++) {
        const c = this.arr[i];
        writeVarString(encoder, c === undefined ? 'undefined' : JSON.stringify(c));
      }
    }

    /**
     * @return {number}
     */
    getRef () {
      return 2
    }
  }

  /**
   * @private
   *
   * @param {decoding.Decoder} decoder
   * @return {ContentJSON}
   */
  const readContentJSON = decoder => {
    const len = readVarUint(decoder);
    const cs = [];
    for (let i = 0; i < len; i++) {
      const c = readVarString(decoder);
      if (c === 'undefined') {
        cs.push(undefined);
      } else {
        cs.push(JSON.parse(c));
      }
    }
    return new ContentJSON(cs)
  };

  class ContentAny {
    /**
     * @param {Array<any>} arr
     */
    constructor (arr) {
      /**
       * @type {Array<any>}
       */
      this.arr = arr;
    }

    /**
     * @return {number}
     */
    getLength () {
      return this.arr.length
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      return this.arr
    }

    /**
     * @return {boolean}
     */
    isCountable () {
      return true
    }

    /**
     * @return {ContentAny}
     */
    copy () {
      return new ContentAny(this.arr)
    }

    /**
     * @param {number} offset
     * @return {ContentAny}
     */
    splice (offset) {
      const right = new ContentAny(this.arr.slice(offset));
      this.arr = this.arr.slice(0, offset);
      return right
    }

    /**
     * @param {ContentAny} right
     * @return {boolean}
     */
    mergeWith (right) {
      this.arr = this.arr.concat(right.arr);
      return true
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {}
    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {}
    /**
     * @param {StructStore} store
     */
    gc (store) {}
    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      const len = this.arr.length;
      writeVarUint(encoder, len - offset);
      for (let i = offset; i < len; i++) {
        const c = this.arr[i];
        writeAny(encoder, c);
      }
    }

    /**
     * @return {number}
     */
    getRef () {
      return 8
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @return {ContentAny}
   */
  const readContentAny = decoder => {
    const len = readVarUint(decoder);
    const cs = [];
    for (let i = 0; i < len; i++) {
      cs.push(readAny(decoder));
    }
    return new ContentAny(cs)
  };

  /**
   * @private
   */
  class ContentString {
    /**
     * @param {string} str
     */
    constructor (str) {
      /**
       * @type {string}
       */
      this.str = str;
    }

    /**
     * @return {number}
     */
    getLength () {
      return this.str.length
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      return this.str.split('')
    }

    /**
     * @return {boolean}
     */
    isCountable () {
      return true
    }

    /**
     * @return {ContentString}
     */
    copy () {
      return new ContentString(this.str)
    }

    /**
     * @param {number} offset
     * @return {ContentString}
     */
    splice (offset) {
      const right = new ContentString(this.str.slice(offset));
      this.str = this.str.slice(0, offset);
      return right
    }

    /**
     * @param {ContentString} right
     * @return {boolean}
     */
    mergeWith (right) {
      this.str += right.str;
      return true
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {}
    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {}
    /**
     * @param {StructStore} store
     */
    gc (store) {}
    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      writeVarString(encoder, offset === 0 ? this.str : this.str.slice(offset));
    }

    /**
     * @return {number}
     */
    getRef () {
      return 4
    }
  }

  /**
   * @private
   *
   * @param {decoding.Decoder} decoder
   * @return {ContentString}
   */
  const readContentString = decoder => new ContentString(readVarString(decoder));

  /**
   * @type {Array<function(decoding.Decoder):AbstractType<any>>}
   * @private
   */
  const typeRefs = [
    readYArray,
    readYMap,
    readYText,
    readYXmlElement,
    readYXmlFragment,
    readYXmlHook,
    readYXmlText
  ];

  const YArrayRefID = 0;
  const YMapRefID = 1;
  const YTextRefID = 2;
  const YXmlElementRefID = 3;
  const YXmlFragmentRefID = 4;
  const YXmlHookRefID = 5;
  const YXmlTextRefID = 6;

  /**
   * @private
   */
  class ContentType {
    /**
     * @param {AbstractType<YEvent>} type
     */
    constructor (type) {
      /**
       * @type {AbstractType<any>}
       */
      this.type = type;
    }

    /**
     * @return {number}
     */
    getLength () {
      return 1
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      return [this.type]
    }

    /**
     * @return {boolean}
     */
    isCountable () {
      return true
    }

    /**
     * @return {ContentType}
     */
    copy () {
      return new ContentType(this.type._copy())
    }

    /**
     * @param {number} offset
     * @return {ContentType}
     */
    splice (offset) {
      throw methodUnimplemented()
    }

    /**
     * @param {ContentType} right
     * @return {boolean}
     */
    mergeWith (right) {
      return false
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {
      this.type._integrate(transaction.doc, item);
    }

    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {
      let item = this.type._start;
      while (item !== null) {
        if (!item.deleted) {
          item.delete(transaction);
        } else {
          // Whis will be gc'd later and we want to merge it if possible
          // We try to merge all deleted items after each transaction,
          // but we have no knowledge about that this needs to be merged
          // since it is not in transaction.ds. Hence we add it to transaction._mergeStructs
          transaction._mergeStructs.push(item);
        }
        item = item.right;
      }
      this.type._map.forEach(item => {
        if (!item.deleted) {
          item.delete(transaction);
        } else {
          // same as above
          transaction._mergeStructs.push(item);
        }
      });
      transaction.changed.delete(this.type);
    }

    /**
     * @param {StructStore} store
     */
    gc (store) {
      let item = this.type._start;
      while (item !== null) {
        item.gc(store, true);
        item = item.right;
      }
      this.type._start = null;
      this.type._map.forEach(/** @param {Item | null} item */ (item) => {
        while (item !== null) {
          item.gc(store, true);
          item = item.left;
        }
      });
      this.type._map = new Map();
    }

    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      this.type._write(encoder);
    }

    /**
     * @return {number}
     */
    getRef () {
      return 7
    }
  }

  /**
   * @private
   *
   * @param {decoding.Decoder} decoder
   * @return {ContentType}
   */
  const readContentType = decoder => new ContentType(typeRefs[readVarUint(decoder)](decoder));

  /**
   * @todo This should return several items
   *
   * @param {StructStore} store
   * @param {ID} id
   * @return {{item:Item, diff:number}}
   */
  const followRedone = (store, id) => {
    /**
     * @type {ID|null}
     */
    let nextID = id;
    let diff = 0;
    let item;
    do {
      if (diff > 0) {
        nextID = createID(nextID.client, nextID.clock + diff);
      }
      item = getItem(store, nextID);
      diff = nextID.clock - item.id.clock;
      nextID = item.redone;
    } while (nextID !== null && item instanceof Item)
    return {
      item, diff
    }
  };

  /**
   * Make sure that neither item nor any of its parents is ever deleted.
   *
   * This property does not persist when storing it into a database or when
   * sending it to other peers
   *
   * @param {Item|null} item
   * @param {boolean} keep
   */
  const keepItem = (item, keep) => {
    while (item !== null && item.keep !== keep) {
      item.keep = keep;
      item = /** @type {AbstractType<any>} */ (item.parent)._item;
    }
  };

  /**
   * Split leftItem into two items
   * @param {Transaction} transaction
   * @param {Item} leftItem
   * @param {number} diff
   * @return {Item}
   *
   * @function
   * @private
   */
  const splitItem = (transaction, leftItem, diff) => {
    // create rightItem
    const { client, clock } = leftItem.id;
    const rightItem = new Item(
      createID(client, clock + diff),
      leftItem,
      createID(client, clock + diff - 1),
      leftItem.right,
      leftItem.rightOrigin,
      leftItem.parent,
      leftItem.parentSub,
      leftItem.content.splice(diff)
    );
    if (leftItem.deleted) {
      rightItem.markDeleted();
    }
    if (leftItem.keep) {
      rightItem.keep = true;
    }
    if (leftItem.redone !== null) {
      rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
    }
    // update left (do not set leftItem.rightOrigin as it will lead to problems when syncing)
    leftItem.right = rightItem;
    // update right
    if (rightItem.right !== null) {
      rightItem.right.left = rightItem;
    }
    // right is more specific.
    transaction._mergeStructs.push(rightItem);
    // update parent._map
    if (rightItem.parentSub !== null && rightItem.right === null) {
      /** @type {AbstractType<any>} */ (rightItem.parent)._map.set(rightItem.parentSub, rightItem);
    }
    leftItem.length = diff;
    return rightItem
  };

  /**
   * Redoes the effect of this operation.
   *
   * @param {Transaction} transaction The Yjs instance.
   * @param {Item} item
   * @param {Set<Item>} redoitems
   *
   * @return {Item|null}
   *
   * @private
   */
  const redoItem = (transaction, item, redoitems) => {
    const doc = transaction.doc;
    const store = doc.store;
    const ownClientID = doc.clientID;
    const redone = item.redone;
    if (redone !== null) {
      return getItemCleanStart(transaction, redone)
    }
    let parentItem = /** @type {AbstractType<any>} */ (item.parent)._item;
    /**
     * @type {Item|null}
     */
    let left;
    /**
     * @type {Item|null}
     */
    let right;
    if (item.parentSub === null) {
      // Is an array item. Insert at the old position
      left = item.left;
      right = item;
    } else {
      // Is a map item. Insert as current value
      left = item;
      while (left.right !== null) {
        left = left.right;
        if (left.id.client !== ownClientID) {
          // It is not possible to redo this item because it conflicts with a
          // change from another client
          return null
        }
      }
      if (left.right !== null) {
        left = /** @type {Item} */ (/** @type {AbstractType<any>} */ (item.parent)._map.get(item.parentSub));
      }
      right = null;
    }
    // make sure that parent is redone
    if (parentItem !== null && parentItem.deleted === true && parentItem.redone === null) {
      // try to undo parent if it will be undone anyway
      if (!redoitems.has(parentItem) || redoItem(transaction, parentItem, redoitems) === null) {
        return null
      }
    }
    if (parentItem !== null && parentItem.redone !== null) {
      while (parentItem.redone !== null) {
        parentItem = getItemCleanStart(transaction, parentItem.redone);
      }
      // find next cloned_redo items
      while (left !== null) {
        /**
         * @type {Item|null}
         */
        let leftTrace = left;
        // trace redone until parent matches
        while (leftTrace !== null && /** @type {AbstractType<any>} */ (leftTrace.parent)._item !== parentItem) {
          leftTrace = leftTrace.redone === null ? null : getItemCleanStart(transaction, leftTrace.redone);
        }
        if (leftTrace !== null && /** @type {AbstractType<any>} */ (leftTrace.parent)._item === parentItem) {
          left = leftTrace;
          break
        }
        left = left.left;
      }
      while (right !== null) {
        /**
         * @type {Item|null}
         */
        let rightTrace = right;
        // trace redone until parent matches
        while (rightTrace !== null && /** @type {AbstractType<any>} */ (rightTrace.parent)._item !== parentItem) {
          rightTrace = rightTrace.redone === null ? null : getItemCleanStart(transaction, rightTrace.redone);
        }
        if (rightTrace !== null && /** @type {AbstractType<any>} */ (rightTrace.parent)._item === parentItem) {
          right = rightTrace;
          break
        }
        right = right.right;
      }
    }
    const nextClock = getState(store, ownClientID);
    const nextId = createID(ownClientID, nextClock);
    const redoneItem = new Item(
      nextId,
      left, left && left.lastId,
      right, right && right.id,
      parentItem === null ? item.parent : /** @type {ContentType} */ (parentItem.content).type,
      item.parentSub,
      item.content.copy()
    );
    item.redone = nextId;
    keepItem(redoneItem, true);
    redoneItem.integrate(transaction, 0);
    return redoneItem
  };

  /**
   * Abstract class that represents any content.
   */
  class Item extends AbstractStruct {
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
    constructor (id, left, origin, right, rightOrigin, parent, parentSub, content) {
      super(id, content.getLength());
      /**
       * The item that was originally to the left of this item.
       * @type {ID | null}
       */
      this.origin = origin;
      /**
       * The item that is currently to the left of this item.
       * @type {Item | null}
       */
      this.left = left;
      /**
       * The item that is currently to the right of this item.
       * @type {Item | null}
       */
      this.right = right;
      /**
       * The item that was originally to the right of this item.
       * @type {ID | null}
       */
      this.rightOrigin = rightOrigin;
      /**
       * @type {AbstractType<any>|ID|null}
       */
      this.parent = parent;
      /**
       * If the parent refers to this item with some kind of key (e.g. YMap, the
       * key is specified here. The key is then used to refer to the list in which
       * to insert this item. If `parentSub = null` type._start is the list in
       * which to insert to. Otherwise it is `parent._map`.
       * @type {String | null}
       */
      this.parentSub = parentSub;
      /**
       * If this type's effect is reundone this type refers to the type that undid
       * this operation.
       * @type {ID | null}
       */
      this.redone = null;
      /**
       * @type {AbstractContent}
       */
      this.content = content;
      this.info = this.content.isCountable() ? BIT2 : 0;
    }

    /**
     * If true, do not garbage collect this Item.
     */
    get keep () {
      return (this.info & BIT1) > 0
    }

    set keep (doKeep) {
      if (this.keep !== doKeep) {
        this.info ^= BIT1;
      }
    }

    get countable () {
      return (this.info & BIT2) > 0
    }

    /**
     * Whether this item was deleted or not.
     * @type {Boolean}
     */
    get deleted () {
      return (this.info & BIT3) > 0
    }

    set deleted (doDelete) {
      if (this.deleted !== doDelete) {
        this.info ^= BIT3;
      }
    }

    markDeleted () {
      this.info |= BIT3;
    }

    /**
     * Return the creator clientID of the missing op or define missing items and return null.
     *
     * @param {Transaction} transaction
     * @param {StructStore} store
     * @return {null | number}
     */
    getMissing (transaction, store) {
      if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
        return this.origin.client
      }
      if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
        return this.rightOrigin.client
      }
      if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
        return this.parent.client
      }

      // We have all missing ids, now find the items

      if (this.origin) {
        this.left = getItemCleanEnd(transaction, store, this.origin);
        this.origin = this.left.lastId;
      }
      if (this.rightOrigin) {
        this.right = getItemCleanStart(transaction, this.rightOrigin);
        this.rightOrigin = this.right.id;
      }
      // only set parent if this shouldn't be garbage collected
      if (!this.parent) {
        if (this.left && this.left.constructor === Item) {
          this.parent = this.left.parent;
          this.parentSub = this.left.parentSub;
        }
        if (this.right && this.right.constructor === Item) {
          this.parent = this.right.parent;
          this.parentSub = this.right.parentSub;
        }
      } else if (this.parent.constructor === ID) {
        const parentItem = getItem(store, this.parent);
        if (parentItem.constructor === GC) {
          this.parent = null;
        } else {
          this.parent = /** @type {ContentType} */ (parentItem.content).type;
        }
      }
      return null
    }

    /**
     * @param {Transaction} transaction
     * @param {number} offset
     */
    integrate (transaction, offset) {
      if (offset > 0) {
        this.id.clock += offset;
        this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
        this.origin = this.left.lastId;
        this.content = this.content.splice(offset);
        this.length -= offset;
      }

      if (this.parent) {
        if ((!this.left && (!this.right || this.right.left !== null)) || (this.left && this.left.right !== this.right)) {
          /**
           * @type {Item|null}
           */
          let left = this.left;

          /**
           * @type {Item|null}
           */
          let o;
          // set o to the first conflicting item
          if (left !== null) {
            o = left.right;
          } else if (this.parentSub !== null) {
            o = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null;
            while (o !== null && o.left !== null) {
              o = o.left;
            }
          } else {
            o = /** @type {AbstractType<any>} */ (this.parent)._start;
          }
          // TODO: use something like DeleteSet here (a tree implementation would be best)
          // @todo use global set definitions
          /**
           * @type {Set<Item>}
           */
          const conflictingItems = new Set();
          /**
           * @type {Set<Item>}
           */
          const itemsBeforeOrigin = new Set();
          // Let c in conflictingItems, b in itemsBeforeOrigin
          // ***{origin}bbbb{this}{c,b}{c,b}{o}***
          // Note that conflictingItems is a subset of itemsBeforeOrigin
          while (o !== null && o !== this.right) {
            itemsBeforeOrigin.add(o);
            conflictingItems.add(o);
            if (compareIDs(this.origin, o.origin)) {
              // case 1
              if (o.id.client < this.id.client) {
                left = o;
                conflictingItems.clear();
              }
            } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
              // case 2
              if (o.origin === null || !conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
                left = o;
                conflictingItems.clear();
              }
            } else {
              break
            }
            o = o.right;
          }
          this.left = left;
        }
        // reconnect left/right + update parent map/start if necessary
        if (this.left !== null) {
          const right = this.left.right;
          this.right = right;
          this.left.right = this;
        } else {
          let r;
          if (this.parentSub !== null) {
            r = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null;
            while (r !== null && r.left !== null) {
              r = r.left;
            }
          } else {
            r = /** @type {AbstractType<any>} */ (this.parent)._start
            ;/** @type {AbstractType<any>} */ (this.parent)._start = this;
          }
          this.right = r;
        }
        if (this.right !== null) {
          this.right.left = this;
        } else if (this.parentSub !== null) {
          // set as current parent value if right === null and this is parentSub
          /** @type {AbstractType<any>} */ (this.parent)._map.set(this.parentSub, this);
          if (this.left !== null) {
            // this is the current attribute value of parent. delete right
            this.left.delete(transaction);
          }
        }
        // adjust length of parent
        if (this.parentSub === null && this.countable && !this.deleted) {
          /** @type {AbstractType<any>} */ (this.parent)._length += this.length;
        }
        addStruct(transaction.doc.store, this);
        this.content.integrate(transaction, this);
        // add parent to transaction.changed
        addChangedTypeToTransaction(transaction, /** @type {AbstractType<any>} */ (this.parent), this.parentSub);
        if ((/** @type {AbstractType<any>} */ (this.parent)._item !== null && /** @type {AbstractType<any>} */ (this.parent)._item.deleted) || (this.right !== null && this.parentSub !== null)) {
          // delete if parent is deleted or if this is not the current attribute value of parent
          this.delete(transaction);
        }
      } else {
        // parent is not defined. Integrate GC struct instead
        new GC(this.id, this.length).integrate(transaction, 0);
      }
    }

    /**
     * Returns the next non-deleted item
     */
    get next () {
      let n = this.right;
      while (n !== null && n.deleted) {
        n = n.right;
      }
      return n
    }

    /**
     * Returns the previous non-deleted item
     */
    get prev () {
      let n = this.left;
      while (n !== null && n.deleted) {
        n = n.left;
      }
      return n
    }

    /**
     * Computes the last content address of this Item.
     */
    get lastId () {
      // allocating ids is pretty costly because of the amount of ids created, so we try to reuse whenever possible
      return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1)
    }

    /**
     * Try to merge two items
     *
     * @param {Item} right
     * @return {boolean}
     */
    mergeWith (right) {
      if (
        compareIDs(right.origin, this.lastId) &&
        this.right === right &&
        compareIDs(this.rightOrigin, right.rightOrigin) &&
        this.id.client === right.id.client &&
        this.id.clock + this.length === right.id.clock &&
        this.deleted === right.deleted &&
        this.redone === null &&
        right.redone === null &&
        this.content.constructor === right.content.constructor &&
        this.content.mergeWith(right.content)
      ) {
        if (right.keep) {
          this.keep = true;
        }
        this.right = right.right;
        if (this.right !== null) {
          this.right.left = this;
        }
        this.length += right.length;
        return true
      }
      return false
    }

    /**
     * Mark this Item as deleted.
     *
     * @param {Transaction} transaction
     */
    delete (transaction) {
      if (!this.deleted) {
        const parent = /** @type {AbstractType<any>} */ (this.parent);
        // adjust the length of parent
        if (this.countable && this.parentSub === null) {
          parent._length -= this.length;
        }
        this.markDeleted();
        addToDeleteSet(transaction.deleteSet, this.id, this.length);
        setIfUndefined(transaction.changed, parent, create$1).add(this.parentSub);
        this.content.delete(transaction);
      }
    }

    /**
     * @param {StructStore} store
     * @param {boolean} parentGCd
     */
    gc (store, parentGCd) {
      if (!this.deleted) {
        throw unexpectedCase()
      }
      this.content.gc(store);
      if (parentGCd) {
        replaceStruct(store, this, new GC(this.id, this.length));
      } else {
        this.content = new ContentDeleted(this.length);
      }
    }

    /**
     * Transform the properties of this type to binary and write it to an
     * BinaryEncoder.
     *
     * This is called when this Item is sent to a remote peer.
     *
     * @param {encoding.Encoder} encoder The encoder to write data to.
     * @param {number} offset
     */
    write (encoder, offset) {
      const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
      const rightOrigin = this.rightOrigin;
      const parentSub = this.parentSub;
      const info = (this.content.getRef() & BITS5) |
        (origin === null ? 0 : BIT8) | // origin is defined
        (rightOrigin === null ? 0 : BIT7) | // right origin is defined
        (parentSub === null ? 0 : BIT6); // parentSub is non-null
      writeUint8(encoder, info);
      if (origin !== null) {
        writeID(encoder, origin);
      }
      if (rightOrigin !== null) {
        writeID(encoder, rightOrigin);
      }
      if (origin === null && rightOrigin === null) {
        const parent = /** @type {AbstractType<any>} */ (this.parent);
        const parentItem = parent._item;
        if (parentItem === null) {
          // parent type on y._map
          // find the correct key
          const ykey = findRootTypeKey(parent);
          writeVarUint(encoder, 1); // write parentYKey
          writeVarString(encoder, ykey);
        } else {
          writeVarUint(encoder, 0); // write parent id
          writeID(encoder, parentItem.id);
        }
        if (parentSub !== null) {
          writeVarString(encoder, parentSub);
        }
      }
      this.content.write(encoder, offset);
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @param {number} info
   */
  const readItemContent = (decoder, info) => contentRefs[info & BITS5](decoder);

  /**
   * A lookup map for reading Item content.
   *
   * @type {Array<function(decoding.Decoder):AbstractContent>}
   */
  const contentRefs = [
    () => { throw unexpectedCase() }, // GC is not ItemContent
    readContentDeleted,
    readContentJSON,
    readContentBinary,
    readContentString,
    readContentEmbed,
    readContentFormat,
    readContentType,
    readContentAny
  ];

  /**
   * Do not implement this class!
   */
  class AbstractContent {
    /**
     * @return {number}
     */
    getLength () {
      throw methodUnimplemented()
    }

    /**
     * @return {Array<any>}
     */
    getContent () {
      throw methodUnimplemented()
    }

    /**
     * Should return false if this Item is some kind of meta information
     * (e.g. format information).
     *
     * * Whether this Item should be addressable via `yarray.get(i)`
     * * Whether this Item should be counted when computing yarray.length
     *
     * @return {boolean}
     */
    isCountable () {
      throw methodUnimplemented()
    }

    /**
     * @return {AbstractContent}
     */
    copy () {
      throw methodUnimplemented()
    }

    /**
     * @param {number} offset
     * @return {AbstractContent}
     */
    splice (offset) {
      throw methodUnimplemented()
    }

    /**
     * @param {AbstractContent} right
     * @return {boolean}
     */
    mergeWith (right) {
      throw methodUnimplemented()
    }

    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate (transaction, item) {
      throw methodUnimplemented()
    }

    /**
     * @param {Transaction} transaction
     */
    delete (transaction) {
      throw methodUnimplemented()
    }

    /**
     * @param {StructStore} store
     */
    gc (store) {
      throw methodUnimplemented()
    }

    /**
     * @param {encoding.Encoder} encoder
     * @param {number} offset
     */
    write (encoder, offset) {
      throw methodUnimplemented()
    }

    /**
     * @return {number}
     */
    getRef () {
      throw methodUnimplemented()
    }
  }

  /**
   * @param {decoding.Decoder} decoder
   * @param {ID} id
   * @param {number} info
   * @param {Doc} doc
   */
  const readItem = (decoder, id, info, doc) => {
    /**
     * The item that was originally to the left of this item.
     * @type {ID | null}
     */
    const origin = (info & BIT8) === BIT8 ? readID(decoder) : null;
    /**
     * The item that was originally to the right of this item.
     * @type {ID | null}
     */
    const rightOrigin = (info & BIT7) === BIT7 ? readID(decoder) : null;
    const canCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
    const hasParentYKey = canCopyParentInfo ? readVarUint(decoder) === 1 : false;
    /**
     * If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
     * and we read the next string as parentYKey.
     * It indicates how we store/retrieve parent from `y.share`
     * @type {string|null}
     */
    const parentYKey = canCopyParentInfo && hasParentYKey ? readVarString(decoder) : null;

    return new Item(
      id, null, origin, null, rightOrigin,
      canCopyParentInfo && !hasParentYKey ? readID(decoder) : (parentYKey ? doc.get(parentYKey) : null), // parent
      canCopyParentInfo && (info & BIT6) === BIT6 ? readVarString(decoder) : null, // parentSub
      /** @type {AbstractContent} */ (readItemContent(decoder, info)) // item content
    )
  };

  /**
   * @module prng
   */

  /**
   * Xorshift32 is a very simple but elegang PRNG with a period of `2^32-1`.
   */
  class Xorshift32 {
    /**
     * @param {number} seed Unsigned 32 bit number
     */
    constructor (seed) {
      this.seed = seed;
      /**
       * @type {number}
       */
      this._state = seed;
    }

    /**
     * Generate a random signed integer.
     *
     * @return {Number} A 32 bit signed integer.
     */
    next () {
      let x = this._state;
      x ^= x << 13;
      x ^= x >> 17;
      x ^= x << 5;
      this._state = x;
      return (x >>> 0) / (BITS32 + 1)
    }
  }

  /**
   * @module prng
   */

  /**
   * This is a variant of xoroshiro128plus - the fastest full-period generator passing BigCrush without systematic failures.
   *
   * This implementation follows the idea of the original xoroshiro128plus implementation,
   * but is optimized for the JavaScript runtime. I.e.
   * * The operations are performed on 32bit integers (the original implementation works with 64bit values).
   * * The initial 128bit state is computed based on a 32bit seed and Xorshift32.
   * * This implementation returns two 32bit values based on the 64bit value that is computed by xoroshiro128plus.
   *   Caution: The last addition step works slightly different than in the original implementation - the add carry of the
   *   first 32bit addition is not carried over to the last 32bit.
   *
   * [Reference implementation](http://vigna.di.unimi.it/xorshift/xoroshiro128plus.c)
   */
  class Xoroshiro128plus {
    /**
     * @param {number} seed Unsigned 32 bit number
     */
    constructor (seed) {
      this.seed = seed;
      // This is a variant of Xoroshiro128plus to fill the initial state
      const xorshift32 = new Xorshift32(seed);
      this.state = new Uint32Array(4);
      for (let i = 0; i < 4; i++) {
        this.state[i] = xorshift32.next() * BITS32;
      }
      this._fresh = true;
    }

    /**
     * @return {number} Float/Double in [0,1)
     */
    next () {
      const state = this.state;
      if (this._fresh) {
        this._fresh = false;
        return ((state[0] + state[2]) >>> 0) / BITS32
      } else {
        this._fresh = true;
        const s0 = state[0];
        const s1 = state[1];
        const s2 = state[2] ^ s0;
        const s3 = state[3] ^ s1;
        // function js_rotl (x, k) {
        //   k = k - 32
        //   const x1 = x[0]
        //   const x2 = x[1]
        //   x[0] = x2 << k | x1 >>> (32 - k)
        //   x[1] = x1 << k | x2 >>> (32 - k)
        // }
        // rotl(s0, 55) // k = 23 = 55 - 32; j = 9 =  32 - 23
        state[0] = (s1 << 23 | s0 >>> 9) ^ s2 ^ (s2 << 14 | s3 >>> 18);
        state[1] = (s0 << 23 | s1 >>> 9) ^ s3 ^ (s3 << 14);
        // rol(s1, 36) // k = 4 = 36 - 32; j = 23 = 32 - 9
        state[2] = s3 << 4 | s2 >>> 28;
        state[3] = s2 << 4 | s3 >>> 28;
        return (((state[1] + state[3]) >>> 0) / (BITS32 + 1))
      }
    }
  }

  /*
  // Reference implementation
  // Source: http://vigna.di.unimi.it/xorshift/xoroshiro128plus.c
  // By David Blackman and Sebastiano Vigna
  // Who published the reference implementation under Public Domain (CC0)

  #include <stdint.h>
  #include <stdio.h>

  uint64_t s[2];

  static inline uint64_t rotl(const uint64_t x, int k) {
      return (x << k) | (x >> (64 - k));
  }

  uint64_t next(void) {
      const uint64_t s0 = s[0];
      uint64_t s1 = s[1];
      s1 ^= s0;
      s[0] = rotl(s0, 55) ^ s1 ^ (s1 << 14); // a, b
      s[1] = rotl(s1, 36); // c
      return (s[0] + s[1]) & 0xFFFFFFFF;
  }

  int main(void)
  {
      int i;
      s[0] = 1111 | (1337ul << 32);
      s[1] = 1234 | (9999ul << 32);

      printf("1000 outputs of genrand_int31()\n");
      for (i=0; i<100; i++) {
          printf("%10lu ", i);
          printf("%10lu ", next());
          printf("- %10lu ", s[0] >> 32);
          printf("%10lu ", (s[0] << 32) >> 32);
          printf("%10lu ", s[1] >> 32);
          printf("%10lu ", (s[1] << 32) >> 32);
          printf("\n");
          // if (i%5==4) printf("\n");
      }
      return 0;
  }
  */

  /**
   * Fast Pseudo Random Number Generators.
   *
   * Given a seed a PRNG generates a sequence of numbers that cannot be reasonably predicted.
   * Two PRNGs must generate the same random sequence of numbers if  given the same seed.
   *
   * @module prng
   */

  /**
   * Description of the function
   *  @callback generatorNext
   *  @return {number} A 32bit integer
   */

  /**
   * A random type generator.
   *
   * @typedef {Object} PRNG
   * @property {generatorNext} next Generate new number
   */

  const DefaultPRNG = Xoroshiro128plus;

  /**
   * Create a Xoroshiro128plus Pseudo-Random-Number-Generator.
   * This is the fastest full-period generator passing BigCrush without systematic failures.
   * But there are more PRNGs available in ./PRNG/.
   *
   * @param {number} seed A positive 32bit integer. Do not use negative numbers.
   * @return {PRNG}
   */
  const create$5 = seed => new DefaultPRNG(seed);

  /**
   * Generates a single random bool.
   *
   * @param {PRNG} gen A random number generator.
   * @return {Boolean} A random boolean
   */
  const bool = gen => (gen.next() >= 0.5);

  /**
   * Generates a random integer with 32 bit resolution.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Number} min The lower bound of the allowed return values (inclusive).
   * @param {Number} max The upper bound of the allowed return values (inclusive).
   * @return {Number} A random integer on [min, max]
   */
  const int32 = (gen, min, max) => floor(gen.next() * (max + 1 - min) + min);

  /**
   * @deprecated
   * Optimized version of prng.int32. It has the same precision as prng.int32, but should be preferred when
   * openaring on smaller ranges.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Number} min The lower bound of the allowed return values (inclusive).
   * @param {Number} max The upper bound of the allowed return values (inclusive). The max inclusive number is `binary.BITS31-1`
   * @return {Number} A random integer on [min, max]
   */
  const int31 = (gen, min, max) => int32(gen, min, max);

  /**
   * @param {PRNG} gen
   * @return {string} A single letter (a-z)
   */
  const letter = gen => fromCharCode(int31(gen, 97, 122));

  /**
   * @param {PRNG} gen
   * @param {number} [minLen=0]
   * @param {number} [maxLen=20]
   * @return {string} A random word (0-20 characters) without spaces consisting of letters (a-z)
   */
  const word = (gen, minLen = 0, maxLen = 20) => {
    const len = int31(gen, minLen, maxLen);
    let str = '';
    for (let i = 0; i < len; i++) {
      str += letter(gen);
    }
    return str
  };

  /**
   * TODO: this function produces invalid runes. Does not cover all of utf16!!
   *
   * @param {PRNG} gen
   * @return {string}
   */
  const utf16Rune = gen => {
    const codepoint = int31(gen, 0, 256);
    return fromCodePoint(codepoint)
  };

  /**
   * @param {PRNG} gen
   * @param {number} [maxlen = 20]
   */
  const utf16String = (gen, maxlen = 20) => {
    const len = int31(gen, 0, maxlen);
    let str = '';
    for (let i = 0; i < len; i++) {
      str += utf16Rune(gen);
    }
    return str
  };

  /**
   * Returns one element of a given array.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Array<T>} array Non empty Array of possible values.
   * @return {T} One of the values of the supplied Array.
   * @template T
   */
  const oneOf = (gen, array) => array[int31(gen, 0, array.length - 1)];

  /**
   * Utility helpers for generating statistics.
   *
   * @module statistics
   */

  /**
   * @param {Array<number>} arr Array of values
   * @return {number} Returns null if the array is empty
   */
  const median = arr => arr.length === 0 ? NaN : (arr.length % 2 === 1 ? arr[(arr.length - 1) / 2] : (arr[floor((arr.length - 1) / 2)] + arr[ceil((arr.length - 1) / 2)]) / 2);

  /**
   * @param {Array<number>} arr
   * @return {number}
   */
  const average = arr => arr.reduce(add, 0) / arr.length;

  /**
   * Utility helpers to work with promises.
   *
   * @module promise
   */

  /**
   * Checks if an object is a promise using ducktyping.
   *
   * Promises are often polyfilled, so it makes sense to add some additional guarantees if the user of this
   * library has some insane environment where global Promise objects are overwritten.
   *
   * @param {any} p
   * @return {boolean}
   */
  const isPromise = p => p instanceof Promise || (p && p.then && p.catch && p.finally);

  /**
   * Testing framework with support for generating tests.
   *
   * ```js
   * // test.js template for creating a test executable
   * import { runTests } from 'lib0/testing.js'
   * import * as log from 'lib0/logging.js'
   * import * as mod1 from './mod1.test.js'
   * import * as mod2 from './mod2.test.js'

   * import { isBrowser, isNode } from 'lib0/environment.js'
   *
   * if (isBrowser) {
   *   // optional: if this is ran in the browser, attach a virtual console to the dom
   *   log.createVConsole(document.body)
   * }
   *
   * runTests({
   *  mod1,
   *  mod2,
   * }).then(success => {
   *   if (isNode) {
   *     process.exit(success ? 0 : 1)
   *   }
   * })
   * ```
   *
   * ```js
   * // mod1.test.js
   * /**
   *  * runTests automatically tests all exported functions that start with "test".
   *  * The name of the function should be in camelCase and is used for the logging output.
   *  *
   *  * @param {t.TestCase} tc
   *  *\/
   * export const testMyFirstTest = tc => {
   *   t.compare({ a: 4 }, { a: 4 }, 'objects are equal')
   * }
   * ```
   *
   * Now you can simply run `node test.js` to run your test or run test.js in the browser.
   *
   * @module testing
   */

  const extensive = hasConf('extensive');

  /* istanbul ignore next */
  const envSeed = hasParam('--seed') ? Number.parseInt(getParam('--seed', '0')) : null;

  class TestCase {
    /**
     * @param {string} moduleName
     * @param {string} testName
     */
    constructor (moduleName, testName) {
      /**
       * @type {string}
       */
      this.moduleName = moduleName;
      /**
       * @type {string}
       */
      this.testName = testName;
      this._seed = null;
      this._prng = null;
    }

    resetSeed () {
      this._seed = null;
      this._prng = null;
    }

    /**
     * @type {number}
     */
    /* istanbul ignore next */
    get seed () {
      /* istanbul ignore else */
      if (this._seed === null) {
        /* istanbul ignore next */
        this._seed = envSeed === null ? uint32() : envSeed;
      }
      return this._seed
    }

    /**
     * A PRNG for this test case. Use only this PRNG for randomness to make the test case reproducible.
     *
     * @type {prng.PRNG}
     */
    get prng () {
      /* istanbul ignore else */
      if (this._prng === null) {
        this._prng = create$5(this.seed);
      }
      return this._prng
    }
  }

  const repititionTime = Number(getParam('--repitition-time', '50'));
  /* istanbul ignore next */
  const testFilter = hasParam('--filter') ? getParam('--filter', '') : null;

  /* istanbul ignore next */
  const testFilterRegExp = testFilter !== null ? new RegExp(testFilter) : new RegExp('.*');

  const repeatTestRegex = /^(repeat|repeating)\s/;

  /**
   * @param {string} moduleName
   * @param {string} name
   * @param {function(TestCase):void|Promise<any>} f
   * @param {number} i
   * @param {number} numberOfTests
   */
  const run = async (moduleName, name, f, i, numberOfTests) => {
    const uncamelized = fromCamelCase(name.slice(4), ' ');
    const filtered = !testFilterRegExp.test(`[${i + 1}/${numberOfTests}] ${moduleName}: ${uncamelized}`);
    /* istanbul ignore if */
    if (filtered) {
      return true
    }
    const tc = new TestCase(moduleName, name);
    const repeat = repeatTestRegex.test(uncamelized);
    const groupArgs = [GREY, `[${i + 1}/${numberOfTests}] `, PURPLE, `${moduleName}: `, BLUE, uncamelized];
    /* istanbul ignore next */
    if (testFilter === null) {
      groupCollapsed(...groupArgs);
    } else {
      group(...groupArgs);
    }
    const times = [];
    const start = performance$1.now();
    let lastTime = start;
    let err = null;
    performance$1.mark(`${name}-start`);
    do {
      try {
        const p = f(tc);
        if (isPromise(p)) {
          await p;
        }
      } catch (_err) {
        err = _err;
      }
      const currTime = performance$1.now();
      times.push(currTime - lastTime);
      lastTime = currTime;
      if (repeat && err === null && (lastTime - start) < repititionTime) {
        tc.resetSeed();
      } else {
        break
      }
    } while (err === null && (lastTime - start) < repititionTime)
    performance$1.mark(`${name}-end`);
    /* istanbul ignore if */
    if (err !== null && err.constructor !== SkipError) {
      printError(err);
    }
    performance$1.measure(name, `${name}-start`, `${name}-end`);
    groupEnd();
    const duration = lastTime - start;
    let success = true;
    times.sort((a, b) => a - b);
    /* istanbul ignore next */
    const againMessage = isBrowser
      ? `     - ${window.location.href}?filter=\\[${i + 1}/${tc._seed === null ? '' : `&seed=${tc._seed}`}`
      : `\nrepeat: npm run test -- --filter "\\[${i + 1}/" ${tc._seed === null ? '' : `--seed ${tc._seed}`}`;
    const timeInfo = (repeat && err === null)
      ? ` - ${times.length} repititions in ${humanizeDuration(duration)} (best: ${humanizeDuration(times[0])}, worst: ${humanizeDuration(last(times))}, median: ${humanizeDuration(median(times))}, average: ${humanizeDuration(average(times))})`
      : ` in ${humanizeDuration(duration)}`;
    if (err !== null) {
      /* istanbul ignore else */
      if (err.constructor === SkipError) {
        print(GREY, BOLD, 'Skipped: ', UNBOLD, uncamelized);
      } else {
        success = false;
        print(RED, BOLD, 'Failure: ', UNBOLD, UNCOLOR, uncamelized, GREY, timeInfo, againMessage);
      }
    } else {
      print(GREEN, BOLD, 'Success: ', UNBOLD, UNCOLOR, uncamelized, GREY, timeInfo, againMessage);
    }
    return success
  };

  /**
   * Describe what you are currently testing. The message will be logged.
   *
   * ```js
   * export const testMyFirstTest = tc => {
   *   t.describe('crunching numbers', 'already crunched 4 numbers!') // the optional second argument can describe the state.
   * }
   * ```
   *
   * @param {string} description
   * @param {string} info
   */
  const describe = (description, info = '') => print(BLUE, description, ' ', GREY, info);

  /**
   * Measure the time that it takes to calculate something.
   *
   * ```js
   * export const testMyFirstTest = async tc => {
   *   t.measureTime('measurement', () => {
   *     heavyCalculation()
   *   })
   *   await t.groupAsync('async measurement', async () => {
   *     await heavyAsyncCalculation()
   *   })
   * }
   * ```
   *
   * @param {string} message
   * @param {function():void} f
   * @return {number} Returns a promise that resolves the measured duration to apply f
   */
  const measureTime = (message, f) => {
    let duration;
    const start = performance$1.now();
    try {
      f();
    } finally {
      duration = performance$1.now() - start;
      print(PURPLE, message, GREY, ` ${humanizeDuration(duration)}`);
    }
    return duration
  };

  /**
   * @template T
   * @param {Array<T>} as
   * @param {Array<T>} bs
   * @param {string} [m]
   * @return {boolean}
   */
  const compareArrays = (as, bs, m = 'Arrays match') => {
    if (as.length !== bs.length) {
      fail(m);
    }
    for (let i = 0; i < as.length; i++) {
      if (as[i] !== bs[i]) {
        fail(m);
      }
    }
    return true
  };

  /**
   * @param {any} constructor
   * @param {any} a
   * @param {any} b
   * @param {string} path
   * @throws {TestError}
   */
  const compareValues = (constructor, a, b, path) => {
    if (a !== b) {
      fail(`Values ${stringify(a)} and ${stringify(b)} don't match (${path})`);
    }
    return true
  };

  /**
   * @param {string?} message
   * @param {string} reason
   * @param {string} path
   * @throws {TestError}
   */
  const _failMessage = (message, reason, path) => fail(
    message === null
      ? `${reason} ${path}`
      : `${message} (${reason}) ${path}`
  );

  /**
   * @param {any} a
   * @param {any} b
   * @param {string} path
   * @param {string?} message
   * @param {function(any,any,any,string,any):boolean} customCompare
   */
  const _compare = (a, b, path, message, customCompare) => {
    // we don't use assert here because we want to test all branches (istanbul errors if one branch is not tested)
    if (a == null || b == null) {
      return compareValues(null, a, b, path)
    }
    if (a.constructor !== b.constructor) {
      _failMessage(message, 'Constructors don\'t match', path);
    }
    let success = true;
    switch (a.constructor) {
      case ArrayBuffer:
        a = new Uint8Array(a);
        b = new Uint8Array(b);
      // eslint-disable-next-line no-fallthrough
      case Uint8Array: {
        if (a.byteLength !== b.byteLength) {
          _failMessage(message, 'ArrayBuffer lengths match', path);
        }
        for (let i = 0; success && i < a.length; i++) {
          success = success && a[i] === b[i];
        }
        break
      }
      case Set: {
        if (a.size !== b.size) {
          _failMessage(message, 'Sets have different number of attributes', path);
        }
        // @ts-ignore
        a.forEach(value => {
          if (!b.has(value)) {
            _failMessage(message, `b.${path} does have ${value}`, path);
          }
        });
        break
      }
      case Map: {
        if (a.size !== b.size) {
          _failMessage(message, 'Maps have different number of attributes', path);
        }
        // @ts-ignore
        a.forEach((value, key) => {
          if (!b.has(key)) {
            _failMessage(message, `Property ${path}["${key}"] does not exist on second argument`, path);
          }
          _compare(value, b.get(key), `${path}["${key}"]`, message, customCompare);
        });
        break
      }
      case Object:
        if (length$1(a) !== length$1(b)) {
          _failMessage(message, 'Objects have a different number of attributes', path);
        }
        forEach(a, (value, key) => {
          if (!hasProperty(b, key)) {
            _failMessage(message, `Property ${path} does not exist on second argument`, path);
          }
          _compare(value, b[key], `${path}["${key}"]`, message, customCompare);
        });
        break
      case Array:
        if (a.length !== b.length) {
          _failMessage(message, 'Arrays have a different number of attributes', path);
        }
        // @ts-ignore
        a.forEach((value, i) => _compare(value, b[i], `${path}[${i}]`, message, customCompare));
        break
      /* istanbul ignore next */
      default:
        if (!customCompare(a.constructor, a, b, path, compareValues)) {
          _failMessage(message, `Values ${stringify(a)} and ${stringify(b)} don't match`, path);
        }
    }
    assert(success, message);
    return true
  };

  /**
   * @template T
   * @param {T} a
   * @param {T} b
   * @param {string?} [message]
   * @param {function(any,T,T,string,any):boolean} [customCompare]
   */
  const compare = (a, b, message = null, customCompare = compareValues) => _compare(a, b, 'obj', message, customCompare);

  /* istanbul ignore next */
  /**
   * @param {boolean} condition
   * @param {string?} [message]
   * @throws {TestError}
   */
  const assert = (condition, message = null) => condition || fail(`Assertion failed${message !== null ? `: ${message}` : ''}`);

  /**
   * @param {function():void} f
   * @throws {TestError}
   */
  const fails = f => {
    let err = null;
    try {
      f();
    } catch (_err) {
      err = _err;
      print(GREEN, '⇖ This Error was expected');
    }
    /* istanbul ignore if */
    if (err === null) {
      fail('Expected this to fail');
    }
  };

  /**
   * @param {Object<string, Object<string, function(TestCase):void|Promise<any>>>} tests
   */
  const runTests = async tests => {
    const numberOfTests = map$1(tests, mod => map$1(mod, f => /* istanbul ignore next */ f ? 1 : 0).reduce(add, 0)).reduce(add, 0);
    let successfulTests = 0;
    let testnumber = 0;
    const start = performance$1.now();
    for (const modName in tests) {
      const mod = tests[modName];
      for (const fname in mod) {
        const f = mod[fname];
        /* istanbul ignore else */
        if (f) {
          const repeatEachTest = 1;
          let success = true;
          for (let i = 0; success && i < repeatEachTest; i++) {
            success = await run(modName, fname, f, testnumber, numberOfTests);
          }
          testnumber++;
          /* istanbul ignore else */
          if (success) {
            successfulTests++;
          }
        }
      }
    }
    const end = performance$1.now();
    print('');
    const success = successfulTests === numberOfTests;
    /* istanbul ignore next */
    if (success) {
      /* istanbul ignore next */
      print(GREEN, BOLD, 'All tests successful!', GREY, UNBOLD, ` in ${humanizeDuration(end - start)}`);
      /* istanbul ignore next */
      printImgBase64(nyanCatImage, 50);
    } else {
      const failedTests = numberOfTests - successfulTests;
      print(RED, BOLD, `> ${failedTests} test${failedTests > 1 ? 's' : ''} failed`);
    }
    return success
  };

  class TestError extends Error {}

  /**
   * @param {string} reason
   * @throws {TestError}
   */
  const fail = reason => {
    print(RED, BOLD, 'X ', UNBOLD, reason);
    throw new TestError('Test Failed')
  };

  class SkipError extends Error {}

  /**
   * @param {boolean} cond If true, this tests will be skipped
   * @throws {SkipError}
   */
  const skip = (cond = true) => {
    if (cond) {
      throw new SkipError('skipping..')
    }
  };

  // eslint-disable-next-line
  const nyanCatImage = 'R0lGODlhjABMAPcAAMiSE0xMTEzMzUKJzjQ0NFsoKPc7//FM/9mH/z9x0HIiIoKCgmBHN+frGSkZLdDQ0LCwsDk71g0KCUzDdrQQEOFz/8yYdelmBdTiHFxcXDU2erR/mLrTHCgoKK5szBQUFNgSCTk6ymfpCB9VZS2Bl+cGBt2N8kWm0uDcGXhZRUvGq94NCFPhDiwsLGVlZTgqIPMDA1g3aEzS5D6xAURERDtG9JmBjJsZGWs2AD1W6Hp6eswyDeJ4CFNTU1LcEoJRmTMzSd14CTg5ser2GmDzBd17/xkZGUzMvoSMDiEhIfKruCwNAJaWlvRzA8kNDXDrCfi0pe1U/+GS6SZrAB4eHpZwVhoabsx9oiYmJt/TGHFxcYyMjOid0+Zl/0rF6j09PeRr/0zU9DxO6j+z0lXtBtp8qJhMAEssLGhoaPL/GVn/AAsWJ/9/AE3Z/zs9/3cAAOlf/+aa2RIyADo85uhh/0i84WtrazQ0UyMlmDMzPwUFBe16BTMmHau0E03X+g8pMEAoS1MBAf++kkzO8pBaqSZoe9uB/zE0BUQ3Sv///4WFheuiyzo880gzNDIyNissBNqF/8RiAOF2qG5ubj0vL1z6Avl5ASsgGkgUSy8vL/8n/z4zJy8lOv96uEssV1csAN5ZCDQ0Wz1a3tbEGHLeDdYKCg4PATE7PiMVFSoqU83eHEi43gUPAOZ8reGogeKU5dBBC8faHEez2lHYF4bQFMukFtl4CzY3kkzBVJfMGZkAAMfSFf27mP0t//g4/9R6Dfsy/1DRIUnSAPRD/0fMAFQ0Q+l7rnbaD0vEntCDD6rSGtO8GNpUCU/MK07LPNEfC7RaABUWWkgtOst+71v9AfD7GfDw8P19ATtA/NJpAONgB9yL+fm6jzIxMdnNGJxht1/2A9x//9jHGOSX3+5tBP27l35+fk5OTvZ9AhYgTjo0PUhGSDs9+LZjCFf2Aw0IDwcVAA8PD5lwg9+Q7YaChC0kJP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGNEM2MUEyMzE0QTRFMTExOUQzRkE3QTBCRDNBMjdBQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpERjQ0NEY0QkI2MTcxMUUxOUJEQkUzNUNGQTkwRTU2MiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpERjQ0NEY0QUI2MTcxMUUxOUJEQkUzNUNGQTkwRTU2MiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1OEE3RTIwRjcyQTlFMTExOTQ1QkY2QTU5QzVCQjJBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNEM2MUEyMzE0QTRFMTExOUQzRkE3QTBCRDNBMjdBQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAkKABEAIf4jUmVzaXplZCBvbiBodHRwczovL2V6Z2lmLmNvbS9yZXNpemUALAAAAACMAEwAAAj/ACMIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXLkxEcuXMAm6jElTZaKZNXOOvOnyps6fInECHdpRKNGjSJMqXZrSKNOnC51CnUq1qtWrWLNC9GmQq9avYMOKHUs2aFmmUs8SlcC2rdu3cNWeTEG3rt27eBnIHflBj6C/gAMLHpxCz16QElJw+7tom+PHkCOP+8utiuHDHRP/5WICgefPkIYV8RAjxudtkwVZjqCnNeaMmheZqADm8+coHn5kyPBt2udFvKrc+7A7gITXFzV77hLF9ucYGRaYo+FhWhHPUKokobFgQYbjyCsq/3fuHHr3BV88HMBeZd357+HFpxBEvnz0961b3+8OP37DtgON5xxznpl3ng5aJKiFDud5B55/Ct3TQwY93COQgLZV0AUC39ihRYMggjhJDw9CeNA9kyygxT2G6TGfcxUY8pkeH3YHgTkMNrgFBJOYs8Akl5l4Yoor3mPki6BpUsGMNS6QiA772WjNPR8CSRAjWBI0B5ZYikGQGFwyMseVYWoZppcDhSkmmVyaySWaAqk5pkBbljnQlnNYEZ05fGaAJGieVQAMjd2ZY+R+X2Rgh5FVBhmBG5BGKumklFZq6aWYZqrpppTOIQQNNPjoJ31RbGibIRXQuIExrSSY4wI66P9gToJlGHOFo374MQg2vGLjRa65etErNoMA68ew2Bi7a6+/Aitsr8UCi6yywzYb7LDR5jotsMvyau0qJJCwGw0vdrEkeTRe0UknC7hQYwYMQrmAMZ2U4WgY+Lahbxt+4Ovvvm34i68fAAscBsD9+kvwvgYDHLDACAu8sL4NFwzxvgkP3EYhhYzw52dFhOPZD5Ns0Iok6PUwyaIuTJLBBwuUIckG8RCkhhrUHKHzEUTcfLM7Ox/hjs9qBH0E0ZUE3bPPQO9cCdFGIx300EwH/bTPUfuc9M5U30zEzhN87NkwcDyXgY/oxaP22vFQIR2JBT3xBDhEUyO33FffXMndT1D/QzTfdPts9915qwEO3377DHjdfBd++N2J47y44Ij7PMN85UgBxzCeQQKJbd9wFyKI6jgqUBqoD6G66qinvvoQ1bSexutDyF4N7bLTHnvruLd+++u5v76766vb3jvxM0wxnyBQxHEued8Y8cX01Fc/fQcHZaG97A1or30DsqPgfRbDpzF+FtyPD37r4ns/fDXnp+/9+qif//74KMj/fRp9TEIDAxb4ixIWQcACFrAMFkigAhPIAAmwyHQDYYMEJ0jBClrwghjMoAY3yMEOYhAdQaCBFtBAAD244oQoTKEKV5iCbizEHjCkoCVgCENLULAJNLTHNSZ4jRzaQ4Y5tOEE+X24Qwn2MIdApKEQJUhEHvowiTBkhh7QVqT8GOmKWHwgFiWghR5AkCA+DKMYx0jGMprxjGhMYw5XMEXvGAZF5piEhQyih1CZ4wt6kIARfORFhjwDBoCEQQkIUoJAwmAFBDEkDAhSCkMOciCFDCQiB6JIgoDAkYQ0JAgSaUhLYnIgFLjH9AggkHsQYHo1oyMVptcCgUjvCx34opAWkp/L1BIhtxxILmfJy17KxJcrSQswhykWYRLzI8Y8pjKXycxfNvOZMEkmNC0izWlSpJrWlAg2s8kQnkRgJt7kpja92ZNwivOcNdkmOqOyzoyos50IeSc850nPegIzIAAh+QQJCgARACwAAAAAjABMAAAI/wAjCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJcmKikihTZkx0UqXLlw5ZwpxJ02DLmjhz6twJkqVMnz55Ch1KtGhCmUaTYkSqtKnJm05rMl0aVefUqlhtFryatavXr2DDHoRKkKzYs2jTqpW61exani3jun0rlCvdrhLy6t3Lt+9dlykCCx5MuDCDvyU/6BHEuLHjx5BT6EEsUkIKbowXbdvMubPncYy5VZlM+aNlxlxMIFjNGtKwIggqDGO9DbSg0aVNpxC0yEQFMKxZRwmHoEiU4AgW8cKdu+Pp1V2OI6c9bdq2cLARQGEeIV7zjM+nT//3oEfPNDiztTOXoMf7d4vhxbP+ts6cORrfIK3efq+8FnN2kPbeRPEFF918NCywgBZafLNfFffEM4k5C0wi4IARFchaBV0gqGCFDX6zQQqZZPChhRgSuBtyFRiC3DcJfqgFDTTSYOKJF6boUIGQaFLBizF+KOSQKA7EyJEEzXHkkWIQJMaSjMxBEJSMJAllk0ZCKWWWS1q5JJYCUbllBEpC6SWTEehxzz0rBqdfbL1AEsONQ9b5oQ73DOTGnnz26eefgAYq6KCEFmoooCHccosdk5yzYhQdBmfIj3N++AAEdCqoiDU62LGAOXkK5Icfg2BjKjZejDqqF6diM4iqfrT/ig2spZ6aqqqsnvqqqrLS2uqtq7a666i9qlqrqbeeQEIGN2awYhc/ilepghAssM6JaCwAQQ8ufBpqBGGE28a4bfgR7rnktnFuuH6ku24Y6Zp7brvkvpuuuuvGuy6949rrbr7kmltHIS6Yw6AWjgoyXRHErTYnPRtskMEXdLrQgzlffKHDBjZ8q4Ya1Bwh8hFEfPyxOyMf4Y7JaqR8BMuVpFyyySiPXAnLLsOc8so0p3yzyTmbHPPIK8sxyYJr9tdmcMPAwdqcG3TSyQZ2fniF1N8+8QQ4LFOjtdY/f1zJ109QwzLZXJvs9ddhqwEO2WabjHbXZLf99tdxgzy32k8Y/70gK+5UMsNu5UiB3mqQvIkA1FJLfO0CFH8ajxZXd/JtGpgPobnmmGe++RDVdJ7G50OIXg3popMeeueod37656l/vrrnm5uOOgZIfJECBpr3sZsgUMQRLXLTEJJBxPRkkETGRmSS8T1a2CCPZANlYb3oDVhvfQOio6B9FrOn8X0W2H/Pfefeaz97NeOXr/35mI+//vcouJ9MO7V03gcDFjCmxCIADGAAr1CFG2mBWQhEoA600IMLseGBEIygBCdIwQpa8IIYzKAGMcgDaGTMFSAMoQhDaAE9HOyEKOyBewZijxZG0BItbKElItiEGNrjGhC8hg3t8UIbzhCCO8ThA+Z1aMMexvCHDwxiDndoRBk+8A03Slp/1CTFKpaHiv3JS9IMssMuevGLYAyjGMdIxjJ6EYoK0oNivmCfL+RIINAD0GT0YCI8rdAgz4CBHmFQAoKUYI8wWAFBAAkDgpQCkH0cyB/3KMiBEJIgIECkHwEJgkECEpKSVKQe39CCjH0gTUbIWAsQcg8CZMw78TDlF76lowxdUSBXfONArrhC9pSnlbjMpS7rssuZzKWXPQHKL4HZEWESMyXDPKZHkqnMZjrzLnZ5pjSnSc1qWmQuzLSmQrCpzW5685vfjCY4x0nOcprznB4JCAAh+QQJCgBIACwAAAAAjABMAAAI/wCRCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJcmGiRCVTqsyIcqXLlzBjypxJs6bNmzgPtjR4MqfPn0CDCh1KtKjNnkaTPtyptKlToEyfShUYderTqlaNnkSJNGvTrl6dYg1bdCzZs2jTqvUpoa3bt3DjrnWZoq7du3jzMphb8oMeQYADCx5MOIUeviIlpOAGeNG2x5AjSx4HmFuVw4g/KgbMxQSCz6AhDSuCoMIw0NsoC7qcWXMKQYtMVAADGnSUcAiKRKmNYBEv1q07bv7cZTfvz9OSfw5HGgEU1vHiBdc4/Djvb3refY5y2jlrPeCnY/+sbv1zjAzmzFGZBgnS5+f3PqTvIUG8RfK1i5vPsGDBpB8egPbcF5P0l0F99jV0z4ILCoQfaBV0sV9/C7jwwzcYblAFGhQemGBDX9BAAwH3HKbHa7xVYEht51FYoYgictghgh8iZMQ95vSnBYP3oBiaJhWwyJ+LRLrooUGlwKCkkgSVsCQMKxD0JAwEgfBkCU0+GeVAUxK0wpVZLrmlQF0O9OWSTpRY4ALp0dCjILy5Vxow72hR5J0U2oGZQPb06eefgAYq6KCEFmrooYj6CQMIICgAIw0unINiFBLWZkgFetjZnzU62EEkEw/QoIN/eyLh5zWoXmPJn5akek0TrLr/Cqirq/rZaqqw2ppqrX02QWusuAKr6p++7trnDtAka8o5NKDYRZDHZUohBBkMWaEWTEBwj52TlMrGt+CGK+645JZr7rnopquuuejU9YmPtRWBGwKZ2rCBDV98IeMCPaChRb7ybCBPqVkUnMbBaTRQcMENIJwGCgtnUY3DEWfhsMILN4wwxAtPfHA1EaNwccQaH8xxwR6nAfLCIiOMMcMI9wEvaMPA8VmmV3TSCZ4UGtNJGaV+PMTQQztMNNFGH+1wNUcPkbTSCDe9tNRRH51yGlQLDfXBR8ssSDlSwNFdezdrkfPOX7jAZjzcUrGAz0ATBA44lahhtxrUzD133XdX/6I3ONTcrcbf4Aiet96B9/134nb/zbfdh8/NuBp+I3535HQbvrjdM0zxmiBQxAFtbR74u8EGC3yRSb73qPMFAR8sYIM8KdCIBORH5H4EGYITofsR7gj++xGCV/I773f7rnvwdw9f/O9E9P7742o4f7c70AtOxhEzuEADAxYApsQi5JdPvgUb9udCteyzX2EAtiMRxvxt1N+GH/PP74f9beRPP//+CwP/8Je//dkvgPzrn/8G6D8D1g+BAFyg/QiYv1XQQAtoIIAeXMHBDnqQg1VQhxZGSMISjlCDBvGDHwaBjRZiwwsqVKEXXIiNQcTQDzWg4Q1Z6EIYxnCGLrRhDP9z6MId0tCHMqShEFVIxBYasYc3PIEecrSAHZUIPDzK4hV5pAcJ6IFBCHGDGMdIxjKa8YxoTKMa18jGNqJxDlNcQAYOc49JmGMS9ziIHr6Qni+Axwg56kGpDMKIQhIkAoUs5BwIIoZEMiICBHGkGAgyB0cuciCNTGRBJElJSzLSkZtM5CQHUslECuEe+SKAQO5BgHxJxyB6oEK+WiAQI+SrA4Os0UPAEx4k8DKXAvklQXQwR2DqMiVgOeZLkqnMlTCzmdCcy1aQwJVpRjMk06zmM6/pEbNwEyTb/OZHwinOjpCznNREJzaj4k11TiSZ7XSnPHESz3lW5JnntKc+94kTFnjyUyP1/OdSBErQghr0oB0JCAAh+QQFCgAjACwAAAAAjABMAAAI/wBHCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJkmCikihTWjw5giVLlTBjHkz0UmBNmThz6tzJs6fPkTRn3vxJtKjRo0iTbgxqUqlTiC5tPt05dOXUnkyval2YdatXg12/ih07lmZQs2bJql27NSzbqW7fOo0rN2nViBLy6t3Lt29dmfGqCB5MuLBhBvH+pmSQQpAgKJAjS54M2XEVBopLSmjseBGCz6BDi37lWFAVPZlHbnb8SvRnSL0qIKjQK/Q2y6hTh1z9ahuYKK4rGEJgSHboV1BO697d+HOFLq4/e/j2zTmYz8lR37u3vOPq6KGnEf/68mXaNjrAEWT/QL5b943fwX+OkWGBOT3TQie/92HBggwSvCeRHgQSKFB8osExzHz12UdDddhVQYM5/gEoYET3ZDBJBveghmBoRRhHn38LaKHFDyimYIcWJFp44UP39KCFDhno0WFzocERTmgjkrhhBkCy2GKALzq03Tk6LEADFffg+NowshU3jR1okGjllf658EWRMN7zhX80NCkIeLTpISSWaC4wSW4ElQLDm28SVAKcMKxAEJ0wEAQCnSXISaedA+FJ0Ap8+gknoAIJOhChcPYpUCAdUphBc8PAEZ2ZJCZC45UQWIPpmgTZI+qopJZq6qmopqrqqqy2eioMTtz/QwMNmTRXQRGXnqnIFw0u0EOVC9zDIqgDjXrNsddYQqolyF7TxLLNltqssqMyi+yz1SJLrahNTAvttd8mS2q32pJ6ATTQfCKma10YZ+YGV1wRJIkuzAgkvPKwOQIb/Pbr778AByzwwAQXbPDBBZvxSWNSbBMOrghEAR0CZl7RSSclJlkiheawaEwnZeibxchplJxGAyOP3IDJaaCQchbVsPxyFiyjnPLKJruccswlV/MyCjW/jHPJOo/Mcxo+pwy0yTarbHIfnL2ioGvvaGExxrzaJ+wCdvT3ccgE9TzE2GOzTDbZZp/NcjVnD5G22ia3vbbccZ99dBp0iw13yWdD/10aF5BERx899CzwhQTxxHMP4hL0R08GlxQEDjiVqGG5GtRMPnnll1eiOTjUXK7G5+CInrnmoXf+eeqWf8655adPzroanqN+eeyUm7665TNMsQlnUCgh/PDCu1JFD/6ZqPzyvhJgEOxHRH8EGaITIf0R7oh+/RGiV3I99ZdbL332l2/f/fVEVH/962qYf7k76ItOxhEzuABkBhbkr//++aeQyf0ADKDzDBKGArbhgG3wQwEL6AcEtmGBBnQgBMPgQAUusIEInKADHwjBCkIQgwfUoAQ7iEALMtAPa5iEfbTQIT0YgTxGKJAMvfSFDhDoHgT4AgE6hBA/+GEQ2AgiNvy84EMfekGI2BhEEf1QAyQuEYhCJGIRjyhEJRaxiUJ8IhKlaEQkWtGHWAyiFqO4RC/UIIUl2s4H9PAlw+lrBPHQQ4UCtDU7vJEgbsijHvfIxz768Y+ADKQgB0lIQGJjDdvZjkBstJ3EHCSRRLLRHQnCiEoSJAKVrOQcCCKGTDIiApTMpBgIMgdPbnIgncxkQTw5yoGUMpOnFEgqLRnKSrZSIK/U5Ag+kLjEDaSXCQGmQHzJpWIasyV3OaYyl8nMZi7nLsl0ZkagKc1qWvOa2JxLNLPJzW6+ZZvevAhdwrkStJCTI2gZ5zknos51shOc7oynPOdJz3ra857hDAgAOw==';

  /**
   * @module sync-protocol
   */

  /**
   * @typedef {Map<number, number>} StateMap
   */

  /**
   * Core Yjs defines three message types:
   * • YjsSyncStep1: Includes the State Set of the sending client. When received, the client should reply with YjsSyncStep2.
   * • YjsSyncStep2: Includes all missing structs and the complete delete set. When received, the the client is assured that
   *   it received all information from the remote client.
   *
   * In a peer-to-peer network, you may want to introduce a SyncDone message type. Both parties should initiate the connection
   * with SyncStep1. When a client received SyncStep2, it should reply with SyncDone. When the local client received both
   * SyncStep2 and SyncDone, it is assured that it is synced to the remote client.
   *
   * In a client-server model, you want to handle this differently: The client should initiate the connection with SyncStep1.
   * When the server receives SyncStep1, it should reply with SyncStep2 immediately followed by SyncStep1. The client replies
   * with SyncStep2 when it receives SyncStep1. Optionally the server may send a SyncDone after it received SyncStep2, so the
   * client knows that the sync is finished.  There are two reasons for this more elaborated sync model: 1. This protocol can
   * easily be implemented on top of http and websockets. 2. The server shoul only reply to requests, and not initiate them.
   * Therefore it is necesarry that the client initiates the sync.
   *
   * Construction of a message:
   * [messageType : varUint, message definition..]
   *
   * Note: A message does not include information about the room name. This must to be handled by the upper layer protocol!
   *
   * stringify[messageType] stringifies a message definition (messageType is already read from the bufffer)
   */

  const messageYjsSyncStep1 = 0;
  const messageYjsSyncStep2 = 1;
  const messageYjsUpdate = 2;

  /**
   * Create a sync step 1 message based on the state of the current shared document.
   *
   * @param {encoding.Encoder} encoder
   * @param {Y.Doc} doc
   */
  const writeSyncStep1 = (encoder, doc) => {
    writeVarUint(encoder, messageYjsSyncStep1);
    const sv = encodeStateVector(doc);
    writeVarUint8Array(encoder, sv);
  };

  /**
   * @param {encoding.Encoder} encoder
   * @param {Y.Doc} doc
   * @param {Uint8Array} [encodedStateVector]
   */
  const writeSyncStep2 = (encoder, doc, encodedStateVector) => {
    writeVarUint(encoder, messageYjsSyncStep2);
    writeVarUint8Array(encoder, encodeStateAsUpdate(doc, encodedStateVector));
  };

  /**
   * Read SyncStep1 message and reply with SyncStep2.
   *
   * @param {decoding.Decoder} decoder The reply to the received message
   * @param {encoding.Encoder} encoder The received message
   * @param {Y.Doc} doc
   */
  const readSyncStep1 = (decoder, encoder, doc) =>
    writeSyncStep2(encoder, doc, readVarUint8Array(decoder));

  /**
   * Read and apply Structs and then DeleteStore to a y instance.
   *
   * @param {decoding.Decoder} decoder
   * @param {Y.Doc} doc
   * @param {any} transactionOrigin
   */
  const readSyncStep2 = (decoder, doc, transactionOrigin) => {
    applyUpdate(doc, readVarUint8Array(decoder), transactionOrigin);
  };

  /**
   * @param {encoding.Encoder} encoder
   * @param {Uint8Array} update
   */
  const writeUpdate = (encoder, update) => {
    writeVarUint(encoder, messageYjsUpdate);
    writeVarUint8Array(encoder, update);
  };

  /**
   * Read and apply Structs and then DeleteStore to a y instance.
   *
   * @param {decoding.Decoder} decoder
   * @param {Y.Doc} doc
   * @param {any} transactionOrigin
   */
  const readUpdate$1 = readSyncStep2;

  /**
   * @param {decoding.Decoder} decoder A message received from another client
   * @param {encoding.Encoder} encoder The reply message. Will not be sent if empty.
   * @param {Y.Doc} doc
   * @param {any} transactionOrigin
   */
  const readSyncMessage = (decoder, encoder, doc, transactionOrigin) => {
    const messageType = readVarUint(decoder);
    switch (messageType) {
      case messageYjsSyncStep1:
        readSyncStep1(decoder, encoder, doc);
        break
      case messageYjsSyncStep2:
        readSyncStep2(decoder, doc, transactionOrigin);
        break
      case messageYjsUpdate:
        readUpdate$1(decoder, doc, transactionOrigin);
        break
      default:
        throw new Error('Unknown message type')
    }
    return messageType
  };

  /**
   * @param {TestYInstance} y // publish message created by `y` to all other online clients
   * @param {Uint8Array} m
   */
  const broadcastMessage = (y, m) => {
    if (y.tc.onlineConns.has(y)) {
      y.tc.onlineConns.forEach(remoteYInstance => {
        if (remoteYInstance !== y) {
          remoteYInstance._receive(m, y);
        }
      });
    }
  };

  class TestYInstance extends Doc {
    /**
     * @param {TestConnector} testConnector
     * @param {number} clientID
     */
    constructor (testConnector, clientID) {
      super();
      this.userID = clientID; // overwriting clientID
      /**
       * @type {TestConnector}
       */
      this.tc = testConnector;
      /**
       * @type {Map<TestYInstance, Array<Uint8Array>>}
       */
      this.receiving = new Map();
      testConnector.allConns.add(this);
      // set up observe on local model
      this.on('update', /** @param {Uint8Array} update @param {any} origin */ (update, origin) => {
        if (origin !== testConnector) {
          const encoder = createEncoder();
          writeUpdate(encoder, update);
          broadcastMessage(this, toUint8Array(encoder));
        }
      });
      this.connect();
    }

    /**
     * Disconnect from TestConnector.
     */
    disconnect () {
      this.receiving = new Map();
      this.tc.onlineConns.delete(this);
    }

    /**
     * Append yourself to the list of known Y instances in testconnector.
     * Also initiate sync with all clients.
     */
    connect () {
      if (!this.tc.onlineConns.has(this)) {
        this.tc.onlineConns.add(this);
        const encoder = createEncoder();
        writeSyncStep1(encoder, this);
        // publish SyncStep1
        broadcastMessage(this, toUint8Array(encoder));
        this.tc.onlineConns.forEach(remoteYInstance => {
          if (remoteYInstance !== this) {
            // remote instance sends instance to this instance
            const encoder = createEncoder();
            writeSyncStep1(encoder, remoteYInstance);
            this._receive(toUint8Array(encoder), remoteYInstance);
          }
        });
      }
    }

    /**
     * Receive a message from another client. This message is only appended to the list of receiving messages.
     * TestConnector decides when this client actually reads this message.
     *
     * @param {Uint8Array} message
     * @param {TestYInstance} remoteClient
     */
    _receive (message, remoteClient) {
      let messages = this.receiving.get(remoteClient);
      if (messages === undefined) {
        messages = [];
        this.receiving.set(remoteClient, messages);
      }
      messages.push(message);
    }
  }

  /**
   * Keeps track of TestYInstances.
   *
   * The TestYInstances add/remove themselves from the list of connections maiained in this object.
   * I think it makes sense. Deal with it.
   */
  class TestConnector {
    /**
     * @param {prng.PRNG} gen
     */
    constructor (gen) {
      /**
       * @type {Set<TestYInstance>}
       */
      this.allConns = new Set();
      /**
       * @type {Set<TestYInstance>}
       */
      this.onlineConns = new Set();
      /**
       * @type {prng.PRNG}
       */
      this.prng = gen;
    }

    /**
     * Create a new Y instance and add it to the list of connections
     * @param {number} clientID
     */
    createY (clientID) {
      return new TestYInstance(this, clientID)
    }

    /**
     * Choose random connection and flush a random message from a random sender.
     *
     * If this function was unable to flush a message, because there are no more messages to flush, it returns false. true otherwise.
     * @return {boolean}
     */
    flushRandomMessage () {
      const gen = this.prng;
      const conns = Array.from(this.onlineConns).filter(conn => conn.receiving.size > 0);
      if (conns.length > 0) {
        const receiver = oneOf(gen, conns);
        const [sender, messages] = oneOf(gen, Array.from(receiver.receiving));
        const m = messages.shift();
        if (messages.length === 0) {
          receiver.receiving.delete(sender);
        }
        if (m === undefined) {
          return this.flushRandomMessage()
        }
        const encoder = createEncoder();
        // console.log('receive (' + sender.userID + '->' + receiver.userID + '):\n', syncProtocol.stringifySyncMessage(decoding.createDecoder(m), receiver))
        // do not publish data created when this function is executed (could be ss2 or update message)
        readSyncMessage(createDecoder(m), encoder, receiver, receiver.tc);
        if (length(encoder) > 0) {
          // send reply message
          sender._receive(toUint8Array(encoder), receiver);
        }
        return true
      }
      return false
    }

    /**
     * @return {boolean} True iff this function actually flushed something
     */
    flushAllMessages () {
      let didSomething = false;
      while (this.flushRandomMessage()) {
        didSomething = true;
      }
      return didSomething
    }

    reconnectAll () {
      this.allConns.forEach(conn => conn.connect());
    }

    disconnectAll () {
      this.allConns.forEach(conn => conn.disconnect());
    }

    syncAll () {
      this.reconnectAll();
      this.flushAllMessages();
    }

    /**
     * @return {boolean} Whether it was possible to disconnect a randon connection.
     */
    disconnectRandom () {
      if (this.onlineConns.size === 0) {
        return false
      }
      oneOf(this.prng, Array.from(this.onlineConns)).disconnect();
      return true
    }

    /**
     * @return {boolean} Whether it was possible to reconnect a random connection.
     */
    reconnectRandom () {
      /**
       * @type {Array<TestYInstance>}
       */
      const reconnectable = [];
      this.allConns.forEach(conn => {
        if (!this.onlineConns.has(conn)) {
          reconnectable.push(conn);
        }
      });
      if (reconnectable.length === 0) {
        return false
      }
      oneOf(this.prng, reconnectable).connect();
      return true
    }
  }

  /**
   * @template T
   * @param {t.TestCase} tc
   * @param {{users?:number}} conf
   * @param {InitTestObjectCallback<T>} [initTestObject]
   * @return {{testObjects:Array<any>,testConnector:TestConnector,users:Array<TestYInstance>,array0:Y.Array<any>,array1:Y.Array<any>,array2:Y.Array<any>,map0:Y.Map<any>,map1:Y.Map<any>,map2:Y.Map<any>,map3:Y.Map<any>,text0:Y.Text,text1:Y.Text,text2:Y.Text,xml0:Y.XmlElement,xml1:Y.XmlElement,xml2:Y.XmlElement}}
   */
  const init = (tc, { users = 5 } = {}, initTestObject) => {
    /**
     * @type {Object<string,any>}
     */
    const result = {
      users: []
    };
    const gen = tc.prng;
    const testConnector = new TestConnector(gen);
    result.testConnector = testConnector;
    for (let i = 0; i < users; i++) {
      const y = testConnector.createY(i);
      y.clientID = i;
      result.users.push(y);
      result['array' + i] = y.get('array', YArray);
      result['map' + i] = y.get('map', YMap);
      result['xml' + i] = y.get('xml', YXmlElement);
      result['text' + i] = y.get('text', YText);
    }
    testConnector.syncAll();
    result.testObjects = result.users.map(initTestObject || (() => null));
    return /** @type {any} */ (result)
  };

  /**
   * 1. reconnect and flush all
   * 2. user 0 gc
   * 3. get type content
   * 4. disconnect & reconnect all (so gc is propagated)
   * 5. compare os, ds, ss
   *
   * @param {Array<TestYInstance>} users
   */
  const compare$1 = users => {
    users.forEach(u => u.connect());
    while (users[0].tc.flushAllMessages()) {}
    const userArrayValues = users.map(u => u.getArray('array').toJSON());
    const userMapValues = users.map(u => u.getMap('map').toJSON());
    const userXmlValues = users.map(u => u.get('xml', YXmlElement).toString());
    const userTextValues = users.map(u => u.getText('text').toDelta());
    for (const u of users) {
      assert(u.store.pendingDeleteReaders.length === 0);
      assert(u.store.pendingStack.length === 0);
      assert(u.store.pendingClientsStructRefs.size === 0);
    }
    // Test Array iterator
    compare(users[0].getArray('array').toArray(), Array.from(users[0].getArray('array')));
    // Test Map iterator
    const ymapkeys = Array.from(users[0].getMap('map').keys());
    assert(ymapkeys.length === Object.keys(userMapValues[0]).length);
    ymapkeys.forEach(key => assert(hasProperty(userMapValues[0], key)));
    /**
     * @type {Object<string,any>}
     */
    const mapRes = {};
    for (const [k, v] of users[0].getMap('map')) {
      mapRes[k] = v instanceof AbstractType ? v.toJSON() : v;
    }
    compare(userMapValues[0], mapRes);
    // Compare all users
    for (let i = 0; i < users.length - 1; i++) {
      compare(userArrayValues[i].length, users[i].getArray('array').length);
      compare(userArrayValues[i], userArrayValues[i + 1]);
      compare(userMapValues[i], userMapValues[i + 1]);
      compare(userXmlValues[i], userXmlValues[i + 1]);
      compare(userTextValues[i].map(/** @param {any} a */ a => typeof a.insert === 'string' ? a.insert : ' ').join('').length, users[i].getText('text').length);
      compare(userTextValues[i], userTextValues[i + 1]);
      compare(getStateVector(users[i].store), getStateVector(users[i + 1].store));
      compareDS(createDeleteSetFromStructStore(users[i].store), createDeleteSetFromStructStore(users[i + 1].store));
      compareStructStores(users[i].store, users[i + 1].store);
    }
    users.map(u => u.destroy());
  };

  /**
   * @param {Item?} a
   * @param {Item?} b
   * @return {boolean}
   */
  const compareItemIDs = (a, b) => a === b || (a !== null && b != null && compareIDs(a.id, b.id));

  /**
   * @param {StructStore} ss1
   * @param {StructStore} ss2
   */
  const compareStructStores = (ss1, ss2) => {
    assert(ss1.clients.size === ss2.clients.size);
    for (const [client, structs1] of ss1.clients) {
      const structs2 = /** @type {Array<Y.AbstractStruct>} */ (ss2.clients.get(client));
      assert(structs2 !== undefined && structs1.length === structs2.length);
      for (let i = 0; i < structs1.length; i++) {
        const s1 = structs1[i];
        const s2 = structs2[i];
        // checks for abstract struct
        if (
          s1.constructor !== s2.constructor ||
          !compareIDs(s1.id, s2.id) ||
          s1.deleted !== s2.deleted ||
          // @ts-ignore
          s1.length !== s2.length
        ) {
          fail('Structs dont match');
        }
        if (s1 instanceof Item) {
          if (
            !(s2 instanceof Item) ||
            !((s1.left === null && s2.left === null) || (s1.left !== null && s2.left !== null && compareIDs(s1.left.lastId, s2.left.lastId))) ||
            !compareItemIDs(s1.right, s2.right) ||
            !compareIDs(s1.origin, s2.origin) ||
            !compareIDs(s1.rightOrigin, s2.rightOrigin) ||
            s1.parentSub !== s2.parentSub
          ) {
            return fail('Items dont match')
          }
          // make sure that items are connected correctly
          assert(s1.left === null || s1.left.right === s1);
          assert(s1.right === null || s1.right.left === s1);
          assert(s2.left === null || s2.left.right === s2);
          assert(s2.right === null || s2.right.left === s2);
        }
      }
    }
  };

  /**
   * @param {DeleteSet} ds1
   * @param {DeleteSet} ds2
   */
  const compareDS = (ds1, ds2) => {
    assert(ds1.clients.size === ds2.clients.size);
    for (const [client, deleteItems1] of ds1.clients) {
      const deleteItems2 = /** @type {Array<DeleteItem>} */ (ds2.clients.get(client));
      assert(deleteItems2 !== undefined && deleteItems1.length === deleteItems2.length);
      for (let i = 0; i < deleteItems1.length; i++) {
        const di1 = deleteItems1[i];
        const di2 = deleteItems2[i];
        if (di1.clock !== di2.clock || di1.len !== di2.len) {
          fail('DeleteSets dont match');
        }
      }
    }
  };

  /**
   * @template T
   * @callback InitTestObjectCallback
   * @param {TestYInstance} y
   * @return {T}
   */

  /**
   * @template T
   * @param {t.TestCase} tc
   * @param {Array<function(Y.Doc,prng.PRNG,T):void>} mods
   * @param {number} iterations
   * @param {InitTestObjectCallback<T>} [initTestObject]
   */
  const applyRandomTests = (tc, mods, iterations, initTestObject) => {
    const gen = tc.prng;
    const result = init(tc, { users: 5 }, initTestObject);
    const { testConnector, users } = result;
    for (let i = 0; i < iterations; i++) {
      if (int31(gen, 0, 100) <= 2) {
        // 2% chance to disconnect/reconnect a random user
        if (bool(gen)) {
          testConnector.disconnectRandom();
        } else {
          testConnector.reconnectRandom();
        }
      } else if (int31(gen, 0, 100) <= 1) {
        // 1% chance to flush all
        testConnector.flushAllMessages();
      } else if (int31(gen, 0, 100) <= 50) {
        // 50% chance to flush a random message
        testConnector.flushRandomMessage();
      }
      const user = int31(gen, 0, users.length - 1);
      const test = oneOf(gen, mods);
      test(users[user], gen, result.testObjects[user]);
    }
    compare$1(users);
    return result
  };

  var Y = /*#__PURE__*/Object.freeze({
    __proto__: null,
    TestYInstance: TestYInstance,
    TestConnector: TestConnector,
    init: init,
    compare: compare$1,
    compareItemIDs: compareItemIDs,
    compareStructStores: compareStructStores,
    compareDS: compareDS,
    applyRandomTests: applyRandomTests,
    DeleteItem: DeleteItem,
    DeleteSet: DeleteSet,
    iterateDeletedStructs: iterateDeletedStructs,
    findIndexDS: findIndexDS,
    isDeleted: isDeleted,
    sortAndMergeDeleteSet: sortAndMergeDeleteSet,
    mergeDeleteSets: mergeDeleteSets,
    addToDeleteSet: addToDeleteSet,
    createDeleteSet: createDeleteSet,
    createDeleteSetFromStructStore: createDeleteSetFromStructStore,
    writeDeleteSet: writeDeleteSet,
    readDeleteSet: readDeleteSet,
    readAndApplyDeleteSet: readAndApplyDeleteSet,
    generateNewClientId: generateNewClientId,
    Doc: Doc,
    writeClientsStructs: writeClientsStructs,
    readClientsStructRefs: readClientsStructRefs,
    tryResumePendingDeleteReaders: tryResumePendingDeleteReaders,
    writeStructsFromTransaction: writeStructsFromTransaction,
    readStructs: readStructs,
    readUpdate: readUpdate,
    applyUpdate: applyUpdate,
    writeStateAsUpdate: writeStateAsUpdate,
    encodeStateAsUpdate: encodeStateAsUpdate,
    readStateVector: readStateVector,
    decodeStateVector: decodeStateVector,
    writeStateVector: writeStateVector,
    writeDocumentStateVector: writeDocumentStateVector,
    encodeStateVector: encodeStateVector,
    EventHandler: EventHandler,
    createEventHandler: createEventHandler,
    addEventHandlerListener: addEventHandlerListener,
    removeEventHandlerListener: removeEventHandlerListener,
    removeAllEventHandlerListeners: removeAllEventHandlerListeners,
    callEventHandlerListeners: callEventHandlerListeners,
    ID: ID,
    compareIDs: compareIDs,
    createID: createID,
    writeID: writeID,
    readID: readID,
    findRootTypeKey: findRootTypeKey,
    isParentOf: isParentOf,
    PermanentUserData: PermanentUserData,
    RelativePosition: RelativePosition,
    createRelativePositionFromJSON: createRelativePositionFromJSON,
    AbsolutePosition: AbsolutePosition,
    createAbsolutePosition: createAbsolutePosition,
    createRelativePosition: createRelativePosition,
    createRelativePositionFromTypeIndex: createRelativePositionFromTypeIndex,
    writeRelativePosition: writeRelativePosition,
    encodeRelativePosition: encodeRelativePosition,
    readRelativePosition: readRelativePosition,
    decodeRelativePosition: decodeRelativePosition,
    createAbsolutePositionFromRelativePosition: createAbsolutePositionFromRelativePosition,
    compareRelativePositions: compareRelativePositions,
    Snapshot: Snapshot,
    equalSnapshots: equalSnapshots,
    encodeSnapshot: encodeSnapshot,
    decodeSnapshot: decodeSnapshot,
    createSnapshot: createSnapshot,
    emptySnapshot: emptySnapshot,
    snapshot: snapshot,
    isVisible: isVisible,
    splitSnapshotAffectedStructs: splitSnapshotAffectedStructs,
    StructStore: StructStore,
    getStateVector: getStateVector,
    getState: getState,
    integretyCheck: integretyCheck,
    addStruct: addStruct,
    findIndexSS: findIndexSS,
    find: find,
    getItem: getItem,
    findIndexCleanStart: findIndexCleanStart,
    getItemCleanStart: getItemCleanStart,
    getItemCleanEnd: getItemCleanEnd,
    replaceStruct: replaceStruct,
    iterateStructs: iterateStructs,
    Transaction: Transaction,
    computeUpdateMessageFromTransaction: computeUpdateMessageFromTransaction,
    nextID: nextID,
    addChangedTypeToTransaction: addChangedTypeToTransaction,
    tryGc: tryGc,
    transact: transact,
    UndoManager: UndoManager,
    YEvent: YEvent,
    getTypeChildren: getTypeChildren,
    callTypeObservers: callTypeObservers,
    AbstractType: AbstractType,
    typeListToArray: typeListToArray,
    typeListToArraySnapshot: typeListToArraySnapshot,
    typeListForEach: typeListForEach,
    typeListMap: typeListMap,
    typeListCreateIterator: typeListCreateIterator,
    typeListForEachSnapshot: typeListForEachSnapshot,
    typeListGet: typeListGet,
    typeListInsertGenericsAfter: typeListInsertGenericsAfter,
    typeListInsertGenerics: typeListInsertGenerics,
    typeListDelete: typeListDelete,
    typeMapDelete: typeMapDelete,
    typeMapSet: typeMapSet,
    typeMapGet: typeMapGet,
    typeMapGetAll: typeMapGetAll,
    typeMapHas: typeMapHas,
    typeMapGetSnapshot: typeMapGetSnapshot,
    createMapIterator: createMapIterator,
    YArrayEvent: YArrayEvent,
    YArray: YArray,
    readYArray: readYArray,
    YMapEvent: YMapEvent,
    YMap: YMap,
    readYMap: readYMap,
    ItemListPosition: ItemListPosition,
    ItemTextListPosition: ItemTextListPosition,
    ItemInsertionResult: ItemInsertionResult,
    cleanupYTextFormatting: cleanupYTextFormatting,
    YTextEvent: YTextEvent,
    YText: YText,
    readYText: readYText,
    YXmlTreeWalker: YXmlTreeWalker,
    YXmlFragment: YXmlFragment,
    readYXmlFragment: readYXmlFragment,
    YXmlElement: YXmlElement,
    readYXmlElement: readYXmlElement,
    YXmlEvent: YXmlEvent,
    YXmlHook: YXmlHook,
    readYXmlHook: readYXmlHook,
    YXmlText: YXmlText,
    readYXmlText: readYXmlText,
    AbstractStruct: AbstractStruct,
    structGCRefNumber: structGCRefNumber,
    GC: GC,
    ContentBinary: ContentBinary,
    readContentBinary: readContentBinary,
    ContentDeleted: ContentDeleted,
    readContentDeleted: readContentDeleted,
    ContentEmbed: ContentEmbed,
    readContentEmbed: readContentEmbed,
    ContentFormat: ContentFormat,
    readContentFormat: readContentFormat,
    ContentJSON: ContentJSON,
    readContentJSON: readContentJSON,
    ContentAny: ContentAny,
    readContentAny: readContentAny,
    ContentString: ContentString,
    readContentString: readContentString,
    typeRefs: typeRefs,
    YArrayRefID: YArrayRefID,
    YMapRefID: YMapRefID,
    YTextRefID: YTextRefID,
    YXmlElementRefID: YXmlElementRefID,
    YXmlFragmentRefID: YXmlFragmentRefID,
    YXmlHookRefID: YXmlHookRefID,
    YXmlTextRefID: YXmlTextRefID,
    ContentType: ContentType,
    readContentType: readContentType,
    followRedone: followRedone,
    keepItem: keepItem,
    splitItem: splitItem,
    redoItem: redoItem,
    Item: Item,
    contentRefs: contentRefs,
    AbstractContent: AbstractContent,
    readItem: readItem
  });

  /**
   * @param {t.TestCase} tc
   */
  const testDeleteInsert = tc => {
    const { users, array0 } = init(tc, { users: 2 });
    array0.delete(0, 0);
    describe('Does not throw when deleting zero elements with position 0');
    fails(() => {
      array0.delete(1, 1);
    });
    array0.insert(0, ['A']);
    array0.delete(1, 0);
    describe('Does not throw when deleting zero elements with valid position 1');
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testInsertThreeElementsTryRegetProperty = tc => {
    const { testConnector, users, array0, array1 } = init(tc, { users: 2 });
    array0.insert(0, [1, true, false]);
    compare(array0.toJSON(), [1, true, false], '.toJSON() works');
    testConnector.flushAllMessages();
    compare(array1.toJSON(), [1, true, false], '.toJSON() works after sync');
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testConcurrentInsertWithThreeConflicts = tc => {
    var { users, array0, array1, array2 } = init(tc, { users: 3 });
    array0.insert(0, [0]);
    array1.insert(0, [1]);
    array2.insert(0, [2]);
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testConcurrentInsertDeleteWithThreeConflicts = tc => {
    const { testConnector, users, array0, array1, array2 } = init(tc, { users: 3 });
    array0.insert(0, ['x', 'y', 'z']);
    testConnector.flushAllMessages();
    array0.insert(1, [0]);
    array1.delete(0);
    array1.delete(1, 1);
    array2.insert(1, [2]);
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testInsertionsInLateSync = tc => {
    const { testConnector, users, array0, array1, array2 } = init(tc, { users: 3 });
    array0.insert(0, ['x', 'y']);
    testConnector.flushAllMessages();
    users[1].disconnect();
    users[2].disconnect();
    array0.insert(1, ['user0']);
    array1.insert(1, ['user1']);
    array2.insert(1, ['user2']);
    users[1].connect();
    users[2].connect();
    testConnector.flushAllMessages();
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testDisconnectReallyPreventsSendingMessages = tc => {
    var { testConnector, users, array0, array1 } = init(tc, { users: 3 });
    array0.insert(0, ['x', 'y']);
    testConnector.flushAllMessages();
    users[1].disconnect();
    users[2].disconnect();
    array0.insert(1, ['user0']);
    array1.insert(1, ['user1']);
    compare(array0.toJSON(), ['x', 'user0', 'y']);
    compare(array1.toJSON(), ['x', 'user1', 'y']);
    users[1].connect();
    users[2].connect();
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testDeletionsInLateSync = tc => {
    const { testConnector, users, array0, array1 } = init(tc, { users: 2 });
    array0.insert(0, ['x', 'y']);
    testConnector.flushAllMessages();
    users[1].disconnect();
    array1.delete(1, 1);
    array0.delete(0, 2);
    users[1].connect();
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testInsertThenMergeDeleteOnSync = tc => {
    const { testConnector, users, array0, array1 } = init(tc, { users: 2 });
    array0.insert(0, ['x', 'y', 'z']);
    testConnector.flushAllMessages();
    users[0].disconnect();
    array1.delete(0, 3);
    users[0].connect();
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testInsertAndDeleteEvents = tc => {
    const { array0, users } = init(tc, { users: 2 });
    /**
     * @type {Object<string,any>?}
     */
    let event = null;
    array0.observe(e => {
      event = e;
    });
    array0.insert(0, [0, 1, 2]);
    assert(event !== null);
    event = null;
    array0.delete(0);
    assert(event !== null);
    event = null;
    array0.delete(0, 2);
    assert(event !== null);
    event = null;
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testNestedObserverEvents = tc => {
    const { array0, users } = init(tc, { users: 2 });
    /**
     * @type {Array<number>}
     */
    const vals = [];
    array0.observe(e => {
      if (array0.length === 1) {
        // inserting, will call this observer again
        // we expect that this observer is called after this event handler finishedn
        array0.insert(1, [1]);
        vals.push(0);
      } else {
        // this should be called the second time an element is inserted (above case)
        vals.push(1);
      }
    });
    array0.insert(0, [0]);
    compareArrays(vals, [0, 1]);
    compareArrays(array0.toArray(), [0, 1]);
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testInsertAndDeleteEventsForTypes = tc => {
    const { array0, users } = init(tc, { users: 2 });
    /**
     * @type {Object<string,any>|null}
     */
    let event = null;
    array0.observe(e => {
      event = e;
    });
    array0.insert(0, [new YArray()]);
    assert(event !== null);
    event = null;
    array0.delete(0);
    assert(event !== null);
    event = null;
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testChangeEvent = tc => {
    const { array0, users } = init(tc, { users: 2 });
    /**
     * @type {any}
     */
    let changes = null;
    array0.observe(e => {
      changes = e.changes;
    });
    const newArr = new YArray();
    array0.insert(0, [newArr, 4, 'dtrn']);
    assert(changes !== null && changes.added.size === 2 && changes.deleted.size === 0);
    compare(changes.delta, [{ insert: [newArr, 4, 'dtrn'] }]);
    changes = null;
    array0.delete(0, 2);
    assert(changes !== null && changes.added.size === 0 && changes.deleted.size === 2);
    compare(changes.delta, [{ delete: 2 }]);
    changes = null;
    array0.insert(1, [0.1]);
    assert(changes !== null && changes.added.size === 1 && changes.deleted.size === 0);
    compare(changes.delta, [{ retain: 1 }, { insert: [0.1] }]);
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testInsertAndDeleteEventsForTypes2 = tc => {
    const { array0, users } = init(tc, { users: 2 });
    /**
     * @type {Array<Object<string,any>>}
     */
    const events = [];
    array0.observe(e => {
      events.push(e);
    });
    array0.insert(0, ['hi', new YMap()]);
    assert(events.length === 1, 'Event is triggered exactly once for insertion of two elements');
    array0.delete(1);
    assert(events.length === 2, 'Event is triggered exactly once for deletion');
    compare$1(users);
  };

  /**
   * This issue has been reported here https://github.com/yjs/yjs/issues/155
   * @param {t.TestCase} tc
   */
  const testNewChildDoesNotEmitEventInTransaction = tc => {
    const { array0, users } = init(tc, { users: 2 });
    let fired = false;
    users[0].transact(() => {
      const newMap = new YMap();
      newMap.observe(() => {
        fired = true;
      });
      array0.insert(0, [newMap]);
      newMap.set('tst', 42);
    });
    assert(!fired, 'Event does not trigger');
  };

  /**
   * @param {t.TestCase} tc
   */
  const testGarbageCollector = tc => {
    const { testConnector, users, array0 } = init(tc, { users: 3 });
    array0.insert(0, ['x', 'y', 'z']);
    testConnector.flushAllMessages();
    users[0].disconnect();
    array0.delete(0, 3);
    users[0].connect();
    testConnector.flushAllMessages();
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testEventTargetIsSetCorrectlyOnLocal = tc => {
    const { array0, users } = init(tc, { users: 3 });
    /**
     * @type {any}
     */
    let event;
    array0.observe(e => {
      event = e;
    });
    array0.insert(0, ['stuff']);
    assert(event.target === array0, '"target" property is set correctly');
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testEventTargetIsSetCorrectlyOnRemote = tc => {
    const { testConnector, array0, array1, users } = init(tc, { users: 3 });
    /**
     * @type {any}
     */
    let event;
    array0.observe(e => {
      event = e;
    });
    array1.insert(0, ['stuff']);
    testConnector.flushAllMessages();
    assert(event.target === array0, '"target" property is set correctly');
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testIteratingArrayContainingTypes = tc => {
    const y = new Doc();
    const arr = y.getArray('arr');
    const numItems = 10;
    for (let i = 0; i < numItems; i++) {
      const map = new YMap();
      map.set('value', i);
      arr.push([map]);
    }
    let cnt = 0;
    for (const item of arr) {
      assert(item.get('value') === cnt++, 'value is correct');
    }
    y.destroy();
  };

  let _uniqueNumber = 0;
  const getUniqueNumber = () => _uniqueNumber++;

  /**
   * @type {Array<function(Doc,prng.PRNG,any):void>}
   */
  const arrayTransactions = [
    function insert (user, gen) {
      const yarray = user.getArray('array');
      var uniqueNumber = getUniqueNumber();
      var content = [];
      var len = int31(gen, 1, 4);
      for (var i = 0; i < len; i++) {
        content.push(uniqueNumber);
      }
      var pos = int31(gen, 0, yarray.length);
      yarray.insert(pos, content);
    },
    function insertTypeArray (user, gen) {
      const yarray = user.getArray('array');
      var pos = int31(gen, 0, yarray.length);
      yarray.insert(pos, [new YArray()]);
      var array2 = yarray.get(pos);
      array2.insert(0, [1, 2, 3, 4]);
    },
    function insertTypeMap (user, gen) {
      const yarray = user.getArray('array');
      var pos = int31(gen, 0, yarray.length);
      yarray.insert(pos, [new YMap()]);
      var map = yarray.get(pos);
      map.set('someprop', 42);
      map.set('someprop', 43);
      map.set('someprop', 44);
    },
    function _delete (user, gen) {
      const yarray = user.getArray('array');
      var length = yarray.length;
      if (length > 0) {
        var somePos = int31(gen, 0, length - 1);
        var delLength = int31(gen, 1, min(2, length - somePos));
        if (bool(gen)) {
          var type = yarray.get(somePos);
          if (type.length > 0) {
            somePos = int31(gen, 0, type.length - 1);
            delLength = int31(gen, 0, min(2, type.length - somePos));
            type.delete(somePos, delLength);
          }
        } else {
          yarray.delete(somePos, delLength);
        }
      }
    }
  ];

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests4 = tc => {
    applyRandomTests(tc, arrayTransactions, 4);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests40 = tc => {
    applyRandomTests(tc, arrayTransactions, 40);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests42 = tc => {
    applyRandomTests(tc, arrayTransactions, 42);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests43 = tc => {
    applyRandomTests(tc, arrayTransactions, 43);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests44 = tc => {
    applyRandomTests(tc, arrayTransactions, 44);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests45 = tc => {
    applyRandomTests(tc, arrayTransactions, 45);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests46 = tc => {
    applyRandomTests(tc, arrayTransactions, 46);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests300 = tc => {
    applyRandomTests(tc, arrayTransactions, 300);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests400 = tc => {
    applyRandomTests(tc, arrayTransactions, 400);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests500 = tc => {
    applyRandomTests(tc, arrayTransactions, 500);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests600 = tc => {
    applyRandomTests(tc, arrayTransactions, 600);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests1000 = tc => {
    applyRandomTests(tc, arrayTransactions, 1000);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests1800 = tc => {
    applyRandomTests(tc, arrayTransactions, 1800);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests3000 = tc => {
    skip(!production);
    applyRandomTests(tc, arrayTransactions, 3000);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests5000 = tc => {
    skip(!production);
    applyRandomTests(tc, arrayTransactions, 5000);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYarrayTests30000 = tc => {
    skip(!production);
    applyRandomTests(tc, arrayTransactions, 30000);
  };

  var array = /*#__PURE__*/Object.freeze({
    __proto__: null,
    testDeleteInsert: testDeleteInsert,
    testInsertThreeElementsTryRegetProperty: testInsertThreeElementsTryRegetProperty,
    testConcurrentInsertWithThreeConflicts: testConcurrentInsertWithThreeConflicts,
    testConcurrentInsertDeleteWithThreeConflicts: testConcurrentInsertDeleteWithThreeConflicts,
    testInsertionsInLateSync: testInsertionsInLateSync,
    testDisconnectReallyPreventsSendingMessages: testDisconnectReallyPreventsSendingMessages,
    testDeletionsInLateSync: testDeletionsInLateSync,
    testInsertThenMergeDeleteOnSync: testInsertThenMergeDeleteOnSync,
    testInsertAndDeleteEvents: testInsertAndDeleteEvents,
    testNestedObserverEvents: testNestedObserverEvents,
    testInsertAndDeleteEventsForTypes: testInsertAndDeleteEventsForTypes,
    testChangeEvent: testChangeEvent,
    testInsertAndDeleteEventsForTypes2: testInsertAndDeleteEventsForTypes2,
    testNewChildDoesNotEmitEventInTransaction: testNewChildDoesNotEmitEventInTransaction,
    testGarbageCollector: testGarbageCollector,
    testEventTargetIsSetCorrectlyOnLocal: testEventTargetIsSetCorrectlyOnLocal,
    testEventTargetIsSetCorrectlyOnRemote: testEventTargetIsSetCorrectlyOnRemote,
    testIteratingArrayContainingTypes: testIteratingArrayContainingTypes,
    testRepeatGeneratingYarrayTests4: testRepeatGeneratingYarrayTests4,
    testRepeatGeneratingYarrayTests40: testRepeatGeneratingYarrayTests40,
    testRepeatGeneratingYarrayTests42: testRepeatGeneratingYarrayTests42,
    testRepeatGeneratingYarrayTests43: testRepeatGeneratingYarrayTests43,
    testRepeatGeneratingYarrayTests44: testRepeatGeneratingYarrayTests44,
    testRepeatGeneratingYarrayTests45: testRepeatGeneratingYarrayTests45,
    testRepeatGeneratingYarrayTests46: testRepeatGeneratingYarrayTests46,
    testRepeatGeneratingYarrayTests300: testRepeatGeneratingYarrayTests300,
    testRepeatGeneratingYarrayTests400: testRepeatGeneratingYarrayTests400,
    testRepeatGeneratingYarrayTests500: testRepeatGeneratingYarrayTests500,
    testRepeatGeneratingYarrayTests600: testRepeatGeneratingYarrayTests600,
    testRepeatGeneratingYarrayTests1000: testRepeatGeneratingYarrayTests1000,
    testRepeatGeneratingYarrayTests1800: testRepeatGeneratingYarrayTests1800,
    testRepeatGeneratingYarrayTests3000: testRepeatGeneratingYarrayTests3000,
    testRepeatGeneratingYarrayTests5000: testRepeatGeneratingYarrayTests5000,
    testRepeatGeneratingYarrayTests30000: testRepeatGeneratingYarrayTests30000
  });

  /**
   * @param {t.TestCase} tc
   */
  const testMapHavingIterableAsConstructorParamTests = tc => {
    const { map0 } = init(tc, { users: 1 });

    const m1 = new YMap(Object.entries({ number: 1, string: 'hello' }));
    map0.set('m1', m1);
    assert(m1.get('number') === 1);
    assert(m1.get('string') === 'hello');

    const m2 = new YMap([
      ['object', { x: 1 }],
      ['boolean', true]
    ]);
    map0.set('m2', m2);
    assert(m2.get('object').x === 1);
    assert(m2.get('boolean') === true);

    const m3 = new YMap([...m1, ...m2]);
    map0.set('m3', m3);
    assert(m3.get('number') === 1);
    assert(m3.get('string') === 'hello');
    assert(m3.get('object').x === 1);
    assert(m3.get('boolean') === true);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testBasicMapTests = tc => {
    const { testConnector, users, map0, map1, map2 } = init(tc, { users: 3 });
    users[2].disconnect();

    map0.set('number', 1);
    map0.set('string', 'hello Y');
    map0.set('object', { key: { key2: 'value' } });
    map0.set('y-map', new YMap());
    map0.set('boolean1', true);
    map0.set('boolean0', false);
    const map = map0.get('y-map');
    map.set('y-array', new YArray());
    const array = map.get('y-array');
    array.insert(0, [0]);
    array.insert(0, [-1]);

    assert(map0.get('number') === 1, 'client 0 computed the change (number)');
    assert(map0.get('string') === 'hello Y', 'client 0 computed the change (string)');
    assert(map0.get('boolean0') === false, 'client 0 computed the change (boolean)');
    assert(map0.get('boolean1') === true, 'client 0 computed the change (boolean)');
    compare(map0.get('object'), { key: { key2: 'value' } }, 'client 0 computed the change (object)');
    assert(map0.get('y-map').get('y-array').get(0) === -1, 'client 0 computed the change (type)');
    assert(map0.size === 6, 'client 0 map has correct size');

    users[2].connect();
    testConnector.flushAllMessages();

    assert(map1.get('number') === 1, 'client 1 received the update (number)');
    assert(map1.get('string') === 'hello Y', 'client 1 received the update (string)');
    assert(map1.get('boolean0') === false, 'client 1 computed the change (boolean)');
    assert(map1.get('boolean1') === true, 'client 1 computed the change (boolean)');
    compare(map1.get('object'), { key: { key2: 'value' } }, 'client 1 received the update (object)');
    assert(map1.get('y-map').get('y-array').get(0) === -1, 'client 1 received the update (type)');
    assert(map1.size === 6, 'client 1 map has correct size');

    // compare disconnected user
    assert(map2.get('number') === 1, 'client 2 received the update (number) - was disconnected');
    assert(map2.get('string') === 'hello Y', 'client 2 received the update (string) - was disconnected');
    assert(map2.get('boolean0') === false, 'client 2 computed the change (boolean)');
    assert(map2.get('boolean1') === true, 'client 2 computed the change (boolean)');
    compare(map2.get('object'), { key: { key2: 'value' } }, 'client 2 received the update (object) - was disconnected');
    assert(map2.get('y-map').get('y-array').get(0) === -1, 'client 2 received the update (type) - was disconnected');
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testGetAndSetOfMapProperty = tc => {
    const { testConnector, users, map0 } = init(tc, { users: 2 });
    map0.set('stuff', 'stuffy');
    map0.set('undefined', undefined);
    map0.set('null', null);
    compare(map0.get('stuff'), 'stuffy');

    testConnector.flushAllMessages();

    for (const user of users) {
      const u = user.getMap('map');
      compare(u.get('stuff'), 'stuffy');
      assert(u.get('undefined') === undefined, 'undefined');
      compare(u.get('null'), null, 'null');
    }
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testYmapSetsYmap = tc => {
    const { users, map0 } = init(tc, { users: 2 });
    const map = map0.set('Map', new YMap());
    assert(map0.get('Map') === map);
    map.set('one', 1);
    compare(map.get('one'), 1);
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testYmapSetsYarray = tc => {
    const { users, map0 } = init(tc, { users: 2 });
    const array = map0.set('Array', new YArray());
    assert(array === map0.get('Array'));
    array.insert(0, [1, 2, 3]);
    // @ts-ignore
    compare(map0.toJSON(), { Array: [1, 2, 3] });
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testGetAndSetOfMapPropertySyncs = tc => {
    const { testConnector, users, map0 } = init(tc, { users: 2 });
    map0.set('stuff', 'stuffy');
    compare(map0.get('stuff'), 'stuffy');
    testConnector.flushAllMessages();
    for (const user of users) {
      var u = user.getMap('map');
      compare(u.get('stuff'), 'stuffy');
    }
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testGetAndSetOfMapPropertyWithConflict = tc => {
    const { testConnector, users, map0, map1 } = init(tc, { users: 3 });
    map0.set('stuff', 'c0');
    map1.set('stuff', 'c1');
    testConnector.flushAllMessages();
    for (const user of users) {
      var u = user.getMap('map');
      compare(u.get('stuff'), 'c1');
    }
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testSizeAndDeleteOfMapProperty = tc => {
    const { map0 } = init(tc, { users: 1 });
    map0.set('stuff', 'c0');
    map0.set('otherstuff', 'c1');
    assert(map0.size === 2, `map size is ${map0.size} expected 2`);
    map0.delete('stuff');
    assert(map0.size === 1, `map size after delete is ${map0.size}, expected 1`);
    map0.delete('otherstuff');
    assert(map0.size === 0, `map size after delete is ${map0.size}, expected 0`);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testGetAndSetAndDeleteOfMapProperty = tc => {
    const { testConnector, users, map0, map1 } = init(tc, { users: 3 });
    map0.set('stuff', 'c0');
    map1.set('stuff', 'c1');
    map1.delete('stuff');
    testConnector.flushAllMessages();
    for (const user of users) {
      var u = user.getMap('map');
      assert(u.get('stuff') === undefined);
    }
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testGetAndSetOfMapPropertyWithThreeConflicts = tc => {
    const { testConnector, users, map0, map1, map2 } = init(tc, { users: 3 });
    map0.set('stuff', 'c0');
    map1.set('stuff', 'c1');
    map1.set('stuff', 'c2');
    map2.set('stuff', 'c3');
    testConnector.flushAllMessages();
    for (const user of users) {
      var u = user.getMap('map');
      compare(u.get('stuff'), 'c3');
    }
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testGetAndSetAndDeleteOfMapPropertyWithThreeConflicts = tc => {
    const { testConnector, users, map0, map1, map2, map3 } = init(tc, { users: 4 });
    map0.set('stuff', 'c0');
    map1.set('stuff', 'c1');
    map1.set('stuff', 'c2');
    map2.set('stuff', 'c3');
    testConnector.flushAllMessages();
    map0.set('stuff', 'deleteme');
    map1.set('stuff', 'c1');
    map2.set('stuff', 'c2');
    map3.set('stuff', 'c3');
    map3.delete('stuff');
    testConnector.flushAllMessages();
    for (const user of users) {
      var u = user.getMap('map');
      assert(u.get('stuff') === undefined);
    }
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testObserveDeepProperties = tc => {
    const { testConnector, users, map1, map2, map3 } = init(tc, { users: 4 });
    const _map1 = map1.set('map', new YMap());
    let calls = 0;
    let dmapid;
    map1.observeDeep(events => {
      events.forEach(event => {
        calls++;
        // @ts-ignore
        assert(event.keysChanged.has('deepmap'));
        assert(event.path.length === 1);
        assert(event.path[0] === 'map');
        // @ts-ignore
        dmapid = event.target.get('deepmap')._item.id;
      });
    });
    testConnector.flushAllMessages();
    const _map3 = map3.get('map');
    _map3.set('deepmap', new YMap());
    testConnector.flushAllMessages();
    const _map2 = map2.get('map');
    _map2.set('deepmap', new YMap());
    testConnector.flushAllMessages();
    const dmap1 = _map1.get('deepmap');
    const dmap2 = _map2.get('deepmap');
    const dmap3 = _map3.get('deepmap');
    assert(calls > 0);
    assert(compareIDs(dmap1._item.id, dmap2._item.id));
    assert(compareIDs(dmap1._item.id, dmap3._item.id));
    // @ts-ignore we want the possibility of dmapid being undefined
    assert(compareIDs(dmap1._item.id, dmapid));
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testObserversUsingObservedeep = tc => {
    const { users, map0 } = init(tc, { users: 2 });
    /**
     * @type {Array<Array<string|number>>}
     */
    const pathes = [];
    let calls = 0;
    map0.observeDeep(events => {
      events.forEach(event => {
        pathes.push(event.path);
      });
      calls++;
    });
    map0.set('map', new YMap());
    map0.get('map').set('array', new YArray());
    map0.get('map').get('array').insert(0, ['content']);
    assert(calls === 3);
    compare(pathes, [[], ['map'], ['map', 'array']]);
    compare$1(users);
  };

  // TODO: Test events in Y.Map
  /**
   * @param {Object<string,any>} is
   * @param {Object<string,any>} should
   */
  const compareEvent = (is, should) => {
    for (var key in should) {
      compare(should[key], is[key]);
    }
  };

  /**
   * @param {t.TestCase} tc
   */
  const testThrowsAddAndUpdateAndDeleteEvents = tc => {
    const { users, map0 } = init(tc, { users: 2 });
    /**
     * @type {Object<string,any>}
     */
    let event = {};
    map0.observe(e => {
      event = e; // just put it on event, should be thrown synchronously anyway
    });
    map0.set('stuff', 4);
    compareEvent(event, {
      target: map0,
      keysChanged: new Set(['stuff'])
    });
    // update, oldValue is in contents
    map0.set('stuff', new YArray());
    compareEvent(event, {
      target: map0,
      keysChanged: new Set(['stuff'])
    });
    // update, oldValue is in opContents
    map0.set('stuff', 5);
    // delete
    map0.delete('stuff');
    compareEvent(event, {
      keysChanged: new Set(['stuff']),
      target: map0
    });
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testChangeEvent$1 = tc => {
    const { map0, users } = init(tc, { users: 2 });
    /**
     * @type {any}
     */
    let changes = null;
    /**
     * @type {any}
     */
    let keyChange = null;
    map0.observe(e => {
      changes = e.changes;
    });
    map0.set('a', 1);
    keyChange = changes.keys.get('a');
    assert(changes !== null && keyChange.action === 'add' && keyChange.oldValue === undefined);
    map0.set('a', 2);
    keyChange = changes.keys.get('a');
    assert(changes !== null && keyChange.action === 'update' && keyChange.oldValue === 1);
    users[0].transact(() => {
      map0.set('a', 3);
      map0.set('a', 4);
    });
    keyChange = changes.keys.get('a');
    assert(changes !== null && keyChange.action === 'update' && keyChange.oldValue === 2);
    users[0].transact(() => {
      map0.set('b', 1);
      map0.set('b', 2);
    });
    keyChange = changes.keys.get('b');
    assert(changes !== null && keyChange.action === 'add' && keyChange.oldValue === undefined);
    users[0].transact(() => {
      map0.set('c', 1);
      map0.delete('c');
    });
    assert(changes !== null && changes.keys.size === 0);
    users[0].transact(() => {
      map0.set('d', 1);
      map0.set('d', 2);
    });
    keyChange = changes.keys.get('d');
    assert(changes !== null && keyChange.action === 'add' && keyChange.oldValue === undefined);
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testYmapEventExceptionsShouldCompleteTransaction = tc => {
    const doc = new Doc();
    const map = doc.getMap('map');

    let updateCalled = false;
    let throwingObserverCalled = false;
    let throwingDeepObserverCalled = false;
    doc.on('update', () => {
      updateCalled = true;
    });

    const throwingObserver = () => {
      throwingObserverCalled = true;
      throw new Error('Failure')
    };

    const throwingDeepObserver = () => {
      throwingDeepObserverCalled = true;
      throw new Error('Failure')
    };

    map.observe(throwingObserver);
    map.observeDeep(throwingDeepObserver);

    fails(() => {
      map.set('y', '2');
    });

    assert(updateCalled);
    assert(throwingObserverCalled);
    assert(throwingDeepObserverCalled);

    // check if it works again
    updateCalled = false;
    throwingObserverCalled = false;
    throwingDeepObserverCalled = false;
    fails(() => {
      map.set('z', '3');
    });

    assert(updateCalled);
    assert(throwingObserverCalled);
    assert(throwingDeepObserverCalled);

    assert(map.get('z') === '3');
  };

  /**
   * @param {t.TestCase} tc
   */
  const testYmapEventHasCorrectValueWhenSettingAPrimitive = tc => {
    const { users, map0 } = init(tc, { users: 3 });
    /**
     * @type {Object<string,any>}
     */
    let event = {};
    map0.observe(e => {
      event = e;
    });
    map0.set('stuff', 2);
    compare(event.value, event.target.get(event.name));
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testYmapEventHasCorrectValueWhenSettingAPrimitiveFromOtherUser = tc => {
    const { users, map0, map1, testConnector } = init(tc, { users: 3 });
    /**
     * @type {Object<string,any>}
     */
    let event = {};
    map0.observe(e => {
      event = e;
    });
    map1.set('stuff', 2);
    testConnector.flushAllMessages();
    compare(event.value, event.target.get(event.name));
    compare$1(users);
  };

  /**
   * @type {Array<function(Doc,prng.PRNG):void>}
   */
  const mapTransactions = [
    function set (user, gen) {
      const key = oneOf(gen, ['one', 'two']);
      var value = utf16String(gen);
      user.getMap('map').set(key, value);
    },
    function setType (user, gen) {
      const key = oneOf(gen, ['one', 'two']);
      var type = oneOf(gen, [new YArray(), new YMap()]);
      user.getMap('map').set(key, type);
      if (type instanceof YArray) {
        type.insert(0, [1, 2, 3, 4]);
      } else {
        type.set('deepkey', 'deepvalue');
      }
    },
    function _delete (user, gen) {
      const key = oneOf(gen, ['one', 'two']);
      user.getMap('map').delete(key);
    }
  ];

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests10 = tc => {
    applyRandomTests(tc, mapTransactions, 3);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests40 = tc => {
    applyRandomTests(tc, mapTransactions, 40);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests42 = tc => {
    applyRandomTests(tc, mapTransactions, 42);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests43 = tc => {
    applyRandomTests(tc, mapTransactions, 43);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests44 = tc => {
    applyRandomTests(tc, mapTransactions, 44);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests45 = tc => {
    applyRandomTests(tc, mapTransactions, 45);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests46 = tc => {
    applyRandomTests(tc, mapTransactions, 46);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests300 = tc => {
    applyRandomTests(tc, mapTransactions, 300);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests400 = tc => {
    applyRandomTests(tc, mapTransactions, 400);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests500 = tc => {
    applyRandomTests(tc, mapTransactions, 500);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests600 = tc => {
    applyRandomTests(tc, mapTransactions, 600);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests1000 = tc => {
    applyRandomTests(tc, mapTransactions, 1000);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests1800 = tc => {
    applyRandomTests(tc, mapTransactions, 1800);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests5000 = tc => {
    skip(!production);
    applyRandomTests(tc, mapTransactions, 5000);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests10000 = tc => {
    skip(!production);
    applyRandomTests(tc, mapTransactions, 10000);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGeneratingYmapTests100000 = tc => {
    skip(!production);
    applyRandomTests(tc, mapTransactions, 100000);
  };

  var map$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    testMapHavingIterableAsConstructorParamTests: testMapHavingIterableAsConstructorParamTests,
    testBasicMapTests: testBasicMapTests,
    testGetAndSetOfMapProperty: testGetAndSetOfMapProperty,
    testYmapSetsYmap: testYmapSetsYmap,
    testYmapSetsYarray: testYmapSetsYarray,
    testGetAndSetOfMapPropertySyncs: testGetAndSetOfMapPropertySyncs,
    testGetAndSetOfMapPropertyWithConflict: testGetAndSetOfMapPropertyWithConflict,
    testSizeAndDeleteOfMapProperty: testSizeAndDeleteOfMapProperty,
    testGetAndSetAndDeleteOfMapProperty: testGetAndSetAndDeleteOfMapProperty,
    testGetAndSetOfMapPropertyWithThreeConflicts: testGetAndSetOfMapPropertyWithThreeConflicts,
    testGetAndSetAndDeleteOfMapPropertyWithThreeConflicts: testGetAndSetAndDeleteOfMapPropertyWithThreeConflicts,
    testObserveDeepProperties: testObserveDeepProperties,
    testObserversUsingObservedeep: testObserversUsingObservedeep,
    testThrowsAddAndUpdateAndDeleteEvents: testThrowsAddAndUpdateAndDeleteEvents,
    testChangeEvent: testChangeEvent$1,
    testYmapEventExceptionsShouldCompleteTransaction: testYmapEventExceptionsShouldCompleteTransaction,
    testYmapEventHasCorrectValueWhenSettingAPrimitive: testYmapEventHasCorrectValueWhenSettingAPrimitive,
    testYmapEventHasCorrectValueWhenSettingAPrimitiveFromOtherUser: testYmapEventHasCorrectValueWhenSettingAPrimitiveFromOtherUser,
    testRepeatGeneratingYmapTests10: testRepeatGeneratingYmapTests10,
    testRepeatGeneratingYmapTests40: testRepeatGeneratingYmapTests40,
    testRepeatGeneratingYmapTests42: testRepeatGeneratingYmapTests42,
    testRepeatGeneratingYmapTests43: testRepeatGeneratingYmapTests43,
    testRepeatGeneratingYmapTests44: testRepeatGeneratingYmapTests44,
    testRepeatGeneratingYmapTests45: testRepeatGeneratingYmapTests45,
    testRepeatGeneratingYmapTests46: testRepeatGeneratingYmapTests46,
    testRepeatGeneratingYmapTests300: testRepeatGeneratingYmapTests300,
    testRepeatGeneratingYmapTests400: testRepeatGeneratingYmapTests400,
    testRepeatGeneratingYmapTests500: testRepeatGeneratingYmapTests500,
    testRepeatGeneratingYmapTests600: testRepeatGeneratingYmapTests600,
    testRepeatGeneratingYmapTests1000: testRepeatGeneratingYmapTests1000,
    testRepeatGeneratingYmapTests1800: testRepeatGeneratingYmapTests1800,
    testRepeatGeneratingYmapTests5000: testRepeatGeneratingYmapTests5000,
    testRepeatGeneratingYmapTests10000: testRepeatGeneratingYmapTests10000,
    testRepeatGeneratingYmapTests100000: testRepeatGeneratingYmapTests100000
  });

  const { init: init$1, compare: compare$2 } = Y;

  /**
   * @param {t.TestCase} tc
   */
  const testBasicInsertAndDelete = tc => {
    const { users, text0 } = init$1(tc, { users: 2 });
    let delta;

    text0.observe(event => {
      delta = event.delta;
    });

    text0.delete(0, 0);
    assert(true, 'Does not throw when deleting zero elements with position 0');

    text0.insert(0, 'abc');
    assert(text0.toString() === 'abc', 'Basic insert works');
    compare(delta, [{ insert: 'abc' }]);

    text0.delete(0, 1);
    assert(text0.toString() === 'bc', 'Basic delete works (position 0)');
    compare(delta, [{ delete: 1 }]);

    text0.delete(1, 1);
    assert(text0.toString() === 'b', 'Basic delete works (position 1)');
    compare(delta, [{ retain: 1 }, { delete: 1 }]);

    users[0].transact(() => {
      text0.insert(0, '1');
      text0.delete(0, 1);
    });
    compare(delta, []);

    compare$2(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testBasicFormat = tc => {
    const { users, text0 } = init$1(tc, { users: 2 });
    let delta;
    text0.observe(event => {
      delta = event.delta;
    });
    text0.insert(0, 'abc', { bold: true });
    assert(text0.toString() === 'abc', 'Basic insert with attributes works');
    compare(text0.toDelta(), [{ insert: 'abc', attributes: { bold: true } }]);
    compare(delta, [{ insert: 'abc', attributes: { bold: true } }]);
    text0.delete(0, 1);
    assert(text0.toString() === 'bc', 'Basic delete on formatted works (position 0)');
    compare(text0.toDelta(), [{ insert: 'bc', attributes: { bold: true } }]);
    compare(delta, [{ delete: 1 }]);
    text0.delete(1, 1);
    assert(text0.toString() === 'b', 'Basic delete works (position 1)');
    compare(text0.toDelta(), [{ insert: 'b', attributes: { bold: true } }]);
    compare(delta, [{ retain: 1 }, { delete: 1 }]);
    text0.insert(0, 'z', { bold: true });
    assert(text0.toString() === 'zb');
    compare(text0.toDelta(), [{ insert: 'zb', attributes: { bold: true } }]);
    compare(delta, [{ insert: 'z', attributes: { bold: true } }]);
    // @ts-ignore
    assert(text0._start.right.right.right.content.str === 'b', 'Does not insert duplicate attribute marker');
    text0.insert(0, 'y');
    assert(text0.toString() === 'yzb');
    compare(text0.toDelta(), [{ insert: 'y' }, { insert: 'zb', attributes: { bold: true } }]);
    compare(delta, [{ insert: 'y' }]);
    text0.format(0, 2, { bold: null });
    assert(text0.toString() === 'yzb');
    compare(text0.toDelta(), [{ insert: 'yz' }, { insert: 'b', attributes: { bold: true } }]);
    compare(delta, [{ retain: 1 }, { retain: 1, attributes: { bold: null } }]);
    compare$2(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testGetDeltaWithEmbeds = tc => {
    const { text0 } = init$1(tc, { users: 1 });
    text0.applyDelta([{
      insert: { linebreak: 's' }
    }]);
    compare(text0.toDelta(), [{
      insert: { linebreak: 's' }
    }]);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testSnapshot = tc => {
    const { text0 } = init$1(tc, { users: 1 });
    const doc0 = /** @type {Y.Doc} */ (text0.doc);
    doc0.gc = false;
    text0.applyDelta([{
      insert: 'abcd'
    }]);
    const snapshot1 = snapshot(doc0);
    text0.applyDelta([{
      retain: 1
    }, {
      insert: 'x'
    }, {
      delete: 1
    }]);
    const snapshot2 = snapshot(doc0);
    text0.applyDelta([{
      retain: 2
    }, {
      delete: 3
    }, {
      insert: 'x'
    }, {
      delete: 1
    }]);
    const state1 = text0.toDelta(snapshot1);
    compare(state1, [{ insert: 'abcd' }]);
    const state2 = text0.toDelta(snapshot2);
    compare(state2, [{ insert: 'axcd' }]);
    const state2Diff = text0.toDelta(snapshot2, snapshot1);
    // @ts-ignore Remove userid info
    state2Diff.forEach(v => {
      if (v.attributes && v.attributes.ychange) {
        delete v.attributes.ychange.user;
      }
    });
    compare(state2Diff, [{ insert: 'a' }, { insert: 'x', attributes: { ychange: { type: 'added' } } }, { insert: 'b', attributes: { ychange: { type: 'removed' } } }, { insert: 'cd' }]);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testSnapshotDeleteAfter = tc => {
    const { text0 } = init$1(tc, { users: 1 });
    const doc0 = /** @type {Y.Doc} */ (text0.doc);
    doc0.gc = false;
    text0.applyDelta([{
      insert: 'abcd'
    }]);
    const snapshot1 = snapshot(doc0);
    text0.applyDelta([{
      retain: 4
    }, {
      insert: 'e'
    }]);
    const state1 = text0.toDelta(snapshot1);
    compare(state1, [{ insert: 'abcd' }]);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testToJson = tc => {
    const { text0 } = init$1(tc, { users: 1 });
    text0.insert(0, 'abc', { bold: true });
    assert(text0.toJSON() === 'abc', 'toJSON returns the unformatted text');
  };

  /**
   * @param {t.TestCase} tc
   */
  const testToDeltaEmbedAttributes = tc => {
    const { text0 } = init$1(tc, { users: 1 });
    text0.insert(0, 'ab', { bold: true });
    text0.insertEmbed(1, { image: 'imageSrc.png' }, { width: 100 });
    const delta0 = text0.toDelta();
    compare(delta0, [{ insert: 'a', attributes: { bold: true } }, { insert: { image: 'imageSrc.png' }, attributes: { width: 100 } }, { insert: 'b', attributes: { bold: true } }]);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testToDeltaEmbedNoAttributes = tc => {
    const { text0 } = init$1(tc, { users: 1 });
    text0.insert(0, 'ab', { bold: true });
    text0.insertEmbed(1, { image: 'imageSrc.png' });
    const delta0 = text0.toDelta();
    compare(delta0, [{ insert: 'a', attributes: { bold: true } }, { insert: { image: 'imageSrc.png' } }, { insert: 'b', attributes: { bold: true } }], 'toDelta does not set attributes key when no attributes are present');
  };

  /**
   * @param {t.TestCase} tc
   */
  const testFormattingRemoved = tc => {
    const { text0 } = init$1(tc, { users: 1 });
    text0.insert(0, 'ab', { bold: true });
    text0.delete(0, 2);
    assert(getTypeChildren(text0).length === 1);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testFormattingRemovedInMidText = tc => {
    const { text0 } = init$1(tc, { users: 1 });
    text0.insert(0, '1234');
    text0.insert(2, 'ab', { bold: true });
    text0.delete(2, 2);
    assert(getTypeChildren(text0).length === 3);
  };

  const tryGc$1 = () => {
    if (typeof global !== 'undefined' && global.gc) {
      global.gc();
    }
  };

  /**
   * @param {t.TestCase} tc
   */
  const testLargeFragmentedDocument = tc => {
    const itemsToInsert = 2000000;
    let update = /** @type {any} */ (null)
    ;(() => {
      const doc1 = new Doc();
      const text0 = doc1.getText('txt');
      tryGc$1();
      measureTime(`time to insert ${itemsToInsert} items`, () => {
        doc1.transact(() => {
          for (let i = 0; i < itemsToInsert; i++) {
            text0.insert(0, '0');
          }
        });
      });
      tryGc$1();
      measureTime('time to encode document', () => {
        update = encodeStateAsUpdate(doc1);
      });
    })()
    ;(() => {
      const doc2 = new Doc();
      tryGc$1();
      measureTime(`time to apply ${itemsToInsert} updates`, () => {
        applyUpdate(doc2, update);
      });
    })();
  };

  // RANDOM TESTS

  let charCounter = 0;

  const marks = [
    { bold: true },
    { italic: true },
    { italic: true, color: '#888' }
  ];

  const marksChoices = [
    undefined,
    ...marks
  ];

  /**
   * @type Array<function(any,prng.PRNG):void>
   */
  const qChanges = [
    /**
     * @param {Y.Doc} y
     * @param {prng.PRNG} gen
     */
    (y, gen) => { // insert text
      const ytext = y.getText('text');
      const insertPos = int32(gen, 0, ytext.toString().length);
      const attrs = oneOf(gen, marksChoices);
      const text = charCounter++ + word(gen);
      ytext.insert(insertPos, text, attrs);
    },
    /**
     * @param {Y.Doc} y
     * @param {prng.PRNG} gen
     */
    (y, gen) => { // insert embed
      const ytext = y.getText('text');
      const insertPos = int32(gen, 0, ytext.toString().length);
      ytext.insertEmbed(insertPos, { image: 'https://user-images.githubusercontent.com/5553757/48975307-61efb100-f06d-11e8-9177-ee895e5916e5.png' });
    },
    /**
     * @param {Y.Doc} y
     * @param {prng.PRNG} gen
     */
    (y, gen) => { // delete text
      const ytext = y.getText('text');
      const contentLen = ytext.toString().length;
      const insertPos = int32(gen, 0, contentLen);
      const overwrite = min(int32(gen, 0, contentLen - insertPos), 2);
      ytext.delete(insertPos, overwrite);
    },
    /**
     * @param {Y.Doc} y
     * @param {prng.PRNG} gen
     */
    (y, gen) => { // format text
      const ytext = y.getText('text');
      const contentLen = ytext.toString().length;
      const insertPos = int32(gen, 0, contentLen);
      const overwrite = min(int32(gen, 0, contentLen - insertPos), 2);
      const format = oneOf(gen, marks);
      ytext.format(insertPos, overwrite, format);
    },
    /**
     * @param {Y.Doc} y
     * @param {prng.PRNG} gen
     */
    (y, gen) => { // insert codeblock
      const ytext = y.getText('text');
      const insertPos = int32(gen, 0, ytext.toString().length);
      const text = charCounter++ + word(gen);
      const ops = [];
      if (insertPos > 0) {
        ops.push({ retain: insertPos });
      }
      ops.push({ insert: text }, { insert: '\n', format: { 'code-block': true } });
      ytext.applyDelta(ops);
    }
  ];

  /**
   * @param {any} result
   */
  const checkResult = result => {
    for (let i = 1; i < result.testObjects.length; i++) {
      const p1 = result.users[i].getText('text').toDelta();
      const p2 = result.users[i].getText('text').toDelta();
      compare(p1, p2);
    }
    // Uncomment this to find formatting-cleanup issues
    // const cleanups = Y.cleanupYTextFormatting(result.users[0].getText('text'))
    // t.assert(cleanups === 0)
    return result
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges1 = tc => {
    const { users } = checkResult(applyRandomTests(tc, qChanges, 1));
    const cleanups = cleanupYTextFormatting(users[0].getText('text'));
    assert(cleanups === 0);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges2 = tc => {
    const { users } = checkResult(applyRandomTests(tc, qChanges, 2));
    const cleanups = cleanupYTextFormatting(users[0].getText('text'));
    assert(cleanups === 0);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges2Repeat = tc => {
    for (let i = 0; i < 1000; i++) {
      const { users } = checkResult(applyRandomTests(tc, qChanges, 2));
      const cleanups = cleanupYTextFormatting(users[0].getText('text'));
      assert(cleanups === 0);
    }
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges3 = tc => {
    checkResult(applyRandomTests(tc, qChanges, 3));
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges30 = tc => {
    checkResult(applyRandomTests(tc, qChanges, 30));
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges40 = tc => {
    checkResult(applyRandomTests(tc, qChanges, 40));
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges70 = tc => {
    checkResult(applyRandomTests(tc, qChanges, 70));
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges100 = tc => {
    checkResult(applyRandomTests(tc, qChanges, 100));
  };

  /**
   * @param {t.TestCase} tc
   */
  const testRepeatGenerateQuillChanges300 = tc => {
    checkResult(applyRandomTests(tc, qChanges, 300));
  };

  var text$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    testBasicInsertAndDelete: testBasicInsertAndDelete,
    testBasicFormat: testBasicFormat,
    testGetDeltaWithEmbeds: testGetDeltaWithEmbeds,
    testSnapshot: testSnapshot,
    testSnapshotDeleteAfter: testSnapshotDeleteAfter,
    testToJson: testToJson,
    testToDeltaEmbedAttributes: testToDeltaEmbedAttributes,
    testToDeltaEmbedNoAttributes: testToDeltaEmbedNoAttributes,
    testFormattingRemoved: testFormattingRemoved,
    testFormattingRemovedInMidText: testFormattingRemovedInMidText,
    testLargeFragmentedDocument: testLargeFragmentedDocument,
    testRepeatGenerateQuillChanges1: testRepeatGenerateQuillChanges1,
    testRepeatGenerateQuillChanges2: testRepeatGenerateQuillChanges2,
    testRepeatGenerateQuillChanges2Repeat: testRepeatGenerateQuillChanges2Repeat,
    testRepeatGenerateQuillChanges3: testRepeatGenerateQuillChanges3,
    testRepeatGenerateQuillChanges30: testRepeatGenerateQuillChanges30,
    testRepeatGenerateQuillChanges40: testRepeatGenerateQuillChanges40,
    testRepeatGenerateQuillChanges70: testRepeatGenerateQuillChanges70,
    testRepeatGenerateQuillChanges100: testRepeatGenerateQuillChanges100,
    testRepeatGenerateQuillChanges300: testRepeatGenerateQuillChanges300
  });

  /**
   * @param {t.TestCase} tc
   */
  const testSetProperty = tc => {
    const { testConnector, users, xml0, xml1 } = init(tc, { users: 2 });
    xml0.setAttribute('height', '10');
    assert(xml0.getAttribute('height') === '10', 'Simple set+get works');
    testConnector.flushAllMessages();
    assert(xml1.getAttribute('height') === '10', 'Simple set+get works (remote)');
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testEvents = tc => {
    const { testConnector, users, xml0, xml1 } = init(tc, { users: 2 });
    /**
     * @type {any}
     */
    let event;
    /**
     * @type {any}
     */
    let remoteEvent;
    xml0.observe(e => {
      event = e;
    });
    xml1.observe(e => {
      remoteEvent = e;
    });
    xml0.setAttribute('key', 'value');
    assert(event.attributesChanged.has('key'), 'YXmlEvent.attributesChanged on updated key');
    testConnector.flushAllMessages();
    assert(remoteEvent.attributesChanged.has('key'), 'YXmlEvent.attributesChanged on updated key (remote)');
    // check attributeRemoved
    xml0.removeAttribute('key');
    assert(event.attributesChanged.has('key'), 'YXmlEvent.attributesChanged on removed attribute');
    testConnector.flushAllMessages();
    assert(remoteEvent.attributesChanged.has('key'), 'YXmlEvent.attributesChanged on removed attribute (remote)');
    xml0.insert(0, [new YXmlText('some text')]);
    assert(event.childListChanged, 'YXmlEvent.childListChanged on inserted element');
    testConnector.flushAllMessages();
    assert(remoteEvent.childListChanged, 'YXmlEvent.childListChanged on inserted element (remote)');
    // test childRemoved
    xml0.delete(0);
    assert(event.childListChanged, 'YXmlEvent.childListChanged on deleted element');
    testConnector.flushAllMessages();
    assert(remoteEvent.childListChanged, 'YXmlEvent.childListChanged on deleted element (remote)');
    compare$1(users);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testTreewalker = tc => {
    const { users, xml0 } = init(tc, { users: 3 });
    const paragraph1 = new YXmlElement('p');
    const paragraph2 = new YXmlElement('p');
    const text1 = new YXmlText('init');
    const text2 = new YXmlText('text');
    paragraph1.insert(0, [text1, text2]);
    xml0.insert(0, [paragraph1, paragraph2, new YXmlElement('img')]);
    const allParagraphs = xml0.querySelectorAll('p');
    assert(allParagraphs.length === 2, 'found exactly two paragraphs');
    assert(allParagraphs[0] === paragraph1, 'querySelectorAll found paragraph1');
    assert(allParagraphs[1] === paragraph2, 'querySelectorAll found paragraph2');
    assert(xml0.querySelector('p') === paragraph1, 'querySelector found paragraph1');
    compare$1(users);
  };

  var xml = /*#__PURE__*/Object.freeze({
    __proto__: null,
    testSetProperty: testSetProperty,
    testEvents: testEvents,
    testTreewalker: testTreewalker
  });

  /**
   * @param {t.TestCase} tc
   */
  const testStructReferences = tc => {
    assert(contentRefs.length === 9);
    assert(contentRefs[1] === readContentDeleted);
    assert(contentRefs[2] === readContentJSON); // TODO: deprecate content json?
    assert(contentRefs[3] === readContentBinary);
    assert(contentRefs[4] === readContentString);
    assert(contentRefs[5] === readContentEmbed);
    assert(contentRefs[6] === readContentFormat);
    assert(contentRefs[7] === readContentType);
    assert(contentRefs[8] === readContentAny);
  };

  var encoding = /*#__PURE__*/Object.freeze({
    __proto__: null,
    testStructReferences: testStructReferences
  });

  /**
   * @param {t.TestCase} tc
   */
  const testUndoText = tc => {
    const { testConnector, text0, text1 } = init(tc, { users: 3 });
    const undoManager = new UndoManager(text0);

    // items that are added & deleted in the same transaction won't be undo
    text0.insert(0, 'test');
    text0.delete(0, 4);
    undoManager.undo();
    assert(text0.toString() === '');

    // follow redone items
    text0.insert(0, 'a');
    undoManager.stopCapturing();
    text0.delete(0, 1);
    undoManager.stopCapturing();
    undoManager.undo();
    assert(text0.toString() === 'a');
    undoManager.undo();
    assert(text0.toString() === '');

    text0.insert(0, 'abc');
    text1.insert(0, 'xyz');
    testConnector.syncAll();
    undoManager.undo();
    assert(text0.toString() === 'xyz');
    undoManager.redo();
    assert(text0.toString() === 'abcxyz');
    testConnector.syncAll();
    text1.delete(0, 1);
    testConnector.syncAll();
    undoManager.undo();
    assert(text0.toString() === 'xyz');
    undoManager.redo();
    assert(text0.toString() === 'bcxyz');
    // test marks
    text0.format(1, 3, { bold: true });
    compare(text0.toDelta(), [{ insert: 'b' }, { insert: 'cxy', attributes: { bold: true } }, { insert: 'z' }]);
    undoManager.undo();
    compare(text0.toDelta(), [{ insert: 'bcxyz' }]);
    undoManager.redo();
    compare(text0.toDelta(), [{ insert: 'b' }, { insert: 'cxy', attributes: { bold: true } }, { insert: 'z' }]);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testUndoMap = tc => {
    const { testConnector, map0, map1 } = init(tc, { users: 2 });
    map0.set('a', 0);
    const undoManager = new UndoManager(map0);
    map0.set('a', 1);
    undoManager.undo();
    assert(map0.get('a') === 0);
    undoManager.redo();
    assert(map0.get('a') === 1);
    // testing sub-types and if it can restore a whole type
    const subType = new YMap();
    map0.set('a', subType);
    subType.set('x', 42);
    compare(map0.toJSON(), /** @type {any} */ ({ a: { x: 42 } }));
    undoManager.undo();
    assert(map0.get('a') === 1);
    undoManager.redo();
    compare(map0.toJSON(), /** @type {any} */ ({ a: { x: 42 } }));
    testConnector.syncAll();
    // if content is overwritten by another user, undo operations should be skipped
    map1.set('a', 44);
    testConnector.syncAll();
    undoManager.undo();
    assert(map0.get('a') === 44);
    undoManager.redo();
    assert(map0.get('a') === 44);

    // test setting value multiple times
    map0.set('b', 'initial');
    undoManager.stopCapturing();
    map0.set('b', 'val1');
    map0.set('b', 'val2');
    undoManager.stopCapturing();
    undoManager.undo();
    assert(map0.get('b') === 'initial');
  };

  /**
   * @param {t.TestCase} tc
   */
  const testUndoArray = tc => {
    const { testConnector, array0, array1 } = init(tc, { users: 3 });
    const undoManager = new UndoManager(array0);
    array0.insert(0, [1, 2, 3]);
    array1.insert(0, [4, 5, 6]);
    testConnector.syncAll();
    compare(array0.toArray(), [1, 2, 3, 4, 5, 6]);
    undoManager.undo();
    compare(array0.toArray(), [4, 5, 6]);
    undoManager.redo();
    compare(array0.toArray(), [1, 2, 3, 4, 5, 6]);
    testConnector.syncAll();
    array1.delete(0, 1); // user1 deletes [1]
    testConnector.syncAll();
    undoManager.undo();
    compare(array0.toArray(), [4, 5, 6]);
    undoManager.redo();
    compare(array0.toArray(), [2, 3, 4, 5, 6]);
    array0.delete(0, 5);
    // test nested structure
    const ymap = new YMap();
    array0.insert(0, [ymap]);
    compare(array0.toJSON(), [{}]);
    undoManager.stopCapturing();
    ymap.set('a', 1);
    compare(array0.toJSON(), [{ a: 1 }]);
    undoManager.undo();
    compare(array0.toJSON(), [{}]);
    undoManager.undo();
    compare(array0.toJSON(), [2, 3, 4, 5, 6]);
    undoManager.redo();
    compare(array0.toJSON(), [{}]);
    undoManager.redo();
    compare(array0.toJSON(), [{ a: 1 }]);
    testConnector.syncAll();
    array1.get(0).set('b', 2);
    testConnector.syncAll();
    compare(array0.toJSON(), [{ a: 1, b: 2 }]);
    undoManager.undo();
    compare(array0.toJSON(), [{ b: 2 }]);
    undoManager.undo();
    compare(array0.toJSON(), [2, 3, 4, 5, 6]);
    undoManager.redo();
    compare(array0.toJSON(), [{ b: 2 }]);
    undoManager.redo();
    compare(array0.toJSON(), [{ a: 1, b: 2 }]);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testUndoXml = tc => {
    const { xml0 } = init(tc, { users: 3 });
    const undoManager = new UndoManager(xml0);
    const child = new YXmlElement('p');
    xml0.insert(0, [child]);
    const textchild = new YXmlText('content');
    child.insert(0, [textchild]);
    assert(xml0.toString() === '<undefined><p>content</p></undefined>');
    // format textchild and revert that change
    undoManager.stopCapturing();
    textchild.format(3, 4, { bold: {} });
    assert(xml0.toString() === '<undefined><p>con<bold>tent</bold></p></undefined>');
    undoManager.undo();
    assert(xml0.toString() === '<undefined><p>content</p></undefined>');
    undoManager.redo();
    assert(xml0.toString() === '<undefined><p>con<bold>tent</bold></p></undefined>');
    xml0.delete(0, 1);
    assert(xml0.toString() === '<undefined></undefined>');
    undoManager.undo();
    assert(xml0.toString() === '<undefined><p>con<bold>tent</bold></p></undefined>');
  };

  /**
   * @param {t.TestCase} tc
   */
  const testUndoEvents = tc => {
    const { text0 } = init(tc, { users: 3 });
    const undoManager = new UndoManager(text0);
    let counter = 0;
    let receivedMetadata = -1;
    undoManager.on('stack-item-added', /** @param {any} event */ event => {
      assert(event.type != null);
      event.stackItem.meta.set('test', counter++);
    });
    undoManager.on('stack-item-popped', /** @param {any} event */ event => {
      assert(event.type != null);
      receivedMetadata = event.stackItem.meta.get('test');
    });
    text0.insert(0, 'abc');
    undoManager.undo();
    assert(receivedMetadata === 0);
    undoManager.redo();
    assert(receivedMetadata === 1);
  };

  /**
   * @param {t.TestCase} tc
   */
  const testTrackClass = tc => {
    const { users, text0 } = init(tc, { users: 3 });
    // only track origins that are numbers
    const undoManager = new UndoManager(text0, { trackedOrigins: new Set([Number]) });
    users[0].transact(() => {
      text0.insert(0, 'abc');
    }, 42);
    assert(text0.toString() === 'abc');
    undoManager.undo();
    assert(text0.toString() === '');
  };

  /**
   * @param {t.TestCase} tc
   */
  const testTypeScope = tc => {
    const { array0 } = init(tc, { users: 3 });
    // only track origins that are numbers
    const text0 = new YText();
    const text1 = new YText();
    array0.insert(0, [text0, text1]);
    const undoManager = new UndoManager(text0);
    const undoManagerBoth = new UndoManager([text0, text1]);
    text1.insert(0, 'abc');
    assert(undoManager.undoStack.length === 0);
    assert(undoManagerBoth.undoStack.length === 1);
    assert(text1.toString() === 'abc');
    undoManager.undo();
    assert(text1.toString() === 'abc');
    undoManagerBoth.undo();
    assert(text1.toString() === '');
  };

  /**
   * @param {t.TestCase} tc
   */
  const testUndoDeleteFilter = tc => {
    /**
     * @type {Array<Y.Map<any>>}
     */
    const array0 = /** @type {any} */ (init(tc, { users: 3 }).array0);
    const undoManager = new UndoManager(array0, { deleteFilter: item => !(item instanceof Item) || (item.content instanceof ContentType && item.content.type._map.size === 0) });
    const map0 = new YMap();
    map0.set('hi', 1);
    const map1 = new YMap();
    array0.insert(0, [map0, map1]);
    undoManager.undo();
    assert(array0.length === 1);
    array0.get(0);
    assert(Array.from(array0.get(0).keys()).length === 1);
  };

  var undoredo = /*#__PURE__*/Object.freeze({
    __proto__: null,
    testUndoText: testUndoText,
    testUndoMap: testUndoMap,
    testUndoArray: testUndoArray,
    testUndoXml: testUndoXml,
    testUndoEvents: testUndoEvents,
    testTrackClass: testTrackClass,
    testTypeScope: testTypeScope,
    testUndoDeleteFilter: testUndoDeleteFilter
  });

  /**
   * Client id should be changed when an instance receives updates from another client using the same client id.
   *
   * @param {t.TestCase} tc
   */
  const testClientIdDuplicateChange = tc => {
    const doc1 = new Doc();
    doc1.clientID = 0;
    const doc2 = new Doc();
    doc2.clientID = 0;
    assert(doc2.clientID === doc1.clientID);
    doc1.getArray('a').insert(0, [1, 2]);
    applyUpdate(doc2, encodeStateAsUpdate(doc1));
    assert(doc2.clientID !== doc1.clientID);
  };

  var consistency = /*#__PURE__*/Object.freeze({
    __proto__: null,
    testClientIdDuplicateChange: testClientIdDuplicateChange
  });

  if (isBrowser) {
    createVConsole(document.body);
  }
  runTests({
    map: map$2, array, text: text$1, xml, consistency, encoding, undoredo
  }).then(success => {
    /* istanbul ignore next */
    if (isNode) {
      process.exit(success ? 0 : 1);
    }
  });

}());
//# sourceMappingURL=tests.js.map
