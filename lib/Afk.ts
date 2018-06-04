export enum State {
  Visible = 0b000,
  Hidden  = 0b001,
  Idle    = 0b010,
}
interface StateChangeCallback {
  (newState: State): void
}

export default class Afk {
  /**
   * State is a binary list of states
   * @type {number}
   */
  private state: number = State.Visible;

  private previousState: number = State.Visible;
  private idleTimer: number;
  private idleTimeout: number = 60 * 1000;
  private listenerOptions = {capture: false, passive: true};

  constructor(private statusChangeCallback: StateChangeCallback) {
    this.wakeIdle = this.wakeIdle.bind(this);
    this.visbilityChange = this.visbilityChange.bind(this);

    document.addEventListener('mousemove', this.wakeIdle, this.listenerOptions);
    document.addEventListener('keyup', this.wakeIdle, this.listenerOptions);
    document.addEventListener('touchstart', this.wakeIdle, this.listenerOptions);
    document.addEventListener('scroll', this.wakeIdle, this.listenerOptions);
    document.addEventListener('visibilitychange', this.visbilityChange, this.listenerOptions);
  }

  public destroy(){
    document.removeEventListener('mousemove', this.wakeIdle, this.listenerOptions);
    document.removeEventListener('keyup', this.wakeIdle, this.listenerOptions);
    document.removeEventListener('touchstart', this.wakeIdle, this.listenerOptions);
    document.removeEventListener('scroll', this.wakeIdle, this.listenerOptions);
    document.removeEventListener('visibilitychange', this.visbilityChange, this.listenerOptions);
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

  idle() {
    this.maybeChangeState(State.Idle);
  }

  hidden() {
    this.maybeChangeState(State.Hidden);
  }

  visible() {
    if (this.state !== State.Visible) {
      // visible is nuking everything as focus is also resetting idle
      this.state = State.Visible;
      this.wakeIdle();
      this.stateChanged();
    }
  }

  private stateChanged() {
    this.previousState = this.state;
    this.statusChangeCallback(this.state);
  }

  is(state: State) {
    if (state === State.Visible) {
      return (this.state & 0b001) === State.Visible;
    } else {
      return this.state & state;
    }
  }
}
