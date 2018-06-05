# is-afk

[![Build Status](https://travis-ci.org/makepanic/is-afk.svg?branch=master)](https://travis-ci.org/makepanic/is-afk)

small library that allows you to react to various useragent states (idle, hidden, visible)

## Why

This library is inspired by [ifvisible.js](https://github.com/serkanyersen/ifvisible.js).
It tries to be more minimal:

* no event emitter, just a simple callback once the state changes
* Hidden doesn't imply Idle

## Usage

```js
const afk = new Afk(() => {
  if (afk.is(State.Hidden)) {
    // document is hidden
  } else {
    // document is visible
  }
  
  if (afk.is(State.Idle)) {
    // user is idle in document
  }
});
```
