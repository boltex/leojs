// Polyfill for runtimes without Symbol.dispose (Node < 18.18, some browsers).
// Needed by the code that TypeScript emits for the 'using' keyword.
(Symbol as any).dispose ??= Symbol.for("Symbol.dispose");
(Symbol as any).asyncDispose ??= Symbol.for("Symbol.asyncDispose");

export { };