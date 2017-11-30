"use strict";

/** @typedef {(jQuery|function)} $ */
if (typeof jQuery === 'undefined') {
    throw new Error('Missing loader library "jQuery"!');
}

jQuery.getScript('js/lib/equivalent/System.js');
