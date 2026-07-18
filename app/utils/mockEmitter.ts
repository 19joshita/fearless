type EventCallback = (data: any) => void;
class MockEmitter {
  private listeners: { [event: string]: EventCallback[] } = {};
  on(event: string, callback: EventCallback) { if (!this.listeners[event]) this.listeners[event] = []; this.listeners[event].push(callback); }
  emit(event: string, data: any) { if (this.listeners[event]) this.listeners[event].forEach(cb => cb(data)); }
  off(event: string) { delete this.listeners[event]; }
}
export default new MockEmitter();