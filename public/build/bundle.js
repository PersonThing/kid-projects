
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
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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

    // List of nodes to update
    const nodes = [];

    // Current location
    let location$1;

    // Function that updates all nodes marking the active ones
    function checkActive(el) {
        // Repeat this for each class
        (el.className || '').split(' ').forEach((cls) => {
            if (!cls) {
                return
            }
            // Remove the active class firsts
            el.node.classList.remove(cls);

            // If the pattern matches, then set the active class
            if (el.pattern.test(location$1)) {
                el.node.classList.add(cls);
            }
        });
    }

    // Listen to changes in the location
    loc.subscribe((value) => {
        // Update the location
        location$1 = value.location + (value.querystring ? '?' + value.querystring : '');

        // Update all nodes
        nodes.map(checkActive);
    });

    /**
     * @typedef {Object} ActiveOptions
     * @property {string|RegExp} [path] - Path expression that makes the link active when matched (must start with '/' or '*'); default is the link's href
     * @property {string} [className] - CSS class to apply to the element when active; default value is "active"
     */

    /**
     * Svelte Action for automatically adding the "active" class to elements (links, or any other DOM element) when the current location matches a certain path.
     * 
     * @param {HTMLElement} node - The target node (automatically set by Svelte)
     * @param {ActiveOptions|string|RegExp} [opts] - Can be an object of type ActiveOptions, or a string (or regular expressions) representing ActiveOptions.path.
     */
    function active(node, opts) {
        // Check options
        if (opts && (typeof opts == 'string' || (typeof opts == 'object' && opts instanceof RegExp))) {
            // Interpret strings and regular expressions as opts.path
            opts = {
                path: opts
            };
        }
        else {
            // Ensure opts is a dictionary
            opts = opts || {};
        }

        // Path defaults to link target
        if (!opts.path && node.hasAttribute('href')) {
            opts.path = node.getAttribute('href');
            if (opts.path && opts.path.length > 1 && opts.path.charAt(0) == '#') {
                opts.path = opts.path.substring(1);
            }
        }

        // Default class name
        if (!opts.className) {
            opts.className = 'active';
        }

        // If path is a string, it must start with '/' or '*'
        if (!opts.path || 
            typeof opts.path == 'string' && (opts.path.length < 1 || (opts.path.charAt(0) != '/' && opts.path.charAt(0) != '*'))
        ) {
            throw Error('Invalid value for "path" argument')
        }

        // If path is not a regular expression already, make it
        const {pattern} = typeof opts.path == 'string' ?
            regexparam(opts.path) :
            {pattern: opts.path};

        // Add the node to the list
        const el = {
            node,
            className: opts.className,
            pattern
        };
        nodes.push(el);

        // Trigger the action right away
        checkActive(el);

        return {
            // When the element is destroyed, remove it from the list
            destroy() {
                nodes.splice(nodes.indexOf(el), 1);
            }
        }
    }

    // import LocalStorageStore from 'LocalStorageStore'

    function LocalStorageStore(key, defaultValue) {
    	const valueFromStorage = localStorage.getItem(key);
    	const initialValue =
    		valueFromStorage != null && valueFromStorage != 'null' && valueFromStorage != 'undefined' ? JSON.parse(valueFromStorage) : defaultValue;
    	const { subscribe, set } = writable(initialValue);
    	return {
    		subscribe,
    		set: function (value) {
    			set(value);
    			localStorage.setItem(key, JSON.stringify(value));
    		},
    	}
    }

    var sampleProjects = [
    	{
    		name: "Mr Squiggles",
    		art: {
    			spike: {
    				name: "spike",
    				width: 40,
    				height: 40,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAA4klEQVRYR+2WMRKDMAwE4TcpKP0cCp5Gkee4pOA3ZKKJCnlIButMRiRHbWtOq9Phvgv+9cH1dRSITogESRAlgN6nB0kQJYDepwd/keD2akqmG3HEsEAtoNNr1eRuXU9xCkQ9SIIkWBnOYpn5Psu1aZxMOkTY4mYCpVDO2QBKKXnz0Cyb1l3WxZCsIfifAsuJhCPYQuDuaNV4qAdL72ld3eYjHryWQPXIcBukWQdBEyvvMtNNMJJAk1Oa9NpxBILXEFiSAwge8l7NFn8s6BgxBZpE+CbB8glf+Zw79/jzTxJa4AMeMqIZTWbVDQAAAABJRU5ErkJggg==",
    				animated: false,
    				frameWidth: 50,
    				frameRate: 10,
    				yoyo: false,
    				gridSize: 20,
    				showGrid: true,
    				selectedColor: null
    			},
    			"mr smiley": {
    				name: "mr smiley",
    				width: 162,
    				height: 90,
    				png: "data:image/png;base64,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",
    				animated: true,
    				frameWidth: 54,
    				frameRate: 6,
    				yoyo: false,
    				gridSize: 20,
    				showGrid: true,
    				selectedColor: "black"
    			},
    			lava: {
    				name: "lava",
    				width: 160,
    				height: 40,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAoCAYAAAB5LPGYAAAEVklEQVR4Xu1csVbbQBCUCtLwC3RJn5Z8A00a0sBP5J+giZs0fENo0ycdv5AGF86LtLN+mmNZyZbPRhmqYEl3q7nZudk9k7ZZ2M/mvtn8e6X2pmkX9mpVXqc2fotbpNoAVmFFxUlq4ycCBouLhWhuXl/9tlmW0s5FwAn4VUyvClMdAcBFJfER8BuyYrYAGvNiiUJMnS+73zPPXou9IF/H2+O+jcXd3A9xwfVvdv1L8F5ZfGNzEHFkCjt1vuz+2vgV2ZsFKAD7xBIBX07QqQnsBIyIF35+d9EtxPrDxy6Ss98Pg4hcUawqXZmXihYuI3akXBg3ev6alKxQPIsvm5+fYyUUfuMQ5J1EBBQBX2XOoRN45y0YCoAAWfGyPlzmpRiVqKpa2Y0MFCvjNQ8IZaQqF54rUlwMEyn6WAsj/HokRUARsCPCsRK43ZiXa9qnnpF7niA8P1513vDs189+vNunF9sUYxUwig9mN1JA9O8yhYQn5aozMtOsgNd3F5bKws8UrVvvsfiJgLYLiIDkUWxnOHQCl1uw9bnWj1ddRO8uH06i0Zp6QOBHVS+8GjwgA1r0CdEHtPEiTxh6QOHX7YDeNUCCU7EH/ERAshy+dYiAHQKHTuCiDePMtYXJqjr2aOv3vXKeXVpf0DwSe0GvAslDwbu58gQnE3xGC2VjT4cTDQD52ZQdfUuulvF8GB8Asi0qUsixXQHhZ4BGRzAi4LDI8L1FBBwoJHCZnMCegbd9FVcoiVXJUDBsUfCImNgVj7xsQwroW5x9vrJ5vU9nHs4VBFW63cdntM2mJwjGwfRQuiK+oP+H98b9qG553KLvSfEJvx7Bsfhtq2ARcJA6YwFUAvew7ZrAWwIa/EXGw6NBgbBM+By/83W+L7juVSmbfng/mscVk8940VAOzn7D7/UF78eA8hbDSo7rwu9lQkb4iYAiYM+NIyVwy20Hz2T7B5+hssfB/eE3YCMFjRTSFIzLf7aWrJwcN3/rRvENETwV/ERAJciAmbUFpihCPJqgSk09W+L9CrPK0sa/Jx6Uq2jFRwCeOH4iIBVHShBro0RF4cwC41tw4QlIATGve8KgOvX7sut2I/qJ3+3kpDizRXXOnlTxdYi8dfxEQBCclBCJ8NYXOEpoHBAUbSNWuAifmQSm5TPPqI8Veq3MKwb9wqjPFlnCsDE8cv4sfp+XGvKZRWXFF37DE7UMPxFQCdJxJEvQ7PquCewEzJg6VplYqSLlipQju39qnFk82XzZ81Pj4fuz8ZcenwgYFDNKEKuG2eIkv09NsL0JGE3IkhyZ3sxD7aswim9eBP1vYDAsireJiYzHRcA9AZx3ebdfY/pfEnh2As69IBpv2QiIgMte35N/Oyfgj/PdYv305/XnonGz53hUxTdEZCn4iYBB4i1lgUHbU03g9ut5/9+N6UcIHAMBEfAYqGtOR2AyAbE17Srph8Ze8e2HcG38RMD91mvy07UXeGqAteP7C6ZUEuW86gszAAAAAElFTkSuQmCC",
    				animated: true,
    				frameWidth: 40,
    				frameRate: 5,
    				yoyo: false,
    				gridSize: 20,
    				showGrid: true
    			},
    			dirt: {
    				name: "dirt",
    				width: 40,
    				height: 40,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAByklEQVRYR9VYMU7EQBBLaopD/ADRpovSXkfFK/IEXsQrqO4JER0t4gcIXgBiJa8UJ5YnOXQaromS2914vZ7xZNq+77+bpmmOVy+/l/o7fXSz+2EYZve4maZp9TnGq/9XJ608bNMDHMexMHj99lTwf96Ns304BhxT9zevIbL4vZjUpgfYdV1hMOuvTQ8QR+y0Bi1BK268OhGnWZ5XNehemA6g2ykAc77k52odNR8MYp5kMA3AvUGCDSB/snaYWaVJJZ3K4L8ByF4b9VgnBdaU83BmtObB9ACxMxeFrD3W2sPhvSz1/HVbrlGG1fsXTpIO4OOxKV4cjbqoZ29ljtcFUW16gFxuOSaVBlkazmmYMeXxi3owHUBO1Hu147zVVdaKmEUUpwfI2nDVCMZDQ/BmMOKYdR5tK+o0ABlI1PqiedGNU9/dCy9GkZAG4LmJWu1863c2r4P5ZzvJxQCqipjzl0vk0SzgNFk7CzjitADhJI4plW62dr0cc/yeGsVpAW6NYlelsIOorlX0m2dzFF8cINeD0TrNeSiY3Ft81ChODxBRzDt1R4kdqt4MV8iuqlHWKr04HcC/6udFOwmqt8N15e56MJpwVasjCvAH2NYWTQ4Y8xEAAAAASUVORK5CYII=",
    				animated: false,
    				frameWidth: 50,
    				frameRate: 10,
    				yoyo: false,
    				gridSize: 25,
    				showGrid: true
    			},
    			grass: {
    				name: "grass",
    				width: 40,
    				height: 40,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABjElEQVRYR91Y2xHCMAxL/hmBSdiDATICkzACA7AHkzAAH/zDtcTtnVph53Fg6E/vaseRZCVpG8MlPMJw7UIc73gdcnyfA5gncRnH8iTO8s8w8fGFJ/4OwFX5Vh4iU1SO1Skdl/NnBd0CRI8hUMacERIPStyqHMmLwT1AWcWlSjHvaXVEYS0v1589aByw6Ky1pUjION/cYusiqZyotLzk/wHAa+ayrdWgbZyuoFuAvYFJPRQUOwPzcgXdAmTAUAHNkxpBjJP6SwXdAtQUssY1ZcWDzJMSz3VmBa0AoMDkea2luDiaAbLtSxTSPMSIMKCkLlfQDcB9/uawbvhs37ISss4zvc38HUBNAfQSOzm0RVKt4M8BJPteuqWRyul+0ii9jcdQ6kHtsM/xbgBTSuOfhVKmafNeIS3OZMNx0T3A5hZrR1+TA4d/M60e9Aaw1ltWIRceLFXQPUCrErV5zQrWTmwd9zWAtdbot4oVidwDtLZY8oTQxxSsBmg96liLej9HIuazuDcQfDmR+gjwCRzB4dFmpz23AAAAAElFTkSuQmCC",
    				animated: false,
    				frameWidth: 25,
    				frameRate: 10,
    				yoyo: false,
    				gridSize: 20,
    				showGrid: true,
    				frameSize: null
    			},
    			alien: {
    				name: "alien",
    				width: 22,
    				height: 18,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAAlElEQVQ4T2NkQAcNDP/BQg0MjBhy2ARwqMfUTDODYa4iZAEBedzepbnBhAIaR1wQdjHVDIYFASEDMVMTiiNxpwqKDbaEpluYQe4Qxo+ADWCaY0MAVisw5HeiKmNkoLnBUJfC7CXZxTCNUJcjXEx1g9FzGqmRhiN1IFIFucmMoMGklnKDp6xADxJc5TIBdYRzHpkGAwA8pEzzc5ZmAwAAAABJRU5ErkJggg==",
    				animated: false,
    				frameWidth: 50,
    				frameRate: 10,
    				yoyo: false,
    				gridSize: 15,
    				showGrid: true
    			},
    			bouncer: {
    				name: "bouncer",
    				width: 40,
    				height: 40,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAuElEQVRYR+2XQQ6AIAwE4ScefY5P9Tke/YnGxHKoaRpcAiVZ71uWYVswp+BfDu4v0SB6QiRIgigBVM8MkiBKANUzgySIEkD1ed3O6yly7EuoPIqveQzqo+hNVIhpH4XgdAbRcLfSmwRbLYDWKZ1rZQBd4K9eemAeg7LT0ST19PgM5/AGR5G05q55vfUmWW3QIoneMHrjXj33gVBb0BsrtfVoUBMlQS/UzCCaGRIkwfcvUkB4TRd+UN/Q4pYzID9HzwAAAABJRU5ErkJggg==",
    				animated: false,
    				frameWidth: 50,
    				frameRate: 10,
    				yoyo: false
    			},
    			"mr squiggles spin": {
    				name: "mr squiggles spin",
    				width: 50,
    				height: 60,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA8CAYAAAAkNenBAAACPElEQVRoQ+2YL1bEMBDGU7ucAtQ60JyCI9Th0Uj0onEreRwDgQaHglPs2vJoM4VMMpkJmX3bhOBok+l+32/+pO1MJX9dJTpME7I0ko1II3IgB/5Pag0PZoiZ2F1PnY9bR8WA/bmgWCLcD1y8ECwAO0cJTHUY4nj7Nms3E27eo6aTN6sTQjnMCZXmPEkEAgCZXCLFCmEdsk5J13Fk2DjCWvFqhA28dCEJOR+dKxyBP9/frKetRK3MRKoTIpgDI5Hdx6tj7m1/Mf5/t3WvpxLAcU7OprgGiEBARMYjUryQBOccIlok8PMh7v3zfGcynZgr7FkrILBOISB0dXoehLr/fIvC5vbNNWLs9wVirmQTKVFIsFthIZ21ZrDTRkqE2ud1LehWqFZSiBQuBOXk7uoxmPNcrlOFwu3Tq5Hihfj9Oppa3Bz65ey4FJ8MqP0eEVgorpHihdBvZAclsrJnqj06w5FEEEK/axUvRPhu/P0JKyXHudoBErAuQgSWBEfGz8VqhBDdgDs04vs9vD8QKJ6I65gEXsbVSkqNQOxoalUjhKsJuA+Ct6hLJc8Tu0GdyHKE8LXifEWRTmipQD0i1QnpXybnt5fUUV91nghICOeI10drETK3F1LQcb44wrs7e9aSk6lECF9DuY3K3c88j39npwIUK4Tyl+5qOkTAMIhGPE9OpHgh8uKPExA6OwdJXM8TqVaITuYbgx3HcRNrL51IE6LlQDjO8Ygo62pClA3NDteIZFuoHKARUTY0O9wXeJm8TNgIPosAAAAASUVORK5CYII=",
    				animated: false,
    				frameWidth: 50,
    				frameRate: 10,
    				yoyo: false,
    				gridSize: 20,
    				showGrid: true,
    				selectedColor: null
    			},
    			fireball: {
    				name: "fireball",
    				width: 34,
    				height: 18,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAABGUlEQVRIS82VwRGCMBBFs1V4CRfL8SJVaAlYgrRAFXqhIXKxChzd/XGysAZnZEiGGSBsks/Pyy65H9twc+NrSFU7mhs6HPi7br7nHnpf0zbb+U3bakLGkf+AiJXiPdxZjj/yHe9wAoJ8LbLFB8ThZzDedWqePnWGihGit8FyJOpv/DKq9iGJCztx+CHd55SZCSObC7EghDBtQ2Sq8bOnxClHTBs/znBIMUKg2NwaBFwMRq4pE/GUaDYwz0keBI7ljKwtRDOAvce6MV9IPnGWIxYEOVbASLFCcknCypw6E2cZwUKWI5sJ0QvrYxy3TrPRyimRTEtt4Fql84rFSC6zFiNkce2RQKtKx3mk6up5K119c0zkEty/hDwBD8/AA0Nop/cAAAAASUVORK5CYII=",
    				animated: false,
    				frameWidth: 25,
    				frameRate: 10,
    				yoyo: false,
    				frameSize: null
    			},
    			"mr squiggles moving": {
    				name: "mr squiggles moving",
    				width: 250,
    				height: 60,
    				png: "data:image/png;base64,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",
    				animated: true,
    				frameWidth: 50,
    				frameRate: 14,
    				yoyo: true
    			},
    			"alien moving": {
    				name: "alien moving",
    				width: 66,
    				height: 18,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAASCAYAAADv2ggfAAABEUlEQVRYR+2WQRLCMAhF051X8gRue6QeqVtP4JXc6UyFyRTy/SQ6Y03bJTQEHpTfIdlnSo/FNKXB+V729/7iocC5H8f1xbKEmL8bEFoIK5j5/wxIefwjn8DuQKDO5snBMEtnFeDG4vKJ2FjCMJ0PAXsQZ1GFCyNg/Ehl7M6pDOvUS/O7iapFAXh1XNV+gBBAGYSSVnIyEfdxXiyneVwxdfaruLVT+jaYsOa4IE+9rjXuAUIal0GAby1MGKnItyeC7JzqfGWSDxBRELVLHm75WhXSi9HuaVULoB50IvYHwlZs9Rr51W7VAhGMxo3Gs+qE8iH34j/LaMLdgrA6zTrDgLVOGrs3OnHBevCfZbTTnYB4Ag698oOf/OneAAAAAElFTkSuQmCC",
    				animated: true,
    				frameWidth: 22,
    				frameRate: 10,
    				yoyo: true,
    				gridSize: 15,
    				showGrid: true
    			},
    			"mr squiggles": {
    				name: "mr squiggles",
    				width: 150,
    				height: 60,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAA8CAYAAACEhkNqAAAEL0lEQVR4Xu2dMXrbMAyF5bU9RTtla+eeokfI1j1zx8zZu3nsSTq3W6b2FO3qfrJFWYZFAgQBipJeVpMgH94PiJKV5NDhBxlwyMDBISZCIgOdG1inb91pmt/DF7+1PH2EDl12ARaTN4DVGFh0O8GgtXauoAc6ZKC5dSyAJTNgqVHeBVINLFT8Ugil1/UCDGAp/fYyRLkd9TQvHSNY9JAadmp9JvISQjsizTR0zLPn5QfAUta6lyFbKRD2UmidQOt4Ui6s17WOtzUdAEvqKBkHsNKJA1gA6/wNifUZFGABrGXAsn7+tNQlBDoWuivkCtcKCKs43H5jn1utbxVnqzrYS2Hsq5nS51ytGAMdlwxY+wGwBrK0h1drQ3I7mNXbF9Y6ssGyOqtYJSTXiFgHLgWrtPNtTQfAGl5IBFi2L2YuBpZV51u60qFj3gGAVdixABbAms2A1aHVKo62A1utbxUHHQsd64blJcG6+e0bbYUp5qmLILIWdChMmExJ+qExC4Y4GqII3aQfarD+/v6pyEH+lLfvP46PiPJnJ2ecDaE6vj6O650nPx9tdO5NhwlY1IypnZwx3NxahqT2oQUsxOxzUFsHzft0L7kFqtEBsIbOG0u8xBAJlDXBihVzv89UoVvqMAErtwJyxtcyJGdPdGzMkKmJNXW8efchKeffn1+zn1vqMAMrJiYmIijj5tU0pN8Tt5+YY9y8mjq0YEn0S3UALHITEkw5TDJzOnXdmgpkTkMPTa+j/0lpsSoQOVgvD5e7qM/fZ4uWipGImFZIMJLOGyvk5eGy7tOrfM9zO83UEQyRgtWCDguwSnXITco0BGDddoeaBbIOsAaguqfXc6Ziz6+4Flp8NintWDvSYQEW9St0bGmB8B1rR4ZIDq9rKJAqh3em0M3A4m7XJ3cTyc5H40grhFu/ExYIF2cNOiRgeesAWBxJ5HNvQ9jtrKRA1gPWNeP8nhN3g9xZkTO2GKyd6OBNaqVCdmIIB3Yzl3TGjxywwtjZtwLYhCgH0A7Rae8OrwUCHUov+mlSPwBW/dd/LrZuvEDMwXq8vj+VVRdHxuDiu8PMjgUd6ffQOD8AVgRogNUoWFwHCu0sGMiNv/tW/b4DpTuksmNx+4KO4T+OkPy6dSwYMs/5XgpEDVZI22Lvvht1LOjIOgqPg7kCAVhDqlAgeYCVgxXWIw9Ka1X63XOTrvC/iEFHHkHMV1r9ny+dC8h3LIBVZESYvLcC0YB1mfP4Y5lflDx+ku95Dgl6NoOOssKJ+CE3CYaUGUBnb7xA5GDRxIRKL02Q1C6v9bzixnR5recVV6kDYDVmiLTO7sY1pgNgNWYIwIIhOga88uYVF5dCnc/j3S3OinkJZEDGpbCxSs9zdzK6MR0asOjzK00MTf6s17WOJ9Vkva51PBMdGiiaFCLNxmQcdCiSJs3ff2+DE4gfdd8MAAAAAElFTkSuQmCC",
    				animated: true,
    				frameWidth: 50,
    				frameRate: 8,
    				yoyo: true,
    				frameSize: null
    			},
    			"health globe": {
    				name: "health globe",
    				width: 160,
    				height: 40,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAoCAYAAAB5LPGYAAAB50lEQVR4Xu2a0U3EMBBEc03QDw3QCPXwRxU0cF1QBE2AhHQSuZMyWr0YO/G7X+/Gk9nZ2cS5y+JvKAa+3pbvv4CeXpfLSACr+FL8UDc3EtG9sKSC9cJ127eKL8UrwN4Vvds/Faw33Cq+FK8Ae1dUAQ5WgZ3hpA7cebvy5ar4qvFlQDChiu/0DlglBPJfTq/iq8aXAcGEKj4FCAmn6dWCVeMpvmp+FZ8CrDK8c3y1YNX4neHGy1XxYQG+XNfnVvcIP577nmMlfO+fa8T/fe42Oz4FqAA3Xa11gyhABagA44MFCGjdwQDab+rs+KZ3wNGfUc+OTwEO/pKkAMOMSSPk7AS2HsFn508H1AHRSwhtkCjA5HDUAegNiI+ds/bmTwGGDrJBmMUk/hSgAlz9A5vJ7TFbAUJGE4Hp8r1H3Oj4dEAdUAdMXbq1rsP4EkL0szjiEH2H588R7AgeewSn/kwjkDpc2j+tiy8xtL3emr/ogAl+a4Bp/7QuvsSQAmQM+a360PzpgH4LHvtbcGovR1xiqO+IY+jyH2bpM74OqAPqgLRLyUE17WCKffYJogPqgMd2QOoA5s/NAHbAuenz7ikDCpAyaD5iQAEi+kymDChAyqD5iAEFiOgzmTKgACmD5iMGFCCiz2TKwA+wpoA4lzwgYAAAAABJRU5ErkJggg==",
    				animated: true,
    				frameWidth: 40,
    				frameRate: 7,
    				yoyo: false
    			}
    		},
    		blocks: {
    			grass: {
    				name: "grass",
    				solid: true,
    				graphic: "grass",
    				width: 30,
    				height: 30,
    				throwOnTouch: false
    			},
    			spikes: {
    				name: "spikes",
    				solid: true,
    				graphic: "spike",
    				width: 30,
    				height: 30,
    				throwOnTouch: true,
    				damage: 20
    			},
    			lava: {
    				name: "lava",
    				solid: true,
    				graphic: "lava",
    				throwOnTouch: true,
    				damage: 200
    			},
    			dirt: {
    				name: "dirt",
    				solid: true,
    				graphic: "dirt"
    			},
    			bouncer: {
    				name: "bouncer",
    				solid: false,
    				throwOnTouch: true,
    				damage: 0,
    				graphic: "bouncer"
    			},
    			"health globe": {
    				name: "health globe",
    				solid: true,
    				throwOnTouch: false,
    				consumable: true,
    				healthOnConsume: 50,
    				graphic: "health globe"
    			}
    		},
    		characters: {
    			"mr squiggles": {
    				graphics: {
    					still: "mr squiggles",
    					moving: "mr squiggles moving",
    					spinning: "mr squiggles spin"
    				},
    				name: "mr squiggles",
    				maxHealth: 100,
    				maxVelocity: 350,
    				jumpVelocity: 750,
    				gravityMultiplier: 1,
    				canFly: false
    			}
    		},
    		enemies: {
    			"mr smiley": {
    				graphics: {
    					still: "mr smiley",
    					moving: null
    				},
    				name: "mr smiley",
    				maxHealth: 250,
    				maxVelocity: 150,
    				jumpVelocity: 500,
    				gravityMultiplier: 1,
    				score: 10
    			},
    			alien: {
    				graphics: {
    					still: "alien",
    					moving: null
    				},
    				name: "alien",
    				maxHealth: 100,
    				maxVelocity: 250,
    				jumpVelocity: 600,
    				gravityMultiplier: 1,
    				score: 1,
    				framesPerGraphic: 5,
    				canFly: false
    			}
    		},
    		levels: {
    			"level 1": {
    				name: "level 1",
    				playableCharacters: [
    					"mr squiggles"
    				],
    				background: "rgba(170, 221, 255, 255)",
    				blocks: [
    					{
    						name: "grass",
    						x: 0,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 0,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 40,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 80,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 120,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 240,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 240,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 240,
    						y: -40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 280,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 280,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 280,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 320,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 320,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 320,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 360,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 360,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 360,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 400,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 400,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 400,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 400,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 400,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 400,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 440,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 440,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 440,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 440,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 440,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 440,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 440,
    						y: -40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 480,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 480,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 480,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 480,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 480,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 480,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 520,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 520,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 520,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 520,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 520,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 520,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 520,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 560,
    						y: 520,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 560,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 600,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 640,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 640,
    						y: -40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 680,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 720,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 720,
    						y: -40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 760,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "bouncer",
    						x: 800,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 800,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "bouncer",
    						x: 840,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 840,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "bouncer",
    						x: 960,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 960,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 960,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 960,
    						y: -40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 1000,
    						y: 560,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "bouncer",
    						x: 1000,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1000,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1000,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1000,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 1000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "bouncer",
    						x: 1040,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1040,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1080,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1120,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1160,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 1160,
    						y: -40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1240,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1280,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1320,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1320,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1320,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1320,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1360,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1400,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1400,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1400,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1440,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1440,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1440,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1480,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1480,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1520,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1560,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1600,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1640,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1680,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 1720,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1720,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1840,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1840,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1880,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1880,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2000,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2000,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2040,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2040,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2080,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2080,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2120,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2120,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 2160,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2160,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2160,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2200,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2200,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2320,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2320,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2360,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2360,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2400,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2400,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2520,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2520,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2560,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2560,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2600,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2600,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2600,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2640,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2760,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2800,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2840,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2880,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 2920,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2920,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2960,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 2960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3000,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3040,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3080,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3080,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3080,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3120,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3120,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3120,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3120,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3160,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3160,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3160,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3160,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3200,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3200,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3200,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3200,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3200,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 3240,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3240,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3240,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3240,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3240,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3240,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3240,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3280,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3280,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3280,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3280,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3280,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3280,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3400,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3400,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3440,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3440,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3440,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3480,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3520,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3560,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3560,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3560,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3560,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3680,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3680,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3720,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3720,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3760,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3760,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3760,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3760,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3800,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3840,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3880,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3880,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3880,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3880,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3880,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3880,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3880,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3880,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3920,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3920,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3920,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3920,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3920,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3920,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3960,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3960,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3960,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3960,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 3960,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4000,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4000,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4000,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4000,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4040,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4040,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4040,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4040,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4040,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4040,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4040,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4040,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4080,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4080,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4080,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4080,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4080,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4080,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4080,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4080,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4120,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4120,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4120,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4120,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4160,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4160,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4160,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4200,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4200,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4280,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4280,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4320,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4320,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4360,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4360,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4360,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4400,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4400,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4400,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4400,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4440,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4440,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4440,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4440,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4480,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4480,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4480,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4480,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4520,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4520,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4520,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4520,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4520,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4560,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4560,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4560,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4560,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4560,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4560,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4600,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4600,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4600,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4600,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4600,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4600,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4600,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4640,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4640,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4640,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4640,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4640,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4640,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4640,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4640,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4680,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4680,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4680,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4680,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4680,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4680,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4680,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4720,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4760,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 4800,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4800,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4840,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4840,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4840,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4840,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4840,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4840,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4840,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4840,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4880,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4880,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4880,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4880,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4880,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4880,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4880,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4880,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4920,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4920,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4920,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4920,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4920,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4920,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4920,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 4960,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4960,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4960,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4960,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4960,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4960,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 4960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5000,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5000,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5000,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5000,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5000,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5000,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5040,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5040,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5040,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5040,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5040,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5080,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5080,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5080,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5080,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5120,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5120,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5120,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5160,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5240,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5280,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5320,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5320,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5360,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5400,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5400,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5400,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 5400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5440,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5440,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5440,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 5440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5480,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5480,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 5480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 5520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 5560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 5600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5640,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5640,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 5640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5680,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5680,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5680,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5680,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5720,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5720,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5720,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5760,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5760,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5800,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5800,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 5840,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5840,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 5960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 6000,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6000,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 6040,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6040,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6040,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 6080,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6080,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 6120,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6120,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6160,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 6160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6280,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6320,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6320,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6360,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6400,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6400,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 480,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 440,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 400,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 6440,
    						y: 120,
    						width: 40,
    						height: 40
    					}
    				],
    				enemies: [
    					{
    						name: "alien",
    						x: 1440,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 1360,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 1280,
    						y: 400
    					},
    					{
    						name: "alien",
    						x: 1200,
    						y: 480
    					},
    					{
    						name: "alien",
    						x: 760,
    						y: 560
    					},
    					{
    						name: "alien",
    						x: 680,
    						y: 520
    					},
    					{
    						name: "alien",
    						x: 560,
    						y: 400
    					},
    					{
    						name: "alien",
    						x: 440,
    						y: 360
    					},
    					{
    						name: "mr smiley",
    						x: 5800,
    						y: 80
    					},
    					{
    						name: "alien",
    						x: 2080,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 2360,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 2600,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 2920,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 3040,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 4000,
    						y: 360
    					},
    					{
    						name: "alien",
    						x: 4160,
    						y: 360
    					},
    					{
    						name: "alien",
    						x: 4440,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 4680,
    						y: 360
    					},
    					{
    						name: "alien",
    						x: 5080,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 5440,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 5800,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 3720,
    						y: 480
    					},
    					{
    						name: "mr smiley",
    						x: 640,
    						y: 400
    					},
    					{
    						name: "mr smiley",
    						x: 320,
    						y: 200
    					}
    				],
    				thumbnail: "data:image/png;base64,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"
    			},
    			"test level": {
    				name: "test level",
    				playableCharacters: [
    					"mr squiggles"
    				],
    				background: "rgba(198, 244, 255, 255)",
    				blocks: [
    					{
    						name: "grass",
    						x: 0,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 0,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 40,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 400,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 440,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 560,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 600,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 600,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 640,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "bouncer",
    						x: 760,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 760,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 800,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 840,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 880,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 920,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 960,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 1000,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1000,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1000,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 1280,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 1320,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1320,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1360,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1400,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1400,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1400,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1440,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1440,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1440,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1480,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1480,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1520,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1520,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1560,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1560,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1560,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1600,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1600,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1640,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "dirt",
    						x: 1720,
    						y: 0,
    						width: 40,
    						height: 40
    					}
    				],
    				enemies: [
    					{
    						name: "alien",
    						x: 960,
    						y: 120
    					},
    					{
    						name: "alien",
    						x: 400,
    						y: 80
    					},
    					{
    						name: "alien",
    						x: 1080,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 1120,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 1240,
    						y: 360
    					},
    					{
    						name: "alien",
    						x: 960,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 920,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 880,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 840,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 840,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 800,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 720,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 600,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 560,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 520,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 480,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 440,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 400,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 40,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 40,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 80,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 120,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 160,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 200,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 200,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 240,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 240,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 680,
    						y: 360
    					},
    					{
    						name: "alien",
    						x: 680,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 680,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 720,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 720,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 760,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 800,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 840,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 880,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 920,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 960,
    						y: 200
    					},
    					{
    						name: "alien",
    						x: 960,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 1000,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 1000,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 1040,
    						y: 280
    					},
    					{
    						name: "alien",
    						x: 1040,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 1080,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 1120,
    						y: 320
    					},
    					{
    						name: "alien",
    						x: 1120,
    						y: 360
    					},
    					{
    						name: "alien",
    						x: 1160,
    						y: 360
    					}
    				],
    				thumbnail: "data:image/png;base64,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"
    			},
    			"consumable test": {
    				name: "consumable test",
    				playableCharacters: [
    					"mr squiggles"
    				],
    				background: "rgba(198, 244, 255, 255)",
    				blocks: [
    					{
    						name: "grass",
    						x: 0,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 360,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "spikes",
    						x: 520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 720,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 760,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "health globe",
    						x: 880,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "lava",
    						x: 1000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1240,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1280,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1320,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 0,
    						width: 40,
    						height: 40
    					}
    				],
    				enemies: [
    					{
    						name: "mr smiley",
    						x: 1280,
    						y: 200
    					}
    				],
    				thumbnail: "data:image/png;base64,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"
    			}
    		}
    	},
    	{
    		name: "Sonic",
    		art: {
    			grass: {
    				name: "grass",
    				width: 40,
    				height: 40,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAA5klEQVRYR+2T0Q0CMQxD3bEYi7VYhLFAPREphPSaYCHx4f6c1ItT98UduOGBbN0BXADYNy0Km53aSj8AY2kwNpiHzzVNd5dpTd/o1TNoRKPRSC4amvVfmswNZjf0JjIDZsIIn5n0U8hi4fYGri6DvnmWv4xUrFvVVGLhc/+qfzfoR+cJ7LJXobUhdfhJzvw0eGZy9S97OJUL7rJ6vGI/Yj8G/yAq4+nUNHqvDXYO/GGtDLJwRVAEWQKsXhkUQZYAq1cGRZAlwOqVQRFkCbB6ZVAEWQKsXhkUQZYAq1cGRZAlwOr/PoNP/8VkxiC/JzEAAAAASUVORK5CYII=",
    				animated: false,
    				frameWidth: 25,
    				frameRate: 10,
    				yoyo: false
    			},
    			"badnik b moving": {
    				name: "badnik b moving",
    				width: 275,
    				height: 31,
    				png: "data:image/png;base64,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",
    				animated: true,
    				frameWidth: 46,
    				frameRate: 10,
    				yoyo: false
    			},
    			"sonic moving": {
    				name: "sonic moving",
    				width: 340,
    				height: 40,
    				png: "data:image/png;base64,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",
    				animated: true,
    				frameWidth: 44,
    				frameRate: 15,
    				yoyo: false
    			},
    			"sonic still": {
    				name: "sonic still",
    				width: 27,
    				height: 39,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAnCAYAAAD+bDODAAAC0klEQVRYR72Xi7HjIAxFSScqhVJUCqVQikpRJ96RQCB+sf129zGTicexOVzpSpBPuBkQ6ZofYYqfu/d2vy8v7Sa3FyGAXnLgNtcbcIMB5FEBlImHwQUCEDusgmeozMeMg5hV2Qwts5fJmQMlDjHBAPRqBWoLv4V5JbPaFHOIsagyoKyjCu4hrjdewYqofKky5uBhCswxRBdug2pOmcMr2GCWChNI5lxzd0yrmmjO49bCM6TlTJRWR87hs9R6dV9hi+3tTRCEmKL5pElCJL0mipo7v4hZXbf+pnhb5gE0NykF/dgaBGSGIaIGbHUJIeQMjaEXTZG3lV/iQVkuqWsD5LlILdREGooOW4p5zXm5U4H+5x2sLl6BC2w393YBU0eRyU4wRJbw2dRjGM9ivrcwy2PPUe2dzEFCmlKSzz1sm8cazgQpxFQSZqbxC6aEgSEarAHvu743jUzuWpYCIo6BoVrwmPx95QywpZg38V1ghxwA9vAtyWslMCnZzXUCSq3J4EwhTUIGZarqBsSM0phLruJUZBWiv21ASxhnFbsSEGDxSYUBBKS+mZ5At7Bu6VICsnH6IVuMOrPucRLGUwgfwUSdQSwnGipOA8gWIc9gpu1u8vWUZCCDJHI2l6J1qv4pbACVpClMS+1vw2jmUJvXbpFzDogY5DtXUxjQWV7hRGsoj2E0GDIGZGmsBWQjRuqnLrupPbEfinxf/GoQb3vp4pI3C5e8qF297nlWf/Itz9hzr2D+dJRSGg6xRNgONe6c2HL4KoybNnXJlmGq5FRMVLb806F0nuNHfxBk8l+BzaD/quxXYGIQ2eq9IwHgE2O8/L3ZgT5vj3Pm3ShQGYiosF57pfufgE9hl/qwutG+rditd6pCOeT8ZD9zISiwOiCXLiFdRRWmVP8BlD75uqhPIFm55s61Lp8X/3/VFmhKn4RxUCUwUfJkGNiefgR7MvGTZ/4AN2yute6ShqkAAAAASUVORK5CYII="
    			},
    			"badnik b still": {
    				name: "badnik b still",
    				width: 44,
    				height: 31,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAfCAYAAACcai8CAAAFT0lEQVRYR7VYMUwjRxT9pIhcWaZjCyRv6cLFueIspcCRUpgOV4QuVigCoghuOF15OjcmBYIURE7nozIdjoQUU9zJR+UUSHFpS1csHRaVq2z0Pn5zs+v1ro+QabBnZ+a///6b99csyQLjRDI+lu3JeGmB5U9awhjYXJGxnlGVlHRkEog5F4AnoiA5Mrc9aebL+hUHOiLPAp5AcSZijK+bIvtNjdOWDAAHQEcGLUvKL0vKZKq7j6uSWa/KOF/Ug54DdBxYMvwh/bW8ffjKVNcAxuZwyTHH8tign4NpVJCJ82wyS3Zfpf+Rh4eHJa4FPgU8BYuPM4zPgJ6W6r9II51O+2DN1iulRxmAWYC140OGChAZOCICGYRFDnk0ZRK4SDiUY1FpXN56vpNJiTeeSCHvqKyiAOOiRYHlepPB9EZGgg6zjM3u7UAIYCPvxF5AgC18zlG6A0/uvysFkrY1G2bWJsgAxuTe1E7CTIdZ7l71pZRDTR5HfywSB7r/6d53ZCIvvvlb7kbfyuWtJ8N8LlC1aaWUsPCFp0wwr4BZGrKM73iIAYnYgMkuGHNWHVnJ/imd9wUprC7PZZlyKKwu65mtq36AYVgXYwYu+TQl294CgK0HgeztrLFm+aoruZwLkLoOjCXJonF26TtZR7yRJ9s7G0bDADtjoRbQKWm6Rl0i3GHCoMNgGWBy1hICqO1sJDaRg8MTfzgaijccyMebjsbFWbjQqCzGvMvNmAFbi8vUptvWU3erqo8uzo8SAYPh9u+nChZ74EwEmjts6DmDes1IkTFtsJgzPswH1HNAE9O+ThYQCMy31opSXC8LmANodZPjinZEDLTZ9n5bSwnAvetuIDncjdTWrrhZ14SzQYfBGsD4wBLxstmAsfF+rSSOm5PJ+am5IACyuXXgF9dLAll4x1Xf7la68LgqrdSmeMOh9K47hmE8gkwc19VnHADMQd3aWAKlJGgssFxCwYJJHo5D2WBerpV9PMOo1ffChdHvjcOTGbAqi0+e3/i1rRWCtpdvugFJRL0dRrZiHEarwWeyi9IV1ouScRzjCmC1+EtPXrwsa9C7u89sYe/KiqvJgt2L7x1x9psaE1bXfdfWeezJjYbGCSKznk7OvSy2ewD8IOua4ACt9jS50FdBXMSjrCO9n4t6rK1hfN9858n2Te/x7S8kEYAdjgaJl5ZJLLwQG9xszgdjGJRIamc7+BoaQw8Sgx3CLTDoGHGMhp99EWB7M7QLdnqjgU7b/T4KADtYMZuTg5H35F8vXwyYNxugujsVc0mGh29U3yoJ5/E9Y+x5+rd/3RO3/lo/R1nV/8IwgaK7EQRdA2DQRGBvUQP+Wzp//NkDScDGsJcdEtVaVB4LMUzTh0vUfqoIrAi3u/LDrrZnMHhxfqqX8vVvTeGrJN7i3vxYNS5QOsO+ribGtg49w98xFumYiYABlqbPywbf/OtjRza3djUQ2AIQzPFSkmnoHOtYDSTKc5B864++nL6t6T4ATwIdC5hgwR4GDrV9lkHYWgGGbBEwvJntG3P2WsxD93aFsCZOHnMB22DJmg0WRg9vZiIAarNOwEg2qqlgjppHddh0MB/HciRgvB+ACeqSQG2Dx4sLQbGpsPz2xWN1MIckMbAeZ9HX2dqZHBKf10zmMszD4joR/3/BTghAfFU0ydRrChDeS1uzf+gizu6rht4BsJyk47kMs0RJbRMB+R4A4HACWh/aN72aSYXPs9/22IziYkYCXmRj2G8BPK4BRIEgu/RjgI+TA86fAfwUsHFA454BMCzvqL5n9JzUQGYA45AkGTwVYHgfGKUjLBr3X5aBXDbB7MIOAAAAAElFTkSuQmCC"
    			},
    			"sonic bored 1": {
    				name: "sonic bored 1",
    				width: 188,
    				height: 39,
    				png: "data:image/png;base64,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",
    				animated: true,
    				frameWidth: 40,
    				frameRate: 5,
    				yoyo: true
    			},
    			"sonic spin": {
    				name: "sonic spin",
    				width: 160,
    				height: 30,
    				png: "data:image/png;base64,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",
    				animated: true,
    				frameWidth: 40,
    				frameRate: 3,
    				yoyo: false
    			}
    		},
    		blocks: {
    			grass: {
    				name: "grass",
    				solid: true,
    				throwOnTouch: false,
    				graphic: "grass"
    			}
    		},
    		characters: {
    			sonic: {
    				graphics: {
    					still: "sonic bored 1",
    					moving: "sonic moving",
    					spinning: "sonic spin"
    				},
    				name: "sonic",
    				maxHealth: 100,
    				maxVelocity: 600,
    				jumpVelocity: 700,
    				gravityMultiplier: 1,
    				canFly: false
    			}
    		},
    		enemies: {
    			"badnik a": {
    				graphics: {
    					still: "badnik b still",
    					moving: "badnik b moving"
    				},
    				name: "badnik a",
    				maxHealth: 100,
    				maxVelocity: 250,
    				jumpVelocity: 700,
    				gravityMultiplier: 1,
    				score: 1
    			}
    		},
    		levels: {
    			"level 1": {
    				name: "level 1",
    				playableCharacters: [
    					"sonic"
    				],
    				background: "rgba(198, 244, 255, 255)",
    				blocks: [
    					{
    						name: "grass",
    						x: 0,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 0,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 0,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 0,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 0,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 0,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 0,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 0,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 0,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 40,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 80,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 120,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 120,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 120,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 120,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 160,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 160,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 200,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 200,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 240,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 240,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 240,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 280,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 280,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 320,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 400,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 400,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 440,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 440,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 480,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 520,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 520,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 560,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 560,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 560,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 600,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 600,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 600,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 640,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 640,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 640,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 680,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 680,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 720,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 720,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 760,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 760,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 760,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 800,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 800,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 800,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 840,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 840,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 840,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 880,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 880,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 880,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 920,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 920,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 920,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 960,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 960,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 960,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1000,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1000,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1000,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1040,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1040,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1080,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1080,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1120,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1240,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1400,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1440,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1560,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1600,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1640,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1760,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1800,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2240,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2240,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2280,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2280,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2280,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2280,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2320,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2320,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2320,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2320,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2360,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2360,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2360,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2400,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2400,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2440,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2440,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2440,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2480,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2480,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2480,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2520,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2520,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2520,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2520,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2560,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2560,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2560,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2560,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2600,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2600,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2600,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2600,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2640,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2640,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2640,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2640,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2640,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2680,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2680,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2680,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2680,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2680,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2720,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2720,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2720,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2720,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2760,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2760,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2760,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2760,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2760,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2800,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2800,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2800,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2800,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2800,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2840,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2840,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2840,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2840,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2840,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2840,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2880,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2880,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2880,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2880,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2920,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2920,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2920,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2920,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2960,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2960,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2960,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2960,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3000,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3000,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3000,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3000,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3040,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3040,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3040,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3040,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3080,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3080,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3080,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3080,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3120,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3120,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3160,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3160,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3200,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3200,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3200,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3240,
    						y: 40,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3240,
    						y: 0,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 3280,
    						y: 0,
    						width: 40,
    						height: 40
    					}
    				],
    				enemies: [
    					{
    						name: "badnik a",
    						x: 920,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 1240,
    						y: 160
    					},
    					{
    						name: "badnik a",
    						x: 1800,
    						y: 80
    					},
    					{
    						name: "badnik a",
    						x: 2080,
    						y: 40
    					},
    					{
    						name: "badnik a",
    						x: 2320,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 2760,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 3040,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 400,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 520,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 640,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 80,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 120,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 80,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 320,
    						y: 160
    					},
    					{
    						name: "badnik a",
    						x: 680,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 720,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 760,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 880,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 880,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 920,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 960,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 1000,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 1000,
    						y: 480
    					},
    					{
    						name: "badnik a",
    						x: 1040,
    						y: 480
    					},
    					{
    						name: "badnik a",
    						x: 1040,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 1000,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 960,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 920,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 880,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 840,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 800,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 760,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 720,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 680,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 640,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 600,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 560,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 520,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 480,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 440,
    						y: 520
    					},
    					{
    						name: "badnik a",
    						x: 400,
    						y: 480
    					},
    					{
    						name: "badnik a",
    						x: 360,
    						y: 480
    					},
    					{
    						name: "badnik a",
    						x: 320,
    						y: 480
    					},
    					{
    						name: "badnik a",
    						x: 280,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 280,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 240,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 240,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 240,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 280,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 360,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 520,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 560,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 640,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 720,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 760,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 800,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 840,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 880,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 920,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 960,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1000,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1040,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1040,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 1000,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 960,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 920,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 880,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 840,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 800,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 760,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 720,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 680,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 640,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 600,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 560,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 520,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 520,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 480,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 440,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 400,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 360,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 320,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 280,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 240,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 200,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 160,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 120,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 120,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 160,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 200,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 240,
    						y: 240
    					},
    					{
    						name: "badnik a",
    						x: 280,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 320,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 360,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 400,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 440,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 480,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 520,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 560,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 600,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 640,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 680,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 720,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 1280,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1320,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1400,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1440,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1520,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1600,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1640,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1680,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1760,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 1760,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 1840,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 1880,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 1960,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 2040,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 2080,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 2120,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 2160,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 1920,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 1960,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 2080,
    						y: 280
    					},
    					{
    						name: "badnik a",
    						x: 2120,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 2240,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 2360,
    						y: 320
    					},
    					{
    						name: "badnik a",
    						x: 2400,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 2440,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 2480,
    						y: 360
    					},
    					{
    						name: "badnik a",
    						x: 2520,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 2600,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 2640,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 2680,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 2720,
    						y: 400
    					},
    					{
    						name: "badnik a",
    						x: 2760,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 2800,
    						y: 440
    					}
    				],
    				thumbnail: "data:image/png;base64,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"
    			}
    		}
    	}
    ];

    const defaultValue = [...sampleProjects];

    // import old keys as a project
    const oldArt = localStorage.getItem('pixel-drawings');
    if (oldArt != null) {
    	defaultValue.push({
    		name: 'Bub the bobcat',
    		art: JSON.parse(oldArt),
    		blocks: JSON.parse(localStorage.getItem('blocks') || '{}'),
    		characters: JSON.parse(localStorage.getItem('characters') || '{}'),
    		enemies: JSON.parse(localStorage.getItem('enemies') || '{}'),
    		levels: JSON.parse(localStorage.getItem('levels') || '{}'),
    	});
    }

    const { subscribe: subscribe$1, set } = LocalStorageStore('projects', defaultValue);

    var projects = {
    	subscribe: subscribe$1,
    	set,
    };

    var deleteIcon = { remove: { width: 1408, height: 1792, paths: [{ d: 'M1298 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z' }] } };

    var zoomIcon = { 'search-plus': { width: 1664, height: 1792, paths: [{ d: 'M1024 800v64q0 13-9.5 22.5t-22.5 9.5h-224v224q0 13-9.5 22.5t-22.5 9.5h-64q-13 0-22.5-9.5t-9.5-22.5v-224h-224q-13 0-22.5-9.5t-9.5-22.5v-64q0-13 9.5-22.5t22.5-9.5h224v-224q0-13 9.5-22.5t22.5-9.5h64q13 0 22.5 9.5t9.5 22.5v224h224q13 0 22.5 9.5t9.5 22.5zM1152 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zM1664 1664q0 53-37.5 90.5t-90.5 37.5q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z' }] } };

    var image = { image: { width: 1920, height: 1792, paths: [{ d: 'M640 576q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zM1664 960v448h-1408v-192l320-320 160 160 512-512zM1760 256h-1600q-13 0-22.5 9.5t-9.5 22.5v1216q0 13 9.5 22.5t22.5 9.5h1600q13 0 22.5-9.5t9.5-22.5v-1216q0-13-9.5-22.5t-22.5-9.5zM1920 288v1216q0 66-47 113t-113 47h-1600q-66 0-113-47t-47-113v-1216q0-66 47-113t113-47h1600q66 0 113 47t47 113z' }] } };

    var editIcon = { pencil: { width: 1536, height: 1792, paths: [{ d: 'M363 1536l91-91-235-235-91 91v107h128v128h107zM886 608q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zM832 416l416 416-832 832h-416v-416zM1515 512q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z' }] } };

    var playIcon = { play: { width: 1408, height: 1792, paths: [{ d: 'M1384 927l-1328 738q-23 13-39.5 3t-16.5-36v-1472q0-26 16.5-36t39.5 3l1328 738q23 13 23 31t-23 31z' }] } };

    var arrowLeftIcon = { 'arrow-left': { width: 1536, height: 1792, paths: [{ d: 'M1536 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z' }] } };

    var arrowRightIcon = { 'arrow-right': { width: 1536, height: 1792, paths: [{ d: 'M1472 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293h-704q-52 0-84.5-37.5t-32.5-90.5v-128q0-53 32.5-90.5t84.5-37.5h704l-293-294q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z' }] } };

    var arrowUpIcon = { 'arrow-up': { width: 1664, height: 1792, paths: [{ d: 'M1611 971q0 51-37 90l-75 75q-38 38-91 38-54 0-90-38l-294-293v704q0 52-37.5 84.5t-90.5 32.5h-128q-53 0-90.5-32.5t-37.5-84.5v-704l-294 293q-36 38-90 38t-90-38l-75-75q-38-38-38-90 0-53 38-91l651-651q35-37 90-37 54 0 91 37l651 651q37 39 37 91z' }] } };

    var arrowDownIcon = { 'arrow-down': { width: 1664, height: 1792, paths: [{ d: 'M1611 832q0 53-37 90l-651 652q-39 37-91 37-53 0-90-37l-651-652q-38-36-38-90 0-53 38-91l74-75q39-37 91-37 53 0 90 37l294 294v-704q0-52 38-90t90-38h128q52 0 90 38t38 90v704l294-294q37-37 90-37 52 0 91 37l75 75q37 39 37 91z' }] } };

    var addIcon = { plus: { width: 1408, height: 1792, paths: [{ d: 'M1408 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z' }] } };

    var minusIcon = { minus: { width: 1408, height: 1792, paths: [{ d: 'M1408 736v192q0 40-28 68t-68 28h-1216q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h1216q40 0 68 28t28 68z' }] } };

    var magnet = { magnet: { width: 1536, height: 1792, paths: [{ d: 'M1536 832v128q0 201-98.5 362t-274 251.5-395.5 90.5-395.5-90.5-274-251.5-98.5-362v-128q0-26 19-45t45-19h384q26 0 45 19t19 45v128q0 52 23.5 90t53.5 57 71 30 64 13 44 2 44-2 64-13 71-30 53.5-57 23.5-90v-128q0-26 19-45t45-19h384q26 0 45 19t19 45zM512 192v384q0 26-19 45t-45 19h-384q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h384q26 0 45 19t19 45zM1536 192v384q0 26-19 45t-45 19h-384q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h384q26 0 45 19t19 45z' }] } };

    var copyIcon = { copy: { width: 1792, height: 1792, paths: [{ d: 'M1696 384q40 0 68 28t28 68v1216q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-288h-544q-40 0-68-28t-28-68v-672q0-40 20-88t48-76l408-408q28-28 76-48t88-20h416q40 0 68 28t28 68v328q68-40 128-40h416zM1152 597l-299 299h299v-299zM512 213l-299 299h299v-299zM708 860l316-316v-416h-384v416q0 40-28 68t-68 28h-416v640h512v-256q0-40 20-88t48-76zM1664 1664v-1152h-384v416q0 40-28 68t-68 28h-416v640h896z' }] } };

    var caretDownIcon = { 'caret-down': { width: 1024, height: 1792, paths: [{ d: 'M1024 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z' }] } };

    var undoIcon = { undo: { width: 1536, height: 1792, paths: [{ d: 'M1536 896q0 156-61 298t-164 245-245 164-298 61q-172 0-327-72.5t-264-204.5q-7-10-6.5-22.5t8.5-20.5l137-138q10-9 25-9 16 2 23 12 73 95 179 147t225 52q104 0 198.5-40.5t163.5-109.5 109.5-163.5 40.5-198.5-40.5-198.5-109.5-163.5-163.5-109.5-198.5-40.5q-98 0-188 35.5t-160 101.5l137 138q31 30 14 69-17 40-59 40h-448q-26 0-45-19t-19-45v-448q0-42 40-59 39-17 69 14l130 129q107-101 244.5-156.5t284.5-55.5q156 0 298 61t245 164 164 245 61 298z' }] } };

    var eraseIcon = { eraser: { width: 1920, height: 1792, paths: [{ d: 'M896 1408l336-384h-768l-336 384h768zM1909 331q15 34 9.5 71.5t-30.5 65.5l-896 1024q-38 44-96 44h-768q-38 0-69.5-20.5t-47.5-54.5q-15-34-9.5-71.5t30.5-65.5l896-1024q38-44 96-44h768q38 0 69.5 20.5t47.5 54.5z' }] } };

    var paintBrushIcon = { 'paint-brush': { width: 1792, height: 1792, paths: [{ d: 'M1615 0q70 0 122.5 46.5t52.5 116.5q0 63-45 151-332 629-465 752-97 91-218 91-126 0-216.5-92.5t-90.5-219.5q0-128 92-212l638-579q59-54 130-54zM706 1034q39 76 106.5 130t150.5 76l1 71q4 213-129.5 347t-348.5 134q-123 0-218-46.5t-152.5-127.5-86.5-183-29-220q7 5 41 30t62 44.5 59 36.5 46 17q41 0 55-37 25-66 57.5-112.5t69.5-76 88-47.5 103-25.5 125-10.5z' }] } };

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

    function debounce(func, wait, immediate) {
    	let timeout;
    	return function () {
    		const context = this,
    			args = arguments;
    		const later = function () {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};
    		const callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	}
    }

    /* src\components\AnimationPreview.svelte generated by Svelte v3.24.1 */
    const file = "src\\components\\AnimationPreview.svelte";

    // (6:0) {#if png != null}
    function create_if_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*simple*/ ctx[5]) return create_if_block_1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(6:0) {#if png != null}",
    		ctx
    	});

    	return block;
    }

    // (15:1) {:else}
    function create_else_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "animation-preview");
    			set_style(div, "background-repeat", "no-repeat");
    			set_style(div, "background-image", "url(" + /*png*/ ctx[0] + ")");
    			set_style(div, "background-position", /*frameIndex*/ ctx[6] * -/*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px top");
    			set_style(div, "background-size", /*width*/ ctx[1] * /*scale*/ ctx[4] + "px " + /*height*/ ctx[2] * /*scale*/ ctx[4] + "px");
    			set_style(div, "width", /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px");
    			set_style(div, "height", /*height*/ ctx[2] * /*scale*/ ctx[4] + "px");
    			add_location(div, file, 15, 2, 870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*png*/ 1) {
    				set_style(div, "background-image", "url(" + /*png*/ ctx[0] + ")");
    			}

    			if (dirty & /*frameIndex, frameWidth, scale*/ 88) {
    				set_style(div, "background-position", /*frameIndex*/ ctx[6] * -/*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px top");
    			}

    			if (dirty & /*width, scale, height*/ 22) {
    				set_style(div, "background-size", /*width*/ ctx[1] * /*scale*/ ctx[4] + "px " + /*height*/ ctx[2] * /*scale*/ ctx[4] + "px");
    			}

    			if (dirty & /*frameWidth, scale*/ 24) {
    				set_style(div, "width", /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px");
    			}

    			if (dirty & /*height, scale*/ 20) {
    				set_style(div, "height", /*height*/ ctx[2] * /*scale*/ ctx[4] + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(15:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:1) {#if !simple}
    function create_if_block_1(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			set_style(div0, "background-repeat", "no-repeat");
    			set_style(div0, "background-image", "url(" + /*png*/ ctx[0] + ")");
    			set_style(div0, "background-position", /*width*/ ctx[1] * /*scale*/ ctx[4] - /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] * (/*frameIndex*/ ctx[6] + 1) + "px\r\n\t\t\t\ttop");
    			set_style(div0, "background-size", /*width*/ ctx[1] * /*scale*/ ctx[4] + "px " + /*height*/ ctx[2] * /*scale*/ ctx[4] + "px");
    			set_style(div0, "width", /*width*/ ctx[1] * /*scale*/ ctx[4] * 2 - /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px");
    			set_style(div0, "height", /*height*/ ctx[2] * /*scale*/ ctx[4] + "px");
    			add_location(div0, file, 8, 3, 311);
    			attr_dev(div1, "class", "animation-preview-cover svelte-zhpaz2");
    			set_style(div1, "left", "0");
    			set_style(div1, "width", /*width*/ ctx[1] * /*scale*/ ctx[4] - /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px");
    			add_location(div1, file, 11, 3, 619);
    			attr_dev(div2, "class", "animation-preview-cover svelte-zhpaz2");
    			set_style(div2, "left", /*width*/ ctx[1] * /*scale*/ ctx[4] + "px");
    			set_style(div2, "width", /*width*/ ctx[1] * /*scale*/ ctx[4] - /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px");
    			add_location(div2, file, 12, 3, 727);
    			attr_dev(div3, "class", "animation-preview-container svelte-zhpaz2");
    			add_location(div3, file, 7, 2, 265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*png*/ 1) {
    				set_style(div0, "background-image", "url(" + /*png*/ ctx[0] + ")");
    			}

    			if (dirty & /*width, scale, frameWidth, frameIndex*/ 90) {
    				set_style(div0, "background-position", /*width*/ ctx[1] * /*scale*/ ctx[4] - /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] * (/*frameIndex*/ ctx[6] + 1) + "px\r\n\t\t\t\ttop");
    			}

    			if (dirty & /*width, scale, height*/ 22) {
    				set_style(div0, "background-size", /*width*/ ctx[1] * /*scale*/ ctx[4] + "px " + /*height*/ ctx[2] * /*scale*/ ctx[4] + "px");
    			}

    			if (dirty & /*width, scale, frameWidth*/ 26) {
    				set_style(div0, "width", /*width*/ ctx[1] * /*scale*/ ctx[4] * 2 - /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px");
    			}

    			if (dirty & /*height, scale*/ 20) {
    				set_style(div0, "height", /*height*/ ctx[2] * /*scale*/ ctx[4] + "px");
    			}

    			if (dirty & /*width, scale, frameWidth*/ 26) {
    				set_style(div1, "width", /*width*/ ctx[1] * /*scale*/ ctx[4] - /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px");
    			}

    			if (dirty & /*width, scale*/ 18) {
    				set_style(div2, "left", /*width*/ ctx[1] * /*scale*/ ctx[4] + "px");
    			}

    			if (dirty & /*width, scale, frameWidth*/ 26) {
    				set_style(div2, "width", /*width*/ ctx[1] * /*scale*/ ctx[4] - /*frameWidth*/ ctx[3] * /*scale*/ ctx[4] + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(7:1) {#if !simple}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*png*/ ctx[0] != null && create_if_block$1(ctx);

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
    			if (/*png*/ ctx[0] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { png } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { frameWidth } = $$props;
    	let { frameRate } = $$props;
    	let { scale = 1 } = $$props;
    	let { yoyo } = $$props;
    	let { simple = false } = $$props;
    	let frameIndex = 0;
    	let frameDelta = 1;
    	let frame = 0;
    	let lastRequestedFrame;
    	animate();

    	function animate() {
    		lastRequestedFrame = window.requestAnimationFrame(() => {
    			$$invalidate(10, frame++, frame);
    			animate();
    		});
    	}

    	onDestroy(() => {
    		window.cancelAnimationFrame(lastRequestedFrame);
    	});

    	const writable_props = ["png", "width", "height", "frameWidth", "frameRate", "scale", "yoyo", "simple"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AnimationPreview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("AnimationPreview", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("png" in $$props) $$invalidate(0, png = $$props.png);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("frameWidth" in $$props) $$invalidate(3, frameWidth = $$props.frameWidth);
    		if ("frameRate" in $$props) $$invalidate(7, frameRate = $$props.frameRate);
    		if ("scale" in $$props) $$invalidate(4, scale = $$props.scale);
    		if ("yoyo" in $$props) $$invalidate(8, yoyo = $$props.yoyo);
    		if ("simple" in $$props) $$invalidate(5, simple = $$props.simple);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		debounce,
    		png,
    		width,
    		height,
    		frameWidth,
    		frameRate,
    		scale,
    		yoyo,
    		simple,
    		frameIndex,
    		frameDelta,
    		frame,
    		lastRequestedFrame,
    		animate,
    		numFrames
    	});

    	$$self.$inject_state = $$props => {
    		if ("png" in $$props) $$invalidate(0, png = $$props.png);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("frameWidth" in $$props) $$invalidate(3, frameWidth = $$props.frameWidth);
    		if ("frameRate" in $$props) $$invalidate(7, frameRate = $$props.frameRate);
    		if ("scale" in $$props) $$invalidate(4, scale = $$props.scale);
    		if ("yoyo" in $$props) $$invalidate(8, yoyo = $$props.yoyo);
    		if ("simple" in $$props) $$invalidate(5, simple = $$props.simple);
    		if ("frameIndex" in $$props) $$invalidate(6, frameIndex = $$props.frameIndex);
    		if ("frameDelta" in $$props) $$invalidate(9, frameDelta = $$props.frameDelta);
    		if ("frame" in $$props) $$invalidate(10, frame = $$props.frame);
    		if ("lastRequestedFrame" in $$props) lastRequestedFrame = $$props.lastRequestedFrame;
    		if ("numFrames" in $$props) $$invalidate(12, numFrames = $$props.numFrames);
    	};

    	let numFrames;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, frameWidth*/ 10) {
    			 $$invalidate(12, numFrames = width != null ? Math.ceil(width / frameWidth) : 0);
    		}

    		if ($$self.$$.dirty & /*png*/ 1) {
    			 if (png != null) {
    				$$invalidate(6, frameIndex = 0);
    				$$invalidate(9, frameDelta = 1);
    			}
    		}

    		if ($$self.$$.dirty & /*frame, frameRate, numFrames, yoyo, frameIndex, frameDelta*/ 6080) {
    			// change the graphic every 60 / frameRate frames
    			 if (frame > 60 / frameRate) {
    				if (numFrames > 1) {
    					if (yoyo) {
    						if (frameIndex == 0 && frameDelta == -1 || frameIndex == numFrames - 1 && frameDelta == 1) $$invalidate(9, frameDelta *= -1);
    						$$invalidate(6, frameIndex += frameDelta);
    					} else {
    						$$invalidate(6, frameIndex = frameIndex >= numFrames - 1 ? 0 : frameIndex + 1);
    					}
    				} else {
    					$$invalidate(6, frameIndex = 0);
    				}

    				$$invalidate(10, frame = 0);
    			}
    		}
    	};

    	return [png, width, height, frameWidth, scale, simple, frameIndex, frameRate, yoyo];
    }

    class AnimationPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			png: 0,
    			width: 1,
    			height: 2,
    			frameWidth: 3,
    			frameRate: 7,
    			scale: 4,
    			yoyo: 8,
    			simple: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnimationPreview",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*png*/ ctx[0] === undefined && !("png" in props)) {
    			console.warn("<AnimationPreview> was created without expected prop 'png'");
    		}

    		if (/*width*/ ctx[1] === undefined && !("width" in props)) {
    			console.warn("<AnimationPreview> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !("height" in props)) {
    			console.warn("<AnimationPreview> was created without expected prop 'height'");
    		}

    		if (/*frameWidth*/ ctx[3] === undefined && !("frameWidth" in props)) {
    			console.warn("<AnimationPreview> was created without expected prop 'frameWidth'");
    		}

    		if (/*frameRate*/ ctx[7] === undefined && !("frameRate" in props)) {
    			console.warn("<AnimationPreview> was created without expected prop 'frameRate'");
    		}

    		if (/*yoyo*/ ctx[8] === undefined && !("yoyo" in props)) {
    			console.warn("<AnimationPreview> was created without expected prop 'yoyo'");
    		}
    	}

    	get png() {
    		throw new Error("<AnimationPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set png(value) {
    		throw new Error("<AnimationPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<AnimationPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<AnimationPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<AnimationPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<AnimationPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get frameWidth() {
    		throw new Error("<AnimationPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set frameWidth(value) {
    		throw new Error("<AnimationPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get frameRate() {
    		throw new Error("<AnimationPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set frameRate(value) {
    		throw new Error("<AnimationPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<AnimationPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<AnimationPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yoyo() {
    		throw new Error("<AnimationPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yoyo(value) {
    		throw new Error("<AnimationPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get simple() {
    		throw new Error("<AnimationPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set simple(value) {
    		throw new Error("<AnimationPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var autoSaveStore = LocalStorageStore('auto-saves', {});

    const { subscribe: subscribe$2, set: set$1 } = writable(null);

    let $projects;
    projects.subscribe(value => {
    	$projects = value;
    });

    var project = {
    	subscribe: subscribe$2,
    	set: value => {
    		set$1(value);
    		if (value != null) {
    			projects.set($projects.some(p => p.name == value.name) ? $projects.map(p => (p.name == value.name ? value : p)) : [...$projects, value]);
    		}
    	},
    };

    /* src\components\Art.svelte generated by Svelte v3.24.1 */
    const file$1 = "src\\components\\Art.svelte";

    // (1:0) {#if graphic != null && graphic.png != null}
    function create_if_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*graphic*/ ctx[2].animated) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(1:0) {#if graphic != null && graphic.png != null}",
    		ctx
    	});

    	return block;
    }

    // (6:1) {:else}
    function create_else_block$2(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*graphic*/ ctx[2].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*graphic*/ ctx[2].name);
    			attr_dev(img, "title", img_title_value = /*graphic*/ ctx[2].name);
    			set_style(img, "transform", "rotate(" + /*spin*/ ctx[0] + "deg)");
    			set_style(img, "width", /*graphic*/ ctx[2].width * /*scale*/ ctx[1] + "px");
    			set_style(img, "height", /*graphic*/ ctx[2].height * /*scale*/ ctx[1] + "px");
    			add_location(img, file$1, 6, 2, 176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*graphic*/ 4 && img.src !== (img_src_value = /*graphic*/ ctx[2].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*graphic*/ 4 && img_alt_value !== (img_alt_value = /*graphic*/ ctx[2].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*graphic*/ 4 && img_title_value !== (img_title_value = /*graphic*/ ctx[2].name)) {
    				attr_dev(img, "title", img_title_value);
    			}

    			if (dirty & /*spin*/ 1) {
    				set_style(img, "transform", "rotate(" + /*spin*/ ctx[0] + "deg)");
    			}

    			if (dirty & /*graphic, scale*/ 6) {
    				set_style(img, "width", /*graphic*/ ctx[2].width * /*scale*/ ctx[1] + "px");
    			}

    			if (dirty & /*graphic, scale*/ 6) {
    				set_style(img, "height", /*graphic*/ ctx[2].height * /*scale*/ ctx[1] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(6:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (2:1) {#if graphic.animated}
    function create_if_block_1$1(ctx) {
    	let div;
    	let animationpreview;
    	let current;
    	const animationpreview_spread_levels = [/*graphic*/ ctx[2], { simple: true }, { scale: /*scale*/ ctx[1] }];
    	let animationpreview_props = {};

    	for (let i = 0; i < animationpreview_spread_levels.length; i += 1) {
    		animationpreview_props = assign(animationpreview_props, animationpreview_spread_levels[i]);
    	}

    	animationpreview = new AnimationPreview({
    			props: animationpreview_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(animationpreview.$$.fragment);
    			attr_dev(div, "class", "inline-block");
    			add_location(div, file$1, 2, 2, 73);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(animationpreview, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const animationpreview_changes = (dirty & /*graphic, scale*/ 6)
    			? get_spread_update(animationpreview_spread_levels, [
    					dirty & /*graphic*/ 4 && get_spread_object(/*graphic*/ ctx[2]),
    					animationpreview_spread_levels[1],
    					dirty & /*scale*/ 2 && { scale: /*scale*/ ctx[1] }
    				])
    			: {};

    			animationpreview.$set(animationpreview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(animationpreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(animationpreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(animationpreview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(2:1) {#if graphic.animated}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*graphic*/ ctx[2] != null && /*graphic*/ ctx[2].png != null && create_if_block$2(ctx);

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
    			if (/*graphic*/ ctx[2] != null && /*graphic*/ ctx[2].png != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*graphic*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(4, $project = $$value));
    	let { name } = $$props;
    	let { spin = 0 } = $$props;
    	let { scale = 1 } = $$props;
    	let graphic;
    	const writable_props = ["name", "spin", "scale"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Art> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Art", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(3, name = $$props.name);
    		if ("spin" in $$props) $$invalidate(0, spin = $$props.spin);
    		if ("scale" in $$props) $$invalidate(1, scale = $$props.scale);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		project,
    		AnimationPreview,
    		name,
    		spin,
    		scale,
    		graphic,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(3, name = $$props.name);
    		if ("spin" in $$props) $$invalidate(0, spin = $$props.spin);
    		if ("scale" in $$props) $$invalidate(1, scale = $$props.scale);
    		if ("graphic" in $$props) $$invalidate(2, graphic = $$props.graphic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name, $project*/ 24) {
    			 if (name != null) $$invalidate(2, graphic = $project.art[name]);
    		}
    	};

    	return [spin, scale, graphic, name];
    }

    class Art extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 3, spin: 0, scale: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Art",
    			options,
    			id: create_fragment$2.name
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

    	get spin() {
    		throw new Error("<Art>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Art>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Art>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Art>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\BuildLayout.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$1 } = globals;
    const file$2 = "src\\components\\BuildLayout.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (5:3) {#if t.name == tab}
    function create_if_block$3(ctx) {
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
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
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
    			attr_dev(a, "href", a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[9].name + "/new"));
    			attr_dev(a, "class", "sub-nav-item svelte-yznt1k");
    			toggle_class(a, "new", /*store*/ ctx[2][/*activeName*/ ctx[1]] == null);
    			add_location(a, file$2, 6, 5, 245);
    			attr_dev(div, "class", "sub-nav svelte-yznt1k");
    			add_location(div, file$2, 5, 4, 217);
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
    			if (!current || dirty & /*baseUrl*/ 8 && a_href_value !== (a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[9].name + "/new"))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*store, activeName*/ 6) {
    				toggle_class(a, "new", /*store*/ ctx[2][/*activeName*/ ctx[1]] == null);
    			}

    			if (dirty & /*baseUrl, tabs, Object, store, activeName, tab, getGraphic*/ 63) {
    				each_value_1 = Object.keys(/*store*/ ctx[2]).sort();
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(5:3) {#if t.name == tab}",
    		ctx
    	});

    	return block;
    }

    // (10:7) {#if tab != 'levels'}
    function create_if_block_2(ctx) {
    	let art;
    	let current;

    	art = new Art({
    			props: {
    				name: /*tab*/ ctx[0] == "art"
    				? /*name*/ ctx[12]
    				: /*getGraphic*/ ctx[5](/*name*/ ctx[12], /*t*/ ctx[9].graphicKey),
    				scale: 1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(art.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(art, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const art_changes = {};

    			if (dirty & /*tab, store*/ 5) art_changes.name = /*tab*/ ctx[0] == "art"
    			? /*name*/ ctx[12]
    			: /*getGraphic*/ ctx[5](/*name*/ ctx[12], /*t*/ ctx[9].graphicKey);

    			art.$set(art_changes);
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(10:7) {#if tab != 'levels'}",
    		ctx
    	});

    	return block;
    }

    // (17:9) {#if tab == 'levels'}
    function create_if_block_1$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*store*/ ctx[2][/*name*/ ctx[12]].thumbnail)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "level-thumbnail");
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 17, 10, 748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*store*/ 4 && img.src !== (img_src_value = /*store*/ ctx[2][/*name*/ ctx[12]].thumbnail)) {
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
    		source: "(17:9) {#if tab == 'levels'}",
    		ctx
    	});

    	return block;
    }

    // (8:5) {#each Object.keys(store).sort() as name}
    function create_each_block_1(ctx) {
    	let a;
    	let t0;
    	let div1;
    	let span;
    	let t1_value = /*name*/ ctx[12] + "";
    	let t1;
    	let t2;
    	let div0;
    	let a_href_value;
    	let current;
    	let if_block0 = /*tab*/ ctx[0] != "levels" && create_if_block_2(ctx);
    	let if_block1 = /*tab*/ ctx[0] == "levels" && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			add_location(span, file$2, 13, 8, 668);
    			add_location(div0, file$2, 15, 8, 699);
    			attr_dev(div1, "class", "flex-column");
    			add_location(div1, file$2, 12, 7, 633);
    			attr_dev(a, "class", "sub-nav-item svelte-yznt1k");
    			attr_dev(a, "href", a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[9].name + "/" + /*name*/ ctx[12]));
    			toggle_class(a, "active", /*activeName*/ ctx[1] == /*name*/ ctx[12]);
    			add_location(a, file$2, 8, 6, 402);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if (if_block0) if_block0.m(a, null);
    			append_dev(a, t0);
    			append_dev(a, div1);
    			append_dev(div1, span);
    			append_dev(span, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			if (if_block1) if_block1.m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*tab*/ ctx[0] != "levels") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*tab*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(a, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*store*/ 4) && t1_value !== (t1_value = /*name*/ ctx[12] + "")) set_data_dev(t1, t1_value);

    			if (/*tab*/ ctx[0] == "levels") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*baseUrl, store*/ 12 && a_href_value !== (a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[9].name + "/" + /*name*/ ctx[12]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*activeName, Object, store*/ 6) {
    				toggle_class(a, "active", /*activeName*/ ctx[1] == /*name*/ ctx[12]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(8:5) {#each Object.keys(store).sort() as name}",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#each tabs as t}
    function create_each_block(ctx) {
    	let a;
    	let t0_value = /*t*/ ctx[9].name + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let if_block = /*t*/ ctx[9].name == /*tab*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(a, "class", "sub-nav-item svelte-yznt1k");
    			attr_dev(a, "href", a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[9].name + "/new"));
    			toggle_class(a, "active", /*tab*/ ctx[0] == /*t*/ ctx[9].name);
    			add_location(a, file$2, 3, 3, 92);
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
    			if (!current || dirty & /*baseUrl*/ 8 && a_href_value !== (a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[9].name + "/new"))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*tab, tabs*/ 17) {
    				toggle_class(a, "active", /*tab*/ ctx[0] == /*t*/ ctx[9].name);
    			}

    			if (/*t*/ ctx[9].name == /*tab*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*tab*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(3:2) {#each tabs as t}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	let each_value = /*tabs*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

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
    			attr_dev(div0, "class", "sub-nav nav-container svelte-yznt1k");
    			add_location(div0, file$2, 1, 1, 31);
    			attr_dev(div1, "class", "content-container svelte-yznt1k");
    			add_location(div1, file$2, 27, 1, 932);
    			attr_dev(div2, "class", "flex align-top");
    			add_location(div2, file$2, 0, 0, 0);
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
    			if (dirty & /*Object, store, baseUrl, tabs, activeName, tab, getGraphic*/ 63) {
    				each_value = /*tabs*/ ctx[4];
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
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(8, $project = $$value));
    	let { tab } = $$props;
    	let { activeName } = $$props;
    	let { store } = $$props;

    	const tabs = [
    		{ name: "art" },
    		{ name: "blocks", graphicKey: "graphic" },
    		{
    			name: "characters",
    			graphicKey: "graphics.still"
    		},
    		{
    			name: "enemies",
    			graphicKey: "graphics.still"
    		},
    		{ name: "levels", graphicKey: null }
    	];

    	function getGraphic(name, key) {
    		let item = store[name];

    		key.split(".").forEach(p => {
    			item = item[p];
    		});

    		return item;
    	}

    	const writable_props = ["tab", "activeName", "store"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BuildLayout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BuildLayout", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("tab" in $$props) $$invalidate(0, tab = $$props.tab);
    		if ("activeName" in $$props) $$invalidate(1, activeName = $$props.activeName);
    		if ("store" in $$props) $$invalidate(2, store = $$props.store);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Art,
    		project,
    		tab,
    		activeName,
    		store,
    		tabs,
    		getGraphic,
    		baseUrl,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("tab" in $$props) $$invalidate(0, tab = $$props.tab);
    		if ("activeName" in $$props) $$invalidate(1, activeName = $$props.activeName);
    		if ("store" in $$props) $$invalidate(2, store = $$props.store);
    		if ("baseUrl" in $$props) $$invalidate(3, baseUrl = $$props.baseUrl);
    	};

    	let baseUrl;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$project*/ 256) {
    			 $$invalidate(3, baseUrl = `#/${$project.name}/build`);
    		}
    	};

    	return [tab, activeName, store, baseUrl, tabs, getGraphic, $$scope, $$slots];
    }

    class BuildLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { tab: 0, activeName: 1, store: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BuildLayout",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tab*/ ctx[0] === undefined && !("tab" in props)) {
    			console.warn("<BuildLayout> was created without expected prop 'tab'");
    		}

    		if (/*activeName*/ ctx[1] === undefined && !("activeName" in props)) {
    			console.warn("<BuildLayout> was created without expected prop 'activeName'");
    		}

    		if (/*store*/ ctx[2] === undefined && !("store" in props)) {
    			console.warn("<BuildLayout> was created without expected prop 'store'");
    		}
    	}

    	get tab() {
    		throw new Error("<BuildLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error("<BuildLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeName() {
    		throw new Error("<BuildLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeName(value) {
    		throw new Error("<BuildLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get store() {
    		throw new Error("<BuildLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set store(value) {
    		throw new Error("<BuildLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome\components\svg\Path.svelte generated by Svelte v3.24.1 */

    const file$3 = "node_modules\\svelte-awesome\\components\\svg\\Path.svelte";

    function create_fragment$4(ctx) {
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
    			add_location(path, file$3, 0, 0, 0);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Path",
    			options,
    			id: create_fragment$4.name
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

    const file$4 = "node_modules\\svelte-awesome\\components\\svg\\Polygon.svelte";

    function create_fragment$5(ctx) {
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
    			add_location(polygon, file$4, 0, 0, 0);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Polygon",
    			options,
    			id: create_fragment$5.name
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

    const file$5 = "node_modules\\svelte-awesome\\components\\svg\\Raw.svelte";

    function create_fragment$6(ctx) {
    	let g;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			add_location(g, file$5, 0, 0, 0);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Raw",
    			options,
    			id: create_fragment$6.name
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

    const file$6 = "node_modules\\svelte-awesome\\components\\svg\\Svg.svelte";

    function create_fragment$7(ctx) {
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
    			add_location(svg, file$6, 0, 0, 0);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
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
    			id: create_fragment$7.name
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

    const { Object: Object_1$2, console: console_1$1 } = globals;

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    // (4:4) {#if self}
    function create_if_block$4(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*self*/ ctx[0].paths && create_if_block_3(ctx);
    	let if_block1 = /*self*/ ctx[0].polygons && create_if_block_2$1(ctx);
    	let if_block2 = /*self*/ ctx[0].raw && create_if_block_1$3(ctx);

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
    					if_block1 = create_if_block_2$1(ctx);
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
    					if_block2 = create_if_block_1$3(ctx);
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
    		id: create_if_block$4.name,
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
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
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
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
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
    function create_each_block_1$1(ctx) {
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
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(6:8) {#each self.paths as path, i}",
    		ctx
    	});

    	return block;
    }

    // (10:6) {#if self.polygons}
    function create_if_block_2$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*self*/ ctx[0].polygons;
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(10:6) {#if self.polygons}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each self.polygons as polygon, i}
    function create_each_block$1(ctx) {
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(11:8) {#each self.polygons as polygon, i}",
    		ctx
    	});

    	return block;
    }

    // (15:6) {#if self.raw}
    function create_if_block_1$3(ctx) {
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
    		id: create_if_block_1$3.name,
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
    	let if_block = /*self*/ ctx[0] && create_if_block$4(ctx);

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
    					if_block = create_if_block$4(ctx);
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

    function create_fragment$8(ctx) {
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
    		id: create_fragment$8.name,
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

    function instance$8($$self, $$props, $$invalidate) {
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

    	Object_1$2.keys($$props).forEach(key => {
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
    			instance$8,
    			create_fragment$8,
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
    			id: create_fragment$8.name
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

    /* src\components\QuickDropdown.svelte generated by Svelte v3.24.1 */
    const file$7 = "src\\components\\QuickDropdown.svelte";
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (15:3) {#if label != null}
    function create_if_block_2$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			add_location(span, file$7, 15, 4, 409);
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
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(15:3) {#if label != null}",
    		ctx
    	});

    	return block;
    }

    // (14:21)      
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*label*/ ctx[6] != null && create_if_block_2$2(ctx);

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
    					if_block = create_if_block_2$2(ctx);
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
    function create_if_block_1$4(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { data: caretDownIcon },
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(21:2) {#if !noCaret}",
    		ctx
    	});

    	return block;
    }

    // (25:1) {#if isOpen}
    function create_if_block$5(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "quick-dropdown-menu " + /*dropdownClass*/ ctx[3] + " svelte-wxmkik");
    			add_location(div, file$7, 25, 2, 556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[21](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*closeIfAnyClickCloses*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, null, null);
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
    			/*div_binding*/ ctx[21](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(25:1) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let a;
    	let t0;
    	let a_class_value;
    	let t1;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const label_slot_template = /*$$slots*/ ctx[19].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[18], get_label_slot_context);
    	const label_slot_or_fallback = label_slot || fallback_block$1(ctx);
    	let if_block0 = !/*noCaret*/ ctx[4] && create_if_block_1$4(ctx);
    	let if_block1 = /*isOpen*/ ctx[0] && create_if_block$5(ctx);

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
    			add_location(a, file$7, 1, 1, 92);
    			attr_dev(div, "class", div_class_value = "quick-dropdown " + /*className*/ ctx[9] + " svelte-wxmkik");
    			attr_dev(div, "data-test", /*dataTest*/ ctx[1]);
    			add_location(div, file$7, 0, 0, 0);
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
    			/*a_binding*/ ctx[20](a);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding_1*/ ctx[22](div);
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
    				if (label_slot.p && dirty & /*$$scope*/ 262144) {
    					update_slot(label_slot, label_slot_template, ctx, /*$$scope*/ ctx[18], dirty, get_label_slot_changes, get_label_slot_context);
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
    					if_block0 = create_if_block_1$4(ctx);
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
    					if_block1 = create_if_block$5(ctx);
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
    			/*a_binding*/ ctx[20](null);
    			if (if_block1) if_block1.d();
    			/*div_binding_1*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
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

    const tabindex = 0;

    function instance$9($$self, $$props, $$invalidate) {
    	let { isOpen = false } = $$props;
    	let { dataTest = null } = $$props;
    	let { btnClass = "btn btn-light btn-sm" } = $$props;
    	let { dropdownClass = "below left" } = $$props;
    	let { anyItemClickCloses = false } = $$props;
    	let { noCaret = false } = $$props;
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
    		"isOpen",
    		"dataTest",
    		"btnClass",
    		"dropdownClass",
    		"anyItemClickCloses",
    		"noCaret",
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
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("dataTest" in $$props) $$invalidate(1, dataTest = $$props.dataTest);
    		if ("btnClass" in $$props) $$invalidate(2, btnClass = $$props.btnClass);
    		if ("dropdownClass" in $$props) $$invalidate(3, dropdownClass = $$props.dropdownClass);
    		if ("anyItemClickCloses" in $$props) $$invalidate(16, anyItemClickCloses = $$props.anyItemClickCloses);
    		if ("noCaret" in $$props) $$invalidate(4, noCaret = $$props.noCaret);
    		if ("autofocusFirstItem" in $$props) $$invalidate(17, autofocusFirstItem = $$props.autofocusFirstItem);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("id" in $$props) $$invalidate(7, id = $$props.id);
    		if ("invalid" in $$props) $$invalidate(8, invalid = $$props.invalid);
    		if ("class" in $$props) $$invalidate(9, className = $$props.class);
    		if ("$$scope" in $$props) $$invalidate(18, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		Icon,
    		caretDownIcon,
    		isOpen,
    		dataTest,
    		btnClass,
    		dropdownClass,
    		anyItemClickCloses,
    		noCaret,
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
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("dataTest" in $$props) $$invalidate(1, dataTest = $$props.dataTest);
    		if ("btnClass" in $$props) $$invalidate(2, btnClass = $$props.btnClass);
    		if ("dropdownClass" in $$props) $$invalidate(3, dropdownClass = $$props.dropdownClass);
    		if ("anyItemClickCloses" in $$props) $$invalidate(16, anyItemClickCloses = $$props.anyItemClickCloses);
    		if ("noCaret" in $$props) $$invalidate(4, noCaret = $$props.noCaret);
    		if ("autofocusFirstItem" in $$props) $$invalidate(17, autofocusFirstItem = $$props.autofocusFirstItem);
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
    		anyItemClickCloses,
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

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			isOpen: 0,
    			dataTest: 1,
    			btnClass: 2,
    			dropdownClass: 3,
    			anyItemClickCloses: 16,
    			noCaret: 4,
    			autofocusFirstItem: 17,
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
    			id: create_fragment$9.name
    		});
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

    const { console: console_1$2 } = globals;
    const file$8 = "src\\components\\ColorPicker.svelte";

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (2:1) <span slot="label">
    function create_label_slot(ctx) {
    	let span;
    	let div;

    	const block = {
    		c: function create() {
    			span = element("span");
    			div = element("div");
    			attr_dev(div, "class", "color-choice svelte-1tel1fa");
    			set_style(div, "background", getBackground(/*value*/ ctx[0]));
    			attr_dev(div, "title", "Change color");
    			add_location(div, file$8, 2, 2, 92);
    			attr_dev(span, "slot", "label");
    			add_location(span, file$8, 1, 1, 69);
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
    		source: "(2:1) <span slot=\\\"label\\\">",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each colorGroup as color}
    function create_each_block_1$2(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[5](/*color*/ ctx[13], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "color-choice svelte-1tel1fa");
    			set_style(div, "background", getBackground(/*color*/ ctx[13]));
    			set_style(div, "width", /*colorSize*/ ctx[4] + "px");
    			set_style(div, "height", /*colorSize*/ ctx[4] + "px");
    			toggle_class(div, "selected", /*value*/ ctx[0] == /*color*/ ctx[13]);
    			add_location(div, file$8, 8, 5, 333);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*colors*/ 4) {
    				set_style(div, "background", getBackground(/*color*/ ctx[13]));
    			}

    			if (dirty & /*value, colors*/ 5) {
    				toggle_class(div, "selected", /*value*/ ctx[0] == /*color*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(8:4) {#each colorGroup as color}",
    		ctx
    	});

    	return block;
    }

    // (6:2) {#each colors as colorGroup}
    function create_each_block$2(ctx) {
    	let div;
    	let t;
    	let each_value_1 = /*colorGroup*/ ctx[10];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "color-group svelte-1tel1fa");
    			add_location(div, file$8, 6, 3, 268);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*getBackground, colors, colorSize, value, select*/ 29) {
    				each_value_1 = /*colorGroup*/ ctx[10];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(6:2) {#each colors as colorGroup}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <QuickDropdown btnClass="color-picker-toggle" noCaret bind:isOpen>
    function create_default_slot$1(ctx) {
    	let t;
    	let div;
    	let each_value = /*colors*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "color-picker-choices svelte-1tel1fa");
    			add_location(div, file$8, 4, 1, 197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colors, getBackground, colorSize, value, select*/ 29) {
    				each_value = /*colors*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
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
    		source: "(1:0) <QuickDropdown btnClass=\\\"color-picker-toggle\\\" noCaret bind:isOpen>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let quickdropdown;
    	let updating_isOpen;
    	let current;

    	function quickdropdown_isOpen_binding(value) {
    		/*quickdropdown_isOpen_binding*/ ctx[6].call(null, value);
    	}

    	let quickdropdown_props = {
    		btnClass: "color-picker-toggle",
    		noCaret: true,
    		$$slots: {
    			default: [create_default_slot$1],
    			label: [create_label_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*isOpen*/ ctx[1] !== void 0) {
    		quickdropdown_props.isOpen = /*isOpen*/ ctx[1];
    	}

    	quickdropdown = new QuickDropdown({
    			props: quickdropdown_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(quickdropdown, "isOpen", quickdropdown_isOpen_binding));

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

    			if (dirty & /*$$scope, colors, value*/ 65541) {
    				quickdropdown_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_isOpen && dirty & /*isOpen*/ 2) {
    				updating_isOpen = true;
    				quickdropdown_changes.isOpen = /*isOpen*/ ctx[1];
    				add_flush_callback(() => updating_isOpen = false);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const colorSteps = 10;
    const colorDarknessSteps = 25;

    function getBackground(color) {
    	return color != "transparent"
    	? color
    	: "repeating-linear-gradient(-45deg, transparent, #eee 10px)";
    }

    function rgb(r, g, b) {
    	return { r, g, b };
    }

    function lerpColorsBetween(color1, color2, steps) {
    	return [...Array(steps)].map((_, t) => lerpRGB(color1, color2, t / (steps - 1)));
    }

    function lerpRGB(color1, color2, t) {
    	return {
    		r: Math.round(color1.r + (color2.r - color1.r) * t),
    		g: Math.round(color1.g + (color2.g - color1.g) * t),
    		b: Math.round(color1.b + (color2.b - color1.b) * t)
    	};
    }

    function lighten(color, t) {
    	return {
    		r: Math.min(Math.round(color.r + (255 - color.r) * t), 255),
    		g: Math.min(Math.round(color.g + (255 - color.g) * t), 255),
    		b: Math.min(Math.round(color.b + (255 - color.b) * t), 255)
    	};
    }

    function darken(color, t) {
    	return {
    		r: Math.max(Math.round(color.r - 255 * (1 - t)), 0),
    		g: Math.max(Math.round(color.g - 255 * (1 - t)), 0),
    		b: Math.max(Math.round(color.b - 255 * (1 - t)), 0)
    	};
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { value = "transparent" } = $$props;
    	let alpha = 255;
    	let isOpen = false;

    	function select(color) {
    		console.log(color);
    		$$invalidate(0, value = color);
    		dispatch("change", color);
    		$$invalidate(1, isOpen = false);
    	}

    	const rainbowIntervals = [
    		rgb(255, 0, 0),
    		rgb(255, 255, 0),
    		rgb(0, 255, 0),
    		rgb(0, 255, 255),
    		rgb(0, 0, 255),
    		rgb(255, 0, 255)
    	];

    	const colorSize = 600 / colorSteps / rainbowIntervals.length;
    	let colors = [];
    	const writable_props = ["value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<ColorPicker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ColorPicker", $$slots, []);
    	const click_handler = color => select(color);

    	function quickdropdown_isOpen_binding(value) {
    		isOpen = value;
    		$$invalidate(1, isOpen);
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		QuickDropdown,
    		createEventDispatcher,
    		dispatch,
    		value,
    		alpha,
    		isOpen,
    		select,
    		getBackground,
    		colorSteps,
    		colorDarknessSteps,
    		rainbowIntervals,
    		colorSize,
    		colors,
    		rgb,
    		lerpColorsBetween,
    		lerpRGB,
    		lighten,
    		darken
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("alpha" in $$props) $$invalidate(8, alpha = $$props.alpha);
    		if ("isOpen" in $$props) $$invalidate(1, isOpen = $$props.isOpen);
    		if ("colors" in $$props) $$invalidate(2, colors = $$props.colors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 if (alpha != null) $$invalidate(2, colors = (function () {
    		let result = [];
    		let rainbow = [];

    		for (let i = 0; i < rainbowIntervals.length; i++) {
    			rainbow = rainbow.concat(lerpColorsBetween(
    				rainbowIntervals[i],
    				i == rainbowIntervals.length - 1
    				? rainbowIntervals[0]
    				: rainbowIntervals[i + 1],
    				colorSteps
    			).slice(0, colorSteps - 1));
    		}

    		let blackToGreySteps = rainbowIntervals.length * (colorSteps - 1);
    		result.push(lerpColorsBetween(rgb(255, 255, 255), rgb(0, 0, 0), blackToGreySteps));
    		for (let i = 1; i < colorDarknessSteps; i++) result.push(rainbow.map(r => darken(r, i / (colorDarknessSteps - 1))));
    		for (let i = 1; i < colorDarknessSteps - 1; i++) result.push(rainbow.map(r => lighten(r, i / (colorDarknessSteps - 1))));
    		return result.map(group => group.map(c => `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`));
    	})());

    	return [
    		value,
    		isOpen,
    		colors,
    		select,
    		colorSize,
    		click_handler,
    		quickdropdown_isOpen_binding
    	];
    }

    class ColorPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorPicker",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get value() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldNumber.svelte generated by Svelte v3.24.1 */

    const file$9 = "src\\components\\FieldNumber.svelte";

    function create_fragment$b(ctx) {
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
    			add_location(label, file$9, 1, 1, 27);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", /*min*/ ctx[2]);
    			attr_dev(input, "max", /*max*/ ctx[3]);
    			attr_dev(input, "step", /*step*/ ctx[4]);
    			attr_dev(input, "class", "form-control");
    			add_location(input, file$9, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$9, 0, 0, 0);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
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
    			id: create_fragment$b.name
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

    /* src\components\FieldText.svelte generated by Svelte v3.24.1 */
    const file$a = "src\\components\\FieldText.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let label;
    	let t;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			if (default_slot) default_slot.c();
    			t = space();
    			input = element("input");
    			attr_dev(label, "for", /*name*/ ctx[1]);
    			add_location(label, file$a, 1, 1, 27);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			add_location(input, file$a, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$a, 0, 0, 0);
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
    			/*input_binding*/ ctx[6](input);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
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
    			/*input_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
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

    function instance$c($$self, $$props, $$invalidate) {
    	let { value = null } = $$props;
    	let { name = "text" } = $$props;
    	let field;
    	const writable_props = ["value", "name"];

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
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, value, name, field });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("field" in $$props) $$invalidate(2, field = $$props.field);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, name, field, $$scope, $$slots, input_input_handler, input_binding];
    }

    class FieldText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { value: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldText",
    			options,
    			id: create_fragment$c.name
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
    }

    /* src\components\SaveBtn.svelte generated by Svelte v3.24.1 */

    const file$b = "src\\components\\SaveBtn.svelte";

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

    function create_fragment$d(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", button_class_value = "btn btn-" + (/*disabled*/ ctx[0] ? "disabled" : "success"));
    			toggle_class(button, "disabled", /*disabled*/ ctx[0]);
    			add_location(button, file$b, 0, 0, 0);
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

    			if (!current || dirty & /*disabled*/ 1 && button_class_value !== (button_class_value = "btn btn-" + (/*disabled*/ ctx[0] ? "disabled" : "success"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*disabled, disabled*/ 1) {
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { disabled: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SaveBtn",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get disabled() {
    		throw new Error("<SaveBtn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<SaveBtn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Form.svelte generated by Svelte v3.24.1 */
    const file$c = "src\\components\\Form.svelte";
    const get_buttons_slot_changes = dirty => ({});
    const get_buttons_slot_context = ctx => ({});

    function create_fragment$e(ctx) {
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
    			add_location(div0, file$c, 2, 2, 56);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file$c, 6, 2, 167);
    			attr_dev(div2, "class", "card");
    			add_location(div2, file$c, 1, 1, 34);
    			add_location(form, file$c, 0, 0, 0);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { hasChanges: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get hasChanges() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasChanges(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    /* src\components\InputSelect.svelte generated by Svelte v3.24.1 */
    const file$d = "src\\components\\InputSelect.svelte";

    const get_default_slot_changes_2 = dirty => ({
    	option: dirty[0] & /*filteredOptions*/ 65536
    });

    const get_default_slot_context_2 = ctx => ({ option: /*option*/ ctx[40] });

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    const get_default_slot_changes_1 = dirty => ({
    	option: dirty[0] & /*selectedOptions*/ 131072
    });

    const get_default_slot_context_1 = ctx => ({ option: /*option*/ ctx[40] });

    const get_default_slot_changes = dirty => ({
    	option: dirty[0] & /*selectedOptions*/ 131072
    });

    const get_default_slot_context = ctx => ({ option: /*option*/ ctx[40] });

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
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
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], get_default_slot_context_1);
    	const default_slot_or_fallback = default_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(span, "class", "select-input-text svelte-184xj1x");
    			add_location(span, file$d, 22, 5, 758);
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
    				if (default_slot.p && dirty[0] & /*$$scope, selectedOptions*/ 33685504) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[25], dirty, get_default_slot_changes_1, get_default_slot_context_1);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*selectedOptions*/ 131072) {
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
    	let if_block = /*index*/ ctx[42] > 0 && create_if_block_5(ctx);
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(span, "class", "select-input-text svelte-184xj1x");
    			add_location(span, file$d, 16, 5, 625);
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
    			if (/*index*/ ctx[42] > 0) {
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
    				if (default_slot.p && dirty[0] & /*$$scope, selectedOptions*/ 33685504) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[25], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*selectedOptions*/ 131072) {
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
    	let raw_value = /*option*/ ctx[40].label + "";
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
    			if (dirty[0] & /*selectedOptions*/ 131072 && raw_value !== (raw_value = /*option*/ ctx[40].label + "")) html_tag.p(raw_value);
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

    	let t1_value = (/*inline*/ ctx[9] && /*index*/ ctx[42] == /*selectedOptions*/ ctx[17].length - 1
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
    			if (dirty[0] & /*inline, selectedOptions*/ 131584 && t1_value !== (t1_value = (/*inline*/ ctx[9] && /*index*/ ctx[42] == /*selectedOptions*/ ctx[17].length - 1
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
    	let raw_value = /*option*/ ctx[40].label + "";
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
    			if (dirty[0] & /*selectedOptions*/ 131072 && raw_value !== (raw_value = /*option*/ ctx[40].label + "")) html_tag.p(raw_value);
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
    			attr_dev(span, "class", "select-input-text svelte-184xj1x");
    			add_location(span, file$d, 30, 4, 966);
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
    function create_if_block$6(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block = /*filterable*/ ctx[6] && create_if_block_2$3(ctx);
    	let each_value = /*filteredOptions*/ ctx[16];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$3(ctx);
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

    			attr_dev(div, "class", "select-dropdown svelte-184xj1x");
    			toggle_class(div, "right", /*right*/ ctx[11]);
    			add_location(div, file$d, 39, 2, 1196);
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
    					if_block = create_if_block_2$3(ctx);
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

    			if (dirty[0] & /*filteredOptions, viewIndex, toggle, $$scope, filter*/ 33914882) {
    				each_value = /*filteredOptions*/ ctx[16];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    					each_1_else = create_else_block$3(ctx);
    					each_1_else.c();
    					each_1_else.m(div, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}

    			if (dirty[0] & /*right*/ 2048) {
    				toggle_class(div, "right", /*right*/ ctx[11]);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(39:1) {#if isOpen && !disabled}",
    		ctx
    	});

    	return block;
    }

    // (41:3) {#if filterable}
    function create_if_block_2$3(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t;
    	let a;
    	let span;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { data: deleteIcon, class: "fw" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t = space();
    			a = element("a");
    			span = element("span");
    			create_component(icon.$$.fragment);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", /*filterPlaceholder*/ ctx[12]);
    			add_location(input, file$d, 43, 6, 1324);
    			attr_dev(span, "class", "input-group-text");
    			add_location(span, file$d, 45, 7, 1559);
    			attr_dev(a, "class", "input-group-append");
    			attr_dev(a, "href", "/");
    			attr_dev(a, "tabindex", "-1");
    			add_location(a, file$d, 44, 6, 1451);
    			attr_dev(div0, "class", "input-group");
    			add_location(div0, file$d, 42, 5, 1291);
    			attr_dev(div1, "class", "filter svelte-184xj1x");
    			add_location(div1, file$d, 41, 4, 1264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*filter*/ ctx[1]);
    			append_dev(div0, t);
    			append_dev(div0, a);
    			append_dev(a, span);
    			mount_component(icon, span, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[28]),
    					listen_dev(input, "keydown", /*keyListener*/ ctx[20], false, false, false),
    					listen_dev(a, "click", prevent_default(/*click_handler*/ ctx[29]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*filterPlaceholder*/ 4096) {
    				attr_dev(input, "placeholder", /*filterPlaceholder*/ ctx[12]);
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
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(41:3) {#if filterable}",
    		ctx
    	});

    	return block;
    }

    // (64:3) {:else}
    function create_else_block$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*filter*/ ctx[1] != null && /*filter*/ ctx[1].length > 0 && create_if_block_1$5(ctx);

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
    					if_block = create_if_block_1$5(ctx);
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(64:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (65:4) {#if filter != null && filter.length > 0}
    function create_if_block_1$5(ctx) {
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
    			add_location(div, file$d, 65, 5, 2108);
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(65:4) {#if filter != null && filter.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (60:20)         
    function fallback_block$3(ctx) {
    	let html_tag;
    	let raw_value = /*option*/ ctx[40].label + "";
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
    			if (dirty[0] & /*filteredOptions*/ 65536 && raw_value !== (raw_value = /*option*/ ctx[40].label + "")) html_tag.p(raw_value);
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
    		source: "(60:20)         ",
    		ctx
    	});

    	return block;
    }

    // (53:3) {#each filteredOptions as option, index}
    function create_each_block$3(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], get_default_slot_context_2);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[30](/*option*/ ctx[40], /*index*/ ctx[42], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			attr_dev(div, "class", "item svelte-184xj1x");
    			toggle_class(div, "selected", /*option*/ ctx[40].selected);
    			toggle_class(div, "viewing", /*viewIndex*/ ctx[15] == /*index*/ ctx[42]);
    			toggle_class(div, "disabled", /*option*/ ctx[40].disabled);
    			add_location(div, file$d, 53, 4, 1751);
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
    				if (default_slot.p && dirty[0] & /*$$scope, filteredOptions*/ 33619968) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[25], dirty, get_default_slot_changes_2, get_default_slot_context_2);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*filteredOptions*/ 65536) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (dirty[0] & /*filteredOptions*/ 65536) {
    				toggle_class(div, "selected", /*option*/ ctx[40].selected);
    			}

    			if (dirty[0] & /*viewIndex*/ 32768) {
    				toggle_class(div, "viewing", /*viewIndex*/ ctx[15] == /*index*/ ctx[42]);
    			}

    			if (dirty[0] & /*filteredOptions*/ 65536) {
    				toggle_class(div, "disabled", /*option*/ ctx[40].disabled);
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(53:3) {#each filteredOptions as option, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
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
    	let if_block0 = (/*selectedOptions*/ ctx[17].length === 0 || !/*multiple*/ ctx[3] && /*selectedOptions*/ ctx[17][0].value) && create_if_block_6(ctx);
    	let each_value_1 = /*selectedOptions*/ ctx[17];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*option*/ ctx[40];
    	validate_each_keys(ctx, each_value_1, get_each_context_1$3, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$3(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$3(key, child_ctx));
    	}

    	let if_block1 = (/*selectedOptions*/ ctx[17] == null || /*selectedOptions*/ ctx[17].length === 0) && create_if_block_3$1(ctx);

    	icon = new Icon({
    			props: { data: caretDownIcon, class: "fw" },
    			$$inline: true
    		});

    	let if_block2 = /*isOpen*/ ctx[0] && !/*disabled*/ ctx[7] && create_if_block$6(ctx);

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
    			attr_dev(div0, "class", "input-select-content svelte-184xj1x");
    			add_location(div0, file$d, 11, 2, 321);
    			attr_dev(span, "class", "dropdown-icon svelte-184xj1x");
    			add_location(span, file$d, 33, 2, 1069);
    			attr_dev(div1, "class", div1_class_value = "btn btn-light " + /*className*/ ctx[8] + " svelte-184xj1x");
    			attr_dev(div1, "data-test", div1_data_test_value = "" + (/*name*/ ctx[2] + "-btn"));
    			attr_dev(div1, "tabindex", tabindex$1);
    			toggle_class(div1, "btn-sm", /*sm*/ ctx[10]);
    			toggle_class(div1, "open", /*isOpen*/ ctx[0]);
    			add_location(div1, file$d, 1, 1, 100);
    			attr_dev(div2, "class", "select svelte-184xj1x");
    			attr_dev(div2, "data-test", /*name*/ ctx[2]);
    			attr_dev(div2, "id", /*name*/ ctx[2]);
    			toggle_class(div2, "inline", /*inline*/ ctx[9]);
    			toggle_class(div2, "disabled", /*disabled*/ ctx[7]);
    			add_location(div2, file$d, 0, 0, 0);
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
    			/*div1_binding*/ ctx[27](div1);
    			append_dev(div2, t3);
    			if (if_block2) if_block2.m(div2, null);
    			/*div2_binding*/ ctx[31](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*open*/ ctx[19], false, false, false),
    					listen_dev(div1, "focus", /*open*/ ctx[19], false, false, false),
    					listen_dev(div1, "keydown", /*keyListener*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*selectedOptions*/ ctx[17].length === 0 || !/*multiple*/ ctx[3] && /*selectedOptions*/ ctx[17][0].value) {
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

    			if (dirty[0] & /*selectedOptions, $$scope, inline, multiple*/ 33686024) {
    				const each_value_1 = /*selectedOptions*/ ctx[17];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div0, outro_and_destroy_block, create_each_block_1$3, t1, get_each_context_1$3);
    				check_outros();
    			}

    			if (/*selectedOptions*/ ctx[17] == null || /*selectedOptions*/ ctx[17].length === 0) {
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

    			if (!current || dirty[0] & /*className*/ 256 && div1_class_value !== (div1_class_value = "btn btn-light " + /*className*/ ctx[8] + " svelte-184xj1x")) {
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
    					if_block2 = create_if_block$6(ctx);
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
    			/*div1_binding*/ ctx[27](null);
    			if (if_block2) if_block2.d();
    			/*div2_binding*/ ctx[31](null);
    			mounted = false;
    			run_all(dispose);
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

    const tabindex$1 = 0;

    function instance$f($$self, $$props, $$invalidate) {
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
    	let { right = false } = $$props; // lazy - make dropdown start from right of button instead of left, for when it's toward right edge of screen
    	let container = null;
    	let fakeField = null;
    	let { filter = "" } = $$props;
    	let { filterPlaceholder = "Filter" } = $$props;

    	// option we're currently viewing w/ keyboard navigation
    	let viewIndex = -1;

    	function makeValueArray() {
    		if (!Array.isArray(value)) $$invalidate(21, value = [value]); else $$invalidate(21, value = optionsToArray(options, value).filter(o => o.selected).map(option => option.value));
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
    			$$invalidate(21, value = option.selected
    			? (value || []).filter(v => v != option.value)
    			: (value || []).concat(option.value));

    			// if user clicked an option in multi-select, refocus the fakeField
    			if (document.activeElement != fakeField) focusField();
    		} else {
    			$$invalidate(21, value = option.value);
    			close();
    		}

    		if (setViewIndex != null) $$invalidate(15, viewIndex = setViewIndex);
    		dispatch("change", value);
    	}

    	async function open() {
    		if (disabled) return;
    		$$invalidate(0, isOpen = true);

    		const selected = multiple
    		? value != null && value.length > 0 ? value[0] : null
    		: value;

    		$$invalidate(15, viewIndex = selected != null
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
    				$$invalidate(15, viewIndex--, viewIndex);
    				if (filterable && viewIndex == -2 || !filterable && viewIndex <= -1) close();
    				e.preventDefault();
    				break;
    			case "ArrowDown":
    				if (!isOpen) open(); else if (viewIndex < filteredOptions.length - 1) $$invalidate(15, viewIndex++, viewIndex);
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
    		"right",
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
    			$$invalidate(14, fakeField);
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
    			$$invalidate(13, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("multiple" in $$props) $$invalidate(3, multiple = $$props.multiple);
    		if ("prefixLabel" in $$props) $$invalidate(4, prefixLabel = $$props.prefixLabel);
    		if ("placeholder" in $$props) $$invalidate(5, placeholder = $$props.placeholder);
    		if ("options" in $$props) $$invalidate(22, options = $$props.options);
    		if ("valueProp" in $$props) $$invalidate(23, valueProp = $$props.valueProp);
    		if ("labelProp" in $$props) $$invalidate(24, labelProp = $$props.labelProp);
    		if ("value" in $$props) $$invalidate(21, value = $$props.value);
    		if ("filterable" in $$props) $$invalidate(6, filterable = $$props.filterable);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("disabled" in $$props) $$invalidate(7, disabled = $$props.disabled);
    		if ("class" in $$props) $$invalidate(8, className = $$props.class);
    		if ("inline" in $$props) $$invalidate(9, inline = $$props.inline);
    		if ("sm" in $$props) $$invalidate(10, sm = $$props.sm);
    		if ("right" in $$props) $$invalidate(11, right = $$props.right);
    		if ("filter" in $$props) $$invalidate(1, filter = $$props.filter);
    		if ("filterPlaceholder" in $$props) $$invalidate(12, filterPlaceholder = $$props.filterPlaceholder);
    		if ("$$scope" in $$props) $$invalidate(25, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		removeIcon: deleteIcon,
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
    		right,
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
    		if ("options" in $$props) $$invalidate(22, options = $$props.options);
    		if ("valueProp" in $$props) $$invalidate(23, valueProp = $$props.valueProp);
    		if ("labelProp" in $$props) $$invalidate(24, labelProp = $$props.labelProp);
    		if ("value" in $$props) $$invalidate(21, value = $$props.value);
    		if ("filterable" in $$props) $$invalidate(6, filterable = $$props.filterable);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ("disabled" in $$props) $$invalidate(7, disabled = $$props.disabled);
    		if ("className" in $$props) $$invalidate(8, className = $$props.className);
    		if ("inline" in $$props) $$invalidate(9, inline = $$props.inline);
    		if ("sm" in $$props) $$invalidate(10, sm = $$props.sm);
    		if ("right" in $$props) $$invalidate(11, right = $$props.right);
    		if ("container" in $$props) $$invalidate(13, container = $$props.container);
    		if ("fakeField" in $$props) $$invalidate(14, fakeField = $$props.fakeField);
    		if ("filter" in $$props) $$invalidate(1, filter = $$props.filter);
    		if ("filterPlaceholder" in $$props) $$invalidate(12, filterPlaceholder = $$props.filterPlaceholder);
    		if ("viewIndex" in $$props) $$invalidate(15, viewIndex = $$props.viewIndex);
    		if ("filteredOptions" in $$props) $$invalidate(16, filteredOptions = $$props.filteredOptions);
    		if ("selectedOptions" in $$props) $$invalidate(17, selectedOptions = $$props.selectedOptions);
    	};

    	let filteredOptions;
    	let selectedOptions;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*value*/ 2097152) {
    			 if (markDirty != null && value != null && !validator.equals(value, initialValue)) markDirty();
    		}

    		if ($$self.$$.dirty[0] & /*options, value, filterable, filter*/ 6291522) {
    			// options to render, filtered if necessary
    			 $$invalidate(16, filteredOptions = (() => {
    				const arr = optionsToArray(options, value);
    				return !filterable ? arr : _filter(arr, filter);
    			})());
    		}

    		if ($$self.$$.dirty[0] & /*viewIndex, filteredOptions, filterable*/ 98368) {
    			// keep viewIndex within filteredOptions length
    			 {
    				if (viewIndex > filteredOptions.length - 1) $$invalidate(15, viewIndex = filteredOptions.length - 1);
    				if (viewIndex < -1) $$invalidate(15, viewIndex = filterable ? -1 : -1);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*multiple, value*/ 2097160) {
    			// if multiple...
    			// make sure value is always array
    			// make sure value is always sorted to match option order - just nice to pass the same order around regardless of user click order
    			 if (multiple && value) makeValueArray();
    		}

    		if ($$self.$$.dirty[0] & /*options, value, multiple*/ 6291464) {
    			// options to render in the selected box (so we can use the same slot logic)
    			 $$invalidate(17, selectedOptions = optionsToArray(options, value).filter(option => multiple
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
    		right,
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
    			instance$f,
    			create_fragment$f,
    			safe_not_equal,
    			{
    				name: 2,
    				multiple: 3,
    				prefixLabel: 4,
    				placeholder: 5,
    				options: 22,
    				valueProp: 23,
    				labelProp: 24,
    				value: 21,
    				filterable: 6,
    				isOpen: 0,
    				disabled: 7,
    				class: 8,
    				inline: 9,
    				sm: 10,
    				right: 11,
    				filter: 1,
    				filterPlaceholder: 12
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputSelect",
    			options,
    			id: create_fragment$f.name
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

    	get right() {
    		throw new Error("<InputSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
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

    function makeThumbnail(srcCanvas, width, height) {
    	const canvas = document.createElement('canvas');
    	canvas.width = width;
    	canvas.height = height;

    	const context = canvas.getContext('2d');
    	context.drawImage(srcCanvas, 0, 0, width, height);
    	return canvas.toDataURL('image/png')
    }

    /* src\pages\Build\ArtMaker.svelte generated by Svelte v3.24.1 */

    const { console: console_1$3 } = globals;
    const file$e = "src\\pages\\Build\\ArtMaker.svelte";

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[88] = list[i];
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[85] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[91] = list[i];
    	child_ctx[93] = i;
    	return child_ctx;
    }

    // (9:3) {#if !isAdding}
    function create_if_block_2$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger svelte-1jfncop");
    			add_location(button, file$e, 9, 4, 393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[45], false, false, false);
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
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(9:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (65:2) <QuickDropdown label="Size" dropdownClass="p-2" on:open={startChangeSize}>
    function create_default_slot_4(ctx) {
    	let form;
    	let div;
    	let t0;
    	let input0;
    	let input0_min_value;
    	let input0_max_value;
    	let t1;
    	let strong;
    	let t3;
    	let input1;
    	let input1_min_value;
    	let input1_max_value;
    	let t4;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			div = element("div");
    			t0 = text("W\r\n\t\t\t\t\t");
    			input0 = element("input");
    			t1 = space();
    			strong = element("strong");
    			strong.textContent = "x";
    			t3 = text("\r\n\t\t\t\t\tH\r\n\t\t\t\t\t");
    			input1 = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Apply";
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", input0_min_value = 1);
    			attr_dev(input0, "max", input0_max_value = 1000);
    			attr_dev(input0, "class", "svelte-1jfncop");
    			add_location(input0, file$e, 68, 5, 2838);
    			attr_dev(strong, "class", "svelte-1jfncop");
    			add_location(strong, file$e, 69, 5, 2917);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", input1_min_value = 1);
    			attr_dev(input1, "max", input1_max_value = 1000);
    			attr_dev(input1, "class", "svelte-1jfncop");
    			add_location(input1, file$e, 71, 5, 2950);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-info btn-sm svelte-1jfncop");
    			add_location(button, file$e, 72, 5, 3030);
    			attr_dev(div, "class", "flex svelte-1jfncop");
    			add_location(div, file$e, 66, 4, 2805);
    			attr_dev(form, "class", "svelte-1jfncop");
    			add_location(form, file$e, 65, 3, 2750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div);
    			append_dev(div, t0);
    			append_dev(div, input0);
    			set_input_value(input0, /*changeSize*/ ctx[11].width);
    			append_dev(div, t1);
    			append_dev(div, strong);
    			append_dev(div, t3);
    			append_dev(div, input1);
    			set_input_value(input1, /*changeSize*/ ctx[11].height);
    			append_dev(div, t4);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[51]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[52]),
    					listen_dev(form, "submit", prevent_default(/*applyChangeSize*/ ctx[41]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*changeSize*/ 2048 && to_number(input0.value) !== /*changeSize*/ ctx[11].width) {
    				set_input_value(input0, /*changeSize*/ ctx[11].width);
    			}

    			if (dirty[0] & /*changeSize*/ 2048 && to_number(input1.value) !== /*changeSize*/ ctx[11].height) {
    				set_input_value(input1, /*changeSize*/ ctx[11].height);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(65:2) <QuickDropdown label=\\\"Size\\\" dropdownClass=\\\"p-2\\\" on:open={startChangeSize}>",
    		ctx
    	});

    	return block;
    }

    // (78:2) <QuickDropdown label="Scale" dropdownClass="p-2">
    function create_default_slot_3(ctx) {
    	let button0;
    	let icon0;
    	let t0;
    	let t1;
    	let button1;
    	let icon1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { data: minusIcon },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { data: addIcon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t0 = text("\r\n\t\t\t\tHalf size");
    			t1 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t2 = text("\r\n\t\t\t\tDouble size");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-light btn-sm svelte-1jfncop");
    			attr_dev(button0, "title", "Scale down");
    			add_location(button0, file$e, 78, 3, 3198);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-light btn-sm svelte-1jfncop");
    			attr_dev(button1, "title", "Scale up");
    			add_location(button1, file$e, 82, 3, 3354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			mount_component(icon0, button0, null);
    			append_dev(button0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			mount_component(icon1, button1, null);
    			append_dev(button1, t2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*scaleDown*/ ctx[38], false, false, false),
    					listen_dev(button1, "click", /*scaleUp*/ ctx[37], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			destroy_component(icon0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(78:2) <QuickDropdown label=\\\"Scale\\\" dropdownClass=\\\"p-2\\\">",
    		ctx
    	});

    	return block;
    }

    // (89:2) <InputSelect sm placeholder="Zoom" bind:value={zoom} let:option options={[...Array(11)].map((_, i) => i + 10)}>
    function create_default_slot_2(ctx) {
    	let icon;
    	let t0;
    	let t1_value = /*option*/ ctx[94].value + "";
    	let t1;
    	let current;

    	icon = new Icon({
    			props: { data: zoomIcon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[3] & /*option*/ 2) && t1_value !== (t1_value = /*option*/ ctx[94].value + "")) set_data_dev(t1, t1_value);
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
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(89:2) <InputSelect sm placeholder=\\\"Zoom\\\" bind:value={zoom} let:option options={[...Array(11)].map((_, i) => i + 10)}>",
    		ctx
    	});

    	return block;
    }

    // (102:2) <InputSelect     disabled={$autoSaveStore[input.name] == null}     options={$autoSaveStore[input.name]}     bind:value={selectedAutoSave}     on:change={e => loadAutoSave(e.detail)}     let:option     placeholder="Auto-saves"     inline     sm     right>
    function create_default_slot_1(ctx) {
    	let t0_value = /*option*/ ctx[94].name + "";
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			img = element("img");
    			if (img.src !== (img_src_value = /*option*/ ctx[94].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "40");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1jfncop");
    			add_location(img, file$e, 112, 3, 4199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[3] & /*option*/ 2 && t0_value !== (t0_value = /*option*/ ctx[94].name + "")) set_data_dev(t0, t0_value);

    			if (dirty[3] & /*option*/ 2 && img.src !== (img_src_value = /*option*/ ctx[94].png)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(102:2) <InputSelect     disabled={$autoSaveStore[input.name] == null}     options={$autoSaveStore[input.name]}     bind:value={selectedAutoSave}     on:change={e => loadAutoSave(e.detail)}     let:option     placeholder=\\\"Auto-saves\\\"     inline     sm     right>",
    		ctx
    	});

    	return block;
    }

    // (166:3) {:else}
    function create_else_block$4(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;
    	let img_height_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*input*/ ctx[0].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", img_width_value = /*pngCanvas*/ ctx[7].width * artScale);
    			attr_dev(img, "height", img_height_value = /*pngCanvas*/ ctx[7].height * artScale);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1jfncop");
    			add_location(img, file$e, 166, 4, 5977);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*input*/ 1 && img.src !== (img_src_value = /*input*/ ctx[0].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty[0] & /*pngCanvas*/ 128 && img_width_value !== (img_width_value = /*pngCanvas*/ ctx[7].width * artScale)) {
    				attr_dev(img, "width", img_width_value);
    			}

    			if (dirty[0] & /*pngCanvas*/ 128 && img_height_value !== (img_height_value = /*pngCanvas*/ ctx[7].height * artScale)) {
    				attr_dev(img, "height", img_height_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(166:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (128:3) {#if input.animated}
    function create_if_block_1$6(ctx) {
    	let div6;
    	let div3;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let input0_min_value;
    	let input0_max_value;
    	let input0_step_value;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let input1_min_value;
    	let input1_max_value;
    	let input1_step_value;
    	let t5;
    	let div2;
    	let label2;
    	let t6;
    	let input2;
    	let t7;
    	let div5;
    	let animationpreview;
    	let t8;
    	let div4;
    	let img;
    	let img_src_value;
    	let img_width_value;
    	let img_height_value;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;

    	const animationpreview_spread_levels = [
    		/*input*/ ctx[0],
    		{ scale: artScale },
    		{ width: /*pngCanvas*/ ctx[7].width },
    		{ height: /*pngCanvas*/ ctx[7].height }
    	];

    	let animationpreview_props = {};

    	for (let i = 0; i < animationpreview_spread_levels.length; i += 1) {
    		animationpreview_props = assign(animationpreview_props, animationpreview_spread_levels[i]);
    	}

    	animationpreview = new AnimationPreview({
    			props: animationpreview_props,
    			$$inline: true
    		});

    	let each_value_2 = [...Array(/*numFrames*/ ctx[15])];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Frame width";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Frame rate";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			t6 = text("Loop back\r\n\t\t\t\t\t\t\t\t");
    			input2 = element("input");
    			t7 = space();
    			div5 = element("div");
    			create_component(animationpreview.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			img = element("img");
    			t9 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label0, "for", "frame-width");
    			attr_dev(label0, "class", "svelte-1jfncop");
    			add_location(label0, file$e, 131, 7, 4592);
    			attr_dev(input0, "id", "frame-width");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", input0_min_value = 1);
    			attr_dev(input0, "max", input0_max_value = 200);
    			attr_dev(input0, "step", input0_step_value = 1);
    			attr_dev(input0, "class", "svelte-1jfncop");
    			add_location(input0, file$e, 132, 7, 4645);
    			attr_dev(div0, "class", "svelte-1jfncop");
    			add_location(div0, file$e, 130, 6, 4578);
    			attr_dev(label1, "for", "frame-width");
    			attr_dev(label1, "class", "svelte-1jfncop");
    			add_location(label1, file$e, 136, 7, 4780);
    			attr_dev(input1, "id", "frame-rate");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", input1_min_value = 1);
    			attr_dev(input1, "max", input1_max_value = 60);
    			attr_dev(input1, "step", input1_step_value = 1);
    			attr_dev(input1, "class", "svelte-1jfncop");
    			add_location(input1, file$e, 137, 7, 4832);
    			attr_dev(div1, "class", "svelte-1jfncop");
    			add_location(div1, file$e, 135, 6, 4766);
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$e, 143, 8, 5000);
    			attr_dev(label2, "class", "svelte-1jfncop");
    			add_location(label2, file$e, 141, 7, 4964);
    			attr_dev(div2, "class", "svelte-1jfncop");
    			add_location(div2, file$e, 140, 6, 4950);
    			attr_dev(div3, "class", "flex svelte-1jfncop");
    			add_location(div3, file$e, 129, 5, 4552);
    			if (img.src !== (img_src_value = /*input*/ ctx[0].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", img_width_value = /*pngCanvas*/ ctx[7].width * artScale);
    			attr_dev(img, "height", img_height_value = /*pngCanvas*/ ctx[7].height * artScale);
    			attr_dev(img, "alt", "preview frame splits");
    			add_location(img, file$e, 151, 7, 5278);
    			attr_dev(div4, "class", "frame-editor svelte-1jfncop");
    			add_location(div4, file$e, 150, 6, 5243);
    			attr_dev(div5, "class", "flex-column");
    			add_location(div5, file$e, 148, 5, 5104);
    			attr_dev(div6, "class", "svelte-1jfncop");
    			add_location(div6, file$e, 128, 4, 4540);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div3);
    			append_dev(div3, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*input*/ ctx[0].frameWidth);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*input*/ ctx[0].frameRate);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, label2);
    			append_dev(label2, t6);
    			append_dev(label2, input2);
    			input2.checked = /*input*/ ctx[0].yoyo;
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			mount_component(animationpreview, div5, null);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, img);
    			append_dev(div4, t9);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_2*/ ctx[58]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[59]),
    					listen_dev(input2, "change", /*input2_change_handler_1*/ ctx[60])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*input*/ 1 && to_number(input0.value) !== /*input*/ ctx[0].frameWidth) {
    				set_input_value(input0, /*input*/ ctx[0].frameWidth);
    			}

    			if (dirty[0] & /*input*/ 1 && to_number(input1.value) !== /*input*/ ctx[0].frameRate) {
    				set_input_value(input1, /*input*/ ctx[0].frameRate);
    			}

    			if (dirty[0] & /*input*/ 1) {
    				input2.checked = /*input*/ ctx[0].yoyo;
    			}

    			const animationpreview_changes = (dirty[0] & /*input, pngCanvas*/ 129)
    			? get_spread_update(animationpreview_spread_levels, [
    					dirty[0] & /*input*/ 1 && get_spread_object(/*input*/ ctx[0]),
    					dirty & /*artScale*/ 0 && { scale: artScale },
    					dirty[0] & /*pngCanvas*/ 128 && { width: /*pngCanvas*/ ctx[7].width },
    					dirty[0] & /*pngCanvas*/ 128 && { height: /*pngCanvas*/ ctx[7].height }
    				])
    			: {};

    			animationpreview.$set(animationpreview_changes);

    			if (!current || dirty[0] & /*input*/ 1 && img.src !== (img_src_value = /*input*/ ctx[0].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty[0] & /*pngCanvas*/ 128 && img_width_value !== (img_width_value = /*pngCanvas*/ ctx[7].width * artScale)) {
    				attr_dev(img, "width", img_width_value);
    			}

    			if (!current || dirty[0] & /*pngCanvas*/ 128 && img_height_value !== (img_height_value = /*pngCanvas*/ ctx[7].height * artScale)) {
    				attr_dev(img, "height", img_height_value);
    			}

    			if (dirty[0] & /*input, numFrames*/ 32769 | dirty[1] & /*copyFrame, removeFrame*/ 48) {
    				each_value_2 = [...Array(/*numFrames*/ ctx[15])];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(animationpreview.$$.fragment, local);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(animationpreview.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(animationpreview);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(128:3) {#if input.animated}",
    		ctx
    	});

    	return block;
    }

    // (153:7) {#each [...Array(numFrames)] as x, frameNumber}
    function create_each_block_2(ctx) {
    	let div;
    	let a0;
    	let icon0;
    	let t0;
    	let a1;
    	let icon1;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { data: deleteIcon },
    			$$inline: true
    		});

    	function click_handler_4(...args) {
    		return /*click_handler_4*/ ctx[61](/*frameNumber*/ ctx[93], ...args);
    	}

    	icon1 = new Icon({
    			props: { data: copyIcon },
    			$$inline: true
    		});

    	function click_handler_5(...args) {
    		return /*click_handler_5*/ ctx[62](/*frameNumber*/ ctx[93], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			a1 = element("a");
    			create_component(icon1.$$.fragment);
    			t1 = space();
    			attr_dev(a0, "href", "#/");
    			attr_dev(a0, "class", "text-danger svelte-1jfncop");
    			add_location(a0, file$e, 154, 9, 5597);
    			attr_dev(a1, "href", "#/");
    			attr_dev(a1, "class", "text-info svelte-1jfncop");
    			add_location(a1, file$e, 157, 9, 5751);
    			attr_dev(div, "class", "frame svelte-1jfncop");
    			set_style(div, "left", /*frameNumber*/ ctx[93] * /*input*/ ctx[0].frameWidth * artScale + "px");
    			set_style(div, "width", /*input*/ ctx[0].frameWidth * artScale + "px");
    			add_location(div, file$e, 153, 8, 5466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			mount_component(icon0, a0, null);
    			append_dev(div, t0);
    			append_dev(div, a1);
    			mount_component(icon1, a1, null);
    			append_dev(div, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", prevent_default(click_handler_4), false, true, false),
    					listen_dev(a1, "click", prevent_default(click_handler_5), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*input*/ 1) {
    				set_style(div, "left", /*frameNumber*/ ctx[93] * /*input*/ ctx[0].frameWidth * artScale + "px");
    			}

    			if (!current || dirty[0] & /*input*/ 1) {
    				set_style(div, "width", /*input*/ ctx[0].frameWidth * artScale + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(153:7) {#each [...Array(numFrames)] as x, frameNumber}",
    		ctx
    	});

    	return block;
    }

    // (171:3) {#if isBlockSize}
    function create_if_block$7(ctx) {
    	let div;
    	let each_value = [0, 0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 2; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "ml-2 svelte-1jfncop");
    			add_location(div, file$e, 171, 4, 6171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*input*/ 1) {
    				each_value = [0, 0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 2; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(171:3) {#if isBlockSize}",
    		ctx
    	});

    	return block;
    }

    // (175:7) {#each [0, 0, 0] as margin}
    function create_each_block_1$4(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;
    	let img_height_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*input*/ ctx[0].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "block repeating preview");
    			attr_dev(img, "width", img_width_value = /*input*/ ctx[0].width * artScale);
    			attr_dev(img, "height", img_height_value = /*input*/ ctx[0].height * artScale);
    			add_location(img, file$e, 175, 8, 6274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*input*/ 1 && img.src !== (img_src_value = /*input*/ ctx[0].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty[0] & /*input*/ 1 && img_width_value !== (img_width_value = /*input*/ ctx[0].width * artScale)) {
    				attr_dev(img, "width", img_width_value);
    			}

    			if (dirty[0] & /*input*/ 1 && img_height_value !== (img_height_value = /*input*/ ctx[0].height * artScale)) {
    				attr_dev(img, "height", img_height_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(175:7) {#each [0, 0, 0] as margin}",
    		ctx
    	});

    	return block;
    }

    // (173:5) {#each [0, 0] as r}
    function create_each_block$4(ctx) {
    	let div;
    	let t;
    	let each_value_1 = [0, 0, 0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < 3; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(div, file$e, 173, 6, 6223);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < 3; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*input*/ 1) {
    				each_value_1 = [0, 0, 0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < 3; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(173:5) {#each [0, 0] as r}",
    		ctx
    	});

    	return block;
    }

    // (3:0) <BuildLayout tab="art" activeName={input.name} store={$project.art}>
    function create_default_slot$2(ctx) {
    	let form;
    	let div0;
    	let savebtn;
    	let t0;
    	let input0;
    	let t1;
    	let t2;
    	let div6;
    	let colorpicker;
    	let updating_value;
    	let t3;
    	let div1;
    	let button0;
    	let icon0;
    	let button0_class_value;
    	let t4;
    	let button1;
    	let icon1;
    	let button1_class_value;
    	let t5;
    	let button2;
    	let icon2;
    	let button2_class_value;
    	let t6;
    	let div2;
    	let button3;
    	let icon3;
    	let t7;

    	let t8_value = (/*undos*/ ctx[2].length > 0
    	? /*undos*/ ctx[2].length
    	: "") + "";

    	let t8;
    	let button3_disabled_value;
    	let t9;
    	let button4;
    	let icon4;
    	let t10;

    	let t11_value = (/*redos*/ ctx[3].length > 0
    	? /*redos*/ ctx[3].length
    	: "") + "";

    	let t11;
    	let button4_disabled_value;
    	let t12;
    	let div3;
    	let button5;
    	let icon5;
    	let t13;
    	let button6;
    	let icon6;
    	let t14;
    	let div4;
    	let button7;
    	let icon7;
    	let t15;
    	let button8;
    	let icon8;
    	let t16;
    	let button9;
    	let icon9;
    	let t17;
    	let button10;
    	let icon10;
    	let t18;
    	let quickdropdown0;
    	let t19;
    	let quickdropdown1;
    	let t20;
    	let inputselect0;
    	let updating_value_1;
    	let t21;
    	let div5;
    	let label0;
    	let input1;
    	let t22;
    	let t23;
    	let button11;
    	let t25;
    	let inputselect1;
    	let updating_value_2;
    	let t26;
    	let div10;
    	let div8;
    	let div7;
    	let label1;
    	let t27;
    	let input2;
    	let t28;
    	let div9;
    	let current_block_type_index;
    	let if_block1;
    	let t29;
    	let t30;
    	let div11;
    	let canvas0;
    	let t31;
    	let canvas1;
    	let current;
    	let mounted;
    	let dispose;

    	savebtn = new SaveBtn({
    			props: { disabled: !/*hasChanges*/ ctx[13] },
    			$$inline: true
    		});

    	let if_block0 = !/*isAdding*/ ctx[12] && create_if_block_2$4(ctx);

    	function colorpicker_value_binding(value) {
    		/*colorpicker_value_binding*/ ctx[46].call(null, value);
    	}

    	let colorpicker_props = {};

    	if (/*selectedColor*/ ctx[5] !== void 0) {
    		colorpicker_props.value = /*selectedColor*/ ctx[5];
    	}

    	colorpicker = new ColorPicker({ props: colorpicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorpicker, "value", colorpicker_value_binding));
    	colorpicker.$on("change", /*change_handler*/ ctx[47]);

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

    	quickdropdown0 = new QuickDropdown({
    			props: {
    				label: "Size",
    				dropdownClass: "p-2",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	quickdropdown0.$on("open", /*startChangeSize*/ ctx[40]);

    	quickdropdown1 = new QuickDropdown({
    			props: {
    				label: "Scale",
    				dropdownClass: "p-2",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function inputselect0_value_binding(value) {
    		/*inputselect0_value_binding*/ ctx[53].call(null, value);
    	}

    	let inputselect0_props = {
    		sm: true,
    		placeholder: "Zoom",
    		options: [...Array(11)].map(func),
    		$$slots: {
    			default: [
    				create_default_slot_2,
    				({ option }) => ({ 94: option }),
    				({ option }) => [0, 0, 0, option ? 2 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*zoom*/ ctx[9] !== void 0) {
    		inputselect0_props.value = /*zoom*/ ctx[9];
    	}

    	inputselect0 = new InputSelect({
    			props: inputselect0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputselect0, "value", inputselect0_value_binding));

    	function inputselect1_value_binding(value) {
    		/*inputselect1_value_binding*/ ctx[55].call(null, value);
    	}

    	let inputselect1_props = {
    		disabled: /*$autoSaveStore*/ ctx[17][/*input*/ ctx[0].name] == null,
    		options: /*$autoSaveStore*/ ctx[17][/*input*/ ctx[0].name],
    		placeholder: "Auto-saves",
    		inline: true,
    		sm: true,
    		right: true,
    		$$slots: {
    			default: [
    				create_default_slot_1,
    				({ option }) => ({ 94: option }),
    				({ option }) => [0, 0, 0, option ? 2 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*selectedAutoSave*/ ctx[6] !== void 0) {
    		inputselect1_props.value = /*selectedAutoSave*/ ctx[6];
    	}

    	inputselect1 = new InputSelect({
    			props: inputselect1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputselect1, "value", inputselect1_value_binding));
    	inputselect1.$on("change", /*change_handler_1*/ ctx[56]);
    	const if_block_creators = [create_if_block_1$6, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*input*/ ctx[0].animated) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block2 = /*isBlockSize*/ ctx[16] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			create_component(savebtn.$$.fragment);
    			t0 = space();
    			input0 = element("input");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div6 = element("div");
    			create_component(colorpicker.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t4 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t5 = space();
    			button2 = element("button");
    			create_component(icon2.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			button3 = element("button");
    			create_component(icon3.$$.fragment);
    			t7 = space();
    			t8 = text(t8_value);
    			t9 = space();
    			button4 = element("button");
    			create_component(icon4.$$.fragment);
    			t10 = space();
    			t11 = text(t11_value);
    			t12 = space();
    			div3 = element("div");
    			button5 = element("button");
    			create_component(icon5.$$.fragment);
    			t13 = space();
    			button6 = element("button");
    			create_component(icon6.$$.fragment);
    			t14 = space();
    			div4 = element("div");
    			button7 = element("button");
    			create_component(icon7.$$.fragment);
    			t15 = space();
    			button8 = element("button");
    			create_component(icon8.$$.fragment);
    			t16 = space();
    			button9 = element("button");
    			create_component(icon9.$$.fragment);
    			t17 = space();
    			button10 = element("button");
    			create_component(icon10.$$.fragment);
    			t18 = space();
    			create_component(quickdropdown0.$$.fragment);
    			t19 = space();
    			create_component(quickdropdown1.$$.fragment);
    			t20 = space();
    			create_component(inputselect0.$$.fragment);
    			t21 = space();
    			div5 = element("div");
    			label0 = element("label");
    			input1 = element("input");
    			t22 = text("\r\n\t\t\t\tShow grid");
    			t23 = space();
    			button11 = element("button");
    			button11.textContent = "Start over";
    			t25 = space();
    			create_component(inputselect1.$$.fragment);
    			t26 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			label1 = element("label");
    			t27 = text("Animated\r\n\t\t\t\t\t");
    			input2 = element("input");
    			t28 = space();
    			div9 = element("div");
    			if_block1.c();
    			t29 = space();
    			if (if_block2) if_block2.c();
    			t30 = space();
    			div11 = element("div");
    			canvas0 = element("canvas");
    			t31 = space();
    			canvas1 = element("canvas");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control width-auto svelte-1jfncop");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "name", "name");
    			add_location(input0, file$e, 6, 3, 266);
    			attr_dev(div0, "class", "flex mb-2 svelte-1jfncop");
    			add_location(div0, file$e, 4, 2, 199);
    			attr_dev(form, "class", "svelte-1jfncop");
    			add_location(form, file$e, 3, 1, 157);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", button0_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "paint" ? "primary" : "light"));
    			attr_dev(button0, "title", "Paint brush");
    			add_location(button0, file$e, 18, 3, 700);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", button1_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "fill" ? "primary" : "light"));
    			attr_dev(button1, "title", "Paint bucket");
    			add_location(button1, file$e, 21, 3, 889);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", button2_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "erase" ? "primary" : "light"));
    			attr_dev(button2, "title", "Eraser");
    			add_location(button2, file$e, 24, 3, 1076);
    			attr_dev(div1, "class", "btn-group svelte-1jfncop");
    			add_location(div1, file$e, 17, 2, 672);
    			attr_dev(button3, "type", "button");
    			button3.disabled = button3_disabled_value = /*undos*/ ctx[2].length == 0;
    			attr_dev(button3, "class", "btn btn-default btn-sm");
    			add_location(button3, file$e, 30, 3, 1299);
    			attr_dev(button4, "type", "button");
    			button4.disabled = button4_disabled_value = /*redos*/ ctx[3].length == 0;
    			attr_dev(button4, "class", "btn btn-default btn-sm");
    			add_location(button4, file$e, 34, 3, 1490);
    			attr_dev(div2, "class", "btn-group svelte-1jfncop");
    			add_location(div2, file$e, 29, 2, 1271);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn btn-light btn-sm");
    			attr_dev(button5, "title", "Flip horizontal");
    			add_location(button5, file$e, 41, 3, 1738);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-light btn-sm");
    			attr_dev(button6, "title", "Flip vertical");
    			add_location(button6, file$e, 44, 3, 1879);
    			attr_dev(div3, "class", "btn-group svelte-1jfncop");
    			add_location(div3, file$e, 40, 2, 1710);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-light btn-sm");
    			attr_dev(button7, "title", "Move left");
    			add_location(button7, file$e, 50, 3, 2091);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn btn-light btn-sm");
    			attr_dev(button8, "title", "Move right");
    			add_location(button8, file$e, 53, 3, 2234);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn btn-light btn-sm");
    			attr_dev(button9, "title", "Move up");
    			add_location(button9, file$e, 56, 3, 2380);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "btn btn-light btn-sm");
    			attr_dev(button10, "title", "Move down");
    			add_location(button10, file$e, 59, 3, 2517);
    			attr_dev(div4, "class", "btn-group svelte-1jfncop");
    			add_location(div4, file$e, 49, 2, 2063);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$e, 94, 4, 3732);
    			attr_dev(label0, "class", "svelte-1jfncop");
    			add_location(label0, file$e, 93, 3, 3719);
    			attr_dev(div5, "class", "svelte-1jfncop");
    			add_location(div5, file$e, 92, 2, 3709);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "btn btn-light btn-sm mr1 svelte-1jfncop");
    			add_location(button11, file$e, 99, 2, 3825);
    			attr_dev(div6, "class", "toolbar flex align-center svelte-1jfncop");
    			add_location(div6, file$e, 14, 1, 521);
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$e, 121, 5, 4359);
    			attr_dev(label1, "class", "svelte-1jfncop");
    			add_location(label1, file$e, 119, 4, 4330);
    			attr_dev(div7, "class", "svelte-1jfncop");
    			add_location(div7, file$e, 118, 3, 4319);
    			attr_dev(div8, "class", "flex svelte-1jfncop");
    			add_location(div8, file$e, 117, 2, 4296);
    			attr_dev(div9, "class", "preview flex svelte-1jfncop");
    			add_location(div9, file$e, 126, 2, 4483);
    			attr_dev(div10, "class", "my-1 svelte-1jfncop");
    			add_location(div10, file$e, 116, 1, 4274);
    			attr_dev(canvas0, "class", "draw-canvas svelte-1jfncop");
    			add_location(canvas0, file$e, 185, 2, 6515);
    			attr_dev(canvas1, "class", "grid-canvas svelte-1jfncop");
    			toggle_class(canvas1, "paint-cursor", /*mode*/ ctx[1] == "paint");
    			toggle_class(canvas1, "fill-cursor", /*mode*/ ctx[1] == "fill");
    			toggle_class(canvas1, "erase-cursor", /*mode*/ ctx[1] == "erase");
    			add_location(canvas1, file$e, 186, 2, 6572);
    			attr_dev(div11, "class", "canvas-container svelte-1jfncop");
    			add_location(div11, file$e, 184, 1, 6481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			mount_component(savebtn, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*input*/ ctx[0].name);
    			append_dev(div0, t1);
    			if (if_block0) if_block0.m(div0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div6, anchor);
    			mount_component(colorpicker, div6, null);
    			append_dev(div6, t3);
    			append_dev(div6, div1);
    			append_dev(div1, button0);
    			mount_component(icon0, button0, null);
    			append_dev(div1, t4);
    			append_dev(div1, button1);
    			mount_component(icon1, button1, null);
    			append_dev(div1, t5);
    			append_dev(div1, button2);
    			mount_component(icon2, button2, null);
    			append_dev(div6, t6);
    			append_dev(div6, div2);
    			append_dev(div2, button3);
    			mount_component(icon3, button3, null);
    			append_dev(button3, t7);
    			append_dev(button3, t8);
    			append_dev(div2, t9);
    			append_dev(div2, button4);
    			mount_component(icon4, button4, null);
    			append_dev(button4, t10);
    			append_dev(button4, t11);
    			append_dev(div6, t12);
    			append_dev(div6, div3);
    			append_dev(div3, button5);
    			mount_component(icon5, button5, null);
    			append_dev(div3, t13);
    			append_dev(div3, button6);
    			mount_component(icon6, button6, null);
    			append_dev(div6, t14);
    			append_dev(div6, div4);
    			append_dev(div4, button7);
    			mount_component(icon7, button7, null);
    			append_dev(div4, t15);
    			append_dev(div4, button8);
    			mount_component(icon8, button8, null);
    			append_dev(div4, t16);
    			append_dev(div4, button9);
    			mount_component(icon9, button9, null);
    			append_dev(div4, t17);
    			append_dev(div4, button10);
    			mount_component(icon10, button10, null);
    			append_dev(div6, t18);
    			mount_component(quickdropdown0, div6, null);
    			append_dev(div6, t19);
    			mount_component(quickdropdown1, div6, null);
    			append_dev(div6, t20);
    			mount_component(inputselect0, div6, null);
    			append_dev(div6, t21);
    			append_dev(div6, div5);
    			append_dev(div5, label0);
    			append_dev(label0, input1);
    			input1.checked = /*showGrid*/ ctx[4];
    			append_dev(label0, t22);
    			append_dev(div6, t23);
    			append_dev(div6, button11);
    			append_dev(div6, t25);
    			mount_component(inputselect1, div6, null);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div8);
    			append_dev(div8, div7);
    			append_dev(div7, label1);
    			append_dev(label1, t27);
    			append_dev(label1, input2);
    			input2.checked = /*input*/ ctx[0].animated;
    			append_dev(div10, t28);
    			append_dev(div10, div9);
    			if_blocks[current_block_type_index].m(div9, null);
    			append_dev(div9, t29);
    			if (if_block2) if_block2.m(div9, null);
    			insert_dev(target, t30, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, canvas0);
    			/*canvas0_binding*/ ctx[63](canvas0);
    			append_dev(div11, t31);
    			append_dev(div11, canvas1);
    			/*canvas1_binding*/ ctx[64](canvas1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[44]),
    					listen_dev(form, "submit", prevent_default(/*save*/ ctx[19]), false, true, false),
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[48], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[49], false, false, false),
    					listen_dev(button2, "click", /*click_handler_3*/ ctx[50], false, false, false),
    					listen_dev(button3, "click", /*undo*/ ctx[27], false, false, false),
    					listen_dev(button4, "click", /*redo*/ ctx[28], false, false, false),
    					listen_dev(button5, "click", /*flipX*/ ctx[30], false, false, false),
    					listen_dev(button6, "click", /*flipY*/ ctx[29], false, false, false),
    					listen_dev(button7, "click", /*moveLeft*/ ctx[31], false, false, false),
    					listen_dev(button8, "click", /*moveRight*/ ctx[32], false, false, false),
    					listen_dev(button9, "click", /*moveUp*/ ctx[33], false, false, false),
    					listen_dev(button10, "click", /*moveDown*/ ctx[34], false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[54]),
    					listen_dev(button11, "click", /*reset*/ ctx[21], false, false, false),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[57]),
    					listen_dev(input2, "change", /*animatedChanged*/ ctx[39], false, false, false),
    					listen_dev(canvas1, "mousedown", prevent_default(/*onDrawMouseDown*/ ctx[22]), false, true, false),
    					listen_dev(canvas1, "mouseup", prevent_default(/*onDrawMouseUp*/ ctx[23]), false, true, false),
    					listen_dev(canvas1, "mousemove", prevent_default(/*onDrawMouseMove*/ ctx[24]), false, true, false),
    					listen_dev(canvas1, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[43]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const savebtn_changes = {};
    			if (dirty[0] & /*hasChanges*/ 8192) savebtn_changes.disabled = !/*hasChanges*/ ctx[13];
    			savebtn.$set(savebtn_changes);

    			if (dirty[0] & /*input*/ 1 && input0.value !== /*input*/ ctx[0].name) {
    				set_input_value(input0, /*input*/ ctx[0].name);
    			}

    			if (!/*isAdding*/ ctx[12]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const colorpicker_changes = {};

    			if (!updating_value && dirty[0] & /*selectedColor*/ 32) {
    				updating_value = true;
    				colorpicker_changes.value = /*selectedColor*/ ctx[5];
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

    			if ((!current || dirty[0] & /*undos*/ 4) && t8_value !== (t8_value = (/*undos*/ ctx[2].length > 0
    			? /*undos*/ ctx[2].length
    			: "") + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty[0] & /*undos*/ 4 && button3_disabled_value !== (button3_disabled_value = /*undos*/ ctx[2].length == 0)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}

    			if ((!current || dirty[0] & /*redos*/ 8) && t11_value !== (t11_value = (/*redos*/ ctx[3].length > 0
    			? /*redos*/ ctx[3].length
    			: "") + "")) set_data_dev(t11, t11_value);

    			if (!current || dirty[0] & /*redos*/ 8 && button4_disabled_value !== (button4_disabled_value = /*redos*/ ctx[3].length == 0)) {
    				prop_dev(button4, "disabled", button4_disabled_value);
    			}

    			const quickdropdown0_changes = {};

    			if (dirty[0] & /*changeSize*/ 2048 | dirty[3] & /*$$scope*/ 4) {
    				quickdropdown0_changes.$$scope = { dirty, ctx };
    			}

    			quickdropdown0.$set(quickdropdown0_changes);
    			const quickdropdown1_changes = {};

    			if (dirty[3] & /*$$scope*/ 4) {
    				quickdropdown1_changes.$$scope = { dirty, ctx };
    			}

    			quickdropdown1.$set(quickdropdown1_changes);
    			const inputselect0_changes = {};

    			if (dirty[3] & /*$$scope, option*/ 6) {
    				inputselect0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty[0] & /*zoom*/ 512) {
    				updating_value_1 = true;
    				inputselect0_changes.value = /*zoom*/ ctx[9];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			inputselect0.$set(inputselect0_changes);

    			if (dirty[0] & /*showGrid*/ 16) {
    				input1.checked = /*showGrid*/ ctx[4];
    			}

    			const inputselect1_changes = {};
    			if (dirty[0] & /*$autoSaveStore, input*/ 131073) inputselect1_changes.disabled = /*$autoSaveStore*/ ctx[17][/*input*/ ctx[0].name] == null;
    			if (dirty[0] & /*$autoSaveStore, input*/ 131073) inputselect1_changes.options = /*$autoSaveStore*/ ctx[17][/*input*/ ctx[0].name];

    			if (dirty[3] & /*$$scope, option*/ 6) {
    				inputselect1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty[0] & /*selectedAutoSave*/ 64) {
    				updating_value_2 = true;
    				inputselect1_changes.value = /*selectedAutoSave*/ ctx[6];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			inputselect1.$set(inputselect1_changes);

    			if (dirty[0] & /*input*/ 1) {
    				input2.checked = /*input*/ ctx[0].animated;
    			}

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
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div9, t29);
    			}

    			if (/*isBlockSize*/ ctx[16]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$7(ctx);
    					if_block2.c();
    					if_block2.m(div9, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty[0] & /*mode*/ 2) {
    				toggle_class(canvas1, "paint-cursor", /*mode*/ ctx[1] == "paint");
    			}

    			if (dirty[0] & /*mode*/ 2) {
    				toggle_class(canvas1, "fill-cursor", /*mode*/ ctx[1] == "fill");
    			}

    			if (dirty[0] & /*mode*/ 2) {
    				toggle_class(canvas1, "erase-cursor", /*mode*/ ctx[1] == "erase");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(savebtn.$$.fragment, local);
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
    			transition_in(quickdropdown0.$$.fragment, local);
    			transition_in(quickdropdown1.$$.fragment, local);
    			transition_in(inputselect0.$$.fragment, local);
    			transition_in(inputselect1.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(savebtn.$$.fragment, local);
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
    			transition_out(quickdropdown0.$$.fragment, local);
    			transition_out(quickdropdown1.$$.fragment, local);
    			transition_out(inputselect0.$$.fragment, local);
    			transition_out(inputselect1.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(savebtn);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t2);
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
    			destroy_component(quickdropdown0);
    			destroy_component(quickdropdown1);
    			destroy_component(inputselect0);
    			destroy_component(inputselect1);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(div10);
    			if_blocks[current_block_type_index].d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t30);
    			if (detaching) detach_dev(div11);
    			/*canvas0_binding*/ ctx[63](null);
    			/*canvas1_binding*/ ctx[64](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(3:0) <BuildLayout tab=\\\"art\\\" activeName={input.name} store={$project.art}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let buildlayout;
    	let current;
    	let mounted;
    	let dispose;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "art",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[14].art,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buildlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(buildlayout, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keyup", /*onKeyUp*/ ctx[25], false, false, false),
    					listen_dev(window, "paste", /*onPaste*/ ctx[26], false, false, false),
    					listen_dev(window, "mouseup", /*onDrawMouseUp*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const buildlayout_changes = {};
    			if (dirty[0] & /*input*/ 1) buildlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty[0] & /*$project*/ 16384) buildlayout_changes.store = /*$project*/ ctx[14].art;

    			if (dirty[0] & /*gridCanvas, mode, drawCanvas, input, isBlockSize, numFrames, pngCanvas, $autoSaveStore, selectedAutoSave, showGrid, zoom, changeSize, redos, undos, selectedColor, isAdding, hasChanges*/ 245759 | dirty[3] & /*$$scope*/ 4) {
    				buildlayout_changes.$$scope = { dirty, ctx };
    			}

    			buildlayout.$set(buildlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buildlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buildlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buildlayout, detaching);
    			mounted = false;
    			run_all(dispose);
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

    const artScale = 1;

    function createDefaultInput() {
    	return {
    		name: "",
    		width: 40,
    		height: 40,
    		png: null,
    		animated: false,
    		frameWidth: 25,
    		frameRate: 10,
    		yoyo: false
    	};
    }

    function toRGB(d) {
    	return d[3] === 0
    	? "transparent"
    	: `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`;
    }

    function drawSquare(context, x, y, size, color) {
    	if (color == "transparent") {
    		context.clearRect(x, y, size, size);
    	} else {
    		context.beginPath();
    		context.rect(x, y, size, size);
    		context.fillStyle = color;
    		context.fill();
    	}
    }

    function rotateLeft() {
    	rotate(-90);
    }

    function rotateRight() {
    	rotate(90);
    }

    const func = (_, i) => i + 10;

    function instance$g($$self, $$props, $$invalidate) {
    	let $project;
    	let $autoSaveStore;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(14, $project = $$value));
    	validate_store(autoSaveStore, "autoSaveStore");
    	component_subscribe($$self, autoSaveStore, $$value => $$invalidate(17, $autoSaveStore = $$value));
    	let { params = {} } = $$props;
    	let input = createDefaultInput();
    	let mode = "paint";
    	let undos = [];
    	let redos = [];
    	let mouseDown = false;
    	let showGrid = true;
    	let selectedColor = "rgba(0, 0, 0, 255)";
    	let selectedAutoSave = null;

    	// we load the png into this canvas
    	// and when user draws on the big canvas, we actually make the change on the scaled down canvas, and then re-render the larger canvas from this one
    	// (if we make a change to the larger canvas, it gets blurry when scaling back down)
    	const pngCanvas = document.createElement("canvas");

    	const pngContext = pngCanvas.getContext("2d");

    	// we render a scaled up version to this canvas for user to interact with
    	let drawCanvas;

    	let drawContext;
    	let zoom = 15;

    	// we render grid lines to this canvas
    	let gridCanvas;

    	let gridContext;
    	let changeSize = { width: 0, height: 0 };
    	const debouncedRedraw = debounce(() => redraw(), 200);
    	onMount(() => redraw());

    	function create() {
    		console.log("create");
    		$$invalidate(0, input = createDefaultInput());
    		redraw();
    	}

    	function edit(name) {
    		if (!$project.art.hasOwnProperty(name)) return;
    		$$invalidate(2, undos = []);
    		$$invalidate(3, redos = []);

    		$$invalidate(0, input = {
    			...createDefaultInput(),
    			...JSON.parse(JSON.stringify($project.art[name]))
    		});

    		redraw();
    	}

    	function loadAutoSave(saveData) {
    		$$invalidate(0, input = JSON.parse(JSON.stringify(saveData)));
    		$$invalidate(6, selectedAutoSave = null);
    		redraw();
    	}

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(project, $project.art[input.name] = JSON.parse(JSON.stringify(input)), $project);
    		push(`/${$project.name}/build/art/${encodeURIComponent(input.name)}`);
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) {
    			delete $project.art[name];
    			project.set($project);
    			push(`/${$project.name}/build/art/new`);
    		}
    	}

    	function reset(undoable = true) {
    		if (undoable) addUndoState();
    		$$invalidate(0, input.png = null, input);
    		redraw();
    	}

    	function onDrawMouseDown(e) {
    		const { x, y } = getScaledEventCoordinates(e);
    		const color = getColorAt(x, y);

    		if (e.altKey || e.button !== 0) {
    			if (color == "transparent") {
    				$$invalidate(1, mode = "erase");
    				$$invalidate(5, selectedColor = "transparent");
    			} else {
    				$$invalidate(1, mode = "paint");
    				$$invalidate(5, selectedColor = color);
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
    		const { x, y } = getScaledEventCoordinates(e);

    		if (y != null && x != null) {
    			if (mode == "erase") setColor(x, y, "transparent"); else setColor(x, y, selectedColor);
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

    	function onPaste(e) {
    		const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    		console.log("onpaste", JSON.stringify(items)); // will give you the mime types

    		for (let index in items) {
    			const item = items[index];

    			if (item.kind === "file") {
    				const blob = item.getAsFile();
    				const reader = new FileReader();

    				reader.onload = function (event) {
    					console.log("onload", event.target.result);
    					const image = new Image();
    					image.src = event.target.result;

    					image.onload = () => {
    						$$invalidate(0, input.width = image.width, input);
    						$$invalidate(0, input.height = image.height, input);
    						$$invalidate(0, input.png = event.target.result, input);
    						console.log(image.width, image.height);
    						redraw();
    					};
    				};

    				// data url!
    				// callback(blob)
    				console.log("blob", blob);

    				reader.readAsDataURL(blob);
    			}
    		}
    	}

    	function getColorAt(x, y) {
    		return toRGB(pngContext.getImageData(x, y, 1, 1).data);
    	}

    	function getScaledEventCoordinates(e) {
    		const x = e.offsetX + e.target.scrollLeft;
    		const y = e.offsetY + e.target.scrollTop;
    		console.log(x, y);

    		// debugger
    		return {
    			x: Math.floor(x / zoom),
    			y: Math.floor(y / zoom)
    		};
    	}

    	function addUndoState() {
    		$$invalidate(2, undos = [...undos.slice(Math.max(undos.length - 20, 0)), JSON.stringify(input)]);

    		// if we're adding a new undo state, empty redos
    		$$invalidate(3, redos = []);

    		// auto save
    		// todo consider making undo/redo store local storaged?
    		set_store_value(
    			autoSaveStore,
    			$autoSaveStore[input.name] = [
    				JSON.parse(JSON.stringify(input)),
    				...($autoSaveStore[input.name] || []).slice(0, 10)
    			],
    			$autoSaveStore
    		);

    		console.log("auto saved");
    	}

    	function undo() {
    		if (undos.length == 0) return;
    		$$invalidate(3, redos = [...redos, JSON.stringify(input)]);
    		$$invalidate(0, input = { ...input, ...JSON.parse(undos.pop()) });
    		$$invalidate(2, undos);
    		redraw();
    	}

    	function redo() {
    		if (redos.length == 0) return;
    		$$invalidate(2, undos = [...undos, JSON.stringify(input)]);
    		$$invalidate(0, input = { ...input, ...JSON.parse(redos.pop()) });
    		$$invalidate(3, redos);
    		redraw();
    	}

    	function setColor(x, y, color, recursing = false) {
    		const oldColor = getColorAt(x, y);
    		drawSquare(pngContext, x, y, 1, color);
    		drawSquare(drawContext, x * zoom, y * zoom, zoom, color);

    		if (mode == "fill") {
    			// recursively loop around this pixel setting pixels that were the same color this one used to be to the new color
    			// needs revision
    			// right now it works well for filling outlines, but overfills through outlines that only touch on corners
    			for (let xn = x - 1; xn <= x + 1; xn += 1) {
    				for (let yn = y - 1; yn <= y + 1; yn += 1) {
    					if (yn < 0 || yn > input.height - 1 || xn < 0 || xn > input.width * 1 - 1) continue;
    					const currentColor = getColorAt(xn, yn);
    					if (currentColor == oldColor) setColor(xn, yn, color, true);
    				}
    			}
    		}

    		if (!recursing) setInputFromCanvas();
    	}

    	function redraw() {
    		if (drawCanvas == null || gridCanvas == null) return;
    		if (drawContext == null) drawContext = drawCanvas.getContext("2d");
    		if (gridContext == null) gridContext = gridCanvas.getContext("2d");

    		// put source png onto scale canvas
    		createMemoryImage(input.png).then(image => {
    			// draw png onto scale canvas
    			let scaleWidth = image.width;

    			let scaleHeight = image.height;

    			// if png size is exactly double input size... we're just importing old data, scale it down
    			let wasOutOfScale = scaleWidth == input.width * 2 && scaleHeight == input.height * 2;

    			if (wasOutOfScale) {
    				// should be fine...
    				// use input size instead
    				scaleWidth = image.width / 2;

    				scaleHeight = image.height / 2;
    			}

    			$$invalidate(7, pngCanvas.width = input.width, pngCanvas);
    			$$invalidate(7, pngCanvas.height = input.height, pngCanvas);
    			pngContext.clearRect(0, 0, input.width, input.height);
    			$$invalidate(8, drawCanvas.width = input.width * zoom, drawCanvas);
    			$$invalidate(8, drawCanvas.height = input.height * zoom, drawCanvas);
    			drawContext.clearRect(0, 0, input.width * zoom, input.height * zoom);
    			$$invalidate(10, gridCanvas.width = input.width * zoom, gridCanvas);
    			$$invalidate(10, gridCanvas.height = input.height * zoom, gridCanvas);
    			gridContext.clearRect(0, 0, input.width * zoom, input.height * zoom);

    			// draw the png full size, even if it gets cut off
    			if (input.png != null && image != null) {
    				pngContext.drawImage(image, 0, 0, scaleWidth, scaleHeight);

    				// draw image larger on big canvas
    				drawContext.save();

    				drawContext.scale(zoom, zoom);
    				drawContext.imageSmoothingEnabled = false;
    				drawContext.drawImage(image, 0, 0);
    				drawContext.restore();
    			}

    			setInputFromCanvas();

    			if (showGrid) {
    				gridContext.strokeStyle = "rgba(255,255,255,1)";

    				for (let x = 1; x < input.width; x++) {
    					gridContext.beginPath();
    					gridContext.moveTo(x * zoom, 0);
    					gridContext.lineTo(x * zoom, input.height * zoom);
    					gridContext.stroke();
    				}

    				for (let y = 1; y < input.height; y++) {
    					gridContext.beginPath();
    					gridContext.moveTo(0, y * zoom);
    					gridContext.lineTo(input.width * zoom, y * zoom);
    					gridContext.stroke();
    				}
    			}
    		});
    	}

    	function flipY() {
    		flip(false, true);
    	}

    	function flipX() {
    		flip(true, false);
    	}

    	function moveLeft() {
    		move(-1, 0);
    	}

    	function moveRight() {
    		move(1, 0);
    	}

    	function moveUp() {
    		move(0, -1);
    	}

    	function moveDown() {
    		move(0, 1);
    	}

    	function move(dx, dy) {
    		addUndoState();
    		const data = pngContext.getImageData(0, 0, input.width, input.height);
    		pngContext.putImageData(data, dx, dy);
    		if (dx != 0) pngContext.putImageData(data, dx - dx * input.width, 0); else if (dy != 0) pngContext.putImageData(data, 0, dy - dy * input.height);
    		setInputFromCanvas();
    		redraw();
    	}

    	function flip(flipX, flipY) {
    		addUndoState();
    		setInputFromCanvas();

    		createMemoryImage(input.png).then(image => {
    			pngContext.clearRect(0, 0, input.width, input.height);
    			pngContext.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    			pngContext.drawImage(image, flipX ? input.width * -1 : 0, flipY ? input.height * -1 : 0, input.width, input.height);
    			setInputFromCanvas();
    			redraw();
    		});
    	}

    	// can't seem to get this to work
    	// function rotate(deg) {
    	// 	addUndoState()
    	// 	setInputFromCanvas()
    	// 	createMemoryImage(input.png).then(image => {
    	// 	})
    	// }
    	function setInputFromCanvas() {
    		$$invalidate(0, input.png = pngCanvas.toDataURL("image/png"), input);
    	}

    	function createMemoryImage(png) {
    		if (png == null) return Promise.resolve({ width: input.width, height: input.height });

    		return new Promise((resolve, reject) => {
    				const image = new Image();
    				image.src = input.png;
    				image.onload = () => resolve(image);
    			});
    	}

    	function removeFrame(frameIndex) {
    		addUndoState();
    		const frameStartX = frameIndex * input.frameWidth;
    		const framesAfterData = pngContext.getImageData(frameStartX + input.frameWidth, 0, input.width, input.height);
    		pngContext.clearRect(frameStartX, 0, input.width, input.height);
    		pngContext.width = input.width - input.frameWidth;
    		pngContext.putImageData(framesAfterData, frameStartX, 0);
    		setInputFromCanvas();
    		redraw();
    		$$invalidate(0, input.width -= input.frameWidth, input);
    	}

    	function copyFrame(frameIndex) {
    		addUndoState();
    		const frameStartX = frameIndex * input.frameWidth;
    		const existingFramesData = pngContext.getImageData(0, 0, input.width, input.height);
    		const frameData = pngContext.getImageData(frameStartX, 0, input.frameWidth, input.height);
    		$$invalidate(7, pngCanvas.width = pngCanvas.width + input.frameWidth, pngCanvas);

    		// changing width clears old content, so we have to re-draw old frames too
    		pngContext.putImageData(existingFramesData, 0, 0);

    		pngContext.putImageData(frameData, input.width, 0);
    		setInputFromCanvas();
    		console.log(input.png);
    		$$invalidate(0, input.width += input.frameWidth, input);
    	}

    	function scaleUp() {
    		scale(2);
    	}

    	function scaleDown() {
    		scale(0.5);
    	}

    	function scale(s) {
    		addUndoState();

    		createMemoryImage(input.png).then(image => {
    			$$invalidate(7, pngCanvas.width = input.width * s, pngCanvas);
    			$$invalidate(7, pngCanvas.height = input.height * s, pngCanvas);
    			pngContext.scale(s, s);
    			pngContext.imageSmoothingEnabled = false;
    			pngContext.drawImage(image, 0, 0);
    			pngContext.restore();
    			setInputFromCanvas();
    			$$invalidate(0, input.width = Math.ceil(input.width * s), input);
    			$$invalidate(0, input.height = Math.ceil(input.height * s), input);
    			$$invalidate(0, input.frameWidth = Math.ceil(input.frameWidth * s), input);
    		});
    	}

    	// set frame width to width if they're turning on animation for first time
    	function animatedChanged() {
    		if (input.animated) {
    			$$invalidate(0, input.frameWidth = input.width, input);
    		}
    	}

    	function startChangeSize() {
    		$$invalidate(11, changeSize.width = input.width, changeSize);
    		$$invalidate(11, changeSize.height = input.height, changeSize);
    		$$invalidate(11, changeSize.scale = 1, changeSize);
    	}

    	function applyChangeSize() {
    		console.log("yeah yeah");
    		$$invalidate(0, input.width = changeSize.width, input);
    		$$invalidate(0, input.height = changeSize.height, input);
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<ArtMaker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ArtMaker", $$slots, []);

    	function contextmenu_handler(event) {
    		bubble($$self, event);
    	}

    	function input0_input_handler() {
    		input.name = this.value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	function colorpicker_value_binding(value) {
    		selectedColor = value;
    		$$invalidate(5, selectedColor);
    	}

    	const change_handler = () => $$invalidate(1, mode = mode == "erase" ? "paint" : mode);
    	const click_handler_1 = () => $$invalidate(1, mode = "paint");
    	const click_handler_2 = () => $$invalidate(1, mode = "fill");
    	const click_handler_3 = () => $$invalidate(1, mode = "erase");

    	function input0_input_handler_1() {
    		changeSize.width = to_number(this.value);
    		$$invalidate(11, changeSize);
    	}

    	function input1_input_handler() {
    		changeSize.height = to_number(this.value);
    		$$invalidate(11, changeSize);
    	}

    	function inputselect0_value_binding(value) {
    		zoom = value;
    		$$invalidate(9, zoom);
    	}

    	function input1_change_handler() {
    		showGrid = this.checked;
    		$$invalidate(4, showGrid);
    	}

    	function inputselect1_value_binding(value) {
    		selectedAutoSave = value;
    		$$invalidate(6, selectedAutoSave);
    	}

    	const change_handler_1 = e => loadAutoSave(e.detail);

    	function input2_change_handler() {
    		input.animated = this.checked;
    		$$invalidate(0, input);
    	}

    	function input0_input_handler_2() {
    		input.frameWidth = to_number(this.value);
    		$$invalidate(0, input);
    	}

    	function input1_input_handler_1() {
    		input.frameRate = to_number(this.value);
    		$$invalidate(0, input);
    	}

    	function input2_change_handler_1() {
    		input.yoyo = this.checked;
    		$$invalidate(0, input);
    	}

    	const click_handler_4 = frameNumber => removeFrame(frameNumber);
    	const click_handler_5 = frameNumber => copyFrame(frameNumber);

    	function canvas0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			drawCanvas = $$value;
    			$$invalidate(8, drawCanvas);
    		});
    	}

    	function canvas1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			gridCanvas = $$value;
    			$$invalidate(10, gridCanvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(42, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		arrowLeftIcon,
    		arrowRightIcon,
    		arrowUpIcon,
    		arrowDownIcon,
    		undoIcon,
    		paintBrushIcon,
    		eraseIcon,
    		deleteIcon,
    		copyIcon,
    		zoomIcon,
    		minusIcon,
    		plusIcon: addIcon,
    		fillIcon: faFillDrip,
    		paintIcon: faPaintBrush,
    		flipIcon: faExchangeAlt,
    		onMount,
    		push,
    		AnimationPreview,
    		autoSaveStore,
    		BuildLayout,
    		ColorPicker,
    		debounce,
    		FieldNumber,
    		FieldText,
    		Form,
    		Icon,
    		InputSelect,
    		makeThumbnail,
    		project,
    		QuickDropdown,
    		SaveBtn,
    		validator,
    		params,
    		input,
    		mode,
    		undos,
    		redos,
    		mouseDown,
    		showGrid,
    		selectedColor,
    		selectedAutoSave,
    		pngCanvas,
    		pngContext,
    		artScale,
    		drawCanvas,
    		drawContext,
    		zoom,
    		gridCanvas,
    		gridContext,
    		changeSize,
    		debouncedRedraw,
    		create,
    		createDefaultInput,
    		edit,
    		loadAutoSave,
    		save,
    		del,
    		reset,
    		onDrawMouseDown,
    		onDrawMouseUp,
    		onDrawMouseMove,
    		onKeyUp,
    		onPaste,
    		getColorAt,
    		getScaledEventCoordinates,
    		toRGB,
    		addUndoState,
    		undo,
    		redo,
    		setColor,
    		drawSquare,
    		redraw,
    		flipY,
    		flipX,
    		moveLeft,
    		moveRight,
    		moveUp,
    		moveDown,
    		rotateLeft,
    		rotateRight,
    		move,
    		flip,
    		setInputFromCanvas,
    		createMemoryImage,
    		removeFrame,
    		copyFrame,
    		scaleUp,
    		scaleDown,
    		scale,
    		animatedChanged,
    		startChangeSize,
    		applyChangeSize,
    		paramName,
    		isAdding,
    		inputWidth,
    		inputHeight,
    		hasChanges,
    		$project,
    		numFrames,
    		isBlockSize,
    		$autoSaveStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(42, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("mode" in $$props) $$invalidate(1, mode = $$props.mode);
    		if ("undos" in $$props) $$invalidate(2, undos = $$props.undos);
    		if ("redos" in $$props) $$invalidate(3, redos = $$props.redos);
    		if ("mouseDown" in $$props) mouseDown = $$props.mouseDown;
    		if ("showGrid" in $$props) $$invalidate(4, showGrid = $$props.showGrid);
    		if ("selectedColor" in $$props) $$invalidate(5, selectedColor = $$props.selectedColor);
    		if ("selectedAutoSave" in $$props) $$invalidate(6, selectedAutoSave = $$props.selectedAutoSave);
    		if ("drawCanvas" in $$props) $$invalidate(8, drawCanvas = $$props.drawCanvas);
    		if ("drawContext" in $$props) drawContext = $$props.drawContext;
    		if ("zoom" in $$props) $$invalidate(9, zoom = $$props.zoom);
    		if ("gridCanvas" in $$props) $$invalidate(10, gridCanvas = $$props.gridCanvas);
    		if ("gridContext" in $$props) gridContext = $$props.gridContext;
    		if ("changeSize" in $$props) $$invalidate(11, changeSize = $$props.changeSize);
    		if ("paramName" in $$props) $$invalidate(69, paramName = $$props.paramName);
    		if ("isAdding" in $$props) $$invalidate(12, isAdding = $$props.isAdding);
    		if ("inputWidth" in $$props) $$invalidate(70, inputWidth = $$props.inputWidth);
    		if ("inputHeight" in $$props) $$invalidate(71, inputHeight = $$props.inputHeight);
    		if ("hasChanges" in $$props) $$invalidate(13, hasChanges = $$props.hasChanges);
    		if ("numFrames" in $$props) $$invalidate(15, numFrames = $$props.numFrames);
    		if ("isBlockSize" in $$props) $$invalidate(16, isBlockSize = $$props.isBlockSize);
    	};

    	let paramName;
    	let isAdding;
    	let inputWidth;
    	let inputHeight;
    	let hasChanges;
    	let numFrames;
    	let isBlockSize;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*params*/ 2048) {
    			 $$invalidate(69, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty[2] & /*paramName*/ 128) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty[2] & /*paramName*/ 128) {
    			 $$invalidate(12, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty[0] & /*input*/ 1) {
    			 $$invalidate(70, inputWidth = input.width);
    		}

    		if ($$self.$$.dirty[0] & /*input*/ 1) {
    			 $$invalidate(71, inputHeight = input.height);
    		}

    		if ($$self.$$.dirty[0] & /*input, $project*/ 16385) {
    			 $$invalidate(13, hasChanges = !validator.equals(input, $project.art[input.name]));
    		}

    		if ($$self.$$.dirty[0] & /*input*/ 1) {
    			 $$invalidate(15, numFrames = input.width != null && input.frameWidth != null
    			? Math.ceil(input.width / input.frameWidth)
    			: 0);
    		}

    		if ($$self.$$.dirty[0] & /*showGrid, zoom*/ 528 | $$self.$$.dirty[2] & /*inputWidth, inputHeight*/ 768) {
    			 if (inputWidth != 0 && inputHeight != 0 && showGrid != null && zoom != null) debouncedRedraw();
    		}

    		if ($$self.$$.dirty[0] & /*input*/ 1) {
    			 $$invalidate(16, isBlockSize = input.height == 40 && (input.width == 40 || input.animated && input.frameWidth == 40));
    		}
    	};

    	return [
    		input,
    		mode,
    		undos,
    		redos,
    		showGrid,
    		selectedColor,
    		selectedAutoSave,
    		pngCanvas,
    		drawCanvas,
    		zoom,
    		gridCanvas,
    		changeSize,
    		isAdding,
    		hasChanges,
    		$project,
    		numFrames,
    		isBlockSize,
    		$autoSaveStore,
    		loadAutoSave,
    		save,
    		del,
    		reset,
    		onDrawMouseDown,
    		onDrawMouseUp,
    		onDrawMouseMove,
    		onKeyUp,
    		onPaste,
    		undo,
    		redo,
    		flipY,
    		flipX,
    		moveLeft,
    		moveRight,
    		moveUp,
    		moveDown,
    		removeFrame,
    		copyFrame,
    		scaleUp,
    		scaleDown,
    		animatedChanged,
    		startChangeSize,
    		applyChangeSize,
    		params,
    		contextmenu_handler,
    		input0_input_handler,
    		click_handler,
    		colorpicker_value_binding,
    		change_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		input0_input_handler_1,
    		input1_input_handler,
    		inputselect0_value_binding,
    		input1_change_handler,
    		inputselect1_value_binding,
    		change_handler_1,
    		input2_change_handler,
    		input0_input_handler_2,
    		input1_input_handler_1,
    		input2_change_handler_1,
    		click_handler_4,
    		click_handler_5,
    		canvas0_binding,
    		canvas1_binding
    	];
    }

    class ArtMaker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { params: 42 }, [-1, -1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArtMaker",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get params() {
    		throw new Error("<ArtMaker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<ArtMaker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldArtPicker.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$3 } = globals;
    const file$f = "src\\components\\FieldArtPicker.svelte";

    // (6:2) <InputSelect inline {name} bind:value let:option {options} filterable={options.length > 3} {placeholder}>
    function create_default_slot$3(ctx) {
    	let art;
    	let t0;
    	let t1_value = /*option*/ ctx[9].value + "";
    	let t1;
    	let current;

    	art = new Art({
    			props: {
    				name: /*option*/ ctx[9].value,
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
    			if (dirty & /*option*/ 512) art_changes.name = /*option*/ ctx[9].value;
    			if (dirty & /*spin*/ 2) art_changes.spin = /*spin*/ ctx[1];
    			art.$set(art_changes);
    			if ((!current || dirty & /*option*/ 512) && t1_value !== (t1_value = /*option*/ ctx[9].value + "")) set_data_dev(t1, t1_value);
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
    			attr_dev(a, "href", a_href_value = "#/" + /*$project*/ ctx[5].name + "/build/art/" + /*value*/ ctx[0]);
    			attr_dev(a, "class", "ml-1");
    			add_location(a, file$f, 11, 2, 287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1) set_data_dev(t1, /*value*/ ctx[0]);

    			if (dirty & /*$project, value*/ 33 && a_href_value !== (a_href_value = "#/" + /*$project*/ ctx[5].name + "/build/art/" + /*value*/ ctx[0])) {
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

    function create_fragment$h(ctx) {
    	let div1;
    	let strong;
    	let t0;
    	let div0;
    	let inputselect;
    	let updating_value;
    	let t1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

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
    				({ option }) => ({ 9: option }),
    				({ option }) => option ? 512 : 0
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
    			strong = element("strong");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(inputselect.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			add_location(strong, file$f, 1, 1, 27);
    			add_location(div0, file$f, 4, 1, 62);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, strong);

    			if (default_slot) {
    				default_slot.m(strong, null);
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

    			if (dirty & /*$$scope, option, spin*/ 770) {
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
    			transition_in(default_slot, local);
    			transition_in(inputselect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(inputselect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(inputselect);
    			if (if_block) if_block.d();
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
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(5, $project = $$value));
    	let { value = null } = $$props;
    	let { spin = 0 } = $$props;
    	let { name = "graphic-picker" } = $$props;
    	let { placeholder = "Select art" } = $$props;
    	const writable_props = ["value", "spin", "name", "placeholder"];

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
    		if ("spin" in $$props) $$invalidate(1, spin = $$props.spin);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("placeholder" in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Art,
    		project,
    		InputSelect,
    		value,
    		spin,
    		name,
    		placeholder,
    		options,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
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
    		if ($$self.$$.dirty & /*$project*/ 32) {
    			 $$invalidate(4, options = Object.keys($project.art).sort());
    		}
    	};

    	return [
    		value,
    		spin,
    		name,
    		placeholder,
    		options,
    		$project,
    		$$slots,
    		inputselect_value_binding,
    		$$scope
    	];
    }

    class FieldArtPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			value: 0,
    			spin: 1,
    			name: 2,
    			placeholder: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldArtPicker",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldArtPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
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

    /* src\components\FieldCheckbox.svelte generated by Svelte v3.24.1 */

    const file$g = "src\\components\\FieldCheckbox.svelte";

    function create_fragment$i(ctx) {
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
    			add_location(input, file$g, 2, 2, 55);
    			attr_dev(label, "class", "form-check-label");
    			attr_dev(label, "for", /*name*/ ctx[1]);
    			add_location(label, file$g, 3, 2, 139);
    			attr_dev(div0, "class", "form-check");
    			add_location(div0, file$g, 1, 1, 27);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$g, 0, 0, 0);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { checked: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldCheckbox",
    			options,
    			id: create_fragment$i.name
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

    /* src\pages\Build\BlockBuilder.svelte generated by Svelte v3.24.1 */
    const file$h = "src\\pages\\Build\\BlockBuilder.svelte";

    // (3:2) <FieldText name="name" bind:value={input.name}>
    function create_default_slot_9(ctx) {
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
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(3:2) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (4:2) <FieldArtPicker bind:value={input.graphic}>
    function create_default_slot_8(ctx) {
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
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(4:2) <FieldArtPicker bind:value={input.graphic}>",
    		ctx
    	});

    	return block;
    }

    // (5:2) <FieldCheckbox name="solid" bind:checked={input.solid}>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Solid? (if not checked, things will just move through it)");
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
    		source: "(5:2) <FieldCheckbox name=\\\"solid\\\" bind:checked={input.solid}>",
    		ctx
    	});

    	return block;
    }

    // (6:2) <FieldCheckbox name="consumable" bind:checked={input.consumable}>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Consumable by player?");
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
    		source: "(6:2) <FieldCheckbox name=\\\"consumable\\\" bind:checked={input.consumable}>",
    		ctx
    	});

    	return block;
    }

    // (7:2) {#if input.consumable}
    function create_if_block_1$7(ctx) {
    	let fieldnumber0;
    	let updating_value;
    	let t;
    	let fieldnumber1;
    	let updating_value_1;
    	let current;

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "healthOnConsume",
    		$$slots: { default: [create_default_slot_5] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].healthOnConsume !== void 0) {
    		fieldnumber0_props.value = /*input*/ ctx[0].healthOnConsume;
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
    		name: "scoreOnConsume",
    		$$slots: { default: [create_default_slot_4$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].scoreOnConsume !== void 0) {
    		fieldnumber1_props.value = /*input*/ ctx[0].scoreOnConsume;
    	}

    	fieldnumber1 = new FieldNumber({
    			props: fieldnumber1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber1, "value", fieldnumber1_value_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldnumber0.$$.fragment);
    			t = space();
    			create_component(fieldnumber1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldnumber0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(fieldnumber1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].healthOnConsume;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].scoreOnConsume;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldnumber0.$$.fragment, local);
    			transition_in(fieldnumber1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldnumber0.$$.fragment, local);
    			transition_out(fieldnumber1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldnumber0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(fieldnumber1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(7:2) {#if input.consumable}",
    		ctx
    	});

    	return block;
    }

    // (8:3) <FieldNumber name="healthOnConsume" bind:value={input.healthOnConsume}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Health on consume?");
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
    		source: "(8:3) <FieldNumber name=\\\"healthOnConsume\\\" bind:value={input.healthOnConsume}>",
    		ctx
    	});

    	return block;
    }

    // (9:3) <FieldNumber name="scoreOnConsume" bind:value={input.scoreOnConsume}>
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Score on consume?");
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
    		source: "(9:3) <FieldNumber name=\\\"scoreOnConsume\\\" bind:value={input.scoreOnConsume}>",
    		ctx
    	});

    	return block;
    }

    // (11:2) <FieldCheckbox name="throwOnTouch" bind:checked={input.throwOnTouch}>
    function create_default_slot_3$1(ctx) {
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
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(11:2) <FieldCheckbox name=\\\"throwOnTouch\\\" bind:checked={input.throwOnTouch}>",
    		ctx
    	});

    	return block;
    }

    // (12:2) <FieldNumber name="damage" bind:value={input.damage}>
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Damage (when players or enemies touch this block, how much damage should they take?)");
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
    		source: "(12:2) <FieldNumber name=\\\"damage\\\" bind:value={input.damage}>",
    		ctx
    	});

    	return block;
    }

    // (16:3) {#if !isAdding}
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
    			add_location(button, file$h, 16, 4, 1068);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[15], false, false, false);
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
    		source: "(16:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (15:2) <span slot="buttons">
    function create_buttons_slot(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$h, 14, 2, 1021);
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
    		id: create_buttons_slot.name,
    		type: "slot",
    		source: "(15:2) <span slot=\\\"buttons\\\">",
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
    	let t4;
    	let fieldcheckbox2;
    	let updating_checked_2;
    	let t5;
    	let fieldnumber;
    	let updating_value_2;
    	let t6;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[7].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		$$slots: { default: [create_default_slot_9] },
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
    		$$slots: { default: [create_default_slot_8] },
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
    		$$slots: { default: [create_default_slot_7] },
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
    		name: "consumable",
    		$$slots: { default: [create_default_slot_6] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].consumable !== void 0) {
    		fieldcheckbox1_props.checked = /*input*/ ctx[0].consumable;
    	}

    	fieldcheckbox1 = new FieldCheckbox({
    			props: fieldcheckbox1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox1, "checked", fieldcheckbox1_checked_binding));
    	let if_block = /*input*/ ctx[0].consumable && create_if_block_1$7(ctx);

    	function fieldcheckbox2_checked_binding(value) {
    		/*fieldcheckbox2_checked_binding*/ ctx[13].call(null, value);
    	}

    	let fieldcheckbox2_props = {
    		name: "throwOnTouch",
    		$$slots: { default: [create_default_slot_3$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].throwOnTouch !== void 0) {
    		fieldcheckbox2_props.checked = /*input*/ ctx[0].throwOnTouch;
    	}

    	fieldcheckbox2 = new FieldCheckbox({
    			props: fieldcheckbox2_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox2, "checked", fieldcheckbox2_checked_binding));

    	function fieldnumber_value_binding(value) {
    		/*fieldnumber_value_binding*/ ctx[14].call(null, value);
    	}

    	let fieldnumber_props = {
    		name: "damage",
    		$$slots: { default: [create_default_slot_2$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].damage !== void 0) {
    		fieldnumber_props.value = /*input*/ ctx[0].damage;
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
    			if (if_block) if_block.c();
    			t4 = space();
    			create_component(fieldcheckbox2.$$.fragment);
    			t5 = space();
    			create_component(fieldnumber.$$.fragment);
    			t6 = space();
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
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(fieldcheckbox2, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(fieldnumber, target, anchor);
    			insert_dev(target, t6, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				fieldtext_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext.$set(fieldtext_changes);
    			const fieldartpicker_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				fieldartpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker_changes.value = /*input*/ ctx[0].graphic;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker.$set(fieldartpicker_changes);
    			const fieldcheckbox0_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				fieldcheckbox0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*input*/ 1) {
    				updating_checked = true;
    				fieldcheckbox0_changes.checked = /*input*/ ctx[0].solid;
    				add_flush_callback(() => updating_checked = false);
    			}

    			fieldcheckbox0.$set(fieldcheckbox0_changes);
    			const fieldcheckbox1_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				fieldcheckbox1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked_1 && dirty & /*input*/ 1) {
    				updating_checked_1 = true;
    				fieldcheckbox1_changes.checked = /*input*/ ctx[0].consumable;
    				add_flush_callback(() => updating_checked_1 = false);
    			}

    			fieldcheckbox1.$set(fieldcheckbox1_changes);

    			if (/*input*/ ctx[0].consumable) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*input*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t4.parentNode, t4);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const fieldcheckbox2_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				fieldcheckbox2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked_2 && dirty & /*input*/ 1) {
    				updating_checked_2 = true;
    				fieldcheckbox2_changes.checked = /*input*/ ctx[0].throwOnTouch;
    				add_flush_callback(() => updating_checked_2 = false);
    			}

    			fieldcheckbox2.$set(fieldcheckbox2_changes);
    			const fieldnumber_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				fieldnumber_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber_changes.value = /*input*/ ctx[0].damage;
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
    			transition_in(if_block);
    			transition_in(fieldcheckbox2.$$.fragment, local);
    			transition_in(fieldnumber.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldartpicker.$$.fragment, local);
    			transition_out(fieldcheckbox0.$$.fragment, local);
    			transition_out(fieldcheckbox1.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(fieldcheckbox2.$$.fragment, local);
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(fieldcheckbox2, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(fieldnumber, detaching);
    			if (detaching) detach_dev(t6);
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

    // (1:0) <BuildLayout tab="blocks" activeName={input.name} store={$project.blocks}>
    function create_default_slot$4(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$1],
    					buttons: [create_buttons_slot]
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

    			if (dirty & /*$$scope, input, isAdding*/ 524291) {
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
    		source: "(1:0) <BuildLayout tab=\\\"blocks\\\" activeName={input.name} store={$project.blocks}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let buildlayout;
    	let current;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "blocks",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[3].blocks,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buildlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(buildlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const buildlayout_changes = {};
    			if (dirty & /*input*/ 1) buildlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty & /*$project*/ 8) buildlayout_changes.store = /*$project*/ ctx[3].blocks;

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 524295) {
    				buildlayout_changes.$$scope = { dirty, ctx };
    			}

    			buildlayout.$set(buildlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buildlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buildlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buildlayout, detaching);
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

    function createDefaultInput$1() {
    	return {
    		name: "",
    		solid: true,
    		throwOnTouch: false,
    		damage: 0,
    		consumable: false,
    		healthOnConsume: 0,
    		scoreOnConsume: 0
    	};
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(3, $project = $$value));
    	let { params = {} } = $$props;
    	let input;

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(project, $project.blocks[input.name] = JSON.parse(JSON.stringify(input)), $project);
    		push(`/${$project.name}/build/blocks/${encodeURIComponent(input.name)}`);
    	}

    	function edit(name) {
    		if (!$project.blocks.hasOwnProperty(name)) return;

    		$$invalidate(0, input = {
    			...createDefaultInput$1(),
    			...JSON.parse(JSON.stringify($project.blocks[name]))
    		});
    	}

    	function create() {
    		$$invalidate(0, input = createDefaultInput$1());
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) {
    			delete $project.blocks[name];
    			project.set($project);
    			push(`/${$project.name}/build/blocks/new`);
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
    		input.consumable = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber0_value_binding(value) {
    		input.healthOnConsume = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber1_value_binding(value) {
    		input.scoreOnConsume = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox2_checked_binding(value) {
    		input.throwOnTouch = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber_value_binding(value) {
    		input.damage = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		BuildLayout,
    		FieldArtPicker,
    		FieldText,
    		FieldCheckbox,
    		FieldNumber,
    		Form,
    		project,
    		validator,
    		params,
    		input,
    		save,
    		edit,
    		create,
    		createDefaultInput: createDefaultInput$1,
    		del,
    		paramName,
    		isAdding,
    		hasChanges,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("paramName" in $$props) $$invalidate(16, paramName = $$props.paramName);
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
    			 $$invalidate(16, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty & /*paramName*/ 65536) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty & /*paramName*/ 65536) {
    			 $$invalidate(1, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty & /*input, $project*/ 9) {
    			 $$invalidate(2, hasChanges = input != null && !validator.equals(input, $project.blocks[input.name]));
    		}
    	};

    	return [
    		input,
    		isAdding,
    		hasChanges,
    		$project,
    		save,
    		del,
    		params,
    		fieldtext_value_binding,
    		fieldartpicker_value_binding,
    		fieldcheckbox0_checked_binding,
    		fieldcheckbox1_checked_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldcheckbox2_checked_binding,
    		fieldnumber_value_binding,
    		click_handler
    	];
    }

    class BlockBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlockBuilder",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get params() {
    		throw new Error("<BlockBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<BlockBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldAbilities.svelte generated by Svelte v3.24.1 */
    const file$i = "src\\components\\FieldAbilities.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[12] = list;
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (8:4) <FieldNumber name="ability-damage-{i}" bind:value={a.damage}>
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Damage");
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
    		source: "(8:4) <FieldNumber name=\\\"ability-damage-{i}\\\" bind:value={a.damage}>",
    		ctx
    	});

    	return block;
    }

    // (9:4) <FieldCheckbox name="ability-ranged-{i}" bind:checked={a.ranged}>
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Ranged?");
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
    		source: "(9:4) <FieldCheckbox name=\\\"ability-ranged-{i}\\\" bind:checked={a.ranged}>",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#if a.ranged}
    function create_if_block$a(ctx) {
    	let fieldnumber0;
    	let updating_value;
    	let t0;
    	let fieldnumber1;
    	let updating_value_1;
    	let t1;
    	let fieldnumber2;
    	let updating_value_2;
    	let t2;
    	let fieldartpicker0;
    	let updating_value_3;
    	let t3;
    	let fieldartpicker1;
    	let updating_value_4;
    	let current;

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[5].call(null, value, /*a*/ ctx[11]);
    	}

    	let fieldnumber0_props = {
    		name: "ability-projectile-velocity-x-" + /*i*/ ctx[13],
    		$$slots: { default: [create_default_slot_4$2] },
    		$$scope: { ctx }
    	};

    	if (/*a*/ ctx[11].projectileVelocityX !== void 0) {
    		fieldnumber0_props.value = /*a*/ ctx[11].projectileVelocityX;
    	}

    	fieldnumber0 = new FieldNumber({
    			props: fieldnumber0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber0, "value", fieldnumber0_value_binding));

    	function fieldnumber1_value_binding(value) {
    		/*fieldnumber1_value_binding*/ ctx[6].call(null, value, /*a*/ ctx[11]);
    	}

    	let fieldnumber1_props = {
    		name: "ability-projectile-velocity-y-" + /*i*/ ctx[13],
    		$$slots: { default: [create_default_slot_3$2] },
    		$$scope: { ctx }
    	};

    	if (/*a*/ ctx[11].projectileVelocityY !== void 0) {
    		fieldnumber1_props.value = /*a*/ ctx[11].projectileVelocityY;
    	}

    	fieldnumber1 = new FieldNumber({
    			props: fieldnumber1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber1, "value", fieldnumber1_value_binding));

    	function fieldnumber2_value_binding(value) {
    		/*fieldnumber2_value_binding*/ ctx[7].call(null, value, /*a*/ ctx[11]);
    	}

    	let fieldnumber2_props = {
    		name: "ability-projectile-gravity-multiplier-" + /*i*/ ctx[13],
    		min: 0,
    		step: 0.01,
    		max: 1,
    		$$slots: { default: [create_default_slot_2$2] },
    		$$scope: { ctx }
    	};

    	if (/*a*/ ctx[11].projectileGravityMultiplier !== void 0) {
    		fieldnumber2_props.value = /*a*/ ctx[11].projectileGravityMultiplier;
    	}

    	fieldnumber2 = new FieldNumber({
    			props: fieldnumber2_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber2, "value", fieldnumber2_value_binding));

    	function fieldartpicker0_value_binding(value) {
    		/*fieldartpicker0_value_binding*/ ctx[8].call(null, value, /*a*/ ctx[11]);
    	}

    	let fieldartpicker0_props = {
    		name: "ability-graphics-projectile-" + /*i*/ ctx[13],
    		$$slots: { default: [create_default_slot_1$2] },
    		$$scope: { ctx }
    	};

    	if (/*a*/ ctx[11].graphics.projectile !== void 0) {
    		fieldartpicker0_props.value = /*a*/ ctx[11].graphics.projectile;
    	}

    	fieldartpicker0 = new FieldArtPicker({
    			props: fieldartpicker0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker0, "value", fieldartpicker0_value_binding));

    	function fieldartpicker1_value_binding(value) {
    		/*fieldartpicker1_value_binding*/ ctx[9].call(null, value, /*a*/ ctx[11]);
    	}

    	let fieldartpicker1_props = {
    		name: "ability-graphics-character-" + /*i*/ ctx[13],
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	};

    	if (/*a*/ ctx[11].graphics.character !== void 0) {
    		fieldartpicker1_props.value = /*a*/ ctx[11].graphics.character;
    	}

    	fieldartpicker1 = new FieldArtPicker({
    			props: fieldartpicker1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker1, "value", fieldartpicker1_value_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldnumber0.$$.fragment);
    			t0 = space();
    			create_component(fieldnumber1.$$.fragment);
    			t1 = space();
    			create_component(fieldnumber2.$$.fragment);
    			t2 = space();
    			create_component(fieldartpicker0.$$.fragment);
    			t3 = space();
    			create_component(fieldartpicker1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldnumber0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldnumber1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldnumber2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(fieldartpicker0, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fieldartpicker1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*abilities*/ 1) {
    				updating_value = true;
    				fieldnumber0_changes.value = /*a*/ ctx[11].projectileVelocityX;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*abilities*/ 1) {
    				updating_value_1 = true;
    				fieldnumber1_changes.value = /*a*/ ctx[11].projectileVelocityY;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*abilities*/ 1) {
    				updating_value_2 = true;
    				fieldnumber2_changes.value = /*a*/ ctx[11].projectileGravityMultiplier;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldartpicker0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				fieldartpicker0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*abilities*/ 1) {
    				updating_value_3 = true;
    				fieldartpicker0_changes.value = /*a*/ ctx[11].graphics.projectile;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldartpicker0.$set(fieldartpicker0_changes);
    			const fieldartpicker1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				fieldartpicker1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*abilities*/ 1) {
    				updating_value_4 = true;
    				fieldartpicker1_changes.value = /*a*/ ctx[11].graphics.character;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldartpicker1.$set(fieldartpicker1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldnumber0.$$.fragment, local);
    			transition_in(fieldnumber1.$$.fragment, local);
    			transition_in(fieldnumber2.$$.fragment, local);
    			transition_in(fieldartpicker0.$$.fragment, local);
    			transition_in(fieldartpicker1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldnumber0.$$.fragment, local);
    			transition_out(fieldnumber1.$$.fragment, local);
    			transition_out(fieldnumber2.$$.fragment, local);
    			transition_out(fieldartpicker0.$$.fragment, local);
    			transition_out(fieldartpicker1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldnumber0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldnumber1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldnumber2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(fieldartpicker0, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fieldartpicker1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(10:4) {#if a.ranged}",
    		ctx
    	});

    	return block;
    }

    // (11:5) <FieldNumber name="ability-projectile-velocity-x-{i}" bind:value={a.projectileVelocityX}>
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Projectile velocity X");
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
    		source: "(11:5) <FieldNumber name=\\\"ability-projectile-velocity-x-{i}\\\" bind:value={a.projectileVelocityX}>",
    		ctx
    	});

    	return block;
    }

    // (12:5) <FieldNumber name="ability-projectile-velocity-y-{i}" bind:value={a.projectileVelocityY}>
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Projectile velocity Y");
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
    		source: "(12:5) <FieldNumber name=\\\"ability-projectile-velocity-y-{i}\\\" bind:value={a.projectileVelocityY}>",
    		ctx
    	});

    	return block;
    }

    // (13:5) <FieldNumber name="ability-projectile-gravity-multiplier-{i}" min={0} step={0.01} max={1} bind:value={a.projectileGravityMultiplier}>
    function create_default_slot_2$2(ctx) {
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
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(13:5) <FieldNumber name=\\\"ability-projectile-gravity-multiplier-{i}\\\" min={0} step={0.01} max={1} bind:value={a.projectileGravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (16:5) <FieldArtPicker name="ability-graphics-projectile-{i}" bind:value={a.graphics.projectile}>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Projectile graphic");
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(16:5) <FieldArtPicker name=\\\"ability-graphics-projectile-{i}\\\" bind:value={a.graphics.projectile}>",
    		ctx
    	});

    	return block;
    }

    // (17:5) <FieldArtPicker name="ability-graphics-character-{i}" bind:value={a.graphics.character}>
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Character graphic");
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
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(17:5) <FieldArtPicker name=\\\"ability-graphics-character-{i}\\\" bind:value={a.graphics.character}>",
    		ctx
    	});

    	return block;
    }

    // (5:1) {#each abilities as a, i}
    function create_each_block$5(ctx) {
    	let div1;
    	let div0;
    	let fieldnumber;
    	let updating_value;
    	let t0;
    	let fieldcheckbox;
    	let updating_checked;
    	let t1;
    	let current;

    	function fieldnumber_value_binding(value) {
    		/*fieldnumber_value_binding*/ ctx[3].call(null, value, /*a*/ ctx[11]);
    	}

    	let fieldnumber_props = {
    		name: "ability-damage-" + /*i*/ ctx[13],
    		$$slots: { default: [create_default_slot_6$1] },
    		$$scope: { ctx }
    	};

    	if (/*a*/ ctx[11].damage !== void 0) {
    		fieldnumber_props.value = /*a*/ ctx[11].damage;
    	}

    	fieldnumber = new FieldNumber({ props: fieldnumber_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldnumber, "value", fieldnumber_value_binding));

    	function fieldcheckbox_checked_binding(value) {
    		/*fieldcheckbox_checked_binding*/ ctx[4].call(null, value, /*a*/ ctx[11]);
    	}

    	let fieldcheckbox_props = {
    		name: "ability-ranged-" + /*i*/ ctx[13],
    		$$slots: { default: [create_default_slot_5$1] },
    		$$scope: { ctx }
    	};

    	if (/*a*/ ctx[11].ranged !== void 0) {
    		fieldcheckbox_props.checked = /*a*/ ctx[11].ranged;
    	}

    	fieldcheckbox = new FieldCheckbox({
    			props: fieldcheckbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox, "checked", fieldcheckbox_checked_binding));
    	let if_block = /*a*/ ctx[11].ranged && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fieldnumber.$$.fragment);
    			t0 = space();
    			create_component(fieldcheckbox.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$i, 6, 3, 121);
    			attr_dev(div1, "class", "card bg-light");
    			add_location(div1, file$i, 5, 2, 89);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(fieldnumber, div0, null);
    			append_dev(div0, t0);
    			mount_component(fieldcheckbox, div0, null);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const fieldnumber_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				fieldnumber_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*abilities*/ 1) {
    				updating_value = true;
    				fieldnumber_changes.value = /*a*/ ctx[11].damage;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldnumber.$set(fieldnumber_changes);
    			const fieldcheckbox_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				fieldcheckbox_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*abilities*/ 1) {
    				updating_checked = true;
    				fieldcheckbox_changes.checked = /*a*/ ctx[11].ranged;
    				add_flush_callback(() => updating_checked = false);
    			}

    			fieldcheckbox.$set(fieldcheckbox_changes);

    			if (/*a*/ ctx[11].ranged) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*abilities*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
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
    			transition_in(fieldnumber.$$.fragment, local);
    			transition_in(fieldcheckbox.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldnumber.$$.fragment, local);
    			transition_out(fieldcheckbox.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(fieldnumber);
    			destroy_component(fieldcheckbox);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(5:1) {#each abilities as a, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div1;
    	let label;
    	let t0;
    	let t1;
    	let div0;
    	let button;
    	let icon;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let each_value = /*abilities*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	icon = new Icon({
    			props: { data: addIcon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			if (default_slot) default_slot.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div0 = element("div");
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t2 = text("\r\n\t\t\tAdd ability");
    			add_location(label, file$i, 1, 1, 27);
    			attr_dev(button, "class", "btn btn-success btn-sm");
    			add_location(button, file$i, 22, 2, 1109);
    			add_location(div0, file$i, 21, 1, 1100);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			append_dev(div1, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			mount_component(icon, button, null);
    			append_dev(button, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addAbility*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			}

    			if (dirty & /*abilities*/ 1) {
    				each_value = /*abilities*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, t1);
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
    			transition_in(default_slot, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
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

    function createDefaultAbility() {
    	return {
    		ranged: false,
    		damage: 50,
    		projectileVelocityX: 500,
    		projectileVelocityY: 0,
    		projectileGravityMultiplier: 0.1,
    		graphics: { character: null, projectile: null }
    	}; // TODO: settings for emitters or other cool stuff Phaser can do?
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { abilities = [] } = $$props;

    	function addAbility() {
    		$$invalidate(0, abilities = abilities.concat(createDefaultAbility()));
    	}

    	const writable_props = ["abilities"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldAbilities> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldAbilities", $$slots, ['default']);

    	function fieldnumber_value_binding(value, a) {
    		a.damage = value;
    		$$invalidate(0, abilities);
    	}

    	function fieldcheckbox_checked_binding(value, a) {
    		a.ranged = value;
    		$$invalidate(0, abilities);
    	}

    	function fieldnumber0_value_binding(value, a) {
    		a.projectileVelocityX = value;
    		$$invalidate(0, abilities);
    	}

    	function fieldnumber1_value_binding(value, a) {
    		a.projectileVelocityY = value;
    		$$invalidate(0, abilities);
    	}

    	function fieldnumber2_value_binding(value, a) {
    		a.projectileGravityMultiplier = value;
    		$$invalidate(0, abilities);
    	}

    	function fieldartpicker0_value_binding(value, a) {
    		a.graphics.projectile = value;
    		$$invalidate(0, abilities);
    	}

    	function fieldartpicker1_value_binding(value, a) {
    		a.graphics.character = value;
    		$$invalidate(0, abilities);
    	}

    	$$self.$$set = $$props => {
    		if ("abilities" in $$props) $$invalidate(0, abilities = $$props.abilities);
    		if ("$$scope" in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		FieldCheckbox,
    		FieldNumber,
    		FieldArtPicker,
    		Icon,
    		plusIcon: addIcon,
    		abilities,
    		addAbility,
    		createDefaultAbility
    	});

    	$$self.$inject_state = $$props => {
    		if ("abilities" in $$props) $$invalidate(0, abilities = $$props.abilities);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		abilities,
    		addAbility,
    		$$slots,
    		fieldnumber_value_binding,
    		fieldcheckbox_checked_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldnumber2_value_binding,
    		fieldartpicker0_value_binding,
    		fieldartpicker1_value_binding,
    		$$scope
    	];
    }

    class FieldAbilities extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { abilities: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldAbilities",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get abilities() {
    		throw new Error("<FieldAbilities>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set abilities(value) {
    		throw new Error("<FieldAbilities>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\InputPngData.svelte generated by Svelte v3.24.1 */

    const { console: console_1$4 } = globals;
    const file$j = "src\\components\\InputPngData.svelte";

    // (2:0) {#if value != null}
    function create_if_block$b(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*value*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$j, 2, 1, 97);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1 && img.src !== (img_src_value = /*value*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(2:0) {#if value != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*value*/ ctx[0] != null && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "contenteditable", "true");
    			attr_dev(div, "class", "paste-container svelte-1vyqx50");
    			add_location(div, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "paste", /*onPaste*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*value*/ ctx[0] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
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
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
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
    	let { value = null } = $$props;

    	function onPaste(e) {
    		const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    		console.log("onpaste", JSON.stringify(items)); // will give you the mime types

    		for (let index in items) {
    			const item = items[index];

    			if (item.kind === "file") {
    				const blob = item.getAsFile();
    				const reader = new FileReader();

    				reader.onload = function (event) {
    					console.log("onload", event.target.result);
    					$$invalidate(0, value = event.target.result);
    				};

    				// data url!
    				// callback(blob)
    				console.log("blob", blob);

    				reader.readAsDataURL(blob);
    			}
    		}
    	}

    	const writable_props = ["value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<InputPngData> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("InputPngData", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ value, onPaste });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, onPaste];
    }

    class InputPngData extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputPngData",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get value() {
    		throw new Error("<InputPngData>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputPngData>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldRange.svelte generated by Svelte v3.24.1 */

    const file$k = "src\\components\\FieldRange.svelte";

    function create_fragment$m(ctx) {
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
    			add_location(label, file$k, 1, 1, 27);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", /*min*/ ctx[2]);
    			attr_dev(input, "max", /*max*/ ctx[3]);
    			attr_dev(input, "step", /*step*/ ctx[4]);
    			attr_dev(input, "class", "form-control");
    			add_location(input, file$k, 4, 1, 71);
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
    			append_dev(div, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[7]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[7])
    				];

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

    			if (dirty & /*value*/ 1) {
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
    			run_all(dispose);
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
    	let { value = null } = $$props;
    	let { name = "num" } = $$props;
    	let { min = null } = $$props;
    	let { max = null } = $$props;
    	let { step = 1 } = $$props;
    	const writable_props = ["value", "name", "min", "max", "step"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldRange> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldRange", $$slots, ['default']);

    	function input_change_input_handler() {
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

    	return [value, name, min, max, step, $$scope, $$slots, input_change_input_handler];
    }

    class FieldRange extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			value: 0,
    			name: 1,
    			min: 2,
    			max: 3,
    			step: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldRange",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FieldRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<FieldRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<FieldRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<FieldRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<FieldRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<FieldRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<FieldRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<FieldRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<FieldRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Build\CharacterBuilder.svelte generated by Svelte v3.24.1 */
    const file$l = "src\\pages\\Build\\CharacterBuilder.svelte";

    // (4:3) {#if !isAdding}
    function create_if_block$c(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$l, 4, 4, 172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false);
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
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(4:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (3:2) <span slot="buttons">
    function create_buttons_slot$1(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$l, 2, 2, 125);
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
    					if_block = create_if_block$c(ctx);
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
    		source: "(3:2) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (8:2) <FieldText name="name" bind:value={input.name}>
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
    		source: "(8:2) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (10:2) <FieldArtPicker bind:value={input.graphics.still}>
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Still graphics");
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
    		source: "(10:2) <FieldArtPicker bind:value={input.graphics.still}>",
    		ctx
    	});

    	return block;
    }

    // (11:2) <FieldArtPicker bind:value={input.graphics.moving}>
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Moving graphics");
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
    		source: "(11:2) <FieldArtPicker bind:value={input.graphics.moving}>",
    		ctx
    	});

    	return block;
    }

    // (12:2) <FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>
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
    		source: "(12:2) <FieldNumber name=\\\"maxVelocity\\\" min={0} bind:value={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (13:2) <FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>
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
    		source: "(13:2) <FieldNumber name=\\\"jumpVelocity\\\" min={0} bind:value={input.jumpVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (14:2) <FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>
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
    		source: "(14:2) <FieldNumber name=\\\"gravityMultiplier\\\" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (15:2) <FieldNumber name="maxHealth" bind:value={input.maxHealth}>
    function create_default_slot_5$2(ctx) {
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
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(15:2) <FieldNumber name=\\\"maxHealth\\\" bind:value={input.maxHealth}>",
    		ctx
    	});

    	return block;
    }

    // (17:2) <FieldCheckbox name="canFly" bind:checked={input.canFly}>
    function create_default_slot_4$3(ctx) {
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
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(17:2) <FieldCheckbox name=\\\"canFly\\\" bind:checked={input.canFly}>",
    		ctx
    	});

    	return block;
    }

    // (18:2) <FieldCheckbox name="canDoubleJump" bind:checked={input.canDoubleJump}>
    function create_default_slot_3$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Can double jump?");
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
    		source: "(18:2) <FieldCheckbox name=\\\"canDoubleJump\\\" bind:checked={input.canDoubleJump}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <FieldAbilities name="abilities" bind:abilities={input.abilities}>
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Abilities");
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
    		source: "(20:2) <FieldAbilities name=\\\"abilities\\\" bind:abilities={input.abilities}>",
    		ctx
    	});

    	return block;
    }

    // (2:1) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$3(ctx) {
    	let t0;
    	let fieldtext;
    	let updating_value;
    	let t1;
    	let fieldartpicker0;
    	let updating_value_1;
    	let t2;
    	let fieldartpicker1;
    	let updating_value_2;
    	let t3;
    	let fieldnumber0;
    	let updating_value_3;
    	let t4;
    	let fieldnumber1;
    	let updating_value_4;
    	let t5;
    	let fieldnumber2;
    	let updating_value_5;
    	let t6;
    	let fieldnumber3;
    	let updating_value_6;
    	let t7;
    	let fieldcheckbox0;
    	let updating_checked;
    	let t8;
    	let fieldcheckbox1;
    	let updating_checked_1;
    	let t9;
    	let fieldabilities;
    	let updating_abilities;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
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
    		$$slots: { default: [create_default_slot_10] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphics.still !== void 0) {
    		fieldartpicker0_props.value = /*input*/ ctx[0].graphics.still;
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
    		$$slots: { default: [create_default_slot_9$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphics.moving !== void 0) {
    		fieldartpicker1_props.value = /*input*/ ctx[0].graphics.moving;
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
    		/*fieldnumber1_value_binding*/ ctx[12].call(null, value);
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
    		/*fieldnumber2_value_binding*/ ctx[13].call(null, value);
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
    		/*fieldnumber3_value_binding*/ ctx[14].call(null, value);
    	}

    	let fieldnumber3_props = {
    		name: "maxHealth",
    		$$slots: { default: [create_default_slot_5$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].maxHealth !== void 0) {
    		fieldnumber3_props.value = /*input*/ ctx[0].maxHealth;
    	}

    	fieldnumber3 = new FieldNumber({
    			props: fieldnumber3_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber3, "value", fieldnumber3_value_binding));

    	function fieldcheckbox0_checked_binding(value) {
    		/*fieldcheckbox0_checked_binding*/ ctx[15].call(null, value);
    	}

    	let fieldcheckbox0_props = {
    		name: "canFly",
    		$$slots: { default: [create_default_slot_4$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].canFly !== void 0) {
    		fieldcheckbox0_props.checked = /*input*/ ctx[0].canFly;
    	}

    	fieldcheckbox0 = new FieldCheckbox({
    			props: fieldcheckbox0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox0, "checked", fieldcheckbox0_checked_binding));

    	function fieldcheckbox1_checked_binding(value) {
    		/*fieldcheckbox1_checked_binding*/ ctx[16].call(null, value);
    	}

    	let fieldcheckbox1_props = {
    		name: "canDoubleJump",
    		$$slots: { default: [create_default_slot_3$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].canDoubleJump !== void 0) {
    		fieldcheckbox1_props.checked = /*input*/ ctx[0].canDoubleJump;
    	}

    	fieldcheckbox1 = new FieldCheckbox({
    			props: fieldcheckbox1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox1, "checked", fieldcheckbox1_checked_binding));

    	function fieldabilities_abilities_binding(value) {
    		/*fieldabilities_abilities_binding*/ ctx[17].call(null, value);
    	}

    	let fieldabilities_props = {
    		name: "abilities",
    		$$slots: { default: [create_default_slot_2$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].abilities !== void 0) {
    		fieldabilities_props.abilities = /*input*/ ctx[0].abilities;
    	}

    	fieldabilities = new FieldAbilities({
    			props: fieldabilities_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldabilities, "abilities", fieldabilities_abilities_binding));

    	const block = {
    		c: function create() {
    			t0 = space();
    			create_component(fieldtext.$$.fragment);
    			t1 = space();
    			create_component(fieldartpicker0.$$.fragment);
    			t2 = space();
    			create_component(fieldartpicker1.$$.fragment);
    			t3 = space();
    			create_component(fieldnumber0.$$.fragment);
    			t4 = space();
    			create_component(fieldnumber1.$$.fragment);
    			t5 = space();
    			create_component(fieldnumber2.$$.fragment);
    			t6 = space();
    			create_component(fieldnumber3.$$.fragment);
    			t7 = space();
    			create_component(fieldcheckbox0.$$.fragment);
    			t8 = space();
    			create_component(fieldcheckbox1.$$.fragment);
    			t9 = space();
    			create_component(fieldabilities.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldartpicker0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(fieldartpicker1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fieldnumber0, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(fieldnumber1, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(fieldnumber2, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(fieldnumber3, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(fieldcheckbox0, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(fieldcheckbox1, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(fieldabilities, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldtext_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext.$set(fieldtext_changes);
    			const fieldartpicker0_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldartpicker0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker0_changes.value = /*input*/ ctx[0].graphics.still;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker0.$set(fieldartpicker0_changes);
    			const fieldartpicker1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldartpicker1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldartpicker1_changes.value = /*input*/ ctx[0].graphics.moving;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldartpicker1.$set(fieldartpicker1_changes);
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].maxVelocity;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].jumpVelocity;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_5 && dirty & /*input*/ 1) {
    				updating_value_5 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].gravityMultiplier;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_6 && dirty & /*input*/ 1) {
    				updating_value_6 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].maxHealth;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldcheckbox0_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldcheckbox0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*input*/ 1) {
    				updating_checked = true;
    				fieldcheckbox0_changes.checked = /*input*/ ctx[0].canFly;
    				add_flush_callback(() => updating_checked = false);
    			}

    			fieldcheckbox0.$set(fieldcheckbox0_changes);
    			const fieldcheckbox1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldcheckbox1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked_1 && dirty & /*input*/ 1) {
    				updating_checked_1 = true;
    				fieldcheckbox1_changes.checked = /*input*/ ctx[0].canDoubleJump;
    				add_flush_callback(() => updating_checked_1 = false);
    			}

    			fieldcheckbox1.$set(fieldcheckbox1_changes);
    			const fieldabilities_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				fieldabilities_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_abilities && dirty & /*input*/ 1) {
    				updating_abilities = true;
    				fieldabilities_changes.abilities = /*input*/ ctx[0].abilities;
    				add_flush_callback(() => updating_abilities = false);
    			}

    			fieldabilities.$set(fieldabilities_changes);
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
    			transition_in(fieldcheckbox0.$$.fragment, local);
    			transition_in(fieldcheckbox1.$$.fragment, local);
    			transition_in(fieldabilities.$$.fragment, local);
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
    			transition_out(fieldcheckbox0.$$.fragment, local);
    			transition_out(fieldcheckbox1.$$.fragment, local);
    			transition_out(fieldabilities.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldartpicker0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(fieldartpicker1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fieldnumber0, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(fieldnumber1, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(fieldnumber2, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(fieldnumber3, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(fieldcheckbox0, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(fieldcheckbox1, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(fieldabilities, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(2:1) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <BuildLayout tab="characters" activeName={input.name} store={$project.characters}>
    function create_default_slot$6(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$3],
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

    			if (dirty & /*$$scope, input, isAdding*/ 2097155) {
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
    		source: "(1:0) <BuildLayout tab=\\\"characters\\\" activeName={input.name} store={$project.characters}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let buildlayout;
    	let current;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "characters",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[3].characters,
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buildlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(buildlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const buildlayout_changes = {};
    			if (dirty & /*input*/ 1) buildlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty & /*$project*/ 8) buildlayout_changes.store = /*$project*/ ctx[3].characters;

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 2097159) {
    				buildlayout_changes.$$scope = { dirty, ctx };
    			}

    			buildlayout.$set(buildlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buildlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buildlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buildlayout, detaching);
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

    function createDefaultInput$2() {
    	return {
    		graphics: {
    			still: null,
    			moving: null,
    			spinning: null
    		},
    		name: "",
    		maxHealth: 100,
    		maxVelocity: 5,
    		jumpVelocity: 10,
    		gravityMultiplier: 1,
    		canFly: false,
    		canDoubleJump: false,
    		abilities: []
    	};
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(3, $project = $$value));
    	let { params = {} } = $$props;
    	let input = {};

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(project, $project.characters[input.name] = JSON.parse(JSON.stringify(input)), $project);
    		push(`/${$project.name}/build/characters/${encodeURIComponent(input.name)}`);
    	}

    	function edit(name) {
    		if (!$project.characters.hasOwnProperty(name)) return;

    		$$invalidate(0, input = {
    			...createDefaultInput$2(),
    			...JSON.parse(JSON.stringify($project.characters[name]))
    		});
    	}

    	function create() {
    		$$invalidate(0, input = createDefaultInput$2());
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) {
    			delete $project.characters[name];
    			project.set($project);
    			push(`/${$project.name}/build/characters/new`);
    		}
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CharacterBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CharacterBuilder", $$slots, []);
    	const click_handler = () => del(input.name);

    	function fieldtext_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker0_value_binding(value) {
    		input.graphics.still = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker1_value_binding(value) {
    		input.graphics.moving = value;
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
    		input.maxHealth = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox0_checked_binding(value) {
    		input.canFly = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox1_checked_binding(value) {
    		input.canDoubleJump = value;
    		$$invalidate(0, input);
    	}

    	function fieldabilities_abilities_binding(value) {
    		input.abilities = value;
    		$$invalidate(0, input);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		push,
    		removeIcon: deleteIcon,
    		Art,
    		BuildLayout,
    		FieldAbilities,
    		FieldArtPicker,
    		FieldCheckbox,
    		FieldNumber,
    		FieldPngData: InputPngData,
    		FieldRange,
    		FieldText,
    		Form,
    		Icon,
    		project,
    		validator,
    		params,
    		input,
    		save,
    		edit,
    		create,
    		createDefaultInput: createDefaultInput$2,
    		del,
    		paramName,
    		isAdding,
    		hasChanges,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("paramName" in $$props) $$invalidate(18, paramName = $$props.paramName);
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
    			 $$invalidate(18, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty & /*paramName*/ 262144) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty & /*paramName*/ 262144) {
    			 $$invalidate(1, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty & /*input, $project*/ 9) {
    			 $$invalidate(2, hasChanges = input != null && !validator.equals(input, $project.characters[input.name]));
    		}
    	};

    	return [
    		input,
    		isAdding,
    		hasChanges,
    		$project,
    		save,
    		del,
    		params,
    		click_handler,
    		fieldtext_value_binding,
    		fieldartpicker0_value_binding,
    		fieldartpicker1_value_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldnumber2_value_binding,
    		fieldnumber3_value_binding,
    		fieldcheckbox0_checked_binding,
    		fieldcheckbox1_checked_binding,
    		fieldabilities_abilities_binding
    	];
    }

    class CharacterBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CharacterBuilder",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get params() {
    		throw new Error("<CharacterBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<CharacterBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Build\EnemyBuilder.svelte generated by Svelte v3.24.1 */
    const file$m = "src\\pages\\Build\\EnemyBuilder.svelte";

    // (14:2) <FieldText name="name" bind:value={input.name}>
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
    		source: "(14:2) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (16:2) <FieldArtPicker bind:value={input.graphics.still}>
    function create_default_slot_9$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Still graphics");
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
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(16:2) <FieldArtPicker bind:value={input.graphics.still}>",
    		ctx
    	});

    	return block;
    }

    // (17:2) <FieldArtPicker bind:value={input.graphics.moving}>
    function create_default_slot_8$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Moving graphics");
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
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(17:2) <FieldArtPicker bind:value={input.graphics.moving}>",
    		ctx
    	});

    	return block;
    }

    // (18:2) <FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>
    function create_default_slot_7$2(ctx) {
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
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(18:2) <FieldNumber name=\\\"maxVelocity\\\" min={0} bind:value={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (19:2) <FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>
    function create_default_slot_6$3(ctx) {
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
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(19:2) <FieldNumber name=\\\"jumpVelocity\\\" min={0} bind:value={input.jumpVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>
    function create_default_slot_5$3(ctx) {
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
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(20:2) <FieldNumber name=\\\"gravityMultiplier\\\" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (21:2) <FieldNumber name="maxHealth" bind:value={input.maxHealth}>
    function create_default_slot_4$4(ctx) {
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
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(21:2) <FieldNumber name=\\\"maxHealth\\\" bind:value={input.maxHealth}>",
    		ctx
    	});

    	return block;
    }

    // (22:2) <FieldNumber name="score" bind:value={input.score}>
    function create_default_slot_3$4(ctx) {
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
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(22:2) <FieldNumber name=\\\"score\\\" bind:value={input.score}>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <FieldCheckbox name="canFly" bind:checked={input.canFly}>
    function create_default_slot_2$4(ctx) {
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
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(23:2) <FieldCheckbox name=\\\"canFly\\\" bind:checked={input.canFly}>",
    		ctx
    	});

    	return block;
    }

    // (25:3) {#if !isAdding}
    function create_if_block$d(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$m, 25, 4, 1252);
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
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(25:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (24:2) <span slot="buttons">
    function create_buttons_slot$2(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$m, 23, 2, 1205);
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
    					if_block = create_if_block$d(ctx);
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
    		source: "(24:2) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:1) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$4(ctx) {
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
    	let fieldcheckbox;
    	let updating_checked;
    	let t8;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[7].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		$$slots: { default: [create_default_slot_10$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext = new FieldText({ props: fieldtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext, "value", fieldtext_value_binding));

    	function fieldartpicker0_value_binding(value) {
    		/*fieldartpicker0_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldartpicker0_props = {
    		$$slots: { default: [create_default_slot_9$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphics.still !== void 0) {
    		fieldartpicker0_props.value = /*input*/ ctx[0].graphics.still;
    	}

    	fieldartpicker0 = new FieldArtPicker({
    			props: fieldartpicker0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker0, "value", fieldartpicker0_value_binding));

    	function fieldartpicker1_value_binding(value) {
    		/*fieldartpicker1_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldartpicker1_props = {
    		$$slots: { default: [create_default_slot_8$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphics.moving !== void 0) {
    		fieldartpicker1_props.value = /*input*/ ctx[0].graphics.moving;
    	}

    	fieldartpicker1 = new FieldArtPicker({
    			props: fieldartpicker1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker1, "value", fieldartpicker1_value_binding));

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[10].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "maxVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_7$2] },
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
    		/*fieldnumber1_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber1_props = {
    		name: "jumpVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_6$3] },
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
    		/*fieldnumber2_value_binding*/ ctx[12].call(null, value);
    	}

    	let fieldnumber2_props = {
    		name: "gravityMultiplier",
    		min: 0,
    		max: 2,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_5$3] },
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
    		/*fieldnumber3_value_binding*/ ctx[13].call(null, value);
    	}

    	let fieldnumber3_props = {
    		name: "maxHealth",
    		$$slots: { default: [create_default_slot_4$4] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].maxHealth !== void 0) {
    		fieldnumber3_props.value = /*input*/ ctx[0].maxHealth;
    	}

    	fieldnumber3 = new FieldNumber({
    			props: fieldnumber3_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber3, "value", fieldnumber3_value_binding));

    	function fieldnumber4_value_binding(value) {
    		/*fieldnumber4_value_binding*/ ctx[14].call(null, value);
    	}

    	let fieldnumber4_props = {
    		name: "score",
    		$$slots: { default: [create_default_slot_3$4] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].score !== void 0) {
    		fieldnumber4_props.value = /*input*/ ctx[0].score;
    	}

    	fieldnumber4 = new FieldNumber({
    			props: fieldnumber4_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber4, "value", fieldnumber4_value_binding));

    	function fieldcheckbox_checked_binding(value) {
    		/*fieldcheckbox_checked_binding*/ ctx[15].call(null, value);
    	}

    	let fieldcheckbox_props = {
    		name: "canFly",
    		$$slots: { default: [create_default_slot_2$4] },
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
    			create_component(fieldcheckbox.$$.fragment);
    			t8 = space();
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
    			mount_component(fieldcheckbox, target, anchor);
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
    			const fieldartpicker0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldartpicker0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker0_changes.value = /*input*/ ctx[0].graphics.still;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker0.$set(fieldartpicker0_changes);
    			const fieldartpicker1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldartpicker1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldartpicker1_changes.value = /*input*/ ctx[0].graphics.moving;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldartpicker1.$set(fieldartpicker1_changes);
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].maxVelocity;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].jumpVelocity;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_5 && dirty & /*input*/ 1) {
    				updating_value_5 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].gravityMultiplier;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_6 && dirty & /*input*/ 1) {
    				updating_value_6 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].maxHealth;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldnumber4_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_7 && dirty & /*input*/ 1) {
    				updating_value_7 = true;
    				fieldnumber4_changes.value = /*input*/ ctx[0].score;
    				add_flush_callback(() => updating_value_7 = false);
    			}

    			fieldnumber4.$set(fieldnumber4_changes);
    			const fieldcheckbox_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
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
    			destroy_component(fieldcheckbox, detaching);
    			if (detaching) detach_dev(t8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(13:1) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (12:0) <BuildLayout tab="enemies" activeName={input.name} store={$project.enemies}>
    function create_default_slot$7(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$4],
    					buttons: [create_buttons_slot$2]
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
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(12:0) <BuildLayout tab=\\\"enemies\\\" activeName={input.name} store={$project.enemies}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let buildlayout;
    	let current;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "enemies",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[3].enemies,
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buildlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(buildlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const buildlayout_changes = {};
    			if (dirty & /*input*/ 1) buildlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty & /*$project*/ 8) buildlayout_changes.store = /*$project*/ ctx[3].enemies;

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 1048583) {
    				buildlayout_changes.$$scope = { dirty, ctx };
    			}

    			buildlayout.$set(buildlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buildlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buildlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buildlayout, detaching);
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

    function createDefaultInput$3() {
    	return {
    		graphics: { still: null, moving: null },
    		name: "",
    		maxHealth: 100,
    		maxVelocity: 5,
    		jumpVelocity: 10,
    		gravityMultiplier: 1,
    		score: 1
    	};
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(3, $project = $$value));
    	let { params = {} } = $$props;
    	let input;

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(project, $project.enemies[input.name] = JSON.parse(JSON.stringify(input)), $project);
    		push(`/${$project.name}/build/enemies/${encodeURIComponent(input.name)}`);
    	}

    	function edit(name) {
    		if (!$project.enemies.hasOwnProperty(name)) return;

    		$$invalidate(0, input = {
    			...createDefaultInput$3(),
    			...JSON.parse(JSON.stringify($project.enemies[name]))
    		});
    	}

    	function create() {
    		$$invalidate(0, input = createDefaultInput$3());
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) {
    			delete $project.enemies[name];
    			project.set($project);
    			push(`/${$project.name}/build/enemies/new`);
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

    	function fieldartpicker0_value_binding(value) {
    		input.graphics.still = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker1_value_binding(value) {
    		input.graphics.moving = value;
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
    		input.maxHealth = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber4_value_binding(value) {
    		input.score = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox_checked_binding(value) {
    		input.canFly = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		BuildLayout,
    		FieldArtPicker,
    		FieldCheckbox,
    		FieldNumber,
    		FieldText,
    		Form,
    		project,
    		validator,
    		params,
    		input,
    		save,
    		edit,
    		create,
    		createDefaultInput: createDefaultInput$3,
    		del,
    		paramName,
    		isAdding,
    		hasChanges,
    		$project
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

    		if ($$self.$$.dirty & /*input, $project*/ 9) {
    			 $$invalidate(2, hasChanges = input != null && !validator.equals(input, $project.enemies[input.name]));
    		}
    	};

    	return [
    		input,
    		isAdding,
    		hasChanges,
    		$project,
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
    		fieldcheckbox_checked_binding,
    		click_handler
    	];
    }

    class EnemyBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EnemyBuilder",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get params() {
    		throw new Error("<EnemyBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EnemyBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldCharacterPicker.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$4 } = globals;
    const file$n = "src\\components\\FieldCharacterPicker.svelte";

    // (3:8) Characters
    function fallback_block$4(ctx) {
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
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(3:8) Characters",
    		ctx
    	});

    	return block;
    }

    // (6:2) <InputSelect multiple {options} bind:value let:option inline filterable={options.length > 2}>
    function create_default_slot$8(ctx) {
    	let art;
    	let t0;
    	let t1_value = /*option*/ ctx[7].value + "";
    	let t1;
    	let current;

    	art = new Art({
    			props: {
    				name: /*$project*/ ctx[2].characters[/*option*/ ctx[7].value].graphics.moving
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
    			if (dirty & /*$project, option*/ 132) art_changes.name = /*$project*/ ctx[2].characters[/*option*/ ctx[7].value].graphics.moving;
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
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(6:2) <InputSelect multiple {options} bind:value let:option inline filterable={options.length > 2}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div1;
    	let label;
    	let t;
    	let div0;
    	let inputselect;
    	let updating_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	const default_slot_or_fallback = default_slot || fallback_block$4(ctx);

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
    				create_default_slot$8,
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
    			add_location(label, file$n, 1, 1, 27);
    			add_location(div0, file$n, 4, 1, 89);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$n, 0, 0, 0);
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

    			if (dirty & /*$$scope, option, $project*/ 164) {
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(2, $project = $$value));
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
    		project,
    		Art,
    		InputSelect,
    		value,
    		toggle,
    		options,
    		$project
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
    		if ($$self.$$.dirty & /*$project*/ 4) {
    			 $$invalidate(1, options = Object.keys($project.characters));
    		}
    	};

    	return [value, options, $project, $$slots, inputselect_value_binding, $$scope];
    }

    class FieldCharacterPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldCharacterPicker",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldCharacterPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FieldCharacterPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldMultiSelect.svelte generated by Svelte v3.24.1 */

    const file$o = "src\\components\\FieldMultiSelect.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each options as option}
    function create_each_block$6(ctx) {
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
    			add_location(option, file$o, 6, 3, 171);
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
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(6:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
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
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
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
    			add_location(label, file$o, 1, 1, 27);
    			select.multiple = true;
    			attr_dev(select, "name", /*name*/ ctx[1]);
    			attr_dev(select, "id", /*name*/ ctx[1]);
    			attr_dev(select, "class", "form-control");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$o, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$o, 0, 0, 0);
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
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { value: 0, name: 1, options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldMultiSelect",
    			options,
    			id: create_fragment$q.name
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

    /* src\components\Level.svelte generated by Svelte v3.24.1 */
    const file$p = "src\\components\\Level.svelte";

    function create_fragment$r(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", /*width*/ ctx[0]);
    			attr_dev(canvas_1, "height", /*height*/ ctx[1]);
    			attr_dev(canvas_1, "class", "svelte-q52jml");
    			add_location(canvas_1, file$p, 0, 0, 0);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const artScale$1 = 1;

    function instance$r($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(9, $project = $$value));
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
    		let art = $project.art[artName];
    		let src = art.png;
    		let drawing = imageCache[artName];

    		const drawThisImage = () => {
    			const draw = () => {
    				context.drawImage(drawing, x, height - y - art.height * artScale$1, drawing.width * artScale$1, drawing.height * artScale$1);
    			};

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
    		project,
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
    		$project
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
    			 if (canvas != null) {
    				$$invalidate(8, context = canvas.getContext("2d"));
    			}
    		}

    		if ($$self.$$.dirty & /*blocks, width, height, context, $project, enemies, canvas*/ 799) {
    			 if (blocks != null && width != null && height != null && context != null) {
    				context.clearRect(0, 0, width, height);
    				$$invalidate(8, context.imageSmoothingEnabled = false, context);
    				blocks.forEach(b => drawOnCanvas($project.blocks[b.name].graphic, b.x, b.y));

    				if (enemies != null) {
    					enemies.forEach(e => drawOnCanvas($project.enemies[e.name].graphics.still, e.x, e.y));
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

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
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
    			id: create_fragment$r.name
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

    /* src\components\LevelPreview.svelte generated by Svelte v3.24.1 */
    const file$q = "src\\components\\LevelPreview.svelte";

    // (1:0) {#if level}
    function create_if_block$e(ctx) {
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
    			add_location(img, file$q, 1, 1, 14);
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
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(1:0) {#if level}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let if_block_anchor;
    	let if_block = /*level*/ ctx[0] && create_if_block$e(ctx);

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
    					if_block = create_if_block$e(ctx);
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { level: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelPreview",
    			options,
    			id: create_fragment$s.name
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

    /* src\components\BuildDrawingTool.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$5 } = globals;
    const file$r = "src\\components\\BuildDrawingTool.svelte";

    // (5:3) <InputSelect      name="selected-block"      inline      placeholder="Place a block"      options={Object.keys($project.blocks).map(name => $project.blocks[name])}      let:option      valueProp="name"      bind:value={selectedBlock}      on:change={() => (selectedEnemy = null)}>
    function create_default_slot_1$5(ctx) {
    	let art;
    	let t0;
    	let t1_value = /*option*/ ctx[34].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*option*/ ctx[34].damage + "";
    	let t3;
    	let t4;
    	let t5_value = (/*option*/ ctx[34].solid ? "solid" : "background") + "";
    	let t5;
    	let t6;

    	let t7_value = (/*option*/ ctx[34].consumable
    	? "consumable for " + /*option*/ ctx[34].healthOnConsume + " health, " + /*option*/ ctx[34].healthOnConsume + " score"
    	: "") + "";

    	let t7;
    	let current;

    	art = new Art({
    			props: {
    				name: /*$project*/ ctx[9].blocks[/*option*/ ctx[34].name].graphic,
    				simple: true
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
    			t4 = text(" damage, ");
    			t5 = text(t5_value);
    			t6 = text(", ");
    			t7 = text(t7_value);
    		},
    		m: function mount(target, anchor) {
    			mount_component(art, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, t7, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const art_changes = {};
    			if (dirty[0] & /*$project*/ 512 | dirty[1] & /*option*/ 8) art_changes.name = /*$project*/ ctx[9].blocks[/*option*/ ctx[34].name].graphic;
    			art.$set(art_changes);
    			if ((!current || dirty[1] & /*option*/ 8) && t1_value !== (t1_value = /*option*/ ctx[34].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t3_value !== (t3_value = /*option*/ ctx[34].damage + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t5_value !== (t5_value = (/*option*/ ctx[34].solid ? "solid" : "background") + "")) set_data_dev(t5, t5_value);

    			if ((!current || dirty[1] & /*option*/ 8) && t7_value !== (t7_value = (/*option*/ ctx[34].consumable
    			? "consumable for " + /*option*/ ctx[34].healthOnConsume + " health, " + /*option*/ ctx[34].healthOnConsume + " score"
    			: "") + "")) set_data_dev(t7, t7_value);
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
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(t7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(5:3) <InputSelect      name=\\\"selected-block\\\"      inline      placeholder=\\\"Place a block\\\"      options={Object.keys($project.blocks).map(name => $project.blocks[name])}      let:option      valueProp=\\\"name\\\"      bind:value={selectedBlock}      on:change={() => (selectedEnemy = null)}>",
    		ctx
    	});

    	return block;
    }

    // (19:3) <InputSelect      name="selected-block"      inline      placeholder="Place an enemy"      options={Object.keys($project.enemies).map(name => $project.enemies[name])}      let:option      valueProp="name"      bind:value={selectedEnemy}      on:change={() => (selectedBlock = null)}>
    function create_default_slot$9(ctx) {
    	let art;
    	let t0;
    	let strong;
    	let t1_value = /*option*/ ctx[34].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*option*/ ctx[34].damage + "";
    	let t3;
    	let t4;
    	let t5_value = /*option*/ ctx[34].maxHealth + "";
    	let t5;
    	let t6;
    	let t7_value = /*option*/ ctx[34].maxVelocity + "";
    	let t7;
    	let t8;
    	let t9_value = /*option*/ ctx[34].score + "";
    	let t9;
    	let t10;
    	let current;

    	art = new Art({
    			props: {
    				name: /*$project*/ ctx[9].enemies[/*option*/ ctx[34].name].graphics.still,
    				simple: true
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
    			t4 = text(" damage, ");
    			t5 = text(t5_value);
    			t6 = text(" health, ");
    			t7 = text(t7_value);
    			t8 = text(" speed, ");
    			t9 = text(t9_value);
    			t10 = text(" score");
    			add_location(strong, file$r, 28, 4, 1096);
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
    			insert_dev(target, t9, anchor);
    			insert_dev(target, t10, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const art_changes = {};
    			if (dirty[0] & /*$project*/ 512 | dirty[1] & /*option*/ 8) art_changes.name = /*$project*/ ctx[9].enemies[/*option*/ ctx[34].name].graphics.still;
    			art.$set(art_changes);
    			if ((!current || dirty[1] & /*option*/ 8) && t1_value !== (t1_value = /*option*/ ctx[34].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t3_value !== (t3_value = /*option*/ ctx[34].damage + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t5_value !== (t5_value = /*option*/ ctx[34].maxHealth + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t7_value !== (t7_value = /*option*/ ctx[34].maxVelocity + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t9_value !== (t9_value = /*option*/ ctx[34].score + "")) set_data_dev(t9, t9_value);
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
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(t10);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(19:3) <InputSelect      name=\\\"selected-block\\\"      inline      placeholder=\\\"Place an enemy\\\"      options={Object.keys($project.enemies).map(name => $project.enemies[name])}      let:option      valueProp=\\\"name\\\"      bind:value={selectedEnemy}      on:change={() => (selectedBlock = null)}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
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

    	levelpreview.$on("pan", /*onPreviewPan*/ ctx[11]);

    	function inputselect0_value_binding(value) {
    		/*inputselect0_value_binding*/ ctx[17].call(null, value);
    	}

    	let inputselect0_props = {
    		name: "selected-block",
    		inline: true,
    		placeholder: "Place a block",
    		options: Object.keys(/*$project*/ ctx[9].blocks).map(/*func*/ ctx[16]),
    		valueProp: "name",
    		$$slots: {
    			default: [
    				create_default_slot_1$5,
    				({ option }) => ({ 34: option }),
    				({ option }) => [0, option ? 8 : 0]
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
    	inputselect0.$on("change", /*change_handler*/ ctx[18]);

    	function inputselect1_value_binding(value) {
    		/*inputselect1_value_binding*/ ctx[20].call(null, value);
    	}

    	let inputselect1_props = {
    		name: "selected-block",
    		inline: true,
    		placeholder: "Place an enemy",
    		options: Object.keys(/*$project*/ ctx[9].enemies).map(/*func_1*/ ctx[19]),
    		valueProp: "name",
    		$$slots: {
    			default: [
    				create_default_slot$9,
    				({ option }) => ({ 34: option }),
    				({ option }) => [0, option ? 8 : 0]
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
    	inputselect1.$on("change", /*change_handler_1*/ ctx[21]);

    	level = new Level({
    			props: {
    				blocks: /*blocks*/ ctx[1],
    				enemies: /*enemies*/ ctx[2],
    				width: /*width*/ ctx[7],
    				height: /*height*/ ctx[8]
    			},
    			$$inline: true
    		});

    	level.$on("draw", /*onLevelDraw*/ ctx[10]);

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
    			attr_dev(div0, "class", "svelte-74cv1g");
    			add_location(div0, file$r, 3, 2, 133);
    			attr_dev(div1, "class", "svelte-74cv1g");
    			add_location(div1, file$r, 17, 2, 725);
    			attr_dev(div2, "class", "tool-picker svelte-74cv1g");
    			add_location(div2, file$r, 2, 1, 104);
    			attr_dev(div3, "class", "level-container svelte-74cv1g");
    			set_style(div3, "background", /*background*/ ctx[3]);
    			set_style(div3, "height", /*height*/ ctx[8] + 18 + "px");
    			add_location(div3, file$r, 34, 1, 1274);
    			attr_dev(div4, "class", "drawing-tool svelte-74cv1g");
    			add_location(div4, file$r, 0, 0, 0);
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
    			/*div3_binding*/ ctx[22](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div3, "mousedown", /*onMouseDown*/ ctx[12], false, false, false),
    					listen_dev(div3, "mouseup", /*onMouseUp*/ ctx[14], false, false, false),
    					listen_dev(div3, "mousemove", /*onMouseMove*/ ctx[13], false, false, false),
    					listen_dev(div3, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[15]), false, true, false)
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
    			if (dirty[0] & /*$project*/ 512) inputselect0_changes.options = Object.keys(/*$project*/ ctx[9].blocks).map(/*func*/ ctx[16]);

    			if (dirty[0] & /*$project*/ 512 | dirty[1] & /*$$scope, option*/ 24) {
    				inputselect0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*selectedBlock*/ 16) {
    				updating_value = true;
    				inputselect0_changes.value = /*selectedBlock*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputselect0.$set(inputselect0_changes);
    			const inputselect1_changes = {};
    			if (dirty[0] & /*$project*/ 512) inputselect1_changes.options = Object.keys(/*$project*/ ctx[9].enemies).map(/*func_1*/ ctx[19]);

    			if (dirty[0] & /*$project*/ 512 | dirty[1] & /*$$scope, option*/ 24) {
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
    			/*div3_binding*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
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

    const blockSize = 40;
    const thumbnailScale = 8;

    function instance$t($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(9, $project = $$value));
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
    			const template = $project.blocks[selectedBlock];

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
    			const template = $project.enemies[selectedEnemy];

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
    		const template = $project.enemies[enemy.name];
    		return { ...template, ...enemy };
    	}

    	const writable_props = ["background", "thumbnail", "blocks", "enemies"];

    	Object_1$5.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BuildDrawingTool> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BuildDrawingTool", $$slots, []);

    	function contextmenu_handler(event) {
    		bubble($$self, event);
    	}

    	const func = name => $project.blocks[name];

    	function inputselect0_value_binding(value) {
    		selectedBlock = value;
    		$$invalidate(4, selectedBlock);
    	}

    	const change_handler = () => $$invalidate(5, selectedEnemy = null);
    	const func_1 = name => $project.enemies[name];

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
    		project,
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
    		$project
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
    		if ("highestXUsed" in $$props) $$invalidate(24, highestXUsed = $$props.highestXUsed);
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
    			 $$invalidate(24, highestXUsed = blocks.length > 0
    			? Math.max(...blocks.map(b => b.x + b.width))
    			: 0);
    		}

    		if ($$self.$$.dirty[0] & /*highestXUsed*/ 16777216) {
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
    		$project,
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

    class BuildDrawingTool extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$t,
    			create_fragment$t,
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
    			tagName: "BuildDrawingTool",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*thumbnail*/ ctx[0] === undefined && !("thumbnail" in props)) {
    			console.warn("<BuildDrawingTool> was created without expected prop 'thumbnail'");
    		}
    	}

    	get background() {
    		throw new Error("<BuildDrawingTool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<BuildDrawingTool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbnail() {
    		throw new Error("<BuildDrawingTool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbnail(value) {
    		throw new Error("<BuildDrawingTool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blocks() {
    		throw new Error("<BuildDrawingTool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blocks(value) {
    		throw new Error("<BuildDrawingTool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enemies() {
    		throw new Error("<BuildDrawingTool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enemies(value) {
    		throw new Error("<BuildDrawingTool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Build\LevelBuilder.svelte generated by Svelte v3.24.1 */
    const file$s = "src\\pages\\Build\\LevelBuilder.svelte";

    // (2:0) {#if input != null}
    function create_if_block$f(ctx) {
    	let buildlayout;
    	let current;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "levels",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[3].levels,
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(buildlayout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buildlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buildlayout_changes = {};
    			if (dirty & /*input*/ 1) buildlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty & /*$project*/ 8) buildlayout_changes.store = /*$project*/ ctx[3].levels;

    			if (dirty & /*$$scope, hasChanges, isAdding, input*/ 65543) {
    				buildlayout_changes.$$scope = { dirty, ctx };
    			}

    			buildlayout.$set(buildlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buildlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buildlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buildlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(2:0) {#if input != null}",
    		ctx
    	});

    	return block;
    }

    // (5:3) <FieldText name="name" bind:value={input.name}>
    function create_default_slot_3$5(ctx) {
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
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(5:3) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (6:3) <FieldCharacterPicker name="playableCharacters" bind:value={input.playableCharacters}>
    function create_default_slot_2$5(ctx) {
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
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(6:3) <FieldCharacterPicker name=\\\"playableCharacters\\\" bind:value={input.playableCharacters}>",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#if !isAdding}
    function create_if_block_1$8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$s, 15, 5, 732);
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
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(15:4) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (14:3) <span slot="buttons">
    function create_buttons_slot$3(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block_1$8(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$s, 13, 3, 683);
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
    					if_block = create_if_block_1$8(ctx);
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
    		source: "(14:3) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (4:2) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$6(ctx) {
    	let fieldtext;
    	let updating_value;
    	let t0;
    	let fieldcharacterpicker;
    	let updating_value_1;
    	let t1;
    	let div;
    	let label;
    	let t3;
    	let colorpicker;
    	let updating_value_2;
    	let t4;
    	let builddrawingtool;
    	let updating_thumbnail;
    	let updating_blocks;
    	let updating_enemies;
    	let t5;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[7].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		$$slots: { default: [create_default_slot_3$5] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext = new FieldText({ props: fieldtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext, "value", fieldtext_value_binding));

    	function fieldcharacterpicker_value_binding(value) {
    		/*fieldcharacterpicker_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldcharacterpicker_props = {
    		name: "playableCharacters",
    		$$slots: { default: [create_default_slot_2$5] },
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

    	function colorpicker_value_binding(value) {
    		/*colorpicker_value_binding*/ ctx[9].call(null, value);
    	}

    	let colorpicker_props = { name: "color" };

    	if (/*input*/ ctx[0].background !== void 0) {
    		colorpicker_props.value = /*input*/ ctx[0].background;
    	}

    	colorpicker = new ColorPicker({ props: colorpicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorpicker, "value", colorpicker_value_binding));

    	function builddrawingtool_thumbnail_binding(value) {
    		/*builddrawingtool_thumbnail_binding*/ ctx[10].call(null, value);
    	}

    	function builddrawingtool_blocks_binding(value) {
    		/*builddrawingtool_blocks_binding*/ ctx[11].call(null, value);
    	}

    	function builddrawingtool_enemies_binding(value) {
    		/*builddrawingtool_enemies_binding*/ ctx[12].call(null, value);
    	}

    	let builddrawingtool_props = { background: /*input*/ ctx[0].background };

    	if (/*input*/ ctx[0].thumbnail !== void 0) {
    		builddrawingtool_props.thumbnail = /*input*/ ctx[0].thumbnail;
    	}

    	if (/*input*/ ctx[0].blocks !== void 0) {
    		builddrawingtool_props.blocks = /*input*/ ctx[0].blocks;
    	}

    	if (/*input*/ ctx[0].enemies !== void 0) {
    		builddrawingtool_props.enemies = /*input*/ ctx[0].enemies;
    	}

    	builddrawingtool = new BuildDrawingTool({
    			props: builddrawingtool_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(builddrawingtool, "thumbnail", builddrawingtool_thumbnail_binding));
    	binding_callbacks.push(() => bind(builddrawingtool, "blocks", builddrawingtool_blocks_binding));
    	binding_callbacks.push(() => bind(builddrawingtool, "enemies", builddrawingtool_enemies_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext.$$.fragment);
    			t0 = space();
    			create_component(fieldcharacterpicker.$$.fragment);
    			t1 = space();
    			div = element("div");
    			label = element("label");
    			label.textContent = "Background color";
    			t3 = space();
    			create_component(colorpicker.$$.fragment);
    			t4 = space();
    			create_component(builddrawingtool.$$.fragment);
    			t5 = space();
    			attr_dev(label, "for", "color");
    			add_location(label, file$s, 9, 4, 416);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$s, 8, 3, 386);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldcharacterpicker, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t3);
    			mount_component(colorpicker, div, null);
    			insert_dev(target, t4, anchor);
    			mount_component(builddrawingtool, target, anchor);
    			insert_dev(target, t5, anchor);
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
    			const colorpicker_changes = {};

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				colorpicker_changes.value = /*input*/ ctx[0].background;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			colorpicker.$set(colorpicker_changes);
    			const builddrawingtool_changes = {};
    			if (dirty & /*input*/ 1) builddrawingtool_changes.background = /*input*/ ctx[0].background;

    			if (!updating_thumbnail && dirty & /*input*/ 1) {
    				updating_thumbnail = true;
    				builddrawingtool_changes.thumbnail = /*input*/ ctx[0].thumbnail;
    				add_flush_callback(() => updating_thumbnail = false);
    			}

    			if (!updating_blocks && dirty & /*input*/ 1) {
    				updating_blocks = true;
    				builddrawingtool_changes.blocks = /*input*/ ctx[0].blocks;
    				add_flush_callback(() => updating_blocks = false);
    			}

    			if (!updating_enemies && dirty & /*input*/ 1) {
    				updating_enemies = true;
    				builddrawingtool_changes.enemies = /*input*/ ctx[0].enemies;
    				add_flush_callback(() => updating_enemies = false);
    			}

    			builddrawingtool.$set(builddrawingtool_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext.$$.fragment, local);
    			transition_in(fieldcharacterpicker.$$.fragment, local);
    			transition_in(colorpicker.$$.fragment, local);
    			transition_in(builddrawingtool.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldcharacterpicker.$$.fragment, local);
    			transition_out(colorpicker.$$.fragment, local);
    			transition_out(builddrawingtool.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldcharacterpicker, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(colorpicker);
    			if (detaching) detach_dev(t4);
    			destroy_component(builddrawingtool, detaching);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(4:2) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (3:1) <BuildLayout tab="levels" activeName={input.name} store={$project.levels}>
    function create_default_slot$a(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$6],
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
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(3:1) <BuildLayout tab=\\\"levels\\\" activeName={input.name} store={$project.levels}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let t;
    	let if_block_anchor;
    	let current;
    	let if_block = /*input*/ ctx[0] != null && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			t = text("Level builder\r\n");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
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
    					if_block = create_if_block$f(ctx);
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
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(3, $project = $$value));
    	let { params = {} } = $$props;
    	let input;

    	function save() {
    		if (validator.empty(input.name)) {
    			document.getElementById("name").focus();
    			return;
    		}

    		set_store_value(project, $project.levels[input.name] = JSON.parse(JSON.stringify(input)), $project);
    		push(`/${$project.name}/build/levels/${encodeURIComponent(input.name)}`);
    	}

    	async function edit(name) {
    		if (!$project.levels.hasOwnProperty(name)) return;
    		$$invalidate(0, input = null);
    		await tick();
    		$$invalidate(0, input = JSON.parse(JSON.stringify($project.levels[name])));
    	}

    	async function create() {
    		$$invalidate(0, input = null);
    		await tick();

    		$$invalidate(0, input = {
    			name: "",
    			playableCharacters: [],
    			background: "rgba(198, 244, 255, 255)",
    			blocks: [],
    			enemies: []
    		});
    	}

    	function del() {
    		if (confirm(`Are you sure you want to delete "${input.name}"?`)) {
    			delete $project.levels[input.name];
    			project.set($project);
    			push(`/${$project.name}/build/levels/new`);
    		}
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelBuilder", $$slots, []);

    	function fieldtext_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldcharacterpicker_value_binding(value) {
    		input.playableCharacters = value;
    		$$invalidate(0, input);
    	}

    	function colorpicker_value_binding(value) {
    		input.background = value;
    		$$invalidate(0, input);
    	}

    	function builddrawingtool_thumbnail_binding(value) {
    		input.thumbnail = value;
    		$$invalidate(0, input);
    	}

    	function builddrawingtool_blocks_binding(value) {
    		input.blocks = value;
    		$$invalidate(0, input);
    	}

    	function builddrawingtool_enemies_binding(value) {
    		input.enemies = value;
    		$$invalidate(0, input);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(6, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		tick,
    		project,
    		FieldCharacterPicker,
    		FieldCheckbox,
    		FieldArtPicker,
    		FieldMultiSelect,
    		FieldNumber,
    		FieldText,
    		Form,
    		BuildDrawingTool,
    		BuildLayout,
    		LevelPreview,
    		validator,
    		ColorPicker,
    		params,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		paramName,
    		isAdding,
    		hasChanges,
    		$project
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

    		if ($$self.$$.dirty & /*input, $project*/ 9) {
    			 $$invalidate(2, hasChanges = input != null && !validator.equals(input, $project.levels[input.name]));
    		}
    	};

    	return [
    		input,
    		isAdding,
    		hasChanges,
    		$project,
    		save,
    		del,
    		params,
    		fieldtext_value_binding,
    		fieldcharacterpicker_value_binding,
    		colorpicker_value_binding,
    		builddrawingtool_thumbnail_binding,
    		builddrawingtool_blocks_binding,
    		builddrawingtool_enemies_binding
    	];
    }

    class LevelBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilder",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get params() {
    		throw new Error("<LevelBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<LevelBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Build\Index.svelte generated by Svelte v3.24.1 */

    // (1:0) {#if $project != null && prefix != null}
    function create_if_block$g(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				prefix: /*prefix*/ ctx[0],
    				routes: /*routes*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*prefix*/ 1) router_changes.prefix = /*prefix*/ ctx[0];
    			router.$set(router_changes);
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
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(1:0) {#if $project != null && prefix != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$project*/ ctx[1] != null && /*prefix*/ ctx[0] != null && create_if_block$g(ctx);

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
    			if (/*$project*/ ctx[1] != null && /*prefix*/ ctx[0] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$project, prefix*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$g(ctx);
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
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(1, $project = $$value));
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
    		if ("params" in $$props) $$invalidate(3, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		Router,
    		ArtMaker,
    		BlockBuilder,
    		CharacterBuilder,
    		EnemyBuilder,
    		LevelBuilder,
    		project,
    		routes,
    		tab,
    		prefix,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(3, params = $$props.params);
    		if ("tab" in $$props) tab = $$props.tab;
    		if ("prefix" in $$props) $$invalidate(0, prefix = $$props.prefix);
    	};

    	let tab;
    	let prefix;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 8) {
    			 tab = params.tab || "art";
    		}

    		if ($$self.$$.dirty & /*$project*/ 2) {
    			 $$invalidate(0, prefix = `/${encodeURIComponent($project.name)}/build`);
    		}
    	};

    	return [prefix, $project, routes, params];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { params: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get params() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function componentToHex(c) {
    	var hex = c.toString(16);
    	return hex.length == 1 ? '0' + hex : hex
    }

    function rgbToHex(r, g, b) {
    	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
    }

    function rgbaStringToHex(rgbaString) {
    	const [r, g, b, a] = rgbaString
    		.replace('rgba(', '')
    		.replace('rgb(', '')
    		.replace(')', '')
    		.split(',')
    		.map(s => parseInt(s.trim()));
    	return rgbToHex(r, g, b)
    }

    class HealthBar {
    	constructor(scene, x, y, health, maxHealth) {
    		this.bar = new Phaser.GameObjects.Graphics(scene);
    		this.x = x;
    		this.y = y;
    		this.health = health;
    		this.maxHealth = maxHealth;
    		this.width = 80;
    		this.height = 12;

    		this.draw();

    		scene.add.existing(this.bar);
    	}

    	adjust(amount) {
    		this.health = Math.max(Math.min(this.maxHealth, this.health - amount), 0);
    		this.draw();
    		return this.health > 0
    	}

    	draw() {
    		this.bar.clear();

    		// BG
    		this.bar.fillStyle(0x000000);
    		this.bar.fillRect(this.x, this.y, this.width, this.height);

    		// Health
    		if (this.health < 30) {
    			this.bar.fillStyle(0xff0000);
    		} else {
    			this.bar.fillStyle(0x00ff00);
    		}
    		this.bar.fillRect(this.x + 1, this.y + 1, Math.floor((this.health / this.maxHealth) * (this.width - 2)), this.height - 2);
    	}

    	moveTo(sprite) {
    		this.bar.x = sprite.body.x + (sprite.width - this.width) / 2;
    		this.bar.y = sprite.body.y - sprite.body.halfHeight; // - 160 // not sure why the 150 is necessary here....
    	}

    	remove() {
    		this.bar.clear();
    	}
    }

    class LivingSprite extends Phaser.Physics.Arcade.Sprite {
    	constructor(scene, x, y, texture, template) {
    		super(scene, x, y, texture);

    		this.template = template;

    		scene.add.existing(this);
    		scene.physics.add.existing(this);

    		this.name = template.name;
    		this.hp = new HealthBar(scene, 0, 0, template.maxHealth, template.maxHealth);
    		this.alive = true;
    		// this.setCollideWorldBounds(true)
    	}

    	preUpdate(time, delta) {
    		super.preUpdate(time, delta);
    		this.hp.moveTo(this);

    		if (this.body.y > 1000) this.damage(this.template.maxHealth);
    	}

    	setGraphic(key) {
    		const art = this.template.graphics[key] || this.template.graphics.still;
    		if (art.animated) this.anims.play(this.getAnimationKey(art.name), true);
    		else this.setTexture(art.name);
    	}

    	getAnimationKey(key) {
    		return `${key}.animation`
    	}

    	damage(amount) {
    		this.alive = this.hp.adjust(amount);
    	}
    }

    class Enemy extends LivingSprite {
    	constructor(scene, x, y, texture, template, player, leashRange = 400) {
    		super(scene, x, y, texture, template);
    		this.target = player;
    		this.leashRange = leashRange;
    		this.moving = false;
    	}

    	preUpdate(time, delta) {
    		super.preUpdate(time, delta);

    		// move toward player if within leashRange
    		if (Math.abs(this.target.x - this.x) < this.leashRange) {
    			if (Math.abs(this.target.x - this.x) < 2) this.setVelocityX(0);
    			else if (this.target.x < this.x) {
    				this.setVelocityX(-this.template.maxVelocity);
    				this.flipX = true;
    			} else {
    				this.setVelocityX(this.template.maxVelocity);
    				this.flipX = false;
    			}

    			if ((this.body.touching.down || this.template.canFly) && this.target.y < this.y - this.height) {
    				this.setVelocityY(-this.template.jumpVelocity);
    			}

    			if (!this.moving) {
    				this.setGraphic('moving');
    				this.moving = true;
    			}
    		} else {
    			this.setVelocityX(0);
    			if (this.moving) {
    				this.setGraphic('still');
    				this.moving = false;
    			}
    		}
    	}

    	damage(amount) {
    		super.damage(amount);

    		if (!this.alive) {
    			this.disableBody(true, true);
    			this.hp.remove();
    		}
    	}
    }

    /* src\components\GameOver.svelte generated by Svelte v3.24.1 */

    const file$t = "src\\components\\GameOver.svelte";

    // (1:0) {#if player}
    function create_if_block$h(ctx) {
    	let div;
    	let t0;
    	let h1;
    	let t1;
    	let t2;
    	let t3;
    	let p;

    	function select_block_type(ctx, dirty) {
    		if (/*won*/ ctx[2]) return create_if_block_1$9;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Final score: ");
    			t2 = text(/*score*/ ctx[0]);
    			t3 = space();
    			p = element("p");
    			p.textContent = "Press enter or space to restart.";
    			attr_dev(h1, "class", "svelte-bg3cd6");
    			add_location(h1, file$t, 7, 2, 228);
    			attr_dev(p, "class", "svelte-bg3cd6");
    			add_location(p, file$t, 8, 2, 261);
    			attr_dev(div, "class", "game-over svelte-bg3cd6");
    			toggle_class(div, "won", /*won*/ ctx[2]);
    			add_location(div, file$t, 1, 1, 15);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(div, t3);
    			append_dev(div, p);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			}

    			if (dirty & /*score*/ 1) set_data_dev(t2, /*score*/ ctx[0]);

    			if (dirty & /*won*/ 4) {
    				toggle_class(div, "won", /*won*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(1:0) {#if player}",
    		ctx
    	});

    	return block;
    }

    // (5:2) {:else}
    function create_else_block$5(ctx) {
    	let h1;
    	let t0_value = /*player*/ ctx[1].name + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = text(" is dead now. You really let him down.");
    			attr_dev(h1, "class", "svelte-bg3cd6");
    			add_location(h1, file$t, 5, 3, 155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*player*/ 2 && t0_value !== (t0_value = /*player*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(5:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#if won}
    function create_if_block_1$9(ctx) {
    	let h1;
    	let t0;
    	let t1_value = /*player*/ ctx[1].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*level*/ ctx[3].name + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("You have guided ");
    			t1 = text(t1_value);
    			t2 = text(" to victory. ");
    			t3 = text(t3_value);
    			t4 = text(" complete!");
    			attr_dev(h1, "class", "svelte-bg3cd6");
    			add_location(h1, file$t, 3, 3, 66);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*player*/ 2 && t1_value !== (t1_value = /*player*/ ctx[1].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*level*/ 8 && t3_value !== (t3_value = /*level*/ ctx[3].name + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(3:2) {#if won}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let if_block_anchor;
    	let if_block = /*player*/ ctx[1] && create_if_block$h(ctx);

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
    					if_block = create_if_block$h(ctx);
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
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { score } = $$props;
    	let { player } = $$props;
    	let { won } = $$props;
    	let { level } = $$props;
    	const writable_props = ["score", "player", "won", "level"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameOver> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameOver", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("score" in $$props) $$invalidate(0, score = $$props.score);
    		if ("player" in $$props) $$invalidate(1, player = $$props.player);
    		if ("won" in $$props) $$invalidate(2, won = $$props.won);
    		if ("level" in $$props) $$invalidate(3, level = $$props.level);
    	};

    	$$self.$capture_state = () => ({ score, player, won, level });

    	$$self.$inject_state = $$props => {
    		if ("score" in $$props) $$invalidate(0, score = $$props.score);
    		if ("player" in $$props) $$invalidate(1, player = $$props.player);
    		if ("won" in $$props) $$invalidate(2, won = $$props.won);
    		if ("level" in $$props) $$invalidate(3, level = $$props.level);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [score, player, won, level];
    }

    class GameOver extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { score: 0, player: 1, won: 2, level: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameOver",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*score*/ ctx[0] === undefined && !("score" in props)) {
    			console.warn("<GameOver> was created without expected prop 'score'");
    		}

    		if (/*player*/ ctx[1] === undefined && !("player" in props)) {
    			console.warn("<GameOver> was created without expected prop 'player'");
    		}

    		if (/*won*/ ctx[2] === undefined && !("won" in props)) {
    			console.warn("<GameOver> was created without expected prop 'won'");
    		}

    		if (/*level*/ ctx[3] === undefined && !("level" in props)) {
    			console.warn("<GameOver> was created without expected prop 'level'");
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

    	get won() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set won(value) {
    		throw new Error("<GameOver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get level() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set level(value) {
    		throw new Error("<GameOver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Instructions.svelte generated by Svelte v3.24.1 */

    const file$u = "src\\components\\Instructions.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (3:2) {#each keyBinds as bind}
    function create_each_block$7(ctx) {
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
    			add_location(td0, file$u, 4, 4, 79);
    			attr_dev(td1, "class", "svelte-1d0wu93");
    			add_location(td1, file$u, 5, 4, 104);
    			add_location(tr, file$u, 3, 3, 69);
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
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(3:2) {#each keyBinds as bind}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let div;
    	let table;
    	let each_value = /*keyBinds*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(table, "class", "svelte-1d0wu93");
    			add_location(table, file$u, 1, 1, 29);
    			attr_dev(div, "class", "instructions svelte-1d0wu93");
    			add_location(div, file$u, 0, 0, 0);
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
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
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
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	const keyBinds = [
    		{
    			key: "Left + Right Arrow",
    			action: "Move"
    		},
    		{ key: "Space", action: "Jump" },
    		{ key: "R", action: "Spin Attack / Shield" },
    		{ key: "Enter", action: "Restart" }
    	]; // {
    	// 	key: 'P or Escape',
    	// 	action: 'Pause',

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
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Instructions",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* src\components\Paused.svelte generated by Svelte v3.24.1 */

    const file$v = "src\\components\\Paused.svelte";

    function create_fragment$y(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Paused";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Press p, escape, or space to resume.";
    			attr_dev(h1, "class", "svelte-1fed8vp");
    			add_location(h1, file$v, 1, 1, 23);
    			attr_dev(p, "class", "svelte-1fed8vp");
    			add_location(p, file$v, 2, 1, 41);
    			attr_dev(div, "class", "paused svelte-1fed8vp");
    			add_location(div, file$v, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$y($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Paused> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Paused", $$slots, []);
    	return [];
    }

    class Paused extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paused",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    class Player extends LivingSprite {
    	constructor(scene, x, y, texture, template, inputs) {
    		super(scene, x, y, texture, template);

    		this.inputs = inputs;

    		// TODO: let me jump through bottom of blocks?

    		// TODO: ditch when abilities are in place
    		this.spinning = false;
    	}

    	preUpdate(time, delta) {
    		super.preUpdate(time, delta);

    		// jumping
    		if (this.body.touching.down || this.template.canFly) {
    			if (Phaser.Input.Keyboard.JustDown(this.inputs.spacebarKey)) this.setVelocityY(-this.template.jumpVelocity);
    		}

    		// moving left
    		if (this.inputs.cursors.left.isDown && !this.inputs.cursors.right.isDown) {
    			const newVelocity =
    				this.body.touching.down || this.template.canFly
    					? -this.template.maxVelocity
    					: Math.max(this.body.velocity.x - this.template.maxVelocity / 15, -this.template.maxVelocity);
    			this.setVelocityX(newVelocity);
    			this.flipX = true;
    			this.setGraphic(this.spinning ? 'spinning' : 'moving');
    		} else if (this.inputs.cursors.right.isDown && !this.inputs.cursors.isDown) {
    			// moving right
    			const newVelocity =
    				this.body.touching.down || this.template.canFly
    					? this.template.maxVelocity
    					: Math.min(this.body.velocity.x + this.template.maxVelocity / 15, this.template.maxVelocity);

    			this.setVelocityX(newVelocity);
    			this.flipX = false;
    			this.setGraphic(this.spinning ? 'spinning' : 'moving');
    		} else if (this.body.touching.down) {
    			// stop if touching ground
    			this.setVelocityX(0);
    			this.setGraphic(this.spinning ? 'spinning' : 'still');
    		}

    		// r key to spin
    		if (Phaser.Input.Keyboard.JustDown(this.inputs.rKey) && this.template.canSpin) {
    			this.spinning = true;
    		} else if (Phaser.Input.Keyboard.JustUp(this.inputs.rKey)) {
    			this.spinning = false;
    		}

    		if (this.spinning) {
    			this.setAngularVelocity(1080 * (this.body.velocity.x < 0 ? -1 : 1));
    		} else {
    			// rotate player based on y velocity
    			this.setAngularVelocity(0);
    			this.setRotation((this.body.velocity.y / 1800) * (this.body.velocity.x < 0 ? -1 : 1));
    		}
    	}
    }

    /* src\components\Status.svelte generated by Svelte v3.24.1 */

    const file$w = "src\\components\\Status.svelte";

    function create_fragment$z(ctx) {
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
    			add_location(p0, file$w, 1, 1, 8);
    			attr_dev(p1, "class", "svelte-1ivfn85");
    			add_location(p1, file$w, 2, 1, 37);
    			attr_dev(p2, "class", "svelte-1ivfn85");
    			add_location(p2, file$w, 3, 1, 61);
    			attr_dev(div, "class", "svelte-1ivfn85");
    			add_location(div, file$w, 0, 0, 0);
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
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { level: 0, score: 1, enemyCount: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Status",
    			options,
    			id: create_fragment$z.name
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

    /* src\components\PhaserGame.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$6 } = globals;
    const file$x = "src\\components\\PhaserGame.svelte";

    // (2:1) {#if level != null && character != null}
    function create_if_block$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let div;
    	let current;
    	const if_block_creators = [create_if_block_1$a, create_if_block_2$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*gameOver*/ ctx[3]) return 0;
    		if (/*paused*/ ctx[6]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			div = element("div");
    			add_location(div, file$x, 7, 2, 191);
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[8](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				} else {
    					if_block = null;
    				}
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
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(2:1) {#if level != null && character != null}",
    		ctx
    	});

    	return block;
    }

    // (5:19) 
    function create_if_block_2$5(ctx) {
    	let paused_1;
    	let current;
    	paused_1 = new Paused({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(paused_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paused_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paused_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paused_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paused_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(5:19) ",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#if gameOver}
    function create_if_block_1$a(ctx) {
    	let gameover;
    	let current;

    	gameover = new GameOver({
    			props: {
    				score: /*score*/ ctx[5],
    				player: /*player*/ ctx[7],
    				won: /*gameWon*/ ctx[4],
    				level: /*level*/ ctx[0]
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
    			if (dirty[0] & /*score*/ 32) gameover_changes.score = /*score*/ ctx[5];
    			if (dirty[0] & /*player*/ 128) gameover_changes.player = /*player*/ ctx[7];
    			if (dirty[0] & /*gameWon*/ 16) gameover_changes.won = /*gameWon*/ ctx[4];
    			if (dirty[0] & /*level*/ 1) gameover_changes.level = /*level*/ ctx[0];
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
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(3:2) {#if gameOver}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let div;
    	let t0;
    	let status;
    	let t1;
    	let instructions;
    	let current;
    	let if_block = /*level*/ ctx[0] != null && /*character*/ ctx[1] != null && create_if_block$i(ctx);

    	status = new Status({
    			props: {
    				level: /*level*/ ctx[0],
    				score: /*score*/ ctx[5]
    			},
    			$$inline: true
    		});

    	instructions = new Instructions({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(status.$$.fragment);
    			t1 = space();
    			create_component(instructions.$$.fragment);
    			attr_dev(div, "class", "game-window svelte-177m75j");
    			add_location(div, file$x, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			mount_component(status, div, null);
    			append_dev(div, t1);
    			mount_component(instructions, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*level*/ ctx[0] != null && /*character*/ ctx[1] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*level, character*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const status_changes = {};
    			if (dirty[0] & /*level*/ 1) status_changes.level = /*level*/ ctx[0];
    			if (dirty[0] & /*score*/ 32) status_changes.score = /*score*/ ctx[5];
    			status.$set(status_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(status.$$.fragment, local);
    			transition_in(instructions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(status.$$.fragment, local);
    			transition_out(instructions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(status);
    			destroy_component(instructions);
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

    const leashRange = 400;
    const gravityPixelsPerSecond = 2000;

    function onEffectBlockCollision(sprite, block) {
    	sprite.damage(block.damage);
    	if (block.throwOnTouch) sprite.setVelocityY(-1000);
    }

    function onPlayerEnemyOverlap(player, enemy) {
    	if (player.spinning) {
    		enemy.damage(100 / 60);
    	} else {
    		player.damage(20 / 60);
    	}
    }

    function getAnimationKey(key) {
    	return `${key}.animation`;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(27, $project = $$value));
    	let { level = null } = $$props;
    	let { character = null } = $$props;
    	let container;
    	let gameOver;
    	let gameWon;
    	let score;
    	let paused;
    	let blocks;
    	let simpleBlocks;
    	let effectBlocks;
    	let consumableBlocks;
    	let worldSimpleBlocks;
    	let worldEffectBlocks;
    	let worldConsumableBlocks;
    	let config;
    	let game;
    	let preloadedData;
    	let cursors;
    	let spacebarKey;
    	let enterKey;
    	let rKey;
    	let player;
    	let enemies;
    	let gameWidth = 1200;
    	let gameHeight = 600;
    	let levelWidth;
    	let levelHeight;

    	onMount(() => {
    		// sort blocks by x, then y
    		blocks = level.blocks.sort((a, b) => {
    			if (a.x > b.x) return 1; else if (b.x > a.x) return -1;
    			if (a.y > b.y) return -1; else if (b.y > a.y) return 1;
    			return 0;
    		}).map(b => ({ ...$project.blocks[b.name], ...b }));

    		effectBlocks = blocks.filter(b => (b.damage > 0 || b.throwOnTouch) && !b.consumable);
    		simpleBlocks = blocks.filter(b => (b.damage == null || b.damage == 0) && !b.throwOnTouch && !b.consumable);
    		consumableBlocks = blocks.filter(b => b.consumable);
    		start();
    	});

    	// $: if (level != null && character != null && container != null) start()
    	function start() {
    		destroyGame();

    		preload().then(() => {
    			if (container == null) return;
    			$$invalidate(3, gameOver = false);
    			$$invalidate(4, gameWon = false);
    			$$invalidate(6, paused = false);
    			$$invalidate(5, score = 0);
    			gameWidth = window.innerWidth;
    			levelWidth = Math.max(...level.blocks.map(b => b.x + b.width * 2));
    			levelHeight = Math.max(...level.blocks.map(b => b.y + b.height * 2));

    			config = {
    				type: Phaser.AUTO,
    				parent: container,
    				scene: { create: onCreate, update: onUpdate },
    				physics: {
    					default: "arcade",
    					arcade: {
    						gravity: { y: gravityPixelsPerSecond },
    						debug: false
    					}
    				},
    				width: gameWidth,
    				height: gameHeight,
    				pixelArt: true
    			};

    			game = new Phaser.Game(config);
    		});
    	}

    	onDestroy(() => {
    		destroyGame();
    	});

    	function destroyGame() {
    		if (game != null) {
    			game.destroy();
    			container.querySelectorAll("*").forEach(n => n.remove());
    		}
    	}

    	function preload() {
    		return new Promise((resolve, reject) => {
    				const distinctBlocks = [...new Set(level.blocks.map(b => b.name))].map(n => $project.blocks[n]).filter(b => b != null);
    				const distinctEnemies = [...new Set(level.enemies.map(e => e.name))].map(n => $project.enemies[n]).filter(e => e != null);

    				const allArt = [
    					...new Set([
    							// blocks
    							...distinctBlocks.map(b => b.graphic),
    							// player
    							...Object.keys(character.graphics).map(key => character.graphics[key]),
    							// player abilities
    							...character.abilities.flatMap(a => Object.keys(a.graphics).map(key => a.graphics[key])),
    							// enemies
    							...distinctEnemies.flatMap(e => Object.keys(e.graphics).map(key => e.graphics[key])),
    							// enemy abilities
    							...distinctEnemies.filter(e => e.abilities != null).flatMap(e => e.abilities.flatMap(a => Object.keys(a.graphics).map(key => a.graphics[key])))
    						])
    				].filter(name => name != null);

    				Promise.all(allArt.map(name => preloadArt(name))).then(data => {
    					preloadedData = data;
    					resolve();
    				});
    			});
    	}

    	function preloadArt(name) {
    		const art = $project.art[name];

    		return new Promise((res, rej) => {
    				const image = new Image();

    				image.onload = () => {
    					res({ ...art, image });
    				};

    				image.src = art.png;
    			});
    	}

    	function onCreate() {
    		this.cameras.main.setBackgroundColor(rgbaStringToHex(level.background));

    		// set up textures and sprites for all blocks, character, and enemies in level
    		preloadedData.forEach(art => {
    			if (art.animated) {
    				// animated spritesheet
    				this.textures.addSpriteSheet(art.name, art.image, {
    					frameWidth: art.frameWidth,
    					frameHeight: art.height
    				});

    				this.anims.create({
    					key: getAnimationKey(art.name),
    					frames: this.anims.generateFrameNumbers(art.name, {
    						start: 0,
    						end: Math.ceil(art.width / art.frameWidth)
    					}),
    					frameRate: art.frameRate,
    					repeat: -1,
    					yoyo: art.yoyo
    				});
    			} else {
    				// simple static image
    				this.textures.addImage(art.name, art.image);
    			}
    		});

    		// add blocks as static objects
    		// TODO: block class to abstract this...
    		worldSimpleBlocks = this.physics.add.staticGroup();

    		simpleBlocks.forEach(b => {
    			const template = $project.blocks[b.name];
    			const art = $project.art[template.graphic];
    			const block = worldSimpleBlocks.create(b.x, translateY(b.y, b.height), art.name);
    			if (art.animated) block.anims.play(getAnimationKey(art.name), true);
    		});

    		worldEffectBlocks = this.physics.add.staticGroup();

    		effectBlocks.forEach(b => {
    			const template = $project.blocks[b.name];
    			const art = $project.art[template.graphic];
    			const block = worldEffectBlocks.create(b.x, translateY(b.y, b.height), art.name);
    			if (art.animated) block.anims.play(getAnimationKey(art.name), true);
    			block.damage = b.damage;
    			block.throwOnTouch = b.throwOnTouch;
    		});

    		worldConsumableBlocks = this.physics.add.staticGroup();

    		consumableBlocks.forEach(b => {
    			const template = $project.blocks[b.name];
    			const art = $project.art[template.graphic];
    			const block = worldConsumableBlocks.create(b.x, translateY(b.y, b.height), art.name);
    			if (art.animated) block.anims.play(getAnimationKey(art.name), true);
    			block.damage = b.damage;
    			block.throwOnTouch = b.throwOnTouch;
    			block.consumable = true;
    			block.healthOnConsume = b.healthOnConsume;
    			block.scoreOnConsume = b.scoreOnConsume;
    		});

    		// configure input
    		cursors = this.input.keyboard.createCursorKeys();

    		spacebarKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    		enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    		rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    		// add player
    		const startingY = translateY(Math.max(...blocks.filter(b => b.x == 0).map(b => b.y)), blocks[0].height) - $project.art[character.graphics.still].height;

    		const template = hydrateGraphics(character);
    		$$invalidate(7, player = this.physics.add.existing(new Player(this, 0, startingY, character.graphics.still.name, template, { cursors, spacebarKey, rKey })));
    		this.physics.add.collider(player, worldSimpleBlocks);
    		this.physics.add.collider(player, worldEffectBlocks, onEffectBlockCollision);
    		this.physics.add.overlap(player, worldConsumableBlocks, onConsumableBlockOverlap);

    		// add enemies
    		enemies = this.physics.add.group();

    		enemies.runChildUpdate = true;

    		level.enemies.forEach(e => {
    			const template = hydrateGraphics($project.enemies[e.name]);
    			const enemy = new Enemy(this, e.x, translateY(e.y, template.graphics.still.height), template.graphics.still.name, template, player);
    			enemies.add(enemy);
    		});

    		this.physics.add.collider(enemies, worldSimpleBlocks);
    		this.physics.add.collider(enemies, worldEffectBlocks, onEffectBlockCollision);
    		this.physics.add.overlap(player, enemies, onPlayerEnemyOverlap);

    		// camera and player bounds
    		this.physics.world.setBounds(0, -levelHeight, levelWidth, levelHeight + gameHeight + 500);

    		this.cameras.main.setBounds(0, -levelHeight, levelWidth, levelHeight + gameHeight);
    		this.cameras.main.startFollow(player);
    	}

    	function translateY(y, height) {
    		return gameHeight - y - height / 2;
    	}

    	function onConsumableBlockOverlap(sprite, block) {
    		if (block.healthOnConsume) sprite.damage(-block.healthOnConsume);
    		if (block.scoreOnConsume) $$invalidate(5, score += block.scoreOnConsume);
    		if (block.throwOnTouch) sprite.setVelocityY(-1000);
    		block.disableBody(true, true);
    	}

    	function onUpdate() {
    		// restart game
    		if (Phaser.Input.Keyboard.JustDown(enterKey) || gameOver && Phaser.Input.Keyboard.JustDown(spacebarKey)) start();

    		if (gameOver) return;

    		// if player is dead or fell out bottom of world, they lost
    		if (!player.alive) {
    			this.physics.pause();
    			$$invalidate(3, gameOver = true);
    		}
    	}

    	function hydrateGraphics(template) {
    		const copy = JSON.parse(JSON.stringify(template));

    		Object.keys(template.graphics).forEach(name => {
    			copy.graphics[name] = $project.art[template.graphics[name]];
    		});

    		return copy;
    	}

    	const writable_props = ["level", "character"];

    	Object_1$6.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PhaserGame> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PhaserGame", $$slots, []);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			container = $$value;
    			$$invalidate(2, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("character" in $$props) $$invalidate(1, character = $$props.character);
    	};

    	$$self.$capture_state = () => ({
    		magnet,
    		image,
    		onMount,
    		onDestroy,
    		rgbaStringToHex,
    		Enemy,
    		GameOver,
    		HealthBar,
    		Instructions,
    		Paused,
    		Player,
    		project,
    		Status,
    		level,
    		character,
    		leashRange,
    		gravityPixelsPerSecond,
    		container,
    		gameOver,
    		gameWon,
    		score,
    		paused,
    		blocks,
    		simpleBlocks,
    		effectBlocks,
    		consumableBlocks,
    		worldSimpleBlocks,
    		worldEffectBlocks,
    		worldConsumableBlocks,
    		config,
    		game,
    		preloadedData,
    		cursors,
    		spacebarKey,
    		enterKey,
    		rKey,
    		player,
    		enemies,
    		gameWidth,
    		gameHeight,
    		levelWidth,
    		levelHeight,
    		start,
    		destroyGame,
    		preload,
    		preloadArt,
    		onCreate,
    		translateY,
    		onEffectBlockCollision,
    		onConsumableBlockOverlap,
    		onPlayerEnemyOverlap,
    		onUpdate,
    		getAnimationKey,
    		hydrateGraphics,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("character" in $$props) $$invalidate(1, character = $$props.character);
    		if ("container" in $$props) $$invalidate(2, container = $$props.container);
    		if ("gameOver" in $$props) $$invalidate(3, gameOver = $$props.gameOver);
    		if ("gameWon" in $$props) $$invalidate(4, gameWon = $$props.gameWon);
    		if ("score" in $$props) $$invalidate(5, score = $$props.score);
    		if ("paused" in $$props) $$invalidate(6, paused = $$props.paused);
    		if ("blocks" in $$props) blocks = $$props.blocks;
    		if ("simpleBlocks" in $$props) simpleBlocks = $$props.simpleBlocks;
    		if ("effectBlocks" in $$props) effectBlocks = $$props.effectBlocks;
    		if ("consumableBlocks" in $$props) consumableBlocks = $$props.consumableBlocks;
    		if ("worldSimpleBlocks" in $$props) worldSimpleBlocks = $$props.worldSimpleBlocks;
    		if ("worldEffectBlocks" in $$props) worldEffectBlocks = $$props.worldEffectBlocks;
    		if ("worldConsumableBlocks" in $$props) worldConsumableBlocks = $$props.worldConsumableBlocks;
    		if ("config" in $$props) config = $$props.config;
    		if ("game" in $$props) game = $$props.game;
    		if ("preloadedData" in $$props) preloadedData = $$props.preloadedData;
    		if ("cursors" in $$props) cursors = $$props.cursors;
    		if ("spacebarKey" in $$props) spacebarKey = $$props.spacebarKey;
    		if ("enterKey" in $$props) enterKey = $$props.enterKey;
    		if ("rKey" in $$props) rKey = $$props.rKey;
    		if ("player" in $$props) $$invalidate(7, player = $$props.player);
    		if ("enemies" in $$props) enemies = $$props.enemies;
    		if ("gameWidth" in $$props) gameWidth = $$props.gameWidth;
    		if ("gameHeight" in $$props) gameHeight = $$props.gameHeight;
    		if ("levelWidth" in $$props) levelWidth = $$props.levelWidth;
    		if ("levelHeight" in $$props) levelHeight = $$props.levelHeight;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		level,
    		character,
    		container,
    		gameOver,
    		gameWon,
    		score,
    		paused,
    		player,
    		div_binding
    	];
    }

    class PhaserGame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { level: 0, character: 1 }, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PhaserGame",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get level() {
    		throw new Error("<PhaserGame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set level(value) {
    		throw new Error("<PhaserGame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get character() {
    		throw new Error("<PhaserGame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set character(value) {
    		throw new Error("<PhaserGame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Play\Index.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$7 } = globals;
    const file$y = "src\\pages\\Play\\Index.svelte";

    function get_each_context_1$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (9:0) {:else}
    function create_else_block$6(ctx) {
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
    			add_location(div, file$y, 9, 1, 553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$project, sortedLevelNames, selectLevel*/ 19) {
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
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(9:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1:0) {#if levelName != null}
    function create_if_block$j(ctx) {
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
    	let phasergame;
    	let current;
    	let mounted;
    	let dispose;

    	phasergame = new PhaserGame({
    			props: {
    				level: /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]],
    				character: /*$project*/ ctx[1].characters[/*characterName*/ ctx[3]]
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
    			t3 = text(/*levelName*/ ctx[2]);
    			t4 = space();
    			a1 = element("a");
    			t5 = text("Edit ");
    			t6 = text(/*characterName*/ ctx[3]);
    			t7 = space();
    			create_component(phasergame.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-info");
    			add_location(button, file$y, 2, 2, 48);
    			attr_dev(a0, "href", a0_href_value = "#/" + /*$project*/ ctx[1].name + "/build/levels/" + encodeURIComponent(/*levelName*/ ctx[2]));
    			attr_dev(a0, "class", "btn btn-light");
    			attr_dev(a0, "role", "button");
    			add_location(a0, file$y, 3, 2, 157);
    			attr_dev(a1, "href", a1_href_value = "#/" + /*$project*/ ctx[1].name + "/build/characters/" + encodeURIComponent(/*characterName*/ ctx[3]));
    			attr_dev(a1, "class", "btn btn-light");
    			attr_dev(a1, "role", "button");
    			add_location(a1, file$y, 4, 2, 290);
    			attr_dev(div, "class", "mb-2");
    			add_location(div, file$y, 1, 1, 26);
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
    			mount_component(phasergame, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*levelName*/ 4) set_data_dev(t3, /*levelName*/ ctx[2]);

    			if (!current || dirty & /*$project, levelName*/ 6 && a0_href_value !== (a0_href_value = "#/" + /*$project*/ ctx[1].name + "/build/levels/" + encodeURIComponent(/*levelName*/ ctx[2]))) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (!current || dirty & /*characterName*/ 8) set_data_dev(t6, /*characterName*/ ctx[3]);

    			if (!current || dirty & /*$project, characterName*/ 10 && a1_href_value !== (a1_href_value = "#/" + /*$project*/ ctx[1].name + "/build/characters/" + encodeURIComponent(/*characterName*/ ctx[3]))) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			const phasergame_changes = {};
    			if (dirty & /*$project, levelName*/ 6) phasergame_changes.level = /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]];
    			if (dirty & /*$project, characterName*/ 10) phasergame_changes.character = /*$project*/ ctx[1].characters[/*characterName*/ ctx[3]];
    			phasergame.$set(phasergame_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(phasergame.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(phasergame.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t7);
    			destroy_component(phasergame, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(1:0) {#if levelName != null}",
    		ctx
    	});

    	return block;
    }

    // (16:5) {#each $project.levels[levelName].playableCharacters as characterName}
    function create_each_block_1$5(ctx) {
    	let button;
    	let art;
    	let t0;
    	let t1_value = /*characterName*/ ctx[3] + "";
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	art = new Art({
    			props: {
    				name: /*$project*/ ctx[1].characters[/*characterName*/ ctx[3]].graphics.moving
    			},
    			$$inline: true
    		});

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[6](/*levelName*/ ctx[2], /*characterName*/ ctx[3], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(art.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(button, "class", "btn btn-light m-1");
    			add_location(button, file$y, 16, 6, 940);
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
    			if (dirty & /*$project, sortedLevelNames*/ 3) art_changes.name = /*$project*/ ctx[1].characters[/*characterName*/ ctx[3]].graphics.moving;
    			art.$set(art_changes);
    			if ((!current || dirty & /*$project, sortedLevelNames*/ 3) && t1_value !== (t1_value = /*characterName*/ ctx[3] + "")) set_data_dev(t1, t1_value);
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
    		id: create_each_block_1$5.name,
    		type: "each",
    		source: "(16:5) {#each $project.levels[levelName].playableCharacters as characterName}",
    		ctx
    	});

    	return block;
    }

    // (11:2) {#each sortedLevelNames as levelName}
    function create_each_block$8(ctx) {
    	let div1;
    	let h4;
    	let t0_value = /*levelName*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div0;
    	let t3;
    	let current;
    	let each_value_1 = /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]].playableCharacters;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$5(get_each_context_1$5(ctx, each_value_1, i));
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
    			add_location(h4, file$y, 12, 4, 658);
    			if (img.src !== (img_src_value = /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]].thumbnail)) attr_dev(img, "src", img_src_value);
    			set_style(img, "background", /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]].background);
    			attr_dev(img, "alt", "level preview");
    			add_location(img, file$y, 13, 4, 697);
    			attr_dev(div0, "class", "flex-row");
    			add_location(div0, file$y, 14, 4, 833);
    			attr_dev(div1, "class", "list-group-item");
    			add_location(div1, file$y, 11, 3, 623);
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
    			if ((!current || dirty & /*sortedLevelNames*/ 1) && t0_value !== (t0_value = /*levelName*/ ctx[2] + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*$project, sortedLevelNames*/ 3 && img.src !== (img_src_value = /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]].thumbnail)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*$project, sortedLevelNames*/ 3) {
    				set_style(img, "background", /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]].background);
    			}

    			if (dirty & /*selectLevel, sortedLevelNames, $project*/ 19) {
    				each_value_1 = /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]].playableCharacters;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$5(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$5(child_ctx);
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

    function create_fragment$B(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$j, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*levelName*/ ctx[2] != null) return 0;
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
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(1, $project = $$value));
    	let levelName; //= 'level 1'
    	let characterName; //= 'sonic'

    	function selectLevel(l, c) {
    		$$invalidate(2, levelName = l);
    		$$invalidate(3, characterName = c);
    	}

    	const writable_props = [];

    	Object_1$7.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);
    	const click_handler = () => $$invalidate(2, levelName = null);
    	const click_handler_1 = (levelName, characterName) => selectLevel(levelName, characterName);

    	$$self.$capture_state = () => ({
    		Art,
    		PhaserGame,
    		LevelPreview,
    		project,
    		levelName,
    		characterName,
    		selectLevel,
    		sortedLevelNames,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("levelName" in $$props) $$invalidate(2, levelName = $$props.levelName);
    		if ("characterName" in $$props) $$invalidate(3, characterName = $$props.characterName);
    		if ("sortedLevelNames" in $$props) $$invalidate(0, sortedLevelNames = $$props.sortedLevelNames);
    	};

    	let sortedLevelNames;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$project*/ 2) {
    			 $$invalidate(0, sortedLevelNames = Object.keys($project.levels).sort());
    		}
    	};

    	return [
    		sortedLevelNames,
    		$project,
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
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    /* src\pages\Project.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$8 } = globals;

    const file$z = "src\\pages\\Project.svelte";

    // (1:0) {#if $project != null}
    function create_if_block$k(ctx) {
    	let ul;
    	let show_if = Object.keys(/*$project*/ ctx[0].levels).length > 0;
    	let t0;
    	let li0;
    	let a0;
    	let icon0;
    	let t1;
    	let t2_value = /*$project*/ ctx[0].name + "";
    	let t2;
    	let a0_href_value;
    	let t3;
    	let li1;
    	let a1;
    	let icon1;
    	let t4;
    	let t5_value = /*$project*/ ctx[0].name + "";
    	let t5;
    	let t6;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = show_if && create_if_block_2$6(ctx);

    	icon0 = new Icon({
    			props: { data: editIcon },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { data: deleteIcon },
    			$$inline: true
    		});

    	let if_block1 = /*prefix*/ ctx[1] != null && create_if_block_1$b(ctx);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			li0 = element("li");
    			a0 = element("a");
    			create_component(icon0.$$.fragment);
    			t1 = text("\r\n\t\t\t\tEdit ");
    			t2 = text(t2_value);
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			create_component(icon1.$$.fragment);
    			t4 = text("\r\n\t\t\t\tDelete ");
    			t5 = text(t5_value);
    			t6 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(a0, "class", "nav-link text-warning");
    			attr_dev(a0, "href", a0_href_value = "#/" + /*$project*/ ctx[0].name + "/build/art/new");
    			add_location(a0, file$z, 12, 3, 309);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$z, 11, 2, 283);
    			attr_dev(a1, "class", "nav-link text-danger");
    			attr_dev(a1, "href", "#/");
    			add_location(a1, file$z, 19, 3, 487);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$z, 18, 2, 461);
    			attr_dev(ul, "class", "nav my-1");
    			add_location(ul, file$z, 1, 1, 25);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t0);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			mount_component(icon0, a0, null);
    			append_dev(a0, t1);
    			append_dev(a0, t2);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			mount_component(icon1, a1, null);
    			append_dev(a1, t4);
    			append_dev(a1, t5);
    			insert_dev(target, t6, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a1, "click", prevent_default(/*deleteProject*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$project*/ 1) show_if = Object.keys(/*$project*/ ctx[0].levels).length > 0;

    			if (show_if) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$project*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(ul, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*$project*/ 1) && t2_value !== (t2_value = /*$project*/ ctx[0].name + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty & /*$project*/ 1 && a0_href_value !== (a0_href_value = "#/" + /*$project*/ ctx[0].name + "/build/art/new")) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if ((!current || dirty & /*$project*/ 1) && t5_value !== (t5_value = /*$project*/ ctx[0].name + "")) set_data_dev(t5, t5_value);

    			if (/*prefix*/ ctx[1] != null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*prefix*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$b(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (if_block0) if_block0.d();
    			destroy_component(icon0);
    			destroy_component(icon1);
    			if (detaching) detach_dev(t6);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(1:0) {#if $project != null}",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#if Object.keys($project.levels).length > 0}
    function create_if_block_2$6(ctx) {
    	let li;
    	let a;
    	let icon;
    	let t0;
    	let t1_value = /*$project*/ ctx[0].name + "";
    	let t1;
    	let a_href_value;
    	let current;

    	icon = new Icon({
    			props: { data: playIcon },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t0 = text("\r\n\t\t\t\t\tPlay ");
    			t1 = text(t1_value);
    			attr_dev(a, "class", "nav-link text-success");
    			attr_dev(a, "href", a_href_value = "#/" + /*$project*/ ctx[0].name + "/play");
    			add_location(a, file$z, 4, 4, 127);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$z, 3, 3, 100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			mount_component(icon, a, null);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$project*/ 1) && t1_value !== (t1_value = /*$project*/ ctx[0].name + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*$project*/ 1 && a_href_value !== (a_href_value = "#/" + /*$project*/ ctx[0].name + "/play")) {
    				attr_dev(a, "href", a_href_value);
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
    			if (detaching) detach_dev(li);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(3:2) {#if Object.keys($project.levels).length > 0}",
    		ctx
    	});

    	return block;
    }

    // (27:1) {#if prefix != null}
    function create_if_block_1$b(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				prefix: /*prefix*/ ctx[1],
    				routes: /*routes*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*prefix*/ 2) router_changes.prefix = /*prefix*/ ctx[1];
    			router.$set(router_changes);
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
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(27:1) {#if prefix != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$project*/ ctx[0] != null && create_if_block$k(ctx);

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
    			if (/*$project*/ ctx[0] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$project*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$k(ctx);
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
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function createProject(name) {
    	return {
    		name,
    		art: {},
    		blocks: {},
    		characters: {},
    		enemies: {},
    		levels: {}
    	};
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let $project;
    	let $projects;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(0, $project = $$value));
    	validate_store(projects, "projects");
    	component_subscribe($$self, projects, $$value => $$invalidate(5, $projects = $$value));
    	let { params = {} } = $$props;

    	const routes = {
    		"/build/:tab?/:name?": Index,
    		"/play": Index$1
    	};

    	function deleteProject() {
    		let name = $project.name;
    		if (prompt(`If you are sure you want to delete this project, type the project name:?`, "") !== name) return;
    		set_store_value(projects, $projects = $projects.filter(p => p.name != name));
    		$$invalidate(4, params.projectName = null, params); // or it'll just autocreate it from reactive statement above
    		push(`/`);
    	}

    	const writable_props = ["params"];

    	Object_1$8.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Project", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(4, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		push,
    		Build: Index,
    		Play: Index$1,
    		projects,
    		project,
    		Icon,
    		deleteIcon,
    		editIcon,
    		playIcon,
    		params,
    		routes,
    		createProject,
    		deleteProject,
    		$project,
    		$projects,
    		prefix
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(4, params = $$props.params);
    		if ("prefix" in $$props) $$invalidate(1, prefix = $$props.prefix);
    	};

    	let prefix;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params, $projects*/ 48) {
    			 if (params.projectName != null) {
    				let name = decodeURIComponent(params.projectName);
    				set_store_value(project, $project = $projects.find(p => p.name == name) || createProject(name));
    			}
    		}

    		if ($$self.$$.dirty & /*$project*/ 1) {
    			 $$invalidate(1, prefix = `/${encodeURIComponent($project.name)}`);
    		}
    	};

    	return [$project, prefix, routes, deleteProject, params];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, { params: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get params() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.24.1 */
    const file$A = "src\\App.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (2:1) {#each $projects as p}
    function create_each_block$9(ctx) {
    	let li;
    	let a;
    	let t_value = /*p*/ ctx[3].name + "";
    	let t;
    	let a_href_value;
    	let active_action;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "nav-link");
    			attr_dev(a, "href", a_href_value = "#/" + encodeURIComponent(/*p*/ ctx[3].name) + "/");
    			add_location(a, file$A, 3, 3, 80);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$A, 2, 2, 54);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = action_destroyer(active_action = active.call(null, a, `/${encodeURIComponent(/*p*/ ctx[3].name)}/*`));
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$projects*/ 1 && t_value !== (t_value = /*p*/ ctx[3].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*$projects*/ 1 && a_href_value !== (a_href_value = "#/" + encodeURIComponent(/*p*/ ctx[3].name) + "/")) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (active_action && is_function(active_action.update) && dirty & /*$projects*/ 1) active_action.update.call(null, `/${encodeURIComponent(/*p*/ ctx[3].name)}/*`);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(2:1) {#each $projects as p}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let ul;
    	let t0;
    	let li;
    	let a;
    	let icon;
    	let t1;
    	let t2;
    	let main;
    	let router;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	icon = new Icon({ props: { data: addIcon }, $$inline: true });

    	router = new Router({
    			props: { routes: /*routes*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			li = element("li");
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t1 = text("\r\n\t\t\tCreate new game");
    			t2 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(a, "class", "nav-link");
    			attr_dev(a, "href", "#/new");
    			add_location(a, file$A, 7, 2, 246);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$A, 6, 1, 221);
    			attr_dev(ul, "class", "nav nav-tabs");
    			add_location(ul, file$A, 0, 0, 0);
    			add_location(main, file$A, 14, 0, 396);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t0);
    			append_dev(ul, li);
    			append_dev(li, a);
    			mount_component(icon, a, null);
    			append_dev(a, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(/*startNewProject*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*encodeURIComponent, $projects*/ 1) {
    				each_value = /*$projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			destroy_component(icon);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let $projects;
    	validate_store(projects, "projects");
    	component_subscribe($$self, projects, $$value => $$invalidate(0, $projects = $$value));
    	const routes = { "/:projectName/*": Project };

    	function startNewProject() {
    		const name = prompt("Project name?", "");
    		if (name != null && name.trim().length > 0) push(`/${encodeURIComponent(name)}/`);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		push,
    		active,
    		projects,
    		Project,
    		Icon,
    		addIcon,
    		routes,
    		startNewProject,
    		$projects
    	});

    	return [$projects, routes, startNewProject];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {},
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
