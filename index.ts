/**
 * All known states
 */
export enum State {
  Visible = 0b000,
  Hidden = 0b001,
  Idle = 0b010
}

type StateChangeCallback = (newState: State) => void;

export default class Afk {
  /**
   * State is a binary list of states
   * @type {number}
   */
  private state: number = State.Visible;

  private previousState: number = State.Visible;
  private idleTimer: number;
  private readonly idleTimeout: number = 60 * 1000;
  private listenerOptions = { capture: false, passive: true };
  private destroyed: boolean = false;

  constructor(private statusChangeCallback: StateChangeCallback) {
    this.wakeIdle = this.wakeIdle.bind(this);
    this.visbilityChange = this.visbilityChange.bind(this);

    document.addEventListener('mousemove', this.wakeIdle, this.listenerOptions);
    document.addEventListener('keyup', this.wakeIdle, this.listenerOptions);
    document.addEventListener(
      'touchstart',
      this.wakeIdle,
      this.listenerOptions
    );
    document.addEventListener('scroll', this.wakeIdle, this.listenerOptions);
    document.addEventListener(
      'visibilitychange',
      this.visbilityChange,
      this.listenerOptions
    );
    this.wakeIdle();
  }

  /**
   * Method to manually change the current afk state to include Idle
   */
  public idle() {
    this.maybeChangeState(State.Idle);
  }

  /**
   * Method to manually change the current afk state to include hidden
   */
  public hidden() {
    this.maybeChangeState(State.Hidden);
  }

  /**
   * Method to manually change the current afk state to Visible.
   */
  public visible() {
    if (this.state !== State.Visible) {
      // visible is nuking everything as focus is also resetting idle
      this.state = State.Visible;
      this.wakeIdle();
      this.stateChanged();
    }
  }

  /**
   * Method to check if the current afk state includes a given state
   * @param {State} state
   * @return {boolean} true if given state included in afk state
   */
  public is(state: State): boolean {
    if (state === State.Visible) {
      return (this.state & 0b001) === State.Visible;
    } else {
      return Boolean(this.state & state);
    }
  }

  /**
   * Function that should be called when listening to afk state changes isn't wanted anymore.
   * Removes idle check listeners and clears idle timer.
   */
  public destroy() {
    this.destroyed = true;
    document.removeEventListener(
      'mousemove',
      this.wakeIdle,
      this.listenerOptions
    );
    document.removeEventListener('keyup', this.wakeIdle, this.listenerOptions);
    document.removeEventListener(
      'touchstart',
      this.wakeIdle,
      this.listenerOptions
    );
    document.removeEventListener('scroll', this.wakeIdle, this.listenerOptions);
    document.removeEventListener(
      'visibilitychange',
      this.visbilityChange,
      this.listenerOptions
    );
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }

  private visbilityChange() {
    if (document.hidden) {
      this.hidden();
    } else {
      this.visible();
    }
  }

  private maybeChangeState(state: State) {
    if ((this.state ^ state) !== 0) {
      this.state |= state;
      this.stateChanged();
    }
  }

  private removeState(state: State) {
    if (this.state & state) {
      this.state &= ~state;
      this.stateChanged();
    }
  }

  private wakeIdle() {
    // clear timer
    if (this.idleTimer) clearTimeout(this.idleTimer);

    this.removeState(State.Idle);
    this.idleTimer = window.setTimeout(() => this.idle(), this.idleTimeout);
  }

  private stateChanged() {
    if (this.destroyed) return;

    this.previousState = this.state;
    this.statusChangeCallback(this.state);
  }
}
