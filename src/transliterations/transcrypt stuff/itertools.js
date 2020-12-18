import {list, tuple, len, __kwargtrans__, set} from './org.transcrypt.__runtime__.js';

var __name__ = 'itertools';

export var count = function* (start, step) {
    if (start == undefined) {
        start = 0;
    }
    if (step == undefined) {
        step = 1;
    }
    while (true) {
        yield start;
        start += step;
    }
}
export var cycle = function* (iterable) {                      
    let buffer = Array.from (iterable); // Can't reset, Chrome can't obtain iter from gener
    while (true) {
        for (let item of buffer) {
            yield item;
        }
    }
}
export var repeat = function* (item, n) {
    if (typeof n == 'undefined') {
        while (true) {
            yield item;
        }
    }
    else {
        for (let index = 0; index < n; index++) {
            yield item;
        }
    }
}
export var accumulate = function* (iterable, func) {
    let sum;
    let first = true;
    if (func) {
        for (let item of iterable) {
            if (first) {
                sum = item;
                first = false;
            }
            else {
                sum = func (sum, item);
            }
            yield sum;
        }
    }
    else {
        for (let item of iterable) {
            if (first) {
                sum = item;
                first = false;
            }
            else {
                sum = sum + item;
            }
            yield sum;
        }
    }
}
export var chain = function* () {
    let args = [] .slice.apply (arguments);                         
    for (let arg of args) {
        for (let item of arg) {
            yield item;
        }
    }
}
chain.from_iterable = function* (iterable) {                        
    for (let item of iterable) {
        for (let subItem of item) {
            yield subItem;
        }
    }
}
export var compress = function* (data, selectors) {
    let dataIterator = data [Symbol.iterator] .call (data);
    let selectorsIterator = selectors [Symbol.iterator] ();
    while (true) {
        let dataItem = dataIterator.next ();
        let selectorsItem = selectorsIterator.next ();
        if (dataItem.done || selectorsItem.done) {
            break;
        }
        else {
            if (selectorsItem.value) {
                yield dataItem.value;
            }
        }
    }
}
export var dropwhile = function* (pred, seq) {
    let started = false;
    for (let item of seq) {
        if (started) {
            yield item;
        }
        else if (!pred (item)) {
            started = true;
            yield item;
        }
    }
}
export var filterfalse = function* (pred, seq) {
    for (let item of seq) {
        if (!pred (item)) {
            yield item;
        }
    }
}
export var groupby = function* (iterable, keyfunc) {
    let anIterator = iterable [Symbol.iterator] ();
    let item = anIterator.next ();
    
    if (item.done) {
        return;
    }
    
    let groupKey = keyfunc (item.value);
    let more = true;
    
    function* group () {
        while (true) {
            yield (item.value);
            item = anIterator.next ();
            
            if (item.done) {
                more = false;
                return;
            }
            
            let key = keyfunc (item.value);
            
            if (key != groupKey) {
                groupKey = key;
                return;
            }
        }
    }
    
    while (more) {
        yield tuple ([groupKey, group ()]);
    }
}
export var islice = function* () {
    let start;  // Have to be defined at function level, or Closure compiler will loose them after a yield 
    let stop;   //
    let step;   //
    
    let args = [] .slice.apply (arguments);
    let anIterator = args [0][Symbol.iterator] ();
    if (args.length == 2) {
        stop = args [1];
        start = 0;
        step = 1;
    }
    else {
        start = args [1];
        stop = args [2];
        if (args.length == 4) {
            step = args [3];
        }
        else {
            step = 1;
        }
    }
    for (let index = 0; index < start; index++) {
        if (anIterator.next (). done) {
            return;
        }
    }
    for (let index = 0; index < stop - start; index++) {
        let next = anIterator.next ();
        if (next.done) {
            return;
        }
        if (index % step == 0) {
            yield next.value;
        }
    }
}
export var starmap = function* (func, seq) {
    let anIterator = seq [Symbol.iterator] ();
    while (true) {
        let next = anIterator.next ()
        if (next.done) {
            return;
        }
        else {
            yield func (...next.value); 
        }
    }
}
export var takewhile = function* (pred, seq) {
    for (let item of seq) {
        if (pred (item)) {
            yield item;
        }
        else {
            return;
        }
    }
}
export var tee = function (iterable, n) {
    if (n == undefined) {
        n = 2;
    }
    let all = [];                               // Don't return iterator since destructuring assignment cannot yet deal with that
    let one = list (iterable);
    for (let i = 0; i < n; i++) {
        all.append (one [Symbol.iterator] ());  // Iterator rather than list, exhaustable for semantic equivalence
    }
    return list (all);
}

export var product = function () {
    let args = [] .slice.apply (arguments);
    if (args.length && args [args.length - 1] .hasOwnProperty ('__kwargtrans__')) {
        var repeat = args.pop () ['repeat']; 
    }
    else {
        var repeat = 1;
    }
    
    let oldMolecules = [tuple ([])];
    for (let i = 0; i < repeat; i++) {
        for (let arg of args) {
            let newMolecules = [];
            for (let oldMolecule of oldMolecules) {
                for (let atom of arg) {
                    newMolecules.append (tuple (oldMolecule.concat (atom)));
                }
            }
            oldMolecules = newMolecules;
        }
    }
    return list (oldMolecules); // Also works if args is emptpy
}
export var permutations = function (iterable, r) {
    if (r == undefined) {
        try {
            r = len (iterable);
        }
        catch (exception) {
            r = len (list (iterable));
        }
    }
    let aProduct = product (iterable, __kwargtrans__ ({repeat: r}));
    let result = [];
    for (let molecule of aProduct) {
        if (len (set (molecule)) == r) {    // Weed out doubles
            result.append (molecule);
        }
    }
    return list (result);
}
export var combinations = function (iterable, r) {
    let tail = list (iterable);
    function recurse (tail, molecule, rNext) {
        for (let index = 0; index < len (tail) - rNext; index++) {
            let newMolecule = molecule.concat (tail.slice (index, index + 1));

            if (rNext) {
                recurse (tail.slice (index + 1), newMolecule, rNext - 1);
            }
            else {
                result.append (tuple (newMolecule));
            }
        }
    }
    let result = [];
    recurse (tail, tail.slice (0, 0), r - 1);
    return list (result);
}
export var combinations_with_replacement = function (iterable, r) {
    let tail = list (iterable);
    function recurse (tail, molecule, rNext) {
        for (let index = 0; index < len (tail); index++) {
            let newMolecule = molecule.concat (tail.slice (index, index + 1));

            if (rNext) {
                recurse (tail.slice (index), newMolecule, rNext - 1);
            }
            else {
                result.append (tuple (newMolecule));
            }
        }
    }
    let result = [];
    recurse (tail, tail.slice (0, 0), r - 1);
    return list (result);
}

//# sourceMappingURL=itertools.map