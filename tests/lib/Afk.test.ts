import { default as Afk, State } from '../../index';
import { emitEvent } from '../helpers/events';

const { module, test } = QUnit;

const noop = () => {};

module('Afk', function() {
  module('is', function() {
    test('idle', function(assert) {
      const afk = new Afk(noop);
      afk.idle();
      assert.ok(afk.is(State.Idle));
    });

    test('hidden', function(assert) {
      const afk = new Afk(noop);
      afk.hidden();
      assert.ok(afk.is(State.Hidden));
    });

    test('visible', function(assert) {
      const afk = new Afk(noop);
      afk.visible();
      assert.ok(afk.is(State.Visible));
    });
  });

  module('statusChangeCallback', function() {
    test('called on idle', function(assert) {
      const statusChangeCallback = sinon.fake();
      const afk = new Afk(statusChangeCallback);
      afk.idle();

      assert.ok(statusChangeCallback.calledWith(State.Visible | State.Idle));
    });
    test('called on hidden', function(assert) {
      const statusChangeCallback = sinon.fake();
      const afk = new Afk(statusChangeCallback);
      afk.hidden();

      assert.ok(statusChangeCallback.calledWith(State.Hidden));
    });
  });

  module('wakeIdle', function() {
    ['mousemove', 'keyup', 'touchstart', 'scroll', 'visibilitychange'].forEach(
      eventName => {
        test(`triggers on ${eventName}`, function(assert) {
          const afk = new Afk(noop);
          afk.idle();
          assert.ok(afk.is(State.Idle));
          emitEvent(document, eventName);
          assert.notOk(afk.is(State.Idle));
        });
      }
    );
  });

  module('idle', function() {
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

  test("destroy isn't triggering the callback on state change", function(assert) {
    const stateChangeCallback = sinon.spy();
    const afk = new Afk(stateChangeCallback);
    afk.destroy();
    afk.idle();
    assert.notOk(stateChangeCallback.called);
  });
});
