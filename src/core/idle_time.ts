//@+leo-ver=5-thin
//@+node:felix.20230509194418.1: * @file src/core/idle_time.ts
/**
 * Leo's Qt idle-time code.
 */

import * as g from './leoGlobals';

//@+others
//@+node:felix.20230509194418.2: ** class IdleTime
/**
 *     A class that executes a handler with a given delay at idle time. The
 *  handler takes a single argument, the IdleTime instance::
 *
 *      def handler(timer):
 *          \"""IdleTime handler.  timer is an IdleTime instance.\"""
 *          delta_t = timer.time-timer.starting_time
 *          g.trace(timer.count,timer.c.shortFileName(),'%2.4f' % (delta_t))
 *          if timer.count >= 5:
 *              g.trace('done')
 *              timer.stop()
 *
 *      ---> Execute handler every 500 msec. at idle time.
 *      timer = g.IdleTime(c,handler,delay=500)
 *      if timer: timer.start()
 *
 *  Timer instances are completely independent::
 *
 *      def handler1(timer):
 *          delta_t = timer.time-timer.starting_time
 *          g.trace('%2s %s %2.4f' % (timer.count,timer.c.shortFileName(),delta_t))
 *          if timer.count >= 5:
 *              g.trace('done')
 *              timer.stop()
 *
 *      def handler2(timer):
 *          delta_t = timer.time-timer.starting_time
 *          g.trace('%2s %s %2.4f' % (timer.count,timer.c.shortFileName(),delta_t))
 *          if timer.count >= 10:
 *              g.trace('done')
 *              timer.stop()
 *
 *      timer1 = g.IdleTime(c,handler1,delay=500)
 *      timer2 = g.IdleTime(c,handler2,delay=1000)
 *      if timer1 and timer2:
 *          timer1.start()
 *          timer2.start()
 */
export class IdleTime {
    public count: number; // The number of times handler has been called.
    public starting_time: number | undefined; // Time that the timer started.
    public time: number | undefined; // Time that the handle is called.
    public tag: string; // An arbitrary string/object for use during debugging.
    public delay: number;
    public enabled: boolean; // True: run the timer continuously.
    public handler: () => any; // The user-provided idle-time handler.
    public waiting_for_idle: boolean; // True if we have already waited for the minimum delay.
    public timer: NodeJS.Timeout | undefined; // for setTimeout or setInterval instead of QtCore.QTimer();

    //@+others
    //@+node:felix.20230509194418.3: *3* IdleTime.__init__
    /**
     * ctor for IdleTime class.
     */
    constructor(handler: () => any, delay = 500, tag = '') {
        // For use by handlers...
        this.count = 0; // The number of times handler has been called.
        this.starting_time = undefined; // Time that the timer started.
        this.time = undefined; // Time that the handle is called.
        this.tag = tag; // An arbitrary string/object for use during debugging.
        // For use by the IdleTime class...
        // The argument to self.timer.start: 0 for idle time, otherwise a delay in msec.
        this.delay = delay;
        this.enabled = false; // True: run the timer continuously.
        this.handler = handler; // The user-provided idle-time handler.
        this.waiting_for_idle = false; // True if we have already waited for the minimum delay.
        // Create the timer, but do not fire it.
        this.timer = undefined; // for setTimeout or setInterval instead of QtCore.QTimer();
        // this.timer.timeout.connect(this.at_idle_time);
        // Add this instance to the global idle_timers.list.
        // This reference prevents this instance from being destroyed.
        g.app.idle_timers.push(this);
    }
    //@+node:felix.20230509194418.4: *3* IdleTime.__repr__
    /**
     * IdleTime repr.
     */
    public __repr__(): string {
        const tag = this.tag;
        if (tag) {
            return `<IdleTime: ${tag.toString()}>`;
        }
        return `<IdleTime: id: ${this.timer?.toString()}>`;
    }

    public __str__(): string {
        return this.__repr__();
    }

    public toString(): string {
        return this.__repr__();
    }

    //@+node:felix.20230509194418.5: *3* IdleTime.at_idle_time
    /**
     * Call self.handler not more than once every self.delay msec.
     */
    public at_idle_time(): void {

        if (g.app.killed) {
            this.stop();
        } else if (this.enabled) {
            if (this.waiting_for_idle) {
                // At idle time: call the handler.
                this.call_handler();
            }
            // Requeue the timer with the appropriate delay.
            // 0 means wait until idle time.
            this.waiting_for_idle = !this.waiting_for_idle;
            if (this.timer) {
                // this.timer.stop();
                clearTimeout(this.timer);
                this.timer = undefined;
            }
            this.timer = setTimeout(
                this.at_idle_time.bind(this),
                this.waiting_for_idle ? 0 : this.delay
            );
            // this.timer.start(this.waiting_for_idle ? 0 : this.delay);
        } else if (this.timer) {
            // this.timer.stop();
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
    //@+node:felix.20230509194418.6: *3* IdleTime.call_handler
    /**
     * Carefully call the handler.
     */
    public call_handler(): void {
        try {
            this.count += 1;
            this.time = Date.now();
            this.handler();
        } catch (exception) {
            g.es_exception();
            this.stop();
        }
    }
    //@+node:felix.20230509194418.7: *3* IdleTime.destroy_self
    /**
     * Remove the instance from g.app.idle_timers.
     */
    public destroy_self(): void {
        if (!g.app.killed && g.app.idle_timers.includes(this)) {
            const w_index = g.app.idle_timers.indexOf(this);
            if (w_index !== -1) {
                g.app.idle_timers.splice(w_index, 1);
            }
            // g.app.idle_timers.remove(this);
        }
    }
    //@+node:felix.20230509194418.8: *3* IdleTime.start & stop
    /**
     * Start idle-time processing
     */
    public start(): void {
        console.log('start in IdleTime in idle_time.ts');
        this.enabled = true;
        if (this.starting_time == null) {
            this.starting_time = Date.now();
        }
        // Wait at least this.delay msec, then wait for idle time.
        this.timer = setTimeout(this.at_idle_time.bind(this), this.delay);
    }
    /**
     * Stop idle-time processing. May be called during shutdown.
     */
    public stop(): void {
        this.enabled = false;
        if (this.timer) {
            // this.timer.stop();
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4

//@-leo
