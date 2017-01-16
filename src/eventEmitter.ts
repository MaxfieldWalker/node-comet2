import * as events from 'events';

export class EventEmitter<T> extends events.EventEmitter {
    constructor() {
        super();
    }

    public subscribe(listener: (v: T) => void) {
        this.on('event', listener);
    }

    public unsubscribe(listener: (v: T) => void){
        this.removeListener('event', listener);
    }

    public fire(v: T) {
        this.emit('event', v);
    }
}