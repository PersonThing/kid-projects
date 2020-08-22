
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
    				width: 20,
    				height: 20,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAjklEQVQ4T2NkoDJgpLJ5DKMGUh6igzoM/zMwMDDicyFIAQgQ4wu42pFh4P8FSxYwJMQkgIMHl5f/nzlzBhyAJiYm+MIRHHYgtVduXAEbSrGBMIvxGQh3HTEuhLkOpBaXC8EGgmzU0dDB52Vw2CEDbAaCwwSmkCoGItuKx0AM1+HyMopCcg2EZRvKixqgCQCuPVENa4dYtgAAAABJRU5ErkJggg==",
    				gridSize: 20,
    				showGrid: true,
    				selectedColor: null
    			},
    			"mr smiley": {
    				name: "mr smiley",
    				width: 27,
    				height: 45,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAtCAYAAABf9xDlAAACAUlEQVRYR+WXUU7DMAyGE/Y4JPrG7jIOwy3GEbZbcBh2l/FWJPY4gtzVqePascOKhESfts7x599O7CwGx/MauvQc+ugwrZpEcIQWmkMK42AtEOoX/edo8UcJ2ArTfPHUZJW3piyEMEu7Crv0p2beqtvQNVXYoOonEB4VgRZA+iUtAaLgEZoZ+GExVQIMXg2cDLtF1d3DY2Z8fbwXWaUpNWE1R+gVbGIMIaUQOAxsMJ0uWM0ROLMCQnUuGCqAqHFha9phnQmTCt4KwlQ2wzwgUMHtqsq0Bb8G4x2FtSOx22g1NWsmqbMaprbGBWvpl7WdasLIgcyCpMJTtVJN3edM6XVFNq1NM+sgLemy6qY142LELA3kc02c1FZaLGXaxM6wS39Kq24D39V7iBYEP39jMPq1AGDj7tPuh9ZlSFxHRISIEEzNqE7IFEwr/sDw0R8uYAbToRIMrScoD56GosLK7TuNfUnHpS+vAppWE7bq6qDrcXHCtCimfLfBaM15Ss0Ce5RdA65vlsGifkBrm6JtZ/5rGIj3pvLmmnlhNshRM9wEvu5hTQPXn/Lddp0Ox8/C1257Hw7Hs2t9bmpWNPA7wCS7xWEaCOEtQDMNFIaO6bv92xn7h+lLNEhpmtYvT+ucQQ5DUDFGot6VZjAKqjnR7MYuKYr4e7BYSc147PNurdl+A1mPNjMZZLnvAAAAAElFTkSuQmCC",
    				gridSize: 20,
    				showGrid: true,
    				selectedColor: "black"
    			},
    			"mr squiggles": {
    				name: "mr squiggles",
    				width: 25,
    				height: 30,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAeCAYAAADZ7LXbAAABVUlEQVRIS92WKxbCMBBFJxZWAaoONKtgCXV4NBJdj6tkJWhwVbCKYsPJZ9IkzWfacBBEMsncvPcmPTAoWPwCXBxnB2CpNskipQllTxKCtxONUrfN1cmQnC0pUBSCNqCamBJ7X2xPEJKTb9uYUyjroamgQCiBGxdKILnRzUIoWRRBvjW6SSWiSPGckl00eITk7CiFyG/SzDWa2Nhj5P3zLhmnemtY51b9hsuvLddy73TIFDWzIYvVxnDer4fD9Gt0SFPxfn81zUQjxgA4BwhB7JqENBXAsXMsc/1rKg7HDjAPQZqlRPUxvQfIUDChh/LQljgXwX2OXRZIQVzyTyDyLdqWUScMVZox1pcPKRlBajX/o9Xqt2QXQpaRIX5DAc5CdBTMywMvJT8rBZYlRtg1ZHIuo0x0v/i/lfo2/yPZ7ohKBMTbTJqywLm0kv+BCH+mqsEsrXMfiUvi1H3S/10AAAAASUVORK5CYII=",
    				gridSize: 20,
    				showGrid: true,
    				selectedColor: null
    			},
    			lava: {
    				name: "lava",
    				width: 20,
    				height: 20,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABgUlEQVQ4T5VTLXrDMAx9BkW9QtjGR7szlIx0JLnE7pSQlYzkDAst71iuMFTgfU+2FMVfknYmjSX5/dkNeGDFDjHUCA+MpqGtA0u9rfnAJmIFhNEEqJrYVjE0oymLQNShgEmM1WqEBAiAIJ9APHXA7ekoM7vrBbfnF+x+etlzhvPnGngHAgml3oxWN0A2OPg2HAWgJFBQ74bzp7ZwJyzZ7pIy1r4OfSK6XkQpVXOxTkDdi1oDrIHbMFm1TF2+BNcYJBJGwX4zAl1yOAFyooY0ZpeUAQXs0AO0SABGBGeZZ01hM6YmK+6AKSaQrrbCuRlt1r4pxBSSLbNKyPlbwLl0XxCaSn4YoHtbpjLb4ZzdYrbkHQiZCphl6BSpBQX3JGV+QjiFkTMEos/PrCt7GYff8wkN6VkRmDjp35GDVoszle4S7FZzrtyXSwAX6lZSsvJXB8r6XUB/0G7cOfKu5B3eU7ilfqkngN/79WOvv/Oeny17ovBjv53hvxWuAZJ9S/ka0R8myfmjwHqeKgAAAABJRU5ErkJggg==",
    				gridSize: 20,
    				showGrid: true
    			},
    			dirt: {
    				name: "dirt",
    				width: 20,
    				height: 20,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABNElEQVQ4T51VsQ3CMBBMagoQGyDadFHadFRMkRGYiCmoGCGio0VsgGACo7N01vF5OxFuEuL/89/f+anbtg396lZhXV9NfHZdF59Y4zimd3zX32lDXuphGMLmca7e+2ECQHAFOWzvExzmYqNumiZ4J/37LVZoaaAKnFqil6P/A2iDAMy+8l1jdJ/tKVJGMvrLRXBth7JBfASkqp6iHjUvnsCpQkuJ1bGq4/pZXT67aCmvt8yvT30VPCqeynM+BGjyoQXVCnm6FYmHqiMS5dLpVk1rbi1morK1BapABVAbiRbcKp5URqM99ZbcGL37s6JocO7OMwb7EVCNy/7klJ9TOlK2IJqUG2W2FczJUvbuMW9DaVYmH3qesgqiDYsoM8gzrk4bGtibMpzuRR96fdK/BZ1G9OoXwkALJ+9w/gsAAAAASUVORK5CYII=",
    				gridSize: 25,
    				showGrid: true
    			},
    			grass: {
    				name: "grass",
    				width: 20,
    				height: 20,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAA+ElEQVQ4T6VTwRHCMAxT/ozQSdijA2QEJmGEDtA9mIQBePAv57YC1WeHcPgDjmVJtqHghgVnFDAuWDAC7zfLLfTNcn2f9+YrSlkJoyCIZIrJajNQViVTZyhYSYiJyORtc5iRqDuPMYGgb3OYRdKU4sGRFXEHMLRa2rWjw14ywzEovvd+CJWMDd6pF2Qu+I3QE0R5tAZ1ao4H7tAX9uIqZETRiBxZMSvhmFxZd6N38ALuRjmhP2bkNJjsO6Hsrj4qpufU/N2UWuuSgerpSOBzZWbtu0MeyD6j4/XusOUmmvk3hx3/xL8IW+77dtjh0CAmFF5ZHfR+p+YLoahw6UZP59EAAAAASUVORK5CYII=",
    				gridSize: 20,
    				showGrid: true
    			},
    			alien: {
    				name: "alien",
    				width: 11,
    				height: 9,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAAXklEQVQoU2NkgIEGhv8MDQyMcD4WcVRJdA1ofEzF6EYj2YZQDDIFF4BqYGSwhCpyZ2D4EbCBgWNDAFwLnL8TIgRR7A7h4FQMktwJUgwC+JyACBVGMkMDZjpyWKOJAQBzsSZ6gUffUQAAAABJRU5ErkJggg==",
    				gridSize: 15,
    				showGrid: true
    			},
    			bouncer: {
    				name: "bouncer",
    				width: 20,
    				height: 20,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAXklEQVQ4T2NkoDJgpLJ5DKMGUh6iQyAMNQIe/L+xQYEqLgWZxQgiYCFHrsHIZqAYSHmUMEASNrINlBgK8iE87Cg1FBZcKJFBrqHIYY8RuzBDCUUQLnWjBiKS0KAJQwA4w0sadEdWPwAAAABJRU5ErkJggg=="
    			},
    			"mr squiggles move 1": {
    				name: "mr squiggles move 1",
    				width: 25,
    				height: 30,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAeCAYAAADZ7LXbAAABZ0lEQVRIS62VIXbDMAyGZdqeokVhC94pBgfDyosHh8PHAgd3iuGOFa2naKn35NqpI8vJb2cmfrEtfdIv2TFUMewHWXMgg5rCB6XDEpCDsAHPJdEFO8RmkklJdCEzxCaRCzGKpUPOqzVBDEtkroaU1HEVBCm6ayit10OUcx2HSpqFoJ2DgrKXEdH8XyBLmq+FuBegciTq5OSy19/TyHjrWnofHt8xPN7b7lu1zhCELTWQXKuGbHZPY+C3y89EQbmHQ/rGXl8+R2fsyBgia4k0SLznIH1DdDxPFErlUiCBCGWyCOkbS8czxUWXHeYlUc9gcgnI9uvVMWL5AEjSYVO57hBDPPvBgG7f0hC1dO7+hADkm/iARI5l9AzJDQnXJIPvycaDbgsZFUFcNt4hCmCbEoj7u851mSbfck2kVfdd/0gOz5nLyE7jTfld8iQL2zsxLMq5xLGmhA867a41GQSQmsmaiGcyCFt/mFjWH4LzJ9gAAAAASUVORK5CYII=",
    				gridSize: 20,
    				showGrid: true,
    				selectedColor: null
    			},
    			"mr squiggles move 2": {
    				name: "mr squiggles move 2",
    				gridSize: 20,
    				width: 25,
    				height: 30,
    				showGrid: true,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA8CAYAAAAkNenBAAAB/UlEQVRoQ+2YPXqDMAxAYU1P0U7Z2rmn6BHYumfumDl7N8aepHO7ZWpPkaz0i0EkNRaSQTZYwAj45/lJsiHPIl3Ve1ZdhspfszzEkEE6dU1UDQjAhQKKZiQaCKwUDBgqlkMBtUbUgNgJGiqWQ42D5ogakFCxHN2IOpBQQNLFhb2PSOdM8iDSAO2+xz3ASRlRByJ9coieI1Jm7UjyBul04Pl9sYIQycw2Ir0jS5tZLohU+ZzciDqQsfvAbIykDGL+S01wsQoS66Vm8rpATj9fTilvxZO5vy/dzzGTWLu7h7q/y89JThSwXro1oh4EVo1rhnpvMiPJg2zuH50hfP797g1tql10I9SEMBqqnTzIYWvK7unlwzknmFDelI2qKdJcI1i7FuSwrcfdHXsLE121lgZi6+IawdpNZmS+IE1IZbujmSO2EVK77k3SevUjl+wryH9HAkZYZy68as3HiBgIwNb7CXL6LZrTaok8p3LJfm6bpE7BHCOJgkBI2UtEVC8w4rvylEFu9eoaUQNiL6kFhp25oNnm+mVnbp1H5sxwI2pBAIwwI20ChpUzog7kGnK9+4lv1cLel9tH8BkpASk+p/lRVz6P/EK0zagDIVZIKlfafmABkXHpb3bMSLIgdkitIAODbnBoYUkd2wRwLxeEIB8YGOObETnarVqJgvwBPOaeTOJTES4AAAAASUVORK5CYII=",
    				selectedColor: null
    			},
    			"mr squiggles move 3": {
    				name: "mr squiggles move 3",
    				gridSize: 20,
    				width: 25,
    				height: 30,
    				showGrid: true,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA8CAYAAAAkNenBAAACBUlEQVRoQ+2YMXaDMAyGYU1P0U7Z2rmn6BHYumfu2Dl7N8aepHO7ZWpPkaz0BSzIMwjJIBlszIiN5U+/JMvkmaen+siqq6n8Ncs1TKosOrTRaEAATgvImyLeQMBTYFArlrWAWkWiAbETVCuWteygORINiFYse1ckOhAtIOniwj5HpHMmeBBpgPbc4zZwUopEByLdOXjPESll7UhyBukt4Hi/SCBEMrMVkT6RpZXZLohU+VxckehA5p4Dq1EkZJD6v9QCD6sgsSaZzccFcv79HhTlrXiq37+Xw+OYkth3dw/Netefk5woYE26VSR6EPAaVxlq3mKKBA+yu38cDOHL389oaFPfeVeE2hBGQ30nD3Lc12X3/PI5uCfYUG7KRmWKNFcR7LsW5Lhv7B5Oo4WJrlrBgxiA7HCqHYKVXSpEZofWbEW2BkKdujdJO6qsvY5cjjAVSSCEB2wlqZ4Lr1prUaQDnlh+OxBYoDlPkO63MN1qiYxTIYjmCAwQ1YujyDZBXD1PKcitXuKKBA8CALvuZle/uszMmV7z2M9d4hrpmOzBgcCG7eolrQTYUVMkPJCufjc3DNMFYyCuSU7NlzvZIwZpSnXxtcyPuvJ5YovSVyRwEDuYQRHCQ1QOsMeZ9ug7ewJh+3x8YlKEciTTQ9Qy7HGmvZQjrUe1q5d9biH2pisCJCsB+QfY0NJMh3iztgAAAABJRU5ErkJggg==",
    				selectedColor: null
    			},
    			"mr squiggles move 4": {
    				name: "mr squiggles move 4",
    				gridSize: 20,
    				width: 25,
    				height: 30,
    				showGrid: true,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA8CAYAAAAkNenBAAACF0lEQVRoQ+2YMXqDMAxGYU1O0U7Z2rmn6BHYumfu2Dl7N8acpHO7ZWpPkaz0C0YQBEYCJDs2MCXYID39kmycJo6u4jMprqbStyTVMKny0j5HowEBOC0gZ4o4A4FIgUGtXNYCqhWJBgQXqFYua9mx1kg0IFq57FyR6EC0gKSbC3sdka6Z4EGkAep1j7uBk1IkOhDpnYPzGpFSFmfSaJDOC0Z+X6wgRDGzFZFekaWVWS6IVPv0rkh0IHPXgbtRJGSQ8lzKw8VqSKxJlfNxgZx/v3tFec+ey/sfef+4TUnbc9tH877r4SQnC1iTbhWJHgSixlWGmudNkeBBNg9PvSl8+fsZTG3qOeeKUA7ZaKjn5EEOu7Ltnl+PvT6BQ2nVNoqqSXMVsT1Xgxx2xu7+NNiY6K4VLEjleB3+/an8aWu7VIrMTq3JigQPAgDdXDQ1YlnRqVX3pmgHlcXvmV4jwYPYASBIfhUBL6BW4D/KnDRZEAhLmazareYTa8laI81Ae6lATYmjyDJBqC6GxykFuVsVcUWCBwGATfNlV966zKwZ54r4B+HnQuvwAa/00kqAW3xFVpBxpyX8eJmZeI9GnabQ3yONB4OpNdZRar4miLGdffk5qMtfZn4h4tBFC0JEikohchwCp65IsCAQQmakyIhTE5h2xnSttkmmAcpPcpxp535BmAAQiBWks55IFz1u8+JdCxc7/PcM8g/Knbm22Smj1wAAAABJRU5ErkJggg==",
    				selectedColor: null
    			},
    			"mr squiggles move 5": {
    				name: "mr squiggles move 5",
    				gridSize: 20,
    				width: 25,
    				height: 30,
    				showGrid: true,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA8CAYAAAAkNenBAAACD0lEQVRoQ+2YPVqEQAyGoV1PodV2WnsKj0Bnb21pvb0dpSex1s5KT7Hb4gNMWM1OSAYyA5NdOmD+3nz5g7JIdDWvRdNuVT4WZYwtoyzqO6gZEICLBZRMkWQgYCnYMJYvxwIaFDEDggM0li/H2oeMETMgsXw5uSLmQGIBaScXcR3RjpnsQbQBhronbeC0FDEHot05JI8RLWWxJwWDnCwQ+H1xAWGCWayIdkXWVuZ8QbTS5+KKmAOZWwdWo0jOIN1/qQUuUUISDXKHXznIbtsf8OmLg+rG7b8/vKI8V3fd85fa/55Skpp3ddOv1/6clHhBWZgDAWxamVFFYLpUGW7cdEXMgIAStKt5Fdlc33pd+PDzOera3LzpipgDATuCMu5+//DmtTBYtnS5pXFJWqoINW9QZLft92WyKp21zIAc7T+arThfpwKFmydWxBlcUkcyAeHLpqh+UMv8yT7dEKozwPNPshbOpuheUv4vIK2V1RTB2RRlsXwUUQCBJUZdrHLdak10x3wo/h+BleS6YIki5wkSanlOQWnPpa5I9iAAsDl+2XWPDjNjJrki2YHAgXGF1lYC9ommiAUQURoODXZpj6ZZR4yBVO/L/Kir70dLRUgd6RUxAwIOhoEYi5GxA+tQ87n3buFwRcyBYBMLLTdMw+O5eyYdTlfEDIhWjMw1yGpiZDUgU7OVVgugpshKQH4BiSrRtqRLobsAAAAASUVORK5CYII=",
    				selectedColor: null
    			},
    			"mr squiggles spin": {
    				name: "mr squiggles spin",
    				width: 23,
    				height: 22,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAABdElEQVRIS61UoVZDMQxN7fgKpp7jab6CT5jDTyPRD417krPPmJgGNwVfsdly0jZZkqavG4eqtklubm7SBhArvkOU5/AMwd5ZuzzbfaALAkFAvJOgdGeD0Ydt05CJbY+MqcAliE3mMVTg6IAJLHjlVJi3GMtqlY9hz5oaIKX9kq6VbRpYmgTuMIyn788U97IZ4XXO+9Yin7v1iNJkt+0xsOYmMIFfA0xx6Pu2T6dA2i+Co+fq/oHznn++FAdrS8wJPG3qxZIQONYXI4AHLm0sC07MNEQNXrp9evrglP/D/DKjirktrJQO1HBpZ1nKzGfmevhvAl+tRziXyVLgsrPetPTmG4FxGfDcVG6oebb4QGXZmwJCyXYiKwHTlWTvyYJ+i9KgAyacixwt3S/TYnTHAK9pPalq5onKIcL8KEezy741SVpz8tIJ/v55qYZ64HUlPUWyXcTpF4oGubRMfXCKL3H+x7XE2gBwRue+9Stez5I8nSp/AX512Ot6DrwxAAAAAElFTkSuQmCC",
    				gridSize: 20,
    				showGrid: true,
    				selectedColor: null
    			},
    			fireball: {
    				name: "fireball",
    				width: 17,
    				height: 9,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAxklEQVQoU3WRvRXCMAyET1PQOA3j0JApYIQwAqzAFNBkobhhCvNOisIleahxrJ/Lp7PhT0wvtK6HZXk6oeV3GcHCUrPW0MzgZ30D5QzwpACFSg9wnDkG63jOPWMILWoq4tmh7BmP1XP1AJQPgGsQuYiiUyynnXAoyx2zyEo9hCJWJEzchOQeBL5GUvB+iV3cC9/LQtB94N4qor/e0pBE8bVXjUzDdyQc0HXSFxdNikd1g+1Rf94oiRqrBFtv9NnTl+zv5if+ArH8YAI2FtwZAAAAAElFTkSuQmCC"
    			},
    			"alien move 1": {
    				name: "alien move 1",
    				width: 11,
    				height: 9,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAAb0lEQVQoU4WQsRXAIAgFzy4rZQJbR3Ik20zgSunMI4piEl9+BXjAR4cqUoi4ZQ7mUaifhjFJ4T66BWbbgHcK/knODRUWUOThDIkthTvt8QFkXIXFa9MnXJk3vDBiYCXETjY/pPZabT5Qmiys97TaBcHVJwqjIds6AAAAAElFTkSuQmCC",
    				gridSize: 15,
    				showGrid: true
    			},
    			"alien move 2": {
    				name: "alien move 2",
    				width: 11,
    				height: 9,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAAX0lEQVQoU2NkgIEGhv8MDQyMOPkMDEiSIFUENCBMgimGGw1lINmGai26QoQTweogii0Z/jO4Q2R+BGxg4NgQgMreycDAcJyBkTLFWF2CYjJMBcg5x5FCCI2PGhoEFAMAtOwpCoEew74AAAAASUVORK5CYII=",
    				gridSize: 15,
    				showGrid: true
    			},
    			"alien move 3": {
    				name: "alien move 3",
    				width: 11,
    				height: 9,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAAcElEQVQoU4WQvRmAIAxEL50rOYEtIzESLRO4kh16kEjwE70qkJfLj8AUURAh0zfgkqR+CrqTwbe1Bq6bYEXBDqmuM2lBg6mtkUdIWFIY4wzQsI3hXF9hMtkW/BqhX0ud7cNG4g6U7aP58RoeeBZeuRP6HSlCZzI3lQAAAABJRU5ErkJggg==",
    				gridSize: 15,
    				showGrid: true
    			}
    		},
    		blocks: {
    			grass: {
    				name: "grass",
    				solid: true,
    				dps: 0,
    				dpsToPlayers: null,
    				graphic: "grass",
    				width: 30,
    				height: 30,
    				throwOnTouch: false
    			},
    			spikes: {
    				name: "spikes",
    				solid: true,
    				dps: 1000,
    				dpsToPlayers: 100,
    				graphic: "spike",
    				width: 30,
    				height: 30,
    				throwOnTouch: true
    			},
    			lava: {
    				name: "lava",
    				solid: true,
    				dps: 10000,
    				dpsToPlayers: 1000,
    				graphic: "lava",
    				throwOnTouch: true
    			},
    			dirt: {
    				name: "dirt",
    				solid: true,
    				dps: 0,
    				dpsToPlayers: null,
    				graphic: "dirt"
    			},
    			bouncer: {
    				name: "bouncer",
    				solid: false,
    				throwOnTouch: true,
    				dps: 0,
    				graphic: "bouncer"
    			},
    			"grass background": {
    				name: "grass background",
    				solid: false,
    				dps: 0,
    				dpsToPlayers: null,
    				graphic: "grass",
    				width: 30,
    				height: 30,
    				throwOnTouch: false
    			}
    		},
    		characters: {
    			"mr squiggles": {
    				graphicStill: "mr squiggles",
    				graphicSpinning: "mr squiggles spin",
    				motionGraphics: [
    					"mr squiggles move 1",
    					"mr squiggles move 2",
    					"mr squiggles move 3",
    					"mr squiggles move 4",
    					"mr squiggles move 5"
    				],
    				framesPerGraphic: 2,
    				name: "mr squiggles",
    				maxHealth: 200,
    				maxVelocity: 5,
    				jumpVelocity: 15,
    				gravityMultiplier: 1,
    				fallDamageMultiplier: 1,
    				dps: 250,
    				canFly: false,
    				canSpin: true,
    				spinDegreesPerFrame: 15,
    				canFireProjectiles: true,
    				projectileDamage: 50,
    				projectileYStart: 25,
    				projectileVelocity: 20,
    				projectileGravityMultiplier: 0.1,
    				spinSpeed: 20,
    				graphicProjectile: "fireball"
    			}
    		},
    		enemies: {
    			"mr smiley": {
    				graphicStill: "mr smiley",
    				motionGraphics: [
    				],
    				name: "mr smiley",
    				maxVelocity: 3,
    				jumpVelocity: 12,
    				gravityMultiplier: 1,
    				fallDamageMultiplier: 1,
    				dps: 120,
    				maxHealth: 1000,
    				score: 10
    			},
    			alien: {
    				graphicStill: "alien",
    				motionGraphics: [
    					"alien move 1",
    					"alien move 2",
    					"alien move 3"
    				],
    				name: "alien",
    				maxVelocity: 5,
    				jumpVelocity: 10,
    				gravityMultiplier: 1,
    				fallDamageMultiplier: 0.5,
    				dps: 20,
    				dpsToPlayers: 50,
    				maxHealth: 100,
    				score: 1,
    				framesPerGraphic: 5
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
    						x: 320,
    						y: -40,
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
    						x: 600,
    						y: -40,
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
    						name: "dirt",
    						x: 680,
    						y: -40,
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
    						name: "grass",
    						x: 760,
    						y: -40,
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
    						name: "dirt",
    						x: 800,
    						y: -40,
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
    						name: "dirt",
    						x: 840,
    						y: -40,
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
    						name: "dirt",
    						x: 880,
    						y: -40,
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
    						name: "dirt",
    						x: 960,
    						y: -40,
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
    						name: "dirt",
    						x: 1000,
    						y: -40,
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
    						name: "dirt",
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
    						name: "dirt",
    						x: 1240,
    						y: -40,
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
    						x: 480,
    						y: -40
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
    						x: 640,
    						y: -40
    					},
    					{
    						name: "alien",
    						x: 560,
    						y: -40
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
    						x: 920,
    						y: -40
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
    						x: 1040,
    						y: -40
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
    						name: "grass",
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
    						x: 680,
    						y: -40,
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
    						name: "grass",
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
    						name: "grass",
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
    					}
    				],
    				enemies: [
    					{
    						name: "alien",
    						x: 1080,
    						y: 120
    					},
    					{
    						name: "alien",
    						x: 960,
    						y: 120
    					},
    					{
    						name: "mr smiley",
    						x: 800,
    						y: 240
    					},
    					{
    						name: "alien",
    						x: 400,
    						y: 80
    					}
    				],
    				thumbnail: "data:image/png;base64,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"
    			}
    		}
    	},
    	{
    		name: "Sonic",
    		art: {
    			"sonic move 2": {
    				name: "sonic move 2",
    				width: 31,
    				height: 35,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAjCAYAAABsFtHvAAADbUlEQVRYR6VWK3LkMBDtqQowzgkMDAwC5gRbCwIEFvgEgw0CBAJSe4CtgAUCAT5BsKHAgj3B1oAFBgY+RsBWZeu11LaksWc0SbOxpH6vX/9mRx+w8v74Hj6bfu13H3BD2Y9SQFXVM54dhxPsHEIXwcvyeYmyUhEICFhr3LfkTC6GJOBrmp5mzIvgcBIREK8CNloaDFGtFwJMKlEDJMSPEMgCTzUNyRhl+Vgpp4qQkLREJEZ391PgsxqIfrQEAgLOBF4UbdbEaD8HHhWfBweoHl3+Q2BRLVRA6iBb9rTat1orBG4fiLoXd/PD4AKcSrkWIQNJB/guWMs/oo8ib9ulrbruaZcTLRwbQ6S1j84XlTGKyqqm5ps5bUOf9xkcwO0D+oVoGgey1pJ1xRnbSj9HrYUaMIqUWoZQXccEzANR0/jIAWyMAxYbRuTL0OvrD7q9/b6V4tWoUnBrB9KPDVHZE00NmZ/9At73x/eQ6VyhdmDpoMTh8IU/nxBZUQKRhf5m8H8t0U23gCNq9ChA6moJEA/EgdWKDq9/5sNLBKQOwiCQRqirteGZwLKHRYacCwGAgxCkN36kwwH3si+qKBdeAVNpdm4pzjt3gVZEyrgUELmtJsUmwGAH46lll1qIplhcInyfJ52xREGrDZW7WPsBVD92zvd9u6zUtM22Kqxvv/KWAxGe44HJmIVCIdHwDs6a7jcHnT3hxIEsFQHKJQBQmABfDb66WuElrPhg1ocRh6DyPTvyrZ0uo1NxgSkeTmtAa2nMBg8fM5HKrU0GNZbHa2pdV5z1fzX4rEClSNrK7W+X03kke3LnCGSBb0kOcPS9AEN2rS3XAFT5VORh+2HGw+bpduP6FYZZLRMMw8nay8Bnq72syndxisnHq1HMA+txohb/YNpnPkHkGMlFcT7Xm9UO0DAaWbMpuACLI9sfOfq6eyKdOT+inAMYYw8OYEP7TAKO3/u7YifkAA4r++OygOzAC2Otrc62msgsl1Szd9XbH3nBrIGDnEgt73Ilj3Iuq5Wj8WD1XUEoq1RGUUjmtxDF2yJT8hkczsIcDn/fOBD8iZia/WoORSmco+hCyyXA+YGjwecwLKBL+QvzzwTe3oiKIjv6TfBcCVPVct9tyn5tBCmBq2Tfkj7XSfj+mjcnfS45n8Ypu19z+zq99x88w83tDzm5xgAAAABJRU5ErkJggg=="
    			},
    			"sonic move 1": {
    				name: "sonic move 1",
    				width: 30,
    				height: 35,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAjCAYAAACD1LrRAAADX0lEQVRYR62Xr3LcMBDGNzMFxn0CAwODgEPFBQECBX6CYoMAgYA8woECgQA/QfFBgYBMH6BzoMDAwI8R0JnrfCutLOnsOyXNkuR8kn7759uV74beYfXd8ZRvm593N285qmjxGkg1bcKx0xg+lzhxEVzX+zSyRiUwwK017ln2HR7lDuC8eX5kZlnEuQMxaLI0GqJWOzg7E0UvDkgQbwLHYeZZMMqSUi4TMRyfEwcmy2veDcZmhiO1k6UYzPAnF7VYDn83OBGaBwOiJ1frXHR55FL3shqvtM9a68TQ/p5oeHKr1hR/WdURME/fWmQMEZV7Acq6HJ6A+35pHzulrbMVoTFEWvuovICMUVQ3LXXfzHmbTZYFFsCA9vfoCaJ5GslaS9YJ8dyink3aBzU3ipRaxNW2KdzcE3XdzoEBNcZBxcYJNTLbcJ/KZNMK2NqR9ENHVB+I5o7Mj8MCPhyOp9jL0Ap25JQhA1qvhL8yrRBRfFYA/+2JPg0LGNFiAADQNov/2CAHWK3o+8/f9PnLLzeZMgHFUeN71D12HmVDRrU2PGw41bGgUGOBAwxnkG7jdYYDpF8xPIL5yE2j+WBLaZ1Z7VoRKePSLrNahCVQeAbjUWiX2iejMZMcTzBjiaJsjI3b2/rh0j4M7ty7frkk4siHwd0gMEwqSS8OF4d4LkcmoxNZEQcz37hTuuGl7HbiEel7jx2p9yeBlMIBhAk0pDr3bOvz2f2MhbGyo9kdnxED5XnRrJZIE4f83cupZzGpJJXXgikGh5r7KxF1Z2AkqLiGHwKWFOv5MZxn6j0plSpsGKriQIoWGiJ+9/r65zX0+VBVZO6OTuX+4scNVPKiVySuHNretjx3z94yIuVfS/NVsEB7Ihp9tAxmtR3C+aVRxg5tpjqGYoM9HJN5jpEKMcXDpiTSq+0EMNf0tgrnAS72P9DNVAsUC3h+Vwsc09Y0Nc3TXCTMrSysbg7R+msSLwWI/KOgqxEDCjGJQVQweR0ywyPRq3tWVeV9m0d+FvGr71k+3KdY93uyzwON0xzULVlgBwp/Cl1UdQD7VW1T8396mgmZCOqORCcHvsWBzYgFKFD8HXuMSfc6Mnc7diSYz1Ap/PILfVPzqES0AhZQi1p7SxwoTP3Vlqg9fKst1p6XtNo/wC677V2uF5kAAAAASUVORK5CYII="
    			},
    			"sonic move 3": {
    				name: "sonic move 3",
    				width: 38,
    				height: 31,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAfCAYAAACLSL/LAAADkklEQVRYR8WXLXLkMBCFe6oWGOcEBgYGATnCggCBBXMMgwCDgNQeYCtggUCAj2GwQCAgRxgQYGDgEwQbbFW2XlutaXn8m6RqxWakkT69ft2tOdDGkd6e3jcupe755rB17dy63Ruk6eMAmJloT5Pl4bNrm2juI6C7weTEKUDAjaE0oQDit133sHj2h8FwYIATBVt35vCKTsL6dUtwnwIbw1njyJghxHnpGTNDEuZIzRW4T4MFOCjUOtJwDPh0BsPnMdycarvBFrPTgwGgbC1LppNC4qzh5hJjFWxPmRinvoaylqj04f0SsIssVKVCe2dKGQ6dG5STEjPltynVFhUrCl+ziKiqhvS+yEQlEw4VZVgVb3BrDaVZTscf9qL+Yc2Uz2bBAFXcDdp3bUPOuQC3BBiVB3jOGjLmXHzzPIazd0TH42WnmAQDlLWS74MkTUtUPdl5OBXiIOIEmHMNlfdHorQm6o5kf9fbwer69K5vGbLJNRwSKCi3XAotfgdF9F4B7G9B9K3aDga1UCQBkGdnA2FDOcCVJpQD8ZE2uM5O8Z2+HGyBiJSl5YK8KZTa8PCYwAEMsAin9f0bB3C90q1IhdRmJR/sKPYZZ2tpiIwdwso+7iJbzXpMQ+FmGNxu3Nl7of08DVVfD+4A1hGpctFkw29zX3zz+2rY97aIvIvvFrNSDpJSEZ1MRHXxnZ9AAAy90S+S1gRV5QLj32PuWL1MMqxW/vFm+rMYXyC2wgEIYw5qUbElIMxF2agX6wek6p16yRKQrJtVLM3S6CkNc4a+OTa7N7y0G8NmN1yUt0AITE/EZ8J5F2BjoEg5FMXW0dvbL/766urnMK1Uav7kwfB7wASKkyNLY7BFKJ897rkiQnGcCJ8oZo3dpVaA6nuiJInBtkBJeLx3z2gzf0yqKllNLq2UhNGKYktQqDF59UBpfeICi3FznRy0+fXrQP9J0U8hQKLVyW1Q7U+v/TvamznehEvCX6tggMKAUtKOkmRdhShrw58SR7BB89rwg4CB1KsDIRQoJNphTq2y7Yix+p6qJGHFpnralrLCDcNDhfVJQq4+BTjAvlwnrNYkGIAwAIUblAvdYQ1K5scPA0Dk1wlPN689q4eBvik982B97dAwXwnF+/qXcHi1eCgBh3IoLVA1gGFSw32FQlNKChwSSUSQLGyKxwgK36+m89Zw7VkHX4tlWBjvK73HfwHjrFUtb/wWw/w/N2zjStQ9lWQAAAAASUVORK5CYII="
    			},
    			"sonic move 4": {
    				name: "sonic move 4",
    				width: 34,
    				height: 35,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAYAAADxG9hnAAADbElEQVRYR8WXoXLcMBCG92YKDucJDAwMCjJ9gE5BgECBcUGwQYBAQKYP0AkoECgwLgg+KFDQJ+gEFBgYGBccPtCZ6/ySVreW5Z4vuaYmNzmdtZ/+/XdXWdGZn+Lqcc9bDt8uV0u3X/zDdEMZEGuqrCYxbd+575YALQYpivt40hixVKPggLHW+O+StWNAi0FkxAmUDNpbMsqStsrBOLigTNyjtzQMdyvsg098/yQQ3jCnEiCU8kpV2ivDaRsB9dan7RwgIyCoEtRgEAfz5QCCv1OYs4GMTBtAEFD33it/M7H0zZNTk1ZNrkwlhDFEGqlKVOGKOglkrmQhd+7kLihXUaiknF8AMwvSNIdytd5Xs2XJSwjCJ3deCIY0RlFRVlS/N9OyDhWUBQFEc+N1HPqOrLX08PCJLi4+jjOQ6RWjcoVnjCKlDs2uqsYw5oaorjOKAMKYkMwQtuuJ2i8mDyPRUrAMiLUd6duaqNgQDTWZz5s8yGbzuJcn4DjYAPJCoevrt1N1ggdS0+LEcr8I8rshetXmQaAGegACVuVhS7zMm1mt6PrhR1w8li72jTwQUg3VtTau+U1SIw0KjzAMq4H0mDBesJnrFcGQIyVCikypXSBLY5+4atKKSBmfplyLZ6MyBKhdY0LbtgfvpN0zBXKt3lgiUb5d6d+vQrOrblu/91WTnzVSGVTL3PP1w5sI6eaKeHjmQDkJLX+Dtbr9Ph16RVnEUQ9KR9/ekSkL2v7aTnjYHxx0KQwA8DBETA0DdP0Qg+nm3ufX2ggDOFZoYlJ+M3MlSE8gAXhtBQjdD+TPf3iQvXc/d65ch/rSLXTNvfscdVoBwO1bOXP6Q+SC5lK9MkT7CLHbEa3X8XedAAEElzZa9XbrveOUCXcOByAMehIINhvBBIxUEQbB5hNFSkVcqnyKUyCiR6RUO6I9IIrNY0iD9winJZuapLUDamlKokdy+Zr7jsu6bf19c/bdUi26ucv3T7qPLIGOgCfCnBWEFXMe+t8gqCytrQPhu8YSJc+mCE/uOKWtv1DBTy8OgoA8V3jGYMS/GAh3Zw7IDXJ9wj9wi2iPnUiCMAS6crxcrdd0DOrZIKkagOZm6G56r8PICONjDujsINyB4RUMy3SYAjQH889AEBCjQT4SKoV5NohLhbhQHfMTrw/9MIr9BwBZyu05kq75AAAAAElFTkSuQmCC"
    			},
    			"sonic move 5": {
    				name: "sonic move 5",
    				width: 30,
    				height: 35,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAjCAYAAACD1LrRAAADLElEQVRYR62XL5LbMBTG384UBPcEBgYGBUE9wQKBAp+g2CBAYMEeYUGBwAKfoDhQoKDTA3QWFBgY+BgLOpPOJ+nZT4oSy2lEMnEs/d7f7ykPdMOqHt9O6bbpx/5hy1FFL+dAqm4ijh2H+XuJEVfBVfUSe1arCAa4tcY/S37Do9QAnDdNz45Z5nFqgASNlgZD1GgPd8YI79kAdmITWLqZRsEoS0r5SEg4vkcGjNa9czMYmx0coR0tSbCDv3qveaXwm8FRoQUwIHr0uU6LLvWc816W40z75FpHQrsDUf/q38pV/PWqFsA0fDnPHISrPBQgv5fCI3DXLe1jx7h1LnloDJHWwatQQMYoquqG2i/mvM1G6wpsBgPaHdATRNM4kLWWrC/E8yV6Nmof5NwoUmoprqaJ4eZA1LZ7DwbUGA/lNYzIkbkMD6GMNmXA1g6kn1qi6kg0tWS+HRfw8fh2klbOrWAHFzJEQOuM+xm1gkfyrBn8tyP60C9geAsBAKCpF/uxgQ+wWtHX77/p4+dfXpmSApJe43fkXRqPtCGiWhsnNi7UsqCQY4YDDGMQbhPqDAdwv0I85hU8N7V2B1uK8+yqXSsiZXzYWau5sBgKy7CcFNol95E0JiXnFMxYIhGNofZ7myAuzVPvz33sliEhPe97P0GwoFQcXhzOBjldFoulE1FhAxPbXKe0/c+y6eQkMvQeDwiGlMIBxGLoHOrUstz3s9nML8nKFtotz5BAfl6m1RfmMcuhcsWkolCuOVMElofwSATUAUVByRzeFTyHu1bErcMAbrWS+1ZxjnN3L4Dl0jY0e63O7lo57zeFOvL4gBEoBkkosrt67PqZCywAjsZPINZxvtKs5XZTVUNc5hGJ/B7IySkWJNV9CtEpga+Gmkcmz1VAWRC2wqRB168+dXWCrqJH50ll/SXhf6BXq7qqK/cvAmD3Ge7O94CugvU4RenyJhANf95p/2m3mqZruc5uhrcSKoHysrDb3Q4vAlfHtxDuhmi3ixzZFf7/Sr1fBQ/dy5zjqd0Tez8f9P7ujNlqwMU8pcUFUNM/Z3POD7fAVwuEDSgRhWmcVs/jc/4BD4mi7Zhwv8wAAAAASUVORK5CYII="
    			},
    			"sonic move 6": {
    				name: "sonic move 6",
    				width: 32,
    				height: 35,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAjCAYAAAD17ghaAAADiUlEQVRYR7WWK3LcQBCGe6sCFvsEAgICBnuClIHBgIA9gbGAwQADVw6QMggYYKATGC8cYJATpAwMBAR0jAWp2tTfUo969IhmdytDdksadX/992NmQxeu7P7jpD9t33ebS0yd9dHYqcmL4NM39cR/ClQSQJa9DNHmJnIECO9d92z0TjZqENhq2+fgNwkAhiIIsSwOG0+1IyrsAMFgI1UAInYEIhlgrK8Gcsbza2M6dQREUhSBNN3eqwGCKlCh8QQIAWCIV0OLNdL46wGiguwB4Ng2XT1o56KeVkLq4qwUjLtgqe208/KRqHrtdl4FIM7Hss5Fys6kM/rumKsHqDBRoCyHlquq501K1DDuHJG1fZR9oTlnKMsL2n9z0xbt6yACgPPyEb1E1DY1ee/Jd0Ubr5l+j9oONeEMGTMMqqKIIdwj0X6vFIBz5zrnsuoG+XP09vaDbm6+L6V8NroxgPc12ac9UXYgavfkfh5igMPh46SJQ+X6mmWEIg8PX/nxBGZGEUSo7QWAPyXRlyoGQPToYTgq8iFQfCRGvDX08PY7vFyDkLrQgSClUNlaxzMjpEAXHmpAIAAAKKTB9UcAjHCv94UW5aVXwuWWHXiK64C7wxoi47p0EFEoQilAcQ5KLJ5ufqiNaNrFJcP7eSI6T6TasM67jUU/pIqnqrN9Xw4AeDBuwaWqO5R3fDoChue+WjKSoZSG1Xvwbl/94uDPmoRiRA4icZYKAcdY4vwigNljGZZ0J6izQUeuHcvzsxRYuhPImDVcdIYH2JyzuZSeBaANMEzeHbnsWBXefwcISuSGpOWGfvdkvQkpWbsXJiuwJD8AxosBZOWG/gWRBCCTMhrFqujs+47dZYePME2Lb90t+WIFsjw7YVBIL1urjsU+9zjzbfvMjkoiwngBBMY3pihG7dIsWewCOLZNGyLqBk5BcpyGi8V7QbJPjGmIFOeTOSBRF1UX1d3nkU9BAOBoxtrdbjkq7MXvGKIuXwgXmbXIJwpoydv9jiXldTyynIDA+aCNCwS24XzHkmmXChGiQSSglxtRcbsNQdjyhf/PGdUQqBnXq4f924RRzwCO6KQjDp63Wy4su2JIQyAQsZUEIEUXAHrZ8YO8S87XcqohahTx8Ui03a6qsImiV17qz2Oyc/lsApGQhhigp06RfUmRMcRaGjZzKbgGQLcoUrEKIB9IP6MW1j5aq4dz3v8FUhHQ7dgtIyUAAAAASUVORK5CYII="
    			},
    			"sonic move 7": {
    				name: "sonic move 7",
    				width: 37,
    				height: 30,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAeCAYAAACrI9dtAAADk0lEQVRYR6WWLXLjQBCF21ULhHMCAQGBBT7B1oKAAQt0gmCDAIGA1J4gYMGAAB3DcEBAjmAQIGCgYwikyluvZ1ruGY8U2RlkWfPz6XX369nQilHeH04rpvGU4W27WTt3bt5VG5Tli4erTLSfqerp2R376N0tkFdByWk5OIClQJpO4LB2GJ4Xz70JCodNYKLc0Z0ZgpJZ0DBvCexmqBTMGkfG+LDWbeCrDEloIxW/APsW1AQGZY6ONBjDvZ6h8JyCzal1FdRiFQYoHN4eLUulC0Biq8HmimAR6horSMtbA1lL1IaQfhvqotqUHehcySnC4XJeMbGRXH7l1JpVarcLnkREXedL+KLilDw4UBRhNUIyW2uorGpq/tgLf8OcXF5loQC0e/R6D8eenHMT2BJcZAHIMWvImLOx1nUMZh+JmuayA1xAAchaqWkvRX8k6l7tPJgK6yReBsq5ntqnhqjcEw0N2X/7dVD7/eGkv26qGtdzGKCcfN1SOLEOSui9JqjPHdGPbh0UVIIB4vC6OicMNpPNXWumkpe80cmsq1DyTH8YUgGRaFvLZvtl+HRyI6cEDFAARQht6MXYnP1ItxcVRlu1fKijOK+4KltDZKwPJeftEKVRNqc0EL4Ig1uIO+fa1FJevZvrwc5uHZGyhL7ya+tgrPVT5/e930W5iv9mq08OETuITiWi/e43X2MAN/W6MEnaDdQU+HQ93jXde/b8q9qM3liSXADWggEGYw5oVqn0q9LnqOr0S335U71QT5mDGYlOCGhLtFnufVU5XYMRe07SOH38eeqKYjixDRvukhoaFEDyXFdlPqesmoTJ/e6FkPzwqIeHX7z+7u5vBMQwKrnXQjHQOBIVhS+EFEosoe6eeQK0aQMQ7GBOJSl/+dq1QPh4r/95RFBlVZ4QIjHP95/FBIX/YJ5T7xILCGGDSnrAv3LdH92Ck7zZbg4f4wnKD82WzxGV4Fm++1flqT8O/KL/GNk02cWbLSsFB0b/w/9FUWzkngXH7rpiystc29Fw4ziesA9g0vYDdd1bx0Z6AcVkiDFGUZC3OF8VidKzjymcqbxfCUhXFFGeYiN9E9lolaJTxpGw+FogvcfkZeFOBaWhFFJDBoqIoYJK+H2GUhXAk/aHbLNcq5aeJ9ehFEjm2KqM+t9Ge4RMEhO7BSC3Jq1qPScFYqW0J12TN7cCI13aUFQ5IIa6dfPvrAMY1qdXFtnzP1+081epay0jAAAAAElFTkSuQmCC"
    			},
    			"sonic move 8": {
    				name: "sonic move 8",
    				width: 34,
    				height: 35,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAYAAADxG9hnAAADeklEQVRYR7WWr3LcMBDGNzMFh/MEBgYGAfcEnYAAgQI/QbBBgEFApg/QCSgQCPATBB8UKOgTdA4EGBj4CYIPdCadT9L6VrLuTpdzRe6P7N2fdr/d1RUtvIq77QebHH+tr3LNZz8YG5QOsafKaubTDL39LwcoG6QonqeTTh5LFTgHjDHa/RftnQLKBpEeZ1DS6WBIK0OtURbGwvnITDYGQ+P4dAU7+MT/nwJhg6koAUIpF6mqdZHhtAVAg3FpWwIkAEJUfDQYxMK87EHwO4ZZDCQQrQeBw3ZwWjkmYqmbT6cmrppUmUoIrYlapCqKClfUWSCHShbhTp3cOuUq8pWU0gtgDoI0zb5cjdPVwbLkLTjhk1steEFqragoK6q/6XlZ+wpKggCieXBxHIeejDH0+vqDrq+/hxlI9IqgXKEZrUipfbOrqhBGPxDVdSIigNDaJ9O77Qei7kWnYSRaDJYAMaan9rEmKjZEY0365yYNstlsP+QJ2A8MILyI0P3913l0vAZi0eLE0t4E8rch+tKlQRAN9AA4rMq9SbzMxkyr6P71z7R5Kl2sG3kgpBpRb1ttm98sNVKg0AjDcDSQHu3HC4zZXuEFGUTCp0iXrXVkKNSJraZWESnt0pRq8SxUhgC1bUxo22avnbh7xkC21WtDJMq3L937lW921WPnbN816VkjI9N1biil1qa5tRMZUHauiMUzB5GT0PIZ7NXd7+WGHjvNhQEAFkMkU1OUhT0lygprrNekyyI8LhR/aCWuBPGjEoD3prADoB9G+7/LHEp9a5tZ1T1NMMhn0GnZkhj3yopT2XdTTlNnsCCa6CM+I2AAwlHB5+3bLt3YPIQFEAI9C2RH5K6Aux3RajWLiATpm2dCWWNmvL+Lll8q4lLl054DYTUygXgLnBb8hGOEGDrh73AwS40HkSHPTUmgEcBIAN6EcyxohL8n9REnvVRZN3f5WvZ9hHsL+sp0V004PLZ3uNQuvDzHhgE7RezMqGRH5NhpsMejgS8/fM849V6gkdyHjz3Hk5unNO4w65tV9kGzHzwFyxpCefOt7ticiu0tAsLRYOOqXru+RGhNeVFZBATjofXjAR26f9vZuwzSU924Jrk6URgXg8QQcGo2W3fL8xCycx8CWhREdmMeDak5nYL5LyCsFXRkuSRUDHMxCBzxHeZUZcn9cRgD3/8AVl7I7eAlkF4AAAAASUVORK5CYII="
    			},
    			"badnik a 1": {
    				name: "badnik a 1",
    				width: 87,
    				height: 33,
    				png: "data:image/png;base64,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"
    			},
    			"badnik a 2": {
    				name: "badnik a 2",
    				width: 87,
    				height: 35,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAAAjCAYAAADhe5a7AAANqUlEQVRoQ+WaaXRc5XnHf3d2zaKZ0eYZ7TPaLcmWJS8yNkaYBmM7PQRD47YEKDQnSdP2lNNy+ol86AntobQ0tKbn5BwCIRAHUiA2MTgsJnjBFsLYWJYdy7KtXRqto232uTNvz3stG0ic2qYfYonny8yZ+9yZ+/7e5/6f5Y7Cl8iyMzOFVQhtxUlAByiAChjnX02A2WhAtZiZjkSZmp6RLl/IvvCJX+jX/sAnNVmtYns0pl3FeQRWwIZCH4Ka+dcVwPrqUobuvpW/em4vPcMjX5jRFz7xD8zpmn6+2OEQ34vFGBaCIAoOIShKpbRzixDkAXogAmQCYcAtI9ph42RBLum+EURSxXRLEx2FHr73k9evi9d1OV/Tim4ApwarVTSkUlQIQXMyyagAq8mAxyRRXrRiwA4INU0qltA+UxoqMZTmM+PIpFMYsHxyAnoDeP2FzK6o5OdWE9ZQgt0f/YbjXT1XZXdVhxuA1XVdQq3NJrYkEtyWTJKhKMxYrRCP4yvMxe/3olOk0oJOr0NNpQiOBBns7Mfv8WDdvhH9uibUQh9TehtnXn+N9Gtv4zrXT3ZFIfYHNuNK6fj3ttN8MH4eYQ3izITBIYX+fh2BwNzneC4auK7MTGETggeiMTarSdLA20YjD1aX4Q6MoTQvRXd7MxajTF1gsFgYiUT4oK2D917dzz/cuZWSjfWkVjSRLF2Gw57F7IVWrN//NzrfOcxQMMwyox53ZSmhzY0M1PeQLPsYnw9eeFHPSy+ZaW8PL064BQ6H+GYkytaUShyYQaHekYHjW3eR6puBU+fQjw6jaPWB1ACF/xaCpxIqFtI8ducybrtpHY6mFtIVjTitTkTbLvivZwkfOM6JYIi3FfiOwYB9swn9X6oEqpLs3q3nxz82Mz6uR1Vhdnb2MuBFE7l+h0M8FwqREmBC4AWyDHoUXz7pqApTsyhhmbIu2pMovDOf0G7R69jusVO4fi2mpuVQlI9RTWPe+yviR9pJDk9ySGTyaEYNRckkzVu6KN8Iw/Finns2n+GRY2zaNEvTijTZWTAzo/DkD8yXtvG6ZO2Gcy6z20VLIsGjySSnBLgQ1P6eq5Q1bTfwiKJoie4OBPcCfikVJYUo3mxwmEklVfrP9PBR2MVoOoM+4xLedazCZjHxlYZforcLzo2uYry7jPrgbrx1naRLQkQcEI4o7HlTFnmLwFqsVvFIJIoDQRTwzFcDV1raHPBDFPYoCj4hwQpuv4LjnKLnWUMuezPXMmjIQ693Ys+spNTjojHvLQJzRgZn66i3mVnXuZf3guf5dWKYbjGDoiiYzYskcrdZreLJSIQngLuBZfOd18UC62IHJqNIFmITwH2KjpgQfBvBg1cAK/37dBk84N5MyNaIEJkYTUby87Pxe6w4s3VYM104Ymlc548zfbaVt1PZdEXPEI0evfyNiyJyJdx/jUT4GxRuAjYhcAJH52/McwhsQD4KBqAWocnCKgGPcLEd/qydBZ7TZ/Lr3L8lps8mElFoWJ7Dv/xzI6moh5monomggfHRKBNDF+g6O4jbq9J1YQ/tJ/YsHrjfyMgQX0kkGEil6EDqrYQHXhRCwHIEMoIlVMt89OYA7aBtQNkVIveI0cM/2jcwl9FIWjFTXW1l29f83Hf/GtKqmURKobcPjh2bpb19kJJiJ0VF4wwOtXJg/1scPnz4YkGyUCS3vr5eFBcXE4/H2bdv3+Xr/obHIzZ6vQz5P8Ukocl21oxgtRrGnONB73ARn5qir+0Ip873sl5NUnSFxY8De81+Hndvw2wq0KL2jk0u7ru/lLq6cnJzc9Hr9Qz0pdi3b5xfvnmWb32znCWeMKMjF3jn3Xd5/vnnFwZct9stnC4nW7dsYd1N64hEo+zcuZPu7m6SySTL/H7WrVlD6fKG30FlVKDOCo7KOtI2FyNdZzn6Pz9j174D/NHoCM3xOCWyZPvMmaeBXeYydrq3YbUWMTku2PpVB39+by4Ou4O5uTkKCvKxGPP58EiYp59p458e9WG2zDE9M0Vb21Ge+dEzCwNubm6uaGxq5P777qN5TbOWWDo6Onjyyf8gkUiwfPly6uquXHjJjL2yqYlSn49AIMCJ9nZ6urtpbW3jaGsrq8fG+AtgNQLz/BiyXTGx21LBLudXsWQUMBUUtLQo3LUtE4PewMN/9zBbtm5h210PMD1VyGOPH+Kh7S7Gp1sxWNJMBmd59ZVXFgbcrKwssWTJEnw+H+Xl5fj8JVgyjPznUztoXruO2ppa7HaZrn7XPgu3r6+ffe/uY/+BA9qmjB87xrKxMS0BOoCbEXSg8HNrI+/bN5AwFqAoetJp2LBBzx2bP4W7ceOt3HP3g0QiZZfh9o0cxGQVhEORhQNXykJOTg5ebz6FbhfZJhuRuJ5dB9+gobGRgsICRDqNGotSrKSIp53oSaLoIkR0eoo8mVSVL2U8otLe08tM/wDbT57kR6EcUoVrWVNVh9c2i/P1nZzOCPCJy89o5lpstkoGBiAWV7FmQFOTne1/msPp06fRqy56+92c6BAMDgdxO4zcvEHFajHxm9Pn+aDthwsjcp1OpzAajNxqt9NsMGBKwf6Ywnszw9izs8jPzyfXYcc1G2Tz2Bg61YKOFIoSJ5ah4PxjgVu3hM64j864C+fUEPE3D3E0724My1ewcnUpq8uX0v7Mi6hLfoGj0oi7sAyLOc2Z425Ot5dz5oJDPp5g9Ro7OkJkmM0MDRvoG1RRlBCxKNTV21DjBs6dO8XA8ALRXIfDIWSFsCmpsl4IOW/hVwYDHRYLoUSSnNxcfLnZlKoR7hmfhdAc8ViMlJpGcYDlIUiMwalIDf26UlwzQ7xypBNP1cO4SyyUlM1wS1MzAz2dFBT+jPJyJ8VFpWRlHqf3TIpDr61h7wfVHB+yotPNYjGFWLmqjJLSUnQ6A+PjAxjMBqIRONcV4FzXR8Ri+xdG5F5SUpPJJFJqCr1Bj8ViuTx9yrBkCBRBdk4WtUuXMRQYYGhwiNBsCGV+dntZjYXAmEppba+t7F5COjcJXQf+2g/564cS2DIEE2NfQ6+20FTdQVL/BoNvKbz8zno+GK+guqYTT56HlpYW6uuXIR/HdZw6iT3HDknBG6/vYffuXYRDsglfQHWujOBLkObmPh1Ky8/1eh1Ot5Otm7eiqiqnTp+ip6cHm1U+a/jUdOEIpkBAa4NLDFYspU3kbcjk9m17ufkmwdwMtB4o4ez+YrxBA/6lDQQnArx+yszhMR1+Xy+3376Jgvx8ljc04HRmcuRwK4pehyTddfY0Bw/up+2jEwsL7v/V7EhdNplNVFZU0rCiAbvNRigcIhy6OGKcDAYJh8PEQxHiwSDRWJToxAQty3P5s3vtLPuTLnSql8lhPYGTBsY+cRKfqaDlu39Pz3Afz+zcwzuHj+L3Z2IwGsjJyeXm9TdTU1PD4OAAU8EphgMBdIpCKq3S2dnF8ePHF06HdrVOUgK22WzU1tVRWe4nLy8HS4Ydu8PB9NQ0o2OjGoREIq6VYm0fttFSBN/+uhP/HTOELjg5cDDMdFcMs5pDuvxWtn7nu6goPL3jaV5+6SVKfLLlALvNTk11DfkF+Vr9HAqFGBvoJ7+wkIqltVoXKbu0BdP+Xg3upeP5+fki35uH3++jqroOj9dDIp7QFgxCa12lvf/+fnKSMzSV6bF6A4gLEQ61xQhPCOy5eaRXrqS5uZmNG2/jhRde4OkdOygsLqS+bhlShuQGTU9PMzIyon2fOjNNsd9H003rKSws5Iknnlh8cOVCZZKTSa+sogzZgOh0emqqqrWotmTIXgyCk5PIxqKz4yRnP2xFNzVLdXkRzjwPE2kdZ8bHkXfCU0/9QNuIxx9/nCXePLbddQ8KgmPHjnHw4KHPBWdpaaloaGhg7dpmdux4enHClUkuLVsrAcUlxaxatRKDwcjExASRiPyXAlgsGdqcYKC/n8H+fpR0GneWE6fLRTIlGBwa1ober772Ch9/fIzHvv+YVqlkZWWh0+m0O2FycvJzcG1Wm6iqrmL79q8vXrgSnlyorByqqqpYtXolZeXlBAIj7HzxpxpcvcFASlWJxWLaACg3L5e8JXnaA8yJ8QmGhoY0vzvvvJPR0VHOnDmjbdTAwADBYPCKcmq324XdbtcGO729fYszcj8Lt7a2Fn+Zn9q6WiwWM4cOHmD/+4c0qNJMej3ZDhvF1dXY56desk6+BDc7O1vTVykzUlZOnmyXd8A15aprcrrWZHIj+dlsNpFOpbWM7lniwef3UVZehstt55WXf8HM7BwR+TRYTeLNcpJdUkokGmdsdIyRQEDe8peXI6NRdoIul4ve3p7fG7m/vf5FC1cuVGpvJByh1FeK1+uloKCQmqU1OOx2YvEYPT29BIaHtTFmJBxlZCSgdXeyCpB6K81gMFBRWYHL7eLQbyWwqwXTlwKuLL9kBBcUFGAymXA4MjV4UpNTqRQy+UmwA/0DWpKTicvhvDjGLCn2keXOlu02bW0fXhev63K+2k7diMetVquQSSocCStZ7iwhOyy/369FpDTZuclolZEsRxFms0UmQ+yOi3CjkZi2CVJ3h4eHr4vXdTnfiPCu9ZokZKnBsoxyu90ouotLl4ktOBnU3ufk5WjH5IjzUskmI/ZaE9iXSnOvBP7SCFPM/8P8sz6yMnA4HJpUdHd3/78D738BTYR6wYo8+AMAAAAASUVORK5CYII="
    			},
    			"badnik a 3": {
    				name: "badnik a 3",
    				width: 87,
    				height: 33,
    				png: "data:image/png;base64,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"
    			},
    			"badnik b 1": {
    				name: "badnik b 1",
    				width: 51,
    				height: 37,
    				png: "data:image/png;base64,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"
    			},
    			"badnik b 2": {
    				name: "badnik b 2",
    				width: 50,
    				height: 37,
    				png: "data:image/png;base64,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"
    			},
    			"badnik b 3": {
    				name: "badnik b 3",
    				width: 52,
    				height: 37,
    				png: "data:image/png;base64,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"
    			},
    			grass: {
    				name: "grass",
    				width: 20,
    				height: 20,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAe0lEQVQ4T+2TQQ7AIAgEx2f1Wf1WP+KzajAlIUao5Vq5eBDG3VULFzezqsAByOqV7NuqUDgdoDSOAwFbt0pXqCoSgA5SN4jCmeXI5otK37Lm9zHHOEOrxoLtYWr56V0HjlY17yGePNDJcgMXvkL6HSbZ+1KSwZmxH2bYAJl8KYDX8K/LAAAAAElFTkSuQmCC"
    			},
    			sonic: {
    				name: "sonic",
    				width: 29,
    				height: 39,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAnCAYAAADzckPEAAADZUlEQVRYR7WWrXLcMBSF784UGOcJDAwMAvIEnYIAgQLjPIFBgMCCTB6gs6BAIMBPELygQKCguCggwMBgn6B4QWe2cyRf7bUs/+x2YrJr6+fTvTr3SBtaePL7t1Pc5fDzbrM0bq59NDgFmZvgmgUEaJ7vhhEVaszqrP+WaIvhmO9weEpmZBxpDJeQzlJriErtwaooyXbtYHGAcwCroXKGOHqjLCnlMyDBeB/A+4xcBcVkDox0dpYk1IFffLT8xOCroANR9VAAdGccRwJT4CmRXa1eCVSqJWt9xDLaRehcqaQicgDrI2ZFc78lsIt0TW1iQmOItO6j6cWy/6GpLLAAH60EYkzTZKNsbhyQ6y/lAqImByWCPTaKlBJCsi1pbUMdm0eiqhq7V6ipRVuLDWEKuq2I/tZEnxoy3/dpaAo2cqcJF0Iko0i3FbXvLZW35WVQXsiSNfI+h3Jx+4q0a9LaOCNJpncqrUFc8X4XikyhgzNZGu6rU7VWRMqQRqqJ6NAdBmJKGvJIzQIcXElBxueSaQsYMlHZG0e5bbyB3NfUNEPjnzeHhKqlFSKV7MVxxtBWNb+WT5nJlEYzAuyiUMrtoQTjHc8UEG2DlXDNxkadVDOROwDiZw7GfRevHVPAlACnTpW470XQ1HkalKy0U60yPnrYoktzypHmnEhGuQTkeVCfqFNZuzF4NlK+5+zrLydfj4ryonQGz/UYRNSXEKwXUH8AeKPIsqHpL6YXk9f17sRAV4s9dATGAW/PquaIL4YiWlyL6se++AUw7J31DuWvL+dy4hRflF4exJFKc5di0S++J24K3Ne325Ebjep0SlSYCG2IBmDsF/9iYtv5GyJfT7h/bH+r6zQVLZcDgK+v3+jm5tkd3Gtv+6uEJMEyGwDi+VBoqNtC0Z/fnx3w4eGZnN1+RKQsEL4DAQogVF19NQ46dSeKtbIqvVKRrGAufhYXqzlle1dDeSA7EB9hrOq5ErkKmhf5SXcHqvvRuBOYIid8y/dvvlyqO/fLfbLo2JTgxfQyEJPH5oAbH8BB3f2f9v14tsoso3gBq6C4v6o+EgYgWiyEI+TvHLk7GG4z//l4JBLwVVCOhlPHk8g0Y+623jkG9h2LCf1FbhH1RVC5Z/g/BUVb2TwN9CMXsAjFSOxrrMD/ef8HjdbYkRh9dEcAAAAASUVORK5CYII="
    			},
    			"sonic spin": {
    				name: "sonic spin",
    				width: 30,
    				height: 30,
    				png: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACvElEQVRIS52XLX7kMAzFNWyOMSAgcA5RYFCQYwwoCCiYIxQaFOQYCwoMFuwRCgMG5BjDur8nW47ir2TXpE1i++8nPcntif5hXF6+f1rTl9/X09HtdicKzHR93NM95nX/h/O/d4Z/HIU3wYAKcAMTbIDOlqgfV/iRAxTBWqVzNo8e1CkoJgBszEj6gC31GTjmUUIo2BDKeIqHIyjVo/80pCN0GMzQJGdVsygwgBiAGjOTc31UXoNvFF8uHz9iEmxk34g3wSjmWJ0q9QKesWYXrKFNQwVl+jAMcZZzrBW34FFxsUZ1nkOOsZm1ROOoooB5naH5ay05/b2kmsEZNDVWYrBaRDSYnf7q630fXAPWnJ04LwP3liNRBKflsyz3NQpHHa4cbUwwo5tpfB9oeSzFXnHS4P+FinDJPxvvEPjhqAVFWY2f1Yqm+S30awDJkKgmZ6l/n+JCrZ4V6xykTURKooa1HUrIEBnYPG+vAjYvN5omn0aM6iUhF8Re44jgysnOwwrTU5qXhO7L2b6hrgHmdgnVajjnaJj+ZPtbIr7T65cEvpbKSy4L9c2aNcdYVgLiPaA3IkLWy+AEKBtDFV8IoVOx0s6RtV41nDwM5b9CnkEp5hXBEi3u3WFoMF7JbSQNYxxtE66hWH8mOtVz3FAtB0IejXWkwbzx+bzZl8HPJz6w2rEE3pRT4qg0lxxq6zjE3mC+a2lwhPoPZXALqs8gBnbBU1zGxjcOnecaNHO1gGMXU3kWsIYgxIDLO28wR3a6Z9Un/QthLpaTXqEN5kO5VSYKAdMjBafQKli3UR1+CbE0CwD76U6oTR4wUCgrM1w5nzJEqTw3WyZPUu4elzvNt4+4GaAyAHe/vuPzMlyr0N1Qb8KnGkCWwPDiEsASiVSlXrf7L4xMlh5bg+K9joa+iUprDoOxeA/eUpjC/wLdGpvb6SzVmQAAAABJRU5ErkJggg=="
    			}
    		},
    		blocks: {
    			grass: {
    				name: "grass",
    				solid: true,
    				throwOnTouch: false,
    				dps: 0,
    				graphic: "grass"
    			}
    		},
    		characters: {
    			sonic: {
    				graphicStill: "sonic",
    				graphicSpinning: "sonic spin",
    				motionGraphics: [
    					"sonic move 1",
    					"sonic move 2",
    					"sonic move 3",
    					"sonic move 4",
    					"sonic move 5",
    					"sonic move 6",
    					"sonic move 7"
    				],
    				framesPerGraphic: 3,
    				name: "sonic",
    				maxHealth: 100,
    				maxVelocity: 8,
    				jumpVelocity: 15,
    				gravityMultiplier: 1,
    				fallDamageMultiplier: 1,
    				dps: 100,
    				canFly: false,
    				canSpin: true,
    				spinDegreesPerFrame: 20,
    				canFireProjectiles: false,
    				projectileDamage: 50,
    				projectileYStart: 20,
    				projectileVelocity: 20,
    				projectileGravityMultiplier: 0.1,
    				motionGraphicsLoopBack: true
    			}
    		},
    		enemies: {
    			"badnik b": {
    				graphicStill: "badnik b 1",
    				motionGraphics: [
    					"badnik b 1",
    					"badnik b 2",
    					"badnik b 3"
    				],
    				name: "badnik b",
    				maxHealth: 100,
    				maxVelocity: 5,
    				jumpVelocity: 10,
    				gravityMultiplier: 1,
    				fallDamageMultiplier: 1,
    				dps: 120,
    				score: 1,
    				framesPerGraphic: 5
    			},
    			"badnik a": {
    				graphicStill: "badnik a 1",
    				motionGraphics: [
    					"badnik a 1",
    					"badnik a 2",
    					"badnik a 3"
    				],
    				name: "badnik a",
    				maxHealth: 100,
    				maxVelocity: 5,
    				jumpVelocity: 10,
    				gravityMultiplier: 1,
    				fallDamageMultiplier: 1,
    				dps: 120,
    				score: 1,
    				framesPerGraphic: 8
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
    						x: 120,
    						y: -40,
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
    						name: "grass",
    						x: 240,
    						y: 0,
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
    						x: 320,
    						y: -40,
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
    						x: 440,
    						y: -40,
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
    						x: 800,
    						y: -40,
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
    						x: 1080,
    						y: -40,
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
    						y: 0,
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
    						y: 0,
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
    						x: 1280,
    						y: -40,
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
    						x: 1320,
    						y: -40,
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
    						x: 1360,
    						y: -40,
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
    						y: 0,
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
    						y: 80,
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
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1600,
    						y: 80,
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
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1640,
    						y: 80,
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
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1680,
    						y: 120,
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
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1720,
    						y: 120,
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
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1760,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1760,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1760,
    						y: 80,
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
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1800,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1800,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1800,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1800,
    						y: 80,
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
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1840,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1840,
    						y: 200,
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
    						name: "grass",
    						x: 1840,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1840,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1840,
    						y: 40,
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
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1880,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1880,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1880,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1880,
    						y: 200,
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
    						name: "grass",
    						x: 1880,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1880,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1880,
    						y: 40,
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
    						y: 360,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1920,
    						y: 40,
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
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1960,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1960,
    						y: 240,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1960,
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1960,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1960,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1960,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 1960,
    						y: 40,
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
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2000,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2000,
    						y: 240,
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
    						name: "grass",
    						x: 2000,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2000,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2000,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2000,
    						y: 40,
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
    						y: 320,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2040,
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2040,
    						y: 240,
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
    						name: "grass",
    						x: 2040,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2040,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2040,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2040,
    						y: 40,
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
    						y: 280,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2080,
    						y: 240,
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
    						name: "grass",
    						x: 2080,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2080,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2080,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2080,
    						y: 40,
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
    						y: 240,
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
    						name: "grass",
    						x: 2120,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2120,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2120,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2120,
    						y: 40,
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
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2160,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2160,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2160,
    						y: 80,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2160,
    						y: 40,
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
    						y: 200,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2200,
    						y: 160,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2200,
    						y: 120,
    						width: 40,
    						height: 40
    					},
    					{
    						name: "grass",
    						x: 2200,
    						y: 80,
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
    						y: 160,
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
    						y: 160,
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
    					}
    				],
    				enemies: [
    					{
    						name: "badnik b",
    						x: 760,
    						y: 280
    					},
    					{
    						name: "badnik b",
    						x: 920,
    						y: 120
    					},
    					{
    						name: "badnik b",
    						x: 560,
    						y: -40
    					},
    					{
    						name: "badnik a",
    						x: 1440,
    						y: 200
    					},
    					{
    						name: "badnik a",
    						x: 2160,
    						y: 440
    					},
    					{
    						name: "badnik a",
    						x: 2360,
    						y: 240
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

    var editIcon = { pencil: { width: 1536, height: 1792, paths: [{ d: 'M363 1536l91-91-235-235-91 91v107h128v128h107zM886 608q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zM832 416l416 416-832 832h-416v-416zM1515 512q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z' }] } };

    var playIcon = { play: { width: 1408, height: 1792, paths: [{ d: 'M1384 927l-1328 738q-23 13-39.5 3t-16.5-36v-1472q0-26 16.5-36t39.5 3l1328 738q23 13 23 31t-23 31z' }] } };

    var arrowLeftIcon = { 'arrow-left': { width: 1536, height: 1792, paths: [{ d: 'M1536 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z' }] } };

    var arrowRightIcon = { 'arrow-right': { width: 1536, height: 1792, paths: [{ d: 'M1472 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293h-704q-52 0-84.5-37.5t-32.5-90.5v-128q0-53 32.5-90.5t84.5-37.5h704l-293-294q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z' }] } };

    var arrowUpIcon = { 'arrow-up': { width: 1664, height: 1792, paths: [{ d: 'M1611 971q0 51-37 90l-75 75q-38 38-91 38-54 0-90-38l-294-293v704q0 52-37.5 84.5t-90.5 32.5h-128q-53 0-90.5-32.5t-37.5-84.5v-704l-294 293q-36 38-90 38t-90-38l-75-75q-38-38-38-90 0-53 38-91l651-651q35-37 90-37 54 0 91 37l651 651q37 39 37 91z' }] } };

    var arrowDownIcon = { 'arrow-down': { width: 1664, height: 1792, paths: [{ d: 'M1611 832q0 53-37 90l-651 652q-39 37-91 37-53 0-90-37l-651-652q-38-36-38-90 0-53 38-91l74-75q39-37 91-37 53 0 90 37l294 294v-704q0-52 38-90t90-38h128q52 0 90 38t38 90v704l294-294q37-37 90-37 52 0 91 37l75 75q37 39 37 91z' }] } };

    var addIcon = { plus: { width: 1408, height: 1792, paths: [{ d: 'M1408 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z' }] } };

    var caretDownIcon = { 'caret-down': { width: 1024, height: 1792, paths: [{ d: 'M1024 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z' }] } };

    var undoIcon = { undo: { width: 1536, height: 1792, paths: [{ d: 'M1536 896q0 156-61 298t-164 245-245 164-298 61q-172 0-327-72.5t-264-204.5q-7-10-6.5-22.5t8.5-20.5l137-138q10-9 25-9 16 2 23 12 73 95 179 147t225 52q104 0 198.5-40.5t163.5-109.5 109.5-163.5 40.5-198.5-40.5-198.5-109.5-163.5-163.5-109.5-198.5-40.5q-98 0-188 35.5t-160 101.5l137 138q31 30 14 69-17 40-59 40h-448q-26 0-45-19t-19-45v-448q0-42 40-59 39-17 69 14l130 129q107-101 244.5-156.5t284.5-55.5q156 0 298 61t245 164 164 245 61 298z' }] } };

    var spinner = { spinner: { width: 1792, height: 1792, paths: [{ d: 'M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zM1024 1600q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zM320 896q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zM1522 1394q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zM558 398q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zM1728 896q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zM1088 192q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zM1618 398q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z' }] } };

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

    var autoSaveStore = LocalStorageStore('auto-saves', {});

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
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

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
    	const label_slot_template = /*$$slots*/ ctx[19].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[18], get_label_slot_context);
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
    			/*a_binding*/ ctx[20](null);
    			if (if_block1) if_block1.d();
    			/*div_binding_1*/ ctx[22](null);
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

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
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
    			id: create_fragment$6.name
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
    const file$5 = "src\\components\\ColorPicker.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
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
    			attr_dev(div, "class", "color-choice svelte-1tel1fa");
    			set_style(div, "background", getBackground(/*value*/ ctx[0]));
    			attr_dev(div, "title", "Change color");
    			add_location(div, file$5, 11, 2, 440);
    			attr_dev(span, "slot", "label");
    			add_location(span, file$5, 10, 1, 417);
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

    // (24:4) {#each colorGroup as color}
    function create_each_block_1$1(ctx) {
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
    			add_location(div, file$5, 24, 5, 890);
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
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(24:4) {#each colorGroup as color}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#each colors as colorGroup}
    function create_each_block$1(ctx) {
    	let div;
    	let t;
    	let each_value_1 = /*colorGroup*/ ctx[10];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "color-group svelte-1tel1fa");
    			add_location(div, file$5, 22, 3, 825);
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
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(22:2) {#each colors as colorGroup}",
    		ctx
    	});

    	return block;
    }

    // (10:0) <QuickDropdown btnClass="color-picker-toggle" noCaret bind:isOpen>
    function create_default_slot$1(ctx) {
    	let t;
    	let div;
    	let each_value = /*colors*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "color-picker-choices svelte-1tel1fa");
    			add_location(div, file$5, 20, 1, 754);
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		source: "(10:0) <QuickDropdown btnClass=\\\"color-picker-toggle\\\" noCaret bind:isOpen>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const colorSteps = 6;
    const colorDarknessSteps = 10;

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

    function instance$7($$self, $$props, $$invalidate) {
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

    /* src\components\FieldText.svelte generated by Svelte v3.24.1 */
    const file$6 = "src\\components\\FieldText.svelte";

    function create_fragment$8(ctx) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { value: 0, name: 1 });

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
    }

    /* src\components\SaveBtn.svelte generated by Svelte v3.24.1 */

    const file$7 = "src\\components\\SaveBtn.svelte";

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

    /* src\components\Form.svelte generated by Svelte v3.24.1 */
    const file$8 = "src\\components\\Form.svelte";
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
    const file$9 = "src\\components\\InputSelect.svelte";

    const get_default_slot_changes_2 = dirty => ({
    	option: dirty[0] & /*filteredOptions*/ 32768
    });

    const get_default_slot_context_2 = ctx => ({ option: /*option*/ ctx[39] });

    function get_each_context$2(ctx, list, i) {
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

    function get_each_context_1$2(ctx, list, i) {
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
    			add_location(span, file$9, 22, 5, 758);
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
    			add_location(span, file$9, 16, 5, 625);
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
    function create_each_block_1$2(key_1, ctx) {
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
    		id: create_each_block_1$2.name,
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
    			add_location(span, file$9, 30, 4, 966);
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
    function create_if_block$3(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block = /*filterable*/ ctx[6] && create_if_block_2$2(ctx);
    	let each_value = /*filteredOptions*/ ctx[15];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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
    			add_location(div, file$9, 39, 2, 1196);
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
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		id: create_if_block$3.name,
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
    			create_component(icon.$$.fragment);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", /*filterPlaceholder*/ ctx[11]);
    			add_location(input, file$9, 43, 6, 1312);
    			attr_dev(a, "class", "input-group-addon");
    			attr_dev(a, "href", "/");
    			attr_dev(a, "tabindex", "-1");
    			add_location(a, file$9, 44, 6, 1439);
    			attr_dev(div0, "class", "input-group");
    			add_location(div0, file$9, 42, 5, 1279);
    			attr_dev(div1, "class", "filter svelte-qly777");
    			add_location(div1, file$9, 41, 4, 1252);
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
    	let if_block = /*filter*/ ctx[1] != null && /*filter*/ ctx[1].length > 0 && create_if_block_1$2(ctx);

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
    					if_block = create_if_block_1$2(ctx);
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
    function create_if_block_1$2(ctx) {
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
    			add_location(div, file$9, 63, 5, 2038);
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
    		id: create_if_block_1$2.name,
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
    function create_each_block$2(ctx) {
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
    			add_location(div, file$9, 51, 4, 1681);
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(51:3) {#each filteredOptions as option, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
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
    	validate_each_keys(ctx, each_value_1, get_each_context_1$2, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$2(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$2(key, child_ctx));
    	}

    	let if_block1 = (/*selectedOptions*/ ctx[16] == null || /*selectedOptions*/ ctx[16].length === 0) && create_if_block_3$1(ctx);

    	icon = new Icon({
    			props: { data: caretDownIcon, class: "fw" },
    			$$inline: true
    		});

    	let if_block2 = /*isOpen*/ ctx[0] && !/*disabled*/ ctx[7] && create_if_block$3(ctx);

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
    			add_location(div0, file$9, 11, 2, 321);
    			attr_dev(span, "class", "dropdown-icon svelte-qly777");
    			add_location(span, file$9, 33, 2, 1069);
    			attr_dev(div1, "class", div1_class_value = "btn btn-light " + /*className*/ ctx[8] + " svelte-qly777");
    			attr_dev(div1, "data-test", div1_data_test_value = "" + (/*name*/ ctx[2] + "-btn"));
    			attr_dev(div1, "tabindex", tabindex$1);
    			toggle_class(div1, "btn-sm", /*sm*/ ctx[10]);
    			toggle_class(div1, "open", /*isOpen*/ ctx[0]);
    			add_location(div1, file$9, 1, 1, 100);
    			attr_dev(div2, "class", "select svelte-qly777");
    			attr_dev(div2, "data-test", /*name*/ ctx[2]);
    			attr_dev(div2, "id", /*name*/ ctx[2]);
    			toggle_class(div2, "inline", /*inline*/ ctx[9]);
    			toggle_class(div2, "disabled", /*disabled*/ ctx[7]);
    			add_location(div2, file$9, 0, 0, 0);
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
    				validate_each_keys(ctx, each_value_1, get_each_context_1$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div0, outro_and_destroy_block, create_each_block_1$2, t1, get_each_context_1$2);
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
    					if_block2 = create_if_block$3(ctx);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const tabindex$1 = 0;

    function instance$b($$self, $$props, $$invalidate) {
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
    		dispatch("change", value);
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
    			instance$b,
    			create_fragment$b,
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
    			id: create_fragment$b.name
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

    /* src\components\Art.svelte generated by Svelte v3.24.1 */
    const file$a = "src\\components\\Art.svelte";

    // (1:0) {#if graphic != null && graphic.png != null}
    function create_if_block$4(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*graphic*/ ctx[1].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*graphic*/ ctx[1].name);
    			attr_dev(img, "title", img_title_value = /*graphic*/ ctx[1].name);
    			set_style(img, "transform", "rotate(" + /*spin*/ ctx[0] + "deg)");
    			add_location(img, file$a, 1, 1, 47);
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

    			if (dirty & /*spin*/ 1) {
    				set_style(img, "transform", "rotate(" + /*spin*/ ctx[0] + "deg)");
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

    function create_fragment$c(ctx) {
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(3, $project = $$value));
    	let { name } = $$props;
    	let { spin = 0 } = $$props;
    	let graphic;
    	const writable_props = ["name", "spin"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Art> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Art", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("spin" in $$props) $$invalidate(0, spin = $$props.spin);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		project,
    		name,
    		spin,
    		graphic,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("spin" in $$props) $$invalidate(0, spin = $$props.spin);
    		if ("graphic" in $$props) $$invalidate(1, graphic = $$props.graphic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name, $project*/ 12) {
    			 if (name != null) $$invalidate(1, graphic = $project.art[name]);
    		}
    	};

    	return [spin, graphic, name];
    }

    class Art extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { name: 2, spin: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Art",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[2] === undefined && !("name" in props)) {
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
    }

    /* src\components\BuildLayout.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$2 } = globals;
    const file$b = "src\\components\\BuildLayout.svelte";

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
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
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
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
    			attr_dev(a, "href", a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[8].name + "/new"));
    			attr_dev(a, "class", "sub-nav-item svelte-ur1zzz");
    			toggle_class(a, "new", /*store*/ ctx[2][/*activeName*/ ctx[1]] == null);
    			add_location(a, file$b, 6, 5, 242);
    			attr_dev(div, "class", "sub-nav svelte-ur1zzz");
    			add_location(div, file$b, 5, 4, 214);
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
    			if (!current || dirty & /*baseUrl*/ 8 && a_href_value !== (a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[8].name + "/new"))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*store, activeName*/ 6) {
    				toggle_class(a, "new", /*store*/ ctx[2][/*activeName*/ ctx[1]] == null);
    			}

    			if (dirty & /*baseUrl, tabs, Object, store, activeName, tab*/ 31) {
    				each_value_1 = Object.keys(/*store*/ ctx[2]).sort();
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
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
    function create_if_block_1$3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*store*/ ctx[2][/*name*/ ctx[11]].thumbnail)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "level-thumbnail svelte-ur1zzz");
    			attr_dev(img, "alt", "");
    			add_location(img, file$b, 13, 9, 666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*store*/ 4 && img.src !== (img_src_value = /*store*/ ctx[2][/*name*/ ctx[11]].thumbnail)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(13:8) {#if tab == 'levels'}",
    		ctx
    	});

    	return block;
    }

    // (8:5) {#each Object.keys(store).sort() as name}
    function create_each_block_1$3(ctx) {
    	let a;
    	let art;
    	let t0;
    	let div;
    	let span;
    	let t1_value = /*name*/ ctx[11] + "";
    	let t1;
    	let t2;
    	let a_href_value;
    	let current;

    	art = new Art({
    			props: {
    				name: /*tab*/ ctx[0] == "art"
    				? /*name*/ ctx[11]
    				: /*store*/ ctx[2][/*name*/ ctx[11]][/*t*/ ctx[8].graphicKey]
    			},
    			$$inline: true
    		});

    	let if_block = /*tab*/ ctx[0] == "levels" && create_if_block_1$3(ctx);

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
    			add_location(span, file$b, 11, 8, 605);
    			attr_dev(div, "class", "flex-column");
    			add_location(div, file$b, 10, 7, 570);
    			attr_dev(a, "class", "sub-nav-item svelte-ur1zzz");
    			attr_dev(a, "href", a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[8].name + "/" + /*name*/ ctx[11]));
    			toggle_class(a, "active", /*activeName*/ ctx[1] == /*name*/ ctx[11]);
    			add_location(a, file$b, 8, 6, 399);
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
    			? /*name*/ ctx[11]
    			: /*store*/ ctx[2][/*name*/ ctx[11]][/*t*/ ctx[8].graphicKey];

    			art.$set(art_changes);
    			if ((!current || dirty & /*store*/ 4) && t1_value !== (t1_value = /*name*/ ctx[11] + "")) set_data_dev(t1, t1_value);

    			if (/*tab*/ ctx[0] == "levels") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*baseUrl, store*/ 12 && a_href_value !== (a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[8].name + "/" + /*name*/ ctx[11]))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*activeName, Object, store*/ 6) {
    				toggle_class(a, "active", /*activeName*/ ctx[1] == /*name*/ ctx[11]);
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
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(8:5) {#each Object.keys(store).sort() as name}",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#each tabs as t}
    function create_each_block$3(ctx) {
    	let a;
    	let t0_value = /*t*/ ctx[8].name + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let if_block = /*t*/ ctx[8].name == /*tab*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(a, "class", "sub-nav-item svelte-ur1zzz");
    			attr_dev(a, "href", a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[8].name + "/new"));
    			toggle_class(a, "active", /*tab*/ ctx[0] == /*t*/ ctx[8].name);
    			add_location(a, file$b, 3, 3, 89);
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
    			if (!current || dirty & /*baseUrl*/ 8 && a_href_value !== (a_href_value = "" + (/*baseUrl*/ ctx[3] + "/" + /*t*/ ctx[8].name + "/new"))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*tab, tabs*/ 17) {
    				toggle_class(a, "active", /*tab*/ ctx[0] == /*t*/ ctx[8].name);
    			}

    			if (/*t*/ ctx[8].name == /*tab*/ ctx[0]) {
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(3:2) {#each tabs as t}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	let each_value = /*tabs*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

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
    			attr_dev(div0, "class", "sub-nav nav-column svelte-ur1zzz");
    			add_location(div0, file$b, 1, 1, 31);
    			attr_dev(div1, "class", "flex-grow pl-2");
    			add_location(div1, file$b, 22, 1, 833);
    			attr_dev(div2, "class", "flex align-top");
    			add_location(div2, file$b, 0, 0, 0);
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
    			if (dirty & /*Object, store, baseUrl, tabs, activeName, tab*/ 31) {
    				each_value = /*tabs*/ ctx[4];
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
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(7, $project = $$value));
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BuildLayout> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BuildLayout", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("tab" in $$props) $$invalidate(0, tab = $$props.tab);
    		if ("activeName" in $$props) $$invalidate(1, activeName = $$props.activeName);
    		if ("store" in $$props) $$invalidate(2, store = $$props.store);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Art,
    		project,
    		tab,
    		activeName,
    		store,
    		tabs,
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
    		if ($$self.$$.dirty & /*$project*/ 128) {
    			 $$invalidate(3, baseUrl = `#/${$project.name}/build`);
    		}
    	};

    	return [tab, activeName, store, baseUrl, tabs, $$scope, $$slots];
    }

    class BuildLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { tab: 0, activeName: 1, store: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BuildLayout",
    			options,
    			id: create_fragment$d.name
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

    function makeThumbnail(srcCanvas, width, height) {
    	const canvas = document.createElement('canvas');
    	canvas.width = width;
    	canvas.height = height;

    	const context = canvas.getContext('2d');
    	context.drawImage(srcCanvas, 0, 0, width, height);
    	return canvas.toDataURL('image/png')
    }

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

    /* src\pages\Build\ArtMaker.svelte generated by Svelte v3.24.1 */

    const { console: console_1$3 } = globals;
    const file$c = "src\\pages\\Build\\ArtMaker.svelte";

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[66] = list[i];
    	return child_ctx;
    }

    // (8:3) {#if !isAdding}
    function create_if_block_1$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$c, 8, 4, 358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[34], false, false, false);
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
    		id: create_if_block_1$4.name,
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
    	let if_block = !/*isAdding*/ ctx[9] && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			input_1 = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "class", "form-control width-auto svelte-59xta7");
    			attr_dev(input_1, "id", "name");
    			attr_dev(input_1, "name", "name");
    			add_location(input_1, file$c, 5, 3, 209);
    			attr_dev(span, "slot", "buttons");
    			attr_dev(span, "class", "flex svelte-59xta7");
    			add_location(span, file$c, 4, 2, 170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, input_1);
    			set_input_value(input_1, /*input*/ ctx[0].name);
    			/*input_1_binding*/ ctx[33](input_1);
    			append_dev(span, t);
    			if (if_block) if_block.m(span, null);

    			if (!mounted) {
    				dispose = listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[32]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*input*/ 1 && input_1.value !== /*input*/ ctx[0].name) {
    				set_input_value(input_1, /*input*/ ctx[0].name);
    			}

    			if (!/*isAdding*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$4(ctx);
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
    			/*input_1_binding*/ ctx[33](null);
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

    // (30:3) <InputSelect      disabled={$autoSaveStore[input.name] == null}      options={$autoSaveStore[input.name]}      on:change={e => loadAutoSave(e.detail)}      let:option      placeholder="Auto-saves"      inline      sm>
    function create_default_slot_2(ctx) {
    	let t0_value = /*option*/ ctx[72].name + "";
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			img = element("img");
    			if (img.src !== (img_src_value = /*option*/ ctx[72].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "height", "40");
    			attr_dev(img, "alt", "");
    			add_location(img, file$c, 38, 4, 1581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[2] & /*option*/ 1024 && t0_value !== (t0_value = /*option*/ ctx[72].name + "")) set_data_dev(t0, t0_value);

    			if (dirty[2] & /*option*/ 1024 && img.src !== (img_src_value = /*option*/ ctx[72].png)) {
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(30:3) <InputSelect      disabled={$autoSaveStore[input.name] == null}      options={$autoSaveStore[input.name]}      on:change={e => loadAutoSave(e.detail)}      let:option      placeholder=\\\"Auto-saves\\\"      inline      sm>",
    		ctx
    	});

    	return block;
    }

    // (109:4) {#if input.width == 20 && input.height == 20}
    function create_if_block$6(ctx) {
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

    			attr_dev(div, "class", "ml-2");
    			add_location(div, file$c, 109, 5, 4202);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(109:4) {#if input.width == 20 && input.height == 20}",
    		ctx
    	});

    	return block;
    }

    // (113:8) {#each [0, 0, 0] as margin}
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
    			add_location(img, file$c, 113, 9, 4309);
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
    		source: "(113:8) {#each [0, 0, 0] as margin}",
    		ctx
    	});

    	return block;
    }

    // (111:6) {#each [0, 0] as r}
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
    			add_location(div, file$c, 111, 7, 4256);
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
    		source: "(111:6) {#each [0, 0] as r}",
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
    	let inputselect;
    	let t7;
    	let div1;
    	let button4;
    	let icon3;
    	let t8;

    	let t9_value = (/*undos*/ ctx[2].length > 0
    	? /*undos*/ ctx[2].length
    	: "") + "";

    	let t9;
    	let button4_disabled_value;
    	let t10;
    	let button5;
    	let icon4;
    	let t11;

    	let t12_value = (/*redos*/ ctx[3].length > 0
    	? /*redos*/ ctx[3].length
    	: "") + "";

    	let t12;
    	let button5_disabled_value;
    	let t13;
    	let div2;
    	let button6;
    	let icon5;
    	let t14;
    	let button7;
    	let icon6;
    	let t15;
    	let div3;
    	let button8;
    	let icon7;
    	let t16;
    	let button9;
    	let icon8;
    	let t17;
    	let button10;
    	let icon9;
    	let t18;
    	let button11;
    	let icon10;
    	let t19;
    	let div4;
    	let t20;
    	let input0;
    	let t21;
    	let div5;
    	let t22;
    	let input1;
    	let t23;
    	let label;
    	let input2;
    	let t24;
    	let t25;
    	let div9;
    	let canvas0;
    	let t26;
    	let canvas1;
    	let t27;
    	let div8;
    	let div7;
    	let img;
    	let img_src_value;
    	let img_width_value;
    	let img_height_value;
    	let t28;
    	let current;
    	let mounted;
    	let dispose;

    	function colorpicker_value_binding(value) {
    		/*colorpicker_value_binding*/ ctx[35].call(null, value);
    	}

    	let colorpicker_props = {};

    	if (/*selectedColor*/ ctx[6] !== void 0) {
    		colorpicker_props.value = /*selectedColor*/ ctx[6];
    	}

    	colorpicker = new ColorPicker({ props: colorpicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorpicker, "value", colorpicker_value_binding));
    	colorpicker.$on("change", /*change_handler*/ ctx[36]);

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

    	inputselect = new InputSelect({
    			props: {
    				disabled: /*$autoSaveStore*/ ctx[12][/*input*/ ctx[0].name] == null,
    				options: /*$autoSaveStore*/ ctx[12][/*input*/ ctx[0].name],
    				placeholder: "Auto-saves",
    				inline: true,
    				sm: true,
    				$$slots: {
    					default: [
    						create_default_slot_2,
    						({ option }) => ({ 72: option }),
    						({ option }) => [0, 0, option ? 1024 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputselect.$on("change", /*change_handler_1*/ ctx[40]);

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
    			create_component(inputselect.$$.fragment);
    			t7 = space();
    			div1 = element("div");
    			button4 = element("button");
    			create_component(icon3.$$.fragment);
    			t8 = space();
    			t9 = text(t9_value);
    			t10 = space();
    			button5 = element("button");
    			create_component(icon4.$$.fragment);
    			t11 = space();
    			t12 = text(t12_value);
    			t13 = space();
    			div2 = element("div");
    			button6 = element("button");
    			create_component(icon5.$$.fragment);
    			t14 = space();
    			button7 = element("button");
    			create_component(icon6.$$.fragment);
    			t15 = space();
    			div3 = element("div");
    			button8 = element("button");
    			create_component(icon7.$$.fragment);
    			t16 = space();
    			button9 = element("button");
    			create_component(icon8.$$.fragment);
    			t17 = space();
    			button10 = element("button");
    			create_component(icon9.$$.fragment);
    			t18 = space();
    			button11 = element("button");
    			create_component(icon10.$$.fragment);
    			t19 = space();
    			div4 = element("div");
    			t20 = text("Height\r\n\t\t\t\t");
    			input0 = element("input");
    			t21 = space();
    			div5 = element("div");
    			t22 = text("Width\r\n\t\t\t\t");
    			input1 = element("input");
    			t23 = space();
    			label = element("label");
    			input2 = element("input");
    			t24 = text("\r\n\t\t\t\tShow grid");
    			t25 = space();
    			div9 = element("div");
    			canvas0 = element("canvas");
    			t26 = space();
    			canvas1 = element("canvas");
    			t27 = space();
    			div8 = element("div");
    			div7 = element("div");
    			img = element("img");
    			t28 = space();
    			if (if_block) if_block.c();
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", button0_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "paint" ? "primary" : "light"));
    			attr_dev(button0, "title", "Paint brush");
    			add_location(button0, file$c, 16, 4, 660);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", button1_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "fill" ? "primary" : "light"));
    			attr_dev(button1, "title", "Paint bucket");
    			add_location(button1, file$c, 19, 4, 852);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", button2_class_value = "btn btn-sm btn-" + (/*mode*/ ctx[1] == "erase" ? "primary" : "light"));
    			attr_dev(button2, "title", "Eraser");
    			add_location(button2, file$c, 22, 4, 1042);
    			attr_dev(div0, "class", "btn-group svelte-59xta7");
    			add_location(div0, file$c, 15, 3, 631);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn btn-light btn-sm mr1");
    			add_location(button3, file$c, 27, 3, 1241);
    			attr_dev(button4, "type", "button");
    			button4.disabled = button4_disabled_value = /*undos*/ ctx[2].length == 0;
    			attr_dev(button4, "class", "btn btn-default btn-sm");
    			add_location(button4, file$c, 42, 4, 1679);
    			attr_dev(button5, "type", "button");
    			button5.disabled = button5_disabled_value = /*redos*/ ctx[3].length == 0;
    			attr_dev(button5, "class", "btn btn-default btn-sm");
    			add_location(button5, file$c, 46, 4, 1874);
    			attr_dev(div1, "class", "btn-group svelte-59xta7");
    			add_location(div1, file$c, 41, 3, 1650);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-light btn-sm");
    			attr_dev(button6, "title", "Flip horizontal");
    			add_location(button6, file$c, 53, 4, 2128);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-light btn-sm");
    			attr_dev(button7, "title", "Flip vertical");
    			add_location(button7, file$c, 56, 4, 2272);
    			attr_dev(div2, "class", "btn-group svelte-59xta7");
    			add_location(div2, file$c, 52, 3, 2099);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn btn-light btn-sm");
    			attr_dev(button8, "title", "Move left");
    			add_location(button8, file$c, 62, 4, 2489);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn btn-light btn-sm");
    			attr_dev(button9, "title", "Move right");
    			add_location(button9, file$c, 65, 4, 2635);
    			attr_dev(button10, "type", "button");
    			attr_dev(button10, "class", "btn btn-light btn-sm");
    			attr_dev(button10, "title", "Move up");
    			add_location(button10, file$c, 68, 4, 2784);
    			attr_dev(button11, "type", "button");
    			attr_dev(button11, "class", "btn btn-light btn-sm");
    			attr_dev(button11, "title", "Move down");
    			add_location(button11, file$c, 71, 4, 2924);
    			attr_dev(div3, "class", "btn-group svelte-59xta7");
    			add_location(div3, file$c, 61, 3, 2460);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "Height");
    			attr_dev(input0, "class", "svelte-59xta7");
    			add_location(input0, file$c, 78, 4, 3125);
    			attr_dev(div4, "class", "flex-column svelte-59xta7");
    			add_location(div4, file$c, 76, 3, 3082);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "Width");
    			attr_dev(input1, "class", "svelte-59xta7");
    			add_location(input1, file$c, 82, 4, 3253);
    			attr_dev(div5, "class", "flex-column svelte-59xta7");
    			add_location(div5, file$c, 80, 3, 3211);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "class", "svelte-59xta7");
    			add_location(input2, file$c, 85, 4, 3350);
    			add_location(label, file$c, 84, 3, 3337);
    			attr_dev(div6, "class", "toolbar flex align-center svelte-59xta7");
    			add_location(div6, file$c, 12, 2, 478);
    			attr_dev(canvas0, "class", "draw-canvas svelte-59xta7");
    			add_location(canvas0, file$c, 91, 3, 3478);
    			attr_dev(canvas1, "class", "grid-canvas svelte-59xta7");
    			toggle_class(canvas1, "paint-cursor", /*mode*/ ctx[1] == "paint");
    			toggle_class(canvas1, "fill-cursor", /*mode*/ ctx[1] == "fill");
    			toggle_class(canvas1, "erase-cursor", /*mode*/ ctx[1] == "erase");
    			add_location(canvas1, file$c, 92, 3, 3536);
    			if (img.src !== (img_src_value = /*input*/ ctx[0].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "preview");
    			attr_dev(img, "class", "drop-shadow");
    			attr_dev(img, "width", img_width_value = /*input*/ ctx[0].width * artScale);
    			attr_dev(img, "height", img_height_value = /*input*/ ctx[0].height * artScale);
    			add_location(img, file$c, 104, 5, 3956);
    			add_location(div7, file$c, 103, 4, 3944);
    			attr_dev(div8, "class", "preview flex svelte-59xta7");
    			add_location(div8, file$c, 102, 3, 3912);
    			attr_dev(div9, "class", "canvas-container svelte-59xta7");
    			add_location(div9, file$c, 90, 2, 3443);
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
    			mount_component(inputselect, div6, null);
    			append_dev(div6, t7);
    			append_dev(div6, div1);
    			append_dev(div1, button4);
    			mount_component(icon3, button4, null);
    			append_dev(button4, t8);
    			append_dev(button4, t9);
    			append_dev(div1, t10);
    			append_dev(div1, button5);
    			mount_component(icon4, button5, null);
    			append_dev(button5, t11);
    			append_dev(button5, t12);
    			append_dev(div6, t13);
    			append_dev(div6, div2);
    			append_dev(div2, button6);
    			mount_component(icon5, button6, null);
    			append_dev(div2, t14);
    			append_dev(div2, button7);
    			mount_component(icon6, button7, null);
    			append_dev(div6, t15);
    			append_dev(div6, div3);
    			append_dev(div3, button8);
    			mount_component(icon7, button8, null);
    			append_dev(div3, t16);
    			append_dev(div3, button9);
    			mount_component(icon8, button9, null);
    			append_dev(div3, t17);
    			append_dev(div3, button10);
    			mount_component(icon9, button10, null);
    			append_dev(div3, t18);
    			append_dev(div3, button11);
    			mount_component(icon10, button11, null);
    			append_dev(div6, t19);
    			append_dev(div6, div4);
    			append_dev(div4, t20);
    			append_dev(div4, input0);
    			set_input_value(input0, /*input*/ ctx[0].height);
    			append_dev(div6, t21);
    			append_dev(div6, div5);
    			append_dev(div5, t22);
    			append_dev(div5, input1);
    			set_input_value(input1, /*input*/ ctx[0].width);
    			append_dev(div6, t23);
    			append_dev(div6, label);
    			append_dev(label, input2);
    			input2.checked = /*showGrid*/ ctx[4];
    			append_dev(label, t24);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, canvas0);
    			/*canvas0_binding*/ ctx[44](canvas0);
    			append_dev(div9, t26);
    			append_dev(div9, canvas1);
    			/*canvas1_binding*/ ctx[45](canvas1);
    			append_dev(div9, t27);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, img);
    			append_dev(div8, t28);
    			if (if_block) if_block.m(div8, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[37], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[38], false, false, false),
    					listen_dev(button2, "click", /*click_handler_3*/ ctx[39], false, false, false),
    					listen_dev(button3, "click", /*reset*/ ctx[16], false, false, false),
    					listen_dev(button4, "click", /*undo*/ ctx[22], false, false, false),
    					listen_dev(button5, "click", /*redo*/ ctx[23], false, false, false),
    					listen_dev(button6, "click", /*flipX*/ ctx[25], false, false, false),
    					listen_dev(button7, "click", /*flipY*/ ctx[24], false, false, false),
    					listen_dev(button8, "click", /*moveLeft*/ ctx[26], false, false, false),
    					listen_dev(button9, "click", /*moveRight*/ ctx[27], false, false, false),
    					listen_dev(button10, "click", /*moveUp*/ ctx[28], false, false, false),
    					listen_dev(button11, "click", /*moveDown*/ ctx[29], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[41]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[42]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[43]),
    					listen_dev(canvas1, "mousedown", prevent_default(/*onDrawMouseDown*/ ctx[17]), false, true, false),
    					listen_dev(canvas1, "mouseup", prevent_default(/*onDrawMouseUp*/ ctx[18]), false, true, false),
    					listen_dev(canvas1, "mousemove", prevent_default(/*onDrawMouseMove*/ ctx[19]), false, true, false),
    					listen_dev(canvas1, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[31]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const colorpicker_changes = {};

    			if (!updating_value && dirty[0] & /*selectedColor*/ 64) {
    				updating_value = true;
    				colorpicker_changes.value = /*selectedColor*/ ctx[6];
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

    			const inputselect_changes = {};
    			if (dirty[0] & /*$autoSaveStore, input*/ 4097) inputselect_changes.disabled = /*$autoSaveStore*/ ctx[12][/*input*/ ctx[0].name] == null;
    			if (dirty[0] & /*$autoSaveStore, input*/ 4097) inputselect_changes.options = /*$autoSaveStore*/ ctx[12][/*input*/ ctx[0].name];

    			if (dirty[2] & /*$$scope, option*/ 3072) {
    				inputselect_changes.$$scope = { dirty, ctx };
    			}

    			inputselect.$set(inputselect_changes);

    			if ((!current || dirty[0] & /*undos*/ 4) && t9_value !== (t9_value = (/*undos*/ ctx[2].length > 0
    			? /*undos*/ ctx[2].length
    			: "") + "")) set_data_dev(t9, t9_value);

    			if (!current || dirty[0] & /*undos*/ 4 && button4_disabled_value !== (button4_disabled_value = /*undos*/ ctx[2].length == 0)) {
    				prop_dev(button4, "disabled", button4_disabled_value);
    			}

    			if ((!current || dirty[0] & /*redos*/ 8) && t12_value !== (t12_value = (/*redos*/ ctx[3].length > 0
    			? /*redos*/ ctx[3].length
    			: "") + "")) set_data_dev(t12, t12_value);

    			if (!current || dirty[0] & /*redos*/ 8 && button5_disabled_value !== (button5_disabled_value = /*redos*/ ctx[3].length == 0)) {
    				prop_dev(button5, "disabled", button5_disabled_value);
    			}

    			if (dirty[0] & /*input*/ 1 && to_number(input0.value) !== /*input*/ ctx[0].height) {
    				set_input_value(input0, /*input*/ ctx[0].height);
    			}

    			if (dirty[0] & /*input*/ 1 && to_number(input1.value) !== /*input*/ ctx[0].width) {
    				set_input_value(input1, /*input*/ ctx[0].width);
    			}

    			if (dirty[0] & /*showGrid*/ 16) {
    				input2.checked = /*showGrid*/ ctx[4];
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

    			if (!current || dirty[0] & /*input*/ 1 && img.src !== (img_src_value = /*input*/ ctx[0].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty[0] & /*input*/ 1 && img_width_value !== (img_width_value = /*input*/ ctx[0].width * artScale)) {
    				attr_dev(img, "width", img_width_value);
    			}

    			if (!current || dirty[0] & /*input*/ 1 && img_height_value !== (img_height_value = /*input*/ ctx[0].height * artScale)) {
    				attr_dev(img, "height", img_height_value);
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
    			transition_in(inputselect.$$.fragment, local);
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
    			transition_out(inputselect.$$.fragment, local);
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
    			destroy_component(inputselect);
    			destroy_component(icon3);
    			destroy_component(icon4);
    			destroy_component(icon5);
    			destroy_component(icon6);
    			destroy_component(icon7);
    			destroy_component(icon8);
    			destroy_component(icon9);
    			destroy_component(icon10);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(div9);
    			/*canvas0_binding*/ ctx[44](null);
    			/*canvas1_binding*/ ctx[45](null);
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

    // (3:0) <BuildLayout tab="art" activeName={input.name} store={$project.art}>
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

    	form.$on("submit", /*save*/ ctx[14]);

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

    			if (dirty[0] & /*input, gridCanvas, mode, drawCanvas, showGrid, redos, undos, $autoSaveStore, selectedColor, isAdding, nameField*/ 5119 | dirty[2] & /*$$scope*/ 2048) {
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
    		source: "(3:0) <BuildLayout tab=\\\"art\\\" activeName={input.name} store={$project.art}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let buildlayout;
    	let current;
    	let mounted;
    	let dispose;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "art",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[11].art,
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
    					listen_dev(window, "keyup", /*onKeyUp*/ ctx[20], false, false, false),
    					listen_dev(window, "paste", /*onPaste*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const buildlayout_changes = {};
    			if (dirty[0] & /*input*/ 1) buildlayout_changes.activeName = /*input*/ ctx[0].name;
    			if (dirty[0] & /*$project*/ 2048) buildlayout_changes.store = /*$project*/ ctx[11].art;

    			if (dirty[0] & /*hasChanges, input, gridCanvas, mode, drawCanvas, showGrid, redos, undos, $autoSaveStore, selectedColor, isAdding, nameField*/ 6143 | dirty[2] & /*$$scope*/ 2048) {
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const artScale = 2;
    const gridSize = 20;

    function createDefaultInput() {
    	return {
    		name: "",
    		width: 20,
    		height: 20,
    		png: null
    	};
    }

    function getScaleCoordinates(x, y) {
    	return {
    		x: Math.floor(x / gridSize),
    		y: Math.floor(y / gridSize)
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

    function instance$e($$self, $$props, $$invalidate) {
    	let $project;
    	let $autoSaveStore;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(11, $project = $$value));
    	validate_store(autoSaveStore, "autoSaveStore");
    	component_subscribe($$self, autoSaveStore, $$value => $$invalidate(12, $autoSaveStore = $$value));
    	let { params = {} } = $$props;
    	let input = createDefaultInput();
    	let mode = "paint";
    	let undos = [];
    	let redos = [];
    	let mouseDown = false;
    	let showGrid = true;
    	let nameField;
    	let savedInput;
    	let selectedColor = "rgba(0, 0, 0, 255)";

    	// we load the png into this canvas
    	// and when user draws on the big canvas, we actually make the change on the scaled down canvas, and then re-render the larger canvas from this one
    	// (if we make a change to the larger canvas, it gets blurry when scaling back down)
    	const pngCanvas = document.createElement("canvas");

    	const pngContext = pngCanvas.getContext("2d");

    	// we render a scaled up version to this canvas for user to interact with
    	let drawCanvas;

    	let drawContext;

    	// we render grid lines to this canvas
    	let gridCanvas;

    	let gridContext;
    	const debouncedRedraw = debounce(() => redraw(), 500);
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
    		const { x, y } = getScaleCoordinates(e.offsetX, e.offsetY);
    		const color = getColorAt(x, y);

    		if (e.altKey || e.button !== 0) {
    			if (color == "transparent") {
    				$$invalidate(1, mode = "erase");
    				$$invalidate(6, selectedColor = "transparent");
    			} else {
    				$$invalidate(1, mode = "paint");
    				$$invalidate(6, selectedColor = color);
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
    		const { x, y } = getScaleCoordinates(e.offsetX, e.offsetY);

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

    	function addUndoState() {
    		$$invalidate(2, undos = [...undos.slice(Math.max(undos.length - 20, 0)), input.png]);

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
    		$$invalidate(3, redos = [...redos, input.png]);
    		$$invalidate(0, input.png = undos.pop(), input);
    		$$invalidate(2, undos);
    		redraw();
    	}

    	function redo() {
    		if (redos.length == 0) return;
    		$$invalidate(2, undos = [...undos, input.png]);
    		$$invalidate(0, input.png = redos.pop(), input);
    		$$invalidate(3, redos);
    		redraw();
    	}

    	function setColor(x, y, color, recursing = false) {
    		const oldColor = getColorAt(x, y);
    		drawSquare(pngContext, x, y, 1, color);
    		drawSquare(drawContext, x * gridSize, y * gridSize, gridSize, color);

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
    		console.log("redrawing");

    		// put source png onto scale canvas
    		createMemoryImage(input.png).then(image => {
    			console.log("image callback");

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

    			pngCanvas.width = input.width;
    			pngCanvas.height = input.height;
    			pngContext.clearRect(0, 0, input.width, input.height);
    			$$invalidate(7, drawCanvas.width = input.width * gridSize, drawCanvas);
    			$$invalidate(7, drawCanvas.height = input.height * gridSize, drawCanvas);
    			drawContext.clearRect(0, 0, input.width * gridSize, input.height * gridSize);
    			$$invalidate(8, gridCanvas.width = input.width * gridSize, gridCanvas);
    			$$invalidate(8, gridCanvas.height = input.height * gridSize, gridCanvas);
    			gridContext.clearRect(0, 0, input.width * gridSize, input.height * gridSize);

    			// draw the png full size, even if it gets cut off
    			if (input.png != null) pngContext.drawImage(image, 0, 0, scaleWidth, scaleHeight);

    			setInputFromCanvas();

    			// loop the scaleContext, grabbing pixels to render larger on full size canvas
    			for (let y = 0; y < input.height; y++) {
    				for (let x = 0; x < input.width; x++) {
    					let [r, g, b, a] = pngContext.getImageData(x, y, 1, 1).data;
    					if (a > 0) drawSquare(drawContext, x * gridSize, y * gridSize, gridSize, `rgba(${r}, ${g}, ${b}, ${a})`);

    					if (showGrid) {
    						gridContext.beginPath();
    						gridContext.rect(x * gridSize, y * gridSize, gridSize, gridSize);
    						gridContext.strokeStyle = "rgba(255,255,255,0.5)";
    						gridContext.stroke();
    					}
    				}
    			}
    		});
    	}

    	function flipY() {
    		flipImage(false, true);
    	}

    	function flipX() {
    		flipImage(true, false);
    	}

    	function moveLeft() {
    		addUndoState();
    		moveImage(-1, 0);
    	}

    	function moveRight() {
    		addUndoState();
    		moveImage(1, 0);
    	}

    	function moveUp() {
    		addUndoState();
    		moveImage(0, -1);
    	}

    	function moveDown() {
    		addUndoState();
    		moveImage(0, 1);
    	}

    	function moveImage(dx, dy) {
    		setInputFromCanvas();

    		createMemoryImage(input.png).then(image => {
    			pngContext.clearRect(0, 0, input.width, input.height);
    			pngContext.drawImage(image, dx, dy, input.width, input.height);

    			// draw the pixels that were cut off on the opposite side of the canvas, cuz why not
    			if (dx != 0) pngContext.drawImage(image, dx - dx * input.width, 0, input.width, input.height); else if (dy != 0) pngContext.drawImage(image, 0, dy - dy * input.height, input.width, input.height);

    			setInputFromCanvas();
    			redraw();
    		});
    	}

    	function flipImage(flipX, flipY) {
    		setInputFromCanvas();

    		createMemoryImage(input.png).then(image => {
    			pngContext.clearRect(0, 0, input.width, input.height);
    			pngContext.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    			pngContext.drawImage(image, flipX ? input.width * -1 : 0, flipY ? input.height * -1 : 0, input.width, input.height);
    			setInputFromCanvas();
    			redraw();
    		});
    	}

    	function setInputFromCanvas() {
    		$$invalidate(0, input.png = pngCanvas.toDataURL("image/png"), input);
    		console.log(input.png);
    	}

    	function createMemoryImage(png) {
    		if (png == null) return Promise.resolve({ width: input.width, height: input.height });

    		return new Promise((resolve, reject) => {
    				const image = new Image();
    				image.src = input.png;
    				image.onload = () => resolve(image);
    			});
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

    	function input_1_input_handler() {
    		input.name = this.value;
    		$$invalidate(0, input);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			nameField = $$value;
    			$$invalidate(5, nameField);
    		});
    	}

    	const click_handler = () => del(input.name);

    	function colorpicker_value_binding(value) {
    		selectedColor = value;
    		$$invalidate(6, selectedColor);
    	}

    	const change_handler = () => $$invalidate(1, mode = mode == "erase" ? "paint" : mode);
    	const click_handler_1 = () => $$invalidate(1, mode = "paint");
    	const click_handler_2 = () => $$invalidate(1, mode = "fill");
    	const click_handler_3 = () => $$invalidate(1, mode = "erase");
    	const change_handler_1 = e => loadAutoSave(e.detail);

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
    		$$invalidate(4, showGrid);
    	}

    	function canvas0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			drawCanvas = $$value;
    			$$invalidate(7, drawCanvas);
    		});
    	}

    	function canvas1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			gridCanvas = $$value;
    			$$invalidate(8, gridCanvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(30, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
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
    		push,
    		project,
    		autoSaveStore,
    		ColorPicker,
    		FieldText,
    		Form,
    		Icon,
    		InputSelect,
    		BuildLayout,
    		validator,
    		onMount,
    		makeThumbnail,
    		debounce,
    		params,
    		input,
    		mode,
    		undos,
    		redos,
    		mouseDown,
    		showGrid,
    		nameField,
    		savedInput,
    		selectedColor,
    		pngCanvas,
    		pngContext,
    		artScale,
    		drawCanvas,
    		drawContext,
    		gridSize,
    		gridCanvas,
    		gridContext,
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
    		getScaleCoordinates,
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
    		moveImage,
    		flipImage,
    		setInputFromCanvas,
    		createMemoryImage,
    		paramName,
    		isAdding,
    		inputWidth,
    		inputHeight,
    		hasChanges,
    		$project,
    		$autoSaveStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(30, params = $$props.params);
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("mode" in $$props) $$invalidate(1, mode = $$props.mode);
    		if ("undos" in $$props) $$invalidate(2, undos = $$props.undos);
    		if ("redos" in $$props) $$invalidate(3, redos = $$props.redos);
    		if ("mouseDown" in $$props) mouseDown = $$props.mouseDown;
    		if ("showGrid" in $$props) $$invalidate(4, showGrid = $$props.showGrid);
    		if ("nameField" in $$props) $$invalidate(5, nameField = $$props.nameField);
    		if ("savedInput" in $$props) savedInput = $$props.savedInput;
    		if ("selectedColor" in $$props) $$invalidate(6, selectedColor = $$props.selectedColor);
    		if ("drawCanvas" in $$props) $$invalidate(7, drawCanvas = $$props.drawCanvas);
    		if ("drawContext" in $$props) drawContext = $$props.drawContext;
    		if ("gridCanvas" in $$props) $$invalidate(8, gridCanvas = $$props.gridCanvas);
    		if ("gridContext" in $$props) gridContext = $$props.gridContext;
    		if ("paramName" in $$props) $$invalidate(50, paramName = $$props.paramName);
    		if ("isAdding" in $$props) $$invalidate(9, isAdding = $$props.isAdding);
    		if ("inputWidth" in $$props) $$invalidate(51, inputWidth = $$props.inputWidth);
    		if ("inputHeight" in $$props) $$invalidate(52, inputHeight = $$props.inputHeight);
    		if ("hasChanges" in $$props) $$invalidate(10, hasChanges = $$props.hasChanges);
    	};

    	let paramName;
    	let isAdding;
    	let inputWidth;
    	let inputHeight;
    	let hasChanges;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*params*/ 1073741824) {
    			 $$invalidate(50, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty[1] & /*paramName*/ 524288) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty[1] & /*paramName*/ 524288) {
    			 $$invalidate(9, isAdding = paramName == "new");
    		}

    		if ($$self.$$.dirty[0] & /*input*/ 1) {
    			 $$invalidate(51, inputWidth = input.width);
    		}

    		if ($$self.$$.dirty[0] & /*input*/ 1) {
    			 $$invalidate(52, inputHeight = input.height);
    		}

    		if ($$self.$$.dirty[0] & /*input, $project*/ 2049) {
    			 $$invalidate(10, hasChanges = input != null && !validator.equals(input, $project.art[input.name]));
    		}

    		if ($$self.$$.dirty[0] & /*showGrid*/ 16 | $$self.$$.dirty[1] & /*inputWidth, inputHeight*/ 3145728) {
    			 if (inputWidth != 0 && inputHeight != 0 && showGrid != null) debouncedRedraw();
    		}
    	};

    	return [
    		input,
    		mode,
    		undos,
    		redos,
    		showGrid,
    		nameField,
    		selectedColor,
    		drawCanvas,
    		gridCanvas,
    		isAdding,
    		hasChanges,
    		$project,
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
    		params,
    		contextmenu_handler,
    		input_1_input_handler,
    		input_1_binding,
    		click_handler,
    		colorpicker_value_binding,
    		change_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		change_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler,
    		canvas0_binding,
    		canvas1_binding
    	];
    }

    class ArtMaker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { params: 30 }, [-1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArtMaker",
    			options,
    			id: create_fragment$e.name
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
    const file$d = "src\\components\\FieldArtPicker.svelte";

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
    	let t1_value = /*option*/ ctx[11].value + "";
    	let t1;
    	let current;

    	art = new Art({
    			props: {
    				name: /*option*/ ctx[11].value,
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
    			if (dirty & /*option*/ 2048) art_changes.name = /*option*/ ctx[11].value;
    			if (dirty & /*spin*/ 2) art_changes.spin = /*spin*/ ctx[1];
    			art.$set(art_changes);
    			if ((!current || dirty & /*option*/ 2048) && t1_value !== (t1_value = /*option*/ ctx[11].value + "")) set_data_dev(t1, t1_value);
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
    function create_if_block$7(ctx) {
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
    		id: create_if_block$7.name,
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
    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	const default_slot_or_fallback = default_slot || fallback_block$4(ctx);

    	function inputselect_value_binding(value) {
    		/*inputselect_value_binding*/ ctx[8].call(null, value);
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
    				({ option }) => ({ 11: option }),
    				({ option }) => option ? 2048 : 0
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		inputselect_props.value = /*value*/ ctx[0];
    	}

    	inputselect = new InputSelect({ props: inputselect_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputselect, "value", inputselect_value_binding));
    	let if_block = /*value*/ ctx[0] != null && create_if_block$7(ctx);

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
    				if (default_slot.p && dirty & /*$$scope*/ 512) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, null, null);
    				}
    			}

    			const inputselect_changes = {};
    			if (dirty & /*name*/ 4) inputselect_changes.name = /*name*/ ctx[2];
    			if (dirty & /*options*/ 16) inputselect_changes.options = /*options*/ ctx[4];
    			if (dirty & /*options*/ 16) inputselect_changes.filterable = /*options*/ ctx[4].length > 3;
    			if (dirty & /*placeholder*/ 8) inputselect_changes.placeholder = /*placeholder*/ ctx[3];

    			if (dirty & /*$$scope, option, spin*/ 2562) {
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
    					if_block = create_if_block$7(ctx);
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
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(5, $project = $$value));
    	let { value = null } = $$props;
    	let { spin = 0 } = $$props;
    	let { name = "graphic-picker" } = $$props;
    	let { placeholder = "Select art" } = $$props;
    	let { blocks = false } = $$props;
    	const blockFilter = b => b.width == 20 && b.height == 20;
    	const writable_props = ["value", "spin", "name", "placeholder", "blocks"];

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
    		if ("blocks" in $$props) $$invalidate(6, blocks = $$props.blocks);
    		if ("$$scope" in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Art,
    		project,
    		InputSelect,
    		value,
    		spin,
    		name,
    		placeholder,
    		blocks,
    		blockFilter,
    		options,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("spin" in $$props) $$invalidate(1, spin = $$props.spin);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("placeholder" in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ("blocks" in $$props) $$invalidate(6, blocks = $$props.blocks);
    		if ("options" in $$props) $$invalidate(4, options = $$props.options);
    	};

    	let options;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$project, blocks*/ 96) {
    			 $$invalidate(4, options = Object.keys($project.art).filter(name => blocks == blockFilter($project.art[name])));
    		}
    	};

    	return [
    		value,
    		spin,
    		name,
    		placeholder,
    		options,
    		$project,
    		blocks,
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
    			spin: 1,
    			name: 2,
    			placeholder: 3,
    			blocks: 6
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

    	get blocks() {
    		throw new Error("<FieldArtPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blocks(value) {
    		throw new Error("<FieldArtPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldCheckbox.svelte generated by Svelte v3.24.1 */

    const file$e = "src\\components\\FieldCheckbox.svelte";

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

    /* src\components\FieldNumber.svelte generated by Svelte v3.24.1 */

    const file$f = "src\\components\\FieldNumber.svelte";

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

    /* src\pages\Build\BlockBuilder.svelte generated by Svelte v3.24.1 */
    const file$g = "src\\pages\\Build\\BlockBuilder.svelte";

    // (3:2) <FieldText name="name" bind:value={input.name}>
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
    		source: "(3:2) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (4:2) <FieldArtPicker bind:value={input.graphic} blocks>
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
    		source: "(4:2) <FieldArtPicker bind:value={input.graphic} blocks>",
    		ctx
    	});

    	return block;
    }

    // (5:2) <FieldCheckbox name="solid" bind:checked={input.solid}>
    function create_default_slot_4(ctx) {
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
    function create_default_slot_2$1(ctx) {
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
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(7:2) <FieldNumber name=\\\"dps\\\" bind:value={input.dps}>",
    		ctx
    	});

    	return block;
    }

    // (11:3) {#if !isAdding}
    function create_if_block$8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$g, 11, 4, 739);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(11:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (10:2) <span slot="buttons">
    function create_buttons_slot$1(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$g, 9, 2, 692);
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
    					if_block = create_if_block$8(ctx);
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
    		blocks: true,
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
    		$$slots: { default: [create_default_slot_2$1] },
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

    // (1:0) <BuildLayout tab="blocks" activeName={input.name} store={$project.blocks}>
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
    		source: "(1:0) <BuildLayout tab=\\\"blocks\\\" activeName={input.name} store={$project.blocks}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
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

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 65543) {
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
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
    		$$invalidate(0, input = JSON.parse(JSON.stringify($project.blocks[name])));
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

    /* src\components\FieldAbilities.svelte generated by Svelte v3.24.1 */
    const file$h = "src\\components\\FieldAbilities.svelte";

    // (1:0) <FieldNumber name="dps" bind:value={input.dps}>
    function create_default_slot_10(ctx) {
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
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(1:0) <FieldNumber name=\\\"dps\\\" bind:value={input.dps}>",
    		ctx
    	});

    	return block;
    }

    // (3:0) <FieldCheckbox name="canFly" bind:checked={input.canFly}>
    function create_default_slot_9(ctx) {
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
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(3:0) <FieldCheckbox name=\\\"canFly\\\" bind:checked={input.canFly}>",
    		ctx
    	});

    	return block;
    }

    // (5:0) <FieldCheckbox name="canSpin" bind:checked={input.canSpin}>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Can spin attack?");
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
    		source: "(5:0) <FieldCheckbox name=\\\"canSpin\\\" bind:checked={input.canSpin}>",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if input.canSpin}
    function create_if_block_2$3(ctx) {
    	let div1;
    	let div0;
    	let fieldnumber;
    	let updating_value;
    	let t;
    	let fieldartpicker;
    	let updating_value_1;
    	let current;

    	function fieldnumber_value_binding_1(value) {
    		/*fieldnumber_value_binding_1*/ ctx[8].call(null, value);
    	}

    	let fieldnumber_props = {
    		name: "spinDegreesPerFrame",
    		min: 0,
    		max: 25,
    		$$slots: { default: [create_default_slot_7] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].spinDegreesPerFrame !== void 0) {
    		fieldnumber_props.value = /*input*/ ctx[0].spinDegreesPerFrame;
    	}

    	fieldnumber = new FieldNumber({ props: fieldnumber_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldnumber, "value", fieldnumber_value_binding_1));

    	function fieldartpicker_value_binding(value) {
    		/*fieldartpicker_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldartpicker_props = {
    		spin: /*previewFrame*/ ctx[3] * /*input*/ ctx[0].spinDegreesPerFrame,
    		$$slots: { default: [create_default_slot_6$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphicSpinning !== void 0) {
    		fieldartpicker_props.value = /*input*/ ctx[0].graphicSpinning;
    	}

    	fieldartpicker = new FieldArtPicker({
    			props: fieldartpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker, "value", fieldartpicker_value_binding));

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fieldnumber.$$.fragment);
    			t = space();
    			create_component(fieldartpicker.$$.fragment);
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$h, 7, 2, 379);
    			attr_dev(div1, "class", "card bg-light mb-3");
    			add_location(div1, file$h, 6, 1, 343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(fieldnumber, div0, null);
    			append_dev(div0, t);
    			mount_component(fieldartpicker, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldnumber_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldnumber_changes.value = /*input*/ ctx[0].spinDegreesPerFrame;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldnumber.$set(fieldnumber_changes);
    			const fieldartpicker_changes = {};
    			if (dirty & /*previewFrame, input*/ 9) fieldartpicker_changes.spin = /*previewFrame*/ ctx[3] * /*input*/ ctx[0].spinDegreesPerFrame;

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldartpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker_changes.value = /*input*/ ctx[0].graphicSpinning;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker.$set(fieldartpicker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldnumber.$$.fragment, local);
    			transition_in(fieldartpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldnumber.$$.fragment, local);
    			transition_out(fieldartpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(fieldnumber);
    			destroy_component(fieldartpicker);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(6:0) {#if input.canSpin}",
    		ctx
    	});

    	return block;
    }

    // (9:3) <FieldNumber name="spinDegreesPerFrame" bind:value={input.spinDegreesPerFrame} min={0} max={25}>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Spin degrees per frame");
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
    		source: "(9:3) <FieldNumber name=\\\"spinDegreesPerFrame\\\" bind:value={input.spinDegreesPerFrame} min={0} max={25}>",
    		ctx
    	});

    	return block;
    }

    // (10:3) <FieldArtPicker bind:value={input.graphicSpinning} spin={previewFrame * input.spinDegreesPerFrame}>
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Spin attack graphic");
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
    		source: "(10:3) <FieldArtPicker bind:value={input.graphicSpinning} spin={previewFrame * input.spinDegreesPerFrame}>",
    		ctx
    	});

    	return block;
    }

    // (15:0) <FieldCheckbox name="canFireProjectiles" bind:checked={input.canFireProjectiles}>
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Can fire projectiles? (Note: game doesn't actually support this yet, but you can set it up for now)");
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
    		source: "(15:0) <FieldCheckbox name=\\\"canFireProjectiles\\\" bind:checked={input.canFireProjectiles}>",
    		ctx
    	});

    	return block;
    }

    // (18:0) {#if input.canFireProjectiles}
    function create_if_block$9(ctx) {
    	let div1;
    	let div0;
    	let fieldnumber0;
    	let updating_value;
    	let t0;
    	let fieldnumber1;
    	let updating_value_1;
    	let t1;
    	let fieldnumber2;
    	let updating_value_2;
    	let t2;
    	let fieldnumber3;
    	let updating_value_3;
    	let t3;
    	let fieldartpicker;
    	let updating_value_4;
    	let t4;
    	let current;

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "projectileDamage",
    		min: 0,
    		$$slots: { default: [create_default_slot_4$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].projectileDamage !== void 0) {
    		fieldnumber0_props.value = /*input*/ ctx[0].projectileDamage;
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
    		name: "projectileVelocity",
    		min: 0,
    		max: 300,
    		$$slots: { default: [create_default_slot_3$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].projectileVelocity !== void 0) {
    		fieldnumber1_props.value = /*input*/ ctx[0].projectileVelocity;
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
    		name: "projectileYStart",
    		min: 0,
    		max: 300,
    		$$slots: { default: [create_default_slot_2$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].projectileYStart !== void 0) {
    		fieldnumber2_props.value = /*input*/ ctx[0].projectileYStart;
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
    		min: 0,
    		max: 2,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_1$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].projectileGravityMultiplier !== void 0) {
    		fieldnumber3_props.value = /*input*/ ctx[0].projectileGravityMultiplier;
    	}

    	fieldnumber3 = new FieldNumber({
    			props: fieldnumber3_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber3, "value", fieldnumber3_value_binding));

    	function fieldartpicker_value_binding_1(value) {
    		/*fieldartpicker_value_binding_1*/ ctx[15].call(null, value);
    	}

    	let fieldartpicker_props = {
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphicProjectile !== void 0) {
    		fieldartpicker_props.value = /*input*/ ctx[0].graphicProjectile;
    	}

    	fieldartpicker = new FieldArtPicker({
    			props: fieldartpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker, "value", fieldartpicker_value_binding_1));
    	let if_block = /*input*/ ctx[0].graphicProjectile != null && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fieldnumber0.$$.fragment);
    			t0 = space();
    			create_component(fieldnumber1.$$.fragment);
    			t1 = space();
    			create_component(fieldnumber2.$$.fragment);
    			t2 = space();
    			create_component(fieldnumber3.$$.fragment);
    			t3 = space();
    			create_component(fieldartpicker.$$.fragment);
    			t4 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$h, 19, 2, 981);
    			attr_dev(div1, "class", "card bg-light mb-3");
    			add_location(div1, file$h, 18, 1, 945);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(fieldnumber0, div0, null);
    			append_dev(div0, t0);
    			mount_component(fieldnumber1, div0, null);
    			append_dev(div0, t1);
    			mount_component(fieldnumber2, div0, null);
    			append_dev(div0, t2);
    			mount_component(fieldnumber3, div0, null);
    			append_dev(div0, t3);
    			mount_component(fieldartpicker, div0, null);
    			append_dev(div1, t4);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].projectileDamage;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].projectileVelocity;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].projectileYStart;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].projectileGravityMultiplier;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldartpicker_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldartpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldartpicker_changes.value = /*input*/ ctx[0].graphicProjectile;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldartpicker.$set(fieldartpicker_changes);

    			if (/*input*/ ctx[0].graphicProjectile != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
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
    			transition_in(fieldnumber0.$$.fragment, local);
    			transition_in(fieldnumber1.$$.fragment, local);
    			transition_in(fieldnumber2.$$.fragment, local);
    			transition_in(fieldnumber3.$$.fragment, local);
    			transition_in(fieldartpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldnumber0.$$.fragment, local);
    			transition_out(fieldnumber1.$$.fragment, local);
    			transition_out(fieldnumber2.$$.fragment, local);
    			transition_out(fieldnumber3.$$.fragment, local);
    			transition_out(fieldartpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(fieldnumber0);
    			destroy_component(fieldnumber1);
    			destroy_component(fieldnumber2);
    			destroy_component(fieldnumber3);
    			destroy_component(fieldartpicker);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(18:0) {#if input.canFireProjectiles}",
    		ctx
    	});

    	return block;
    }

    // (21:3) <FieldNumber name="projectileDamage" bind:value={input.projectileDamage} min={0}>
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Projectile damage");
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
    		source: "(21:3) <FieldNumber name=\\\"projectileDamage\\\" bind:value={input.projectileDamage} min={0}>",
    		ctx
    	});

    	return block;
    }

    // (22:3) <FieldNumber name="projectileVelocity" bind:value={input.projectileVelocity} min={0} max={300}>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Projectile velocity");
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
    		source: "(22:3) <FieldNumber name=\\\"projectileVelocity\\\" bind:value={input.projectileVelocity} min={0} max={300}>",
    		ctx
    	});

    	return block;
    }

    // (23:3) <FieldNumber name="projectileYStart" bind:value={input.projectileYStart} min={0} max={300}>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Projectile start height");
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
    		source: "(23:3) <FieldNumber name=\\\"projectileYStart\\\" bind:value={input.projectileYStart} min={0} max={300}>",
    		ctx
    	});

    	return block;
    }

    // (24:3) <FieldNumber min={0} max={2} step={0.1} bind:value={input.projectileGravityMultiplier}>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Projectile gravity multiplier");
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
    		source: "(24:3) <FieldNumber min={0} max={2} step={0.1} bind:value={input.projectileGravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (25:3) <FieldArtPicker bind:value={input.graphicProjectile}>
    function create_default_slot$5(ctx) {
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
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(25:3) <FieldArtPicker bind:value={input.graphicProjectile}>",
    		ctx
    	});

    	return block;
    }

    // (27:2) {#if input.graphicProjectile != null}
    function create_if_block_1$5(ctx) {
    	let div;
    	let img0;
    	let img0_src_value;
    	let t;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img0 = element("img");
    			t = space();
    			img1 = element("img");
    			if (img0.src !== (img0_src_value = /*$project*/ ctx[4].art[/*input*/ ctx[0].graphicStill].png)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-vsj13i");
    			add_location(img0, file$h, 28, 4, 1705);
    			if (img1.src !== (img1_src_value = /*$project*/ ctx[4].art[/*input*/ ctx[0].graphicProjectile].png)) attr_dev(img1, "src", img1_src_value);
    			set_style(img1, "position", "absolute");
    			set_style(img1, "bottom", /*projectileY*/ ctx[2] + "px");
    			set_style(img1, "left", /*$project*/ ctx[4].art[/*input*/ ctx[0].graphicStill].width * 2 + /*projectileX*/ ctx[1] + "px");
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "svelte-vsj13i");
    			add_location(img1, file$h, 29, 4, 1768);
    			attr_dev(div, "class", "motion-preview svelte-vsj13i");
    			add_location(div, file$h, 27, 3, 1671);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img0);
    			append_dev(div, t);
    			append_dev(div, img1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$project, input*/ 17 && img0.src !== (img0_src_value = /*$project*/ ctx[4].art[/*input*/ ctx[0].graphicStill].png)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*$project, input*/ 17 && img1.src !== (img1_src_value = /*$project*/ ctx[4].art[/*input*/ ctx[0].graphicProjectile].png)) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (dirty & /*projectileY*/ 4) {
    				set_style(img1, "bottom", /*projectileY*/ ctx[2] + "px");
    			}

    			if (dirty & /*$project, input, projectileX*/ 19) {
    				set_style(img1, "left", /*$project*/ ctx[4].art[/*input*/ ctx[0].graphicStill].width * 2 + /*projectileX*/ ctx[1] + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(27:2) {#if input.graphicProjectile != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let fieldnumber;
    	let updating_value;
    	let t0;
    	let fieldcheckbox0;
    	let updating_checked;
    	let t1;
    	let fieldcheckbox1;
    	let updating_checked_1;
    	let t2;
    	let t3;
    	let fieldcheckbox2;
    	let updating_checked_2;
    	let t4;
    	let if_block1_anchor;
    	let current;

    	function fieldnumber_value_binding(value) {
    		/*fieldnumber_value_binding*/ ctx[5].call(null, value);
    	}

    	let fieldnumber_props = {
    		name: "dps",
    		$$slots: { default: [create_default_slot_10] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].dps !== void 0) {
    		fieldnumber_props.value = /*input*/ ctx[0].dps;
    	}

    	fieldnumber = new FieldNumber({ props: fieldnumber_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldnumber, "value", fieldnumber_value_binding));

    	function fieldcheckbox0_checked_binding(value) {
    		/*fieldcheckbox0_checked_binding*/ ctx[6].call(null, value);
    	}

    	let fieldcheckbox0_props = {
    		name: "canFly",
    		$$slots: { default: [create_default_slot_9] },
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
    		/*fieldcheckbox1_checked_binding*/ ctx[7].call(null, value);
    	}

    	let fieldcheckbox1_props = {
    		name: "canSpin",
    		$$slots: { default: [create_default_slot_8] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].canSpin !== void 0) {
    		fieldcheckbox1_props.checked = /*input*/ ctx[0].canSpin;
    	}

    	fieldcheckbox1 = new FieldCheckbox({
    			props: fieldcheckbox1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox1, "checked", fieldcheckbox1_checked_binding));
    	let if_block0 = /*input*/ ctx[0].canSpin && create_if_block_2$3(ctx);

    	function fieldcheckbox2_checked_binding(value) {
    		/*fieldcheckbox2_checked_binding*/ ctx[10].call(null, value);
    	}

    	let fieldcheckbox2_props = {
    		name: "canFireProjectiles",
    		$$slots: { default: [create_default_slot_5$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].canFireProjectiles !== void 0) {
    		fieldcheckbox2_props.checked = /*input*/ ctx[0].canFireProjectiles;
    	}

    	fieldcheckbox2 = new FieldCheckbox({
    			props: fieldcheckbox2_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox2, "checked", fieldcheckbox2_checked_binding));
    	let if_block1 = /*input*/ ctx[0].canFireProjectiles && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			create_component(fieldnumber.$$.fragment);
    			t0 = space();
    			create_component(fieldcheckbox0.$$.fragment);
    			t1 = space();
    			create_component(fieldcheckbox1.$$.fragment);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			create_component(fieldcheckbox2.$$.fragment);
    			t4 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldnumber, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldcheckbox0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldcheckbox1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fieldcheckbox2, target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fieldnumber_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldnumber_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldnumber_changes.value = /*input*/ ctx[0].dps;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldnumber.$set(fieldnumber_changes);
    			const fieldcheckbox0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldcheckbox0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*input*/ 1) {
    				updating_checked = true;
    				fieldcheckbox0_changes.checked = /*input*/ ctx[0].canFly;
    				add_flush_callback(() => updating_checked = false);
    			}

    			fieldcheckbox0.$set(fieldcheckbox0_changes);
    			const fieldcheckbox1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldcheckbox1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked_1 && dirty & /*input*/ 1) {
    				updating_checked_1 = true;
    				fieldcheckbox1_changes.checked = /*input*/ ctx[0].canSpin;
    				add_flush_callback(() => updating_checked_1 = false);
    			}

    			fieldcheckbox1.$set(fieldcheckbox1_changes);

    			if (/*input*/ ctx[0].canSpin) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*input*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t3.parentNode, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const fieldcheckbox2_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				fieldcheckbox2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked_2 && dirty & /*input*/ 1) {
    				updating_checked_2 = true;
    				fieldcheckbox2_changes.checked = /*input*/ ctx[0].canFireProjectiles;
    				add_flush_callback(() => updating_checked_2 = false);
    			}

    			fieldcheckbox2.$set(fieldcheckbox2_changes);

    			if (/*input*/ ctx[0].canFireProjectiles) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*input*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$9(ctx);
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
    			transition_in(fieldnumber.$$.fragment, local);
    			transition_in(fieldcheckbox0.$$.fragment, local);
    			transition_in(fieldcheckbox1.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(fieldcheckbox2.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldnumber.$$.fragment, local);
    			transition_out(fieldcheckbox0.$$.fragment, local);
    			transition_out(fieldcheckbox1.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(fieldcheckbox2.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldnumber, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldcheckbox0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldcheckbox1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fieldcheckbox2, detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
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
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(4, $project = $$value));
    	let { input = {} } = $$props;

    	// animation preview stuff
    	let projectileX = 0;

    	let projectilePosDir = 1;
    	let projectileY = 0;
    	let projectileVY = 0;
    	let lastRequestedFrame;
    	let previewFrame = 0;
    	animationLoop();

    	function animationLoop() {
    		$$invalidate(3, previewFrame++, previewFrame);

    		// move the projectile if there is one
    		$$invalidate(1, projectileX += (input.projectileVelocity || 0) * projectilePosDir);

    		$$invalidate(2, projectileY += projectileVY);
    		projectileVY -= 1 * input.projectileGravityMultiplier;

    		if (previewFrame % 50 == 0) {
    			$$invalidate(1, projectileX = 0);
    			$$invalidate(2, projectileY = input.projectileYStart);
    			projectileVY = 0;
    		}

    		lastRequestedFrame = window.requestAnimationFrame(animationLoop);
    	}

    	onDestroy(() => {
    		window.cancelAnimationFrame(lastRequestedFrame);
    	});

    	const writable_props = ["input"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldAbilities> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldAbilities", $$slots, []);

    	function fieldnumber_value_binding(value) {
    		input.dps = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox0_checked_binding(value) {
    		input.canFly = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox1_checked_binding(value) {
    		input.canSpin = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber_value_binding_1(value) {
    		input.spinDegreesPerFrame = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker_value_binding(value) {
    		input.graphicSpinning = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox2_checked_binding(value) {
    		input.canFireProjectiles = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber0_value_binding(value) {
    		input.projectileDamage = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber1_value_binding(value) {
    		input.projectileVelocity = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber2_value_binding(value) {
    		input.projectileYStart = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber3_value_binding(value) {
    		input.projectileGravityMultiplier = value;
    		$$invalidate(0, input);
    	}

    	function fieldartpicker_value_binding_1(value) {
    		input.graphicProjectile = value;
    		$$invalidate(0, input);
    	}

    	$$self.$$set = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		Icon,
    		spinner,
    		FieldNumber,
    		FieldArtPicker,
    		FieldCheckbox,
    		project,
    		input,
    		projectileX,
    		projectilePosDir,
    		projectileY,
    		projectileVY,
    		lastRequestedFrame,
    		previewFrame,
    		animationLoop,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("projectileX" in $$props) $$invalidate(1, projectileX = $$props.projectileX);
    		if ("projectilePosDir" in $$props) projectilePosDir = $$props.projectilePosDir;
    		if ("projectileY" in $$props) $$invalidate(2, projectileY = $$props.projectileY);
    		if ("projectileVY" in $$props) projectileVY = $$props.projectileVY;
    		if ("lastRequestedFrame" in $$props) lastRequestedFrame = $$props.lastRequestedFrame;
    		if ("previewFrame" in $$props) $$invalidate(3, previewFrame = $$props.previewFrame);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		input,
    		projectileX,
    		projectileY,
    		previewFrame,
    		$project,
    		fieldnumber_value_binding,
    		fieldcheckbox0_checked_binding,
    		fieldcheckbox1_checked_binding,
    		fieldnumber_value_binding_1,
    		fieldartpicker_value_binding,
    		fieldcheckbox2_checked_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldnumber2_value_binding,
    		fieldnumber3_value_binding,
    		fieldartpicker_value_binding_1
    	];
    }

    class FieldAbilities extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { input: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldAbilities",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get input() {
    		throw new Error("<FieldAbilities>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<FieldAbilities>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\HealthBar.svelte generated by Svelte v3.24.1 */

    const file$i = "src\\components\\HealthBar.svelte";

    function create_fragment$k(ctx) {
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
    			add_location(div0, file$i, 3, 1, 72);
    			attr_dev(div1, "class", "text svelte-1ofh1kv");
    			add_location(div1, file$i, 4, 1, 157);
    			attr_dev(div2, "class", "health-bar svelte-1ofh1kv");
    			add_location(div2, file$i, 2, 0, 45);
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { percent: 4, health: 0, maxHealth: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HealthBar",
    			options,
    			id: create_fragment$k.name
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

    /* src\components\LivingSprite.svelte generated by Svelte v3.24.1 */
    const file$j = "src\\components\\LivingSprite.svelte";

    // (2:1) {#if !hideHealth}
    function create_if_block_1$6(ctx) {
    	let healthbar;
    	let current;

    	healthbar = new HealthBar({
    			props: {
    				health: /*health*/ ctx[5],
    				maxHealth: /*maxHealth*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(healthbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(healthbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const healthbar_changes = {};
    			if (dirty & /*health*/ 32) healthbar_changes.health = /*health*/ ctx[5];
    			if (dirty & /*maxHealth*/ 2) healthbar_changes.maxHealth = /*maxHealth*/ ctx[1];
    			healthbar.$set(healthbar_changes);
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
    			destroy_component(healthbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(2:1) {#if !hideHealth}",
    		ctx
    	});

    	return block;
    }

    // (5:1) {#if graphic != null}
    function create_if_block$a(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "graphic drop-shadow svelte-1g0kolr");
    			if (img.src !== (img_src_value = /*graphic*/ ctx[7].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*name*/ ctx[0]);
    			set_style(img, "width", /*graphic*/ ctx[7].width * artScale$1 + "px");
    			set_style(img, "height", /*graphic*/ ctx[7].height * artScale$1 + "px");
    			set_style(img, "transform", "scaleX(" + /*direction*/ ctx[6] + ") rotate(" + /*rotate*/ ctx[8] + "deg)");
    			toggle_class(img, "dead", /*health*/ ctx[5] <= 0);
    			add_location(img, file$j, 5, 2, 150);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*graphic*/ 128 && img.src !== (img_src_value = /*graphic*/ ctx[7].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*name*/ 1) {
    				attr_dev(img, "alt", /*name*/ ctx[0]);
    			}

    			if (dirty & /*graphic*/ 128) {
    				set_style(img, "width", /*graphic*/ ctx[7].width * artScale$1 + "px");
    			}

    			if (dirty & /*graphic*/ 128) {
    				set_style(img, "height", /*graphic*/ ctx[7].height * artScale$1 + "px");
    			}

    			if (dirty & /*direction, rotate*/ 320) {
    				set_style(img, "transform", "scaleX(" + /*direction*/ ctx[6] + ") rotate(" + /*rotate*/ ctx[8] + "deg)");
    			}

    			if (dirty & /*health*/ 32) {
    				toggle_class(img, "dead", /*health*/ ctx[5] <= 0);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(5:1) {#if graphic != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = !/*hideHealth*/ ctx[2] && create_if_block_1$6(ctx);
    	let if_block1 = /*graphic*/ ctx[7] != null && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "player svelte-1g0kolr");
    			set_style(div, "left", /*x*/ ctx[4] + "px");
    			set_style(div, "bottom", /*y*/ ctx[3] + "px");
    			add_location(div, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*hideHealth*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*hideHealth*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*graphic*/ ctx[7] != null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$a(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*x*/ 16) {
    				set_style(div, "left", /*x*/ ctx[4] + "px");
    			}

    			if (!current || dirty & /*y*/ 8) {
    				set_style(div, "bottom", /*y*/ ctx[3] + "px");
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
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
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

    const artScale$1 = 2;

    function instance$l($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(23, $project = $$value));
    	let { name } = $$props;
    	let { maxHealth } = $$props;
    	let { graphicStill } = $$props;
    	let { graphicSpinning } = $$props;
    	let { motionGraphics = [] } = $$props;
    	let { motionGraphicsLoopBack = true } = $$props;
    	let { framesPerGraphic = 5 } = $$props;
    	let { hideHealth = false } = $$props;
    	let { vx = 0 } = $$props;
    	let { vy = 0 } = $$props;
    	let { y = 0 } = $$props;
    	let { x = 0 } = $$props;
    	let { health } = $$props;
    	let { frame } = $$props;
    	let { spinDegreesPerFrame = 5 } = $$props;
    	let motionGraphicIndex = 0;
    	let motionGraphicDelta = 1;
    	let { spinning = false } = $$props;
    	let direction = 1;

    	const writable_props = [
    		"name",
    		"maxHealth",
    		"graphicStill",
    		"graphicSpinning",
    		"motionGraphics",
    		"motionGraphicsLoopBack",
    		"framesPerGraphic",
    		"hideHealth",
    		"vx",
    		"vy",
    		"y",
    		"x",
    		"health",
    		"frame",
    		"spinDegreesPerFrame",
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
    		if ("graphicStill" in $$props) $$invalidate(9, graphicStill = $$props.graphicStill);
    		if ("graphicSpinning" in $$props) $$invalidate(10, graphicSpinning = $$props.graphicSpinning);
    		if ("motionGraphics" in $$props) $$invalidate(11, motionGraphics = $$props.motionGraphics);
    		if ("motionGraphicsLoopBack" in $$props) $$invalidate(12, motionGraphicsLoopBack = $$props.motionGraphicsLoopBack);
    		if ("framesPerGraphic" in $$props) $$invalidate(13, framesPerGraphic = $$props.framesPerGraphic);
    		if ("hideHealth" in $$props) $$invalidate(2, hideHealth = $$props.hideHealth);
    		if ("vx" in $$props) $$invalidate(14, vx = $$props.vx);
    		if ("vy" in $$props) $$invalidate(15, vy = $$props.vy);
    		if ("y" in $$props) $$invalidate(3, y = $$props.y);
    		if ("x" in $$props) $$invalidate(4, x = $$props.x);
    		if ("health" in $$props) $$invalidate(5, health = $$props.health);
    		if ("frame" in $$props) $$invalidate(16, frame = $$props.frame);
    		if ("spinDegreesPerFrame" in $$props) $$invalidate(17, spinDegreesPerFrame = $$props.spinDegreesPerFrame);
    		if ("spinning" in $$props) $$invalidate(18, spinning = $$props.spinning);
    	};

    	$$self.$capture_state = () => ({
    		project,
    		HealthBar,
    		artScale: artScale$1,
    		name,
    		maxHealth,
    		graphicStill,
    		graphicSpinning,
    		motionGraphics,
    		motionGraphicsLoopBack,
    		framesPerGraphic,
    		hideHealth,
    		vx,
    		vy,
    		y,
    		x,
    		health,
    		frame,
    		spinDegreesPerFrame,
    		motionGraphicIndex,
    		motionGraphicDelta,
    		spinning,
    		direction,
    		usableMotionGraphics,
    		motionGraphic,
    		graphic,
    		$project,
    		rotate
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("maxHealth" in $$props) $$invalidate(1, maxHealth = $$props.maxHealth);
    		if ("graphicStill" in $$props) $$invalidate(9, graphicStill = $$props.graphicStill);
    		if ("graphicSpinning" in $$props) $$invalidate(10, graphicSpinning = $$props.graphicSpinning);
    		if ("motionGraphics" in $$props) $$invalidate(11, motionGraphics = $$props.motionGraphics);
    		if ("motionGraphicsLoopBack" in $$props) $$invalidate(12, motionGraphicsLoopBack = $$props.motionGraphicsLoopBack);
    		if ("framesPerGraphic" in $$props) $$invalidate(13, framesPerGraphic = $$props.framesPerGraphic);
    		if ("hideHealth" in $$props) $$invalidate(2, hideHealth = $$props.hideHealth);
    		if ("vx" in $$props) $$invalidate(14, vx = $$props.vx);
    		if ("vy" in $$props) $$invalidate(15, vy = $$props.vy);
    		if ("y" in $$props) $$invalidate(3, y = $$props.y);
    		if ("x" in $$props) $$invalidate(4, x = $$props.x);
    		if ("health" in $$props) $$invalidate(5, health = $$props.health);
    		if ("frame" in $$props) $$invalidate(16, frame = $$props.frame);
    		if ("spinDegreesPerFrame" in $$props) $$invalidate(17, spinDegreesPerFrame = $$props.spinDegreesPerFrame);
    		if ("motionGraphicIndex" in $$props) $$invalidate(19, motionGraphicIndex = $$props.motionGraphicIndex);
    		if ("motionGraphicDelta" in $$props) $$invalidate(20, motionGraphicDelta = $$props.motionGraphicDelta);
    		if ("spinning" in $$props) $$invalidate(18, spinning = $$props.spinning);
    		if ("direction" in $$props) $$invalidate(6, direction = $$props.direction);
    		if ("usableMotionGraphics" in $$props) $$invalidate(21, usableMotionGraphics = $$props.usableMotionGraphics);
    		if ("motionGraphic" in $$props) $$invalidate(22, motionGraphic = $$props.motionGraphic);
    		if ("graphic" in $$props) $$invalidate(7, graphic = $$props.graphic);
    		if ("rotate" in $$props) $$invalidate(8, rotate = $$props.rotate);
    	};

    	let usableMotionGraphics;
    	let motionGraphic;
    	let graphic;
    	let rotate;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*motionGraphics*/ 2048) {
    			 $$invalidate(21, usableMotionGraphics = motionGraphics.filter(g => g != null));
    		}

    		if ($$self.$$.dirty & /*frame, framesPerGraphic, usableMotionGraphics, motionGraphicIndex, motionGraphicDelta, motionGraphicsLoopBack*/ 3747840) {
    			 if (frame % framesPerGraphic === 0) {
    				// change the graphic every x frames
    				if (usableMotionGraphics.length > 1) {
    					$$invalidate(19, motionGraphicIndex = Math.max(motionGraphicIndex + motionGraphicDelta, 0));

    					if (motionGraphicIndex >= usableMotionGraphics.length - 1 || motionGraphicIndex == 0) {
    						if (motionGraphicsLoopBack) $$invalidate(20, motionGraphicDelta = motionGraphicDelta * -1); else $$invalidate(19, motionGraphicIndex = 0);
    					}
    				} else {
    					$$invalidate(19, motionGraphicIndex = 0);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*usableMotionGraphics, motionGraphicIndex*/ 2621440) {
    			 $$invalidate(22, motionGraphic = usableMotionGraphics[motionGraphicIndex]);
    		}

    		if ($$self.$$.dirty & /*spinning, graphicSpinning, $project, vx, motionGraphic, graphicStill*/ 12862976) {
    			 $$invalidate(7, graphic = spinning && graphicSpinning != null
    			? $project.art[graphicSpinning]
    			: vx != 0 && motionGraphic != null
    				? $project.art[motionGraphic]
    				: graphicStill != null ? $project.art[graphicStill] : null);
    		}

    		if ($$self.$$.dirty & /*vx*/ 16384) {
    			 if (vx != 0) $$invalidate(6, direction = vx > 0 ? 1 : -1);
    		}

    		if ($$self.$$.dirty & /*spinning, frame, spinDegreesPerFrame, vy*/ 491520) {
    			 $$invalidate(8, rotate = spinning
    			? frame * (spinDegreesPerFrame || 15)
    			: -1 * (vy > 0 ? vy * 3 : vy * 1.5));
    		}
    	};

    	return [
    		name,
    		maxHealth,
    		hideHealth,
    		y,
    		x,
    		health,
    		direction,
    		graphic,
    		rotate,
    		graphicStill,
    		graphicSpinning,
    		motionGraphics,
    		motionGraphicsLoopBack,
    		framesPerGraphic,
    		vx,
    		vy,
    		frame,
    		spinDegreesPerFrame,
    		spinning
    	];
    }

    class LivingSprite extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			name: 0,
    			maxHealth: 1,
    			graphicStill: 9,
    			graphicSpinning: 10,
    			motionGraphics: 11,
    			motionGraphicsLoopBack: 12,
    			framesPerGraphic: 13,
    			hideHealth: 2,
    			vx: 14,
    			vy: 15,
    			y: 3,
    			x: 4,
    			health: 5,
    			frame: 16,
    			spinDegreesPerFrame: 17,
    			spinning: 18
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LivingSprite",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'name'");
    		}

    		if (/*maxHealth*/ ctx[1] === undefined && !("maxHealth" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'maxHealth'");
    		}

    		if (/*graphicStill*/ ctx[9] === undefined && !("graphicStill" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'graphicStill'");
    		}

    		if (/*graphicSpinning*/ ctx[10] === undefined && !("graphicSpinning" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'graphicSpinning'");
    		}

    		if (/*health*/ ctx[5] === undefined && !("health" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'health'");
    		}

    		if (/*frame*/ ctx[16] === undefined && !("frame" in props)) {
    			console.warn("<LivingSprite> was created without expected prop 'frame'");
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

    	get motionGraphics() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set motionGraphics(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get motionGraphicsLoopBack() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set motionGraphicsLoopBack(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get framesPerGraphic() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set framesPerGraphic(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideHealth() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideHealth(value) {
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

    	get frame() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set frame(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinDegreesPerFrame() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinDegreesPerFrame(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinning() {
    		throw new Error("<LivingSprite>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinning(value) {
    		throw new Error("<LivingSprite>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldAnimation.svelte generated by Svelte v3.24.1 */
    const file$k = "src\\components\\FieldAnimation.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[23] = list;
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (8:4) <FieldNumber bind:value={framesPerGraphic} max={100}>
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Frames per graphic");
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
    		source: "(8:4) <FieldNumber bind:value={framesPerGraphic} max={100}>",
    		ctx
    	});

    	return block;
    }

    // (9:4) <FieldCheckbox bind:checked={loopBack}>
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loop backwards, or start from beginning?");
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
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(9:4) <FieldCheckbox bind:checked={loopBack}>",
    		ctx
    	});

    	return block;
    }

    // (11:5) <FieldArtPicker bind:value={g}>
    function create_default_slot$6(ctx) {
    	let t0;
    	let t1_value = /*index*/ ctx[24] + 1 + "";
    	let t1;
    	let t2;
    	let a;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { data: deleteIcon },
    			$$inline: true
    		});

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[13](/*index*/ ctx[24], ...args);
    	}

    	const block = {
    		c: function create() {
    			t0 = text("Frame ");
    			t1 = text(t1_value);
    			t2 = space();
    			a = element("a");
    			create_component(icon.$$.fragment);
    			attr_dev(a, "href", "#/");
    			attr_dev(a, "class", "text-danger");
    			add_location(a, file$k, 12, 6, 474);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a, anchor);
    			mount_component(icon, a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(click_handler), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
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
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(11:5) <FieldArtPicker bind:value={g}>",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#each graphics as g, index}
    function create_each_block$5(ctx) {
    	let fieldartpicker;
    	let updating_value;
    	let current;

    	function fieldartpicker_value_binding(value) {
    		/*fieldartpicker_value_binding*/ ctx[14].call(null, value, /*g*/ ctx[22], /*each_value*/ ctx[23], /*index*/ ctx[24]);
    	}

    	let fieldartpicker_props = {
    		$$slots: { default: [create_default_slot$6] },
    		$$scope: { ctx }
    	};

    	if (/*g*/ ctx[22] !== void 0) {
    		fieldartpicker_props.value = /*g*/ ctx[22];
    	}

    	fieldartpicker = new FieldArtPicker({
    			props: fieldartpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldartpicker, "value", fieldartpicker_value_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldartpicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldartpicker, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const fieldartpicker_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fieldartpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*graphics*/ 1) {
    				updating_value = true;
    				fieldartpicker_changes.value = /*g*/ ctx[22];
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldartpicker.$set(fieldartpicker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldartpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldartpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldartpicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(10:4) {#each graphics as g, index}",
    		ctx
    	});

    	return block;
    }

    // (20:3) {#if previewGraphic != null}
    function create_if_block$b(ctx) {
    	let div1;
    	let div0;
    	let livingsprite0;
    	let t;
    	let livingsprite1;
    	let current;

    	livingsprite0 = new LivingSprite({
    			props: {
    				x: 0,
    				vx: /*posDir*/ ctx[4],
    				frame: /*previewFrame*/ ctx[5],
    				hideHealth: true,
    				motionGraphics: /*graphics*/ ctx[0],
    				framesPerGraphic: /*framesPerGraphic*/ ctx[1]
    			},
    			$$inline: true
    		});

    	livingsprite1 = new LivingSprite({
    			props: {
    				x: /*posX*/ ctx[3] + /*previewGraphic*/ ctx[6].width * 2,
    				vx: /*posDir*/ ctx[4],
    				frame: /*previewFrame*/ ctx[5],
    				hideHealth: true,
    				motionGraphics: /*graphics*/ ctx[0],
    				framesPerGraphic: /*framesPerGraphic*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(livingsprite0.$$.fragment);
    			t = space();
    			create_component(livingsprite1.$$.fragment);
    			attr_dev(div0, "class", "motion-preview");
    			set_style(div0, "height", /*previewGraphic*/ ctx[6].height * 2 + "px");
    			add_location(div0, file$k, 21, 5, 798);
    			add_location(div1, file$k, 20, 4, 786);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(livingsprite0, div0, null);
    			append_dev(div0, t);
    			mount_component(livingsprite1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const livingsprite0_changes = {};
    			if (dirty & /*posDir*/ 16) livingsprite0_changes.vx = /*posDir*/ ctx[4];
    			if (dirty & /*previewFrame*/ 32) livingsprite0_changes.frame = /*previewFrame*/ ctx[5];
    			if (dirty & /*graphics*/ 1) livingsprite0_changes.motionGraphics = /*graphics*/ ctx[0];
    			if (dirty & /*framesPerGraphic*/ 2) livingsprite0_changes.framesPerGraphic = /*framesPerGraphic*/ ctx[1];
    			livingsprite0.$set(livingsprite0_changes);
    			const livingsprite1_changes = {};
    			if (dirty & /*posX, previewGraphic*/ 72) livingsprite1_changes.x = /*posX*/ ctx[3] + /*previewGraphic*/ ctx[6].width * 2;
    			if (dirty & /*posDir*/ 16) livingsprite1_changes.vx = /*posDir*/ ctx[4];
    			if (dirty & /*previewFrame*/ 32) livingsprite1_changes.frame = /*previewFrame*/ ctx[5];
    			if (dirty & /*graphics*/ 1) livingsprite1_changes.motionGraphics = /*graphics*/ ctx[0];
    			if (dirty & /*framesPerGraphic*/ 2) livingsprite1_changes.framesPerGraphic = /*framesPerGraphic*/ ctx[1];
    			livingsprite1.$set(livingsprite1_changes);

    			if (!current || dirty & /*previewGraphic*/ 64) {
    				set_style(div0, "height", /*previewGraphic*/ ctx[6].height * 2 + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(livingsprite0.$$.fragment, local);
    			transition_in(livingsprite1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(livingsprite0.$$.fragment, local);
    			transition_out(livingsprite1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(livingsprite0);
    			destroy_component(livingsprite1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(20:3) {#if previewGraphic != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div3;
    	let strong;
    	let t0;
    	let div2;
    	let div1;
    	let div0;
    	let fieldnumber;
    	let updating_value;
    	let t1;
    	let fieldcheckbox;
    	let updating_checked;
    	let t2;
    	let t3;
    	let button;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	function fieldnumber_value_binding(value) {
    		/*fieldnumber_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber_props = {
    		max: 100,
    		$$slots: { default: [create_default_slot_2$3] },
    		$$scope: { ctx }
    	};

    	if (/*framesPerGraphic*/ ctx[1] !== void 0) {
    		fieldnumber_props.value = /*framesPerGraphic*/ ctx[1];
    	}

    	fieldnumber = new FieldNumber({ props: fieldnumber_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldnumber, "value", fieldnumber_value_binding));

    	function fieldcheckbox_checked_binding(value) {
    		/*fieldcheckbox_checked_binding*/ ctx[12].call(null, value);
    	}

    	let fieldcheckbox_props = {
    		$$slots: { default: [create_default_slot_1$3] },
    		$$scope: { ctx }
    	};

    	if (/*loopBack*/ ctx[2] !== void 0) {
    		fieldcheckbox_props.checked = /*loopBack*/ ctx[2];
    	}

    	fieldcheckbox = new FieldCheckbox({
    			props: fieldcheckbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox, "checked", fieldcheckbox_checked_binding));
    	let each_value = /*graphics*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*previewGraphic*/ ctx[6] != null && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			strong = element("strong");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(fieldnumber.$$.fragment);
    			t1 = space();
    			create_component(fieldcheckbox.$$.fragment);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			button = element("button");
    			button.textContent = "Add frame";
    			t5 = space();
    			if (if_block) if_block.c();
    			add_location(strong, file$k, 1, 1, 27);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-sm btn-info");
    			add_location(button, file$k, 17, 4, 648);
    			attr_dev(div0, "class", "flex align-top motion-graphics-fields");
    			add_location(div0, file$k, 6, 3, 126);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file$k, 5, 2, 98);
    			attr_dev(div2, "class", "card bg-light mb-3");
    			add_location(div2, file$k, 4, 1, 62);
    			attr_dev(div3, "class", "form-group");
    			add_location(div3, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, strong);

    			if (default_slot) {
    				default_slot.m(strong, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(fieldnumber, div0, null);
    			append_dev(div0, t1);
    			mount_component(fieldcheckbox, div0, null);
    			append_dev(div0, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div0, t3);
    			append_dev(div0, button);
    			append_dev(div1, t5);
    			if (if_block) if_block.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addFrame*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			const fieldnumber_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fieldnumber_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*framesPerGraphic*/ 2) {
    				updating_value = true;
    				fieldnumber_changes.value = /*framesPerGraphic*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldnumber.$set(fieldnumber_changes);
    			const fieldcheckbox_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fieldcheckbox_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*loopBack*/ 4) {
    				updating_checked = true;
    				fieldcheckbox_changes.checked = /*loopBack*/ ctx[2];
    				add_flush_callback(() => updating_checked = false);
    			}

    			fieldcheckbox.$set(fieldcheckbox_changes);

    			if (dirty & /*graphics, removeFrame, removeIcon*/ 257) {
    				each_value = /*graphics*/ ctx[0];
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
    						each_blocks[i].m(div0, t3);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*previewGraphic*/ ctx[6] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*previewGraphic*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
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
    			transition_in(default_slot, local);
    			transition_in(fieldnumber.$$.fragment, local);
    			transition_in(fieldcheckbox.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(fieldnumber.$$.fragment, local);
    			transition_out(fieldcheckbox.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(fieldnumber);
    			destroy_component(fieldcheckbox);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
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
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(18, $project = $$value));
    	let { graphics = [] } = $$props;
    	let { framesPerGraphic = 5 } = $$props;
    	let { loopBack = true } = $$props;
    	let { vx = 5 } = $$props;
    	let motionState = 0;
    	let motionDelta = 1;
    	let posX = 0;
    	let posDir = 1;
    	let lastRequestedFrame;
    	let previewFrame = 0;
    	animationLoop();

    	function animationLoop() {
    		$$invalidate(5, previewFrame++, previewFrame);
    		$$invalidate(3, posX += (vx || 0) * posDir);
    		if (posX > 500 || posX < 0) $$invalidate(4, posDir = posDir * -1);
    		lastRequestedFrame = window.requestAnimationFrame(animationLoop);
    	}

    	onDestroy(() => {
    		window.cancelAnimationFrame(lastRequestedFrame);
    	});

    	function addFrame() {
    		$$invalidate(0, graphics = [...graphics, null]);
    	}

    	function removeFrame(index) {
    		graphics.splice(index, 1);
    		$$invalidate(0, graphics);
    	}

    	const writable_props = ["graphics", "framesPerGraphic", "loopBack", "vx"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldAnimation> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldAnimation", $$slots, ['default']);

    	function fieldnumber_value_binding(value) {
    		framesPerGraphic = value;
    		$$invalidate(1, framesPerGraphic);
    	}

    	function fieldcheckbox_checked_binding(value) {
    		loopBack = value;
    		$$invalidate(2, loopBack);
    	}

    	const click_handler = index => removeFrame(index);

    	function fieldartpicker_value_binding(value, g, each_value, index) {
    		each_value[index] = value;
    		$$invalidate(0, graphics);
    	}

    	$$self.$$set = $$props => {
    		if ("graphics" in $$props) $$invalidate(0, graphics = $$props.graphics);
    		if ("framesPerGraphic" in $$props) $$invalidate(1, framesPerGraphic = $$props.framesPerGraphic);
    		if ("loopBack" in $$props) $$invalidate(2, loopBack = $$props.loopBack);
    		if ("vx" in $$props) $$invalidate(9, vx = $$props.vx);
    		if ("$$scope" in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		removeIcon: deleteIcon,
    		project,
    		FieldArtPicker,
    		FieldNumber,
    		Icon,
    		LivingSprite,
    		FieldCheckbox,
    		graphics,
    		framesPerGraphic,
    		loopBack,
    		vx,
    		motionState,
    		motionDelta,
    		posX,
    		posDir,
    		lastRequestedFrame,
    		previewFrame,
    		animationLoop,
    		addFrame,
    		removeFrame,
    		previewGraphics,
    		previewGraphic,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("graphics" in $$props) $$invalidate(0, graphics = $$props.graphics);
    		if ("framesPerGraphic" in $$props) $$invalidate(1, framesPerGraphic = $$props.framesPerGraphic);
    		if ("loopBack" in $$props) $$invalidate(2, loopBack = $$props.loopBack);
    		if ("vx" in $$props) $$invalidate(9, vx = $$props.vx);
    		if ("motionState" in $$props) $$invalidate(19, motionState = $$props.motionState);
    		if ("motionDelta" in $$props) motionDelta = $$props.motionDelta;
    		if ("posX" in $$props) $$invalidate(3, posX = $$props.posX);
    		if ("posDir" in $$props) $$invalidate(4, posDir = $$props.posDir);
    		if ("lastRequestedFrame" in $$props) lastRequestedFrame = $$props.lastRequestedFrame;
    		if ("previewFrame" in $$props) $$invalidate(5, previewFrame = $$props.previewFrame);
    		if ("previewGraphics" in $$props) $$invalidate(17, previewGraphics = $$props.previewGraphics);
    		if ("previewGraphic" in $$props) $$invalidate(6, previewGraphic = $$props.previewGraphic);
    	};

    	let previewGraphics;
    	let previewGraphic;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*graphics*/ 1) {
    			 $$invalidate(17, previewGraphics = graphics.length > 0
    			? graphics.filter(g => g != null)
    			: []);
    		}

    		if ($$self.$$.dirty & /*previewGraphics, $project*/ 393216) {
    			 $$invalidate(6, previewGraphic = previewGraphics != null && previewGraphics[motionState] != null
    			? $project.art[previewGraphics[motionState]]
    			: null);
    		}
    	};

    	return [
    		graphics,
    		framesPerGraphic,
    		loopBack,
    		posX,
    		posDir,
    		previewFrame,
    		previewGraphic,
    		addFrame,
    		removeFrame,
    		vx,
    		$$slots,
    		fieldnumber_value_binding,
    		fieldcheckbox_checked_binding,
    		click_handler,
    		fieldartpicker_value_binding,
    		$$scope
    	];
    }

    class FieldAnimation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			graphics: 0,
    			framesPerGraphic: 1,
    			loopBack: 2,
    			vx: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldAnimation",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get graphics() {
    		throw new Error("<FieldAnimation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graphics(value) {
    		throw new Error("<FieldAnimation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get framesPerGraphic() {
    		throw new Error("<FieldAnimation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set framesPerGraphic(value) {
    		throw new Error("<FieldAnimation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loopBack() {
    		throw new Error("<FieldAnimation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loopBack(value) {
    		throw new Error("<FieldAnimation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vx() {
    		throw new Error("<FieldAnimation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vx(value) {
    		throw new Error("<FieldAnimation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FieldRange.svelte generated by Svelte v3.24.1 */

    const file$l = "src\\components\\FieldRange.svelte";

    function create_fragment$n(ctx) {
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
    			add_location(label, file$l, 1, 1, 27);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", /*min*/ ctx[2]);
    			attr_dev(input, "max", /*max*/ ctx[3]);
    			attr_dev(input, "step", /*step*/ ctx[4]);
    			attr_dev(input, "class", "form-control");
    			add_location(input, file$l, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$l, 0, 0, 0);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
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
    			id: create_fragment$n.name
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
    const file$m = "src\\pages\\Build\\CharacterBuilder.svelte";

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
    			add_location(button, file$m, 4, 4, 172);
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
    function create_buttons_slot$2(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$m, 2, 2, 125);
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
    		id: create_buttons_slot$2.name,
    		type: "slot",
    		source: "(3:2) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (8:2) <FieldText name="name" bind:value={input.name}>
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
    		source: "(8:2) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (10:2) <FieldArtPicker bind:value={input.graphicStill}>
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
    		source: "(10:2) <FieldArtPicker bind:value={input.graphicStill}>",
    		ctx
    	});

    	return block;
    }

    // (11:2) <FieldAnimation     bind:graphics={input.motionGraphics}     bind:framesPerGraphic={input.framesPerGraphic}     bind:loopBack={input.motionGraphicsLoopBack}     vx={input.maxVelocity}>
    function create_default_slot_8$1(ctx) {
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
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(11:2) <FieldAnimation     bind:graphics={input.motionGraphics}     bind:framesPerGraphic={input.framesPerGraphic}     bind:loopBack={input.motionGraphicsLoopBack}     vx={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (18:2) <FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>
    function create_default_slot_7$1(ctx) {
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
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(18:2) <FieldNumber name=\\\"maxVelocity\\\" min={0} bind:value={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (19:2) <FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>
    function create_default_slot_6$2(ctx) {
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
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(19:2) <FieldNumber name=\\\"jumpVelocity\\\" min={0} bind:value={input.jumpVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>
    function create_default_slot_5$2(ctx) {
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
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(20:2) <FieldNumber name=\\\"gravityMultiplier\\\" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (21:2) <FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>
    function create_default_slot_4$2(ctx) {
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
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(21:2) <FieldNumber name=\\\"fallDamageMultiplier\\\" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (22:2) <FieldNumber name="maxHealth" bind:value={input.maxHealth}>
    function create_default_slot_3$2(ctx) {
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
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(22:2) <FieldNumber name=\\\"maxHealth\\\" bind:value={input.maxHealth}>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <FieldAbilities name="abilities" bind:input>
    function create_default_slot_2$4(ctx) {
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
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(23:2) <FieldAbilities name=\\\"abilities\\\" bind:input>",
    		ctx
    	});

    	return block;
    }

    // (2:1) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$4(ctx) {
    	let t0;
    	let fieldtext;
    	let updating_value;
    	let t1;
    	let fieldartpicker;
    	let updating_value_1;
    	let t2;
    	let fieldanimation;
    	let updating_graphics;
    	let updating_framesPerGraphic;
    	let updating_loopBack;
    	let t3;
    	let fieldnumber0;
    	let updating_value_2;
    	let t4;
    	let fieldnumber1;
    	let updating_value_3;
    	let t5;
    	let fieldnumber2;
    	let updating_value_4;
    	let t6;
    	let fieldnumber3;
    	let updating_value_5;
    	let t7;
    	let fieldnumber4;
    	let updating_value_6;
    	let t8;
    	let fieldabilities;
    	let updating_input;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[8].call(null, value);
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

    	function fieldartpicker_value_binding(value) {
    		/*fieldartpicker_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldartpicker_props = {
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

    	function fieldanimation_graphics_binding(value) {
    		/*fieldanimation_graphics_binding*/ ctx[10].call(null, value);
    	}

    	function fieldanimation_framesPerGraphic_binding(value) {
    		/*fieldanimation_framesPerGraphic_binding*/ ctx[11].call(null, value);
    	}

    	function fieldanimation_loopBack_binding(value) {
    		/*fieldanimation_loopBack_binding*/ ctx[12].call(null, value);
    	}

    	let fieldanimation_props = {
    		vx: /*input*/ ctx[0].maxVelocity,
    		$$slots: { default: [create_default_slot_8$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].motionGraphics !== void 0) {
    		fieldanimation_props.graphics = /*input*/ ctx[0].motionGraphics;
    	}

    	if (/*input*/ ctx[0].framesPerGraphic !== void 0) {
    		fieldanimation_props.framesPerGraphic = /*input*/ ctx[0].framesPerGraphic;
    	}

    	if (/*input*/ ctx[0].motionGraphicsLoopBack !== void 0) {
    		fieldanimation_props.loopBack = /*input*/ ctx[0].motionGraphicsLoopBack;
    	}

    	fieldanimation = new FieldAnimation({
    			props: fieldanimation_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldanimation, "graphics", fieldanimation_graphics_binding));
    	binding_callbacks.push(() => bind(fieldanimation, "framesPerGraphic", fieldanimation_framesPerGraphic_binding));
    	binding_callbacks.push(() => bind(fieldanimation, "loopBack", fieldanimation_loopBack_binding));

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[13].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "maxVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_7$1] },
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
    		/*fieldnumber1_value_binding*/ ctx[14].call(null, value);
    	}

    	let fieldnumber1_props = {
    		name: "jumpVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_6$2] },
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
    		/*fieldnumber2_value_binding*/ ctx[15].call(null, value);
    	}

    	let fieldnumber2_props = {
    		name: "gravityMultiplier",
    		min: 0,
    		max: 2,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_5$2] },
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
    		/*fieldnumber3_value_binding*/ ctx[16].call(null, value);
    	}

    	let fieldnumber3_props = {
    		name: "fallDamageMultiplier",
    		min: 0,
    		max: 1,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_4$2] },
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
    		/*fieldnumber4_value_binding*/ ctx[17].call(null, value);
    	}

    	let fieldnumber4_props = {
    		name: "maxHealth",
    		$$slots: { default: [create_default_slot_3$2] },
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

    	function fieldabilities_input_binding(value) {
    		/*fieldabilities_input_binding*/ ctx[18].call(null, value);
    	}

    	let fieldabilities_props = {
    		name: "abilities",
    		$$slots: { default: [create_default_slot_2$4] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0] !== void 0) {
    		fieldabilities_props.input = /*input*/ ctx[0];
    	}

    	fieldabilities = new FieldAbilities({
    			props: fieldabilities_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldabilities, "input", fieldabilities_input_binding));

    	const block = {
    		c: function create() {
    			t0 = space();
    			create_component(fieldtext.$$.fragment);
    			t1 = space();
    			create_component(fieldartpicker.$$.fragment);
    			t2 = space();
    			create_component(fieldanimation.$$.fragment);
    			t3 = space();
    			create_component(fieldnumber0.$$.fragment);
    			t4 = space();
    			create_component(fieldnumber1.$$.fragment);
    			t5 = space();
    			create_component(fieldnumber2.$$.fragment);
    			t6 = space();
    			create_component(fieldnumber3.$$.fragment);
    			t7 = space();
    			create_component(fieldnumber4.$$.fragment);
    			t8 = space();
    			create_component(fieldabilities.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldartpicker, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(fieldanimation, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fieldnumber0, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(fieldnumber1, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(fieldnumber2, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(fieldnumber3, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(fieldnumber4, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(fieldabilities, target, anchor);
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
    			const fieldartpicker_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldartpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker_changes.value = /*input*/ ctx[0].graphicStill;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker.$set(fieldartpicker_changes);
    			const fieldanimation_changes = {};
    			if (dirty & /*input*/ 1) fieldanimation_changes.vx = /*input*/ ctx[0].maxVelocity;

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldanimation_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_graphics && dirty & /*input*/ 1) {
    				updating_graphics = true;
    				fieldanimation_changes.graphics = /*input*/ ctx[0].motionGraphics;
    				add_flush_callback(() => updating_graphics = false);
    			}

    			if (!updating_framesPerGraphic && dirty & /*input*/ 1) {
    				updating_framesPerGraphic = true;
    				fieldanimation_changes.framesPerGraphic = /*input*/ ctx[0].framesPerGraphic;
    				add_flush_callback(() => updating_framesPerGraphic = false);
    			}

    			if (!updating_loopBack && dirty & /*input*/ 1) {
    				updating_loopBack = true;
    				fieldanimation_changes.loopBack = /*input*/ ctx[0].motionGraphicsLoopBack;
    				add_flush_callback(() => updating_loopBack = false);
    			}

    			fieldanimation.$set(fieldanimation_changes);
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].maxVelocity;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].jumpVelocity;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].gravityMultiplier;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_5 && dirty & /*input*/ 1) {
    				updating_value_5 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].fallDamageMultiplier;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldnumber4_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_6 && dirty & /*input*/ 1) {
    				updating_value_6 = true;
    				fieldnumber4_changes.value = /*input*/ ctx[0].maxHealth;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			fieldnumber4.$set(fieldnumber4_changes);
    			const fieldabilities_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldabilities_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_input && dirty & /*input*/ 1) {
    				updating_input = true;
    				fieldabilities_changes.input = /*input*/ ctx[0];
    				add_flush_callback(() => updating_input = false);
    			}

    			fieldabilities.$set(fieldabilities_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext.$$.fragment, local);
    			transition_in(fieldartpicker.$$.fragment, local);
    			transition_in(fieldanimation.$$.fragment, local);
    			transition_in(fieldnumber0.$$.fragment, local);
    			transition_in(fieldnumber1.$$.fragment, local);
    			transition_in(fieldnumber2.$$.fragment, local);
    			transition_in(fieldnumber3.$$.fragment, local);
    			transition_in(fieldnumber4.$$.fragment, local);
    			transition_in(fieldabilities.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldartpicker.$$.fragment, local);
    			transition_out(fieldanimation.$$.fragment, local);
    			transition_out(fieldnumber0.$$.fragment, local);
    			transition_out(fieldnumber1.$$.fragment, local);
    			transition_out(fieldnumber2.$$.fragment, local);
    			transition_out(fieldnumber3.$$.fragment, local);
    			transition_out(fieldnumber4.$$.fragment, local);
    			transition_out(fieldabilities.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldartpicker, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(fieldanimation, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fieldnumber0, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(fieldnumber1, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(fieldnumber2, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(fieldnumber3, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(fieldnumber4, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(fieldabilities, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(2:1) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <BuildLayout tab="characters" activeName={input.name} store={$project.characters}>
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
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(1:0) <BuildLayout tab=\\\"characters\\\" activeName={input.name} store={$project.characters}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let buildlayout;
    	let current;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "characters",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[3].characters,
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
    			if (dirty & /*$project*/ 8) buildlayout_changes.store = /*$project*/ ctx[3].characters;

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 4194311) {
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

    function createDefaultInput$1() {
    	return {
    		graphicStill: null,
    		graphicSpinning: null,
    		motionGraphics: [null],
    		framesPerGraphic: 5,
    		name: "",
    		maxHealth: 100,
    		maxVelocity: 5,
    		jumpVelocity: 10,
    		gravityMultiplier: 1,
    		fallDamageMultiplier: 1,
    		dps: 100,
    		canFly: false,
    		canSpin: true,
    		spinDegreesPerFrame: 15,
    		canFireProjectiles: false,
    		projectileDamage: 50,
    		projectileYStart: 20,
    		projectileVelocity: 20,
    		projectileGravityMultiplier: 0.1
    	};
    }

    function instance$o($$self, $$props, $$invalidate) {
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
    			...createDefaultInput$1(),
    			...JSON.parse(JSON.stringify($project.characters[name]))
    		});
    	}

    	function create() {
    		$$invalidate(0, input = createDefaultInput$1());
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

    	function fieldartpicker_value_binding(value) {
    		input.graphicStill = value;
    		$$invalidate(0, input);
    	}

    	function fieldanimation_graphics_binding(value) {
    		input.motionGraphics = value;
    		$$invalidate(0, input);
    	}

    	function fieldanimation_framesPerGraphic_binding(value) {
    		input.framesPerGraphic = value;
    		$$invalidate(0, input);
    	}

    	function fieldanimation_loopBack_binding(value) {
    		input.motionGraphicsLoopBack = value;
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

    	function fieldabilities_input_binding(value) {
    		input = value;
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
    		project,
    		FieldAbilities,
    		FieldAnimation,
    		FieldArtPicker,
    		FieldCheckbox,
    		FieldNumber,
    		FieldRange,
    		FieldText,
    		Form,
    		Icon,
    		BuildLayout,
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
    		if ($$self.$$.dirty & /*params*/ 64) {
    			 $$invalidate(19, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty & /*paramName*/ 524288) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty & /*paramName*/ 524288) {
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
    		fieldartpicker_value_binding,
    		fieldanimation_graphics_binding,
    		fieldanimation_framesPerGraphic_binding,
    		fieldanimation_loopBack_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldnumber2_value_binding,
    		fieldnumber3_value_binding,
    		fieldnumber4_value_binding,
    		fieldabilities_input_binding
    	];
    }

    class CharacterBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CharacterBuilder",
    			options,
    			id: create_fragment$o.name
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
    const file$n = "src\\pages\\Build\\EnemyBuilder.svelte";

    // (14:2) <FieldText name="name" bind:value={input.name}>
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
    		source: "(14:2) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (15:2) <FieldArtPicker bind:value={input.graphicStill}>
    function create_default_slot_10$2(ctx) {
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
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(15:2) <FieldArtPicker bind:value={input.graphicStill}>",
    		ctx
    	});

    	return block;
    }

    // (16:2) <FieldAnimation bind:graphics={input.motionGraphics} bind:framesPerGraphic={input.framesPerGraphic} vx={input.maxVelocity}>
    function create_default_slot_9$2(ctx) {
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
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(16:2) <FieldAnimation bind:graphics={input.motionGraphics} bind:framesPerGraphic={input.framesPerGraphic} vx={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (19:2) <FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>
    function create_default_slot_8$2(ctx) {
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
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(19:2) <FieldNumber name=\\\"maxVelocity\\\" min={0} bind:value={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>
    function create_default_slot_7$2(ctx) {
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
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(20:2) <FieldNumber name=\\\"jumpVelocity\\\" min={0} bind:value={input.jumpVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (21:2) <FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>
    function create_default_slot_6$3(ctx) {
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
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(21:2) <FieldNumber name=\\\"gravityMultiplier\\\" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (22:2) <FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>
    function create_default_slot_5$3(ctx) {
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
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(22:2) <FieldNumber name=\\\"fallDamageMultiplier\\\" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <FieldNumber name="maxHealth" bind:value={input.maxHealth}>
    function create_default_slot_4$3(ctx) {
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
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(23:2) <FieldNumber name=\\\"maxHealth\\\" bind:value={input.maxHealth}>",
    		ctx
    	});

    	return block;
    }

    // (24:2) <FieldNumber name="score" bind:value={input.score}>
    function create_default_slot_3$3(ctx) {
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
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(24:2) <FieldNumber name=\\\"score\\\" bind:value={input.score}>",
    		ctx
    	});

    	return block;
    }

    // (25:2) <FieldNumber name="dps" bind:value={input.dps}>
    function create_default_slot_2$5(ctx) {
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
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(25:2) <FieldNumber name=\\\"dps\\\" bind:value={input.dps}>",
    		ctx
    	});

    	return block;
    }

    // (27:3) {#if !isAdding}
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
    			add_location(button, file$n, 27, 4, 1542);
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
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(27:3) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (26:2) <span slot="buttons">
    function create_buttons_slot$3(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$n, 25, 2, 1495);
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
    		id: create_buttons_slot$3.name,
    		type: "slot",
    		source: "(26:2) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:1) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$5(ctx) {
    	let fieldtext;
    	let updating_value;
    	let t0;
    	let fieldartpicker;
    	let updating_value_1;
    	let t1;
    	let fieldanimation;
    	let updating_graphics;
    	let updating_framesPerGraphic;
    	let t2;
    	let fieldnumber0;
    	let updating_value_2;
    	let t3;
    	let fieldnumber1;
    	let updating_value_3;
    	let t4;
    	let fieldnumber2;
    	let updating_value_4;
    	let t5;
    	let fieldnumber3;
    	let updating_value_5;
    	let t6;
    	let fieldnumber4;
    	let updating_value_6;
    	let t7;
    	let fieldnumber5;
    	let updating_value_7;
    	let t8;
    	let fieldnumber6;
    	let updating_value_8;
    	let t9;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[7].call(null, value);
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

    	function fieldartpicker_value_binding(value) {
    		/*fieldartpicker_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldartpicker_props = {
    		$$slots: { default: [create_default_slot_10$2] },
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

    	function fieldanimation_graphics_binding(value) {
    		/*fieldanimation_graphics_binding*/ ctx[9].call(null, value);
    	}

    	function fieldanimation_framesPerGraphic_binding(value) {
    		/*fieldanimation_framesPerGraphic_binding*/ ctx[10].call(null, value);
    	}

    	let fieldanimation_props = {
    		vx: /*input*/ ctx[0].maxVelocity,
    		$$slots: { default: [create_default_slot_9$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].motionGraphics !== void 0) {
    		fieldanimation_props.graphics = /*input*/ ctx[0].motionGraphics;
    	}

    	if (/*input*/ ctx[0].framesPerGraphic !== void 0) {
    		fieldanimation_props.framesPerGraphic = /*input*/ ctx[0].framesPerGraphic;
    	}

    	fieldanimation = new FieldAnimation({
    			props: fieldanimation_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldanimation, "graphics", fieldanimation_graphics_binding));
    	binding_callbacks.push(() => bind(fieldanimation, "framesPerGraphic", fieldanimation_framesPerGraphic_binding));

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "maxVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_8$2] },
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
    		$$slots: { default: [create_default_slot_7$2] },
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
    		$$slots: { default: [create_default_slot_6$3] },
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
    		$$slots: { default: [create_default_slot_5$3] },
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
    		$$slots: { default: [create_default_slot_4$3] },
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
    		name: "score",
    		$$slots: { default: [create_default_slot_3$3] },
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
    		/*fieldnumber6_value_binding*/ ctx[17].call(null, value);
    	}

    	let fieldnumber6_props = {
    		name: "dps",
    		$$slots: { default: [create_default_slot_2$5] },
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
    			create_component(fieldanimation.$$.fragment);
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
    			create_component(fieldnumber6.$$.fragment);
    			t9 = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldartpicker, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldanimation, target, anchor);
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
    			mount_component(fieldnumber6, target, anchor);
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
    			const fieldartpicker_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldartpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldartpicker_changes.value = /*input*/ ctx[0].graphicStill;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldartpicker.$set(fieldartpicker_changes);
    			const fieldanimation_changes = {};
    			if (dirty & /*input*/ 1) fieldanimation_changes.vx = /*input*/ ctx[0].maxVelocity;

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldanimation_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_graphics && dirty & /*input*/ 1) {
    				updating_graphics = true;
    				fieldanimation_changes.graphics = /*input*/ ctx[0].motionGraphics;
    				add_flush_callback(() => updating_graphics = false);
    			}

    			if (!updating_framesPerGraphic && dirty & /*input*/ 1) {
    				updating_framesPerGraphic = true;
    				fieldanimation_changes.framesPerGraphic = /*input*/ ctx[0].framesPerGraphic;
    				add_flush_callback(() => updating_framesPerGraphic = false);
    			}

    			fieldanimation.$set(fieldanimation_changes);
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].maxVelocity;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].jumpVelocity;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].gravityMultiplier;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_5 && dirty & /*input*/ 1) {
    				updating_value_5 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].fallDamageMultiplier;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldnumber4_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_6 && dirty & /*input*/ 1) {
    				updating_value_6 = true;
    				fieldnumber4_changes.value = /*input*/ ctx[0].maxHealth;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			fieldnumber4.$set(fieldnumber4_changes);
    			const fieldnumber5_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				fieldnumber5_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_7 && dirty & /*input*/ 1) {
    				updating_value_7 = true;
    				fieldnumber5_changes.value = /*input*/ ctx[0].score;
    				add_flush_callback(() => updating_value_7 = false);
    			}

    			fieldnumber5.$set(fieldnumber5_changes);
    			const fieldnumber6_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
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
    			transition_in(fieldanimation.$$.fragment, local);
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
    			transition_out(fieldanimation.$$.fragment, local);
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
    			destroy_component(fieldanimation, detaching);
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
    			destroy_component(fieldnumber6, detaching);
    			if (detaching) detach_dev(t9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(13:1) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (12:0) <BuildLayout tab="enemies" activeName={input.name} store={$project.enemies}>
    function create_default_slot$8(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$5],
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
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(12:0) <BuildLayout tab=\\\"enemies\\\" activeName={input.name} store={$project.enemies}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let buildlayout;
    	let current;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "enemies",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[3].enemies,
    				$$slots: { default: [create_default_slot$8] },
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

    			if (dirty & /*$$scope, hasChanges, input, isAdding*/ 4194311) {
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function createDefaultInput$2() {
    	return {
    		graphicStill: null,
    		motionGraphics: [],
    		name: "",
    		maxHealth: 100,
    		maxVelocity: 5,
    		jumpVelocity: 10,
    		gravityMultiplier: 1,
    		fallDamageMultiplier: 1,
    		dps: 120,
    		score: 1
    	};
    }

    function instance$p($$self, $$props, $$invalidate) {
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
    			...createDefaultInput$2(),
    			...JSON.parse(JSON.stringify($project.enemies[name]))
    		});
    	}

    	function create() {
    		$$invalidate(0, input = createDefaultInput$2());
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

    	function fieldartpicker_value_binding(value) {
    		input.graphicStill = value;
    		$$invalidate(0, input);
    	}

    	function fieldanimation_graphics_binding(value) {
    		input.motionGraphics = value;
    		$$invalidate(0, input);
    	}

    	function fieldanimation_framesPerGraphic_binding(value) {
    		input.framesPerGraphic = value;
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
    		project,
    		FieldCheckbox,
    		FieldArtPicker,
    		FieldNumber,
    		FieldText,
    		Form,
    		BuildLayout,
    		validator,
    		FieldAnimation,
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
    		if ($$self.$$.dirty & /*params*/ 64) {
    			 $$invalidate(19, paramName = decodeURIComponent(params.name) || "new");
    		}

    		if ($$self.$$.dirty & /*paramName*/ 524288) {
    			 paramName == "new" ? create() : edit(paramName);
    		}

    		if ($$self.$$.dirty & /*paramName*/ 524288) {
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
    		fieldartpicker_value_binding,
    		fieldanimation_graphics_binding,
    		fieldanimation_framesPerGraphic_binding,
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EnemyBuilder",
    			options,
    			id: create_fragment$p.name
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
    const file$o = "src\\components\\FieldCharacterPicker.svelte";

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
    function create_default_slot$9(ctx) {
    	let art;
    	let t0;
    	let t1_value = /*option*/ ctx[7].value + "";
    	let t1;
    	let current;

    	art = new Art({
    			props: {
    				name: /*$project*/ ctx[2].characters[/*option*/ ctx[7].value].graphicStill
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
    			if (dirty & /*$project, option*/ 132) art_changes.name = /*$project*/ ctx[2].characters[/*option*/ ctx[7].value].graphicStill;
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
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(6:2) <InputSelect multiple {options} bind:value let:option inline filterable={options.length > 2}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
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
    				create_default_slot$9,
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
    			add_location(label, file$o, 1, 1, 27);
    			add_location(div0, file$o, 4, 1, 89);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$o, 0, 0, 0);
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldCharacterPicker",
    			options,
    			id: create_fragment$q.name
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

    const file$p = "src\\components\\FieldMultiSelect.svelte";

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
    			add_location(option, file$p, 6, 3, 171);
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

    function create_fragment$r(ctx) {
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
    			add_location(label, file$p, 1, 1, 27);
    			select.multiple = true;
    			attr_dev(select, "name", /*name*/ ctx[1]);
    			attr_dev(select, "id", /*name*/ ctx[1]);
    			attr_dev(select, "class", "form-control");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$p, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$p, 0, 0, 0);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { value: 0, name: 1, options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldMultiSelect",
    			options,
    			id: create_fragment$r.name
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
    const file$q = "src\\components\\Level.svelte";

    function create_fragment$s(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", /*width*/ ctx[0]);
    			attr_dev(canvas_1, "height", /*height*/ ctx[1]);
    			attr_dev(canvas_1, "class", "svelte-q52jml");
    			add_location(canvas_1, file$q, 0, 0, 0);
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const artScale$2 = 2;

    function instance$s($$self, $$props, $$invalidate) {
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
    				context.drawImage(drawing, x, height - y - art.height * artScale$2, drawing.width * artScale$2, drawing.height * artScale$2);
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
    		artScale: artScale$2,
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
    					enemies.forEach(e => drawOnCanvas($project.enemies[e.name].graphicStill, e.x, e.y));
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

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
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
    			id: create_fragment$s.name
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
    const file$r = "src\\components\\LevelPreview.svelte";

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
    			add_location(img, file$r, 1, 1, 14);
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

    function create_fragment$t(ctx) {
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { level: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelPreview",
    			options,
    			id: create_fragment$t.name
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
    const file$s = "src\\components\\BuildDrawingTool.svelte";

    // (5:3) <InputSelect      name="selected-block"      inline      placeholder="Place a block"      options={Object.keys($project.blocks).map(name => $project.blocks[name])}      let:option      valueProp="name"      bind:value={selectedBlock}      on:change={() => (selectedEnemy = null)}>
    function create_default_slot_1$6(ctx) {
    	let art;
    	let t0;
    	let t1_value = /*option*/ ctx[34].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*option*/ ctx[34].dps + "";
    	let t3;
    	let t4;
    	let t5_value = (/*option*/ ctx[34].solid ? "solid" : "background") + "";
    	let t5;
    	let current;

    	art = new Art({
    			props: {
    				name: /*$project*/ ctx[9].blocks[/*option*/ ctx[34].name].graphic,
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
    			if (dirty[0] & /*$project*/ 512 | dirty[1] & /*option*/ 8) art_changes.name = /*$project*/ ctx[9].blocks[/*option*/ ctx[34].name].graphic;
    			art.$set(art_changes);
    			if ((!current || dirty[1] & /*option*/ 8) && t1_value !== (t1_value = /*option*/ ctx[34].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t3_value !== (t3_value = /*option*/ ctx[34].dps + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t5_value !== (t5_value = (/*option*/ ctx[34].solid ? "solid" : "background") + "")) set_data_dev(t5, t5_value);
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
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(5:3) <InputSelect      name=\\\"selected-block\\\"      inline      placeholder=\\\"Place a block\\\"      options={Object.keys($project.blocks).map(name => $project.blocks[name])}      let:option      valueProp=\\\"name\\\"      bind:value={selectedBlock}      on:change={() => (selectedEnemy = null)}>",
    		ctx
    	});

    	return block;
    }

    // (19:3) <InputSelect      name="selected-block"      inline      placeholder="Place an enemy"      options={Object.keys($project.enemies).map(name => $project.enemies[name])}      let:option      valueProp="name"      bind:value={selectedEnemy}      on:change={() => (selectedBlock = null)}>
    function create_default_slot$a(ctx) {
    	let art;
    	let t0;
    	let strong;
    	let t1_value = /*option*/ ctx[34].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*option*/ ctx[34].dps + "";
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
    				name: /*$project*/ ctx[9].enemies[/*option*/ ctx[34].name].graphicStill,
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
    			t6 = text(" health, ");
    			t7 = text(t7_value);
    			t8 = text(" speed, ");
    			t9 = text(t9_value);
    			t10 = text(" score");
    			add_location(strong, file$s, 28, 4, 977);
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
    			if (dirty[0] & /*$project*/ 512 | dirty[1] & /*option*/ 8) art_changes.name = /*$project*/ ctx[9].enemies[/*option*/ ctx[34].name].graphicStill;
    			art.$set(art_changes);
    			if ((!current || dirty[1] & /*option*/ 8) && t1_value !== (t1_value = /*option*/ ctx[34].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[1] & /*option*/ 8) && t3_value !== (t3_value = /*option*/ ctx[34].dps + "")) set_data_dev(t3, t3_value);
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
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(19:3) <InputSelect      name=\\\"selected-block\\\"      inline      placeholder=\\\"Place an enemy\\\"      options={Object.keys($project.enemies).map(name => $project.enemies[name])}      let:option      valueProp=\\\"name\\\"      bind:value={selectedEnemy}      on:change={() => (selectedBlock = null)}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
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
    				create_default_slot_1$6,
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
    				create_default_slot$a,
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
    			add_location(div0, file$s, 3, 2, 133);
    			attr_dev(div1, "class", "svelte-74cv1g");
    			add_location(div1, file$s, 17, 2, 603);
    			attr_dev(div2, "class", "tool-picker svelte-74cv1g");
    			add_location(div2, file$s, 2, 1, 104);
    			attr_dev(div3, "class", "level-container svelte-74cv1g");
    			set_style(div3, "background", /*background*/ ctx[3]);
    			set_style(div3, "height", /*height*/ ctx[8] + 18 + "px");
    			add_location(div3, file$s, 34, 1, 1149);
    			attr_dev(div4, "class", "drawing-tool svelte-74cv1g");
    			add_location(div4, file$s, 0, 0, 0);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const blockSize = 40;
    const thumbnailScale = 8;

    function instance$u($$self, $$props, $$invalidate) {
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
    		LivingSprite,
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
    			instance$u,
    			create_fragment$u,
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
    			id: create_fragment$u.name
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
    const file$t = "src\\pages\\Build\\LevelBuilder.svelte";

    // (2:0) {#if input != null}
    function create_if_block$f(ctx) {
    	let buildlayout;
    	let current;

    	buildlayout = new BuildLayout({
    			props: {
    				tab: "levels",
    				activeName: /*input*/ ctx[0].name,
    				store: /*$project*/ ctx[3].levels,
    				$$slots: { default: [create_default_slot$b] },
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
    function create_default_slot_3$4(ctx) {
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
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(5:3) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (6:3) <FieldCharacterPicker name="playableCharacters" bind:value={input.playableCharacters}>
    function create_default_slot_2$6(ctx) {
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
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(6:3) <FieldCharacterPicker name=\\\"playableCharacters\\\" bind:value={input.playableCharacters}>",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#if !isAdding}
    function create_if_block_1$7(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$t, 15, 5, 732);
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
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(15:4) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (14:3) <span slot="buttons">
    function create_buttons_slot$4(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block_1$7(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$t, 13, 3, 683);
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
    					if_block = create_if_block_1$7(ctx);
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

    // (4:2) <Form on:submit={save} {hasChanges}>
    function create_default_slot_1$7(ctx) {
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
    		$$slots: { default: [create_default_slot_3$4] },
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
    		$$slots: { default: [create_default_slot_2$6] },
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
    			add_location(label, file$t, 9, 4, 416);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$t, 8, 3, 386);
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
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(4:2) <Form on:submit={save} {hasChanges}>",
    		ctx
    	});

    	return block;
    }

    // (3:1) <BuildLayout tab="levels" activeName={input.name} store={$project.levels}>
    function create_default_slot$b(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				hasChanges: /*hasChanges*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_1$7],
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
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(3:1) <BuildLayout tab=\\\"levels\\\" activeName={input.name} store={$project.levels}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
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
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { params: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilder",
    			options,
    			id: create_fragment$v.name
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

    function create_fragment$w(ctx) {
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
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { params: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get params() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // object x, y coords are always bottom left... add width or height to get other sides
    const doObjectsIntersect = (a, b) => doObjectsIntersectX(a, b) && doObjectsIntersectY(a, b);
    const doObjectsIntersectX = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x;
    const doObjectsIntersectY = (a, b) => a.y + a.height >= b.y && a.y <= b.y + b.height;
    const doObjectsIntersectYExclusive = (a, b) => a.y + a.height > b.y && a.y < b.y + b.height;
    const isAAboveB = (a, b) => a.y >= b.y + b.height && doObjectsIntersectX(a, b);

    /* src\components\GameOver.svelte generated by Svelte v3.24.1 */

    const file$u = "src\\components\\GameOver.svelte";

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
    		if (/*won*/ ctx[2]) return create_if_block_1$8;
    		return create_else_block$2;
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
    			add_location(h1, file$u, 7, 2, 228);
    			attr_dev(p, "class", "svelte-bg3cd6");
    			add_location(p, file$u, 8, 2, 261);
    			attr_dev(div, "class", "game-over svelte-bg3cd6");
    			toggle_class(div, "won", /*won*/ ctx[2]);
    			add_location(div, file$u, 1, 1, 15);
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
    function create_else_block$2(ctx) {
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
    			add_location(h1, file$u, 5, 3, 155);
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(5:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#if won}
    function create_if_block_1$8(ctx) {
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
    			add_location(h1, file$u, 3, 3, 66);
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
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(3:2) {#if won}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
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
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { score: 0, player: 1, won: 2, level: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameOver",
    			options,
    			id: create_fragment$x.name
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

    const file$v = "src\\components\\Instructions.svelte";

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
    			add_location(td0, file$v, 4, 4, 79);
    			attr_dev(td1, "class", "svelte-1d0wu93");
    			add_location(td1, file$v, 5, 4, 104);
    			add_location(tr, file$v, 3, 3, 69);
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

    function create_fragment$y(ctx) {
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
    			add_location(table, file$v, 1, 1, 29);
    			attr_dev(div, "class", "instructions svelte-1d0wu93");
    			add_location(div, file$v, 0, 0, 0);
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
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	const keyBinds = [
    		{
    			key: "Left + Right Arrow",
    			action: "Move"
    		},
    		{ key: "Space", action: "Jump" },
    		{ key: "R", action: "Spin Attack / Shield" },
    		{ key: "Q", action: "Heal" },
    		{ key: "Enter", action: "Restart" },
    		{ key: "P or Escape", action: "Pause" }
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
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Instructions",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    /* src\components\Paused.svelte generated by Svelte v3.24.1 */

    const file$w = "src\\components\\Paused.svelte";

    function create_fragment$z(ctx) {
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
    			add_location(h1, file$w, 1, 1, 23);
    			attr_dev(p, "class", "svelte-1fed8vp");
    			add_location(p, file$w, 2, 1, 41);
    			attr_dev(div, "class", "paused svelte-1fed8vp");
    			add_location(div, file$w, 0, 0, 0);
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
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props) {
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
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paused",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* src\components\Status.svelte generated by Svelte v3.24.1 */

    const file$x = "src\\components\\Status.svelte";

    function create_fragment$A(ctx) {
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
    			add_location(p0, file$x, 1, 1, 8);
    			attr_dev(p1, "class", "svelte-1ivfn85");
    			add_location(p1, file$x, 2, 1, 37);
    			attr_dev(p2, "class", "svelte-1ivfn85");
    			add_location(p2, file$x, 3, 1, 61);
    			attr_dev(div, "class", "svelte-1ivfn85");
    			add_location(div, file$x, 0, 0, 0);
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
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { level: 0, score: 1, enemyCount: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Status",
    			options,
    			id: create_fragment$A.name
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

    /* src\components\Viewport.svelte generated by Svelte v3.24.1 */

    const file$y = "src\\components\\Viewport.svelte";

    function create_fragment$B(ctx) {
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
    			add_location(div0, file$y, 1, 1, 96);
    			attr_dev(div1, "class", "viewport svelte-cjx02");
    			set_style(div1, "width", /*width*/ ctx[2] + "px");
    			set_style(div1, "height", /*height*/ ctx[3] + "px");
    			set_style(div1, "background", /*background*/ ctx[4]);
    			add_location(div1, file$y, 0, 0, 0);
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
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {
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
    			id: create_fragment$B.name
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

    /* src\components\Game.svelte generated by Svelte v3.24.1 */

    const { console: console_1$4, window: window_1 } = globals;
    const file$z = "src\\components\\Game.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    // (4:1) {#if level != null && player != null}
    function create_if_block$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let viewport_1;
    	let current;
    	const if_block_creators = [create_if_block_1$9, create_if_block_2$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*gameOver*/ ctx[9]) return 0;
    		if (/*paused*/ ctx[11]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const viewport_1_spread_levels = [/*viewport*/ ctx[12], { background: /*level*/ ctx[0].background }];

    	let viewport_1_props = {
    		$$slots: { default: [create_default_slot$c] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < viewport_1_spread_levels.length; i += 1) {
    		viewport_1_props = assign(viewport_1_props, viewport_1_spread_levels[i]);
    	}

    	viewport_1 = new Viewport({ props: viewport_1_props, $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(viewport_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(viewport_1, target, anchor);
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

    			const viewport_1_changes = (dirty[0] & /*viewport, level*/ 4097)
    			? get_spread_update(viewport_1_spread_levels, [
    					dirty[0] & /*viewport*/ 4096 && get_spread_object(/*viewport*/ ctx[12]),
    					dirty[0] & /*level*/ 1 && { background: /*level*/ ctx[0].background }
    				])
    			: {};

    			if (dirty[0] & /*player, frame, enemies, blocks, levelWidth, levelHeight*/ 462 | dirty[1] & /*$$scope*/ 1) {
    				viewport_1_changes.$$scope = { dirty, ctx };
    			}

    			viewport_1.$set(viewport_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(viewport_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(viewport_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t);
    			destroy_component(viewport_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(4:1) {#if level != null && player != null}",
    		ctx
    	});

    	return block;
    }

    // (7:19) 
    function create_if_block_2$4(ctx) {
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
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(7:19) ",
    		ctx
    	});

    	return block;
    }

    // (5:2) {#if gameOver}
    function create_if_block_1$9(ctx) {
    	let gameover;
    	let current;

    	gameover = new GameOver({
    			props: {
    				score: /*score*/ ctx[4],
    				player: /*player*/ ctx[6],
    				won: /*gameWon*/ ctx[10],
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
    			if (dirty[0] & /*score*/ 16) gameover_changes.score = /*score*/ ctx[4];
    			if (dirty[0] & /*player*/ 64) gameover_changes.player = /*player*/ ctx[6];
    			if (dirty[0] & /*gameWon*/ 1024) gameover_changes.won = /*gameWon*/ ctx[10];
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
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(5:2) {#if gameOver}",
    		ctx
    	});

    	return block;
    }

    // (12:3) {#each enemies as enemy}
    function create_each_block$8(ctx) {
    	let livingsprite;
    	let current;
    	const livingsprite_spread_levels = [/*enemy*/ ctx[28], { frame: /*frame*/ ctx[8] }];
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
    			const livingsprite_changes = (dirty[0] & /*enemies, frame*/ 384)
    			? get_spread_update(livingsprite_spread_levels, [
    					dirty[0] & /*enemies*/ 128 && get_spread_object(/*enemy*/ ctx[28]),
    					dirty[0] & /*frame*/ 256 && { frame: /*frame*/ ctx[8] }
    				])
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
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(12:3) {#each enemies as enemy}",
    		ctx
    	});

    	return block;
    }

    // (10:2) <Viewport {...viewport} background={level.background}>
    function create_default_slot$c(ctx) {
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
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const livingsprite_spread_levels = [/*player*/ ctx[6], { frame: /*frame*/ ctx[8] }];
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

    			if (dirty[0] & /*enemies, frame*/ 384) {
    				each_value = /*enemies*/ ctx[7];
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
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const livingsprite_changes = (dirty[0] & /*player, frame*/ 320)
    			? get_spread_update(livingsprite_spread_levels, [
    					dirty[0] & /*player*/ 64 && get_spread_object(/*player*/ ctx[6]),
    					dirty[0] & /*frame*/ 256 && { frame: /*frame*/ ctx[8] }
    				])
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
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(10:2) <Viewport {...viewport} background={level.background}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let div;
    	let t0;
    	let status;
    	let t1;
    	let instructions;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*level*/ ctx[0] != null && /*player*/ ctx[6] != null && create_if_block$i(ctx);

    	status = new Status({
    			props: {
    				level: /*level*/ ctx[0],
    				score: /*score*/ ctx[4],
    				enemyCount: (/*enemies*/ ctx[7] || []).filter(func).length
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
    			attr_dev(div, "class", "game-window svelte-1ihy09s");
    			add_location(div, file$z, 2, 0, 63);
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
    			/*div_binding*/ ctx[16](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*onKeyDown*/ ctx[13], false, false, false),
    					listen_dev(window_1, "keyup", /*onKeyUp*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*level*/ ctx[0] != null && /*player*/ ctx[6] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*level, player*/ 65) {
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
    			if (dirty[0] & /*score*/ 16) status_changes.score = /*score*/ ctx[4];
    			if (dirty[0] & /*enemies*/ 128) status_changes.enemyCount = (/*enemies*/ ctx[7] || []).filter(func).length;
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
    			/*div_binding*/ ctx[16](null);
    			mounted = false;
    			run_all(dispose);
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

    const artScale$3 = 2;
    const startOfLevel = 0;
    const blockSize$1 = 40;
    const leashRange = 400;

    function createEnemy(template, config, width, height) {
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
    			if (!me.grounded) return;

    			// is player in leash range?
    			if (Math.abs(player.x - me.x) < leashRange) {
    				// move toward them
    				// x axis
    				if (Math.abs(player.x - me.x) < 2) me.vx = 0; else if (player.x < me.x) me.vx = -me.tvx; else me.vx = me.tvx;

    				// y axis
    				if (player.y > me.y + me.height) {
    					me.vy = me.jumpVelocity;
    					me.y += 1;
    				}
    			} else {
    				// stop moving
    				me.vx = 0;
    			}
    		}
    	};
    }

    const func = e => e.alive;

    function instance$C($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(23, $project = $$value));
    	let { level = null } = $$props;
    	let { character = null } = $$props;
    	let endOfLevel;
    	let blocks;
    	let effectBlocks;
    	let levelWidth = 0;
    	let levelHeight = 0;
    	let score = 0;
    	let mainEl;
    	let player;
    	let enemies;
    	let frame = 0;
    	let gameOver = false;
    	let gameWon = false;
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
    			solid: $project.blocks[b.name].solid,
    			png: $project.art[$project.blocks[b.name].graphic].png,
    			dps: $project.blocks[b.name].dps,
    			throwOnTouch: $project.blocks[b.name].throwOnTouch
    		})));

    		endOfLevel = Math.max(...blocks.map(b => b.x + b.width));
    		effectBlocks = blocks.filter(b => b.dps > 0 || b.throwOnTouch);
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
    			width: $project.art[character.graphicStill].width * artScale$3, // width of graphic
    			height: $project.art[character.graphicStill].height * artScale$3, // height of graphic
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
    			const template = $project.enemies[e.name];
    			const w = $project.art[template.graphicStill].width * artScale$3; // width of graphic
    			const h = $project.art[template.graphicStill].height * artScale$3; // height of graphic
    			return createEnemy(template, e, w, h);
    		}));

    		$$invalidate(9, gameOver = false);
    		$$invalidate(11, paused = false);

    		// only start game loop if it's not already going
    		if (lastRequestedFrame == null) gameLoop();
    	}

    	function gameLoop() {
    		if (!gameOver && !paused) {
    			$$invalidate(8, frame++, frame);
    			if (frame > 1000) $$invalidate(8, frame = 0);

    			// visibleBlocks = blocks.filter(b => doObjectsIntersect(viewport, b))
    			$$invalidate(6, player = applyWorldToSprite(player, true));

    			// handle movement / attack abilities
    			player.tick();

    			const halfViewportWidth = viewport.width / 2;
    			const halfViewportHeight = viewport.height / 2;

    			$$invalidate(
    				12,
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
    				12,
    				viewport.y = // player is near bottom of screen
    				player.y < halfViewportHeight
    				? // viewport all the way to bottom
    					0
    				: // player above half viewport height, center on player
    					player.y - halfViewportHeight,
    				viewport
    			);

    			// for every live enemy intersecting the player, one or the other should take damage
    			// only update enemies within leash range
    			const screenRange = viewport.width / 2;

    			enemies.filter(e => Math.abs(e.x - player.x) < screenRange).map(e => {
    				if (e.alive) {
    					e = applyWorldToSprite(e);
    					e.tick(e, player);

    					if (doObjectsIntersect(player, e)) {
    						if (player.spinning) {
    							e.health -= player.dps / 60; // damage per frame
    						} else {
    							$$invalidate(6, player.health -= e.dps / 60, player); // damage per frame
    						}
    					}

    					if (e.health <= 0) {
    						e.alive = false;
    						e.vx = 0;
    						$$invalidate(4, score += e.score);
    					}
    				}
    			});

    			$$invalidate(7, enemies);

    			// game is over if player dies
    			if (player.health <= 0) {
    				$$invalidate(10, gameWon = false);
    				$$invalidate(9, gameOver = true);
    			} else // game is won if no enemies left
    			if (!enemies.some(e => e.alive)) {
    				$$invalidate(10, gameWon = true);
    				$$invalidate(9, gameOver = true);
    			}
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
    		effectBlocks.filter(b => doObjectsIntersect(sprite, b)).forEach(b => {
    			// if block does damage, reduce health
    			if (b.dps > 0) sprite.health -= b.dps / 60; // damage per frame

    			// does the block also throw?
    			if (b.throwOnTouch) sprite.vy = 20;
    		});

    		return sprite;
    	}

    	function onKeyDown(e) {
    		if (gameOver) return;
    		if (paused) return;

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
    				if (player.canSpin) $$invalidate(6, player.spinning = true, player);
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
    				if (paused) $$invalidate(11, paused = false);
    				break;
    			case "KeyR":
    				if (player.canSpin) $$invalidate(6, player.spinning = false, player);
    				break;
    			case "Enter":
    			case "NumpadEnter":
    				start();
    				break;
    			case "KeyP":
    			case "Escape":
    				$$invalidate(11, paused = !paused);
    				break;
    			default:
    				console.log(e.code);
    		}
    	}

    	const writable_props = ["level", "character"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<Game> was created with unknown prop '${key}'`);
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
    		if ("character" in $$props) $$invalidate(15, character = $$props.character);
    	};

    	$$self.$capture_state = () => ({
    		doObjectsIntersect,
    		isAAboveB,
    		doObjectsIntersectY,
    		doObjectsIntersectYExclusive,
    		onMount,
    		onDestroy,
    		GameOver,
    		HealthBar,
    		Instructions,
    		Level,
    		LivingSprite,
    		Paused,
    		project,
    		Status,
    		Viewport,
    		level,
    		character,
    		artScale: artScale$3,
    		startOfLevel,
    		blockSize: blockSize$1,
    		leashRange,
    		endOfLevel,
    		blocks,
    		effectBlocks,
    		levelWidth,
    		levelHeight,
    		score,
    		mainEl,
    		player,
    		enemies,
    		frame,
    		gameOver,
    		gameWon,
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
    		createEnemy,
    		onKeyDown,
    		onKeyUp,
    		$project
    	});

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("character" in $$props) $$invalidate(15, character = $$props.character);
    		if ("endOfLevel" in $$props) endOfLevel = $$props.endOfLevel;
    		if ("blocks" in $$props) $$invalidate(1, blocks = $$props.blocks);
    		if ("effectBlocks" in $$props) effectBlocks = $$props.effectBlocks;
    		if ("levelWidth" in $$props) $$invalidate(2, levelWidth = $$props.levelWidth);
    		if ("levelHeight" in $$props) $$invalidate(3, levelHeight = $$props.levelHeight);
    		if ("score" in $$props) $$invalidate(4, score = $$props.score);
    		if ("mainEl" in $$props) $$invalidate(5, mainEl = $$props.mainEl);
    		if ("player" in $$props) $$invalidate(6, player = $$props.player);
    		if ("enemies" in $$props) $$invalidate(7, enemies = $$props.enemies);
    		if ("frame" in $$props) $$invalidate(8, frame = $$props.frame);
    		if ("gameOver" in $$props) $$invalidate(9, gameOver = $$props.gameOver);
    		if ("gameWon" in $$props) $$invalidate(10, gameWon = $$props.gameWon);
    		if ("paused" in $$props) $$invalidate(11, paused = $$props.paused);
    		if ("gameAlive" in $$props) gameAlive = $$props.gameAlive;
    		if ("lastRequestedFrame" in $$props) lastRequestedFrame = $$props.lastRequestedFrame;
    		if ("visibleBlocks" in $$props) visibleBlocks = $$props.visibleBlocks;
    		if ("viewport" in $$props) $$invalidate(12, viewport = $$props.viewport);
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
    		frame,
    		gameOver,
    		gameWon,
    		paused,
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
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, { level: 0, character: 15 }, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$C.name
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
    const file$A = "src\\pages\\Play\\Index.svelte";

    function get_each_context_1$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (9:0) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let current;
    	let each_value = /*sortedLevelNames*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
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
    			add_location(div, file$A, 9, 1, 547);
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
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
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
    		id: create_else_block$3.name,
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
    	let game;
    	let current;
    	let mounted;
    	let dispose;

    	game = new Game({
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
    			create_component(game.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-info");
    			add_location(button, file$A, 2, 2, 48);
    			attr_dev(a0, "href", a0_href_value = "#/" + /*$project*/ ctx[1].name + "/build/levels/" + encodeURIComponent(/*levelName*/ ctx[2]));
    			attr_dev(a0, "class", "btn btn-light");
    			attr_dev(a0, "role", "button");
    			add_location(a0, file$A, 3, 2, 157);
    			attr_dev(a1, "href", a1_href_value = "#/" + /*$project*/ ctx[1].name + "/build/characters/" + encodeURIComponent(/*characterName*/ ctx[3]));
    			attr_dev(a1, "class", "btn btn-light");
    			attr_dev(a1, "role", "button");
    			add_location(a1, file$A, 4, 2, 290);
    			attr_dev(div, "class", "mb-2");
    			add_location(div, file$A, 1, 1, 26);
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

    			const game_changes = {};
    			if (dirty & /*$project, levelName*/ 6) game_changes.level = /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]];
    			if (dirty & /*$project, characterName*/ 10) game_changes.character = /*$project*/ ctx[1].characters[/*characterName*/ ctx[3]];
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
    				name: /*$project*/ ctx[1].characters[/*characterName*/ ctx[3]].graphicStill
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
    			add_location(button, file$A, 16, 6, 934);
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
    			if (dirty & /*$project, sortedLevelNames*/ 3) art_changes.name = /*$project*/ ctx[1].characters[/*characterName*/ ctx[3]].graphicStill;
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
    function create_each_block$9(ctx) {
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
    			add_location(h4, file$A, 12, 4, 652);
    			if (img.src !== (img_src_value = /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]].thumbnail)) attr_dev(img, "src", img_src_value);
    			set_style(img, "background", /*$project*/ ctx[1].levels[/*levelName*/ ctx[2]].background);
    			attr_dev(img, "alt", "level preview");
    			add_location(img, file$A, 13, 4, 691);
    			attr_dev(div0, "class", "flex-row");
    			add_location(div0, file$A, 14, 4, 827);
    			attr_dev(div1, "class", "list-group-item");
    			add_location(div1, file$A, 11, 3, 617);
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
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(11:2) {#each sortedLevelNames as levelName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$j, create_else_block$3];
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
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let $project;
    	validate_store(project, "project");
    	component_subscribe($$self, project, $$value => $$invalidate(1, $project = $$value));
    	let levelName;
    	let characterName;

    	function selectLevel(l, c) {
    		$$invalidate(2, levelName = l);
    		$$invalidate(3, characterName = c);
    	}

    	const writable_props = [];

    	Object_1$6.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);
    	const click_handler = () => $$invalidate(2, levelName = null);
    	const click_handler_1 = (levelName, characterName) => selectLevel(levelName, characterName);

    	$$self.$capture_state = () => ({
    		Art,
    		Game,
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
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src\pages\Project.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$7 } = globals;

    const file$B = "src\\pages\\Project.svelte";

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
    	let if_block0 = show_if && create_if_block_2$5(ctx);

    	icon0 = new Icon({
    			props: { data: editIcon },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { data: deleteIcon },
    			$$inline: true
    		});

    	let if_block1 = /*prefix*/ ctx[1] != null && create_if_block_1$a(ctx);

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
    			add_location(a0, file$B, 12, 3, 309);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$B, 11, 2, 283);
    			attr_dev(a1, "class", "nav-link text-danger");
    			attr_dev(a1, "href", "#/");
    			add_location(a1, file$B, 19, 3, 487);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$B, 18, 2, 461);
    			attr_dev(ul, "class", "nav my-1");
    			add_location(ul, file$B, 1, 1, 25);
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
    					if_block0 = create_if_block_2$5(ctx);
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
    					if_block1 = create_if_block_1$a(ctx);
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
    function create_if_block_2$5(ctx) {
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
    			add_location(a, file$B, 4, 4, 127);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$B, 3, 3, 100);
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
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(3:2) {#if Object.keys($project.levels).length > 0}",
    		ctx
    	});

    	return block;
    }

    // (27:1) {#if prefix != null}
    function create_if_block_1$a(ctx) {
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
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(27:1) {#if prefix != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$E(ctx) {
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
    		id: create_fragment$E.name,
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

    function instance$E($$self, $$props, $$invalidate) {
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
    		if (!confirm(`Are you SURE you want to delete ${name}?`)) return;

    		// $project = null
    		set_store_value(projects, $projects = $projects.filter(p => p.name != name));

    		$$invalidate(4, params.projectName = null, params); // or it'll just autocreate it from reactive statement above
    		push(`/`);
    	}

    	const writable_props = ["params"];

    	Object_1$7.keys($$props).forEach(key => {
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
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, { params: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$E.name
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
    const file$C = "src\\App.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (2:1) {#each $projects as p}
    function create_each_block$a(ctx) {
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
    			add_location(a, file$C, 3, 3, 81);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$C, 2, 2, 55);
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
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(2:1) {#each $projects as p}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$F(ctx) {
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
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
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
    			add_location(a, file$C, 7, 2, 247);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$C, 6, 1, 222);
    			attr_dev(ul, "class", "nav nav-pills");
    			add_location(ul, file$C, 0, 0, 0);
    			add_location(main, file$C, 14, 0, 397);
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
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
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
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$F.name
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
