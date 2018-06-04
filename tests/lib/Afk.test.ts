import {default as Afk, State} from "../../lib/Afk";

const {module, test} = QUnit;

function emitEvent(target: EventTarget, eventName: string) {
  const event = new Event(eventName);
  target.dispatchEvent(event);
}

const noop = () => {
};

module("Afk", function () {
  module('is', function () {
    test('idle', function (assert) {
      const afk = new Afk(noop);
      afk.idle();
      assert.ok(afk.is(State.Idle));
    });

    test('hidden', function (assert) {
      const afk = new Afk(noop);
      afk.hidden();
      assert.ok(afk.is(State.Hidden));
    });

    test('visible', function (assert) {
      const afk = new Afk(noop);
      afk.visible();
      assert.ok(afk.is(State.Visible));
    });
  });

  module('statusChangeCallback', function () {
    test('called on idle', function (assert) {
      const statusChangeCallback = sinon.fake();
      const afk = new Afk(statusChangeCallback);
      afk.idle();

      assert.ok(statusChangeCallback.calledWith(State.Visible | State.Idle));
    });
    test('called on hidden', function (assert) {
      const statusChangeCallback = sinon.fake();
      const afk = new Afk(statusChangeCallback);
      afk.hidden();

      assert.ok(statusChangeCallback.calledWith(State.Hidden));
    });
  });

  module('wakeIdle', function () {
    [
      'mousemove',
      'keyup',
      'touchstart',
      'scroll',
      'visibilitychange',
    ].forEach(eventName => {
      test(`triggers on ${eventName}`, function (assert) {
        const afk = new Afk(noop);
        afk.idle();
        assert.ok(afk.is(State.Idle));
        emitEvent(document, eventName);
        assert.notOk(afk.is(State.Idle));
      });
    })
  });

  module('idle', function(){
    test('sets idle after timeout', function(assert) {
      const clock = sinon.useFakeTimers();
      const afk = new Afk(noop);

      assert.notOk(afk.is(State.Idle));

      afk.idle();
      clock.tick(afk.idleTimeout + 1);
      assert.ok(afk.is(State.Idle));

      emitEvent(document, 'mousemove');
      assert.notOk(afk.is(State.Idle));
    });
  });
});
