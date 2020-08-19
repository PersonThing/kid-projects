
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.24.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (219:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[5]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(219:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (217:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[4]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(217:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, "_sveltesparouter", { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event("hashchange"));
    	});
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	// eslint-disable-next-line no-console
    	console.warn("nextTickPromise from 'svelte-spa-router' is deprecated and will be removed in version 3; use the 'tick' method from the Svelte runtime instead");

    	return tick().then(cb);
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(6, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		tick().then(() => {
    			dispatch(name, detail);
    		});
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 65) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == "object" && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome\components\svg\Path.svelte generated by Svelte v3.24.1 */

    const file = "node_modules\\svelte-awesome\\components\\svg\\Path.svelte";

    function create_fragment$1(ctx) {
    	let path;
    	let path_key_value;

    	let path_levels = [
    		{
    			key: path_key_value = "path-" + /*id*/ ctx[0]
    		},
    		/*data*/ ctx[1]
    	];

    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [
    				dirty & /*id*/ 1 && path_key_value !== (path_key_value = "path-" + /*id*/ ctx[0]) && { key: path_key_value },
    				dirty & /*data*/ 2 && /*data*/ ctx[1]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { id = "" } = $$props;
    	let { data = {} } = $$props;
    	const writable_props = ["id", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Path> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Path", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ id, data });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, data];
    }

    class Path extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { id: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Path",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get id() {
    		throw new Error("<Path>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Path>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Path>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Path>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome\components\svg\Polygon.svelte generated by Svelte v3.24.1 */

    const file$1 = "node_modules\\svelte-awesome\\components\\svg\\Polygon.svelte";

    function create_fragment$2(ctx) {
    	let polygon;
    	let polygon_key_value;

    	let polygon_levels = [
    		{
    			key: polygon_key_value = "polygon-" + /*id*/ ctx[0]
    		},
    		/*data*/ ctx[1]
    	];

    	let polygon_data = {};

    	for (let i = 0; i < polygon_levels.length; i += 1) {
    		polygon_data = assign(polygon_data, polygon_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			polygon = svg_element("polygon");
    			set_svg_attributes(polygon, polygon_data);
    			add_location(polygon, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, polygon, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(polygon, polygon_data = get_spread_update(polygon_levels, [
    				dirty & /*id*/ 1 && polygon_key_value !== (polygon_key_value = "polygon-" + /*id*/ ctx[0]) && { key: polygon_key_value },
    				dirty & /*data*/ 2 && /*data*/ ctx[1]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(polygon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { id = "" } = $$props;
    	let { data = {} } = $$props;
    	const writable_props = ["id", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Polygon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Polygon", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ id, data });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, data];
    }

    class Polygon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { id: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Polygon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get id() {
    		throw new Error("<Polygon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Polygon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Polygon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Polygon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome\components\svg\Raw.svelte generated by Svelte v3.24.1 */

    const file$2 = "node_modules\\svelte-awesome\\components\\svg\\Raw.svelte";

    function create_fragment$3(ctx) {
    	let g;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			add_location(g, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			g.innerHTML = /*raw*/ ctx[0];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*raw*/ 1) g.innerHTML = /*raw*/ ctx[0];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let cursor = 870711;

    	function getId() {
    		cursor += 1;
    		return `fa-${cursor.toString(16)}`;
    	}

    	let raw;
    	let { data } = $$props;

    	function getRaw(data) {
    		if (!data || !data.raw) {
    			return null;
    		}

    		let rawData = data.raw;
    		const ids = {};

    		rawData = rawData.replace(/\s(?:xml:)?id=["']?([^"')\s]+)/g, (match, id) => {
    			const uniqueId = getId();
    			ids[id] = uniqueId;
    			return ` id="${uniqueId}"`;
    		});

    		rawData = rawData.replace(/#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g, (match, rawId, _, pointerId) => {
    			const id = rawId || pointerId;

    			if (!id || !ids[id]) {
    				return match;
    			}

    			return `#${ids[id]}`;
    		});

    		return rawData;
    	}

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Raw> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Raw", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ cursor, getId, raw, data, getRaw });

    	$$self.$inject_state = $$props => {
    		if ("cursor" in $$props) cursor = $$props.cursor;
    		if ("raw" in $$props) $$invalidate(0, raw = $$props.raw);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 2) {
    			 $$invalidate(0, raw = getRaw(data));
    		}
    	};

    	return [raw, data];
    }

    class Raw extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Raw",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<Raw> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Raw>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Raw>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome\components\svg\Svg.svelte generated by Svelte v3.24.1 */

    const file$3 = "node_modules\\svelte-awesome\\components\\svg\\Svg.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let svg_class_value;
    	let svg_role_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "class", svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-1dof0an");
    			attr_dev(svg, "x", /*x*/ ctx[8]);
    			attr_dev(svg, "y", /*y*/ ctx[9]);
    			attr_dev(svg, "width", /*width*/ ctx[1]);
    			attr_dev(svg, "height", /*height*/ ctx[2]);
    			attr_dev(svg, "aria-label", /*label*/ ctx[11]);
    			attr_dev(svg, "role", svg_role_value = /*label*/ ctx[11] ? "img" : "presentation");
    			attr_dev(svg, "viewBox", /*box*/ ctx[3]);
    			attr_dev(svg, "style", /*style*/ ctx[10]);
    			toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
    			toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
    			toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
    			toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === "horizontal");
    			toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === "vertical");
    			add_location(svg, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*className*/ 1 && svg_class_value !== (svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-1dof0an")) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (!current || dirty & /*x*/ 256) {
    				attr_dev(svg, "x", /*x*/ ctx[8]);
    			}

    			if (!current || dirty & /*y*/ 512) {
    				attr_dev(svg, "y", /*y*/ ctx[9]);
    			}

    			if (!current || dirty & /*width*/ 2) {
    				attr_dev(svg, "width", /*width*/ ctx[1]);
    			}

    			if (!current || dirty & /*height*/ 4) {
    				attr_dev(svg, "height", /*height*/ ctx[2]);
    			}

    			if (!current || dirty & /*label*/ 2048) {
    				attr_dev(svg, "aria-label", /*label*/ ctx[11]);
    			}

    			if (!current || dirty & /*label*/ 2048 && svg_role_value !== (svg_role_value = /*label*/ ctx[11] ? "img" : "presentation")) {
    				attr_dev(svg, "role", svg_role_value);
    			}

    			if (!current || dirty & /*box*/ 8) {
    				attr_dev(svg, "viewBox", /*box*/ ctx[3]);
    			}

    			if (!current || dirty & /*style*/ 1024) {
    				attr_dev(svg, "style", /*style*/ ctx[10]);
    			}

    			if (dirty & /*className, spin*/ 17) {
    				toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
    			}

    			if (dirty & /*className, pulse*/ 65) {
    				toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
    			}

    			if (dirty & /*className, inverse*/ 33) {
    				toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
    			}

    			if (dirty & /*className, flip*/ 129) {
    				toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === "horizontal");
    			}

    			if (dirty & /*className, flip*/ 129) {
    				toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === "vertical");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { class: className } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { box } = $$props;
    	let { spin = false } = $$props;
    	let { inverse = false } = $$props;
    	let { pulse = false } = $$props;
    	let { flip = null } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { style = undefined } = $$props;
    	let { label = undefined } = $$props;

    	const writable_props = [
    		"class",
    		"width",
    		"height",
    		"box",
    		"spin",
    		"inverse",
    		"pulse",
    		"flip",
    		"x",
    		"y",
    		"style",
    		"label"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Svg", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("class" in $$props) $$invalidate(0, className = $$props.class);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("box" in $$props) $$invalidate(3, box = $$props.box);
    		if ("spin" in $$props) $$invalidate(4, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(5, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(6, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(7, flip = $$props.flip);
    		if ("x" in $$props) $$invalidate(8, x = $$props.x);
    		if ("y" in $$props) $$invalidate(9, y = $$props.y);
    		if ("style" in $$props) $$invalidate(10, style = $$props.style);
    		if ("label" in $$props) $$invalidate(11, label = $$props.label);
    		if ("$$scope" in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		width,
    		height,
    		box,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		x,
    		y,
    		style,
    		label
    	});

    	$$self.$inject_state = $$props => {
    		if ("className" in $$props) $$invalidate(0, className = $$props.className);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("box" in $$props) $$invalidate(3, box = $$props.box);
    		if ("spin" in $$props) $$invalidate(4, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(5, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(6, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(7, flip = $$props.flip);
    		if ("x" in $$props) $$invalidate(8, x = $$props.x);
    		if ("y" in $$props) $$invalidate(9, y = $$props.y);
    		if ("style" in $$props) $$invalidate(10, style = $$props.style);
    		if ("label" in $$props) $$invalidate(11, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		className,
    		width,
    		height,
    		box,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		x,
    		y,
    		style,
    		label,
    		$$scope,
    		$$slots
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			class: 0,
    			width: 1,
    			height: 2,
    			box: 3,
    			spin: 4,
    			inverse: 5,
    			pulse: 6,
    			flip: 7,
    			x: 8,
    			y: 9,
    			style: 10,
    			label: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !("class" in props)) {
    			console.warn("<Svg> was created without expected prop 'class'");
    		}

    		if (/*width*/ ctx[1] === undefined && !("width" in props)) {
    			console.warn("<Svg> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !("height" in props)) {
    			console.warn("<Svg> was created without expected prop 'height'");
    		}

    		if (/*box*/ ctx[3] === undefined && !("box" in props)) {
    			console.warn("<Svg> was created without expected prop 'box'");
    		}
    	}

    	get class() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get box() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set box(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome\components\Icon.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$1, console: console_1$1 } = globals;

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    // (4:4) {#if self}
    function create_if_block$1(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*self*/ ctx[0].paths && create_if_block_3(ctx);
    	let if_block1 = /*self*/ ctx[0].polygons && create_if_block_2(ctx);
    	let if_block2 = /*self*/ ctx[0].raw && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*self*/ ctx[0].paths) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*self*/ ctx[0].polygons) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*self*/ ctx[0].raw) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(4:4) {#if self}",
    		ctx
    	});

    	return block;
    }

    // (5:6) {#if self.paths}
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*self*/ ctx[0].paths;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*self*/ 1) {
    				each_value_1 = /*self*/ ctx[0].paths;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(5:6) {#if self.paths}",
    		ctx
    	});

    	return block;
    }

    // (6:8) {#each self.paths as path, i}
    function create_each_block_1(ctx) {
    	let path;
    	let current;

    	path = new Path({
    			props: {
    				id: /*i*/ ctx[31],
    				data: /*path*/ ctx[32]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(path.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(path, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const path_changes = {};
    			if (dirty[0] & /*self*/ 1) path_changes.data = /*path*/ ctx[32];
    			path.$set(path_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(path.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(path.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(path, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(6:8) {#each self.paths as path, i}",
    		ctx
    	});

    	return block;
    }

    // (10:6) {#if self.polygons}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*self*/ ctx[0].polygons;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*self*/ 1) {
    				each_value = /*self*/ ctx[0].polygons;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(10:6) {#if self.polygons}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each self.polygons as polygon, i}
    function create_each_block(ctx) {
    	let polygon;
    	let current;

    	polygon = new Polygon({
    			props: {
    				id: /*i*/ ctx[31],
    				data: /*polygon*/ ctx[29]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(polygon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(polygon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const polygon_changes = {};
    			if (dirty[0] & /*self*/ 1) polygon_changes.data = /*polygon*/ ctx[29];
    			polygon.$set(polygon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polygon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polygon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(polygon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:8) {#each self.polygons as polygon, i}",
    		ctx
    	});

    	return block;
    }

    // (15:6) {#if self.raw}
    function create_if_block_1(ctx) {
    	let raw;
    	let updating_data;
    	let current;

    	function raw_data_binding(value) {
    		/*raw_data_binding*/ ctx[15].call(null, value);
    	}

    	let raw_props = {};

    	if (/*self*/ ctx[0] !== void 0) {
    		raw_props.data = /*self*/ ctx[0];
    	}

    	raw = new Raw({ props: raw_props, $$inline: true });
    	binding_callbacks.push(() => bind(raw, "data", raw_data_binding));

    	const block = {
    		c: function create() {
    			create_component(raw.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(raw, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const raw_changes = {};

    			if (!updating_data && dirty[0] & /*self*/ 1) {
    				updating_data = true;
    				raw_changes.data = /*self*/ ctx[0];
    				add_flush_callback(() => updating_data = false);
    			}

    			raw.$set(raw_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(raw.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(raw.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(raw, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(15:6) {#if self.raw}",
    		ctx
    	});

    	return block;
    }

    // (3:8)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*self*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*self*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(3:8)      ",
    		ctx
    	});

    	return block;
    }

    // (1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>
    function create_default_slot(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*self*/ 1) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let svg;
    	let current;

    	svg = new Svg({
    			props: {
    				label: /*label*/ ctx[6],
    				width: /*width*/ ctx[7],
    				height: /*height*/ ctx[8],
    				box: /*box*/ ctx[10],
    				style: /*combinedStyle*/ ctx[9],
    				spin: /*spin*/ ctx[2],
    				flip: /*flip*/ ctx[5],
    				inverse: /*inverse*/ ctx[3],
    				pulse: /*pulse*/ ctx[4],
    				class: /*className*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};
    			if (dirty[0] & /*label*/ 64) svg_changes.label = /*label*/ ctx[6];
    			if (dirty[0] & /*width*/ 128) svg_changes.width = /*width*/ ctx[7];
    			if (dirty[0] & /*height*/ 256) svg_changes.height = /*height*/ ctx[8];
    			if (dirty[0] & /*box*/ 1024) svg_changes.box = /*box*/ ctx[10];
    			if (dirty[0] & /*combinedStyle*/ 512) svg_changes.style = /*combinedStyle*/ ctx[9];
    			if (dirty[0] & /*spin*/ 4) svg_changes.spin = /*spin*/ ctx[2];
    			if (dirty[0] & /*flip*/ 32) svg_changes.flip = /*flip*/ ctx[5];
    			if (dirty[0] & /*inverse*/ 8) svg_changes.inverse = /*inverse*/ ctx[3];
    			if (dirty[0] & /*pulse*/ 16) svg_changes.pulse = /*pulse*/ ctx[4];
    			if (dirty[0] & /*className*/ 2) svg_changes.class = /*className*/ ctx[1];

    			if (dirty[0] & /*$$scope, self*/ 65537) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function normaliseData(data) {
    	if ("iconName" in data && "icon" in data) {
    		let normalisedData = {};
    		let faIcon = data.icon;
    		let name = data.iconName;
    		let width = faIcon[0];
    		let height = faIcon[1];
    		let paths = faIcon[4];
    		let iconData = { width, height, paths: [{ d: paths }] };
    		normalisedData[name] = iconData;
    		return normalisedData;
    	}

    	return data;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { data } = $$props;
    	let { scale = 1 } = $$props;
    	let { spin = false } = $$props;
    	let { inverse = false } = $$props;
    	let { pulse = false } = $$props;
    	let { flip = null } = $$props;
    	let { label = null } = $$props;
    	let { self = null } = $$props;
    	let { style = null } = $$props;

    	// internal
    	let x = 0;

    	let y = 0;
    	let childrenHeight = 0;
    	let childrenWidth = 0;
    	let outerScale = 1;
    	let width;
    	let height;
    	let combinedStyle;
    	let box;

    	function init() {
    		if (typeof data === "undefined") {
    			return;
    		}

    		const normalisedData = normaliseData(data);
    		const [name] = Object.keys(normalisedData);
    		const icon = normalisedData[name];

    		if (!icon.paths) {
    			icon.paths = [];
    		}

    		if (icon.d) {
    			icon.paths.push({ d: icon.d });
    		}

    		if (!icon.polygons) {
    			icon.polygons = [];
    		}

    		if (icon.points) {
    			icon.polygons.push({ points: icon.points });
    		}

    		$$invalidate(0, self = icon);
    	}

    	function normalisedScale() {
    		let numScale = 1;

    		if (typeof scale !== "undefined") {
    			numScale = Number(scale);
    		}

    		if (isNaN(numScale) || numScale <= 0) {
    			// eslint-disable-line no-restricted-globals
    			console.warn("Invalid prop: prop \"scale\" should be a number over 0."); // eslint-disable-line no-console

    			return outerScale;
    		}

    		return numScale * outerScale;
    	}

    	function calculateBox() {
    		if (self) {
    			return `0 0 ${self.width} ${self.height}`;
    		}

    		return `0 0 ${width} ${height}`;
    	}

    	function calculateRatio() {
    		if (!self) {
    			return 1;
    		}

    		return Math.max(self.width, self.height) / 16;
    	}

    	function calculateWidth() {
    		if (childrenWidth) {
    			return childrenWidth;
    		}

    		if (self) {
    			return self.width / calculateRatio() * normalisedScale();
    		}

    		return 0;
    	}

    	function calculateHeight() {
    		if (childrenHeight) {
    			return childrenHeight;
    		}

    		if (self) {
    			return self.height / calculateRatio() * normalisedScale();
    		}

    		return 0;
    	}

    	function calculateStyle() {
    		let combined = "";

    		if (style !== null) {
    			combined += style;
    		}

    		let size = normalisedScale();

    		if (size === 1) {
    			return combined;
    		}

    		if (combined !== "" && !combined.endsWith(";")) {
    			combined += "; ";
    		}

    		return `${combined}font-size: ${size}em`;
    	}

    	const writable_props = [
    		"class",
    		"data",
    		"scale",
    		"spin",
    		"inverse",
    		"pulse",
    		"flip",
    		"label",
    		"self",
    		"style"
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Icon", $$slots, ['default']);

    	function raw_data_binding(value) {
    		self = value;
    		$$invalidate(0, self);
    	}

    	$$self.$$set = $$props => {
    		if ("class" in $$props) $$invalidate(1, className = $$props.class);
    		if ("data" in $$props) $$invalidate(11, data = $$props.data);
    		if ("scale" in $$props) $$invalidate(12, scale = $$props.scale);
    		if ("spin" in $$props) $$invalidate(2, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(3, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(4, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(5, flip = $$props.flip);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("self" in $$props) $$invalidate(0, self = $$props.self);
    		if ("style" in $$props) $$invalidate(13, style = $$props.style);
    		if ("$$scope" in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Path,
    		Polygon,
    		Raw,
    		Svg,
    		className,
    		data,
    		scale,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		label,
    		self,
    		style,
    		x,
    		y,
    		childrenHeight,
    		childrenWidth,
    		outerScale,
    		width,
    		height,
    		combinedStyle,
    		box,
    		init,
    		normaliseData,
    		normalisedScale,
    		calculateBox,
    		calculateRatio,
    		calculateWidth,
    		calculateHeight,
    		calculateStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ("className" in $$props) $$invalidate(1, className = $$props.className);
    		if ("data" in $$props) $$invalidate(11, data = $$props.data);
    		if ("scale" in $$props) $$invalidate(12, scale = $$props.scale);
    		if ("spin" in $$props) $$invalidate(2, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(3, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(4, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(5, flip = $$props.flip);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("self" in $$props) $$invalidate(0, self = $$props.self);
    		if ("style" in $$props) $$invalidate(13, style = $$props.style);
    		if ("x" in $$props) x = $$props.x;
    		if ("y" in $$props) y = $$props.y;
    		if ("childrenHeight" in $$props) childrenHeight = $$props.childrenHeight;
    		if ("childrenWidth" in $$props) childrenWidth = $$props.childrenWidth;
    		if ("outerScale" in $$props) outerScale = $$props.outerScale;
    		if ("width" in $$props) $$invalidate(7, width = $$props.width);
    		if ("height" in $$props) $$invalidate(8, height = $$props.height);
    		if ("combinedStyle" in $$props) $$invalidate(9, combinedStyle = $$props.combinedStyle);
    		if ("box" in $$props) $$invalidate(10, box = $$props.box);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, style, scale*/ 14336) {
    			 {
    				init();
    				$$invalidate(7, width = calculateWidth());
    				$$invalidate(8, height = calculateHeight());
    				$$invalidate(9, combinedStyle = calculateStyle());
    				$$invalidate(10, box = calculateBox());
    			}
    		}
    	};

    	return [
    		self,
    		className,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		label,
    		width,
    		height,
    		combinedStyle,
    		box,
    		data,
    		scale,
    		style,
    		$$slots,
    		raw_data_binding,
    		$$scope
    	];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				class: 1,
    				data: 11,
    				scale: 12,
    				spin: 2,
    				inverse: 3,
    				pulse: 4,
    				flip: 5,
    				label: 6,
    				self: 0,
    				style: 13
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[11] === undefined && !("data" in props)) {
    			console_1$1.warn("<Icon> was created without expected prop 'data'");
    		}
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get self() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set self(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var checkIcon = { check: { width: 1792, height: 1792, paths: [{ d: 'M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z' }] } };

    var removeIcon = { remove: { width: 1408, height: 1792, paths: [{ d: 'M1298 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z' }] } };

    var arrowLeftIcon = { 'arrow-left': { width: 1536, height: 1792, paths: [{ d: 'M1536 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z' }] } };

    var arrowRightIcon = { 'arrow-right': { width: 1536, height: 1792, paths: [{ d: 'M1472 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293h-704q-52 0-84.5-37.5t-32.5-90.5v-128q0-53 32.5-90.5t84.5-37.5h704l-293-294q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z' }] } };

    var arrowUpIcon = { 'arrow-up': { width: 1664, height: 1792, paths: [{ d: 'M1611 971q0 51-37 90l-75 75q-38 38-91 38-54 0-90-38l-294-293v704q0 52-37.5 84.5t-90.5 32.5h-128q-53 0-90.5-32.5t-37.5-84.5v-704l-294 293q-36 38-90 38t-90-38l-75-75q-38-38-38-90 0-53 38-91l651-651q35-37 90-37 54 0 91 37l651 651q37 39 37 91z' }] } };

    var arrowDownIcon = { 'arrow-down': { width: 1664, height: 1792, paths: [{ d: 'M1611 832q0 53-37 90l-651 652q-39 37-91 37-53 0-90-37l-651-652q-38-36-38-90 0-53 38-91l74-75q39-37 91-37 53 0 90 37l294 294v-704q0-52 38-90t90-38h128q52 0 90 38t38 90v704l294-294q37-37 90-37 52 0 91 37l75 75q37 39 37 91z' }] } };

    var caretDownIcon = { 'caret-down': { width: 1024, height: 1792, paths: [{ d: 'M1024 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z' }] } };

    var undoIcon = { undo: { width: 1536, height: 1792, paths: [{ d: 'M1536 896q0 156-61 298t-164 245-245 164-298 61q-172 0-327-72.5t-264-204.5q-7-10-6.5-22.5t8.5-20.5l137-138q10-9 25-9 16 2 23 12 73 95 179 147t225 52q104 0 198.5-40.5t163.5-109.5 109.5-163.5 40.5-198.5-40.5-198.5-109.5-163.5-163.5-109.5-198.5-40.5q-98 0-188 35.5t-160 101.5l137 138q31 30 14 69-17 40-59 40h-448q-26 0-45-19t-19-45v-448q0-42 40-59 39-17 69 14l130 129q107-101 244.5-156.5t284.5-55.5q156 0 298 61t245 164 164 245 61 298z' }] } };

    var eraseIcon = { eraser: { width: 1920, height: 1792, paths: [{ d: 'M896 1408l336-384h-768l-336 384h768zM1909 331q15 34 9.5 71.5t-30.5 65.5l-896 1024q-38 44-96 44h-768q-38 0-69.5-20.5t-47.5-54.5q-15-34-9.5-71.5t30.5-65.5l896-1024q38-44 96-44h768q38 0 69.5 20.5t47.5 54.5z' }] } };

    var paintBrushIcon = { 'paint-brush': { width: 1792, height: 1792, paths: [{ d: 'M1615 0q70 0 122.5 46.5t52.5 116.5q0 63-45 151-332 629-465 752-97 91-218 91-126 0-216.5-92.5t-90.5-219.5q0-128 92-212l638-579q59-54 130-54zM706 1034q39 76 106.5 130t150.5 76l1 71q4 213-129.5 347t-348.5 134q-123 0-218-46.5t-152.5-127.5-86.5-183-29-220q7 5 41 30t62 44.5 59 36.5 46 17q41 0 55-37 25-66 57.5-112.5t69.5-76 88-47.5 103-25.5 125-10.5z' }] } };

    /* src\components\QuickDropdown.svelte generated by Svelte v3.24.1 */
    const file$4 = "src\\components\\QuickDropdown.svelte";
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (15:3) {#if label != null}
    function create_if_block_2$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			add_location(span, file$4, 15, 4, 409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = /*label*/ ctx[6];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 64) span.innerHTML = /*label*/ ctx[6];		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(15:3) {#if label != null}",
    		ctx
    	});

    	return block;
    }

    // (14:21)      
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*label*/ ctx[6] != null && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*label*/ ctx[6] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(14:21)      ",
    		ctx
    	});

    	return block;
    }

    // (21:2) {#if !noCaret}
    function create_if_block_1$1(ctx) {
    	let icon_1;
    	let current;

    	icon_1 = new Icon({
    			props: { data: caretDownIcon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(21:2) {#if !noCaret}",
    		ctx
    	});

    	return block;
    }

    // (25:1) {#if isOpen}
    function create_if_block$2(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "quick-dropdown-menu " + /*dropdownClass*/ ctx[3] + " svelte-wxmkik");
    			add_location(div, file$4, 25, 2, 556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[23](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*closeIfAnyClickCloses*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1048576) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[20], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*dropdownClass*/ 8 && div_class_value !== (div_class_value = "quick-dropdown-menu " + /*dropdownClass*/ ctx[3] + " svelte-wxmkik")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(25:1) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let a;
    	let t0;
    	let a_class_value;
    	let t1;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const label_slot_template = /*$$slots*/ ctx[21].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[20], get_label_slot_context);
    	const label_slot_or_fallback = label_slot || fallback_block$1(ctx);
    	let if_block0 = !/*noCaret*/ ctx[4] && create_if_block_1$1(ctx);
    	let if_block1 = /*isOpen*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			if (label_slot_or_fallback) label_slot_or_fallback.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(a, "class", a_class_value = "" + (null_to_empty(/*btnClass*/ ctx[2]) + " svelte-wxmkik"));
    			attr_dev(a, "id", /*id*/ ctx[7]);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "tabindex", tabindex);
    			toggle_class(a, "btn-default", !/*invalid*/ ctx[8]);
    			toggle_class(a, "btn-danger", /*invalid*/ ctx[8]);
    			toggle_class(a, "invalid", /*invalid*/ ctx[8] && !/*isOpen*/ ctx[0]);
    			toggle_class(a, "disabled", /*disabled*/ ctx[5]);
    			add_location(a, file$4, 1, 1, 92);
    			attr_dev(div, "class", div_class_value = "quick-dropdown " + /*className*/ ctx[9] + " svelte-wxmkik");
    			attr_dev(div, "data-test", /*dataTest*/ ctx[1]);
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);

    			if (label_slot_or_fallback) {
    				label_slot_or_fallback.m(a, null);
    			}

    			append_dev(a, t0);
    			if (if_block0) if_block0.m(a, null);
    			/*a_binding*/ ctx[22](a);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding_1*/ ctx[24](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", prevent_default(/*toggle*/ ctx[14]), false, true, false),
    					listen_dev(a, "keydown", /*keydown*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (label_slot) {
    				if (label_slot.p && dirty & /*$$scope*/ 1048576) {
    					update_slot(label_slot, label_slot_template, ctx, /*$$scope*/ ctx[20], dirty, get_label_slot_changes, get_label_slot_context);
    				}
    			} else {
    				if (label_slot_or_fallback && label_slot_or_fallback.p && dirty & /*label*/ 64) {
    					label_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!/*noCaret*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*noCaret*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(a, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*btnClass*/ 4 && a_class_value !== (a_class_value = "" + (null_to_empty(/*btnClass*/ ctx[2]) + " svelte-wxmkik"))) {
    				attr_dev(a, "class", a_class_value);
    			}

    			if (!current || dirty & /*id*/ 128) {
    				attr_dev(a, "id", /*id*/ ctx[7]);
    			}

    			if (dirty & /*btnClass, invalid*/ 260) {
    				toggle_class(a, "btn-default", !/*invalid*/ ctx[8]);
    			}

    			if (dirty & /*btnClass, invalid*/ 260) {
    				toggle_class(a, "btn-danger", /*invalid*/ ctx[8]);
    			}

    			if (dirty & /*btnClass, invalid, isOpen*/ 261) {
    				toggle_class(a, "invalid", /*invalid*/ ctx[8] && !/*isOpen*/ ctx[0]);
    			}

    			if (dirty & /*btnClass, disabled*/ 36) {
    				toggle_class(a, "disabled", /*disabled*/ ctx[5]);
    			}

    			if (/*isOpen*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*className*/ 512 && div_class_value !== (div_class_value = "quick-dropdown " + /*className*/ ctx[9] + " svelte-wxmkik")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*dataTest*/ 2) {
    				attr_dev(div, "data-test", /*dataTest*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot_or_fallback, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot_or_fallback, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
    			if (if_block0) if_block0.d();
    			/*a_binding*/ ctx[22](null);
    			if (if_block1) if_block1.d();
    			/*div_binding_1*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const tabindex = 0;

    function instance$6($$self, $$props, $$invalidate) {
    	let { btnTitle = null } = $$props;
    	let { isOpen = false } = $$props;
    	let { dataTest = null } = $$props;
    	let { btnClass = "btn btn-light btn-sm" } = $$props;
    	let { dropdownClass = "below left" } = $$props;
    	let { anyItemClickCloses = false } = $$props;
    	let { noCaret = false } = $$props;
    	let { icon = null } = $$props;
    	let { autofocusFirstItem = false } = $$props;
    	let { disabled = false } = $$props;
    	let { label = null } = $$props;
    	let { id = null } = $$props;
    	let { invalid = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let dropdownElement = null;
    	let buttonElement = null;
    	let dropdownMenuElement = null;
    	let { class: className = "" } = $$props;
    	let lastMouseDownTarget = null;
    	onDestroy(close);

    	function open() {
    		$$invalidate(0, isOpen = true);

    		// wait for next event loop (not just micro task as in tick()) so menu element is rendered
    		setTimeout(() => {
    			if (autofocusFirstItem && dropdownMenuElement != null) {
    				const item = dropdownMenuElement.querySelector("input, label, a");
    				if (item != null) item.focus();
    			}

    			dispatch("open");
    			document.addEventListener("mousedown", trackLastMouseDownTarget);
    			document.addEventListener("click", clickListener);
    		});
    	}

    	function close() {
    		dispatch("close");
    		$$invalidate(0, isOpen = false);
    		document.removeEventListener("mousedown", trackLastMouseDownTarget);
    		document.removeEventListener("click", clickListener);
    	}

    	function trackLastMouseDownTarget(e) {
    		lastMouseDownTarget = e.target;
    	}

    	function clickListener() {
    		// for click events, e.target is the last element the mouse was on, so use the element they initially put their mouse down on instead.
    		// wait til they finish the click to determine if we need to close it or not, so that click handlers can fire before we close
    		// e.g. if they select all text in a box with mouse and end their "click" outside the menu, don't close
    		if (dropdownMenuElement == null || lastMouseDownTarget == null) return;

    		// if the element has since been removed from DOM, assume don't close--e.g. open an date picker, select date, calendar goes away, should keep quickdropdown open
    		if (!document.body.contains(lastMouseDownTarget)) return;

    		const clickedMenu = dropdownMenuElement === lastMouseDownTarget || dropdownMenuElement.contains(lastMouseDownTarget);

    		if (!clickedMenu) {
    			// console.log('closing', clickedMenu, anyItemClickCloses, dropdownMenuElement, lastMouseDownTarget, e.target)
    			close();
    		}
    	}

    	function closeIfAnyClickCloses() {
    		if (anyItemClickCloses) setTimeout(close, 0); // wait a bit so click registers prior to closing
    	}

    	function toggle() {
    		isOpen ? close() : open();
    	}

    	function keydown(e) {
    		const key = e.which || e.keyCode;

    		switch (key) {
    			case 13:
    			case 32:
    			case 40:
    				// down
    				open();
    				e.preventDefault();
    				return;
    			case 27:
    			case 9:
    			case 38:
    				// up
    				close();
    				return;
    		}
    	}

    	const writable_props = [
    		"btnTitle",
    		"isOpen",
    		"dataTest",
    		"btnClass",
    		"dropdownClass",
    		"anyItemClickCloses",
    		"noCaret",
    		"icon",
    		"autofocusFirstItem",
    		"disabled",
    		"label",
    		"id",
    		"invalid",
    		"class"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<QuickDropdown> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("QuickDropdown", $$slots, ['label','default']);

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			buttonElement = $$value;
    			$$invalidate(11, buttonElement);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			dropdownMenuElement = $$value;
    			$$invalidate(12, dropdownMenuElement);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			dropdownElement = $$value;
    			$$invalidate(10, dropdownElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("btnTitle" in $$props) $$invalidate(16, btnTitle = $$props.btnTitle);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("dataTest" in $$props) $$invalidate(1, dataTest = $$props.dataTest);
    		if ("btnClass" in $$props) $$invalidate(2, btnClass = $$props.btnClass);
    		if ("dropdownClass" in $$props) $$invalidate(3, dropdownClass = $$props.dropdownClass);
    		if ("anyItemClickCloses" in $$props) $$invalidate(17, anyItemClickCloses = $$props.anyItemClickCloses);
    		if ("noCaret" in $$props) $$invalidate(4, noCaret = $$props.noCaret);
    		if ("icon" in $$props) $$invalidate(18, icon = $$props.icon);
    		if ("autofocusFirstItem" in $$props) $$invalidate(19, autofocusFirstItem = $$props.autofocusFirstItem);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("id" in $$props) $$invalidate(7, id = $$props.id);
    		if ("invalid" in $$props) $$invalidate(8, invalid = $$props.invalid);
    		if ("class" in $$props) $$invalidate(9, className = $$props.class);
    		if ("$$scope" in $$props) $$invalidate(20, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		Icon,
    		caretDownIcon,
    		btnTitle,
    		isOpen,
    		dataTest,
    		btnClass,
    		dropdownClass,
    		anyItemClickCloses,
    		noCaret,
    		icon,
    		autofocusFirstItem,
    		disabled,
    		label,
    		id,
    		invalid,
    		dispatch,
    		tabindex,
    		dropdownElement,
    		buttonElement,
    		dropdownMenuElement,
    		className,
    		lastMouseDownTarget,
    		open,
    		close,
    		trackLastMouseDownTarget,
    		clickListener,
    		closeIfAnyClickCloses,
    		toggle,
    		keydown
    	});

    	$$self.$inject_state = $$props => {
    		if ("btnTitle" in $$props) $$invalidate(16, btnTitle = $$props.btnTitle);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("dataTest" in $$props) $$invalidate(1, dataTest = $$props.dataTest);
    		if ("btnClass" in $$props) $$invalidate(2, btnClass = $$props.btnClass);
    		if ("dropdownClass" in $$props) $$invalidate(3, dropdownClass = $$props.dropdownClass);
    		if ("anyItemClickCloses" in $$props) $$invalidate(17, anyItemClickCloses = $$props.anyItemClickCloses);
    		if ("noCaret" in $$props) $$invalidate(4, noCaret = $$props.noCaret);
    		if ("icon" in $$props) $$invalidate(18, icon = $$props.icon);
    		if ("autofocusFirstItem" in $$props) $$invalidate(19, autofocusFirstItem = $$props.autofocusFirstItem);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("id" in $$props) $$invalidate(7, id = $$props.id);
    		if ("invalid" in $$props) $$invalidate(8, invalid = $$props.invalid);
    		if ("dropdownElement" in $$props) $$invalidate(10, dropdownElement = $$props.dropdownElement);
    		if ("buttonElement" in $$props) $$invalidate(11, buttonElement = $$props.buttonElement);
    		if ("dropdownMenuElement" in $$props) $$invalidate(12, dropdownMenuElement = $$props.dropdownMenuElement);
    		if ("className" in $$props) $$invalidate(9, className = $$props.className);
    		if ("lastMouseDownTarget" in $$props) lastMouseDownTarget = $$props.lastMouseDownTarget;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isOpen*/ 1) {
    			 if (isOpen) open(); else close();
    		}
    	};

    	return [
    		isOpen,
    		dataTest,
    		btnClass,
    		dropdownClass,
    		noCaret,
    		disabled,
    		label,
    		id,
    		invalid,
    		className,
    		dropdownElement,
    		buttonElement,
    		dropdownMenuElement,
    		closeIfAnyClickCloses,
    		toggle,
    		keydown,
    		btnTitle,
    		anyItemClickCloses,
    		icon,
    		autofocusFirstItem,
    		$$scope,
    		$$slots,
    		a_binding,
    		div_binding,
    		div_binding_1
    	];
    }

    class QuickDropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			btnTitle: 16,
    			isOpen: 0,
    			dataTest: 1,
    			btnClass: 2,
    			dropdownClass: 3,
    			anyItemClickCloses: 17,
    			noCaret: 4,
    			icon: 18,
    			autofocusFirstItem: 19,
    			disabled: 5,
    			label: 6,
    			id: 7,
    			invalid: 8,
    			class: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuickDropdown",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get btnTitle() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set btnTitle(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataTest() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataTest(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get btnClass() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set btnClass(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropdownClass() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropdownClass(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anyItemClickCloses() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anyItemClickCloses(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noCaret() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noCaret(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autofocusFirstItem() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autofocusFirstItem(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<QuickDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<QuickDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ColorPicker.svelte generated by Svelte v3.24.1 */
    const file$5 = "src\\components\\ColorPicker.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (11:1) <span slot="label">
    function create_label_slot(ctx) {
    	let span;
    	let div;

    	const block = {
    		c: function create() {
    			span = element("span");
    			div = element("div");
    			attr_dev(div, "data-test", name);
    			attr_dev(div, "class", "color-choice svelte-1xypr23");
    			set_style(div, "background", getBackground(/*value*/ ctx[0]));
    			attr_dev(div, "title", "Change color");
    			add_location(div, file$5, 11, 2, 447);
    			attr_dev(span, "slot", "label");
    			add_location(span, file$5, 10, 1, 424);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, div);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1) {
    				set_style(div, "background", getBackground(/*value*/ ctx[0]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_label_slot.name,
    		type: "slot",
    		source: "(11:1) <span slot=\\\"label\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if value == color}
    function create_if_block$3(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { data: checkIcon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(17:4) {#if value == color}",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#each colors as color}
    function create_each_block$1(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*value*/ ctx[0] == /*color*/ ctx[4] && create_if_block$3(ctx);

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[3](/*color*/ ctx[4], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "color-choice svelte-1xypr23");
    			set_style(div, "background", getBackground(/*color*/ ctx[4]));
    			toggle_class(div, "selected", /*value*/ ctx[0] == /*color*/ ctx[4]);
    			add_location(div, file$5, 15, 3, 635);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*value*/ ctx[0] == /*color*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*value*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*value, colors*/ 5) {
    				toggle_class(div, "selected", /*value*/ ctx[0] == /*color*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(15:2) {#each colors as color}",
    		ctx
    	});

    	return block;
    }

    // (10:0) <QuickDropdown btnClass="color-picker-toggle" noCaret anyItemClickCloses>
    function create_default_slot$1(ctx) {
    	let t;
    	let div;
    	let current;
    	let each_value = /*colors*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "color-picker-choices svelte-1xypr23");
    			add_location(div, file$5, 13, 1, 569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*getBackground, colors, value, select, checkIcon*/ 7) {
    				each_value = /*colors*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(10:0) <QuickDropdown btnClass=\\\"color-picker-toggle\\\" noCaret anyItemClickCloses>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let quickdropdown;
    	let current;

    	quickdropdown = new QuickDropdown({
    			props: {
    				btnClass: "color-picker-toggle",
    				noCaret: true,
    				anyItemClickCloses: true,
    				$$slots: {
    					default: [create_default_slot$1],
    					label: [create_label_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(quickdropdown.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(quickdropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const quickdropdown_changes = {};

    			if (dirty & /*$$scope, value*/ 129) {
    				quickdropdown_changes.$$scope = { dirty, ctx };
    			}

    			quickdropdown.$set(quickdropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quickdropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quickdropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quickdropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getBackground(color) {
    	return color != "transparent"
    	? color
    	: "repeating-linear-gradient(-45deg, transparent, #eee 10px)";
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { value = "transparent" } = $$props;

    	function select(color) {
    		$$invalidate(0, value = color);
    	}

    	// random collection of colors kids requested.. lazy
    	const colors = [
    		"transparent",
    		"white",
    		"rgb(204, 204, 204)",
    		"rgb(160, 164, 160)",
    		"rgb(102, 102, 102)",
    		"rgb(51, 51, 51)",
    		"black",
    		"rgb(119, 59, 11)",
    		"blue",
    		"pink",
    		"yellow",
    		"orange",
    		"purple",
    		"teal",
    		"green",
    		"rgb(40, 40, 184)",
    		"rgb(40, 80, 224)",
    		"rgb(80, 80, 248)",
    		"rgb(120, 124, 248)",
    		"rgb(160, 0, 16)",
    		"red",
    		"rgb(248, 0, 32)",
    		"rgb(208, 124, 96)",
    		"rgb(248, 208, 176)",
    		"rgb(253, 240, 232)",
    		"rgb(245, 222, 208)",
    		"rgb(220, 201, 187)",
    		"rgb(197, 179, 167)",
    		"rgb(186, 167, 153)",
    		"rgb(146, 129, 119)",
    		"rgb(120, 107, 99)",
    		"rgb(80, 68, 68)",
    		"rgb(122, 80, 55)",
    		"rgb(178, 105, 58)",
    		"rgb(203, 140, 97)",
    		"rgb(238, 187, 155)",
    		"rgb(75, 53, 39)"
    	];

    	const writable_props = ["value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColorPicker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ColorPicker", $$slots, []);
    	const click_handler = color => select(color);

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		QuickDropdown,
    		Icon,
    		checkIcon,
    		value,
    		select,
    		getBackground,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, select, colors, click_handler];
    }

    class ColorPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorPicker",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get value() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\FieldText.svelte generated by Svelte v3.24.1 */
    const file$6 = "src\\pages\\LevelBuilder\\components\\FieldText.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let label;
    	let t;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			if (default_slot) default_slot.c();
    			t = space();
    			input = element("input");
    			attr_dev(label, "for", /*name*/ ctx[1]);
    			add_location(label, file$6, 1, 1, 27);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			add_location(input, file$6, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			append_dev(div, t);
    			append_dev(div, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding*/ ctx[7](input);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(label, "for", /*name*/ ctx[1]);
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(input, "name", /*name*/ ctx[1]);
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(input, "id", /*name*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*input_binding*/ ctx[7](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { value = null } = $$props;
    	let { name = "text" } = $$props;
    	let { autofocus = false } = $$props;
    	let field;

    	onMount(() => {
    		if (autofocus) field.focus();
    	});

    	const writable_props = ["value", "name", "autofocus"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldText> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldText", $$slots, ['default']);

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			field = $$value;
    			$$invalidate(2, field);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("autofocus" in $$props) $$invalidate(3, autofocus = $$props.autofocus);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, value, name, autofocus, field });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("autofocus" in $$props) $$invalidate(3, autofocus = $$props.autofocus);
    		if ("field" in $$props) $$invalidate(2, field = $$props.field);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		name,
    		field,
    		autofocus,
    		$$scope,
    		$$slots,
    		input_input_handler,
    		input_binding
    	];
    }

    class FieldText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { value: 0, name: 1, autofocus: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldText",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FieldText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<FieldText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<FieldText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autofocus() {
    		throw new Error("<FieldText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autofocus(value) {
    		throw new Error("<FieldText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\SaveBtn.svelte generated by Svelte v3.24.1 */

    const file$7 = "src\\pages\\LevelBuilder\\components\\SaveBtn.svelte";

    // (2:7) Save
    function fallback_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Save");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(2:7) Save",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let button;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-success");
    			toggle_class(button, "disabled", /*disabled*/ ctx[0]);
    			add_location(button, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}

    			if (dirty & /*disabled*/ 1) {
    				toggle_class(button, "disabled", /*disabled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { disabled = false } = $$props;
    	const writable_props = ["disabled"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SaveBtn> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SaveBtn", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("disabled" in $$props) $$invalidate(0, disabled = $$props.disabled);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ disabled });

    	$$self.$inject_state = $$props => {
    		if ("disabled" in $$props) $$invalidate(0, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [disabled, $$scope, $$slots];
    }

    class SaveBtn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { disabled: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SaveBtn",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get disabled() {
    		throw new Error("<SaveBtn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<SaveBtn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\Form.svelte generated by Svelte v3.24.1 */
    const file$8 = "src\\pages\\LevelBuilder\\components\\Form.svelte";
    const get_buttons_slot_changes = dirty => ({});
    const get_buttons_slot_context = ctx => ({});

    function create_fragment$a(ctx) {
    	let form;
    	let div2;
    	let div0;
    	let savebtn;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;

    	savebtn = new SaveBtn({
    			props: { disabled: !/*hasChanges*/ ctx[0] },
    			$$inline: true
    		});

    	const buttons_slot_template = /*$$slots*/ ctx[2].buttons;
    	const buttons_slot = create_slot(buttons_slot_template, ctx, /*$$scope*/ ctx[1], get_buttons_slot_context);
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(savebtn.$$.fragment);
    			t0 = space();
    			if (buttons_slot) buttons_slot.c();
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "card-header flex");
    			add_location(div0, file$8, 2, 2, 56);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file$8, 6, 2, 167);
    			attr_dev(div2, "class", "card");
    			add_location(div2, file$8, 1, 1, 34);
    			add_location(form, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div2);
    			append_dev(div2, div0);
    			mount_component(savebtn, div0, null);
    			append_dev(div0, t0);

    			if (buttons_slot) {
    				buttons_slot.m(div0, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const savebtn_changes = {};
    			if (dirty & /*hasChanges*/ 1) savebtn_changes.disabled = !/*hasChanges*/ ctx[0];
    			savebtn.$set(savebtn_changes);

    			if (buttons_slot) {
    				if (buttons_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(buttons_slot, buttons_slot_template, ctx, /*$$scope*/ ctx[1], dirty, get_buttons_slot_changes, get_buttons_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(savebtn.$$.fragment, local);
    			transition_in(buttons_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(savebtn.$$.fragment, local);
    			transition_out(buttons_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(savebtn);
    			if (buttons_slot) buttons_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { hasChanges = true } = $$props;
    	const writable_props = ["hasChanges"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Form", $$slots, ['buttons','default']);

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("hasChanges" in $$props) $$invalidate(0, hasChanges = $$props.hasChanges);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ SaveBtn, hasChanges });

    	$$self.$inject_state = $$props => {
    		if ("hasChanges" in $$props) $$invalidate(0, hasChanges = $$props.hasChanges);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hasChanges, $$scope, $$slots, submit_handler];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { hasChanges: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get hasChanges() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasChanges(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const pngScale = 2;
    function toPNG(data, width, height) {
    	const canvas = document.createElement('canvas');
    	canvas.width = width * pngScale;
    	canvas.height = height * pngScale;
    	const ctx = canvas.getContext('2d');
    	for (let y = 0; y < data.length; y++) {
    		for (let x = 0; x < data[y].length; x++) {
    			const color = data[y][x];
    			if (color == null || color == 'transparent') continue

    			ctx.beginPath();
    			ctx.rect(x * pngScale, y * pngScale, pngScale, pngScale);
    			ctx.fillStyle = color;
    			ctx.fill();
    		}
    	}

    	return canvas.toDataURL('image/png')
    }

    // import LocalStorageStore from 'LocalStorageStore'

    function LocalStorageStore(key, defaultValue) {
    	const valueFromStorage = localStorage.getItem(key);
    	const initialValue =
    		valueFromStorage != null && valueFromStorage != 'null' && valueFromStorage != 'undefined' ? JSON.parse(valueFromStorage) : defaultValue;
    	const { subscribe, set, update } = writable(initialValue);
    	return {
    		subscribe,
    		set: function (value) {
    			set(value);
    			localStorage.setItem(key, JSON.stringify(value));
    		},
    	}
    }

    var artStore = LocalStorageStore('pixel-drawings', {
    	spike: {
    		name: 'spike',
    		gridSize: 20,
    		width: 20,
    		height: 20,
    		data: [
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				'black',
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'black',
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'black',
    				'black',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(204, 204, 204)',
    				'rgb(204, 204, 204)',
    				'rgb(160, 164, 160)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAA4klEQVRYR+2WMRKDMAwE4TcpKP0cCp5Gkee4pOA3ZKKJCnlIButMRiRHbWtOq9Phvgv+9cH1dRSITogESRAlgN6nB0kQJYDepwd/keD2akqmG3HEsEAtoNNr1eRuXU9xCkQ9SIIkWBnOYpn5Psu1aZxMOkTY4mYCpVDO2QBKKXnz0Cyb1l3WxZCsIfifAsuJhCPYQuDuaNV4qAdL72ld3eYjHryWQPXIcBukWQdBEyvvMtNNMJJAk1Oa9NpxBILXEFiSAwge8l7NFn8s6BgxBZpE+CbB8glf+Zw79/jzTxJa4AMeMqIZTWbVDQAAAABJRU5ErkJggg==',
    		selectedColor: null,
    	},
    	'mr smiley': {
    		name: 'mr smiley',
    		gridSize: 20,
    		width: 27,
    		height: 45,
    		data: [
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 0, 16)',
    				'rgb(160, 0, 16)',
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				'rgb(160, 0, 16)',
    				'rgb(160, 0, 16)',
    				'rgb(160, 0, 16)',
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    				null,
    				'rgb(160, 0, 16)',
    				'rgb(160, 0, 16)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'white',
    				'white',
    				'white',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'white',
    				'white',
    				'white',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'white',
    				'blue',
    				'white',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'white',
    				'blue',
    				'white',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'white',
    				'white',
    				'white',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'white',
    				'white',
    				'white',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(253, 240, 232)',
    				null,
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				'rgb(253, 240, 232)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(119, 59, 11)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(119, 59, 11)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				null,
    				null,
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'yellow',
    				'yellow',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'yellow',
    				'yellow',
    				'yellow',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				null,
    				null,
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				null,
    				null,
    				null,
    				null,
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				null,
    				null,
    				null,
    				null,
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				'yellow',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'yellow',
    				'yellow',
    				'yellow',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAABaCAYAAADzc6X8AAADIUlEQVR4Xu2aUVLjMAyGE/rIztC35S5wmL0FewS4BYdZ7sK+dWfgsZTZUFFHsfNbstw6jvvWsaPo1yfJTpy+M/o9d9vDf1O/ul1vZDLJjJkTxQkjh3h4pJEPCUOC0Tj3K+Qvn9dXKwxFJJZcbmIcAPJrUmNSAxSY4oU5BIcuV+AvquHNTVqXsP3u9SwQN9vb0H3yEFuysFEKnksISgMPwVlyvsG6hZVCKkTSIeglFyRWk7AiUzCCGE0ZQXL/1C3sUil4dfPTC+fj39/ZhhnqlhNiTdgxjtpIcwxkpz+G+nAsDESM7PAumUysemHaSFPEUwPEa82MWLXCeM1QbfBI5m5OdD8zYtUJi90Z5CbFu2MysdUKsyJFtYPsmdUYIoYcQQ+YPMWQPbUwaeSQI03Y8eUOClQyMYp06EYzb5mGS5GDnj1g1HVN2Lmag9V91MSkXSq2ORQnDNWaVph2j2lGrDphoa7FCaHul6t7Ju8VUx1LvT4U4GRhqOhjawyRRXbM33ksRliuZoAirh2Pfq9YozDStIhX3ei8bDHnYzxVNcKKJCc9k47+aiC1HWubQ8RGIO7gb797HWpss72lC1SfRUgDgRZqJzC6rwaqF+akQFSEnIiqCEuJOMsSz7BhaOI0EVu8MC7E01aFxOhkC7ULOsZA8/zjCEC/WmFygrHEuGU/QRT4EG9IbDXCwo8p/lP/2Ara7+a/Doi1Q/PExFYjbLNNI3VajwojVqwwae5O14+8xJw968hV1C2Fi+9wmDDaMuUmdjZh0z2aDbETjrQdyXdXlKZi9cK6TrvDQKG8MLEmDAGajDdisyETt/uTtVZjwmS8eCqSv9bkmrBcNWZNzIZU8s7DvokUJyyVnK0gQ2KVC3u4ux4eZ55e3maL+uHuxzD+9PKesIbiFcTMePXCcCy/ZiyOWDXCKAVjBfF5ucgl19jqhHESoQA8/nkfQez76dGWJhuyEVuMsMOh855U/r6/9gYUCeOkQlS0BKOJVScsJEgbYam9772fsPYgMakjKHWk9powlkKNGFpLUAqi60MpqrVrRkzrgPM0511OtHY/AW2GbGVZOM1XAAAAAElFTkSuQmCC',
    		selectedColor: 'black',
    	},
    	'mr squiggles': {
    		name: 'mr squiggles',
    		gridSize: 20,
    		width: 27,
    		height: 27,
    		data: [
    			[
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'black',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'black',
    				'black',
    				'black',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'transparent',
    				null,
    				'transparent',
    				'black',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'black',
    				'black',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'black',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				'transparent',
    				null,
    				'transparent',
    				'transparent',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'black',
    				'transparent',
    				null,
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				'black',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'black',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				'black',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				null,
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'white',
    				'white',
    				'white',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'white',
    				'white',
    				'white',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'black',
    				'black',
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'white',
    				'blue',
    				'white',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'white',
    				'blue',
    				'white',
    				'rgb(245, 222, 208)',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'white',
    				'white',
    				'white',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'white',
    				'white',
    				'white',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'black',
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				'black',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'rgb(245, 222, 208)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'black',
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				'black',
    				'black',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAB4UlEQVRoQ+2ZzVHEMAyFkytUAQ1A/1VAA1AFXHeHnZiJPbKfnqXEjsccyUrWp6cfZ3dd2v3dkqNXz1BcnZGBdQvmFZiXnyivFsW8AvLy4waWVl4IsDZZVvsJRs6CxaukXJSrLRsJ+vJgKUAKySYr54/1Y+6x4cBcan+XVq/SFWcBI/cEA+P0UKXC2S0UGx6MSSq7UxfGuVePefkpwv6BaQ/y2jfa82iV9gYTTEifNfNW+5yiD7+MYl2/pqSLvwbMa1x3p9jwYMyqKL3mWP2ILWIpRWtA3ZQiel0x7Z2CMZtAeipeFgxdjB9gP18fRykT+X1+fUfxqPcYcnQ5sACEmrl3sCj+fWMOD5YrSVGxp5c3sdZ/vz+LvYjsiB4TLwySYsOBpb0WZTw3DUPm1y1Fty1/WsVydjvF0BQW95z0T3FfjQAm3r0QWGqkVSxnR/SYqKjmulIc82gI5OoI2TUHQw2Q9or25jLBMpk1l+JUbMtAT6UY7TdtYEhJ9FzYY5rq+nfLfLjVJRi9dVSPe0ox4sagutnUTkd3xYYH0/ZiSETu890pdjmw0BjawNH0Q89PU2xEMGo6IiXQ8zP32LBgrb4wPWdBoxI68Dmzc6Mf17WKUAc4gKK44HceyEFVSbQCuwMajf4t67dIAAAAAABJRU5ErkJggg==',
    		selectedColor: null,
    	},
    	sonic: {
    		name: 'sonic',
    		gridSize: 30,
    		width: 20,
    		height: 34,
    		data: [
    			[
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				'transparent',
    				'blue',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'white',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'green',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'green',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'white',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'blue',
    				'blue',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'blue',
    				'blue',
    				'transparent',
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				null,
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(80, 80, 248)',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(248, 0, 32)',
    				'white',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				null,
    				null,
    				null,
    				null,
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'white',
    				'rgb(248, 0, 32)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'white',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				null,
    				null,
    				null,
    				null,
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'white',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'white',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				null,
    				null,
    				null,
    				null,
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'white',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				'rgb(248, 0, 32)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(248, 0, 32)',
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABECAYAAADzyHdMAAACnElEQVRoQ+2avU7DMBDHHTG0Y8eOVKrEhMTWiQ32dONBWNhgYuEheAHU7rAxdUNiAalSGRk7pgMqksM1+BL7znaS2lFZaBJ//O/nO985bSJ2f9tt8ZnzKUk4rXzb/JskeIHY1lxwmm6UB/N5TwOlGaKGZQpeIICqFgpP/YmCa1WvAMPRgxeokoQr8M2Hm1d56/r+XP7nE80NXy5eZL/x5LISFoNgNAKrfRIIjicXsgE/6vPxaiQYuUCQryOpi/rWCLYg0C7V6XwN39fl4iLazRnIORe3KNBMjkvEtmqxIBi8QJ3tqnBbkrOZWvVMp2pVBM8LD7TOxcELNKc4yud2hO7yOEzfMrWuPOvn17dQyFsTjEagm9AWfBAvop1PtiDQTtDT45pyy8rnR4Mhvq+UgOSZBHpT28zeBWIzsWAQCER+1t8soqvPd9nOoaK2yzB7EGgGkKaZ3MCgoh6dnMoOFT6lDITJehDsqECW4wkhKHIwjsWpTp1at8TBCBRCDSI4W3AF6qLWuClyB8/bRSawbFw9b7ucfRATDE7gcvEs90F4J6NLdUeDoQcEIZw7BysQhMGSUgShnStJa4LRCOSSA4LczOG9D3J9D0/UuEDXpcUE4br2TNJ5gRDF2FCKJDuKfQk2JlAnDHyJe1jC+yAeV+ebJMHoBVIkdRlERxCT9CbYukDKN6DU1xW35W+azHUhNV+JINUheIFADgudz/t/xuIDv19lbU3wIBA5d3wEqaOnLkj0Prh7R0BuaVVzW3eKTmBBDttfTzR7E+yQQDdfbJFgQwIzcaz8pusq/ZAzcb+txK9IMjFSnLUvvoyQSILBCQRBve1KWrpJVItxrFIEsIG4P54Hj1ciGJxAWwvrIshdoeQgEO0CsAKdIfgLCkBMvzJTY90AAAAASUVORK5CYII=',
    		selectedColor: null,
    	},
    	lava: {
    		name: 'lava',
    		gridSize: 20,
    		width: 20,
    		height: 20,
    		data: [
    			[
    				null,
    				null,
    				null,
    				'black',
    				null,
    				'black',
    				'black',
    				null,
    				'black',
    				'orange',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'orange',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				null,
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				null,
    				'orange',
    				'orange',
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				null,
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'red',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'red',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'red',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'red',
    				'orange',
    				'red',
    				'red',
    				'red',
    				'orange',
    				'red',
    				'red',
    				'red',
    				'red',
    				'red',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'orange',
    				'orange',
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				'orange',
    				'orange',
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'red',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'red',
    				'red',
    				'red',
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'red',
    				'red',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'red',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'orange',
    				'red',
    				'red',
    				'red',
    				'orange',
    				'red',
    				'red',
    				'red',
    				'red',
    				'red',
    				'red',
    				'red',
    				'red',
    				'red',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'orange',
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				'orange',
    				null,
    				'orange',
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'orange',
    				null,
    				'orange',
    				'orange',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABUklEQVRYR+2Y6w7DIAiF9Tn7fH3OLplCVwwFTqqhyfpnmQp8PYKX1qI/R++q/Zf+k8Wl/dhbc90GhzTuJpTedWecC/DYyxcoqsCP3a1S3nFSS3aaFpDArASpW7kohCoi42jxKV59HSCRR8HleOlHzgApKWdi8GM59k695ecxQBTIskP73TnIq3MvFm8KoGAcb1UgFDSsIBoItRsBaS/teys71trRyNJO8f9CQHqz2YppyovTkJ6Df0AjebtA+RQUKTYfEE2VZQpOA3xqfUNXBVPB9IDo1FgvFvQ7v0icW5r2XiegvM/KvdhSxtsPK5gWsLT7MD+acuMXg2biVTqoXOEqTg/YvygQMStiKab1a7kIKj0WCTlKB+itwlnjlCLNcydJA2jlrsjV9QqmAQyCDKk9/TSzHHDVVug+8munEGr3LrzosgRP8dMLuLHzxKt4MeAHXvTgyYlXUs8AAAAASUVORK5CYII=',
    	},
    	'sonic spinning': {
    		name: 'sonic spinning',
    		gridSize: 30,
    		width: 27,
    		height: 34,
    		data: [
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				null,
    				'transparent',
    				'blue',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'rgb(80, 80, 248)',
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'white',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'green',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'green',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'white',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'white',
    				'blue',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'black',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'black',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(220, 201, 187)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'blue',
    				'blue',
    				'blue',
    				'blue',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				null,
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'red',
    				null,
    				null,
    				'red',
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'red',
    				null,
    				'red',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'red',
    				null,
    				'red',
    				'red',
    				null,
    				null,
    				null,
    				null,
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				'red',
    				null,
    				'red',
    				'red',
    				null,
    				'transparent',
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'red',
    				'red',
    				'red',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'rgb(253, 240, 232)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'red',
    				'red',
    				'red',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'red',
    				'red',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'rgb(220, 201, 187)',
    				'blue',
    				'blue',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'red',
    				'red',
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'red',
    				'red',
    				'red',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'blue',
    				'blue',
    				'transparent',
    				'transparent',
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'red',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'red',
    				'red',
    				'red',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'blue',
    				'blue',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'red',
    				'red',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'red',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'blue',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				null,
    				'transparent',
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'transparent',
    				null,
    				'rgb(80, 80, 248)',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'rgb(80, 80, 248)',
    				'rgb(80, 80, 248)',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAABECAYAAADKr8YXAAADOElEQVRoQ+2asW7bMBCGJWRoxoxZCwTIVKBbpm7tLr9Ll27p1KUP0RcorD3dOnkr0KlAgqwdMyZD4AKUf8s86hfvKNWWqRgBAks0yf8+3vF4UlmM/Kmqx3VXl3V9Wo48VG93ow+WrbAYFSn8f5EcndhshTHhY5PcO7GDCWPOjwnV9avYatvcLwcZDfNI9cFg8OyE2df42u1XVfXkEeREbQTt8/EX0paYvaMjE2Zf090C4z6pI5jqawGxbITZlyALig05fOB7Xz/9dJc+fnnn/ut9sOnvdvXD/e7i6oMpypbZClNuSoZmvs+B2MXVe9eHPoo2QyYTM8xY2XRmwmAVRo5F0ckTm6ywMMj054zMl+R1tr7b6Knb72Q/6hCaoTA/GMh9SEtAGXm2zfZALDNh8Y27O9PQklkufR9dLPxTAu63HmbzNepj2QmLC5JM0shtiXxubFv9evQ6rt+eNt+vkYIOJPYiLHAmG7m9+5idGBRmI8wm5Pu3B23A9NqdnJ0nJRXRKhU/UR+JMPsS9IVJs8qMBMQkgeeHv70k7//8dvfNJ2j0mr0wLL3U6pA0FE7Qry/fdPrO3ohlLywphO38CMQZsVj/qb6FfkeoK3ZPMVthReFHTdQuYqTaEoKtjkg3u6HBIpzwTISFwm3Z+u3qxqX52M/k94MRO5gwuf/YH074U4dFUbNnueLJ2bmqoIT+pIFYRkJzxeyEDSUnLRsjhvEYOSupYB8Lk9jm1SEruckJWxeFE1K6v/bDrrP9SOtb8vcy00glFRCbjTAI3bFAb/RKXYLoH8TYSmDRjyUW28lKYi/CNiYeSgxRUfYTOzlPntjkhDFS8BVtdUqbgcS2JRAc7GOTFwZLyKCRGhWlZWXNI5ZxsOjIik7S14IQPjthi8p/GgKLLuvNU5HNhbvVDTO2u463BtpGtnMZi4LJxLIThtyRvaApiYGENESbTMsKcjcxNp5MyqP7GAse2QiTDoJgol2KqcSsJfZY++ixPHthjISMjoxsWDrHWwO2qNgbcnduqollJwyCZPRhUUtrUWvJgc2DjRclNjth2lxOtmOktBmFdkUkE8tGmHWNx4SP9YBxsI8dm7B/1Ud5oDCPFzoAAAAASUVORK5CYII=',
    		selectedColor: 'black',
    	},
    	dirt: {
    		name: 'dirt',
    		gridSize: 25,
    		width: 20,
    		height: 20,
    		data: [
    			[
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    			],
    			[
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    			],
    			[
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    			],
    			[
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(119, 59, 11)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    			],
    			[
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(102, 102, 102)',
    				'rgb(51, 51, 51)',
    				'rgb(51, 51, 51)',
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    				'rgb(119, 59, 11)',
    				'rgb(102, 102, 102)',
    				'rgb(119, 59, 11)',
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABsklEQVRYR9VYMU7FMBRrNyQmboHEmJGVW7D3CpyIW3CFjl/iFqxsICo5Ut1afslH0fssqP1J67h+sfPmUsrPNE3Ty93n37/69/H9uLsupeyucbGu6+l9jFe/n046uTmnB7gsy8bgw+V9w//19Lpbh2PAMcVfRjHH78W4OT1AfOKoJkaPqxoc/eLo++ondlqDlqAVN14BcJrlebcL0K0UjPJ+yffVc9R8MIh5ksE0AHurGAvA/snaYWaVJpW2K4M3A5C9NuqxTgqsKefhzGjdB9MDxMpcFbL2eqvYaRLPPThJOoBvz/dbmolWXdSiotp0TM7pAXLcckwqDbI0nNMwc8rjD3kwHUDeqHu147zVJWtFzKGK0wNkbbg0gvHQELwZjDhmbRU7L04DkIFErS+6L7px6tx98GKEhDQAr92o1cpbz9n8HMy/2kmGAVSJ2PVsotrqPQVWBtMCbG0eMROtXa9Wxpu7W8MBtlaxSynsIKprFT3zNFfxcICcB6M5zXkomOwNH7I/mA4gqphX6j4lFqJOdZyQXapR1iq9OB3A/+rnRTsJqrfDudJ2WHtF7tJQFOAvGBMZIZx0RXEAAAAASUVORK5CYII=',
    	},
    	grass: {
    		name: 'grass',
    		gridSize: 20,
    		width: 20,
    		height: 20,
    		data: [
    			[
    				null,
    				null,
    				null,
    				null,
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				null,
    				null,
    				null,
    				'green',
    				'green',
    				null,
    				null,
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'rgb(160, 164, 160)',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 164, 160)',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 164, 160)',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'green',
    				'green',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				'rgb(160, 164, 160)',
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAxUlEQVRYR+2YwQ2AIBAEoRcLsxRL4WFZ9qIfDyPJ4XkbCZj1K3sMw/oxhs6f2DlfICB6Q+0NLmG/QS/1WxwAUE6kneTpxOV70WOdp3XgzMcwDCDa5o/yl8GPNkDHEpAGUQNonh2kQdQAmmcHaRA1gObZQRpEDaB5dpAGUQNo3t3BNKXq3vM2Q2wyfxzAJyOlDs1QOcdqUstlg90CpjXd/zYZm+M1Yxyfl8XfAYo5a9fQ6rw2OAyglEQMaeCyzvvVuw22AjwAxfCRmReHFroAAAAASUVORK5CYII=',
    	},
    	alien: {
    		name: 'alien',
    		gridSize: 15,
    		width: 11,
    		height: 9,
    		data: [
    			[
    				'transparent',
    				'transparent',
    				'green',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'green',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'transparent',
    				'transparent',
    				'green',
    				'green',
    				'transparent',
    				'transparent',
    				'transparent',
    				'green',
    				'green',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'transparent',
    				'transparent',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'transparent',
    				'transparent',
    				'green',
    				'',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'transparent',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'transparent',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'green',
    				'green',
    				'green',
    				'rgb(248, 208, 176)',
    				'green',
    				'green',
    				'green',
    				'rgb(248, 208, 176)',
    				'green',
    				'green',
    				'green',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'transparent',
    				'green',
    				'green',
    				'rgb(248, 208, 176)',
    				'green',
    				'green',
    				'green',
    				'rgb(248, 208, 176)',
    				'green',
    				'green',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'transparent',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'green',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'transparent',
    				'transparent',
    				'transparent',
    				'green',
    				'transparent',
    				'transparent',
    				'transparent',
    				'green',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'transparent',
    				'transparent',
    				'green',
    				'green',
    				'transparent',
    				'transparent',
    				'transparent',
    				'green',
    				'green',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'',
    				'',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'',
    				'',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				'',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    			[
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				'transparent',
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    				null,
    			],
    		],
    		showGrid: true,
    		png:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAAk0lEQVQ4T8WUQQ7AIAgE4dbn+SSf5PN6axPFmqAbNMXWI+hm2OAy6RPpyqVI3PVGBXC/f7xduNIh8goA7mHi18JodE2EDNcTyTumz4RnSfttKrZCYndhRXCGlCtHCkN3rX7z2F24rVX5cXIsItiXLWl7rLzdJjyVE+PsyLCQ2E94NeWMsMLRaKXcsrCRWs9gf6XbDZSSWQ14Oz5nAAAAAElFTkSuQmCC',
    	},
    });

    /* src\pages\LevelBuilder\components\Art.svelte generated by Svelte v3.24.1 */
    const file$9 = "src\\pages\\LevelBuilder\\components\\Art.svelte";

    // (1:0) {#if graphic != null && graphic.png != null}
    function create_if_block$4(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;
    	let img_style_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*graphic*/ ctx[1].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*graphic*/ ctx[1].name);
    			attr_dev(img, "title", img_title_value = /*graphic*/ ctx[1].name);

    			attr_dev(img, "style", img_style_value = "transform: rotate(" + /*rotation*/ ctx[2] + "deg); " + (/*height*/ ctx[0] != null
    			? "max-height: " + /*height*/ ctx[0] + "px"
    			: ""));

    			add_location(img, file$9, 1, 1, 47);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*graphic*/ 2 && img.src !== (img_src_value = /*graphic*/ ctx[1].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*graphic*/ 2 && img_alt_value !== (img_alt_value = /*graphic*/ ctx[1].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*graphic*/ 2 && img_title_value !== (img_title_value = /*graphic*/ ctx[1].name)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*rotation, height*/ 5 && img_style_value !== (img_style_value = "transform: rotate(" + /*rotation*/ ctx[2] + "deg); " + (/*height*/ ctx[0] != null
    			? "max-height: " + /*height*/ ctx[0] + "px"
    			: ""))) {
    				attr_dev(img, "style", img_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(1:0) {#if graphic != null && graphic.png != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;
    	let if_block = /*graphic*/ ctx[1] != null && /*graphic*/ ctx[1].png != null && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*graphic*/ ctx[1] != null && /*graphic*/ ctx[1].png != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $artStore;
    	validate_store(artStore, "artStore");
    	component_subscribe($$self, artStore, $$value => $$invalidate(6, $artStore = $$value));
    	let { name } = $$props;
    	let { height = null } = $$props;
    	let { spin = false } = $$props;
    	let graphic;
    	let spinTimeout;
    	let rotation = 0;
    	const writable_props = ["name", "height", "spin"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Art> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Art", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(3, name = $$props.name);
    		if ("height" in $$props) $$invalidate(0, height = $$props.height);
    		if ("spin" in $$props) $$invalidate(4, spin = $$props.spin);
    	};

    	$$self.$capture_state = () => ({
    		toPNG,
    		artStore,
    		name,
    		height,
    		spin,
    		graphic,
    		spinTimeout,
    		rotation,
    		$artStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(3, name = $$props.name);
    		if ("height" in $$props) $$invalidate(0, height = $$props.height);
    		if ("spin" in $$props) $$invalidate(4, spin = $$props.spin);
    		if ("graphic" in $$props) $$invalidate(1, graphic = $$props.graphic);
    		if ("spinTimeout" in $$props) $$invalidate(5, spinTimeout = $$props.spinTimeout);
    		if ("rotation" in $$props) $$invalidate(2, rotation = $$props.rotation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name, $artStore, graphic*/ 74) {
    			 if (name != null) {
    				$$invalidate(1, graphic = $artStore[name]);

    				// set png for any that haven't been saved with png yet
    				if (graphic != null && graphic.png == null) {
    					$$invalidate(1, graphic.png = toPNG(graphic, graphic.width, graphic.height), graphic);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*spin, rotation, spinTimeout*/ 52) {
    			 if (spin) {
    				$$invalidate(5, spinTimeout = setTimeout(
    					() => {
    						$$invalidate(2, rotation += 30);
    					},
    					25
    				));
    			} else {
    				clearTimeout(spinTimeout);
    			}
    		}
    	};

    	return [height, graphic, rotation, name, spin];
    }

    class Art extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { name: 3, height: 0, spin: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Art",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[3] === undefined && !("name" in props)) {
    			console.warn("<Art> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Art>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Art>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Art>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Art>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Art>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Art>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\LevelBuilderLayout.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$2 } = globals;
    const file$a = "src\\pages\\LevelBuilder\\components\\LevelBuilderLayout.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (5:3) {#if t.name == tab}
    function create_if_block$5(ctx) {
    	let div;
    	let a;
    	let t0;
    	let a_href_value;
    	let t1;
    	let t2;
    	let current;
    	let each_value_1 = Object.keys(/*store*/ ctx[2]).sort();
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t0 = text("+ New");
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(a, "href", a_href_value = "" + (baseUrl + "/" + /*t*/ ctx[6].name + "/new"));
    			attr_dev(a, "class", "sub-nav-item svelte-ia3x4d");
    			toggle_class(a, "new", /*store*/ ctx[2][/*activeName*/ ctx[1]] == null);
    			add_location(a, file$a, 6, 5, 242);
    			attr_dev(div, "class", "sub-nav svelte-ia3x4d");
    			add_location(div, file$a, 5, 4, 214);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t0);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*store, activeName*/ 6) {
    				toggle_class(a, "new", /*store*/ ctx[2][/*activeName*/ ctx[1]] == null);
    			}

    			if (dirty & /*baseUrl, tabs, Object, store, activeName, tab*/ 15) {
    				each_value_1 = Object.keys(/*store*/ ctx[2]).sort();
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(5:3) {#if t.name == tab}",
    		ctx
    	});

    	return block;
    }

    // (13:8) {#if tab == 'levels'}
    function create_if_block_1$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*store*/ ctx[2][/*name*/ ctx[9]].thumbnail)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "level-thumbnail svelte-ia3x4d");
    			add_location(img, file$a, 13, 9, 678);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*store*/ 4 && img.src !== (img_src_value = /*store*/ ctx[2][/*name*/ ctx[9]].thumbnail)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(13:8) {#if tab == 'levels'}",
    		ctx
    	});

    	return block;
    }

    // (8:5) {#each Object.keys(store).sort() as name}
    function create_each_block_1$1(ctx) {
    	let a;
    	let art;
    	let t0;
    	let div;
    	let span;
    	let t1_value = /*name*/ ctx[9] + "";
    	let t1;
    	let t2;
    	let a_href_value;
    	let current;

    	art = new Art({
    			props: {
    				name: /*tab*/ ctx[0] == "art"
    				? /*name*/ ctx[9]
    				: /*store*/ ctx[2][/*name*/ ctx[9]][/*t*/ ctx[6].graphicKey],
    				height: "20"
    			},
    			$$inline: true
    		});

    	let if_block = /*tab*/ ctx[0] == "levels" && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			create_component(art.$$.fragment);
    			t0 = space();
    			div = element("div");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			add_location(span, file$a, 11, 8, 617);
    			attr_dev(div, "class", "flex-column");
    			add_location(div, file$a, 10, 7, 582);
    			attr_dev(a, "class", "sub-nav-item svelte-ia3x4d");
    			attr_dev(a, "href", a_href_value = "" + (baseUrl + "/" + /*t*/ ctx[6].name + "/" + /*name*/ ctx[9]));
    			toggle_class(a, "active", /*activeName*/ ctx[1] == /*name*/ ctx[9]);
    			add_location(a, file$a, 8, 6, 399);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(art, a, null);
    			append_dev(a, t0);
    			append_dev(a, div);
    			append_dev(div, span);
    			append_dev(span, t1);
    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const art_changes = {};

    			if (dirty & /*tab, store*/ 5) art_changes.name = /*tab*/ ctx[0] == "art"
    			? /*name*/ ctx[9]
    			: /*store*/ ctx[2][/*name*/ ctx[9]][/*t*/ ctx[6].graphicKey];

    			art.$set(art_changes);
    			if ((!current || dirty & /*store*/ 4) && t1_value !== (t1_value = /*name*/ ctx[9] + "")) set_data_dev(t1, t1_value);

    			if (/*tab*/ ctx[0] == "levels") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*store*/ 4 && a_href_value !== (a_href_value = "" + (baseUrl + "/" + /*t*/ ctx[6].name + "/" + /*name*/ ctx[9]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*activeName, Object, store*/ 6) {
    				toggle_class(a, "active", /*activeName*/ ctx[1] == /*name*/ ctx[9]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(art.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(art.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(art);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(8:5) {#each Object.keys(store).sort() as name}",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#each tabs as t}
    function create_each_block$2(ctx) {
    	let a;
    	let t0_value = /*t*/ ctx[6].name + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let if_block = /*t*/ ctx[6].name == /*tab*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(a, "class", "sub-nav-item svelte-ia3x4d");
    			attr_dev(a, "href", a_href_value = "" + (baseUrl + "/" + /*t*/ ctx[6].name + "/new"));
    			toggle_class(a, "active", /*tab*/ ctx[0] == /*t*/ ctx[6].name);
    			add_location(a, file$a, 3, 3, 89);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tab, tabs*/ 9) {
    				toggle_class(a, "active", /*tab*/ ctx[0] == /*t*/ ctx[6].name);
    			}

    			if (/*t*/ ctx[6].name == /*tab*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*tab*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(3:2) {#each tabs as t}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	let each_value = /*tabs*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "sub-nav nav-column svelte-ia3x4d");
    			add_location(div0, file$a, 1, 1, 31);
    			attr_dev(div1, "class", "flex-grow pl-2");
    			add_location(div1, file$a, 22, 1, 838);
    			attr_dev(div2, "class", "flex align-top");
    			add_location(div2, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, store, baseUrl, tabs, activeName, tab*/ 15) {
    				each_value = /*tabs*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const baseUrl = "#/level-builder";

    function instance$c($$self, $$props, $$invalidate) {
    	let { tab } = $$props;
    	let { activeName } = $$props;
    	let { store } = $$props;

    	const tabs = [
    		{ name: "art" },
    		{ name: "blocks", graphicKey: "graphic" },
    		{
    			name: "characters",
    			graphicKey: "graphicStill"
    		},
    		{
    			name: "enemies",
    			graphicKey: "graphicStill"
    		},
    		{ name: "levels", graphicKey: null }
    	];

    	const writable_props = ["tab", "activeName", "store"];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelBuilderLayout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelBuilderLayout", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("tab" in $$props) $$invalidate(0, tab = $$props.tab);
    		if ("activeName" in $$props) $$invalidate(1, activeName = $$props.activeName);
    		if ("store" in $$props) $$invalidate(2, store = $$props.store);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Art,
    		tab,
    		activeName,
    		store,
    		baseUrl,
    		tabs
    	});

    	$$self.$inject_state = $$props => {
    		if ("tab" in $$props) $$invalidate(0, tab = $$props.tab);
    		if ("activeName" in $$props) $$invalidate(1, activeName = $$props.activeName);
    		if ("store" in $$props) $$invalidate(2, store = $$props.store);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tab, activeName, store, tabs, $$scope, $$slots];
    }

    class LevelBuilderLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { tab: 0, activeName: 1, store: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilderLayout",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tab*/ ctx[0] === undefined && !("tab" in props)) {
    			console.warn("<LevelBuilderLayout> was created without expected prop 'tab'");
    		}

    		if (/*activeName*/ ctx[1] === undefined && !("activeName" in props)) {
    			console.warn("<LevelBuilderLayout> was created without expected prop 'activeName'");
    		}

    		if (/*store*/ ctx[2] === undefined && !("store" in props)) {
    			console.warn("<LevelBuilderLayout> was created without expected prop 'store'");
    		}
    	}

    	get tab() {
    		throw new Error("<LevelBuilderLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error("<LevelBuilderLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeName() {
    		throw new Error("<LevelBuilderLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeName(value) {
    		throw new Error("<LevelBuilderLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get store() {
    		throw new Error("<LevelBuilderLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set store(value) {
    		throw new Error("<LevelBuilderLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    window.logDiffs = false; // can set this in production to determine why confirm-nav-away is popping up, for instance

    function hasDifferences(a, b) {
    	return JSON.stringify(a) !== JSON.stringify(b)
    }

    function isEmpty(obj) {
    	return obj == null || obj.toString().trim().length === 0
    }

    const defaultFormat = 'M/D/YYYY';

    class Validator {
    	constructor() {
    		this.emailRegex = /^[^.]([^@<>\s]+)?[^.]@[^@<>\s-][^@<>\s]+\.[a-zA-Z]{1,6}$/;
    		this.doublePeriodRegex = /\.\./;
    		this.nameWithSpaceRegex = /[^\s]+\s+[^\s]+/;
    		this.phoneRegex = /^([+][0-9][-\s.])?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    	}

    	date(s, format = defaultFormat) {
    		return dayjs(s, format).format(format) === s
    	}

    	dateBefore(s1, s2, format = defaultFormat) {
    		return dayjs(s1, format).isBefore(dayjs(s2, format))
    	}

    	dateSameOrBefore(s1, s2, format = defaultFormat) {
    		return dayjs(s1, format).isSameOrBefore(dayjs(s2, format))
    	}

    	dateAfter(s1, s2, format = defaultFormat) {
    		return dayjs(s1, format).isAfter(dayjs(s2, format))
    	}

    	inFuture(date, format = defaultFormat) {
    		return this.dateAfter(dayjs(date, format), dayjs())
    	}

    	dateBetween(s1, start, end, format = defaultFormat) {
    		if (!dayjs(s1, format).isValid() || !dayjs(start, format).isValid()) return false

    		if (dayjs.utc(s1, format).isBefore(dayjs(start, format), 'days')) return false

    		if (end != null && dayjs(end, format).isValid() && dayjs.utc(s1, format).isAfter(dayjs(end, format), 'days')) return false

    		return true
    	}

    	email(s) {
    		return !this.empty(s) && this.emailRegex.test(s) && !this.doublePeriodRegex.test(s)
    	}

    	/**
    	 * checks if any changes exist between a and b
    	 * @param {any} a
    	 * @param {any} b
    	 * @param {array<string>} ignoreKeys which object keys to ignore (foreign keys, primary keys, and other things the user won't be modding)
    	 */
    	equals(a, b, ignoreKeys = null) {
    		ignoreKeys = (ignoreKeys || []).concat('id');
    		return !hasDifferences(a, b)
    	}

    	empty(s) {
    		return isEmpty(s)
    	}

    	int(s) {
    		return s != null && !isNaN(parseInt(s)) && isFinite(s) && parseInt(s).toString() == s.toString()
    	}

    	intRange(s, min, max) {
    		const n = parseInt(s);
    		return n >= min && n <= max
    	}

    	year(s) {
    		return this.intRange(s, 1900, dayjs().add(100, 'year'))
    	}

    	length(s, min) {
    		return !this.empty(s) && s.length >= min
    	}

    	name(s) {
    		return this.required(s) && this.length(s, 3)
    	}

    	nameWithSpace(s) {
    		return this.required(s) && this.nameWithSpaceRegex.test(s)
    	}

    	numeric(s) {
    		return !isNaN(parseFloat(s)) && isFinite(s)
    	}

    	phone(s) {
    		return this.phoneRegex.test(s)
    	}

    	regex(regex, s) {
    		return new RegExp(regex).test(s)
    	}

    	required(s) {
    		return s != null && !this.empty(s)
    	}

    	checked(b) {
    		return b == true
    	}

    	dynamicField(type, required, value, dateFormat) {
    		if (this.empty(value)) return !required

    		switch (type) {
    			case 'text':
    			case 'textarea':
    			case 'select':
    			case 'radiogroup':
    				return this.required(value)
    			case 'phone':
    				return this.phone(value)
    			case 'email':
    				return this.email(value)
    			case 'yesno':
    				return value === true || value === 'true' || value === false || value === 'false'
    			case 'checkbox':
    				return !required || value === true || value === 'true'
    			case 'checkboxgroup':
    				return value.length
    			case 'numeric':
    				return this.numeric(value)
    			case 'date':
    				return this.date(value, dateFormat)
    			case 'rating':
    				return this.int(value) && this.intRange(value, 1, 5)
    		}

    		return false
    	}
    }

    const validator = new Validator();

    var faExchangeAlt = {
      prefix: 'fas',
      iconName: 'exchange-alt',
      icon: [512, 512, [], "f362", "M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z"]
    };
    var faFillDrip = {
      prefix: 'fas',
      iconName: 'fill-drip',
      icon: [576, 512, [], "f576", "M512 320s-64 92.65-64 128c0 35.35 28.66 64 64 64s64-28.65 64-64-64-128-64-128zm-9.37-102.94L294.94 9.37C288.69 3.12 280.5 0 272.31 0s-16.38 3.12-22.62 9.37l-81.58 81.58L81.93 4.76c-6.25-6.25-16.38-6.25-22.62 0L36.69 27.38c-6.24 6.25-6.24 16.38 0 22.62l86.19 86.18-94.76 94.76c-37.49 37.48-37.49 98.26 0 135.75l117.19 117.19c18.74 18.74 43.31 28.12 67.87 28.12 24.57 0 49.13-9.37 67.87-28.12l221.57-221.57c12.5-12.5 12.5-32.75.01-45.25zm-116.22 70.97H65.93c1.36-3.84 3.57-7.98 7.43-11.83l13.15-13.15 81.61-81.61 58.6 58.6c12.49 12.49 32.75 12.49 45.24 0s12.49-32.75 0-45.24l-58.6-58.6 58.95-58.95 162.44 162.44-48.34 48.34z"]
    };
    var faPaintBrush = {
      prefix: 'fas',
      iconName: 'paint-brush',
      icon: [512, 512, [], "f1fc", "M167.02 309.34c-40.12 2.58-76.53 17.86-97.19 72.3-2.35 6.21-8 9.98-14.59 9.98-11.11 0-45.46-27.67-55.25-34.35C0 439.62 37.93 512 128 512c75.86 0 128-43.77 128-120.19 0-3.11-.65-6.08-.97-9.13l-88.01-73.34zM457.89 0c-15.16 0-29.37 6.71-40.21 16.45C213.27 199.05 192 203.34 192 257.09c0 13.7 3.25 26.76 8.73 38.7l63.82 53.18c7.21 1.8 14.64 3.03 22.39 3.03 62.11 0 98.11-45.47 211.16-256.46 7.38-14.35 13.9-29.85 13.9-45.99C512 20.64 486 0 457.89 0z"]
    };

    /* src\pages\LevelBuilder\ArtMaker.svelte generated by Svelte v3.24.1 */
    const file$b = "src\\pages\\LevelBuilder\\ArtMaker.svelte";

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[58] = list[i];
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[55] = list[i];
    	return child_ctx;
    }

    // (8:3) {#if !isAdding}
    function create_if_block_1$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$b, 8, 4, 343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[32], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(8:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (5:2) <span slot="buttons" class="flex">
    function create_buttons_slot(ctx) {
    	let span;
    	let input_1;
    	let t;
    	let mounted;
    	let dispose;
    	let if_block = !/*isAdding*/ ctx[8] && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			input_1 = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "class", "form-control width-auto svelte-18y36c5");
    			attr_dev(input_1, "id", "name");
    			attr_dev(input_1, "name", "name");
    			add_location(input_1, file$b, 5, 3, 194);
    			attr_dev(span, "slot", "buttons");
    			attr_dev(span, "class", "flex svelte-18y36c5");
    			add_location(span, file$b, 4, 2, 155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, input_1);
    			set_input_value(input_1, /*input*/ ctx[0].name);
    			/*input_1_binding*/ ctx[31](input_1);
    			append_dev(span, t);
    			if (if_block) if_block.m(span, null);

    			if (!mounted) {
    				dispose = listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[30]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*input*/ 1 && input_1.value !== /*input*/ ctx[0].name) {
    				set_input_value(input_1, /*input*/ ctx[0].name);
    			}

    			if (!/*isAdding*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			/*input_1_binding*/ ctx[31](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_buttons_slot.name,
    		type: "slot",
    		source: "(5:2) <span slot=\\\"buttons\\\" class=\\\"flex\\\">",
    		ctx
    	});

    	return block;
    }

    // (97:4) {#if input.width == 20 && input.height == 20}
    function create_if_block$6(ctx) {
    	let div;
    	let each_value = [0, 0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 2; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "ml-2");
    			add_location(div, file$b, 97, 5, 3743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*previewPNG*/ 512) {
    				each_value = [0, 0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 2; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < 2; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(97:4) {#if input.width == 20 && input.height == 20}",
    		ctx
    	});

    	return block;
    }

    // (101:8) {#each [0, 0, 0] as margin}
    function create_each_block_1$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*previewPNG*/ ctx[9])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "block repeating preview");
    			add_location(img, file$b, 101, 9, 3850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*previewPNG*/ 512 && img.src !== (img_src_value = /*previewPNG*/ ctx[9])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(101:8) {#each [0, 0, 0] as margin}",
    		ctx
    	});

    	return block;
    }

    // (99:6) {#each [0, 0] as r}
    function create_each_block$3(ctx) {
    	let div;
    	let t;
    	let each_value_1 = [0, 0, 0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < 3; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(div, file$b, 99, 7, 3797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*previewPNG*/ 512) {
    				each_value_1 = [0, 0, 0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < 3; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < 3; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(99:6) {#each [0, 0] as r}",
    		ctx
    	});

    	return block;
    }

    // (4:1) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1(ctx) {
    	let t0;
    	let div6;
    	let colorpicker;
    	let updating_value;
    	let t1;
    	let div0;
    	let button0;
    	let icon0;
    	let button0_class_value;
    	let t2;
    	let button1;
    	let icon1;
    	let button1_class_value;
    	let t3;
    	let button2;
    	let icon2;
    	let button2_class_value;
    	let t4;
    	let button3;
    	let t6;
    	let div1;
    	let button4;
    	let icon3;
    	let t7;

    	let t8_value = (/*undos*/ ctx[3].length > 0
    	? /*undos*/ ctx[3].length
    	: "") + "";

    	let t8;
    	let button4_disabled_value;
    	let t9;
    	let button5;
    	let icon4;
    	let t10;

    	let t11_value = (/*redos*/ ctx[4].length > 0
    	? /*redos*/ ctx[4].length
    	: "") + "";

    	let t11;
    	let button5_disabled_value;
    	let t12;
    	let div2;
    	let button6;
    	let icon5;
    	let t13;
    	let button7;
    	let icon6;
    	let t14;
    	let div3;
    	let button8;
    	let icon7;
    	let t15;
    	let button9;
    	let icon8;
    	let t16;
    	let button10;
    	let icon9;
    	let t17;
    	let button11;
    	let icon10;
    	let t18;
    	let div4;
    	let t19;
    	let input0;
    	let t20;
    	let div5;
    	let t21;
    	let input1;
    	let t22;
    	let label;
    	let input2;
    	let t23;
    	let t24;
    	let div9;
    	let canvas;
    	let canvas_width_value;
    	let canvas_height_value;
    	let t25;
    	let div8;
    	let div7;
    	let img;
    	let img_src_value;
    	let t26;
    	let current;
    	let mounted;
    	let dispose;

    	function colorpicker_value_binding(value) {
    		/*colorpicker_value_binding*/ ctx[33].call(null, value);
    	}

    	let colorpicker_props = {};

    	if (/*selectedColor*/ ctx[7] !== void 0) {
    		colorpicker_props.value = /*selectedColor*/ ctx[7];
    	}

    	colorpicker = new ColorPicker({ props: colorpicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorpicker, "value", colorpicker_value_binding));

    	icon0 = new Icon({
    			props: { data: faPaintBrush },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { data: faFillDrip },
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: { data: eraseIcon },
    			$$inline: true
    		});

    	icon3 = new Icon({
    			props: { data: undoIcon },
    			$$inline: true
    		});

    	icon4 = new Icon({
    			props: { data: undoIcon, flip: "horizontal" },
    			$$inline: true
    		});

    	icon5 = new Icon({
    			props: { data: faExchangeAlt },
    			$$inline: true
    		});

    	icon6 = new Icon({
    			props: {
    				data: faExchangeAlt,
    				style: "transform: rotate(90deg);"
    			},
    			$$inline: true
    		});

    	icon7 = new Icon({
    			props: { data: arrowLeftIcon },
    			$$inline: true
    		});

    	icon8 = new Icon({
    			props: { data: arrowRightIcon },
    			$$inline: true
    		});

    	icon9 = new Icon({
    			props: { data: arrowUpIcon },
    			$$inline: true
    		});

    	icon10 = new Icon({
    			props: { data: arrowDownIcon },
    			$$inline: true
    		});

    	let if_block = /*input*/ ctx[0].width == 20 && /*input*/ ctx[0].height == 20 && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			t0 = space();
    			div6 = element("div");
    			create_component(colorpicker.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t2 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t3 = space();
    			button2 = element("button");
    			create_component(icon2.$$.fragment);
    			t4 = space();
    			button3 = element("button");
    			button3.textContent = "Start over";
    			t6 = space();
    			div1 = element("div");
    			button4 = element("button");
    			create_component(icon3.$$.fragment);
    			t7 = space();
    			t8 = text(t8_value);
    			t9 = space();
    			button5 = element("button");
    			create_component(icon4.$$.fragment);
    			t10 = space();
    			t11 = text(t11_value);
    			t12 = space();
    			div2 = element("div");
    			button6 = element("button");
    			create_component(icon5.$$.fragment);
    			t13 = space();
    			button7 = element("button");
    			create_component(icon6.$$.fragment);
    			t14 = space();
    			div3 = element("div");
    			button8 = element("button");
    			create_component(icon7.$$.fragment);
    			t15 = space();
    			button9 = element("button");
    			create_component(icon8.$$.fragment);
    			t16 = space();
    			button10 = element("button");
    			create_component(icon9.$$.fragment);
    			t17 = space();
    			button11 = element("button");
    			create_component(icon10.$$.fragment);
    			t18 = space();
    			div4 = element("div");
    			t19 = text("Height\r\n\t\t\t\t");
    			input0 = element("input");
    			t20 = space();
    			div5 = element("div");
    			t21 = text("Width\r\n\t\t\t\t");
    			input1 = element("input");
    			t22 = space();
    			label = element("label");
    			input2 = element("input");
    			t23 = text("\r\n\t\t\t\tShow grid");
    			t24 = space();
    			div9 = element("div");
    			canvas = element("canvas");
    			t25 = space();
    			div8 = element("div");
    			div7 = element("div");
    			img = element("img");
    			t26 = space();
    			if (if_block) if_block.c();
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", button0_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "paint" ? "primary" : "light"));
    			attr_dev(button0, "title", "Paint brush");
    			add_location(button0, file$b, 16, 4, 585);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", button1_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "fill" ? "primary" : "light"));
    			attr_dev(button1, "title", "Paint bucket");
    			add_location(button1, file$b, 19, 4, 777);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", button2_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "erase" ? "primary" : "light"));
    			attr_dev(button2, "title", "Eraser");
    			add_location(button2, file$b, 22, 4, 967);
    			attr_dev(div0, "class", "btn-group svelte-18y36c5");
    			add_location(div0, file$b, 15, 3, 556);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn btn-light btn-sm");
    			add_location(button3, file$b, 27, 3, 1166);
    			attr_dev(button4, "type", "button");
    			button4.disabled = button4_disabled_value = /*undos*/ ctx[3].length == 0;
    			attr_dev(button4, "class", "btn btn-default btn-sm");
    			add_location(button4, file$b, 30, 4, 1289);
    			attr_dev(button5, "type", "button");
    			button5.disabled = button5_disabled_value = /*redos*/ ctx[4].length == 0;
    			attr_dev(button5, "class", "btn btn-default btn-sm");
    			add_location(button5, file$b, 34, 4, 1484);
    			attr_dev(div1, "class", "btn-group svelte-18y36c5");
    			add_location(div1, file$b, 29, 3, 1260);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-light btn-sm");
    			attr_dev(button6, "title", "Flip horizontal");
    			add_location(button6, file$b, 41, 4, 1738);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-light btn-sm");
    			attr_dev(button7, "title", "Flip vertical");
    			add_location(button7, file$b, 44, 4, 1882);
    			attr_dev(div2, "class", "btn-group svelte-18y36c5");
    			add_location(div2, file$b, 40, 3, 1709);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn btn-light btn-sm");
    			attr_dev(button8, "title", "Move left");
    			add_location(button8, file$b, 50, 4, 2099);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn btn-light btn-sm");
    			attr_dev(button9, "title", "Move right");
    			add_location(button9, file$b, 53, 4, 2245);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "btn btn-light btn-sm");
    			attr_dev(button10, "title", "Move up");
    			add_location(button10, file$b, 56, 4, 2394);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "btn btn-light btn-sm");
    			attr_dev(button11, "title", "Move down");
    			add_location(button11, file$b, 59, 4, 2534);
    			attr_dev(div3, "class", "btn-group svelte-18y36c5");
    			add_location(div3, file$b, 49, 3, 2070);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "Height");
    			attr_dev(input0, "class", "svelte-18y36c5");
    			add_location(input0, file$b, 66, 4, 2735);
    			attr_dev(div4, "class", "flex-column svelte-18y36c5");
    			add_location(div4, file$b, 64, 3, 2692);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "Width");
    			attr_dev(input1, "class", "svelte-18y36c5");
    			add_location(input1, file$b, 70, 4, 2863);
    			attr_dev(div5, "class", "flex-column svelte-18y36c5");
    			add_location(div5, file$b, 68, 3, 2821);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "class", "svelte-18y36c5");
    			add_location(input2, file$b, 73, 4, 2960);
    			add_location(label, file$b, 72, 3, 2947);
    			attr_dev(div6, "class", "toolbar flex align-center svelte-18y36c5");
    			add_location(div6, file$b, 12, 2, 463);
    			attr_dev(canvas, "width", canvas_width_value = /*input*/ ctx[0].width * /*gridSize*/ ctx[12]);
    			attr_dev(canvas, "height", canvas_height_value = /*input*/ ctx[0].height * /*gridSize*/ ctx[12]);
    			attr_dev(canvas, "class", "svelte-18y36c5");
    			toggle_class(canvas, "paint-cursor", /*mode*/ ctx[1] == "paint");
    			toggle_class(canvas, "fill-cursor", /*mode*/ ctx[1] == "fill");
    			toggle_class(canvas, "erase-cursor", /*mode*/ ctx[1] == "erase");
    			add_location(canvas, file$b, 79, 3, 3091);
    			if (img.src !== (img_src_value = /*previewPNG*/ ctx[9])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "preview");
    			attr_dev(img, "class", "drop-shadow");
    			add_location(img, file$b, 92, 5, 3560);
    			add_location(div7, file$b, 91, 4, 3548);
    			attr_dev(div8, "class", "preview flex svelte-18y36c5");
    			add_location(div8, file$b, 90, 3, 3516);
    			attr_dev(div9, "class", "flex my-3 align-top");
    			add_location(div9, file$b, 78, 2, 3053);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div6, anchor);
    			mount_component(colorpicker, div6, null);
    			append_dev(div6, t1);
    			append_dev(div6, div0);
    			append_dev(div0, button0);
    			mount_component(icon0, button0, null);
    			append_dev(div0, t2);
    			append_dev(div0, button1);
    			mount_component(icon1, button1, null);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			mount_component(icon2, button2, null);
    			append_dev(div6, t4);
    			append_dev(div6, button3);
    			append_dev(div6, t6);
    			append_dev(div6, div1);
    			append_dev(div1, button4);
    			mount_component(icon3, button4, null);
    			append_dev(button4, t7);
    			append_dev(button4, t8);
    			append_dev(div1, t9);
    			append_dev(div1, button5);
    			mount_component(icon4, button5, null);
    			append_dev(button5, t10);
    			append_dev(button5, t11);
    			append_dev(div6, t12);
    			append_dev(div6, div2);
    			append_dev(div2, button6);
    			mount_component(icon5, button6, null);
    			append_dev(div2, t13);
    			append_dev(div2, button7);
    			mount_component(icon6, button7, null);
    			append_dev(div6, t14);
    			append_dev(div6, div3);
    			append_dev(div3, button8);
    			mount_component(icon7, button8, null);
    			append_dev(div3, t15);
    			append_dev(div3, button9);
    			mount_component(icon8, button9, null);
    			append_dev(div3, t16);
    			append_dev(div3, button10);
    			mount_component(icon9, button10, null);
    			append_dev(div3, t17);
    			append_dev(div3, button11);
    			mount_component(icon10, button11, null);
    			append_dev(div6, t18);
    			append_dev(div6, div4);
    			append_dev(div4, t19);
    			append_dev(div4, input0);
    			set_input_value(input0, /*input*/ ctx[0].height);
    			append_dev(div6, t20);
    			append_dev(div6, div5);
    			append_dev(div5, t21);
    			append_dev(div5, input1);
    			set_input_value(input1, /*input*/ ctx[0].width);
    			append_dev(div6, t22);
    			append_dev(div6, label);
    			append_dev(label, input2);
    			input2.checked = /*showGrid*/ ctx[5];
    			append_dev(label, t23);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, canvas);
    			/*canvas_binding*/ ctx[40](canvas);
    			append_dev(div9, t25);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, img);
    			append_dev(div8, t26);
    			if (if_block) if_block.m(div8, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[34], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[35], false, false, false),
    					listen_dev(button2, "click", /*click_handler_3*/ ctx[36], false, false, false),
    					listen_dev(button3, "click", /*reset*/ ctx[15], false, false, false),
    					listen_dev(button4, "click", /*undo*/ ctx[19], false, false, false),
    					listen_dev(button5, "click", /*redo*/ ctx[20], false, false, false),
    					listen_dev(button6, "click", /*flipX*/ ctx[23], false, false, false),
    					listen_dev(button7, "click", /*flipY*/ ctx[22], false, false, false),
    					listen_dev(button8, "click", /*moveLeft*/ ctx[24], false, false, false),
    					listen_dev(button9, "click", /*moveRight*/ ctx[25], false, false, false),
    					listen_dev(button10, "click", /*moveUp*/ ctx[26], false, false, false),
    					listen_dev(button11, "click", /*moveDown*/ ctx[27], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[37]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[38]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[39]),
    					listen_dev(canvas, "mousedown", prevent_default(/*onDrawMouseDown*/ ctx[16]), false, true, false),
    					listen_dev(canvas, "mouseup", prevent_default(/*onDrawMouseUp*/ ctx[17]), false, true, false),
    					listen_dev(canvas, "mousemove", prevent_default(/*onDrawMouseMove*/ ctx[18]), false, true, false),
    					listen_dev(canvas, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[29]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const colorpicker_changes = {};

    			if (!updating_value && dirty[0] & /*selectedColor*/ 128) {
    				updating_value = true;
    				colorpicker_changes.value = /*selectedColor*/ ctx[7];
    				add_flush_callback(() => updating_value = false);
    			}

    			colorpicker.$set(colorpicker_changes);

    			if (!current || dirty[0] & /*mode*/ 2 && button0_class_value !== (button0_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "paint" ? "primary" : "light"))) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (!current || dirty[0] & /*mode*/ 2 && button1_class_value !== (button1_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "fill" ? "primary" : "light"))) {
    				attr_dev(button1, "class", button1_class_value);
    			}

    			if (!current || dirty[0] & /*mode*/ 2 && button2_class_value !== (button2_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "erase" ? "primary" : "light"))) {
    				attr_dev(button2, "class", button2_class_value);
    			}

    			if ((!current || dirty[0] & /*undos*/ 8) && t8_value !== (t8_value = (/*undos*/ ctx[3].length > 0
    			? /*undos*/ ctx[3].length
    			: "") + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty[0] & /*undos*/ 8 && button4_disabled_value !== (button4_disabled_value = /*undos*/ ctx[3].length == 0)) {
    				prop_dev(button4, "disabled", button4_disabled_value);
    			}

    			if ((!current || dirty[0] & /*redos*/ 16) && t11_value !== (t11_value = (/*redos*/ ctx[4].length > 0
    			? /*redos*/ ctx[4].length
    			: "") + "")) set_data_dev(t11, t11_value);

    			if (!current || dirty[0] & /*redos*/ 16 && button5_disabled_value !== (button5_disabled_value = /*redos*/ ctx[4].length == 0)) {
    				prop_dev(button5, "disabled", button5_disabled_value);
    			}

    			if (dirty[0] & /*input*/ 1 && to_number(input0.value) !== /*input*/ ctx[0].height) {
    				set_input_value(input0, /*input*/ ctx[0].height);
    			}

    			if (dirty[0] & /*input*/ 1 && to_number(input1.value) !== /*input*/ ctx[0].width) {
    				set_input_value(input1, /*input*/ ctx[0].width);
    			}

    			if (dirty[0] & /*showGrid*/ 32) {
    				input2.checked = /*showGrid*/ ctx[5];
    			}

    			if (!current || dirty[0] & /*input*/ 1 && canvas_width_value !== (canvas_width_value = /*input*/ ctx[0].width * /*gridSize*/ ctx[12])) {
    				attr_dev(canvas, "width", canvas_width_value);
    			}

    			if (!current || dirty[0] & /*input*/ 1 && canvas_height_value !== (canvas_height_value = /*input*/ ctx[0].height * /*gridSize*/ ctx[12])) {
    				attr_dev(canvas, "height", canvas_height_value);
    			}

    			if (dirty[0] & /*mode*/ 2) {
    				toggle_class(canvas, "paint-cursor", /*mode*/ ctx[1] == "paint");
    			}

    			if (dirty[0] & /*mode*/ 2) {
    				toggle_class(canvas, "fill-cursor", /*mode*/ ctx[1] == "fill");
    			}

    			if (dirty[0] & /*mode*/ 2) {
    				toggle_class(canvas, "erase-cursor", /*mode*/ ctx[1] == "erase");
    			}

    			if (!current || dirty[0] & /*previewPNG*/ 512 && img.src !== (img_src_value = /*previewPNG*/ ctx[9])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (/*input*/ ctx[0].width == 20 && /*input*/ ctx[0].height == 20) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(div8, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorpicker.$$.fragment, local);
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			transition_in(icon4.$$.fragment, local);
    			transition_in(icon5.$$.fragment, local);
    			transition_in(icon6.$$.fragment, local);
    			transition_in(icon7.$$.fragment, local);
    			transition_in(icon8.$$.fragment, local);
    			transition_in(icon9.$$.fragment, local);
    			transition_in(icon10.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colorpicker.$$.fragment, local);
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			transition_out(icon4.$$.fragment, local);
    			transition_out(icon5.$$.fragment, local);
    			transition_out(icon6.$$.fragment, local);
    			transition_out(icon7.$$.fragment, local);
    			transition_out(icon8.$$.fragment, local);
    			transition_out(icon9.$$.fragment, local);
    			transition_out(icon10.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div6);
    			destroy_component(colorpicker);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    			destroy_component(icon3);
    			destroy_component(icon4);
    			destroy_component(icon5);
    			destroy_component(icon6);
    			destroy_component(icon7);
    			destroy_component(icon8);
    			destroy_component(icon9);
    			destroy_component(icon10);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(div9);
    			/*canvas_binding*/ ctx[40](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(4:1) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (3:0) <LevelBuilderLayout tab="art" activeName={input.name} store={$artStore}>
    function create_default_slot$2(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[10],
    				$$slots: {
    					default: [create_default_slot_1],
    					buttons: [create_buttons_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};
    			if (dirty[0] & /*hasChanges*/ 1024) form_changes.hasChanges = /*hasChanges*/ ctx[10];

    			if (dirty[0] & /*previewPNG, input, drawCanvas, mode, showGrid, redos, undos, selectedColor, isAdding, nameField*/ 1023 | dirty[1] & /*$$scope*/ 1073741824) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(3:0) <LevelBuilderLayout tab=\\\"art\\\" activeName={input.name} store={$artStore}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let levelbuilderlayout;
    	let current;
    	let mounted;
    	let dispose;

    	levelbuilderlayout = new LevelBuilderLayout({
    			props: {
    				tab: "art",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$artStore*/ ctx[11],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(levelbuilderlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(levelbuilderlayout, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keyup", /*onKeyUp*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const levelbuilderlayout_changes = {};
    			if (dirty[0] & /*input*/ 1) levelbuilderlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty[0] & /*$artStore*/ 2048) levelbuilderlayout_changes.store = /*$artStore*/ ctx[11];

    			if (dirty[0] & /*hasChanges, previewPNG, input, drawCanvas, mode, showGrid, redos, undos, selectedColor, isAdding, nameField*/ 2047 | dirty[1] & /*$$scope*/ 1073741824) {
    				levelbuilderlayout_changes.$$scope = { dirty, ctx };
    			}

    			levelbuilderlayout.$set(levelbuilderlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(levelbuilderlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(levelbuilderlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(levelbuilderlayout, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function buildData(height, width) {
    	return [...Array(height)].map(r => buildColumns(width));
    }

    function buildColumns(width) {
    	return [...Array(width)].map(c => "transparent");
    }

    function getCellColor(d, row, column) {
    	return d.length > row && d[row].length > column
    	? d[row][column] || "transparent"
    	: "white";
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $artStore;
    	validate_store(artStore, "artStore");
    	component_subscribe($$self, artStore, $$value => $$invalidate(11, $artStore = $$value));
    	let { params = {} } = $$props;
    	let input;
    	create();
    	let mode = "paint";
    	let drawCanvas;
    	let undos = [];
    	let redos = [];
    	let mouseDown = false;
    	let showGrid = true;
    	let gridSize = 25;
    	let drawContext;
    	let nameField;
    	let savedInput;
    	let selectedColor = "black";

    	function create() {
    		$$invalidate(0, input = {
    			name: "",
    			width: 20,
    			height: 20,
    			data: buildData(20, 20)
    		});

    		setTimeout(
    			() => {
    				nameField.focus();
    			},
    			100
    		);
    	}

    	function edit(name) {
    		if (!$artStore.hasOwnProperty(name)) return;
    		$$invalidate(3, undos = []);
    		$$invalidate(4, redos = []);
    		$$invalidate(0, input = JSON.parse(JSON.stringify($artStore[name])));
    		$$invalidate(0, input.width = input.width || input.data[0].length, input);
    		$$invalidate(0, input.height = input.height || input.data.length, input);
    		redraw();
    	}

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		$$invalidate(0, input.png = toPNG(input.data, input.width, input.height), input);
    		set_store_value(artStore, $artStore[input.name] = JSON.parse(JSON.stringify(input)), $artStore);
    		push(`/level-builder/art/${encodeURIComponent(input.name)}`);
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) {
    			delete $artStore[name];
    			artStore.set($artStore);
    			push("/level-builder/art/new");
    		}
    	}

    	function reset(undoable = true) {
    		if (undoable) addUndoState();
    		$$invalidate(0, input.data = buildData(input.height, input.width), input);
    	}

    	function draw(d, w, h) {
    		if (d == null || drawCanvas == null) return;
    		if (drawContext == null) drawContext = drawCanvas.getContext("2d");
    		drawContext.clearRect(0, 0, w * gridSize, h * gridSize);

    		for (let y = 0; y < h; y++) {
    			for (let x = 0; x < w; x++) {
    				drawContext.beginPath();
    				drawContext.rect(x * gridSize, y * gridSize, gridSize, gridSize);
    				drawContext.fillStyle = getCellColor(d, y, x);
    				drawContext.fill();

    				if (showGrid) {
    					drawContext.strokeStyle = "#eee";
    					drawContext.stroke();
    				}
    			}
    		}
    	}

    	function redraw() {
    		setTimeout(() => draw(input.data, input.width, input.height), 10);
    	}

    	function onDrawMouseDown(e) {
    		const color = getColorAtEvent(e);

    		if (e.altKey || e.button !== 0) {
    			if (color == "transparent") $$invalidate(1, mode = "erase"); else {
    				$$invalidate(1, mode = "paint");
    				$$invalidate(7, selectedColor = color);
    			}
    		} else {
    			addUndoState();
    			mouseDown = true;
    			onDrawMouseMove(e);
    		}
    	}

    	function onDrawMouseUp(e) {
    		mouseDown = false;
    	}

    	function onDrawMouseMove(e) {
    		if (!mouseDown) return;
    		const { x, y } = getEventCellIndexes(e);

    		if (y != null && x != null) {
    			if (mode == "erase") setColor(y, x, "transparent"); else setColor(y, x, selectedColor);
    		}
    	}

    	function getEventCellIndexes(e) {
    		return {
    			x: Math.floor(e.offsetX / gridSize),
    			y: Math.floor(e.offsetY / gridSize)
    		};
    	}

    	function getColorAtEvent(e) {
    		// could probably get this directly from canvas / getPixel stuff
    		const { x, y } = getEventCellIndexes(e);

    		return input.data[y][x] || "transparent";
    	}

    	function addUndoState() {
    		$$invalidate(3, undos = [...undos.slice(Math.max(undos.length - 20, 0)), JSON.stringify(input.data)]);

    		// if we're adding a new undo state, empty redos
    		$$invalidate(4, redos = []);
    	}

    	function undo() {
    		if (undos.length == 0) return;
    		$$invalidate(4, redos = [...redos, JSON.stringify(input.data)]);
    		$$invalidate(0, input.data = JSON.parse(undos.pop()), input);
    		$$invalidate(3, undos);
    	}

    	function redo() {
    		if (redos.length == 0) return;
    		$$invalidate(3, undos = [...undos, JSON.stringify(input.data)]);
    		$$invalidate(0, input.data = JSON.parse(redos.pop()), input);
    		$$invalidate(4, redos);
    	}

    	function setColor(y, x, color) {
    		syncDataToSize();

    		// don't need to worry about columns.. they get auto-filled with null
    		const oldColor = input.data[y][x] || "transparent";

    		$$invalidate(0, input.data[y][x] = color, input);

    		if (mode == "fill") {
    			// recursively loop around this pixel setting pixels that were the same color this one used to be to the new color
    			// needs revision
    			// right now it works well for filling outlines, but overfills through outlines that only touch on corners
    			for (let yn = y - 1; yn <= y + 1; yn++) {
    				for (let xn = x - 1; xn <= x + 1; xn++) {
    					if (yn < 0 || yn > input.height - 1 || xn < 0 || xn > input.width - 1) continue;
    					const currentColor = input.data[yn][xn] || "transparent";
    					if (currentColor == oldColor) setColor(yn, xn, color);
    				}
    			}
    		}
    	}

    	function onKeyUp(e) {
    		switch (e.code) {
    			case "KeyZ":
    				if (e.ctrlKey) undo();
    				break;
    			case "KeyY":
    				if (e.ctrlKey) redo();
    				break;
    		}
    	}

    	function flipY() {
    		$$invalidate(0, input.data = input.data.slice(0, input.height).reverse(), input);
    	}

    	function flipX() {
    		$$invalidate(0, input.data = input.data.map(d => d.slice(0, input.width).reverse()), input);
    	}

    	function moveLeft() {
    		addUndoState();
    		syncDataToSize();

    		$$invalidate(
    			0,
    			input.data = input.data.map(row => {
    				const firstCol = row.shift();
    				return [...row, firstCol];
    			}),
    			input
    		);
    	}

    	function moveRight() {
    		addUndoState();
    		syncDataToSize();

    		$$invalidate(
    			0,
    			input.data = input.data.map(row => {
    				const lastCol = row.pop();
    				return [lastCol, ...row];
    			}),
    			input
    		);
    	}

    	function moveUp() {
    		addUndoState();
    		syncDataToSize();
    		const firstRow = input.data.shift();
    		$$invalidate(0, input.data = [...input.data, firstRow], input);
    	}

    	function moveDown() {
    		addUndoState();
    		syncDataToSize();
    		const lastRow = input.data.pop();
    		$$invalidate(0, input.data = [lastRow, ...input.data], input);
    	}

    	function syncDataToSize() {
    		if (input.height > input.data.length) {
    			// add empty rows
    			const rowsNeeded = input.height - input.data.length;

    			$$invalidate(0, input.data = input.data.concat(buildData(rowsNeeded, input.width)), input);
    		} // } else if (input.height < input.data.length) {
    		// 	// crop unnecessary rows

    		// 	input.data.slice(0, input.height)
    		// make sure all rows are the right length
    		$$invalidate(
    			0,
    			input.data = input.data.map(row => {
    				if (input.width > row.length) {
    					const colsNeeded = input.width - row.length;
    					row = row.concat(buildColumns(colsNeeded));
    				} // } else if (input.width < row.length) {
    				// 	row.slice(0, input.width)

    				return row;
    			}),
    			input
    		);
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ArtMaker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ArtMaker", $$slots, []);

    	function contextmenu_handler(event) {
    		bubble($$self, event);
    	}

    	function input_1_input_handler() {
    		input.name = this.value;
    		$$invalidate(0, input);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			nameField = $$value;
    			$$invalidate(6, nameField);
    		});
    	}

    	const click_handler = () => del(input.name);

    	function colorpicker_value_binding(value) {
    		selectedColor = value;
    		$$invalidate(7, selectedColor);
    	}

    	const click_handler_1 = () => $$invalidate(1, mode = "paint");
    	const click_handler_2 = () => $$invalidate(1, mode = "fill");
    	const click_handler_3 = () => $$invalidate(1, mode = "erase");

    	function input0_input_handler() {
    		input.height = to_number(this.value);
    		$$invalidate(0, input);
    	}

    	function input1_input_handler() {
    		input.width = to_number(this.value);
    		$$invalidate(0, input);
    	}

    	function input2_change_handler() {
    		showGrid = this.checked;
    		$$invalidate(5, showGrid);
    	}

    	function canvas_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			drawCanvas = $$value;
    			$$invalidate(2, drawCanvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(28, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		ColorPicker,
    		FieldText,
    		Form,
    		LevelBuilderLayout,
    		toPNG,
    		validator,
    		Icon,
    		artStore,
    		arrowLeftIcon,
    		arrowRightIcon,
    		arrowUpIcon,
    		arrowDownIcon,
    		undoIcon,
    		paintBrushIcon,
    		eraseIcon,
    		fillIcon: faFillDrip,
    		paintIcon: faPaintBrush,
    		flipIcon: faExchangeAlt,
    		null_to_empty,
    		params,
    		input,
    		mode,
    		drawCanvas,
    		undos,
    		redos,
    		mouseDown,
    		showGrid,
    		gridSize,
    		drawContext,
    		nameField,
    		savedInput,
    		selectedColor,
    		create,
    		edit,
    		save,
    		del,
    		reset,
    		draw,
    		redraw,
    		onDrawMouseDown,
    		onDrawMouseUp,
    		onDrawMouseMove,
    		getEventCellIndexes,
    		getColorAtEvent,
    		addUndoState,
    		buildData,
    		buildColumns,
    		undo,
    		redo,
    		setColor,
    		getCellColor,
    		onKeyUp,
    		flipY,
    		flipX,
    		moveLeft,
    		moveRight,
    		moveUp,
    		moveDown,
    		syncDataToSize,
    		paramName,
    		isAdding,
    		previewPNG,
    		drawResult,
    		hasChanges,
    		$artStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(28, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("mode" in $$props) $$invalidate(1, mode = $$props.mode);
    		if ("drawCanvas" in $$props) $$invalidate(2, drawCanvas = $$props.drawCanvas);
    		if ("undos" in $$props) $$invalidate(3, undos = $$props.undos);
    		if ("redos" in $$props) $$invalidate(4, redos = $$props.redos);
    		if ("mouseDown" in $$props) mouseDown = $$props.mouseDown;
    		if ("showGrid" in $$props) $$invalidate(5, showGrid = $$props.showGrid);
    		if ("gridSize" in $$props) $$invalidate(12, gridSize = $$props.gridSize);
    		if ("drawContext" in $$props) drawContext = $$props.drawContext;
    		if ("nameField" in $$props) $$invalidate(6, nameField = $$props.nameField);
    		if ("savedInput" in $$props) savedInput = $$props.savedInput;
    		if ("selectedColor" in $$props) $$invalidate(7, selectedColor = $$props.selectedColor);
    		if ("paramName" in $$props) $$invalidate(43, paramName = $$props.paramName);
    		if ("isAdding" in $$props) $$invalidate(8, isAdding = $$props.isAdding);
    		if ("previewPNG" in $$props) $$invalidate(9, previewPNG = $$props.previewPNG);
    		if ("drawResult" in $$props) drawResult = $$props.drawResult;
    		if ("hasChanges" in $$props) $$invalidate(10, hasChanges = $$props.hasChanges);
    	};

    	let paramName;
    	let isAdding;
    	let previewPNG;
    	let drawResult;
    	let hasChanges;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*params*/ 268435456) {
    			 $$invalidate(43, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty[1] & /*paramName*/ 4096) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty[1] & /*paramName*/ 4096) {
    			 $$invalidate(8, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty[0] & /*input*/ 1) {
    			 $$invalidate(9, previewPNG = toPNG(input.data, input.width, input.height));
    		}

    		if ($$self.$$.dirty[0] & /*input*/ 1) {
    			 drawResult = draw(input.data, input.width, input.height);
    		}

    		if ($$self.$$.dirty[0] & /*input, showGrid*/ 33) {
    			 if (input.width != 0 && input.height != 0 && showGrid) redraw();
    		}

    		if ($$self.$$.dirty[0] & /*input, $artStore*/ 2049) {
    			 $$invalidate(10, hasChanges = input != null && !validator.equals(input, $artStore[input.name]));
    		}
    	};

    	return [
    		input,
    		mode,
    		drawCanvas,
    		undos,
    		redos,
    		showGrid,
    		nameField,
    		selectedColor,
    		isAdding,
    		previewPNG,
    		hasChanges,
    		$artStore,
    		gridSize,
    		save,
    		del,
    		reset,
    		onDrawMouseDown,
    		onDrawMouseUp,
    		onDrawMouseMove,
    		undo,
    		redo,
    		onKeyUp,
    		flipY,
    		flipX,
    		moveLeft,
    		moveRight,
    		moveUp,
    		moveDown,
    		params,
    		contextmenu_handler,
    		input_1_input_handler,
    		input_1_binding,
    		click_handler,
    		colorpicker_value_binding,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler,
    		canvas_binding
    	];
    }

    class ArtMaker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { params: 28 }, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArtMaker",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get params() {
    		throw new Error("<ArtMaker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<ArtMaker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function _filter (list, search) {
    	list = list || null;
    	if (list == null) return null
    	if (search == null || search === '') return list

    	const tempSearch = search.trim().toLowerCase();

    	// return only results that, when serialized to json, contain the text passed
    	// omit profilePicture from the serialization to avoid false positives
    	const results = list.filter(item => JSON.stringify(item).toLowerCase().indexOf(tempSearch) > -1);
    	return results
    }

    /* src\components\InputSelect.svelte generated by Svelte v3.24.1 */
    const file$c = "src\\components\\InputSelect.svelte";

    const get_default_slot_changes_2 = dirty => ({
    	option: dirty[0] & /*filteredOptions*/ 32768
    });

    const get_default_slot_context_2 = ctx => ({ option: /*option*/ ctx[39] });

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    const get_default_slot_changes_1 = dirty => ({
    	option: dirty[0] & /*selectedOptions*/ 65536
    });

    const get_default_slot_context_1 = ctx => ({ option: /*option*/ ctx[39] });

    const get_default_slot_changes = dirty => ({
    	option: dirty[0] & /*selectedOptions*/ 65536
    });

    const get_default_slot_context = ctx => ({ option: /*option*/ ctx[39] });

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    // (13:3) {#if selectedOptions.length === 0 || (!multiple && selectedOptions[0].value)}
    function create_if_block_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*prefixLabel*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prefixLabel*/ 16) set_data_dev(t, /*prefixLabel*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(13:3) {#if selectedOptions.length === 0 || (!multiple && selectedOptions[0].value)}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {:else}
    function create_else_block_1(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[25].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[24], get_default_slot_context_1);
    	const default_slot_or_fallback = default_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(span, "class", "select-input-text svelte-qly777");
    			add_location(span, file$c, 22, 5, 758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope, selectedOptions*/ 16842752) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[24], dirty, get_default_slot_changes_1, get_default_slot_context_1);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*selectedOptions*/ 65536) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(22:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#if multiple}
    function create_if_block_4(ctx) {
    	let t;
    	let span;
    	let current;
    	let if_block = /*index*/ ctx[41] > 0 && create_if_block_5(ctx);
    	const default_slot_template = /*$$slots*/ ctx[25].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[24], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(span, "class", "select-input-text svelte-qly777");
    			add_location(span, file$c, 16, 5, 625);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, span, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*index*/ ctx[41] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope, selectedOptions*/ 16842752) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[24], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*selectedOptions*/ 65536) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(span);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(15:4) {#if multiple}",
    		ctx
    	});

    	return block;
    }

    // (24:21)          
    function fallback_block_2(ctx) {
    	let html_tag;
    	let raw_value = /*option*/ ctx[39].label + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedOptions*/ 65536 && raw_value !== (raw_value = /*option*/ ctx[39].label + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(24:21)          ",
    		ctx
    	});

    	return block;
    }

    // (16:5) {#if index > 0}
    function create_if_block_5(ctx) {
    	let t0;

    	let t1_value = (/*inline*/ ctx[9] && /*index*/ ctx[41] == /*selectedOptions*/ ctx[16].length - 1
    	? " and"
    	: "") + "";

    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(",");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inline, selectedOptions*/ 66048 && t1_value !== (t1_value = (/*inline*/ ctx[9] && /*index*/ ctx[41] == /*selectedOptions*/ ctx[16].length - 1
    			? " and"
    			: "") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(16:5) {#if index > 0}",
    		ctx
    	});

    	return block;
    }

    // (18:21)          
    function fallback_block_1(ctx) {
    	let html_tag;
    	let raw_value = /*option*/ ctx[39].label + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedOptions*/ 65536 && raw_value !== (raw_value = /*option*/ ctx[39].label + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(18:21)          ",
    		ctx
    	});

    	return block;
    }

    // (14:3) {#each selectedOptions as option, index (option)}
    function create_each_block_1$3(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*multiple*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(14:3) {#each selectedOptions as option, index (option)}",
    		ctx
    	});

    	return block;
    }

    // (30:3) {#if selectedOptions == null || selectedOptions.length === 0}
    function create_if_block_3$1(ctx) {
    	let span;

    	let t_value = (/*placeholder*/ ctx[5] != null
    	? /*placeholder*/ ctx[5]
    	: "") + "";

    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "select-input-text svelte-qly777");
    			add_location(span, file$c, 30, 4, 966);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*placeholder*/ 32 && t_value !== (t_value = (/*placeholder*/ ctx[5] != null
    			? /*placeholder*/ ctx[5]
    			: "") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(30:3) {#if selectedOptions == null || selectedOptions.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (39:1) {#if isOpen && !disabled}
    function create_if_block$7(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block = /*filterable*/ ctx[6] && create_if_block_2$2(ctx);
    	let each_value = /*filteredOptions*/ ctx[15];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(div, "class", "select-dropdown svelte-qly777");
    			add_location(div, file$c, 39, 2, 1196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*filterable*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*filterable*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*filteredOptions, viewIndex, toggle, $$scope, filter*/ 16957442) {
    				each_value = /*filteredOptions*/ ctx[15];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block$1(ctx);
    					each_1_else.c();
    					each_1_else.m(div, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(39:1) {#if isOpen && !disabled}",
    		ctx
    	});

    	return block;
    }

    // (41:3) {#if filterable}
    function create_if_block_2$2(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t;
    	let a;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { data: removeIcon, class: "fw" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t = space();
    			a = element("a");
    			create_component(icon.$$.fragment);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", /*filterPlaceholder*/ ctx[11]);
    			input.autofocus = true;
    			add_location(input, file$c, 43, 6, 1312);
    			attr_dev(a, "class", "input-group-addon");
    			attr_dev(a, "href", "/");
    			attr_dev(a, "tabindex", "-1");
    			add_location(a, file$c, 44, 6, 1449);
    			attr_dev(div0, "class", "input-group");
    			add_location(div0, file$c, 42, 5, 1279);
    			attr_dev(div1, "class", "filter svelte-qly777");
    			add_location(div1, file$c, 41, 4, 1252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*filter*/ ctx[1]);
    			append_dev(div0, t);
    			append_dev(div0, a);
    			mount_component(icon, a, null);
    			current = true;
    			input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[27]),
    					listen_dev(input, "keydown", /*keyListener*/ ctx[19], false, false, false),
    					listen_dev(a, "click", prevent_default(/*click_handler*/ ctx[28]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*filterPlaceholder*/ 2048) {
    				attr_dev(input, "placeholder", /*filterPlaceholder*/ ctx[11]);
    			}

    			if (dirty[0] & /*filter*/ 2 && input.value !== /*filter*/ ctx[1]) {
    				set_input_value(input, /*filter*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(41:3) {#if filterable}",
    		ctx
    	});

    	return block;
    }

    // (62:3) {:else}
    function create_else_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*filter*/ ctx[1] != null && /*filter*/ ctx[1].length > 0 && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*filter*/ ctx[1] != null && /*filter*/ ctx[1].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(62:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if filter != null && filter.length > 0}
    function create_if_block_1$4(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("No options match \"");
    			t1 = text(/*filter*/ ctx[1]);
    			t2 = text("\"");
    			attr_dev(div, "class", "alert alert-warning");
    			add_location(div, file$c, 63, 5, 2048);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filter*/ 2) set_data_dev(t1, /*filter*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(63:4) {#if filter != null && filter.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (58:20)         
    function fallback_block$3(ctx) {
    	let html_tag;
    	let raw_value = /*option*/ ctx[39].label + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredOptions*/ 32768 && raw_value !== (raw_value = /*option*/ ctx[39].label + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(58:20)         ",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each filteredOptions as option, index}
    function create_each_block$4(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[25].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[24], get_default_slot_context_2);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[29](/*option*/ ctx[39], /*index*/ ctx[41], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			attr_dev(div, "class", "item svelte-qly777");
    			toggle_class(div, "selected", /*option*/ ctx[39].selected);
    			toggle_class(div, "viewing", /*viewIndex*/ ctx[14] == /*index*/ ctx[41]);
    			toggle_class(div, "disabled", /*option*/ ctx[39].disabled);
    			add_location(div, file$c, 51, 4, 1691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope, filteredOptions*/ 16809984) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[24], dirty, get_default_slot_changes_2, get_default_slot_context_2);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*filteredOptions*/ 32768) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (dirty[0] & /*filteredOptions*/ 32768) {
    				toggle_class(div, "selected", /*option*/ ctx[39].selected);
    			}

    			if (dirty[0] & /*viewIndex*/ 16384) {
    				toggle_class(div, "viewing", /*viewIndex*/ ctx[14] == /*index*/ ctx[41]);
    			}

    			if (dirty[0] & /*filteredOptions*/ 32768) {
    				toggle_class(div, "disabled", /*option*/ ctx[39].disabled);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(51:3) {#each filteredOptions as option, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t1;
    	let t2;
    	let span;
    	let icon;
    	let div1_class_value;
    	let div1_data_test_value;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = (/*selectedOptions*/ ctx[16].length === 0 || !/*multiple*/ ctx[3] && /*selectedOptions*/ ctx[16][0].value) && create_if_block_6(ctx);
    	let each_value_1 = /*selectedOptions*/ ctx[16];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*option*/ ctx[39];
    	validate_each_keys(ctx, each_value_1, get_each_context_1$3, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$3(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$3(key, child_ctx));
    	}

    	let if_block1 = (/*selectedOptions*/ ctx[16] == null || /*selectedOptions*/ ctx[16].length === 0) && create_if_block_3$1(ctx);

    	icon = new Icon({
    			props: { data: caretDownIcon, class: "fw" },
    			$$inline: true
    		});

    	let if_block2 = /*isOpen*/ ctx[0] && !/*disabled*/ ctx[7] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			span = element("span");
    			create_component(icon.$$.fragment);
    			t3 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "input-select-content svelte-qly777");
    			add_location(div0, file$c, 11, 2, 321);
    			attr_dev(span, "class", "dropdown-icon svelte-qly777");
    			add_location(span, file$c, 33, 2, 1069);
    			attr_dev(div1, "class", div1_class_value = "btn btn-light " + /*className*/ ctx[8] + " svelte-qly777");
    			attr_dev(div1, "data-test", div1_data_test_value = "" + (/*name*/ ctx[2] + "-btn"));
    			attr_dev(div1, "tabindex", tabindex$1);
    			toggle_class(div1, "btn-sm", /*sm*/ ctx[10]);
    			toggle_class(div1, "open", /*isOpen*/ ctx[0]);
    			add_location(div1, file$c, 1, 1, 100);
    			attr_dev(div2, "class", "select svelte-qly777");
    			attr_dev(div2, "data-test", /*name*/ ctx[2]);
    			attr_dev(div2, "id", /*name*/ ctx[2]);
    			toggle_class(div2, "inline", /*inline*/ ctx[9]);
    			toggle_class(div2, "disabled", /*disabled*/ ctx[7]);
    			add_location(div2, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div0, t1);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div1, t2);
    			append_dev(div1, span);
    			mount_component(icon, span, null);
    			/*div1_binding*/ ctx[26](div1);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			/*div2_binding*/ ctx[30](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*open*/ ctx[18], false, false, false),
    					listen_dev(div1, "focus", /*open*/ ctx[18], false, false, false),
    					listen_dev(div1, "keydown", /*keyListener*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*selectedOptions*/ ctx[16].length === 0 || !/*multiple*/ ctx[3] && /*selectedOptions*/ ctx[16][0].value) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*selectedOptions, $$scope, inline, multiple*/ 16843272) {
    				const each_value_1 = /*selectedOptions*/ ctx[16];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div0, outro_and_destroy_block, create_each_block_1$3, t1, get_each_context_1$3);
    				check_outros();
    			}

    			if (/*selectedOptions*/ ctx[16] == null || /*selectedOptions*/ ctx[16].length === 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty[0] & /*className*/ 256 && div1_class_value !== (div1_class_value = "btn btn-light " + /*className*/ ctx[8] + " svelte-qly777")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*name*/ 4 && div1_data_test_value !== (div1_data_test_value = "" + (/*name*/ ctx[2] + "-btn"))) {
    				attr_dev(div1, "data-test", div1_data_test_value);
    			}

    			if (dirty[0] & /*className, sm*/ 1280) {
    				toggle_class(div1, "btn-sm", /*sm*/ ctx[10]);
    			}

    			if (dirty[0] & /*className, isOpen*/ 257) {
    				toggle_class(div1, "open", /*isOpen*/ ctx[0]);
    			}

    			if (/*isOpen*/ ctx[0] && !/*disabled*/ ctx[7]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*isOpen, disabled*/ 129) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$7(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*name*/ 4) {
    				attr_dev(div2, "data-test", /*name*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*name*/ 4) {
    				attr_dev(div2, "id", /*name*/ ctx[2]);
    			}

    			if (dirty[0] & /*inline*/ 512) {
    				toggle_class(div2, "inline", /*inline*/ ctx[9]);
    			}

    			if (dirty[0] & /*disabled*/ 128) {
    				toggle_class(div2, "disabled", /*disabled*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (if_block1) if_block1.d();
    			destroy_component(icon);
    			/*div1_binding*/ ctx[26](null);
    			if (if_block2) if_block2.d();
    			/*div2_binding*/ ctx[30](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const tabindex$1 = 0;

    function instance$e($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { name = null } = $$props;
    	let { multiple = false } = $$props;
    	let { prefixLabel = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { options = null } = $$props;
    	let { valueProp = null } = $$props;
    	let { labelProp = null } = $$props;
    	let { value = null } = $$props;
    	const initialValue = value;
    	const markDirty = getContext("markDirty");
    	let { filterable = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { disabled = false } = $$props;

    	// class will get added to the form-control, for if you want to do form-control-lg, form-control-sm, etc to match the rest of your form
    	let { class: className = "" } = $$props;

    	let { inline = false } = $$props;
    	let { sm = false } = $$props;
    	let container = null;
    	let fakeField = null;
    	let { filter = "" } = $$props;
    	let { filterPlaceholder = "Filter" } = $$props;

    	// option we're currently viewing w/ keyboard navigation
    	let viewIndex = -1;

    	function makeValueArray() {
    		if (!Array.isArray(value)) $$invalidate(20, value = [value]); else $$invalidate(20, value = optionsToArray(options, value).filter(o => o.selected).map(option => option.value));
    	}

    	function optionsToArray(_options, v) {
    		const arr = _options == null
    		? []
    		: _options.map(o => {
    				const isString = typeof o === "string";

    				// in case they pass a custom object with other keys they need in a custom label, we destructure the original option object
    				const option = isString ? {} : { ...o };

    				option.value = isString
    				? o
    				: valueProp != null
    					? o[valueProp]
    					: o.value !== undefined ? o.value : o;

    				option.label = isString
    				? o
    				: o[labelProp] !== undefined
    					? o[labelProp]
    					: o.label !== undefined ? o.label : o;

    				option.selected = multiple
    				? v != null && v.indexOf(option.value) > -1
    				: v == option.value;

    				option.disabled = o.disabled === undefined ? false : o.disabled;
    				return option;
    			});

    		return arr;
    	}

    	function toggle(option, setViewIndex) {
    		if (multiple) {
    			$$invalidate(20, value = option.selected
    			? (value || []).filter(v => v != option.value)
    			: (value || []).concat(option.value));

    			// if user clicked an option in multi-select, refocus the fakeField
    			if (document.activeElement != fakeField) focusField();
    		} else {
    			$$invalidate(20, value = option.value);
    			close();
    		}

    		if (setViewIndex != null) $$invalidate(14, viewIndex = setViewIndex);
    		dispatch("change");
    	}

    	async function open() {
    		if (disabled) return;
    		$$invalidate(0, isOpen = true);

    		const selected = multiple
    		? value != null && value.length > 0 ? value[0] : null
    		: value;

    		$$invalidate(14, viewIndex = selected != null
    		? filteredOptions.findIndex(o => o.value === selected)
    		: -1);

    		document.addEventListener("mousedown", clickListener);
    		document.addEventListener("touchstart", clickListener);
    		await tick();
    		if (isOpen) focusField();
    	}

    	function close() {
    		// focus the non-field so tabbing/shift-tabbing works after close
    		focusField();

    		$$invalidate(0, isOpen = false);
    		document.removeEventListener("mousedown", clickListener);
    		document.removeEventListener("touchstart", clickListener);
    	}

    	function keyListener(e) {
    		// if tab, close and let them out
    		if (e.code == "Tab") {
    			close();
    			return;
    		}

    		// otherwise, if we're not open, any key should open
    		if (!isOpen) {
    			// except shift, so shift-tab doesn't open before closing immediately anyway
    			// and up, cuz it feels weird
    			if (e.code == "ShiftLeft" || e.code == "ShiftRight" || e.code == "ArrowUp") return;

    			open();
    			return;
    		}

    		// otherwise, handle a few keys for navigating options and toggling them
    		switch (e.code) {
    			case "Escape":
    				e.stopPropagation();
    				close();
    				break;
    			case "Space":
    			case "Enter":
    				if (viewIndex != null && filteredOptions[viewIndex] != null) {
    					toggle(filteredOptions[viewIndex]);
    					e.preventDefault();
    				}
    				break;
    			case "ArrowUp":
    				$$invalidate(14, viewIndex--, viewIndex);
    				if (filterable && viewIndex == -2 || !filterable && viewIndex <= -1) close();
    				e.preventDefault();
    				break;
    			case "ArrowDown":
    				if (!isOpen) open(); else if (viewIndex < filteredOptions.length - 1) $$invalidate(14, viewIndex++, viewIndex);
    				e.preventDefault();
    				break;
    		}
    	}

    	function clickListener(e) {
    		if (e.target.closest == null || e.target.closest(".select") !== container) close();
    	}

    	function focusField() {
    		if (fakeField && !filterable) fakeField.focus();
    	}

    	const writable_props = [
    		"name",
    		"multiple",
    		"prefixLabel",
    		"placeholder",
    		"options",
    		"valueProp",
    		"labelProp",
    		"value",
    		"filterable",
    		"isOpen",
    		"disabled",
    		"class",
    		"inline",
    		"sm",
    		"filter",
    		"filterPlaceholder"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputSelect> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("InputSelect", $$slots, ['default']);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			fakeField = $$value;
    			$$invalidate(13, fakeField);
    		});
    	}

    	function input_input_handler() {
    		filter = this.value;
    		$$invalidate(1, filter);
    	}

    	const click_handler = () => $$invalidate(1, filter = "");
    	const click_handler_1 = (option, index) => option.disabled ? null : toggle(option, index);

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			container = $$value;
    			$$invalidate(12, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("multiple" in $$props) $$invalidate(3, multiple = $$props.multiple);
    		if ("prefixLabel" in $$props) $$invalidate(4, prefixLabel = $$props.prefixLabel);
    		if ("placeholder" in $$props) $$invalidate(5, placeholder = $$props.placeholder);
    		if ("options" in $$props) $$invalidate(21, options = $$props.options);
    		if ("valueProp" in $$props) $$invalidate(22, valueProp = $$props.valueProp);
    		if ("labelProp" in $$props) $$invalidate(23, labelProp = $$props.labelProp);
    		if ("value" in $$props) $$invalidate(20, value = $$props.value);
    		if ("filterable" in $$props) $$invalidate(6, filterable = $$props.filterable);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("disabled" in $$props) $$invalidate(7, disabled = $$props.disabled);
    		if ("class" in $$props) $$invalidate(8, className = $$props.class);
    		if ("inline" in $$props) $$invalidate(9, inline = $$props.inline);
    		if ("sm" in $$props) $$invalidate(10, sm = $$props.sm);
    		if ("filter" in $$props) $$invalidate(1, filter = $$props.filter);
    		if ("filterPlaceholder" in $$props) $$invalidate(11, filterPlaceholder = $$props.filterPlaceholder);
    		if ("$$scope" in $$props) $$invalidate(24, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		removeIcon,
    		caretDownIcon,
    		_filter,
    		validator,
    		tick,
    		getContext,
    		createEventDispatcher,
    		dispatch,
    		name,
    		multiple,
    		prefixLabel,
    		placeholder,
    		options,
    		valueProp,
    		labelProp,
    		value,
    		initialValue,
    		markDirty,
    		filterable,
    		isOpen,
    		disabled,
    		className,
    		inline,
    		sm,
    		container,
    		fakeField,
    		tabindex: tabindex$1,
    		filter,
    		filterPlaceholder,
    		viewIndex,
    		makeValueArray,
    		optionsToArray,
    		toggle,
    		open,
    		close,
    		keyListener,
    		clickListener,
    		focusField,
    		filteredOptions,
    		selectedOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("multiple" in $$props) $$invalidate(3, multiple = $$props.multiple);
    		if ("prefixLabel" in $$props) $$invalidate(4, prefixLabel = $$props.prefixLabel);
    		if ("placeholder" in $$props) $$invalidate(5, placeholder = $$props.placeholder);
    		if ("options" in $$props) $$invalidate(21, options = $$props.options);
    		if ("valueProp" in $$props) $$invalidate(22, valueProp = $$props.valueProp);
    		if ("labelProp" in $$props) $$invalidate(23, labelProp = $$props.labelProp);
    		if ("value" in $$props) $$invalidate(20, value = $$props.value);
    		if ("filterable" in $$props) $$invalidate(6, filterable = $$props.filterable);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("disabled" in $$props) $$invalidate(7, disabled = $$props.disabled);
    		if ("className" in $$props) $$invalidate(8, className = $$props.className);
    		if ("inline" in $$props) $$invalidate(9, inline = $$props.inline);
    		if ("sm" in $$props) $$invalidate(10, sm = $$props.sm);
    		if ("container" in $$props) $$invalidate(12, container = $$props.container);
    		if ("fakeField" in $$props) $$invalidate(13, fakeField = $$props.fakeField);
    		if ("filter" in $$props) $$invalidate(1, filter = $$props.filter);
    		if ("filterPlaceholder" in $$props) $$invalidate(11, filterPlaceholder = $$props.filterPlaceholder);
    		if ("viewIndex" in $$props) $$invalidate(14, viewIndex = $$props.viewIndex);
    		if ("filteredOptions" in $$props) $$invalidate(15, filteredOptions = $$props.filteredOptions);
    		if ("selectedOptions" in $$props) $$invalidate(16, selectedOptions = $$props.selectedOptions);
    	};

    	let filteredOptions;
    	let selectedOptions;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*value*/ 1048576) {
    			 if (markDirty != null && value != null && !validator.equals(value, initialValue)) markDirty();
    		}

    		if ($$self.$$.dirty[0] & /*options, value, filterable, filter*/ 3145794) {
    			// options to render, filtered if necessary
    			 $$invalidate(15, filteredOptions = (() => {
    				const arr = optionsToArray(options, value);
    				return !filterable ? arr : _filter(arr, filter);
    			})());
    		}

    		if ($$self.$$.dirty[0] & /*viewIndex, filteredOptions, filterable*/ 49216) {
    			// keep viewIndex within filteredOptions length
    			 {
    				if (viewIndex > filteredOptions.length - 1) $$invalidate(14, viewIndex = filteredOptions.length - 1);
    				if (viewIndex < -1) $$invalidate(14, viewIndex = filterable ? -1 : -1);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*multiple, value*/ 1048584) {
    			// if multiple...
    			// make sure value is always array
    			// make sure value is always sorted to match option order - just nice to pass the same order around regardless of user click order
    			 if (multiple && value) makeValueArray();
    		}

    		if ($$self.$$.dirty[0] & /*options, value, multiple*/ 3145736) {
    			// options to render in the selected box (so we can use the same slot logic)
    			 $$invalidate(16, selectedOptions = optionsToArray(options, value).filter(option => multiple
    			? value && value.indexOf(option.value) > -1
    			: value == option.value));
    		}
    	};

    	return [
    		isOpen,
    		filter,
    		name,
    		multiple,
    		prefixLabel,
    		placeholder,
    		filterable,
    		disabled,
    		className,
    		inline,
    		sm,
    		filterPlaceholder,
    		container,
    		fakeField,
    		viewIndex,
    		filteredOptions,
    		selectedOptions,
    		toggle,
    		open,
    		keyListener,
    		value,
    		options,
    		valueProp,
    		labelProp,
    		$$scope,
    		$$slots,
    		div1_binding,
    		input_input_handler,
    		click_handler,
    		click_handler_1,
    		div2_binding
    	];
    }

    class InputSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$e,
    			create_fragment$e,
    			safe_not_equal,
    			{
    				name: 2,
    				multiple: 3,
    				prefixLabel: 4,
    				placeholder: 5,
    				options: 21,
    				valueProp: 22,
    				labelProp: 23,
    				value: 20,
    				filterable: 6,
    				isOpen: 0,
    				disabled: 7,
    				class: 8,
    				inline: 9,
    				sm: 10,
    				filter: 1,
    				filterPlaceholder: 11
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputSelect",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get name() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefixLabel() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefixLabel(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueProp() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueProp(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelProp() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelProp(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterable() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterable(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterPlaceholder() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterPlaceholder(value) {
    		throw new Error("<InputSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\FieldArtPicker.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$3 } = globals;
    const file$d = "src\\pages\\LevelBuilder\\components\\FieldArtPicker.svelte";

    // (3:8) Graphic
    function fallback_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Graphic");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(3:8) Graphic",
    		ctx
    	});

    	return block;
    }

    // (6:2) <InputSelect inline {name} bind:value let:option {options} filterable={options.length > 3} {placeholder}>
    function create_default_slot$3(ctx) {
    	let art;
    	let t0;
    	let t1_value = /*option*/ ctx[10].value + "";
    	let t1;
    	let current;

    	art = new Art({
    			props: {
    				name: /*option*/ ctx[10].value,
    				spin: /*spin*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(art.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			mount_component(art, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const art_changes = {};
    			if (dirty & /*option*/ 1024) art_changes.name = /*option*/ ctx[10].value;
    			if (dirty & /*spin*/ 2) art_changes.spin = /*spin*/ ctx[1];
    			art.$set(art_changes);
    			if ((!current || dirty & /*option*/ 1024) && t1_value !== (t1_value = /*option*/ ctx[10].value + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(art.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(art.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(art, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(6:2) <InputSelect inline {name} bind:value let:option {options} filterable={options.length > 3} {placeholder}>",
    		ctx
    	});

    	return block;
    }

    // (11:1) {#if value != null}
    function create_if_block$8(ctx) {
    	let a;
    	let t0;
    	let t1;
    	let t2;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text("Edit ");
    			t1 = text(/*value*/ ctx[0]);
    			t2 = text(" art");
    			attr_dev(a, "href", a_href_value = "#/level-builder/art/" + /*value*/ ctx[0]);
    			attr_dev(a, "class", "ml-1");
    			add_location(a, file$d, 11, 2, 311);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1) set_data_dev(t1, /*value*/ ctx[0]);

    			if (dirty & /*value*/ 1 && a_href_value !== (a_href_value = "#/level-builder/art/" + /*value*/ ctx[0])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(11:1) {#if value != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div1;
    	let label;
    	let t0;
    	let div0;
    	let inputselect;
    	let updating_value;
    	let t1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	const default_slot_or_fallback = default_slot || fallback_block$4(ctx);

    	function inputselect_value_binding(value) {
    		/*inputselect_value_binding*/ ctx[7].call(null, value);
    	}

    	let inputselect_props = {
    		inline: true,
    		name: /*name*/ ctx[2],
    		options: /*options*/ ctx[4],
    		filterable: /*options*/ ctx[4].length > 3,
    		placeholder: /*placeholder*/ ctx[3],
    		$$slots: {
    			default: [
    				create_default_slot$3,
    				({ option }) => ({ 10: option }),
    				({ option }) => option ? 1024 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		inputselect_props.value = /*value*/ ctx[0];
    	}

    	inputselect = new InputSelect({ props: inputselect_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputselect, "value", inputselect_value_binding));
    	let if_block = /*value*/ ctx[0] != null && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(inputselect.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(label, "for", "graphic");
    			add_location(label, file$d, 1, 1, 27);
    			add_location(div0, file$d, 4, 1, 86);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(label, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(inputselect, div0, null);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			const inputselect_changes = {};
    			if (dirty & /*name*/ 4) inputselect_changes.name = /*name*/ ctx[2];
    			if (dirty & /*options*/ 16) inputselect_changes.options = /*options*/ ctx[4];
    			if (dirty & /*options*/ 16) inputselect_changes.filterable = /*options*/ ctx[4].length > 3;
    			if (dirty & /*placeholder*/ 8) inputselect_changes.placeholder = /*placeholder*/ ctx[3];

    			if (dirty & /*$$scope, option, spin*/ 1282) {
    				inputselect_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				inputselect_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputselect.$set(inputselect_changes);

    			if (/*value*/ ctx[0] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			transition_in(inputselect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			transition_out(inputselect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			destroy_component(inputselect);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $artStore;
    	validate_store(artStore, "artStore");
    	component_subscribe($$self, artStore, $$value => $$invalidate(9, $artStore = $$value));
    	let { value = null } = $$props;
    	let { filter = null } = $$props;
    	let { spin = false } = $$props;
    	let { name = "graphic-picker" } = $$props;
    	let { placeholder = "Select art" } = $$props;
    	const writable_props = ["value", "filter", "spin", "name", "placeholder"];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldArtPicker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldArtPicker", $$slots, ['default']);

    	function inputselect_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("filter" in $$props) $$invalidate(5, filter = $$props.filter);
    		if ("spin" in $$props) $$invalidate(1, spin = $$props.spin);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("placeholder" in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Art,
    		artStore,
    		InputSelect,
    		value,
    		filter,
    		spin,
    		name,
    		placeholder,
    		options,
    		$artStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("filter" in $$props) $$invalidate(5, filter = $$props.filter);
    		if ("spin" in $$props) $$invalidate(1, spin = $$props.spin);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("placeholder" in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ("options" in $$props) $$invalidate(4, options = $$props.options);
    	};

    	let options;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$artStore, filter*/ 544) {
    			 $$invalidate(4, options = Object.keys($artStore).filter(name => filter == null || filter($artStore[name])));
    		}
    	};

    	return [
    		value,
    		spin,
    		name,
    		placeholder,
    		options,
    		filter,
    		$$slots,
    		inputselect_value_binding,
    		$$scope
    	];
    }

    class FieldArtPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			value: 0,
    			filter: 5,
    			spin: 1,
    			name: 2,
    			placeholder: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldArtPicker",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldArtPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FieldArtPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter() {
    		throw new Error("<FieldArtPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter(value) {
    		throw new Error("<FieldArtPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<FieldArtPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<FieldArtPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<FieldArtPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<FieldArtPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<FieldArtPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<FieldArtPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\FieldCheckbox.svelte generated by Svelte v3.24.1 */

    const file$e = "src\\pages\\LevelBuilder\\components\\FieldCheckbox.svelte";

    function create_fragment$g(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t;
    	let label;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t = space();
    			label = element("label");
    			if (default_slot) default_slot.c();
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "form-check-input");
    			add_location(input, file$e, 2, 2, 55);
    			attr_dev(label, "class", "form-check-label");
    			attr_dev(label, "for", /*name*/ ctx[1]);
    			add_location(label, file$e, 3, 2, 139);
    			attr_dev(div0, "class", "form-check");
    			add_location(div0, file$e, 1, 1, 27);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			input.checked = /*checked*/ ctx[0];
    			append_dev(div0, t);
    			append_dev(div0, label);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(input, "name", /*name*/ ctx[1]);
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(input, "id", /*name*/ ctx[1]);
    			}

    			if (dirty & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(label, "for", /*name*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { checked = null } = $$props;
    	let { name = "check" } = $$props;
    	const writable_props = ["checked", "name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldCheckbox> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldCheckbox", $$slots, ['default']);

    	function input_change_handler() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	$$self.$$set = $$props => {
    		if ("checked" in $$props) $$invalidate(0, checked = $$props.checked);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ checked, name });

    	$$self.$inject_state = $$props => {
    		if ("checked" in $$props) $$invalidate(0, checked = $$props.checked);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [checked, name, $$scope, $$slots, input_change_handler];
    }

    class FieldCheckbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { checked: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldCheckbox",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get checked() {
    		throw new Error("<FieldCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<FieldCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<FieldCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<FieldCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\FieldNumber.svelte generated by Svelte v3.24.1 */

    const file$f = "src\\pages\\LevelBuilder\\components\\FieldNumber.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let label;
    	let t;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			if (default_slot) default_slot.c();
    			t = space();
    			input = element("input");
    			attr_dev(label, "for", /*name*/ ctx[1]);
    			add_location(label, file$f, 1, 1, 27);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", /*min*/ ctx[2]);
    			attr_dev(input, "max", /*max*/ ctx[3]);
    			attr_dev(input, "step", /*step*/ ctx[4]);
    			attr_dev(input, "class", "form-control");
    			add_location(input, file$f, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			append_dev(div, t);
    			append_dev(div, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(label, "for", /*name*/ ctx[1]);
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(input, "name", /*name*/ ctx[1]);
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(input, "id", /*name*/ ctx[1]);
    			}

    			if (!current || dirty & /*min*/ 4) {
    				attr_dev(input, "min", /*min*/ ctx[2]);
    			}

    			if (!current || dirty & /*max*/ 8) {
    				attr_dev(input, "max", /*max*/ ctx[3]);
    			}

    			if (!current || dirty & /*step*/ 16) {
    				attr_dev(input, "step", /*step*/ ctx[4]);
    			}

    			if (dirty & /*value*/ 1 && to_number(input.value) !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { value = null } = $$props;
    	let { name = "num" } = $$props;
    	let { min = null } = $$props;
    	let { max = null } = $$props;
    	let { step = 1 } = $$props;
    	const writable_props = ["value", "name", "min", "max", "step"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldNumber> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldNumber", $$slots, ['default']);

    	function input_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("min" in $$props) $$invalidate(2, min = $$props.min);
    		if ("max" in $$props) $$invalidate(3, max = $$props.max);
    		if ("step" in $$props) $$invalidate(4, step = $$props.step);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ value, name, min, max, step });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("min" in $$props) $$invalidate(2, min = $$props.min);
    		if ("max" in $$props) $$invalidate(3, max = $$props.max);
    		if ("step" in $$props) $$invalidate(4, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, name, min, max, step, $$scope, $$slots, input_input_handler];
    }

    class FieldNumber extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			value: 0,
    			name: 1,
    			min: 2,
    			max: 3,
    			step: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldNumber",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FieldNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<FieldNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<FieldNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<FieldNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<FieldNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<FieldNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<FieldNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<FieldNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<FieldNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var blockStore = LocalStorageStore('blocks', {
    	grass: { name: 'grass', solid: true, dps: 0, dpsToPlayers: null, graphic: 'grass', width: 30, height: 30 },
    	spikes: { name: 'spikes', solid: true, dps: 1000, dpsToPlayers: 100, graphic: 'spike', width: 30, height: 30, throwOnTouch: true },
    	lava: { name: 'lava', solid: true, dps: 10000, dpsToPlayers: 1000, graphic: 'lava', throwOnTouch: true },
    	dirt: { name: 'dirt', solid: true, dps: 0, dpsToPlayers: null, graphic: 'dirt' },
    });

    /* src\pages\LevelBuilder\BlockBuilder.svelte generated by Svelte v3.24.1 */
    const file$g = "src\\pages\\LevelBuilder\\BlockBuilder.svelte";

    // (3:2) <FieldText name="name" bind:value={input.name} autofocus>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Name");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(3:2) <FieldText name=\\\"name\\\" bind:value={input.name} autofocus>",
    		ctx
    	});

    	return block;
    }

    // (4:2) <FieldArtPicker bind:value={input.graphic} filter={b => b.width == 20 && b.height == 20}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Graphic (must be 20x20)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(4:2) <FieldArtPicker bind:value={input.graphic} filter={b => b.width == 20 && b.height == 20}>",
    		ctx
    	});

    	return block;
    }

    // (5:2) <FieldCheckbox name="solid" bind:checked={input.solid}>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Solid?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(5:2) <FieldCheckbox name=\\\"solid\\\" bind:checked={input.solid}>",
    		ctx
    	});

    	return block;
    }

    // (6:2) <FieldCheckbox name="throwOnTouch" bind:checked={input.throwOnTouch}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Throw things that touch it?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(6:2) <FieldCheckbox name=\\\"throwOnTouch\\\" bind:checked={input.throwOnTouch}>",
    		ctx
    	});

    	return block;
    }

    // (7:2) <FieldNumber name="dps" bind:value={input.dps}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("DPS (when players or enemies touch this block, how much damage should they take per second?)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(7:2) <FieldNumber name=\\\"dps\\\" bind:value={input.dps}>",
    		ctx
    	});

    	return block;
    }

    // (11:3) {#if !isAdding}
    function create_if_block$9(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$g, 11, 4, 736);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(11:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (10:2) <span slot="buttons">
    function create_buttons_slot$1(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$g, 9, 2, 689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*isAdding*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_buttons_slot$1.name,
    		type: "slot",
    		source: "(10:2) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (2:1) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$1(ctx) {
    	let fieldtext;
    	let updating_value;
    	let t0;
    	let fieldartpicker;
    	let updating_value_1;
    	let t1;
    	let fieldcheckbox0;
    	let updating_checked;
    	let t2;
    	let fieldcheckbox1;
    	let updating_checked_1;
    	let t3;
    	let fieldnumber;
    	let updating_value_2;
    	let t4;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[7].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		autofocus: true,
    		$$slots: { default: [create_default_slot_6] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext = new FieldText({ props: fieldtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext, "value", fieldtext_value_binding));

    	function fieldartpicker_value_binding(value) {
    		/*fieldartpicker_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldartpicker_props = {
    		filter: func,
    		$$slots: { default: [create_default_slot_5] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphic !== void 0) {
    		fieldartpicker_props.value = /*input*/ ctx[0].graphic;
    	}

    	fieldartpicker = new FieldArtPicker({
    			props: fieldartpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker, "value", fieldartpicker_value_binding));

    	function fieldcheckbox0_checked_binding(value) {
    		/*fieldcheckbox0_checked_binding*/ ctx[9].call(null, value);
    	}

    	let fieldcheckbox0_props = {
    		name: "solid",
    		$$slots: { default: [create_default_slot_4] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].solid !== void 0) {
    		fieldcheckbox0_props.checked = /*input*/ ctx[0].solid;
    	}

    	fieldcheckbox0 = new FieldCheckbox({
    			props: fieldcheckbox0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox0, "checked", fieldcheckbox0_checked_binding));

    	function fieldcheckbox1_checked_binding(value) {
    		/*fieldcheckbox1_checked_binding*/ ctx[10].call(null, value);
    	}

    	let fieldcheckbox1_props = {
    		name: "throwOnTouch",
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].throwOnTouch !== void 0) {
    		fieldcheckbox1_props.checked = /*input*/ ctx[0].throwOnTouch;
    	}

    	fieldcheckbox1 = new FieldCheckbox({
    			props: fieldcheckbox1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox1, "checked", fieldcheckbox1_checked_binding));

    	function fieldnumber_value_binding(value) {
    		/*fieldnumber_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber_props = {
    		name: "dps",
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].dps !== void 0) {
    		fieldnumber_props.value = /*input*/ ctx[0].dps;
    	}

    	fieldnumber = new FieldNumber({ props: fieldnumber_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldnumber, "value", fieldnumber_value_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext.$$.fragment);
    			t0 = space();
    			create_component(fieldartpicker.$$.fragment);
    			t1 = space();
    			create_component(fieldcheckbox0.$$.fragment);
    			t2 = space();
    			create_component(fieldcheckbox1.$$.fragment);
    			t3 = space();
    			create_component(fieldnumber.$$.fragment);
    			t4 = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldartpicker, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldcheckbox0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(fieldcheckbox1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fieldnumber, target, anchor);
    			insert_dev(target, t4, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				fieldtext_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext.$set(fieldtext_changes);
    			const fieldartpicker_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				fieldartpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker_changes.value = /*input*/ ctx[0].graphic;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker.$set(fieldartpicker_changes);
    			const fieldcheckbox0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				fieldcheckbox0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*input*/ 1) {
    				updating_checked = true;
    				fieldcheckbox0_changes.checked = /*input*/ ctx[0].solid;
    				add_flush_callback(() => updating_checked = false);
    			}

    			fieldcheckbox0.$set(fieldcheckbox0_changes);
    			const fieldcheckbox1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				fieldcheckbox1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked_1 && dirty & /*input*/ 1) {
    				updating_checked_1 = true;
    				fieldcheckbox1_changes.checked = /*input*/ ctx[0].throwOnTouch;
    				add_flush_callback(() => updating_checked_1 = false);
    			}

    			fieldcheckbox1.$set(fieldcheckbox1_changes);
    			const fieldnumber_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				fieldnumber_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber_changes.value = /*input*/ ctx[0].dps;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber.$set(fieldnumber_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext.$$.fragment, local);
    			transition_in(fieldartpicker.$$.fragment, local);
    			transition_in(fieldcheckbox0.$$.fragment, local);
    			transition_in(fieldcheckbox1.$$.fragment, local);
    			transition_in(fieldnumber.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldartpicker.$$.fragment, local);
    			transition_out(fieldcheckbox0.$$.fragment, local);
    			transition_out(fieldcheckbox1.$$.fragment, local);
    			transition_out(fieldnumber.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldartpicker, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldcheckbox0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(fieldcheckbox1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fieldnumber, detaching);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(2:1) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <LevelBuilderLayout tab="blocks" activeName={input.name} store={$blocks}>
    function create_default_slot$4(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$1],
    					buttons: [create_buttons_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};
    			if (dirty & /*hasChanges*/ 4) form_changes.hasChanges = /*hasChanges*/ ctx[2];

    			if (dirty & /*$$scope, input, isAdding*/ 65539) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(1:0) <LevelBuilderLayout tab=\\\"blocks\\\" activeName={input.name} store={$blocks}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let levelbuilderlayout;
    	let current;

    	levelbuilderlayout = new LevelBuilderLayout({
    			props: {
    				tab: "blocks",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$blocks*/ ctx[3],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(levelbuilderlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(levelbuilderlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const levelbuilderlayout_changes = {};
    			if (dirty & /*input*/ 1) levelbuilderlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty & /*$blocks*/ 8) levelbuilderlayout_changes.store = /*$blocks*/ ctx[3];

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 65543) {
    				levelbuilderlayout_changes.$$scope = { dirty, ctx };
    			}

    			levelbuilderlayout.$set(levelbuilderlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(levelbuilderlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(levelbuilderlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(levelbuilderlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = b => b.width == 20 && b.height == 20;

    function instance$i($$self, $$props, $$invalidate) {
    	let $blocks;
    	validate_store(blockStore, "blocks");
    	component_subscribe($$self, blockStore, $$value => $$invalidate(3, $blocks = $$value));
    	let { params = {} } = $$props;
    	let input;

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(blockStore, $blocks[input.name] = JSON.parse(JSON.stringify(input)), $blocks);
    		push(`/level-builder/blocks/${encodeURIComponent(input.name)}`);
    	}

    	function edit(name) {
    		if (!$blocks.hasOwnProperty(name)) return;
    		$$invalidate(0, input = JSON.parse(JSON.stringify($blocks[name])));
    	}

    	function create() {
    		$$invalidate(0, input = {
    			name: "",
    			solid: true,
    			throwOnTouch: false,
    			dps: 0
    		});
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) {
    			delete $blocks[name];
    			blockStore.set($blocks);
    			push("/level-builder/blocks/new");
    		}
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BlockBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BlockBuilder", $$slots, []);

    	function fieldtext_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker_value_binding(value) {
    		input.graphic = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox0_checked_binding(value) {
    		input.solid = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox1_checked_binding(value) {
    		input.throwOnTouch = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber_value_binding(value) {
    		input.dps = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		LevelBuilderLayout,
    		FieldArtPicker,
    		FieldText,
    		FieldCheckbox,
    		FieldNumber,
    		Form,
    		blocks: blockStore,
    		validator,
    		params,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		paramName,
    		isAdding,
    		hasChanges,
    		$blocks
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("paramName" in $$props) $$invalidate(13, paramName = $$props.paramName);
    		if ("isAdding" in $$props) $$invalidate(1, isAdding = $$props.isAdding);
    		if ("hasChanges" in $$props) $$invalidate(2, hasChanges = $$props.hasChanges);
    	};

    	let paramName;
    	let isAdding;
    	let hasChanges;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 64) {
    			 $$invalidate(13, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty & /*paramName*/ 8192) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty & /*paramName*/ 8192) {
    			 $$invalidate(1, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty & /*input, $blocks*/ 9) {
    			 $$invalidate(2, hasChanges = input != null && !validator.equals(input, $blocks[input.name]));
    		}
    	};

    	return [
    		input,
    		isAdding,
    		hasChanges,
    		$blocks,
    		save,
    		del,
    		params,
    		fieldtext_value_binding,
    		fieldartpicker_value_binding,
    		fieldcheckbox0_checked_binding,
    		fieldcheckbox1_checked_binding,
    		fieldnumber_value_binding,
    		click_handler
    	];
    }

    class BlockBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlockBuilder",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get params() {
    		throw new Error("<BlockBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<BlockBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var characters = LocalStorageStore('characters', {
    	'mr squiggles': {
    		graphicStill: 'mr squiggles',
    		name: 'mr squiggles',
    		maxVelocity: 5,
    		jumpVelocity: 15,
    		gravityMultiplier: 1,
    		fallDamageMultiplier: 1,
    		dps: 25,
    		dpsToPlayers: 5,
    		maxHealth: 200,
    	},
    	sonic: {
    		graphicStill: 'sonic',
    		name: 'sonic',
    		maxVelocity: 10,
    		jumpVelocity: 15,
    		gravityMultiplier: 1,
    		fallDamageMultiplier: 0,
    		dps: 200,
    		dpsToPlayers: 120,
    		maxHealth: 200,
    		graphicSpinning: 'sonic spinning',
    	},
    	'mr littles': {
    		graphicStill: 'alien',
    		graphicSpinning: 'alien',
    		name: 'mr littles',
    		maxVelocity: 8,
    		jumpVelocity: 15,
    		gravityMultiplier: 1,
    		fallDamageMultiplier: 1,
    		dps: 120,
    		maxHealth: 100,
    	},
    });

    /* src\pages\LevelBuilder\CharacterBuilder.svelte generated by Svelte v3.24.1 */
    const file$h = "src\\pages\\LevelBuilder\\CharacterBuilder.svelte";

    // (17:2) <FieldText name="name" bind:value={input.name} autofocus>
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Name");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(17:2) <FieldText name=\\\"name\\\" bind:value={input.name} autofocus>",
    		ctx
    	});

    	return block;
    }

    // (18:2) <FieldArtPicker bind:value={input.graphicStill} filter={notBlockFilter}>
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Standing still graphic");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(18:2) <FieldArtPicker bind:value={input.graphicStill} filter={notBlockFilter}>",
    		ctx
    	});

    	return block;
    }

    // (19:2) <FieldArtPicker bind:value={input.graphicSpinning} filter={notBlockFilter} spin>
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Spinning graphic");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(19:2) <FieldArtPicker bind:value={input.graphicSpinning} filter={notBlockFilter} spin>",
    		ctx
    	});

    	return block;
    }

    // (25:2) <FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Max velocity");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(25:2) <FieldNumber name=\\\"maxVelocity\\\" min={0} bind:value={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (26:2) <FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Jump velocity");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(26:2) <FieldNumber name=\\\"jumpVelocity\\\" min={0} bind:value={input.jumpVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (27:2) <FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gravity multiplier");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(27:2) <FieldNumber name=\\\"gravityMultiplier\\\" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (28:2) <FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Fall damage multiplier");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(28:2) <FieldNumber name=\\\"fallDamageMultiplier\\\" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (29:2) <FieldNumber name="maxHealth" bind:value={input.maxHealth}>
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Max health");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(29:2) <FieldNumber name=\\\"maxHealth\\\" bind:value={input.maxHealth}>",
    		ctx
    	});

    	return block;
    }

    // (30:2) <FieldNumber name="dps" bind:value={input.dps}>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("DPS (when in contact with enemies - we will replace this with abilities later)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(30:2) <FieldNumber name=\\\"dps\\\" bind:value={input.dps}>",
    		ctx
    	});

    	return block;
    }

    // (31:2) <FieldCheckbox name="canFly" bind:checked={input.canFly}>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Can fly?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(31:2) <FieldCheckbox name=\\\"canFly\\\" bind:checked={input.canFly}>",
    		ctx
    	});

    	return block;
    }

    // (33:3) {#if !isAdding}
    function create_if_block$a(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$h, 33, 4, 2132);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(33:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (32:2) <span slot="buttons">
    function create_buttons_slot$2(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$h, 31, 2, 2085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*isAdding*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_buttons_slot$2.name,
    		type: "slot",
    		source: "(32:2) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (16:1) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$2(ctx) {
    	let fieldtext;
    	let updating_value;
    	let t0;
    	let fieldartpicker0;
    	let updating_value_1;
    	let t1;
    	let fieldartpicker1;
    	let updating_value_2;
    	let t2;
    	let fieldnumber0;
    	let updating_value_3;
    	let t3;
    	let fieldnumber1;
    	let updating_value_4;
    	let t4;
    	let fieldnumber2;
    	let updating_value_5;
    	let t5;
    	let fieldnumber3;
    	let updating_value_6;
    	let t6;
    	let fieldnumber4;
    	let updating_value_7;
    	let t7;
    	let fieldnumber5;
    	let updating_value_8;
    	let t8;
    	let fieldcheckbox;
    	let updating_checked;
    	let t9;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		autofocus: true,
    		$$slots: { default: [create_default_slot_11] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext = new FieldText({ props: fieldtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext, "value", fieldtext_value_binding));

    	function fieldartpicker0_value_binding(value) {
    		/*fieldartpicker0_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldartpicker0_props = {
    		filter: /*notBlockFilter*/ ctx[4],
    		$$slots: { default: [create_default_slot_10] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphicStill !== void 0) {
    		fieldartpicker0_props.value = /*input*/ ctx[0].graphicStill;
    	}

    	fieldartpicker0 = new FieldArtPicker({
    			props: fieldartpicker0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker0, "value", fieldartpicker0_value_binding));

    	function fieldartpicker1_value_binding(value) {
    		/*fieldartpicker1_value_binding*/ ctx[10].call(null, value);
    	}

    	let fieldartpicker1_props = {
    		filter: /*notBlockFilter*/ ctx[4],
    		spin: true,
    		$$slots: { default: [create_default_slot_9] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphicSpinning !== void 0) {
    		fieldartpicker1_props.value = /*input*/ ctx[0].graphicSpinning;
    	}

    	fieldartpicker1 = new FieldArtPicker({
    			props: fieldartpicker1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker1, "value", fieldartpicker1_value_binding));

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "maxVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_8] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].maxVelocity !== void 0) {
    		fieldnumber0_props.value = /*input*/ ctx[0].maxVelocity;
    	}

    	fieldnumber0 = new FieldNumber({
    			props: fieldnumber0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber0, "value", fieldnumber0_value_binding));

    	function fieldnumber1_value_binding(value) {
    		/*fieldnumber1_value_binding*/ ctx[12].call(null, value);
    	}

    	let fieldnumber1_props = {
    		name: "jumpVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_7] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].jumpVelocity !== void 0) {
    		fieldnumber1_props.value = /*input*/ ctx[0].jumpVelocity;
    	}

    	fieldnumber1 = new FieldNumber({
    			props: fieldnumber1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber1, "value", fieldnumber1_value_binding));

    	function fieldnumber2_value_binding(value) {
    		/*fieldnumber2_value_binding*/ ctx[13].call(null, value);
    	}

    	let fieldnumber2_props = {
    		name: "gravityMultiplier",
    		min: 0,
    		max: 2,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_6$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].gravityMultiplier !== void 0) {
    		fieldnumber2_props.value = /*input*/ ctx[0].gravityMultiplier;
    	}

    	fieldnumber2 = new FieldNumber({
    			props: fieldnumber2_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber2, "value", fieldnumber2_value_binding));

    	function fieldnumber3_value_binding(value) {
    		/*fieldnumber3_value_binding*/ ctx[14].call(null, value);
    	}

    	let fieldnumber3_props = {
    		name: "fallDamageMultiplier",
    		min: 0,
    		max: 1,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_5$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].fallDamageMultiplier !== void 0) {
    		fieldnumber3_props.value = /*input*/ ctx[0].fallDamageMultiplier;
    	}

    	fieldnumber3 = new FieldNumber({
    			props: fieldnumber3_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber3, "value", fieldnumber3_value_binding));

    	function fieldnumber4_value_binding(value) {
    		/*fieldnumber4_value_binding*/ ctx[15].call(null, value);
    	}

    	let fieldnumber4_props = {
    		name: "maxHealth",
    		$$slots: { default: [create_default_slot_4$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].maxHealth !== void 0) {
    		fieldnumber4_props.value = /*input*/ ctx[0].maxHealth;
    	}

    	fieldnumber4 = new FieldNumber({
    			props: fieldnumber4_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber4, "value", fieldnumber4_value_binding));

    	function fieldnumber5_value_binding(value) {
    		/*fieldnumber5_value_binding*/ ctx[16].call(null, value);
    	}

    	let fieldnumber5_props = {
    		name: "dps",
    		$$slots: { default: [create_default_slot_3$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].dps !== void 0) {
    		fieldnumber5_props.value = /*input*/ ctx[0].dps;
    	}

    	fieldnumber5 = new FieldNumber({
    			props: fieldnumber5_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber5, "value", fieldnumber5_value_binding));

    	function fieldcheckbox_checked_binding(value) {
    		/*fieldcheckbox_checked_binding*/ ctx[17].call(null, value);
    	}

    	let fieldcheckbox_props = {
    		name: "canFly",
    		$$slots: { default: [create_default_slot_2$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].canFly !== void 0) {
    		fieldcheckbox_props.checked = /*input*/ ctx[0].canFly;
    	}

    	fieldcheckbox = new FieldCheckbox({
    			props: fieldcheckbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox, "checked", fieldcheckbox_checked_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext.$$.fragment);
    			t0 = space();
    			create_component(fieldartpicker0.$$.fragment);
    			t1 = space();
    			create_component(fieldartpicker1.$$.fragment);
    			t2 = space();
    			create_component(fieldnumber0.$$.fragment);
    			t3 = space();
    			create_component(fieldnumber1.$$.fragment);
    			t4 = space();
    			create_component(fieldnumber2.$$.fragment);
    			t5 = space();
    			create_component(fieldnumber3.$$.fragment);
    			t6 = space();
    			create_component(fieldnumber4.$$.fragment);
    			t7 = space();
    			create_component(fieldnumber5.$$.fragment);
    			t8 = space();
    			create_component(fieldcheckbox.$$.fragment);
    			t9 = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldartpicker0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldartpicker1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(fieldnumber0, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fieldnumber1, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(fieldnumber2, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(fieldnumber3, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(fieldnumber4, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(fieldnumber5, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(fieldcheckbox, target, anchor);
    			insert_dev(target, t9, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldtext_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext.$set(fieldtext_changes);
    			const fieldartpicker0_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldartpicker0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker0_changes.value = /*input*/ ctx[0].graphicStill;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker0.$set(fieldartpicker0_changes);
    			const fieldartpicker1_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldartpicker1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldartpicker1_changes.value = /*input*/ ctx[0].graphicSpinning;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldartpicker1.$set(fieldartpicker1_changes);
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].maxVelocity;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].jumpVelocity;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_5 && dirty & /*input*/ 1) {
    				updating_value_5 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].gravityMultiplier;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_6 && dirty & /*input*/ 1) {
    				updating_value_6 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].fallDamageMultiplier;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldnumber4_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_7 && dirty & /*input*/ 1) {
    				updating_value_7 = true;
    				fieldnumber4_changes.value = /*input*/ ctx[0].maxHealth;
    				add_flush_callback(() => updating_value_7 = false);
    			}

    			fieldnumber4.$set(fieldnumber4_changes);
    			const fieldnumber5_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber5_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_8 && dirty & /*input*/ 1) {
    				updating_value_8 = true;
    				fieldnumber5_changes.value = /*input*/ ctx[0].dps;
    				add_flush_callback(() => updating_value_8 = false);
    			}

    			fieldnumber5.$set(fieldnumber5_changes);
    			const fieldcheckbox_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldcheckbox_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*input*/ 1) {
    				updating_checked = true;
    				fieldcheckbox_changes.checked = /*input*/ ctx[0].canFly;
    				add_flush_callback(() => updating_checked = false);
    			}

    			fieldcheckbox.$set(fieldcheckbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext.$$.fragment, local);
    			transition_in(fieldartpicker0.$$.fragment, local);
    			transition_in(fieldartpicker1.$$.fragment, local);
    			transition_in(fieldnumber0.$$.fragment, local);
    			transition_in(fieldnumber1.$$.fragment, local);
    			transition_in(fieldnumber2.$$.fragment, local);
    			transition_in(fieldnumber3.$$.fragment, local);
    			transition_in(fieldnumber4.$$.fragment, local);
    			transition_in(fieldnumber5.$$.fragment, local);
    			transition_in(fieldcheckbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldartpicker0.$$.fragment, local);
    			transition_out(fieldartpicker1.$$.fragment, local);
    			transition_out(fieldnumber0.$$.fragment, local);
    			transition_out(fieldnumber1.$$.fragment, local);
    			transition_out(fieldnumber2.$$.fragment, local);
    			transition_out(fieldnumber3.$$.fragment, local);
    			transition_out(fieldnumber4.$$.fragment, local);
    			transition_out(fieldnumber5.$$.fragment, local);
    			transition_out(fieldcheckbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldartpicker0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldartpicker1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(fieldnumber0, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fieldnumber1, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(fieldnumber2, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(fieldnumber3, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(fieldnumber4, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(fieldnumber5, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(fieldcheckbox, detaching);
    			if (detaching) detach_dev(t9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(16:1) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (15:0) <LevelBuilderLayout tab="characters" activeName={input.name} store={$characters}>
    function create_default_slot$5(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$2],
    					buttons: [create_buttons_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};
    			if (dirty & /*hasChanges*/ 4) form_changes.hasChanges = /*hasChanges*/ ctx[2];

    			if (dirty & /*$$scope, input, isAdding*/ 4194307) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(15:0) <LevelBuilderLayout tab=\\\"characters\\\" activeName={input.name} store={$characters}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let levelbuilderlayout;
    	let current;

    	levelbuilderlayout = new LevelBuilderLayout({
    			props: {
    				tab: "characters",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$characters*/ ctx[3],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(levelbuilderlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(levelbuilderlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const levelbuilderlayout_changes = {};
    			if (dirty & /*input*/ 1) levelbuilderlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty & /*$characters*/ 8) levelbuilderlayout_changes.store = /*$characters*/ ctx[3];

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 4194311) {
    				levelbuilderlayout_changes.$$scope = { dirty, ctx };
    			}

    			levelbuilderlayout.$set(levelbuilderlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(levelbuilderlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(levelbuilderlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(levelbuilderlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $characters;
    	validate_store(characters, "characters");
    	component_subscribe($$self, characters, $$value => $$invalidate(3, $characters = $$value));
    	const notBlockFilter = b => b.width != 20 || b.height != 20;
    	let { params = {} } = $$props;
    	let input;

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(characters, $characters[input.name] = JSON.parse(JSON.stringify(input)), $characters);
    		push(`/level-builder/characters/${encodeURIComponent(input.name)}`);
    	}

    	function edit(name) {
    		if (!$characters.hasOwnProperty(name)) return;
    		$$invalidate(0, input = JSON.parse(JSON.stringify($characters[name])));
    	}

    	function create() {
    		$$invalidate(0, input = {
    			graphicStill: null,
    			graphicSpinning: null,
    			name: "",
    			maxHealth: 100,
    			maxVelocity: 20,
    			jumpVelocity: 15,
    			gravityMultiplier: 1,
    			fallDamageMultiplier: 1,
    			dps: 120
    		});
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) {
    			delete $characters[name];
    			characters.set($characters);
    			push("/level-builder/characters/new");
    		}
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CharacterBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CharacterBuilder", $$slots, []);

    	function fieldtext_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker0_value_binding(value) {
    		input.graphicStill = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker1_value_binding(value) {
    		input.graphicSpinning = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber0_value_binding(value) {
    		input.maxVelocity = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber1_value_binding(value) {
    		input.jumpVelocity = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber2_value_binding(value) {
    		input.gravityMultiplier = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber3_value_binding(value) {
    		input.fallDamageMultiplier = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber4_value_binding(value) {
    		input.maxHealth = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber5_value_binding(value) {
    		input.dps = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox_checked_binding(value) {
    		input.canFly = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(7, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		characters,
    		FieldCheckbox,
    		FieldArtPicker,
    		FieldNumber,
    		FieldText,
    		Form,
    		LevelBuilderLayout,
    		validator,
    		notBlockFilter,
    		params,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		paramName,
    		isAdding,
    		hasChanges,
    		$characters
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(7, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("paramName" in $$props) $$invalidate(19, paramName = $$props.paramName);
    		if ("isAdding" in $$props) $$invalidate(1, isAdding = $$props.isAdding);
    		if ("hasChanges" in $$props) $$invalidate(2, hasChanges = $$props.hasChanges);
    	};

    	let paramName;
    	let isAdding;
    	let hasChanges;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 128) {
    			 $$invalidate(19, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty & /*paramName*/ 524288) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty & /*paramName*/ 524288) {
    			 $$invalidate(1, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty & /*input, $characters*/ 9) {
    			 $$invalidate(2, hasChanges = input != null && !validator.equals(input, $characters[input.name]));
    		}
    	};

    	return [
    		input,
    		isAdding,
    		hasChanges,
    		$characters,
    		notBlockFilter,
    		save,
    		del,
    		params,
    		fieldtext_value_binding,
    		fieldartpicker0_value_binding,
    		fieldartpicker1_value_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldnumber2_value_binding,
    		fieldnumber3_value_binding,
    		fieldnumber4_value_binding,
    		fieldnumber5_value_binding,
    		fieldcheckbox_checked_binding,
    		click_handler
    	];
    }

    class CharacterBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { params: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CharacterBuilder",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get params() {
    		throw new Error("<CharacterBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<CharacterBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var enemyStore = LocalStorageStore('enemies', {
    	'mr smiley': {
    		graphicStill: 'mr smiley',
    		name: 'mr smiley',
    		maxVelocity: 2,
    		jumpVelocity: 12,
    		gravityMultiplier: 1,
    		fallDamageMultiplier: 1,
    		dps: 120,
    		dpsToPlayers: 50,
    		maxHealth: 5000,
    		score: 10,
    	},
    	alien: {
    		graphicStill: 'alien',
    		name: 'alien',
    		maxVelocity: 5,
    		jumpVelocity: 7,
    		gravityMultiplier: 1,
    		fallDamageMultiplier: 0.5,
    		dps: 120,
    		dpsToPlayers: 50,
    		maxHealth: 100,
    		score: 1,
    	},
    });

    /* src\pages\LevelBuilder\EnemyBuilder.svelte generated by Svelte v3.24.1 */
    const file$i = "src\\pages\\LevelBuilder\\EnemyBuilder.svelte";

    // (14:2) <FieldText name="name" bind:value={input.name} autofocus>
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Name");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(14:2) <FieldText name=\\\"name\\\" bind:value={input.name} autofocus>",
    		ctx
    	});

    	return block;
    }

    // (15:2) <FieldArtPicker bind:value={input.graphicStill} filter={b => b.width != 20 || b.height != 20}>
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Standing still graphic");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(15:2) <FieldArtPicker bind:value={input.graphicStill} filter={b => b.width != 20 || b.height != 20}>",
    		ctx
    	});

    	return block;
    }

    // (19:2) <FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Max velocity");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(19:2) <FieldNumber name=\\\"maxVelocity\\\" min={0} bind:value={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Jump velocity");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(20:2) <FieldNumber name=\\\"jumpVelocity\\\" min={0} bind:value={input.jumpVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (21:2) <FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>
    function create_default_slot_6$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gravity multiplier");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(21:2) <FieldNumber name=\\\"gravityMultiplier\\\" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (22:2) <FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Fall damage multiplier");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(22:2) <FieldNumber name=\\\"fallDamageMultiplier\\\" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <FieldNumber name="maxHealth" bind:value={input.maxHealth}>
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Max health");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(23:2) <FieldNumber name=\\\"maxHealth\\\" bind:value={input.maxHealth}>",
    		ctx
    	});

    	return block;
    }

    // (24:2) <FieldNumber name="score" bind:value={input.score}>
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Score (How many points you get when this enemy dies)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(24:2) <FieldNumber name=\\\"score\\\" bind:value={input.score}>",
    		ctx
    	});

    	return block;
    }

    // (25:2) <FieldNumber name="dps" bind:value={input.dps}>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("DPS (when in contact with player - we will replace this with abilities later)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(25:2) <FieldNumber name=\\\"dps\\\" bind:value={input.dps}>",
    		ctx
    	});

    	return block;
    }

    // (27:3) {#if !isAdding}
    function create_if_block$b(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$i, 27, 4, 1701);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[16], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(27:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (26:2) <span slot="buttons">
    function create_buttons_slot$3(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$i, 25, 2, 1654);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*isAdding*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_buttons_slot$3.name,
    		type: "slot",
    		source: "(26:2) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:1) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$3(ctx) {
    	let fieldtext;
    	let updating_value;
    	let t0;
    	let fieldartpicker;
    	let updating_value_1;
    	let t1;
    	let fieldnumber0;
    	let updating_value_2;
    	let t2;
    	let fieldnumber1;
    	let updating_value_3;
    	let t3;
    	let fieldnumber2;
    	let updating_value_4;
    	let t4;
    	let fieldnumber3;
    	let updating_value_5;
    	let t5;
    	let fieldnumber4;
    	let updating_value_6;
    	let t6;
    	let fieldnumber5;
    	let updating_value_7;
    	let t7;
    	let fieldnumber6;
    	let updating_value_8;
    	let t8;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[7].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		autofocus: true,
    		$$slots: { default: [create_default_slot_10$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext = new FieldText({ props: fieldtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext, "value", fieldtext_value_binding));

    	function fieldartpicker_value_binding(value) {
    		/*fieldartpicker_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldartpicker_props = {
    		filter: func$1,
    		$$slots: { default: [create_default_slot_9$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphicStill !== void 0) {
    		fieldartpicker_props.value = /*input*/ ctx[0].graphicStill;
    	}

    	fieldartpicker = new FieldArtPicker({
    			props: fieldartpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker, "value", fieldartpicker_value_binding));

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "maxVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_8$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].maxVelocity !== void 0) {
    		fieldnumber0_props.value = /*input*/ ctx[0].maxVelocity;
    	}

    	fieldnumber0 = new FieldNumber({
    			props: fieldnumber0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber0, "value", fieldnumber0_value_binding));

    	function fieldnumber1_value_binding(value) {
    		/*fieldnumber1_value_binding*/ ctx[10].call(null, value);
    	}

    	let fieldnumber1_props = {
    		name: "jumpVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_7$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].jumpVelocity !== void 0) {
    		fieldnumber1_props.value = /*input*/ ctx[0].jumpVelocity;
    	}

    	fieldnumber1 = new FieldNumber({
    			props: fieldnumber1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber1, "value", fieldnumber1_value_binding));

    	function fieldnumber2_value_binding(value) {
    		/*fieldnumber2_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber2_props = {
    		name: "gravityMultiplier",
    		min: 0,
    		max: 2,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_6$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].gravityMultiplier !== void 0) {
    		fieldnumber2_props.value = /*input*/ ctx[0].gravityMultiplier;
    	}

    	fieldnumber2 = new FieldNumber({
    			props: fieldnumber2_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber2, "value", fieldnumber2_value_binding));

    	function fieldnumber3_value_binding(value) {
    		/*fieldnumber3_value_binding*/ ctx[12].call(null, value);
    	}

    	let fieldnumber3_props = {
    		name: "fallDamageMultiplier",
    		min: 0,
    		max: 1,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_5$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].fallDamageMultiplier !== void 0) {
    		fieldnumber3_props.value = /*input*/ ctx[0].fallDamageMultiplier;
    	}

    	fieldnumber3 = new FieldNumber({
    			props: fieldnumber3_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber3, "value", fieldnumber3_value_binding));

    	function fieldnumber4_value_binding(value) {
    		/*fieldnumber4_value_binding*/ ctx[13].call(null, value);
    	}

    	let fieldnumber4_props = {
    		name: "maxHealth",
    		$$slots: { default: [create_default_slot_4$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].maxHealth !== void 0) {
    		fieldnumber4_props.value = /*input*/ ctx[0].maxHealth;
    	}

    	fieldnumber4 = new FieldNumber({
    			props: fieldnumber4_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber4, "value", fieldnumber4_value_binding));

    	function fieldnumber5_value_binding(value) {
    		/*fieldnumber5_value_binding*/ ctx[14].call(null, value);
    	}

    	let fieldnumber5_props = {
    		name: "score",
    		$$slots: { default: [create_default_slot_3$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].score !== void 0) {
    		fieldnumber5_props.value = /*input*/ ctx[0].score;
    	}

    	fieldnumber5 = new FieldNumber({
    			props: fieldnumber5_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber5, "value", fieldnumber5_value_binding));

    	function fieldnumber6_value_binding(value) {
    		/*fieldnumber6_value_binding*/ ctx[15].call(null, value);
    	}

    	let fieldnumber6_props = {
    		name: "dps",
    		$$slots: { default: [create_default_slot_2$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].dps !== void 0) {
    		fieldnumber6_props.value = /*input*/ ctx[0].dps;
    	}

    	fieldnumber6 = new FieldNumber({
    			props: fieldnumber6_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber6, "value", fieldnumber6_value_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext.$$.fragment);
    			t0 = space();
    			create_component(fieldartpicker.$$.fragment);
    			t1 = space();
    			create_component(fieldnumber0.$$.fragment);
    			t2 = space();
    			create_component(fieldnumber1.$$.fragment);
    			t3 = space();
    			create_component(fieldnumber2.$$.fragment);
    			t4 = space();
    			create_component(fieldnumber3.$$.fragment);
    			t5 = space();
    			create_component(fieldnumber4.$$.fragment);
    			t6 = space();
    			create_component(fieldnumber5.$$.fragment);
    			t7 = space();
    			create_component(fieldnumber6.$$.fragment);
    			t8 = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldartpicker, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldnumber0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(fieldnumber1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fieldnumber2, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(fieldnumber3, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(fieldnumber4, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(fieldnumber5, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(fieldnumber6, target, anchor);
    			insert_dev(target, t8, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldtext_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext.$set(fieldtext_changes);
    			const fieldartpicker_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldartpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker_changes.value = /*input*/ ctx[0].graphicStill;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker.$set(fieldartpicker_changes);
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].maxVelocity;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].jumpVelocity;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].gravityMultiplier;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_5 && dirty & /*input*/ 1) {
    				updating_value_5 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].fallDamageMultiplier;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldnumber4_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_6 && dirty & /*input*/ 1) {
    				updating_value_6 = true;
    				fieldnumber4_changes.value = /*input*/ ctx[0].maxHealth;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			fieldnumber4.$set(fieldnumber4_changes);
    			const fieldnumber5_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber5_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_7 && dirty & /*input*/ 1) {
    				updating_value_7 = true;
    				fieldnumber5_changes.value = /*input*/ ctx[0].score;
    				add_flush_callback(() => updating_value_7 = false);
    			}

    			fieldnumber5.$set(fieldnumber5_changes);
    			const fieldnumber6_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber6_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_8 && dirty & /*input*/ 1) {
    				updating_value_8 = true;
    				fieldnumber6_changes.value = /*input*/ ctx[0].dps;
    				add_flush_callback(() => updating_value_8 = false);
    			}

    			fieldnumber6.$set(fieldnumber6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext.$$.fragment, local);
    			transition_in(fieldartpicker.$$.fragment, local);
    			transition_in(fieldnumber0.$$.fragment, local);
    			transition_in(fieldnumber1.$$.fragment, local);
    			transition_in(fieldnumber2.$$.fragment, local);
    			transition_in(fieldnumber3.$$.fragment, local);
    			transition_in(fieldnumber4.$$.fragment, local);
    			transition_in(fieldnumber5.$$.fragment, local);
    			transition_in(fieldnumber6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldartpicker.$$.fragment, local);
    			transition_out(fieldnumber0.$$.fragment, local);
    			transition_out(fieldnumber1.$$.fragment, local);
    			transition_out(fieldnumber2.$$.fragment, local);
    			transition_out(fieldnumber3.$$.fragment, local);
    			transition_out(fieldnumber4.$$.fragment, local);
    			transition_out(fieldnumber5.$$.fragment, local);
    			transition_out(fieldnumber6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldartpicker, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldnumber0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(fieldnumber1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fieldnumber2, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(fieldnumber3, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(fieldnumber4, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(fieldnumber5, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(fieldnumber6, detaching);
    			if (detaching) detach_dev(t8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(13:1) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (12:0) <LevelBuilderLayout tab="enemies" activeName={input.name} store={$enemies}>
    function create_default_slot$6(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$3],
    					buttons: [create_buttons_slot$3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};
    			if (dirty & /*hasChanges*/ 4) form_changes.hasChanges = /*hasChanges*/ ctx[2];

    			if (dirty & /*$$scope, input, isAdding*/ 1048579) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(12:0) <LevelBuilderLayout tab=\\\"enemies\\\" activeName={input.name} store={$enemies}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let levelbuilderlayout;
    	let current;

    	levelbuilderlayout = new LevelBuilderLayout({
    			props: {
    				tab: "enemies",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$enemies*/ ctx[3],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(levelbuilderlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(levelbuilderlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const levelbuilderlayout_changes = {};
    			if (dirty & /*input*/ 1) levelbuilderlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty & /*$enemies*/ 8) levelbuilderlayout_changes.store = /*$enemies*/ ctx[3];

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 1048583) {
    				levelbuilderlayout_changes.$$scope = { dirty, ctx };
    			}

    			levelbuilderlayout.$set(levelbuilderlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(levelbuilderlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(levelbuilderlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(levelbuilderlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = b => b.width != 20 || b.height != 20;

    function instance$k($$self, $$props, $$invalidate) {
    	let $enemies;
    	validate_store(enemyStore, "enemies");
    	component_subscribe($$self, enemyStore, $$value => $$invalidate(3, $enemies = $$value));
    	let { params = {} } = $$props;
    	let input;

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(enemyStore, $enemies[input.name] = JSON.parse(JSON.stringify(input)), $enemies);
    		push(`/level-builder/enemies/${encodeURIComponent(input.name)}`);
    	}

    	function edit(name) {
    		if (!$enemies.hasOwnProperty(name)) return;
    		$$invalidate(0, input = JSON.parse(JSON.stringify($enemies[name])));
    	}

    	function create() {
    		$$invalidate(0, input = {
    			graphicStill: null,
    			name: "",
    			maxHealth: 100,
    			maxVelocity: 20,
    			jumpVelocity: 15,
    			gravityMultiplier: 1,
    			fallDamageMultiplier: 1,
    			dps: 120,
    			score: 1
    		});
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) {
    			delete $enemies[name];
    			enemyStore.set($enemies);
    			push("/level-builder/enemies/new");
    		}
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EnemyBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EnemyBuilder", $$slots, []);

    	function fieldtext_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker_value_binding(value) {
    		input.graphicStill = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber0_value_binding(value) {
    		input.maxVelocity = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber1_value_binding(value) {
    		input.jumpVelocity = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber2_value_binding(value) {
    		input.gravityMultiplier = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber3_value_binding(value) {
    		input.fallDamageMultiplier = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber4_value_binding(value) {
    		input.maxHealth = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber5_value_binding(value) {
    		input.score = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber6_value_binding(value) {
    		input.dps = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		enemies: enemyStore,
    		FieldCheckbox,
    		FieldArtPicker,
    		FieldNumber,
    		FieldText,
    		Form,
    		LevelBuilderLayout,
    		validator,
    		params,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		paramName,
    		isAdding,
    		hasChanges,
    		$enemies
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("paramName" in $$props) $$invalidate(17, paramName = $$props.paramName);
    		if ("isAdding" in $$props) $$invalidate(1, isAdding = $$props.isAdding);
    		if ("hasChanges" in $$props) $$invalidate(2, hasChanges = $$props.hasChanges);
    	};

    	let paramName;
    	let isAdding;
    	let hasChanges;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 64) {
    			 $$invalidate(17, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty & /*paramName*/ 131072) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty & /*paramName*/ 131072) {
    			 $$invalidate(1, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty & /*input, $enemies*/ 9) {
    			 $$invalidate(2, hasChanges = input != null && !validator.equals(input, $enemies[input.name]));
    		}
    	};

    	return [
    		input,
    		isAdding,
    		hasChanges,
    		$enemies,
    		save,
    		del,
    		params,
    		fieldtext_value_binding,
    		fieldartpicker_value_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldnumber2_value_binding,
    		fieldnumber3_value_binding,
    		fieldnumber4_value_binding,
    		fieldnumber5_value_binding,
    		fieldnumber6_value_binding,
    		click_handler
    	];
    }

    class EnemyBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EnemyBuilder",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get params() {
    		throw new Error("<EnemyBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EnemyBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\FieldCharacterPicker.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$4 } = globals;
    const file$j = "src\\pages\\LevelBuilder\\components\\FieldCharacterPicker.svelte";

    // (3:8) Characters
    function fallback_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Characters");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$5.name,
    		type: "fallback",
    		source: "(3:8) Characters",
    		ctx
    	});

    	return block;
    }

    // (6:2) <InputSelect multiple {options} bind:value let:option inline filterable={options.length > 2}>
    function create_default_slot$7(ctx) {
    	let art;
    	let t0;
    	let t1_value = /*option*/ ctx[7].value + "";
    	let t1;
    	let current;

    	art = new Art({
    			props: {
    				name: /*$characterStore*/ ctx[2][/*option*/ ctx[7].value].graphicStill
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(art.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			mount_component(art, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const art_changes = {};
    			if (dirty & /*$characterStore, option*/ 132) art_changes.name = /*$characterStore*/ ctx[2][/*option*/ ctx[7].value].graphicStill;
    			art.$set(art_changes);
    			if ((!current || dirty & /*option*/ 128) && t1_value !== (t1_value = /*option*/ ctx[7].value + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(art.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(art.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(art, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(6:2) <InputSelect multiple {options} bind:value let:option inline filterable={options.length > 2}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div1;
    	let label;
    	let t;
    	let div0;
    	let inputselect;
    	let updating_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	const default_slot_or_fallback = default_slot || fallback_block$5(ctx);

    	function inputselect_value_binding(value) {
    		/*inputselect_value_binding*/ ctx[4].call(null, value);
    	}

    	let inputselect_props = {
    		multiple: true,
    		options: /*options*/ ctx[1],
    		inline: true,
    		filterable: /*options*/ ctx[1].length > 2,
    		$$slots: {
    			default: [
    				create_default_slot$7,
    				({ option }) => ({ 7: option }),
    				({ option }) => option ? 128 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		inputselect_props.value = /*value*/ ctx[0];
    	}

    	inputselect = new InputSelect({ props: inputselect_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputselect, "value", inputselect_value_binding));

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			div0 = element("div");
    			create_component(inputselect.$$.fragment);
    			attr_dev(label, "for", "graphic");
    			add_location(label, file$j, 1, 1, 27);
    			add_location(div0, file$j, 4, 1, 89);
    			attr_dev(div1, "class", "form-group svelte-1773jdu");
    			add_location(div1, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(label, null);
    			}

    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(inputselect, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			const inputselect_changes = {};
    			if (dirty & /*options*/ 2) inputselect_changes.options = /*options*/ ctx[1];
    			if (dirty & /*options*/ 2) inputselect_changes.filterable = /*options*/ ctx[1].length > 2;

    			if (dirty & /*$$scope, option, $characterStore*/ 164) {
    				inputselect_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				inputselect_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputselect.$set(inputselect_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			transition_in(inputselect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			transition_out(inputselect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			destroy_component(inputselect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $characterStore;
    	validate_store(characters, "characterStore");
    	component_subscribe($$self, characters, $$value => $$invalidate(2, $characterStore = $$value));
    	let { value = [] } = $$props;

    	function toggle(name) {
    		$$invalidate(0, value = value.indexOf(name) > -1
    		? value.filter(v => v != name)
    		: [...value, name].sort());
    	}

    	const writable_props = ["value"];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldCharacterPicker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldCharacterPicker", $$slots, ['default']);

    	function inputselect_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		artStore,
    		characterStore: characters,
    		Art,
    		InputSelect,
    		value,
    		toggle,
    		options,
    		$characterStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    	};

    	let options;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$characterStore*/ 4) {
    			 $$invalidate(1, options = Object.keys($characterStore));
    		}
    	};

    	return [value, options, $characterStore, $$slots, inputselect_value_binding, $$scope];
    }

    class FieldCharacterPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldCharacterPicker",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldCharacterPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FieldCharacterPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\FieldMultiSelect.svelte generated by Svelte v3.24.1 */

    const file$k = "src\\pages\\LevelBuilder\\components\\FieldMultiSelect.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each options as option}
    function create_each_block$5(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[6] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*option*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$k, 6, 3, 171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 4 && t_value !== (t_value = /*option*/ ctx[6] + "")) set_data_dev(t, t_value);

    			if (dirty & /*options*/ 4 && option_value_value !== (option_value_value = /*option*/ ctx[6])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(6:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let label;
    	let t;
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			if (default_slot) default_slot.c();
    			t = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label, "for", /*name*/ ctx[1]);
    			add_location(label, file$k, 1, 1, 27);
    			select.multiple = true;
    			attr_dev(select, "name", /*name*/ ctx[1]);
    			attr_dev(select, "id", /*name*/ ctx[1]);
    			attr_dev(select, "class", "form-control");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$k, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			append_dev(div, t);
    			append_dev(div, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_options(select, /*value*/ ctx[0]);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(label, "for", /*name*/ ctx[1]);
    			}

    			if (dirty & /*options*/ 4) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(select, "name", /*name*/ ctx[1]);
    			}

    			if (!current || dirty & /*name*/ 2) {
    				attr_dev(select, "id", /*name*/ ctx[1]);
    			}

    			if (dirty & /*value, options*/ 5) {
    				select_options(select, /*value*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { value = [] } = $$props;
    	let { name = "select" } = $$props;
    	let { options = [] } = $$props;
    	const writable_props = ["value", "name", "options"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldMultiSelect> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldMultiSelect", $$slots, ['default']);

    	function select_change_handler() {
    		value = select_multiple_value(this);
    		$$invalidate(0, value);
    		$$invalidate(2, options);
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ value, name, options });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, name, options, $$scope, $$slots, select_change_handler];
    }

    class FieldMultiSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { value: 0, name: 1, options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldMultiSelect",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldMultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FieldMultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<FieldMultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<FieldMultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<FieldMultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<FieldMultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Play\HealthBar.svelte generated by Svelte v3.24.1 */

    const file$l = "src\\pages\\Play\\HealthBar.svelte";

    function create_fragment$n(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;

    	let t3_value = (/*health*/ ctx[0] > 0
    	? `(${/*displayPercent*/ ctx[2]}%)`
    	: "I am dead.") + "";

    	let t3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(/*displayHealth*/ ctx[1]);
    			t2 = space();
    			t3 = text(t3_value);
    			attr_dev(div0, "class", "filled svelte-1ofh1kv");
    			set_style(div0, "width", /*displayPercent*/ ctx[2] + "%");
    			set_style(div0, "background-color", /*color*/ ctx[3]);
    			add_location(div0, file$l, 3, 1, 72);
    			attr_dev(div1, "class", "text svelte-1ofh1kv");
    			add_location(div1, file$l, 4, 1, 157);
    			attr_dev(div2, "class", "health-bar svelte-1ofh1kv");
    			add_location(div2, file$l, 2, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*displayPercent*/ 4) {
    				set_style(div0, "width", /*displayPercent*/ ctx[2] + "%");
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div0, "background-color", /*color*/ ctx[3]);
    			}

    			if (dirty & /*displayHealth*/ 2) set_data_dev(t1, /*displayHealth*/ ctx[1]);

    			if (dirty & /*health, displayPercent*/ 5 && t3_value !== (t3_value = (/*health*/ ctx[0] > 0
    			? `(${/*displayPercent*/ ctx[2]}%)`
    			: "I am dead.") + "")) set_data_dev(t3, t3_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { percent = 100 } = $$props;
    	let { health = 100 } = $$props;
    	let { maxHealth = 100 } = $$props;
    	const writable_props = ["percent", "health", "maxHealth"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HealthBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("HealthBar", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("percent" in $$props) $$invalidate(4, percent = $$props.percent);
    		if ("health" in $$props) $$invalidate(0, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(5, maxHealth = $$props.maxHealth);
    	};

    	$$self.$capture_state = () => ({
    		percent,
    		health,
    		maxHealth,
    		displayHealth,
    		displayPercent,
    		color
    	});

    	$$self.$inject_state = $$props => {
    		if ("percent" in $$props) $$invalidate(4, percent = $$props.percent);
    		if ("health" in $$props) $$invalidate(0, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(5, maxHealth = $$props.maxHealth);
    		if ("displayHealth" in $$props) $$invalidate(1, displayHealth = $$props.displayHealth);
    		if ("displayPercent" in $$props) $$invalidate(2, displayPercent = $$props.displayPercent);
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    	};

    	let displayHealth;
    	let displayPercent;
    	let color;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*health*/ 1) {
    			 $$invalidate(1, displayHealth = health > 0 ? Math.round(health) : 0);
    		}

    		if ($$self.$$.dirty & /*health, maxHealth*/ 33) {
    			 $$invalidate(4, percent = Math.round(health / maxHealth * 100, 2));
    		}

    		if ($$self.$$.dirty & /*percent*/ 16) {
    			 $$invalidate(2, displayPercent = percent > 0 ? percent : 0);
    		}

    		if ($$self.$$.dirty & /*percent*/ 16) {
    			 $$invalidate(3, color = percent > 75
    			? "rgba(24, 197, 33, 0.5)"
    			: percent > 25
    				? "rgba(245, 189, 36, 0.5)"
    				: "rgba(223, 22, 22, 0.5)");
    		}
    	};

    	return [health, displayHealth, displayPercent, color, percent, maxHealth];
    }

    class HealthBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { percent: 4, health: 0, maxHealth: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HealthBar",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get percent() {
    		throw new Error("<HealthBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set percent(value) {
    		throw new Error("<HealthBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get health() {
    		throw new Error("<HealthBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set health(value) {
    		throw new Error("<HealthBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxHealth() {
    		throw new Error("<HealthBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxHealth(value) {
    		throw new Error("<HealthBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Play\LivingSprite.svelte generated by Svelte v3.24.1 */
    const file$m = "src\\pages\\Play\\LivingSprite.svelte";

    // (3:1) {#if graphic != null}
    function create_if_block$c(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "graphic drop-shadow svelte-1o14b8v");
    			if (img.src !== (img_src_value = /*graphic*/ ctx[6].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*name*/ ctx[0]);
    			set_style(img, "width", /*graphic*/ ctx[6].width * artScale + "px");
    			set_style(img, "height", /*graphic*/ ctx[6].height * artScale + "px");
    			set_style(img, "transform", "scaleX(" + /*direction*/ ctx[5] + ") rotate(" + /*rotate*/ ctx[7] + "deg)");
    			toggle_class(img, "dead", /*health*/ ctx[4] <= 0);
    			add_location(img, file$m, 3, 2, 121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*graphic*/ 64 && img.src !== (img_src_value = /*graphic*/ ctx[6].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*name*/ 1) {
    				attr_dev(img, "alt", /*name*/ ctx[0]);
    			}

    			if (dirty & /*graphic*/ 64) {
    				set_style(img, "width", /*graphic*/ ctx[6].width * artScale + "px");
    			}

    			if (dirty & /*graphic*/ 64) {
    				set_style(img, "height", /*graphic*/ ctx[6].height * artScale + "px");
    			}

    			if (dirty & /*direction, rotate*/ 160) {
    				set_style(img, "transform", "scaleX(" + /*direction*/ ctx[5] + ") rotate(" + /*rotate*/ ctx[7] + "deg)");
    			}

    			if (dirty & /*health*/ 16) {
    				toggle_class(img, "dead", /*health*/ ctx[4] <= 0);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(3:1) {#if graphic != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let healthbar;
    	let t;
    	let current;

    	healthbar = new HealthBar({
    			props: {
    				health: /*health*/ ctx[4],
    				maxHealth: /*maxHealth*/ ctx[1]
    			},
    			$$inline: true
    		});

    	let if_block = /*graphic*/ ctx[6] != null && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(healthbar.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "player svelte-1o14b8v");
    			set_style(div, "left", /*x*/ ctx[3] + "px");
    			set_style(div, "bottom", /*y*/ ctx[2] + "px");
    			add_location(div, file$m, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(healthbar, div, null);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const healthbar_changes = {};
    			if (dirty & /*health*/ 16) healthbar_changes.health = /*health*/ ctx[4];
    			if (dirty & /*maxHealth*/ 2) healthbar_changes.maxHealth = /*maxHealth*/ ctx[1];
    			healthbar.$set(healthbar_changes);

    			if (/*graphic*/ ctx[6] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*x*/ 8) {
    				set_style(div, "left", /*x*/ ctx[3] + "px");
    			}

    			if (!current || dirty & /*y*/ 4) {
    				set_style(div, "bottom", /*y*/ ctx[2] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(healthbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(healthbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(healthbar);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const artScale = 2;

    function instance$o($$self, $$props, $$invalidate) {
    	let $artStore;
    	validate_store(artStore, "artStore");
    	component_subscribe($$self, artStore, $$value => $$invalidate(15, $artStore = $$value));
    	let { name } = $$props;
    	let { maxHealth } = $$props;
    	let { graphicStill } = $$props;
    	let { graphicSpinning } = $$props;
    	let { vx = 0 } = $$props;
    	let { vy = 0 } = $$props;
    	let { y = 0 } = $$props;
    	let { x = 0 } = $$props;
    	let { health } = $$props;
    	let { spinning = false } = $$props;
    	let direction = 1;
    	let spinningRotation = 0;
    	let spinTimeout = null;

    	const writable_props = [
    		"name",
    		"maxHealth",
    		"graphicStill",
    		"graphicSpinning",
    		"vx",
    		"vy",
    		"y",
    		"x",
    		"health",
    		"spinning"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LivingSprite> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LivingSprite", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("maxHealth" in $$props) $$invalidate(1, maxHealth = $$props.maxHealth);
    		if ("graphicStill" in $$props) $$invalidate(8, graphicStill = $$props.graphicStill);
    		if ("graphicSpinning" in $$props) $$invalidate(9, graphicSpinning = $$props.graphicSpinning);
    		if ("vx" in $$props) $$invalidate(10, vx = $$props.vx);
    		if ("vy" in $$props) $$invalidate(11, vy = $$props.vy);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("x" in $$props) $$invalidate(3, x = $$props.x);
    		if ("health" in $$props) $$invalidate(4, health = $$props.health);
    		if ("spinning" in $$props) $$invalidate(12, spinning = $$props.spinning);
    	};

    	$$self.$capture_state = () => ({
    		artStore,
    		HealthBar,
    		artScale,
    		name,
    		maxHealth,
    		graphicStill,
    		graphicSpinning,
    		vx,
    		vy,
    		y,
    		x,
    		health,
    		spinning,
    		direction,
    		spinningRotation,
    		spinTimeout,
    		graphic,
    		$artStore,
    		rotate
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("maxHealth" in $$props) $$invalidate(1, maxHealth = $$props.maxHealth);
    		if ("graphicStill" in $$props) $$invalidate(8, graphicStill = $$props.graphicStill);
    		if ("graphicSpinning" in $$props) $$invalidate(9, graphicSpinning = $$props.graphicSpinning);
    		if ("vx" in $$props) $$invalidate(10, vx = $$props.vx);
    		if ("vy" in $$props) $$invalidate(11, vy = $$props.vy);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("x" in $$props) $$invalidate(3, x = $$props.x);
    		if ("health" in $$props) $$invalidate(4, health = $$props.health);
    		if ("spinning" in $$props) $$invalidate(12, spinning = $$props.spinning);
    		if ("direction" in $$props) $$invalidate(5, direction = $$props.direction);
    		if ("spinningRotation" in $$props) $$invalidate(13, spinningRotation = $$props.spinningRotation);
    		if ("spinTimeout" in $$props) $$invalidate(14, spinTimeout = $$props.spinTimeout);
    		if ("graphic" in $$props) $$invalidate(6, graphic = $$props.graphic);
    		if ("rotate" in $$props) $$invalidate(7, rotate = $$props.rotate);
    	};

    	let graphic;
    	let rotate;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*spinning, graphicSpinning, $artStore, graphicStill*/ 37632) {
    			 $$invalidate(6, graphic = spinning && graphicSpinning != null
    			? $artStore[graphicSpinning]
    			: graphicStill != null ? $artStore[graphicStill] : null);
    		}

    		if ($$self.$$.dirty & /*vx*/ 1024) {
    			 if (vx != 0) $$invalidate(5, direction = vx > 0 ? 1 : -1);
    		}

    		if ($$self.$$.dirty & /*spinning, spinningRotation, spinTimeout*/ 28672) {
    			 if (spinning) {
    				$$invalidate(14, spinTimeout = setTimeout(
    					() => {
    						$$invalidate(13, spinningRotation += 30);
    					},
    					25
    				));
    			} else {
    				clearTimeout(spinTimeout);
    			}
    		}

    		if ($$self.$$.dirty & /*spinning, spinningRotation, vy*/ 14336) {
    			 $$invalidate(7, rotate = spinning
    			? spinningRotation
    			: -1 * (5 + (vy > 0 ? vy * 3 : vy * 1.5)));
    		}
    	};

    	return [
    		name,
    		maxHealth,
    		y,
    		x,
    		health,
    		direction,
    		graphic,
    		rotate,
    		graphicStill,
    		graphicSpinning,
    		vx,
    		vy,
    		spinning
    	];
    }

    class LivingSprite extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			name: 0,
    			maxHealth: 1,
    			graphicStill: 8,
    			graphicSpinning: 9,
    			vx: 10,
    			vy: 11,
    			y: 2,
    			x: 3,
    			health: 4,
    			spinning: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LivingSprite",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'name'");
    		}

    		if (/*maxHealth*/ ctx[1] === undefined && !("maxHealth" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'maxHealth'");
    		}

    		if (/*graphicStill*/ ctx[8] === undefined && !("graphicStill" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'graphicStill'");
    		}

    		if (/*graphicSpinning*/ ctx[9] === undefined && !("graphicSpinning" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'graphicSpinning'");
    		}

    		if (/*health*/ ctx[4] === undefined && !("health" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'health'");
    		}
    	}

    	get name() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxHealth() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxHealth(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get graphicStill() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graphicStill(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get graphicSpinning() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graphicSpinning(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vx() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vx(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vy() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vy(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get health() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set health(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinning() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinning(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Play\Level.svelte generated by Svelte v3.24.1 */
    const file$n = "src\\pages\\Play\\Level.svelte";

    function create_fragment$p(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", /*width*/ ctx[0]);
    			attr_dev(canvas_1, "height", /*height*/ ctx[1]);
    			attr_dev(canvas_1, "class", "svelte-q52jml");
    			add_location(canvas_1, file$n, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[6](canvas_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(canvas_1, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 2) {
    				attr_dev(canvas_1, "height", /*height*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[6](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const artScale$1 = 2;

    function instance$p($$self, $$props, $$invalidate) {
    	let $blockStore;
    	let $enemyStore;
    	let $artStore;
    	validate_store(blockStore, "blockStore");
    	component_subscribe($$self, blockStore, $$value => $$invalidate(9, $blockStore = $$value));
    	validate_store(enemyStore, "enemyStore");
    	component_subscribe($$self, enemyStore, $$value => $$invalidate(10, $enemyStore = $$value));
    	validate_store(artStore, "artStore");
    	component_subscribe($$self, artStore, $$value => $$invalidate(11, $artStore = $$value));
    	let { width = 0 } = $$props;
    	let { height = 0 } = $$props;
    	let { blocks = [] } = $$props;
    	let { enemies = null } = $$props;
    	let { playing = false } = $$props;
    	const dispatch = createEventDispatcher();
    	const imageCache = {};
    	let canvas;
    	let context;

    	function drawOnCanvas(artName, x, y) {
    		let art = $artStore[artName];
    		let src = art.png;
    		let drawing = imageCache[artName];

    		const drawThisImage = () => {
    			const draw = () => context.drawImage(drawing, x, height - y - art.height * artScale$1);
    			if (playing) setTimeout(draw, 100); else draw();
    		};

    		if (drawing == null) {
    			drawing = new Image();
    			drawing.src = src;
    			imageCache[artName] = drawing;
    		}

    		if (drawing.complete) {
    			drawThisImage();
    		} else {
    			const oldOnload = drawing.onload;

    			drawing.onload = () => {
    				if (typeof oldOnload === "function") oldOnload();
    				drawThisImage();
    			};
    		}
    	}

    	const writable_props = ["width", "height", "blocks", "enemies", "playing"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Level> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Level", $$slots, []);

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			canvas = $$value;
    			$$invalidate(2, canvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("blocks" in $$props) $$invalidate(3, blocks = $$props.blocks);
    		if ("enemies" in $$props) $$invalidate(4, enemies = $$props.enemies);
    		if ("playing" in $$props) $$invalidate(5, playing = $$props.playing);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		blockStore,
    		enemyStore,
    		artStore,
    		width,
    		height,
    		blocks,
    		enemies,
    		playing,
    		artScale: artScale$1,
    		dispatch,
    		imageCache,
    		canvas,
    		context,
    		drawOnCanvas,
    		$blockStore,
    		$enemyStore,
    		$artStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("blocks" in $$props) $$invalidate(3, blocks = $$props.blocks);
    		if ("enemies" in $$props) $$invalidate(4, enemies = $$props.enemies);
    		if ("playing" in $$props) $$invalidate(5, playing = $$props.playing);
    		if ("canvas" in $$props) $$invalidate(2, canvas = $$props.canvas);
    		if ("context" in $$props) $$invalidate(8, context = $$props.context);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*canvas*/ 4) {
    			 if (canvas != null) $$invalidate(8, context = canvas.getContext("2d"));
    		}

    		if ($$self.$$.dirty & /*blocks, width, height, context, $blockStore, enemies, $enemyStore, canvas*/ 1823) {
    			 if (blocks != null && width != null && height != null && context != null) {
    				context.clearRect(0, 0, width, height);
    				blocks.forEach(b => drawOnCanvas($blockStore[b.name].graphic, b.x, b.y));

    				if (enemies != null) {
    					enemies.forEach(e => drawOnCanvas($enemyStore[e.name].graphicStill, e.x, e.y));
    				}

    				dispatch("draw", canvas);
    			}
    		}
    	};

    	return [width, height, canvas, blocks, enemies, playing, canvas_1_binding];
    }

    class Level extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
    			width: 0,
    			height: 1,
    			blocks: 3,
    			enemies: 4,
    			playing: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get width() {
    		throw new Error("<Level>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Level>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Level>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Level>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blocks() {
    		throw new Error("<Level>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blocks(value) {
    		throw new Error("<Level>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enemies() {
    		throw new Error("<Level>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enemies(value) {
    		throw new Error("<Level>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get playing() {
    		throw new Error("<Level>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playing(value) {
    		throw new Error("<Level>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function makeThumbnail(srcCanvas, width, height) {
    	const canvas = document.createElement('canvas');
    	canvas.width = width;
    	canvas.height = height;

    	const context = canvas.getContext('2d');
    	context.drawImage(srcCanvas, 0, 0, width, height);

    	return canvas.toDataURL('image/png')
    }

    /* src\pages\Play\LevelPreview.svelte generated by Svelte v3.24.1 */
    const file$o = "src\\pages\\Play\\LevelPreview.svelte";

    // (1:0) {#if level}
    function create_if_block$d(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*level*/ ctx[0].thumbnail)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "level preview");
    			attr_dev(img, "class", "level-preview svelte-10ex0b8");
    			set_style(img, "background", /*level*/ ctx[0].background);
    			toggle_class(img, "grabbing", /*mouseDown*/ ctx[1]);
    			add_location(img, file$o, 1, 1, 14);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "mousedown", prevent_default(/*onMouseDown*/ ctx[2]), false, true, false),
    					listen_dev(img, "mousemove", prevent_default(/*onMouseMove*/ ctx[4]), false, true, false),
    					listen_dev(img, "mouseup", prevent_default(/*onMouseUp*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*level*/ 1 && img.src !== (img_src_value = /*level*/ ctx[0].thumbnail)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*level*/ 1) {
    				set_style(img, "background", /*level*/ ctx[0].background);
    			}

    			if (dirty & /*mouseDown*/ 2) {
    				toggle_class(img, "grabbing", /*mouseDown*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(1:0) {#if level}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let if_block_anchor;
    	let if_block = /*level*/ ctx[0] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*level*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { level } = $$props;
    	const dispatch = createEventDispatcher();
    	let mouseDown = false;

    	function onMouseDown(e) {
    		$$invalidate(1, mouseDown = true);
    	}

    	function onMouseUp(e) {
    		$$invalidate(1, mouseDown = false);
    	}

    	function onMouseMove(e) {
    		if (mouseDown) dispatch("pan", e.offsetX);
    	}

    	const writable_props = ["level"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelPreview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelPreview", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		level,
    		dispatch,
    		mouseDown,
    		onMouseDown,
    		onMouseUp,
    		onMouseMove
    	});

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("mouseDown" in $$props) $$invalidate(1, mouseDown = $$props.mouseDown);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [level, mouseDown, onMouseDown, onMouseUp, onMouseMove];
    }

    class LevelPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { level: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelPreview",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*level*/ ctx[0] === undefined && !("level" in props)) {
    			console.warn("<LevelPreview> was created without expected prop 'level'");
    		}
    	}

    	get level() {
    		throw new Error("<LevelPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set level(value) {
    		throw new Error("<LevelPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\LevelBuilderDrawingTool.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$5 } = globals;
    const file$p = "src\\pages\\LevelBuilder\\components\\LevelBuilderDrawingTool.svelte";

    // (5:3) <InputSelect      name="selected-block"      inline      placeholder="Select a block to place"      options={Object.keys($blockStore).map(name => $blockStore[name])}      let:option      valueProp="name"      bind:value={selectedBlock}      on:change={() => (selectedEnemy = null)}>
    function create_default_slot_1$4(ctx) {
    	let art;
    	let t0;
    	let t1_value = /*option*/ ctx[35].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*option*/ ctx[35].dps + "";
    	let t3;
    	let t4;
    	let t5_value = (/*option*/ ctx[35].solid ? "solid" : "background") + "";
    	let t5;
    	let current;

    	art = new Art({
    			props: {
    				name: /*$blockStore*/ ctx[9][/*option*/ ctx[35].name].graphic,
    				height: "40"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(art.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = text(": ");
    			t3 = text(t3_value);
    			t4 = text(" dps, ");
    			t5 = text(t5_value);
    		},
    		m: function mount(target, anchor) {
    			mount_component(art, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const art_changes = {};
    			if (dirty[0] & /*$blockStore*/ 512 | dirty[1] & /*option*/ 16) art_changes.name = /*$blockStore*/ ctx[9][/*option*/ ctx[35].name].graphic;
    			art.$set(art_changes);
    			if ((!current || dirty[1] & /*option*/ 16) && t1_value !== (t1_value = /*option*/ ctx[35].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[1] & /*option*/ 16) && t3_value !== (t3_value = /*option*/ ctx[35].dps + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[1] & /*option*/ 16) && t5_value !== (t5_value = (/*option*/ ctx[35].solid ? "solid" : "background") + "")) set_data_dev(t5, t5_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(art.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(art.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(art, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(5:3) <InputSelect      name=\\\"selected-block\\\"      inline      placeholder=\\\"Select a block to place\\\"      options={Object.keys($blockStore).map(name => $blockStore[name])}      let:option      valueProp=\\\"name\\\"      bind:value={selectedBlock}      on:change={() => (selectedEnemy = null)}>",
    		ctx
    	});

    	return block;
    }

    // (19:3) <InputSelect      name="selected-block"      inline      placeholder="Select an enemy to place"      options={Object.keys($enemyStore).map(name => $enemyStore[name])}      let:option      valueProp="name"      bind:value={selectedEnemy}      on:change={() => (selectedBlock = null)}>
    function create_default_slot$8(ctx) {
    	let art;
    	let t0;
    	let strong;
    	let t1_value = /*option*/ ctx[35].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*option*/ ctx[35].dps + "";
    	let t3;
    	let t4;
    	let t5_value = /*option*/ ctx[35].maxVelocity + "";
    	let t5;
    	let t6;
    	let t7_value = /*option*/ ctx[35].score + "";
    	let t7;
    	let t8;
    	let current;

    	art = new Art({
    			props: {
    				name: /*$enemyStore*/ ctx[10][/*option*/ ctx[35].name].graphicStill,
    				height: "40"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(art.$$.fragment);
    			t0 = space();
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = text(" dps, ");
    			t5 = text(t5_value);
    			t6 = text(" max velocity, worth ");
    			t7 = text(t7_value);
    			t8 = text(" score");
    			add_location(strong, file$p, 28, 4, 970);
    		},
    		m: function mount(target, anchor) {
    			mount_component(art, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, strong, anchor);
    			append_dev(strong, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, t8, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const art_changes = {};
    			if (dirty[0] & /*$enemyStore*/ 1024 | dirty[1] & /*option*/ 16) art_changes.name = /*$enemyStore*/ ctx[10][/*option*/ ctx[35].name].graphicStill;
    			art.$set(art_changes);
    			if ((!current || dirty[1] & /*option*/ 16) && t1_value !== (t1_value = /*option*/ ctx[35].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[1] & /*option*/ 16) && t3_value !== (t3_value = /*option*/ ctx[35].dps + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[1] & /*option*/ 16) && t5_value !== (t5_value = /*option*/ ctx[35].maxVelocity + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty[1] & /*option*/ 16) && t7_value !== (t7_value = /*option*/ ctx[35].score + "")) set_data_dev(t7, t7_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(art.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(art.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(art, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(strong);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(t8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(19:3) <InputSelect      name=\\\"selected-block\\\"      inline      placeholder=\\\"Select an enemy to place\\\"      options={Object.keys($enemyStore).map(name => $enemyStore[name])}      let:option      valueProp=\\\"name\\\"      bind:value={selectedEnemy}      on:change={() => (selectedBlock = null)}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let div4;
    	let levelpreview;
    	let t0;
    	let div2;
    	let div0;
    	let inputselect0;
    	let updating_value;
    	let t1;
    	let div1;
    	let inputselect1;
    	let updating_value_1;
    	let t2;
    	let div3;
    	let level;
    	let current;
    	let mounted;
    	let dispose;

    	levelpreview = new LevelPreview({
    			props: {
    				level: {
    					background: /*background*/ ctx[3],
    					thumbnail: /*thumbnail*/ ctx[0]
    				}
    			},
    			$$inline: true
    		});

    	levelpreview.$on("pan", /*onPreviewPan*/ ctx[12]);

    	function inputselect0_value_binding(value) {
    		/*inputselect0_value_binding*/ ctx[18].call(null, value);
    	}

    	let inputselect0_props = {
    		name: "selected-block",
    		inline: true,
    		placeholder: "Select a block to place",
    		options: Object.keys(/*$blockStore*/ ctx[9]).map(/*func*/ ctx[17]),
    		valueProp: "name",
    		$$slots: {
    			default: [
    				create_default_slot_1$4,
    				({ option }) => ({ 35: option }),
    				({ option }) => [0, option ? 16 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*selectedBlock*/ ctx[4] !== void 0) {
    		inputselect0_props.value = /*selectedBlock*/ ctx[4];
    	}

    	inputselect0 = new InputSelect({
    			props: inputselect0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputselect0, "value", inputselect0_value_binding));
    	inputselect0.$on("change", /*change_handler*/ ctx[19]);

    	function inputselect1_value_binding(value) {
    		/*inputselect1_value_binding*/ ctx[21].call(null, value);
    	}

    	let inputselect1_props = {
    		name: "selected-block",
    		inline: true,
    		placeholder: "Select an enemy to place",
    		options: Object.keys(/*$enemyStore*/ ctx[10]).map(/*func_1*/ ctx[20]),
    		valueProp: "name",
    		$$slots: {
    			default: [
    				create_default_slot$8,
    				({ option }) => ({ 35: option }),
    				({ option }) => [0, option ? 16 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*selectedEnemy*/ ctx[5] !== void 0) {
    		inputselect1_props.value = /*selectedEnemy*/ ctx[5];
    	}

    	inputselect1 = new InputSelect({
    			props: inputselect1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputselect1, "value", inputselect1_value_binding));
    	inputselect1.$on("change", /*change_handler_1*/ ctx[22]);

    	level = new Level({
    			props: {
    				blocks: /*blocks*/ ctx[1],
    				enemies: /*enemies*/ ctx[2],
    				width: /*width*/ ctx[7],
    				height: /*height*/ ctx[8]
    			},
    			$$inline: true
    		});

    	level.$on("draw", /*onLevelDraw*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			create_component(levelpreview.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			create_component(inputselect0.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(inputselect1.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(level.$$.fragment);
    			attr_dev(div0, "class", "svelte-1l9uq66");
    			add_location(div0, file$p, 3, 2, 133);
    			attr_dev(div1, "class", "svelte-1l9uq66");
    			add_location(div1, file$p, 17, 2, 601);
    			attr_dev(div2, "class", "tool-picker svelte-1l9uq66");
    			add_location(div2, file$p, 2, 1, 104);
    			attr_dev(div3, "class", "level-container svelte-1l9uq66");
    			set_style(div3, "background", /*background*/ ctx[3]);
    			set_style(div3, "height", /*height*/ ctx[8] + 18 + "px");
    			add_location(div3, file$p, 34, 1, 1128);
    			attr_dev(div4, "class", "drawing-tool svelte-1l9uq66");
    			add_location(div4, file$p, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			mount_component(levelpreview, div4, null);
    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			mount_component(inputselect0, div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(inputselect1, div1, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			mount_component(level, div3, null);
    			/*div3_binding*/ ctx[23](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div3, "mousedown", /*onMouseDown*/ ctx[13], false, false, false),
    					listen_dev(div3, "mouseup", /*onMouseUp*/ ctx[15], false, false, false),
    					listen_dev(div3, "mousemove", /*onMouseMove*/ ctx[14], false, false, false),
    					listen_dev(div3, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[16]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const levelpreview_changes = {};

    			if (dirty[0] & /*background, thumbnail*/ 9) levelpreview_changes.level = {
    				background: /*background*/ ctx[3],
    				thumbnail: /*thumbnail*/ ctx[0]
    			};

    			levelpreview.$set(levelpreview_changes);
    			const inputselect0_changes = {};
    			if (dirty[0] & /*$blockStore*/ 512) inputselect0_changes.options = Object.keys(/*$blockStore*/ ctx[9]).map(/*func*/ ctx[17]);

    			if (dirty[0] & /*$blockStore*/ 512 | dirty[1] & /*$$scope, option*/ 48) {
    				inputselect0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*selectedBlock*/ 16) {
    				updating_value = true;
    				inputselect0_changes.value = /*selectedBlock*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputselect0.$set(inputselect0_changes);
    			const inputselect1_changes = {};
    			if (dirty[0] & /*$enemyStore*/ 1024) inputselect1_changes.options = Object.keys(/*$enemyStore*/ ctx[10]).map(/*func_1*/ ctx[20]);

    			if (dirty[0] & /*$enemyStore*/ 1024 | dirty[1] & /*$$scope, option*/ 48) {
    				inputselect1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty[0] & /*selectedEnemy*/ 32) {
    				updating_value_1 = true;
    				inputselect1_changes.value = /*selectedEnemy*/ ctx[5];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			inputselect1.$set(inputselect1_changes);
    			const level_changes = {};
    			if (dirty[0] & /*blocks*/ 2) level_changes.blocks = /*blocks*/ ctx[1];
    			if (dirty[0] & /*enemies*/ 4) level_changes.enemies = /*enemies*/ ctx[2];
    			if (dirty[0] & /*width*/ 128) level_changes.width = /*width*/ ctx[7];
    			if (dirty[0] & /*height*/ 256) level_changes.height = /*height*/ ctx[8];
    			level.$set(level_changes);

    			if (!current || dirty[0] & /*background*/ 8) {
    				set_style(div3, "background", /*background*/ ctx[3]);
    			}

    			if (!current || dirty[0] & /*height*/ 256) {
    				set_style(div3, "height", /*height*/ ctx[8] + 18 + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(levelpreview.$$.fragment, local);
    			transition_in(inputselect0.$$.fragment, local);
    			transition_in(inputselect1.$$.fragment, local);
    			transition_in(level.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(levelpreview.$$.fragment, local);
    			transition_out(inputselect0.$$.fragment, local);
    			transition_out(inputselect1.$$.fragment, local);
    			transition_out(level.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(levelpreview);
    			destroy_component(inputselect0);
    			destroy_component(inputselect1);
    			destroy_component(level);
    			/*div3_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const blockSize = 40;
    const thumbnailScale = 8;

    function instance$r($$self, $$props, $$invalidate) {
    	let $blockStore;
    	let $enemyStore;
    	validate_store(blockStore, "blockStore");
    	component_subscribe($$self, blockStore, $$value => $$invalidate(9, $blockStore = $$value));
    	validate_store(enemyStore, "enemyStore");
    	component_subscribe($$self, enemyStore, $$value => $$invalidate(10, $enemyStore = $$value));
    	let { background = null } = $$props;
    	let { thumbnail } = $$props;
    	let { blocks = [] } = $$props;
    	let { enemies = [] } = $$props;
    	let selectedBlock = null;
    	let selectedEnemy = null;
    	let mouseDown = false;
    	let levelContainer;
    	let canvas;

    	function onLevelDraw(e) {
    		const canvas = e.detail;
    		$$invalidate(0, thumbnail = makeThumbnail(canvas, width / thumbnailScale, height / thumbnailScale));
    	}

    	function selectBlock(name) {
    		$$invalidate(4, selectedBlock = name);
    		$$invalidate(5, selectedEnemy = null);
    	}

    	function selectEnemy(name) {
    		$$invalidate(4, selectedBlock = null);
    		$$invalidate(5, selectedEnemy = name);
    	}

    	function onPreviewPan(e) {
    		const centerTargetX = e.detail * thumbnailScale;
    		const leftTargetX = Math.max(centerTargetX - levelContainer.clientWidth / 2, 0);
    		levelContainer.scroll(leftTargetX, 0);
    	}

    	function onMouseDown(e) {
    		// if they right click or alt click, select whatever block they're hovering over
    		// if no block is there, it selects null, which makes placeBlock erase the current block
    		if (e.altKey || e.button !== 0) {
    			$$invalidate(4, selectedBlock = findBlockAtPosition(e));
    			$$invalidate(5, selectedEnemy = findEnemyAtPosition(e));
    		}

    		mouseDown = e.button === 0;
    		onMouseMove(e);
    	}

    	function onMouseMove(e) {
    		if (mouseDown) {
    			const { x, y } = getEventItemPosition(e);
    			placeItem(x, y);
    		}
    	}

    	function onMouseUp(e) {
    		mouseDown = false;
    	}

    	function findBlockAtPosition(e) {
    		const { x, y } = getEventItemPosition(e);
    		const block = blocks.find(b => b.x == x && b.y == y);
    		return block == null ? null : block.name;
    	}

    	function findEnemyAtPosition(e) {
    		const { x, y } = getEventItemPosition(e);
    		const enemy = enemies.find(e => e.x == x && e.y == y);
    		return enemy == null ? null : enemy.name;
    	}

    	function getEventItemPosition(e) {
    		return {
    			x: Math.floor(e.offsetX / blockSize) * blockSize,
    			y: Math.floor((height - e.offsetY) / blockSize) * blockSize
    		};
    	}

    	function placeItem(x, y) {
    		eraseItemAt(x, y);

    		if (selectedBlock != null) {
    			const template = $blockStore[selectedBlock];

    			$$invalidate(1, blocks = [
    				...blocks,
    				{
    					name: selectedBlock,
    					x,
    					y,
    					width: blockSize,
    					height: blockSize
    				}
    			]);
    		} else if (selectedEnemy != null) {
    			const template = $enemyStore[selectedEnemy];

    			$$invalidate(2, enemies = [
    				...enemies,
    				{
    					name: selectedEnemy,
    					x,
    					y,
    					width: template.width,
    					height: template.height
    				}
    			]);
    		}
    	}

    	function eraseItemAt(x, y) {
    		$$invalidate(1, blocks = blocks.filter(b => b.x != x || b.y != y));
    		$$invalidate(2, enemies = enemies.filter(e => e.x != x || e.y != y));
    	}

    	function hydrateEnemy(enemy) {
    		const template = $enemyStore[enemy.name];
    		return { ...template, ...enemy };
    	}

    	const writable_props = ["background", "thumbnail", "blocks", "enemies"];

    	Object_1$5.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelBuilderDrawingTool> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelBuilderDrawingTool", $$slots, []);

    	function contextmenu_handler(event) {
    		bubble($$self, event);
    	}

    	const func = name => $blockStore[name];

    	function inputselect0_value_binding(value) {
    		selectedBlock = value;
    		$$invalidate(4, selectedBlock);
    	}

    	const change_handler = () => $$invalidate(5, selectedEnemy = null);
    	const func_1 = name => $enemyStore[name];

    	function inputselect1_value_binding(value) {
    		selectedEnemy = value;
    		$$invalidate(5, selectedEnemy);
    	}

    	const change_handler_1 = () => $$invalidate(4, selectedBlock = null);

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			levelContainer = $$value;
    			$$invalidate(6, levelContainer);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("background" in $$props) $$invalidate(3, background = $$props.background);
    		if ("thumbnail" in $$props) $$invalidate(0, thumbnail = $$props.thumbnail);
    		if ("blocks" in $$props) $$invalidate(1, blocks = $$props.blocks);
    		if ("enemies" in $$props) $$invalidate(2, enemies = $$props.enemies);
    	};

    	$$self.$capture_state = () => ({
    		Art,
    		artStore,
    		blockStore,
    		LivingSprite,
    		enemyStore,
    		Level,
    		makeThumbnail,
    		LevelPreview,
    		InputSelect,
    		background,
    		thumbnail,
    		blocks,
    		enemies,
    		blockSize,
    		selectedBlock,
    		selectedEnemy,
    		mouseDown,
    		levelContainer,
    		canvas,
    		thumbnailScale,
    		onLevelDraw,
    		selectBlock,
    		selectEnemy,
    		onPreviewPan,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		findBlockAtPosition,
    		findEnemyAtPosition,
    		getEventItemPosition,
    		placeItem,
    		eraseItemAt,
    		hydrateEnemy,
    		width,
    		height,
    		highestXUsed,
    		$blockStore,
    		$enemyStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("background" in $$props) $$invalidate(3, background = $$props.background);
    		if ("thumbnail" in $$props) $$invalidate(0, thumbnail = $$props.thumbnail);
    		if ("blocks" in $$props) $$invalidate(1, blocks = $$props.blocks);
    		if ("enemies" in $$props) $$invalidate(2, enemies = $$props.enemies);
    		if ("selectedBlock" in $$props) $$invalidate(4, selectedBlock = $$props.selectedBlock);
    		if ("selectedEnemy" in $$props) $$invalidate(5, selectedEnemy = $$props.selectedEnemy);
    		if ("mouseDown" in $$props) mouseDown = $$props.mouseDown;
    		if ("levelContainer" in $$props) $$invalidate(6, levelContainer = $$props.levelContainer);
    		if ("canvas" in $$props) canvas = $$props.canvas;
    		if ("width" in $$props) $$invalidate(7, width = $$props.width);
    		if ("height" in $$props) $$invalidate(8, height = $$props.height);
    		if ("highestXUsed" in $$props) $$invalidate(25, highestXUsed = $$props.highestXUsed);
    	};

    	let height;
    	let highestXUsed;
    	let width;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*blocks*/ 2) {
    			 if (blocks != null && blocks.some(b => b.png != null)) {
    				$$invalidate(1, blocks = blocks.map(b => {
    					const { png, ...otherProps } = b;
    					return otherProps;
    				}));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*blocks*/ 2) {
    			 $$invalidate(25, highestXUsed = blocks.length > 0
    			? Math.max(...blocks.map(b => b.x + b.width))
    			: 0);
    		}

    		if ($$self.$$.dirty[0] & /*highestXUsed*/ 33554432) {
    			 $$invalidate(7, width = Math.max(800, highestXUsed + 500));
    		}
    	};

    	 $$invalidate(8, height = 600); //Math.max(400, highestYUsed + 300)

    	return [
    		thumbnail,
    		blocks,
    		enemies,
    		background,
    		selectedBlock,
    		selectedEnemy,
    		levelContainer,
    		width,
    		height,
    		$blockStore,
    		$enemyStore,
    		onLevelDraw,
    		onPreviewPan,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		contextmenu_handler,
    		func,
    		inputselect0_value_binding,
    		change_handler,
    		func_1,
    		inputselect1_value_binding,
    		change_handler_1,
    		div3_binding
    	];
    }

    class LevelBuilderDrawingTool extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$r,
    			create_fragment$r,
    			safe_not_equal,
    			{
    				background: 3,
    				thumbnail: 0,
    				blocks: 1,
    				enemies: 2
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilderDrawingTool",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*thumbnail*/ ctx[0] === undefined && !("thumbnail" in props)) {
    			console.warn("<LevelBuilderDrawingTool> was created without expected prop 'thumbnail'");
    		}
    	}

    	get background() {
    		throw new Error("<LevelBuilderDrawingTool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<LevelBuilderDrawingTool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbnail() {
    		throw new Error("<LevelBuilderDrawingTool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbnail(value) {
    		throw new Error("<LevelBuilderDrawingTool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blocks() {
    		throw new Error("<LevelBuilderDrawingTool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blocks(value) {
    		throw new Error("<LevelBuilderDrawingTool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enemies() {
    		throw new Error("<LevelBuilderDrawingTool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enemies(value) {
    		throw new Error("<LevelBuilderDrawingTool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var levelStore = LocalStorageStore('levels', {
    	'Level 1': {
    		name: 'Level 1',
    		playableCharacters: ['mr squiggles', 'sonic', 'mr littles'],
    		background: 'rgb(135, 206, 235)',
    		blocks: [
    			{ x: 0, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 0, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 0, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 0, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 40, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 40, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 40, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 40, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 80, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 80, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 80, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 80, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 120, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 120, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 120, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 120, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 160, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 160, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 160, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 160, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 200, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 200, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 200, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 200, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 240, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 240, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 240, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 240, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 280, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 280, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 280, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 280, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 320, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 320, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 320, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 320, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 360, y: 280, width: 40, height: 40, name: 'Grass' },
    			{ x: 360, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 360, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 360, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 360, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 360, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 360, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 360, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 400, y: 280, width: 40, height: 40, name: 'Grass' },
    			{ x: 400, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 400, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 400, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 400, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 400, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 400, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 400, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 440, y: 280, width: 40, height: 40, name: 'Grass' },
    			{ x: 440, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 440, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 440, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 440, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 440, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 440, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 440, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 480, y: 280, width: 40, height: 40, name: 'Grass' },
    			{ x: 480, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 480, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 480, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 480, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 480, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 480, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 480, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 520, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 520, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 520, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 520, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 560, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 560, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 560, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 560, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 600, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 600, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 600, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 600, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 640, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 640, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 640, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 640, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 680, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 720, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 760, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 800, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 840, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 0, solid: true, width: 40, height: 40, name: 'Lava' },
    			{ x: 920, y: 0, solid: true, width: 40, height: 40, name: 'Lava' },
    			{ x: 960, y: 0, solid: true, width: 40, height: 40, name: 'Lava' },
    			{ x: 1000, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1000, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1000, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1000, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1040, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1080, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1120, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1160, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1200, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1200, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1200, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1200, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1240, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 1240, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1240, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1240, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1280, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 1280, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1280, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1280, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1320, y: 120, width: 40, height: 40, name: 'Spikes' },
    			{ x: 1320, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1320, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1320, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1360, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1360, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1360, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1360, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1400, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1400, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1400, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1400, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1440, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1440, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1440, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1440, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1480, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1480, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1480, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1480, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1520, y: 120, solid: true, width: 40, height: 40, name: 'Grass' },
    			{ x: 1520, y: 80, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1520, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1520, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1560, y: 160, solid: true, width: 40, height: 40, name: 'Grass' },
    			{ x: 1560, y: 120, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1560, y: 80, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1560, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1560, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1600, y: 200, solid: true, width: 40, height: 40, name: 'Grass' },
    			{ x: 1600, y: 160, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1600, y: 120, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1600, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1600, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1600, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1640, y: 240, solid: true, width: 40, height: 40, name: 'Grass' },
    			{ x: 1640, y: 200, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1640, y: 160, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1640, y: 120, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1640, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1640, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1640, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1680, y: 240, solid: true, width: 40, height: 40, name: 'Spikes' },
    			{ x: 1680, y: 200, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1680, y: 160, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1680, y: 120, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1680, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1680, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1680, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1720, y: 240, solid: true, width: 40, height: 40, name: 'Spikes' },
    			{ x: 1720, y: 200, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1720, y: 160, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1720, y: 120, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1720, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1720, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1760, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1760, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1800, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1800, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1840, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1840, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1880, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1880, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1880, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1920, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1920, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1920, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 1960, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1960, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1960, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2000, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2000, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2000, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2040, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2040, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2040, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2080, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2080, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2080, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2120, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2120, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2120, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2160, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2160, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2160, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2200, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2200, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2200, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2240, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2240, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2240, y: 0, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2280, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2280, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2320, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2320, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2360, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2360, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2400, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2400, y: 40, solid: true, width: 40, height: 40, name: 'ground' },
    			{ x: 2440, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2440, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2480, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2480, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2520, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2520, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2560, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2560, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2600, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2600, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2640, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2640, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2680, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2680, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2720, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2720, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2760, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2760, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2800, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2800, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2840, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2840, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2880, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2880, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2920, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2920, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 2960, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 2960, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3000, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3000, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3040, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3040, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3080, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3080, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3120, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3120, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3160, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3160, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3200, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3200, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3240, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3240, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3280, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3280, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3320, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3320, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3360, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3360, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3400, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3400, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3440, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3440, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3480, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3480, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3520, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3520, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3560, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3560, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3600, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3600, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3640, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3640, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3680, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3680, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3720, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3720, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3760, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3760, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3800, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3800, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3840, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3840, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3880, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3880, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3920, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3920, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 3960, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 3960, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4000, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4000, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4040, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4040, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4080, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4080, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4120, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4120, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4160, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4160, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4200, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4200, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4240, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4240, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4280, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4280, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4320, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4320, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4360, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4360, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4400, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4400, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4440, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4440, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4480, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4480, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4520, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4520, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4560, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4560, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4600, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4600, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4640, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4640, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4680, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4680, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4720, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4720, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4760, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4760, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4800, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4800, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4840, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4840, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4880, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4880, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4920, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4920, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 4960, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 4960, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5000, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5000, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5040, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5040, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5080, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5080, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5120, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5120, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5160, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5160, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5200, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5200, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5240, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5240, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5280, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5280, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5320, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5320, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 5360, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 5360, y: 40, width: 40, height: 40, name: 'ground' },
    			{ name: 'ground', x: 1760, y: 120, width: 40, height: 40 },
    		],
    		enemies: [],
    		thumbnail:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAuEAAABLCAYAAADeWFkzAAAKj0lEQVR4Xu3dwWsc1x0H8LfGrWOjQ3OQczTEAad1clWhlzihRxVLMio05GBahP6BnhulF6nQf0CHEEF7aU2TgAU9BBKlR9NDSKGxc0kJ+OIGmoCQCk26ZcZSrRWzymjfzJt5q08uNi+7+2Y+7zeTX1bz1RsE/xAgQIAAAQIECBAgkFRgkHQ2kxEgQIAAAQIECBAgEDThioAAAQIECBAgQIBAYgFNeGJw0xEgQIAAAQIECBDQhKsBAgQIECBAgAABAokFNOGJwU1HgAABAgQIECBAQBOuBggQIECAAAECBAgkFtCEJwY3HQECBAgQIECAAAFNuBogQIAAAQIECBAgkFhAE54Y3HQECBAgQIAAAQIENOFqgAABAgQIECBAgEBiAU14YnDTESBAgAABAgQIENCEqwECBAgQIECAAAECiQU04YnBTUeAAAECBAgQIEBAE64GCBAgQIAAAQIECCQW0IQnBjcdAQIECBAgQIAAAU24GiBAgAABAgQIECCQWEATnhjcdAQIECBAgAABAgQ04WqAAAECBAgQIECAQGIBTXhicNMRIECAAAECBAgQ0ISrAQIECBAgQIAAAQKJBTThicFNR4AAAQIECBAgQEATrgYIECBAgAABAgQIJBbQhCcGNx0BAgQIECBAgAABTbgaIECAAAECBAgQIJBYQBOeGNx0BAgQIECAAAECBDThaoAAAQIECBAgQIBAYgFNeGJw0xEgQIAAAQIECBDQhKsBAgQIECBAgAABAokFNOGJwU1HgAABAgQIECBAQBOuBggQIECAAAECBAgkFtCEJwY3HQECBAgQIECAAAFNuBogQIAAAQIECBAgkFhAE54Y3HQECBAgQIAAAQIENOFqgAABAgQIECBAgEBigfyb8LVwI6yFnRG3mLHEC2A6AgQIECBAgACBsyeQZxO+FoaNLtVayNOhUQQfRoAAAQIECBAgkEogz+ZTE56qPsxDgAABAgQIECDQgoAmvED1TXgLpeUjCRAgQIAAAQIExglk2YRv/X5reH//fth4uBG2ntsKD/YfhGsXr4VJx9ZX1rN0UNYECBAgQIAAAQJ5CmTZfC6+Mjf8/KtvSvFnz38R9mdfDN/ZexQmHdve3s7SIc+Sm7Kj/nV4KfwqfDhlZ+V0CBAgQIAAgZYFsmw+5+fnh7u7u2F2/7OyAT+/9yh8felymHTs3ffvZenQcm34+HECVZkEjzSpFwIECBAgQOAUAlk2n8U34f/676WyCX/63F749ML18s9Jx3Z2drJ0OMU6e2mTAuOb8NdDCG8cTFX8Bp+irqrGmjwan0WAAAECBAhkKJBl87n8wytlE/7UM1fLb79nZmbCxX/+rWzCJxnzOEqGldvlIY9pwjc3N4erq6vlNXXn7TvD5aXlQdVYl4dubgIECBAgQKAfAlk24T//8QvlM+GH334Xjfflf/+jfCZ8kjFNeD+KMZejOB4MLgPBKxuDYvz2a7cHNxdvDhdvLYbi71VjuZyn4yRAgAABAgTaE8iyCRfMbK8gfPIJAgchzJj68z98KowAAQIECBAoBLJswgUzFW8ygYpHT+b/Oj8SAi5+M89/jgWDx429IwScbOlMRIAAAQIE+iyQZRMumNnnkpqyY6towhc+nAtfDkeDwd8b7NUaEwKesvpwOgQIECBAYEKBLJtwwcwJV9vbTi9Q0YQv//mKEPDpJb2DAAECBAgQOCKQZRMumKmGUwlUhTAf/WFbCDjVApiHAAECBAhMqUCWTXhMMK5qZ01huSmt7pjTaiCEqdZiFsB7CRAgQIDAdAtk2YQLZk53UXZ2dg2HMKvCmoKZna2uiQkQIECAQK8EsmzCBTN7VUPTczANhzCrwpqCmdNTLs6EAAECBAjECGTZhAtmxiy5944VaDiEWbWLq0ef1B8BAgQIECBQCGTZhAtmKt42BJoOYVbt4qoJb2PlfCYBAgQIEMhPYLQJXws3wlrYGTmNrsZOsMwqmJnCL6buYo7vILw4Mn3dsZhjrjvHKV/XdF1VBTOFNWMW3nsJECBAgMD0CAxCxY/gOzu9tXrfzPc+mJnCtKZV5VqmOL6qiXt+zDE7YdbdMVNYs7O7i4kJECBAgECvBPrYhL8eQnjjQGl48MjMyNjiK3PlZimz+5+Fp8/thU8vXC//nHTsICz3rfNWHUvl2FqCNe55Qzum+S9+8jKZcwLTmJ0w6+6YKayZ4NowBQECBAgQyECgd0345ubmcHV1tXxM5s7bd4bLS8uD42N//M0vJ96xcFxYrs68VcdSOfbxcvtLn2kTPrFzAtOYnTCr6qrumOfE279czECAAAECBPomMKgKoz1/8flwf/9+2Hi4Ebae2yr/nmJsY2WjPJ7br90eLCwtDBeWFkLx9+Njf9n67cQ7Fo4Ly9WZt+pYqsaKRT7q92D/Qbh28VrlWPHv1h+ul86Hr6sztr6yPnGotjjXo3Mcrm/bY0fX9+bizeHircWR9T1prDCtOr4m6zRmJ8yquqo7pgnv223R8RAgQIAAgfYFBl2F0eqG1rzuxdB0mM+aV5uqNS77swwYfBEYMHj2PIOUBmf1y6jB8ZBj0YjEhMy6eO/5vUfh60uXw+7ubvmceHEDnfaxd9+/N/E34dOw5jnW6Vk75mm/Bvt8zzlrteZ8H//P46T//XWt9r9niFnfHN57VneTHiy8PDf8cjgacowJmdV9b0yQ0nuvh5idF5vecTTH9ahbp153PdQ1yLEOHHNcqL1pv7q15nX1r8sYq6bX1+f163qLWY+YuvILCp485jJoevfJumE0r5sJMQYxP7qx5nH2MevmvexnZhgw2A0MGBQ/vVcHjw1iepr2n9xub4ZB07tP1g2jed3VEGMQU7DWPM4+Zt28l/1TzzBgcCkwYFD8WmV18Nggpqdpr0Vu/5MFMzMNYsUUrGCm8J3gmdBVytCV0LN7jnuOe85J95yYnqb9Vrm9GQQzMw11CmZOHkLKIaQyacCqT+cm7NVd2KtPdeBY4kKTKfxcq91dq3XtU9RBl3MIZh7ZfbLpB+6rPi8mEOC9gpmxu6SmqPGzNofrcnpCV12t5Vm7Zvp+vl3VgXn7fy9punZjftlEe99Tt//JgpmZhqRifnQjmCkYJwwkECUUdrX8tbauBQbqoPtrIaanab9Vbm8GwcxMQ1IxBSuYKRgnDCQQJRS2FxgwOPzW3T2x23tiTE/TXovc/icLZmYazLz76vbO4NXwclEiw9+FG+FceCkMwo06Y0tvzq19/tU3ZXUJZ7Vn0PRNZVoCtU27tH+bNAMBAgQIEGheQDAz02DmOz+6F8IwhPCDg6L4ewih2EPz28Y+CeEnH82P7C7aZRhjGgKI4/yaDprkttPpuMBRTKi4+VugTyRAgAABAt0I2DHzQv8DEFUhlQ9Wdp5UzCchhO8fK6ATxpbenCt/DDt7JIx71oIwTYdKUuwA1tXutnWt6tbQWQ3gdHOLNysBAgQI9FVAMDPTYObd726HcNhoH/02vMbYT9+78v9nIQVS2gukNP3YxbQEapt26evN1XERIECAAIGTBAQzMw1m3v3Zdgh/CiHcCk/+LFa6xtgv3nohFM+EC6S0a9B0szktgdqmXdziCRAgQIBAjgL/A/wb82ecCxh3AAAAAElFTkSuQmCC',
    	},
    	'Level 2': {
    		name: 'Level 2',
    		playableCharacters: ['mr squiggles', 'sonic'],
    		background: 'rgb(135, 206, 235)',
    		blocks: [
    			{ x: 0, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 0, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 40, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 40, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 80, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 80, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 120, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 120, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 160, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 160, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 200, y: 40, width: 40, height: 40, name: 'Spikes' },
    			{ x: 200, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 240, y: 40, width: 40, height: 40, name: 'Spikes' },
    			{ x: 240, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 280, y: 40, width: 40, height: 40, name: 'Spikes' },
    			{ x: 280, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 320, y: 40, width: 40, height: 40, name: 'Spikes' },
    			{ x: 320, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 360, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 360, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 400, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 400, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 440, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 440, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 480, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 480, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 520, y: 80, width: 40, height: 40, name: 'Grass' },
    			{ x: 520, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 520, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 560, y: 80, width: 40, height: 40, name: 'Grass' },
    			{ x: 560, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 560, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 600, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 600, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 600, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 600, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 640, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 640, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 640, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 640, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 640, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 280, width: 40, height: 40, name: 'Grass' },
    			{ x: 680, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 680, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 360, width: 40, height: 40, name: 'Grass' },
    			{ x: 720, y: 320, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 280, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 720, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 360, width: 40, height: 40, name: 'Grass' },
    			{ x: 760, y: 320, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 280, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 760, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 440, width: 40, height: 40, name: 'Grass' },
    			{ x: 800, y: 400, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 360, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 320, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 280, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 800, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 440, width: 40, height: 40, name: 'Grass' },
    			{ x: 840, y: 400, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 360, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 320, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 280, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 840, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 480, width: 40, height: 40, name: 'Grass' },
    			{ x: 880, y: 440, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 400, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 360, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 320, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 280, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 880, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 920, y: 0, width: 40, height: 40, name: 'Lava' },
    			{ x: 960, y: 0, width: 40, height: 40, name: 'Lava' },
    			{ x: 1000, y: 0, width: 40, height: 40, name: 'Lava' },
    			{ x: 1040, y: 480, width: 40, height: 40, name: 'Grass' },
    			{ x: 1040, y: 440, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 400, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 360, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 320, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 280, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1040, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 440, width: 40, height: 40, name: 'Grass' },
    			{ x: 1080, y: 400, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 360, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 320, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 280, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1080, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 320, width: 40, height: 40, name: 'Grass' },
    			{ x: 1120, y: 280, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 240, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1120, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 240, width: 40, height: 40, name: 'Grass' },
    			{ x: 1160, y: 200, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1160, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1200, y: 200, width: 40, height: 40, name: 'Grass' },
    			{ x: 1200, y: 160, width: 40, height: 40, name: 'ground' },
    			{ x: 1200, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 1200, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1200, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1200, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1240, y: 160, width: 40, height: 40, name: 'Grass' },
    			{ x: 1240, y: 120, width: 40, height: 40, name: 'ground' },
    			{ x: 1240, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1240, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1240, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1280, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1280, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1280, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1280, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1320, y: 120, width: 40, height: 40, name: 'Grass' },
    			{ x: 1320, y: 80, width: 40, height: 40, name: 'ground' },
    			{ x: 1320, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1320, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1360, y: 80, width: 40, height: 40, name: 'Grass' },
    			{ x: 1360, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1360, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1400, y: 80, width: 40, height: 40, name: 'Grass' },
    			{ x: 1400, y: 40, width: 40, height: 40, name: 'ground' },
    			{ x: 1400, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1440, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 1440, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1480, y: 40, width: 40, height: 40, name: 'Grass' },
    			{ x: 1480, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1520, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1560, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1600, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1640, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1680, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1720, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1760, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1800, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 1840, y: 0, width: 40, height: 40, name: 'Lava' },
    			{ x: 1880, y: 0, width: 40, height: 40, name: 'Lava' },
    			{ x: 2040, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2080, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2120, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2160, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2200, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2240, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2280, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2320, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2360, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2400, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2440, y: 0, width: 40, height: 40, name: 'ground' },
    			{ x: 2520, y: 0, width: 40, height: 40, name: 'ground' },
    			{ name: 'ground', x: 1160, y: -40, width: 40, height: 40 },
    			{ name: 'ground', x: 2480, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2560, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2640, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2680, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2720, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2760, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2800, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2840, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2880, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2600, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2600, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2560, y: 120, width: 40, height: 40 },
    			{ name: 'ground', x: 2480, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2640, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2680, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2720, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2600, y: 120, width: 40, height: 40 },
    			{ name: 'ground', x: 2640, y: 120, width: 40, height: 40 },
    			{ name: 'ground', x: 2680, y: 120, width: 40, height: 40 },
    			{ name: 'ground', x: 2720, y: 120, width: 40, height: 40 },
    			{ name: 'ground', x: 2440, y: 280, width: 40, height: 40 },
    			{ name: 'ground', x: 2400, y: 280, width: 40, height: 40 },
    			{ name: 'ground', x: 2360, y: 280, width: 40, height: 40 },
    			{ name: 'ground', x: 2320, y: 280, width: 40, height: 40 },
    			{ name: 'ground', x: 2280, y: 280, width: 40, height: 40 },
    			{ name: 'ground', x: 2240, y: 280, width: 40, height: 40 },
    			{ name: 'ground', x: 2240, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2200, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2160, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2120, y: 200, width: 40, height: 40 },
    			{ name: 'ground', x: 2080, y: 160, width: 40, height: 40 },
    			{ name: 'ground', x: 2040, y: 120, width: 40, height: 40 },
    			{ name: 'ground', x: 2000, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2000, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2000, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 1960, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 1960, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 1920, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 1920, y: 0, width: 40, height: 40 },
    			{ name: 'ground', x: 2760, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2800, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2760, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2720, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2680, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2640, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2600, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2560, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2520, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2480, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2440, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2400, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2360, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2320, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2560, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2520, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2480, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2440, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2400, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2360, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2320, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2320, y: 120, width: 40, height: 40 },
    			{ name: 'ground', x: 2360, y: 120, width: 40, height: 40 },
    			{ name: 'ground', x: 2440, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2400, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2360, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2320, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2280, y: 240, width: 40, height: 40 },
    			{ name: 'ground', x: 2280, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2240, y: 80, width: 40, height: 40 },
    			{ name: 'ground', x: 2240, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2200, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2160, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2280, y: 40, width: 40, height: 40 },
    			{ name: 'ground', x: 2200, y: 80, width: 40, height: 40 },
    			{ name: 'Grass', x: 80, y: 400, width: 40, height: 40 },
    			{ name: 'Grass', x: 120, y: 400, width: 40, height: 40 },
    			{ name: 'Grass', x: 160, y: 400, width: 40, height: 40 },
    			{ name: 'Grass', x: 200, y: 400, width: 40, height: 40 },
    			{ name: 'Grass', x: 240, y: 440, width: 40, height: 40 },
    			{ name: 'Grass', x: 320, y: 440, width: 40, height: 40 },
    			{ name: 'Grass', x: 360, y: 440, width: 40, height: 40 },
    		],
    		enemies: [
    			{ name: 'simple black guy', x: 2680, y: 360 },
    			{ name: 'simple black guy', x: 2640, y: 360 },
    			{ name: 'simple black guy', x: 2640, y: 400 },
    			{ name: 'simple black guy', x: 2600, y: 400 },
    			{ name: 'simple black guy', x: 2560, y: 400 },
    			{ name: 'simple black guy', x: 2520, y: 440 },
    			{ name: 'simple black guy', x: 2480, y: 440 },
    			{ name: 'simple black guy', x: 2440, y: 440 },
    			{ name: 'simple black guy', x: 2440, y: 400 },
    			{ name: 'simple black guy', x: 2400, y: 400 },
    			{ name: 'simple black guy', x: 2400, y: 360 },
    			{ name: 'simple black guy', x: 2360, y: 360 },
    			{ name: 'simple black guy', x: 2360, y: 320 },
    			{ name: 'simple black guy', x: 2320, y: 320 },
    			{ name: 'mr smiley', x: 2080, y: 80 },
    		],
    		thumbnail:
    			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAasAAABLCAYAAADOIqhbAAAMOUlEQVR4Xu1dTWwd1RU+L0AhwYu0Ugi7SISFIfGmSt2KSukLtDsjJQajFnWBWkXZsERqd3mhm4cUll1EFcISbBACL/IkFkjJI2pZWEggkCBiQ4WKityokMqJWyEz1Uye/4/9zsw5994zM583NsP9Ofc738yXmfPNnQ7hBwgAASAABICAcwQ6zuNDeEAACAABIAAECGIFEgABIAAEgIB7BCBW7lOEAIEAEAACQABiBQ4AASAABICAewQgVu5ThACBABAAAkAAYgUOAAEgAASAgHsEIFbuU4QAgQAQAAJAAGIFDgABIAAEgIB7BCBW7lOEAIEAEAACQABi1QQO9KhLPRqaLcV6PLPAMBAQAAJtRQBiVdfM9yjbEXpP8ZK39Xh1xRVxAwEg4BIBiJXLtAiCshYX6/EES0ATIAAEgIAUAYiVFClv7azFxXo8b3ghHiAABGqNAMSqpumbf30+u75ynfpf9Wn+4Xkq/j7br5xP6/FqCivCBgJAwCkClS9upuuRFvS5dtK+pgFHGmyP9Z55fDr78uZqEchDd9+glUNTNBgMKudz7HhNxjlSOjENEAAC1RGofHGrPuWop/SxE9eOm1xjLlAvxnAA4XpnPpih5eVlOrTyRSFU99xeooUri5XzOTMzk+0Y7+TizoU1BWfDlGEoIAAEwiNQ+eKmDg1ixUMoFKsz16bpm+8PFGL1w3236fN7j9FwOKycz/zOasd4XcYND7FSUx8DAAEgUB6Byhe38lNt6wGxUonV3DtHCrG67/DR4g5rYmJC9Rhw7qdHCrHaMt6JAe6s1ETHABEQ6BLRVSLqEdGF0XzSYxHCwxQWCCQTK2lBn2s3uX/yjqHAyFxgAaTVGNL1Lr0xoLxmld9VrYmMpmb1u18eL2pgm8d7+tdPNxZnq3xhHBcInB9F8R7R+svx0mMuFoAgxiNQTaykRgdpu/FxtqYFZ3TI61HbzRTcMY1YSefVzNGaJGKhQAAImCMgFythLUUcIWofLFSc0eG7Aw/sMFNwx6wNFtZziLmBhkAACACBbQhArJxRgjM6rD2a22ym4I5ZGyys53AGNcIBAkCgRghArJwlizM67P/XJzvMFNwxzSM66byaOZxBjXDqiYC1cUI6HteungjWNGqxWEkL/5z5ocmGCOu8c0aHB/779x1mCu6YRkik82rmsMYK47USAWvjhHQ8rl0rE5Bq0WKxShVgI+ctuTMFDBaNZAEWBQSAQAkEIFYlwFI1FRpUuJ0pYLBQIY/OQAAINAABiFWsJArFituZAgaLWEnCPEAACHhFAGIVKzNCseJ2poDBIlaSMI8zBKTmhxhhe4olxnrdzQGxipQSqUGF25kCBotIScI03hCQmh9ixO0plhjrdTcHxCpSSqQ7REjNFC52sMBnQyKxB9MAASAAsYrEAc3OFK4MFvhsSCTGYBogAAQ2IwCxisQHzc4UrgwW+GxIJMZgGiAABCBWCTgg3SFCaqZItoMFPhuSgD2tmBIGhlakufoicWdVHbtSPaU7REjNFKl2sMBnQ0qlHY3lCMDAIMeqlS0hVqHTPjIhNMVgYW3sCA0/xk+LQAzeg5NpcxxrdohVCKSZd6o0O1N4MljgsyEhCNPcMWMYi8DJ5vIHNavQuWXESrMzhSeDBT4bEpo8zRo/hrEInGwWZ3ZbDe6sQuSZESvNzhRS04VmR3SNAUQzbwj4MaYfBDS8kvLe2mzkBz1EgjurwBzgdqvQ7EwhNV1oRENjANHMGzgVGD4xAhpeSXlvbTZKDBmm3wUB3FkFoEYdi8qamLeIFXa1CMAof0Nq+KLZpUXTF/+o8sejMhFBrMqgJWxbx6KyJuYF7GohZEZzmmn4IjUMWbdbuLKI612NKYjkBUheHYvKmpiH2NUiAIt8D6nhi9QwZN1uOBzieuebVntGh+QFSF4di8qamAfY1SIAi3wPqeGLxjih6YvHgL45NS46iNU4hCr8/zoWlTUxY1eLCiSpeRcNXzTGCU1fiFW9SQexCpC/VMVnzcloHTNMFwGIlWhIjhsariVaBqatOQIQqwAJTFV81hSQrWOG6SIAsRINyXFDw7VEy8C0NUcAYhUggamKz5oCsnXMMF0EIFaiITluaLiWaBmYtuYIQKwCJDBV8VnzaMY6ZpguAhAr0ZAcNzRcS7QMTFtzBCBWARKYqvisuYBYxwzTRQBiJRqS44aGa4mWgWlrjgDESplAa2NCqjf0Y6wDpgsl2SJ0h5kiAsiYohICEKtKsG10sjYmaN7a1xS9Y6wDpgsl2SJ0h5kiAsiYohICEKtKsG10sjYmaN7a1xS9Y6wDpgsl2SJ0h5kiAsiYohICEKtKsG10sjYmpHpDP8Y6YLpQki1Cd5gpIoCMKSohALGqBNtGJ2tjQqo39GOsA6YLJdkidH/+J1PZW/+4QVO3/02fHPhRMePsP/8z/DPdOhVhekwBBHZFAGJVlRyjT2HEMCZITRcah1aqdYw1XeCTI1UZOrbfLmaK4eq3X3e3d77r4INBrxVS/mk4zgEinVd6DnLtrGMem9iGNghKwMZhxnwBeOaDGVpeXqZDK1/QyqEpysmqMUlo+no3WHBrY00XHHF6BK4an1CcmWJq+iSd/+MLdO3Dw5TdWqDuE7+i7H+36PGZWXrvr+8Hy4HU4KPhOAefdN5U56Vxyms9XDDy1RqV3YJnxOrMtWn65vsDhVjl5ojP7z1W/E5xzLvBgsOFNV1ArKKcPpyZ4uTPThRz54J1oX9x/Xd+7MX+xWDXC6nBR8Px3e6sQp+r1jFHIYfDSYKRz+Fa9SExYjX3zpFCmO47fLS4w5qYmCCNSULTV/O4IYbBglsba7qAWOm5KhiBy/mPj09uEag14brr4INDIgpWt5LyT8NxDhLpvKnOS0EaW9MEYlUi1fOvz2fXV65T/6s+zT88T/nfS28M6Mubq+t3U7loaUwSmr6aEzmGwYJbG2e6mNw/WWC7Gef+2T64WoKrkqZczhde+8upP7308tXNd1cv9i8GFap8Lin/NBznMJHOm+q8lOSxLW1wAdieaa6g79BMYV3IjVFoNitS75Gjtpy4Zdcp3Zli9duvsw7RcN/Bw/kU3dWbSz3Ksl7+H+NMFt45pOGfdV9r0S3Lhzq2h1jlWWMe73HJ9GSmYM0KVxYr5zNGoVlVpD65KDu/YMRgcSq/M0WWjQbqEXUuSMD3ziEN/6z7WhtFJPmpe5vKF7e6L3xL/EKx8mSmYM0Kw2HlfEoL3MnMI938SZTgB2LFglR+Z4p1sTpF1BGB751Dqbhrfa4KzoJGNql8cWsUGkKx8mSmYM0Kg0HlfMYoNKuK1CcGMspBrFicyu5M8Yef31/cWb30t1tiTnnnkIZ/1n3xGFB2Om9uJSZi+aHr04MzTnBFfk9mCq7gqzkBYhSaNUVqGDF051OZz3xkGeVCVdSp8t+djuwdN+8c0vDPuq/mXNUxob69t4qVtHCtaWeNlSaWmhgnpMVdzQnQlOJ423bE0OQNfLnzEn/u5s1/Hrr7xvqL/SmOafJhfVn1OF5Hai5QBW/9aEb42E4as3fjhLS4qynaNqU43rYdMTR5A1/S7TZjbZCSXuvq3C6mWJ0nojVXUf6YIb+rq3Zs7QGFEfLejRPSwrDmTfmmFMfbtiOGJm/gS7rdZmC6KH/xjiZWly5dys6dO1c8dnzz7Tezudm5TuVjH8+VX+kePbwbJ6TFXc1jhKYUx9u2I4Ymb+BLut1mrA1SphdEp4N1pOYCznAgPZbvPpDP89xvn+ucnj2dnZ49TfnfVY/lWG7f4UAaSx2NE9Lirubi05TieNuMGJq8gS/pdpuxNkg51RfTsDqaAq2n4iRimaLLzw6GnWfv7N+WvUZd2ke/oA51JcdmX5nupSgqI298kV+aS+TNl0kiBp81/8gwVY/Ig3U0BVpp4R/t4hRy335stMvDIyMWfbaJTWOOPfmRn0+dgC9LJM0l8hbn3PLESY0xJrK+mE5X3FmF3iJfahBAO13B9+rZTRsN5EK1JlBrlNnj2Owrfj51Ah4cI2kukTfdOVNHrmmMMabqEXmwjqZAKy38o12cQu7lHwyI1gTp0RGTPiXRsWfe9fOpE/BlgqS5RN7inFueONnax4CaAq208I92cQq5l38zIHqLiJ6ijd+5ZgmO/f7V424+dQK+HCVpLpG3OOeWJ062Vaz+D8CqipVdn2rGAAAAAElFTkSuQmCC',
    	},
    });

    /* src\pages\LevelBuilder\LevelBuilder.svelte generated by Svelte v3.24.1 */
    const file$q = "src\\pages\\LevelBuilder\\LevelBuilder.svelte";

    // (1:0) {#if input != null}
    function create_if_block$e(ctx) {
    	let levelbuilderlayout;
    	let current;

    	levelbuilderlayout = new LevelBuilderLayout({
    			props: {
    				tab: "levels",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$levels*/ ctx[3],
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(levelbuilderlayout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(levelbuilderlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const levelbuilderlayout_changes = {};
    			if (dirty & /*input*/ 1) levelbuilderlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty & /*$levels*/ 8) levelbuilderlayout_changes.store = /*$levels*/ ctx[3];

    			if (dirty & /*$$scope, hasChanges, isAdding, input*/ 65543) {
    				levelbuilderlayout_changes.$$scope = { dirty, ctx };
    			}

    			levelbuilderlayout.$set(levelbuilderlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(levelbuilderlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(levelbuilderlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(levelbuilderlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(1:0) {#if input != null}",
    		ctx
    	});

    	return block;
    }

    // (4:3) <FieldText name="name" bind:value={input.name} autofocus>
    function create_default_slot_4$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Name");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(4:3) <FieldText name=\\\"name\\\" bind:value={input.name} autofocus>",
    		ctx
    	});

    	return block;
    }

    // (5:3) <FieldCharacterPicker name="playableCharacters" bind:value={input.playableCharacters}>
    function create_default_slot_3$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Which characters can play this level?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(5:3) <FieldCharacterPicker name=\\\"playableCharacters\\\" bind:value={input.playableCharacters}>",
    		ctx
    	});

    	return block;
    }

    // (8:3) <FieldText name="background" bind:value={input.background}>
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Background (any css background value)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(8:3) <FieldText name=\\\"background\\\" bind:value={input.background}>",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#if !isAdding}
    function create_if_block_1$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$q, 15, 5, 713);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*del*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(15:4) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (14:3) <span slot="buttons">
    function create_buttons_slot$4(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$q, 13, 3, 664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*isAdding*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_buttons_slot$4.name,
    		type: "slot",
    		source: "(14:3) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (3:2) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$5(ctx) {
    	let fieldtext0;
    	let updating_value;
    	let t0;
    	let fieldcharacterpicker;
    	let updating_value_1;
    	let t1;
    	let fieldtext1;
    	let updating_value_2;
    	let t2;
    	let levelbuilderdrawingtool;
    	let updating_thumbnail;
    	let updating_blocks;
    	let updating_enemies;
    	let t3;
    	let current;

    	function fieldtext0_value_binding(value) {
    		/*fieldtext0_value_binding*/ ctx[7].call(null, value);
    	}

    	let fieldtext0_props = {
    		name: "name",
    		autofocus: true,
    		$$slots: { default: [create_default_slot_4$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext0_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext0 = new FieldText({ props: fieldtext0_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext0, "value", fieldtext0_value_binding));

    	function fieldcharacterpicker_value_binding(value) {
    		/*fieldcharacterpicker_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldcharacterpicker_props = {
    		name: "playableCharacters",
    		$$slots: { default: [create_default_slot_3$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].playableCharacters !== void 0) {
    		fieldcharacterpicker_props.value = /*input*/ ctx[0].playableCharacters;
    	}

    	fieldcharacterpicker = new FieldCharacterPicker({
    			props: fieldcharacterpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcharacterpicker, "value", fieldcharacterpicker_value_binding));

    	function fieldtext1_value_binding(value) {
    		/*fieldtext1_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldtext1_props = {
    		name: "background",
    		$$slots: { default: [create_default_slot_2$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].background !== void 0) {
    		fieldtext1_props.value = /*input*/ ctx[0].background;
    	}

    	fieldtext1 = new FieldText({ props: fieldtext1_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext1, "value", fieldtext1_value_binding));

    	function levelbuilderdrawingtool_thumbnail_binding(value) {
    		/*levelbuilderdrawingtool_thumbnail_binding*/ ctx[10].call(null, value);
    	}

    	function levelbuilderdrawingtool_blocks_binding(value) {
    		/*levelbuilderdrawingtool_blocks_binding*/ ctx[11].call(null, value);
    	}

    	function levelbuilderdrawingtool_enemies_binding(value) {
    		/*levelbuilderdrawingtool_enemies_binding*/ ctx[12].call(null, value);
    	}

    	let levelbuilderdrawingtool_props = { background: /*input*/ ctx[0].background };

    	if (/*input*/ ctx[0].thumbnail !== void 0) {
    		levelbuilderdrawingtool_props.thumbnail = /*input*/ ctx[0].thumbnail;
    	}

    	if (/*input*/ ctx[0].blocks !== void 0) {
    		levelbuilderdrawingtool_props.blocks = /*input*/ ctx[0].blocks;
    	}

    	if (/*input*/ ctx[0].enemies !== void 0) {
    		levelbuilderdrawingtool_props.enemies = /*input*/ ctx[0].enemies;
    	}

    	levelbuilderdrawingtool = new LevelBuilderDrawingTool({
    			props: levelbuilderdrawingtool_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(levelbuilderdrawingtool, "thumbnail", levelbuilderdrawingtool_thumbnail_binding));
    	binding_callbacks.push(() => bind(levelbuilderdrawingtool, "blocks", levelbuilderdrawingtool_blocks_binding));
    	binding_callbacks.push(() => bind(levelbuilderdrawingtool, "enemies", levelbuilderdrawingtool_enemies_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext0.$$.fragment);
    			t0 = space();
    			create_component(fieldcharacterpicker.$$.fragment);
    			t1 = space();
    			create_component(fieldtext1.$$.fragment);
    			t2 = space();
    			create_component(levelbuilderdrawingtool.$$.fragment);
    			t3 = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldcharacterpicker, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldtext1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(levelbuilderdrawingtool, target, anchor);
    			insert_dev(target, t3, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				fieldtext0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext0_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext0.$set(fieldtext0_changes);
    			const fieldcharacterpicker_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				fieldcharacterpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldcharacterpicker_changes.value = /*input*/ ctx[0].playableCharacters;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldcharacterpicker.$set(fieldcharacterpicker_changes);
    			const fieldtext1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				fieldtext1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldtext1_changes.value = /*input*/ ctx[0].background;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldtext1.$set(fieldtext1_changes);
    			const levelbuilderdrawingtool_changes = {};
    			if (dirty & /*input*/ 1) levelbuilderdrawingtool_changes.background = /*input*/ ctx[0].background;

    			if (!updating_thumbnail && dirty & /*input*/ 1) {
    				updating_thumbnail = true;
    				levelbuilderdrawingtool_changes.thumbnail = /*input*/ ctx[0].thumbnail;
    				add_flush_callback(() => updating_thumbnail = false);
    			}

    			if (!updating_blocks && dirty & /*input*/ 1) {
    				updating_blocks = true;
    				levelbuilderdrawingtool_changes.blocks = /*input*/ ctx[0].blocks;
    				add_flush_callback(() => updating_blocks = false);
    			}

    			if (!updating_enemies && dirty & /*input*/ 1) {
    				updating_enemies = true;
    				levelbuilderdrawingtool_changes.enemies = /*input*/ ctx[0].enemies;
    				add_flush_callback(() => updating_enemies = false);
    			}

    			levelbuilderdrawingtool.$set(levelbuilderdrawingtool_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext0.$$.fragment, local);
    			transition_in(fieldcharacterpicker.$$.fragment, local);
    			transition_in(fieldtext1.$$.fragment, local);
    			transition_in(levelbuilderdrawingtool.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext0.$$.fragment, local);
    			transition_out(fieldcharacterpicker.$$.fragment, local);
    			transition_out(fieldtext1.$$.fragment, local);
    			transition_out(levelbuilderdrawingtool.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldcharacterpicker, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldtext1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(levelbuilderdrawingtool, detaching);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(3:2) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (2:1) <LevelBuilderLayout tab="levels" activeName={input.name} store={$levels}>
    function create_default_slot$9(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$5],
    					buttons: [create_buttons_slot$4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const form_changes = {};
    			if (dirty & /*hasChanges*/ 4) form_changes.hasChanges = /*hasChanges*/ ctx[2];

    			if (dirty & /*$$scope, isAdding, input*/ 65539) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(2:1) <LevelBuilderLayout tab=\\\"levels\\\" activeName={input.name} store={$levels}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*input*/ ctx[0] != null && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*input*/ ctx[0] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*input*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let $levels;
    	validate_store(levelStore, "levels");
    	component_subscribe($$self, levelStore, $$value => $$invalidate(3, $levels = $$value));
    	let { params = {} } = $$props;
    	let input;

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(levelStore, $levels[input.name] = JSON.parse(JSON.stringify(input)), $levels);
    		push(`/level-builder/levels/${encodeURIComponent(input.name)}`);
    	}

    	async function edit(name) {
    		if (!$levels.hasOwnProperty(name)) return;
    		$$invalidate(0, input = null);
    		await tick();
    		$$invalidate(0, input = JSON.parse(JSON.stringify($levels[name])));
    	}

    	async function create() {
    		$$invalidate(0, input = null);
    		await tick();

    		$$invalidate(0, input = {
    			name: "",
    			playableCharacters: [],
    			background: "rgb(135, 206, 235)",
    			blocks: [],
    			enemies: []
    		});
    	}

    	function del() {
    		if (confirm(`Are you sure you want to delete "${input.name}"?`)) {
    			delete $levels[input.name];
    			levelStore.set($levels);
    			push("/level-builder/levels/new");
    		}
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelBuilder", $$slots, []);

    	function fieldtext0_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldcharacterpicker_value_binding(value) {
    		input.playableCharacters = value;
    		$$invalidate(0, input);
    	}

    	function fieldtext1_value_binding(value) {
    		input.background = value;
    		$$invalidate(0, input);
    	}

    	function levelbuilderdrawingtool_thumbnail_binding(value) {
    		input.thumbnail = value;
    		$$invalidate(0, input);
    	}

    	function levelbuilderdrawingtool_blocks_binding(value) {
    		input.blocks = value;
    		$$invalidate(0, input);
    	}

    	function levelbuilderdrawingtool_enemies_binding(value) {
    		input.enemies = value;
    		$$invalidate(0, input);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		tick,
    		characters,
    		FieldCharacterPicker,
    		FieldCheckbox,
    		FieldArtPicker,
    		FieldMultiSelect,
    		FieldNumber,
    		FieldText,
    		Form,
    		LevelBuilderDrawingTool,
    		LevelBuilderLayout,
    		LevelPreview,
    		levels: levelStore,
    		validator,
    		params,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		paramName,
    		isAdding,
    		hasChanges,
    		$levels
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("paramName" in $$props) $$invalidate(13, paramName = $$props.paramName);
    		if ("isAdding" in $$props) $$invalidate(1, isAdding = $$props.isAdding);
    		if ("hasChanges" in $$props) $$invalidate(2, hasChanges = $$props.hasChanges);
    	};

    	let paramName;
    	let isAdding;
    	let hasChanges;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 64) {
    			 $$invalidate(13, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty & /*paramName*/ 8192) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty & /*paramName*/ 8192) {
    			 $$invalidate(1, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty & /*input, $levels*/ 9) {
    			 $$invalidate(2, hasChanges = input != null && !validator.equals(input, $levels[input.name]));
    		}
    	};

    	return [
    		input,
    		isAdding,
    		hasChanges,
    		$levels,
    		save,
    		del,
    		params,
    		fieldtext0_value_binding,
    		fieldcharacterpicker_value_binding,
    		fieldtext1_value_binding,
    		levelbuilderdrawingtool_thumbnail_binding,
    		levelbuilderdrawingtool_blocks_binding,
    		levelbuilderdrawingtool_enemies_binding
    	];
    }

    class LevelBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilder",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get params() {
    		throw new Error("<LevelBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<LevelBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\Index.svelte generated by Svelte v3.24.1 */

    function create_fragment$t(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0], prefix },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const prefix = "/level-builder";

    function instance$t($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;

    	const routes = {
    		"/art/:name?": ArtMaker,
    		"/blocks/:name?": BlockBuilder,
    		"/characters/:name?": CharacterBuilder,
    		"/enemies/:name?": EnemyBuilder,
    		"/levels/:name?": LevelBuilder
    	};

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(1, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		Router,
    		ArtMaker,
    		BlockBuilder,
    		CharacterBuilder,
    		EnemyBuilder,
    		LevelBuilder,
    		prefix,
    		routes,
    		tab
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(1, params = $$props.params);
    		if ("tab" in $$props) tab = $$props.tab;
    	};

    	let tab;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 2) {
    			 tab = params.tab || "art";
    		}
    	};

    	return [routes, params];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { params: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get params() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Play\Status.svelte generated by Svelte v3.24.1 */

    const file$r = "src\\pages\\Play\\Status.svelte";

    function create_fragment$u(ctx) {
    	let div;
    	let p0;
    	let t0;
    	let t1_value = /*level*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3;
    	let t4;
    	let t5;
    	let p2;
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text("Level: ");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text("Score: ");
    			t4 = text(/*score*/ ctx[1]);
    			t5 = space();
    			p2 = element("p");
    			t6 = text("Enemies left: ");
    			t7 = text(/*enemyCount*/ ctx[2]);
    			attr_dev(p0, "class", "svelte-1ivfn85");
    			add_location(p0, file$r, 1, 1, 8);
    			attr_dev(p1, "class", "svelte-1ivfn85");
    			add_location(p1, file$r, 2, 1, 37);
    			attr_dev(p2, "class", "svelte-1ivfn85");
    			add_location(p2, file$r, 3, 1, 61);
    			attr_dev(div, "class", "svelte-1ivfn85");
    			add_location(div, file$r, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(div, t2);
    			append_dev(div, p1);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(div, t5);
    			append_dev(div, p2);
    			append_dev(p2, t6);
    			append_dev(p2, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*level*/ 1 && t1_value !== (t1_value = /*level*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*score*/ 2) set_data_dev(t4, /*score*/ ctx[1]);
    			if (dirty & /*enemyCount*/ 4) set_data_dev(t7, /*enemyCount*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { level = {} } = $$props;
    	let { score = 0 } = $$props;
    	let { enemyCount = 0 } = $$props;
    	const writable_props = ["level", "score", "enemyCount"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Status> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Status", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    		if ("enemyCount" in $$props) $$invalidate(2, enemyCount = $$props.enemyCount);
    	};

    	$$self.$capture_state = () => ({ level, score, enemyCount });

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    		if ("enemyCount" in $$props) $$invalidate(2, enemyCount = $$props.enemyCount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [level, score, enemyCount];
    }

    class Status extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { level: 0, score: 1, enemyCount: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Status",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get level() {
    		throw new Error("<Status>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set level(value) {
    		throw new Error("<Status>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get score() {
    		throw new Error("<Status>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set score(value) {
    		throw new Error("<Status>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enemyCount() {
    		throw new Error("<Status>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enemyCount(value) {
    		throw new Error("<Status>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Play\Instructions.svelte generated by Svelte v3.24.1 */

    const file$s = "src\\pages\\Play\\Instructions.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (3:2) {#each keyBinds as bind}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*bind*/ ctx[1].key + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2;
    	let t3_value = /*bind*/ ctx[1].action + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text("= ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(td0, "class", "svelte-1d0wu93");
    			add_location(td0, file$s, 4, 4, 79);
    			attr_dev(td1, "class", "svelte-1d0wu93");
    			add_location(td1, file$s, 5, 4, 104);
    			add_location(tr, file$s, 3, 3, 69);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(3:2) {#each keyBinds as bind}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let div;
    	let table;
    	let each_value = /*keyBinds*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(table, "class", "svelte-1d0wu93");
    			add_location(table, file$s, 1, 1, 29);
    			attr_dev(div, "class", "instructions svelte-1d0wu93");
    			add_location(div, file$s, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*keyBinds*/ 1) {
    				each_value = /*keyBinds*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	const keyBinds = [
    		{
    			key: "Left + Right Arrow",
    			action: "Move"
    		},
    		{ key: "Space", action: "Jump" },
    		{ key: "R", action: "Spin Attack / Shield" },
    		{ key: "Q", action: "Heal" },
    		{ key: "Enter", action: "Restart" },
    		{ key: "P", action: "Pause" }
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Instructions> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Instructions", $$slots, []);
    	$$self.$capture_state = () => ({ keyBinds });
    	return [keyBinds];
    }

    class Instructions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Instructions",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src\pages\Play\Viewport.svelte generated by Svelte v3.24.1 */

    const file$t = "src\\pages\\Play\\Viewport.svelte";

    function create_fragment$w(ctx) {
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			set_style(div0, "position", "absolute");
    			set_style(div0, "left", -/*x*/ ctx[0] + "px");
    			set_style(div0, "bottom", -/*y*/ ctx[1] + "px");
    			set_style(div0, "height", /*height*/ ctx[3] + "px");
    			add_location(div0, file$t, 1, 1, 96);
    			attr_dev(div1, "class", "viewport svelte-cjx02");
    			set_style(div1, "width", /*width*/ ctx[2] + "px");
    			set_style(div1, "height", /*height*/ ctx[3] + "px");
    			set_style(div1, "background", /*background*/ ctx[4]);
    			add_location(div1, file$t, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*x*/ 1) {
    				set_style(div0, "left", -/*x*/ ctx[0] + "px");
    			}

    			if (!current || dirty & /*y*/ 2) {
    				set_style(div0, "bottom", -/*y*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*height*/ 8) {
    				set_style(div0, "height", /*height*/ ctx[3] + "px");
    			}

    			if (!current || dirty & /*width*/ 4) {
    				set_style(div1, "width", /*width*/ ctx[2] + "px");
    			}

    			if (!current || dirty & /*height*/ 8) {
    				set_style(div1, "height", /*height*/ ctx[3] + "px");
    			}

    			if (!current || dirty & /*background*/ 16) {
    				set_style(div1, "background", /*background*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { x = 0 } = $$props;
    	let { y = 0 } = $$props;
    	let { width = 0 } = $$props;
    	let { height = 0 } = $$props;
    	let { background = null } = $$props;
    	const writable_props = ["x", "y", "width", "height", "background"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Viewport> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Viewport", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("background" in $$props) $$invalidate(4, background = $$props.background);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ x, y, width, height, background });

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("background" in $$props) $$invalidate(4, background = $$props.background);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [x, y, width, height, background, $$scope, $$slots];
    }

    class Viewport extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			x: 0,
    			y: 1,
    			width: 2,
    			height: 3,
    			background: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Viewport",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get x() {
    		throw new Error("<Viewport>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Viewport>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Viewport>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Viewport>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Viewport>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Viewport>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Viewport>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Viewport>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get background() {
    		throw new Error("<Viewport>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<Viewport>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Play\GameOver.svelte generated by Svelte v3.24.1 */

    const file$u = "src\\pages\\Play\\GameOver.svelte";

    // (1:0) {#if player}
    function create_if_block$f(ctx) {
    	let div;
    	let h10;
    	let t0_value = /*player*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let h11;
    	let t3;
    	let t4;
    	let t5;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h10 = element("h1");
    			t0 = text(t0_value);
    			t1 = text(" is dead now. You really let him down.");
    			t2 = space();
    			h11 = element("h1");
    			t3 = text("Final score: ");
    			t4 = text(/*score*/ ctx[0]);
    			t5 = space();
    			p = element("p");
    			p.textContent = "Press enter or space to restart.";
    			attr_dev(h10, "class", "svelte-1ogvx1s");
    			add_location(h10, file$u, 2, 2, 42);
    			attr_dev(h11, "class", "svelte-1ogvx1s");
    			add_location(h11, file$u, 3, 2, 106);
    			attr_dev(p, "class", "svelte-1ogvx1s");
    			add_location(p, file$u, 4, 2, 139);
    			attr_dev(div, "class", "game-over svelte-1ogvx1s");
    			add_location(div, file$u, 1, 1, 15);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h10);
    			append_dev(h10, t0);
    			append_dev(h10, t1);
    			append_dev(div, t2);
    			append_dev(div, h11);
    			append_dev(h11, t3);
    			append_dev(h11, t4);
    			append_dev(div, t5);
    			append_dev(div, p);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*player*/ 2 && t0_value !== (t0_value = /*player*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*score*/ 1) set_data_dev(t4, /*score*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(1:0) {#if player}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let if_block_anchor;
    	let if_block = /*player*/ ctx[1] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*player*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$f(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { score = 0 } = $$props;
    	let { player } = $$props;
    	const writable_props = ["score", "player"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameOver> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameOver", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("score" in $$props) $$invalidate(0, score = $$props.score);
    		if ("player" in $$props) $$invalidate(1, player = $$props.player);
    	};

    	$$self.$capture_state = () => ({ score, player });

    	$$self.$inject_state = $$props => {
    		if ("score" in $$props) $$invalidate(0, score = $$props.score);
    		if ("player" in $$props) $$invalidate(1, player = $$props.player);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [score, player];
    }

    class GameOver extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { score: 0, player: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameOver",
    			options,
    			id: create_fragment$x.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*player*/ ctx[1] === undefined && !("player" in props)) {
    			console.warn("<GameOver> was created without expected prop 'player'");
    		}
    	}

    	get score() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set score(value) {
    		throw new Error("<GameOver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get player() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set player(value) {
    		throw new Error("<GameOver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // object x, y coords are always bottom left... add width or height to get other sides
    const doObjectsIntersect = (a, b) => doObjectsIntersectX(a, b) && doObjectsIntersectY(a, b);
    const doObjectsIntersectX = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x;
    const doObjectsIntersectY = (a, b) => a.y + a.height >= b.y && a.y <= b.y + b.height;
    const doObjectsIntersectYExclusive = (a, b) => a.y + a.height > b.y && a.y < b.y + b.height;
    const isAAboveB = (a, b) => a.y >= b.y + b.height && doObjectsIntersectX(a, b);

    // todo configurable per enemy
    const leashRange = 400; // in pixels

    function CreateEnemy(template, config, width, height) {
    	return {
    		...template,
    		...config,

    		width,
    		height,

    		health: template.maxHealth,
    		tvx: template.maxVelocity,
    		vx: 0,
    		vy: 0,
    		grounded: false,
    		alive: true,

    		tick(me, player) {
    			if (!me.grounded) return

    			// is player in leash range?
    			if (Math.abs(player.x - me.x) < leashRange) {
    				// move toward them

    				// x axis
    				if (player.x == me.x) me.vx = 0;
    				else if (player.x < me.x) me.vx = -me.tvx;
    				else me.vx = me.tvx;

    				// y axis
    				if (player.y > me.y + me.height) {
    					me.vy = me.jumpVelocity;
    					me.y += 1;
    				}
    			} else {
    				// stop moving
    				me.vx = 0;
    			}
    		},

    		onDeath() {
    			// nothing yet
    		},
    	}
    }

    /* src\pages\Play\Game.svelte generated by Svelte v3.24.1 */

    const { console: console_1$2, window: window_1 } = globals;
    const file$v = "src\\pages\\Play\\Game.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    // (4:1) {#if gameOver}
    function create_if_block_1$6(ctx) {
    	let gameover;
    	let current;

    	gameover = new GameOver({
    			props: {
    				score: /*score*/ ctx[4],
    				player: /*player*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(gameover.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(gameover, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const gameover_changes = {};
    			if (dirty[0] & /*score*/ 16) gameover_changes.score = /*score*/ ctx[4];
    			if (dirty[0] & /*player*/ 64) gameover_changes.player = /*player*/ ctx[6];
    			gameover.$set(gameover_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gameover.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gameover.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gameover, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(4:1) {#if gameOver}",
    		ctx
    	});

    	return block;
    }

    // (7:1) {#if level != null && player != null}
    function create_if_block$g(ctx) {
    	let viewport_1;
    	let current;
    	const viewport_1_spread_levels = [/*viewport*/ ctx[9], { background: /*level*/ ctx[0].background }];

    	let viewport_1_props = {
    		$$slots: { default: [create_default_slot$a] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < viewport_1_spread_levels.length; i += 1) {
    		viewport_1_props = assign(viewport_1_props, viewport_1_spread_levels[i]);
    	}

    	viewport_1 = new Viewport({ props: viewport_1_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(viewport_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewport_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const viewport_1_changes = (dirty[0] & /*viewport, level*/ 513)
    			? get_spread_update(viewport_1_spread_levels, [
    					dirty[0] & /*viewport*/ 512 && get_spread_object(/*viewport*/ ctx[9]),
    					dirty[0] & /*level*/ 1 && { background: /*level*/ ctx[0].background }
    				])
    			: {};

    			if (dirty[0] & /*player, enemies, blocks, levelWidth, levelHeight*/ 206 | dirty[1] & /*$$scope*/ 1) {
    				viewport_1_changes.$$scope = { dirty, ctx };
    			}

    			viewport_1.$set(viewport_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewport_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewport_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewport_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(7:1) {#if level != null && player != null}",
    		ctx
    	});

    	return block;
    }

    // (10:3) {#each enemies as enemy}
    function create_each_block$7(ctx) {
    	let livingsprite;
    	let current;
    	const livingsprite_spread_levels = [/*enemy*/ ctx[28]];
    	let livingsprite_props = {};

    	for (let i = 0; i < livingsprite_spread_levels.length; i += 1) {
    		livingsprite_props = assign(livingsprite_props, livingsprite_spread_levels[i]);
    	}

    	livingsprite = new LivingSprite({
    			props: livingsprite_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(livingsprite.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(livingsprite, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const livingsprite_changes = (dirty[0] & /*enemies*/ 128)
    			? get_spread_update(livingsprite_spread_levels, [get_spread_object(/*enemy*/ ctx[28])])
    			: {};

    			livingsprite.$set(livingsprite_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(livingsprite.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(livingsprite.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(livingsprite, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(10:3) {#each enemies as enemy}",
    		ctx
    	});

    	return block;
    }

    // (8:2) <Viewport {...viewport} background={level.background}>
    function create_default_slot$a(ctx) {
    	let level_1;
    	let t0;
    	let t1;
    	let livingsprite;
    	let current;

    	level_1 = new Level({
    			props: {
    				blocks: /*blocks*/ ctx[1],
    				width: /*levelWidth*/ ctx[2],
    				height: /*levelHeight*/ ctx[3],
    				playing: true
    			},
    			$$inline: true
    		});

    	let each_value = /*enemies*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const livingsprite_spread_levels = [/*player*/ ctx[6]];
    	let livingsprite_props = {};

    	for (let i = 0; i < livingsprite_spread_levels.length; i += 1) {
    		livingsprite_props = assign(livingsprite_props, livingsprite_spread_levels[i]);
    	}

    	livingsprite = new LivingSprite({
    			props: livingsprite_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(level_1.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(livingsprite.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(level_1, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(livingsprite, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const level_1_changes = {};
    			if (dirty[0] & /*blocks*/ 2) level_1_changes.blocks = /*blocks*/ ctx[1];
    			if (dirty[0] & /*levelWidth*/ 4) level_1_changes.width = /*levelWidth*/ ctx[2];
    			if (dirty[0] & /*levelHeight*/ 8) level_1_changes.height = /*levelHeight*/ ctx[3];
    			level_1.$set(level_1_changes);

    			if (dirty[0] & /*enemies*/ 128) {
    				each_value = /*enemies*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const livingsprite_changes = (dirty[0] & /*player*/ 64)
    			? get_spread_update(livingsprite_spread_levels, [get_spread_object(/*player*/ ctx[6])])
    			: {};

    			livingsprite.$set(livingsprite_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(level_1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(livingsprite.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(level_1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(livingsprite.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(level_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(livingsprite, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(8:2) <Viewport {...viewport} background={level.background}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let status;
    	let t2;
    	let instructions;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*gameOver*/ ctx[8] && create_if_block_1$6(ctx);
    	let if_block1 = /*level*/ ctx[0] != null && /*player*/ ctx[6] != null && create_if_block$g(ctx);

    	status = new Status({
    			props: {
    				level: /*level*/ ctx[0],
    				score: /*score*/ ctx[4],
    				enemyCount: (/*enemies*/ ctx[7] || []).filter(func$2).length
    			},
    			$$inline: true
    		});

    	instructions = new Instructions({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(status.$$.fragment);
    			t2 = space();
    			create_component(instructions.$$.fragment);
    			attr_dev(div, "class", "game-window svelte-1ihy09s");
    			add_location(div, file$v, 2, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			mount_component(status, div, null);
    			append_dev(div, t2);
    			mount_component(instructions, div, null);
    			/*div_binding*/ ctx[13](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*onKeyDown*/ ctx[10], false, false, false),
    					listen_dev(window_1, "keyup", /*onKeyUp*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*gameOver*/ ctx[8]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*gameOver*/ 256) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*level*/ ctx[0] != null && /*player*/ ctx[6] != null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*level, player*/ 65) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$g(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const status_changes = {};
    			if (dirty[0] & /*level*/ 1) status_changes.level = /*level*/ ctx[0];
    			if (dirty[0] & /*score*/ 16) status_changes.score = /*score*/ ctx[4];
    			if (dirty[0] & /*enemies*/ 128) status_changes.enemyCount = (/*enemies*/ ctx[7] || []).filter(func$2).length;
    			status.$set(status_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(status.$$.fragment, local);
    			transition_in(instructions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(status.$$.fragment, local);
    			transition_out(instructions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(status);
    			destroy_component(instructions);
    			/*div_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const artScale$2 = 2;
    const startOfLevel = 0;
    const blockSize$1 = 40;
    const func$2 = e => e.alive;

    function instance$y($$self, $$props, $$invalidate) {
    	let $blockStore;
    	let $artStore;
    	let $enemyStore;
    	validate_store(blockStore, "blockStore");
    	component_subscribe($$self, blockStore, $$value => $$invalidate(21, $blockStore = $$value));
    	validate_store(artStore, "artStore");
    	component_subscribe($$self, artStore, $$value => $$invalidate(22, $artStore = $$value));
    	validate_store(enemyStore, "enemyStore");
    	component_subscribe($$self, enemyStore, $$value => $$invalidate(23, $enemyStore = $$value));
    	let { level = null } = $$props;
    	let { character = null } = $$props;
    	let endOfLevel;
    	let blocks;
    	let damageBlocks;
    	let levelWidth = 0;
    	let levelHeight = 0;
    	let score = 0;
    	let mainEl;
    	let player;
    	let enemies;
    	let gameOver = false;
    	let paused = false;
    	let gameAlive = true;
    	let lastRequestedFrame = null;
    	let visibleBlocks;
    	let viewport = { width: window.innerWidth, height: 600 };
    	let leftDown = false;
    	let rightDown = false;

    	onMount(() => {
    		// sort blocks by x, then y
    		$$invalidate(1, blocks = level.blocks.sort((a, b) => {
    			if (a.x > b.x) return 1; else if (b.x > a.x) return -1;
    			if (a.y > b.y) return -1; else if (b.y > a.y) return 1;
    			return 0;
    		}).map(b => ({
    			...b,
    			solid: $blockStore[b.name].solid,
    			png: $artStore[$blockStore[b.name].graphic].png,
    			dps: $blockStore[b.name].dps,
    			throwOnTouch: $blockStore[b.name].throwOnTouch
    		})));

    		endOfLevel = Math.max(...blocks.map(b => b.x + b.width));
    		damageBlocks = blocks.filter(b => b.dps > 0);
    		$$invalidate(2, levelWidth = Math.max(...blocks.map(b => b.x + b.width)));
    		$$invalidate(3, levelHeight = 600); //Math.max(...blocks.map(b => b.y + b.height))
    		start();
    	});

    	onDestroy(() => {
    		gameAlive = false;
    		window.cancelAnimationFrame(lastRequestedFrame);
    	});

    	function start() {
    		$$invalidate(4, score = 0);

    		$$invalidate(6, player = {
    			...character,
    			health: character.maxHealth,
    			tvx: character.maxVelocity,
    			width: $artStore[character.graphicStill].width * artScale$2, // width of graphic
    			height: $artStore[character.graphicStill].height * artScale$2, // height of graphic
    			// runtime stuff
    			x: blocks[0].x,
    			y: blocks[0].y + blocks[0].height + 100,
    			vx: 0,
    			vy: 0,
    			// todo: replace "spinning" with abilities
    			spinning: false,
    			tick() {
    				// x axis controls
    				if (player.grounded) {
    					if (leftDown && !rightDown) $$invalidate(6, player.vx -= player.tvx / 5, player); else if (rightDown && !leftDown) $$invalidate(6, player.vx += player.tvx / 5, player); else $$invalidate(6, player.vx = 0, player);
    				} else {
    					// let them control direction a little in the air, but not as much
    					if (leftDown && !rightDown) $$invalidate(6, player.vx -= player.tvx / 10, player); else if (rightDown && !leftDown) $$invalidate(6, player.vx += player.tvx / 10, player);
    				}

    				// don't let them break top speed though
    				if (Math.abs(player.vx) > player.tvx) $$invalidate(6, player.vx = player.tvx * (player.vx < 0 ? -1 : 1), player);
    			}
    		});

    		$$invalidate(7, enemies = level.enemies.map(e => {
    			const template = $enemyStore[e.name];
    			const w = $artStore[template.graphicStill].width * artScale$2; // width of graphic
    			const h = $artStore[template.graphicStill].height * artScale$2; // height of graphic
    			return CreateEnemy(template, e, w, h);
    		}));

    		$$invalidate(8, gameOver = false);
    		paused = false;

    		// only start game loop if it's not already going
    		if (lastRequestedFrame == null) gameLoop();
    	}

    	function gameLoop() {
    		if (!gameOver && !paused) {
    			// visibleBlocks = blocks.filter(b => doObjectsIntersect(viewport, b))
    			$$invalidate(6, player = applyWorldToSprite(player, true));

    			// handle movement / attack abilities
    			player.tick();

    			const halfViewportWidth = viewport.width / 2;
    			const halfViewportHeight = viewport.height / 2;

    			$$invalidate(
    				9,
    				viewport.x = // player is at beginning of level
    				player.x < halfViewportWidth
    				? // viewport all the way to the left
    					0
    				: // player is at end of level
    					player.x > endOfLevel - halfViewportWidth && endOfLevel > viewport.width
    					? // viewport all the way to the right
    						endOfLevel - viewport.width
    					: // player is in middle of level, viewport centered on player
    						player.x - halfViewportWidth,
    				viewport
    			);

    			$$invalidate(
    				9,
    				viewport.y = // player is near bottom of screen
    				player.y < halfViewportHeight
    				? // viewport all the way to bottom
    					0
    				: // player above half viewport height, center on player
    					player.y - halfViewportHeight,
    				viewport
    			);

    			// for every live enemy intersecting the player, one or the other should take damage
    			for (let i = 0; i < enemies.length; i++) {
    				if (enemies[i].alive) {
    					$$invalidate(7, enemies[i] = applyWorldToSprite(enemies[i]), enemies);
    					enemies[i].tick(enemies[i], player);

    					if (doObjectsIntersect(player, enemies[i])) {
    						if (player.spinning) {
    							$$invalidate(7, enemies[i].gettingHit = true, enemies);
    							$$invalidate(7, enemies[i].health -= player.dps / 60, enemies); // damage per frame
    						} else {
    							$$invalidate(6, player.health -= enemies[i].dps / 60, player); // damage per frame
    						}
    					}

    					if (enemies[i].health <= 0) {
    						$$invalidate(7, enemies[i].alive = false, enemies);
    						enemies[i].onDeath();
    						$$invalidate(4, score += enemies[i].score);
    					}
    				}
    			}

    			// game is over if player dies
    			if (player.health <= 0) $$invalidate(8, gameOver = true);
    		}

    		if (gameAlive) lastRequestedFrame = window.requestAnimationFrame(gameLoop);
    	}

    	function applyWorldToSprite(sprite, isPlayerControlled = false) {
    		const surfacesBelowSprite = blocks.filter(b => b.solid && isAAboveB(sprite, b)).map(b => b.y + b.height);

    		const surfaceY = surfacesBelowSprite.length > 0
    		? Math.max(...surfacesBelowSprite)
    		: -500; // some number off screen

    		sprite.y += sprite.vy;
    		sprite.grounded = sprite.y <= surfaceY;

    		// gravity affects all sprites
    		if (sprite.grounded) {
    			// we're grounded - take damage if we were previously falling
    			if (sprite.vy < 0) {
    				sprite.health += sprite.vy / 10 * sprite.fallDamageMultiplier;
    				sprite.vy = 0;
    			}

    			// make sure we're exactly on the ground
    			sprite.y = surfaceY;
    		} else if (sprite.y < -200) {
    			// we fell under the map, die
    			sprite.health = 0;
    		} else {
    			// we're in the air, accelerate downward
    			sprite.vy -= 1;
    		}

    		// x velocity
    		if (sprite.vx != 0) {
    			if (sprite.vx > 0) {
    				// moving right
    				let targetX = sprite.x + sprite.vx;

    				// any block that would prevent us from reaching our target?
    				const blockToRight = blocks.find(b => {
    					// sprite x + width <= box x
    					// target x + width > box x
    					const txw = targetX + sprite.width;

    					const sxw = sprite.x + sprite.width;
    					return b.solid && txw > b.x && sxw <= b.x && doObjectsIntersectYExclusive(b, sprite);
    				});

    				if (blockToRight != null) targetX = blockToRight.x - sprite.width; else // don't let them go past end of level
    				if (targetX > endOfLevel - sprite.width) targetX = endOfLevel - sprite.width;

    				sprite.x = targetX;
    			} else if (sprite.vx < 0) {
    				// moving left
    				let targetX = sprite.x + sprite.vx;

    				// any block that would prevent us from reaching target?
    				const blockToLeft = blocks.find(b => {
    					// sprite x >= box x + width
    					// target x < box x + width
    					const bxw = b.x + b.width;

    					return b.solid && sprite.x >= bxw && targetX < bxw && doObjectsIntersectYExclusive(b, sprite);
    				});

    				if (blockToLeft != null) targetX = blockToLeft.x + blockToLeft.width; else // don't let them go past start of level
    				if (targetX < 0) targetX = 0;

    				sprite.x = targetX < startOfLevel ? startOfLevel : targetX;
    			}
    		}

    		// blocks that do damage
    		for (let i = 0; i < damageBlocks.length; i++) {
    			if (doObjectsIntersect(sprite, damageBlocks[i])) {
    				sprite.health -= damageBlocks[i].dps / 60; // damage per frame

    				// does the block also throw?
    				if (damageBlocks[i].throwOnTouch) {
    					sprite.vy = 20;
    				}
    			}
    		}

    		return sprite;
    	}

    	function onKeyDown(e) {
    		if (gameOver) return;

    		switch (e.code) {
    			case "ArrowLeft":
    				leftDown = true;
    				break;
    			case "ArrowRight":
    				rightDown = true;
    				break;
    			case "Space":
    				if (player.grounded || player.canFly) $$invalidate(6, player.vy = player.jumpVelocity, player);
    				break;
    			case "KeyR":
    				$$invalidate(6, player.spinning = true, player);
    				break;
    			case "KeyQ":
    				$$invalidate(6, player.health = player.maxHealth, player);
    				break;
    		}
    	}

    	function onKeyUp(e) {
    		switch (e.code) {
    			case "ArrowLeft":
    				leftDown = false;
    				break;
    			case "ArrowRight":
    				rightDown = false;
    				break;
    			case "Space":
    				if (gameOver) start();
    				if (paused) paused = false;
    				break;
    			case "KeyR":
    				$$invalidate(6, player.spinning = false, player);
    				break;
    			case "Enter":
    			case "NumpadEnter":
    				start();
    				break;
    			case "KeyP":
    				paused = !paused;
    				break;
    			default:
    				console.log(e.code);
    		}
    	}

    	const writable_props = ["level", "character"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Game", $$slots, []);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			mainEl = $$value;
    			$$invalidate(5, mainEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("character" in $$props) $$invalidate(12, character = $$props.character);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		Status,
    		Level,
    		Instructions,
    		Viewport,
    		LivingSprite,
    		HealthBar,
    		GameOver,
    		doObjectsIntersect,
    		isAAboveB,
    		doObjectsIntersectY,
    		doObjectsIntersectYExclusive,
    		CreateEnemy,
    		artStore,
    		blockStore,
    		enemyStore,
    		level,
    		character,
    		artScale: artScale$2,
    		startOfLevel,
    		endOfLevel,
    		blockSize: blockSize$1,
    		blocks,
    		damageBlocks,
    		levelWidth,
    		levelHeight,
    		score,
    		mainEl,
    		player,
    		enemies,
    		gameOver,
    		paused,
    		gameAlive,
    		lastRequestedFrame,
    		visibleBlocks,
    		viewport,
    		leftDown,
    		rightDown,
    		start,
    		gameLoop,
    		applyWorldToSprite,
    		onKeyDown,
    		onKeyUp,
    		$blockStore,
    		$artStore,
    		$enemyStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("character" in $$props) $$invalidate(12, character = $$props.character);
    		if ("endOfLevel" in $$props) endOfLevel = $$props.endOfLevel;
    		if ("blocks" in $$props) $$invalidate(1, blocks = $$props.blocks);
    		if ("damageBlocks" in $$props) damageBlocks = $$props.damageBlocks;
    		if ("levelWidth" in $$props) $$invalidate(2, levelWidth = $$props.levelWidth);
    		if ("levelHeight" in $$props) $$invalidate(3, levelHeight = $$props.levelHeight);
    		if ("score" in $$props) $$invalidate(4, score = $$props.score);
    		if ("mainEl" in $$props) $$invalidate(5, mainEl = $$props.mainEl);
    		if ("player" in $$props) $$invalidate(6, player = $$props.player);
    		if ("enemies" in $$props) $$invalidate(7, enemies = $$props.enemies);
    		if ("gameOver" in $$props) $$invalidate(8, gameOver = $$props.gameOver);
    		if ("paused" in $$props) paused = $$props.paused;
    		if ("gameAlive" in $$props) gameAlive = $$props.gameAlive;
    		if ("lastRequestedFrame" in $$props) lastRequestedFrame = $$props.lastRequestedFrame;
    		if ("visibleBlocks" in $$props) visibleBlocks = $$props.visibleBlocks;
    		if ("viewport" in $$props) $$invalidate(9, viewport = $$props.viewport);
    		if ("leftDown" in $$props) leftDown = $$props.leftDown;
    		if ("rightDown" in $$props) rightDown = $$props.rightDown;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		level,
    		blocks,
    		levelWidth,
    		levelHeight,
    		score,
    		mainEl,
    		player,
    		enemies,
    		gameOver,
    		viewport,
    		onKeyDown,
    		onKeyUp,
    		character,
    		div_binding
    	];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { level: 0, character: 12 }, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get level() {
    		throw new Error("<Game>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set level(value) {
    		throw new Error("<Game>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get character() {
    		throw new Error("<Game>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set character(value) {
    		throw new Error("<Game>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Play\Index.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$6 } = globals;
    const file$w = "src\\pages\\Play\\Index.svelte";

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (9:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let current;
    	let each_value = /*sortedLevelNames*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "list-group");
    			add_location(div, file$w, 9, 1, 523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$levels, sortedLevelNames, selectLevel, $characters*/ 39) {
    				each_value = /*sortedLevelNames*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(9:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if levelName != null}
    function create_if_block$h(ctx) {
    	let div;
    	let button;
    	let t1;
    	let a0;
    	let t2;
    	let t3;
    	let a0_href_value;
    	let t4;
    	let a1;
    	let t5;
    	let t6;
    	let a1_href_value;
    	let t7;
    	let game;
    	let current;
    	let mounted;
    	let dispose;

    	game = new Game({
    			props: {
    				level: /*$levels*/ ctx[1][/*levelName*/ ctx[3]],
    				character: /*$characters*/ ctx[2][/*characterName*/ ctx[4]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "< Change level";
    			t1 = space();
    			a0 = element("a");
    			t2 = text("Edit ");
    			t3 = text(/*levelName*/ ctx[3]);
    			t4 = space();
    			a1 = element("a");
    			t5 = text("Edit ");
    			t6 = text(/*characterName*/ ctx[4]);
    			t7 = space();
    			create_component(game.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-info");
    			add_location(button, file$w, 2, 2, 48);
    			attr_dev(a0, "href", a0_href_value = "#/level-builder/levels/" + encodeURIComponent(/*levelName*/ ctx[3]));
    			attr_dev(a0, "class", "btn btn-secondary");
    			attr_dev(a0, "role", "button");
    			add_location(a0, file$w, 3, 2, 157);
    			attr_dev(a1, "href", a1_href_value = "#/level-builder/characters/" + encodeURIComponent(/*characterName*/ ctx[4]));
    			attr_dev(a1, "class", "btn btn-secondary");
    			attr_dev(a1, "role", "button");
    			add_location(a1, file$w, 4, 2, 286);
    			attr_dev(div, "class", "mb-2");
    			add_location(div, file$w, 1, 1, 26);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, a0);
    			append_dev(a0, t2);
    			append_dev(a0, t3);
    			append_dev(div, t4);
    			append_dev(div, a1);
    			append_dev(a1, t5);
    			append_dev(a1, t6);
    			insert_dev(target, t7, anchor);
    			mount_component(game, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*levelName*/ 8) set_data_dev(t3, /*levelName*/ ctx[3]);

    			if (!current || dirty & /*levelName*/ 8 && a0_href_value !== (a0_href_value = "#/level-builder/levels/" + encodeURIComponent(/*levelName*/ ctx[3]))) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (!current || dirty & /*characterName*/ 16) set_data_dev(t6, /*characterName*/ ctx[4]);

    			if (!current || dirty & /*characterName*/ 16 && a1_href_value !== (a1_href_value = "#/level-builder/characters/" + encodeURIComponent(/*characterName*/ ctx[4]))) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			const game_changes = {};
    			if (dirty & /*$levels, levelName*/ 10) game_changes.level = /*$levels*/ ctx[1][/*levelName*/ ctx[3]];
    			if (dirty & /*$characters, characterName*/ 20) game_changes.character = /*$characters*/ ctx[2][/*characterName*/ ctx[4]];
    			game.$set(game_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t7);
    			destroy_component(game, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(1:0) {#if levelName != null}",
    		ctx
    	});

    	return block;
    }

    // (16:5) {#each $levels[levelName].playableCharacters as characterName}
    function create_each_block_1$4(ctx) {
    	let button;
    	let art;
    	let t0;
    	let t1_value = /*characterName*/ ctx[4] + "";
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	art = new Art({
    			props: {
    				name: /*$characters*/ ctx[2][/*characterName*/ ctx[4]].graphicStill
    			},
    			$$inline: true
    		});

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[7](/*levelName*/ ctx[3], /*characterName*/ ctx[4], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(art.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(button, "class", "btn btn-secondary mr-1");
    			add_location(button, file$w, 16, 6, 886);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(art, button, null);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const art_changes = {};
    			if (dirty & /*$characters, $levels, sortedLevelNames*/ 7) art_changes.name = /*$characters*/ ctx[2][/*characterName*/ ctx[4]].graphicStill;
    			art.$set(art_changes);
    			if ((!current || dirty & /*$levels, sortedLevelNames*/ 3) && t1_value !== (t1_value = /*characterName*/ ctx[4] + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(art.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(art.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(art);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(16:5) {#each $levels[levelName].playableCharacters as characterName}",
    		ctx
    	});

    	return block;
    }

    // (11:2) {#each sortedLevelNames as levelName}
    function create_each_block$8(ctx) {
    	let div1;
    	let h4;
    	let t0_value = /*levelName*/ ctx[3] + "";
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div0;
    	let t3;
    	let current;
    	let each_value_1 = /*$levels*/ ctx[1][/*levelName*/ ctx[3]].playableCharacters;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			attr_dev(h4, "class", "mb-0");
    			add_location(h4, file$w, 12, 4, 628);
    			if (img.src !== (img_src_value = /*$levels*/ ctx[1][/*levelName*/ ctx[3]].thumbnail)) attr_dev(img, "src", img_src_value);
    			set_style(img, "background", /*$levels*/ ctx[1][/*levelName*/ ctx[3]].background);
    			attr_dev(img, "alt", "level preview");
    			add_location(img, file$w, 13, 4, 667);
    			attr_dev(div0, "class", "flex-row");
    			add_location(div0, file$w, 14, 4, 787);
    			attr_dev(div1, "class", "list-group-item");
    			add_location(div1, file$w, 11, 3, 593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h4);
    			append_dev(h4, t0);
    			append_dev(div1, t1);
    			append_dev(div1, img);
    			append_dev(div1, t2);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*sortedLevelNames*/ 1) && t0_value !== (t0_value = /*levelName*/ ctx[3] + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*$levels, sortedLevelNames*/ 3 && img.src !== (img_src_value = /*$levels*/ ctx[1][/*levelName*/ ctx[3]].thumbnail)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*$levels, sortedLevelNames*/ 3) {
    				set_style(img, "background", /*$levels*/ ctx[1][/*levelName*/ ctx[3]].background);
    			}

    			if (dirty & /*selectLevel, sortedLevelNames, $levels, $characters*/ 39) {
    				each_value_1 = /*$levels*/ ctx[1][/*levelName*/ ctx[3]].playableCharacters;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(11:2) {#each sortedLevelNames as levelName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$h, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*levelName*/ ctx[3] != null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let $levels;
    	let $characters;
    	validate_store(levelStore, "levels");
    	component_subscribe($$self, levelStore, $$value => $$invalidate(1, $levels = $$value));
    	validate_store(characters, "characters");
    	component_subscribe($$self, characters, $$value => $$invalidate(2, $characters = $$value));
    	let levelName;
    	let characterName;

    	function selectLevel(l, c) {
    		$$invalidate(3, levelName = l);
    		$$invalidate(4, characterName = c);
    	}

    	const writable_props = [];

    	Object_1$6.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);
    	const click_handler = () => $$invalidate(3, levelName = null);
    	const click_handler_1 = (levelName, characterName) => selectLevel(levelName, characterName);

    	$$self.$capture_state = () => ({
    		Art,
    		Game,
    		levels: levelStore,
    		characters,
    		LevelPreview,
    		levelName,
    		characterName,
    		selectLevel,
    		sortedLevelNames,
    		$levels,
    		$characters
    	});

    	$$self.$inject_state = $$props => {
    		if ("levelName" in $$props) $$invalidate(3, levelName = $$props.levelName);
    		if ("characterName" in $$props) $$invalidate(4, characterName = $$props.characterName);
    		if ("sortedLevelNames" in $$props) $$invalidate(0, sortedLevelNames = $$props.sortedLevelNames);
    	};

    	let sortedLevelNames;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$levels*/ 2) {
    			 $$invalidate(0, sortedLevelNames = Object.keys($levels).sort());
    		}
    	};

    	return [
    		sortedLevelNames,
    		$levels,
    		$characters,
    		levelName,
    		characterName,
    		selectLevel,
    		click_handler,
    		click_handler_1
    	];
    }

    class Index$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* src\pages\NotFound.svelte generated by Svelte v3.24.1 */

    const file$x = "src\\pages\\NotFound.svelte";

    function create_fragment$A(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Page not found";
    			add_location(h1, file$x, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", $$slots, []);
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$7 } = globals;
    const file$y = "src\\App.svelte";

    // (5:1) {#if canPlay}
    function create_if_block$i(ctx) {
    	let li;
    	let a;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			a.textContent = "Play!";
    			attr_dev(a, "class", "nav-link");
    			attr_dev(a, "href", "#/play");
    			add_location(a, file$y, 6, 3, 166);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$y, 5, 2, 140);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(5:1) {#if canPlay}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let ul;
    	let li;
    	let a;
    	let t1;
    	let t2;
    	let main;
    	let router;
    	let current;
    	let if_block = /*canPlay*/ ctx[0] && create_if_block$i(ctx);

    	router = new Router({
    			props: { routes: /*routes*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li = element("li");
    			a = element("a");
    			a.textContent = "Level Builder";
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(a, "class", "nav-link");
    			attr_dev(a, "href", "#/level-builder/art/new");
    			add_location(a, file$y, 2, 2, 44);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$y, 1, 1, 19);
    			attr_dev(ul, "class", "nav");
    			add_location(ul, file$y, 0, 0, 0);
    			add_location(main, file$y, 11, 0, 237);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li);
    			append_dev(li, a);
    			append_dev(ul, t1);
    			if (if_block) if_block.m(ul, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*canPlay*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let $levelStore;
    	validate_store(levelStore, "levelStore");
    	component_subscribe($$self, levelStore, $$value => $$invalidate(2, $levelStore = $$value));

    	const routes = {
    		"/level-builder/:tab?/:name?": Index,
    		"/play": Index$1,
    		"*": Index
    	};

    	const writable_props = [];

    	Object_1$7.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		LevelBuilder: Index,
    		Play: Index$1,
    		NotFound,
    		levelStore,
    		routes,
    		canPlay,
    		$levelStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("canPlay" in $$props) $$invalidate(0, canPlay = $$props.canPlay);
    	};

    	let canPlay;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$levelStore*/ 4) {
    			 $$invalidate(0, canPlay = Object.keys($levelStore).length > 0);
    		}
    	};

    	return [canPlay, routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
