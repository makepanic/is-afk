/**
 * Function to emit an event against a target.
 * @param {EventTarget} target
 * @param {string} eventName
 */
export function emitEvent(target: EventTarget, eventName: string) {
  const event = new Event(eventName);
  target.dispatchEvent(event);
}
