
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
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

    /* src\pages\BubTheBobcat\LevelBuilder.svelte generated by Svelte v3.24.1 */

    function create_fragment$1(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    function instance$1($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelBuilder", $$slots, []);
    	return [];
    }

    class LevelBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilder",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\pages\BubTheBobcat\Status.svelte generated by Svelte v3.24.1 */

    const file = "src\\pages\\BubTheBobcat\\Status.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let p0;
    	let t0;
    	let t1;
    	let t2;
    	let p1;
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text("Wave: ");
    			t1 = text(/*wave*/ ctx[0]);
    			t2 = space();
    			p1 = element("p");
    			t3 = text("Score: ");
    			t4 = text(/*score*/ ctx[1]);
    			attr_dev(p0, "class", "svelte-18s0d67");
    			add_location(p0, file, 1, 1, 8);
    			attr_dev(p1, "class", "svelte-18s0d67");
    			add_location(p1, file, 2, 1, 30);
    			attr_dev(div, "class", "svelte-18s0d67");
    			add_location(div, file, 0, 0, 0);
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
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*wave*/ 1) set_data_dev(t1, /*wave*/ ctx[0]);
    			if (dirty & /*score*/ 2) set_data_dev(t4, /*score*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let { wave = 0 } = $$props;
    	let { score = 0 } = $$props;
    	const writable_props = ["wave", "score"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Status> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Status", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("wave" in $$props) $$invalidate(0, wave = $$props.wave);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    	};

    	$$self.$capture_state = () => ({ wave, score });

    	$$self.$inject_state = $$props => {
    		if ("wave" in $$props) $$invalidate(0, wave = $$props.wave);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [wave, score];
    }

    class Status extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { wave: 0, score: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Status",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get wave() {
    		throw new Error("<Status>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wave(value) {
    		throw new Error("<Status>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get score() {
    		throw new Error("<Status>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set score(value) {
    		throw new Error("<Status>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // object x, y coords are always bottom left... add width or height to get other sides
    const doObjectsIntersect = (a, b) => doObjectsIntersectX(a, b) && doObjectsIntersectY(a, b);
    const doObjectsIntersectX = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x;
    const doObjectsIntersectY = (a, b) => a.y + a.height > b.y && a.y < b.y + b.height;
    const isAAboveB = (a, b) => a.y >= b.y + b.height && doObjectsIntersectX(a, b);

    // x|    |x+width
    //    x|     |x+width

    /* src\pages\BubTheBobcat\Block.svelte generated by Svelte v3.24.1 */

    const file$1 = "src\\pages\\BubTheBobcat\\Block.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "block svelte-1f5t6il");
    			set_style(div, "height", /*height*/ ctx[3] + "px");
    			set_style(div, "width", /*width*/ ctx[2] + "px");
    			set_style(div, "bottom", /*y*/ ctx[0] + "px");
    			set_style(div, "left", /*x*/ ctx[1] + "px");
    			set_style(div, "background-color", /*color*/ ctx[5]);
    			toggle_class(div, "interactive", /*interactive*/ ctx[4]);
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*height*/ 8) {
    				set_style(div, "height", /*height*/ ctx[3] + "px");
    			}

    			if (dirty & /*width*/ 4) {
    				set_style(div, "width", /*width*/ ctx[2] + "px");
    			}

    			if (dirty & /*y*/ 1) {
    				set_style(div, "bottom", /*y*/ ctx[0] + "px");
    			}

    			if (dirty & /*x*/ 2) {
    				set_style(div, "left", /*x*/ ctx[1] + "px");
    			}

    			if (dirty & /*color*/ 32) {
    				set_style(div, "background-color", /*color*/ ctx[5]);
    			}

    			if (dirty & /*interactive*/ 16) {
    				toggle_class(div, "interactive", /*interactive*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let { y = 0 } = $$props;
    	let { x = 0 } = $$props;
    	let { width = 0 } = $$props;
    	let { height = 0 } = $$props;
    	let { interactive = true } = $$props;
    	let { color = "rgb(8,95,8)" } = $$props;
    	const writable_props = ["y", "x", "width", "height", "interactive", "color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Block> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Block", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("y" in $$props) $$invalidate(0, y = $$props.y);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("interactive" in $$props) $$invalidate(4, interactive = $$props.interactive);
    		if ("color" in $$props) $$invalidate(5, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ y, x, width, height, interactive, color });

    	$$self.$inject_state = $$props => {
    		if ("y" in $$props) $$invalidate(0, y = $$props.y);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("interactive" in $$props) $$invalidate(4, interactive = $$props.interactive);
    		if ("color" in $$props) $$invalidate(5, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [y, x, width, height, interactive, color];
    }

    class Block extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			y: 0,
    			x: 1,
    			width: 2,
    			height: 3,
    			interactive: 4,
    			color: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Block",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get y() {
    		throw new Error("<Block>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Block>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Block>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Block>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Block>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Block>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Block>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Block>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get interactive() {
    		throw new Error("<Block>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interactive(value) {
    		throw new Error("<Block>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Block>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Block>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\BubTheBobcat\Level.svelte generated by Svelte v3.24.1 */
    const file$2 = "src\\pages\\BubTheBobcat\\Level.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (2:1) {#each blocks as b}
    function create_each_block(ctx) {
    	let block;
    	let current;
    	const block_spread_levels = [/*b*/ ctx[5]];
    	let block_props = {};

    	for (let i = 0; i < block_spread_levels.length; i += 1) {
    		block_props = assign(block_props, block_spread_levels[i]);
    	}

    	block = new Block({ props: block_props, $$inline: true });

    	const block_1 = {
    		c: function create() {
    			create_component(block.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(block, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const block_changes = (dirty & /*blocks*/ 1)
    			? get_spread_update(block_spread_levels, [get_spread_object(/*b*/ ctx[5])])
    			: {};

    			block.$set(block_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(block.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(block.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(block, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block.name,
    		type: "each",
    		source: "(2:1) {#each blocks as b}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let t;
    	let current;
    	let each_value = /*blocks*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (default_slot) default_slot.c();
    			set_style(div, "position", "absolute");
    			set_style(div, "left", -/*x*/ ctx[1] + "px");
    			set_style(div, "bottom", -/*y*/ ctx[2]);
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*blocks*/ 1) {
    				each_value = /*blocks*/ ctx[0];
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
    						each_blocks[i].m(div, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*x*/ 2) {
    				set_style(div, "left", -/*x*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*y*/ 4) {
    				set_style(div, "bottom", -/*y*/ ctx[2]);
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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	let { blocks = [] } = $$props;
    	let { x = 0 } = $$props;
    	let { y = 0 } = $$props;
    	const writable_props = ["blocks", "x", "y"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Level> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Level", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("blocks" in $$props) $$invalidate(0, blocks = $$props.blocks);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ doObjectsIntersect, Block, blocks, x, y });

    	$$self.$inject_state = $$props => {
    		if ("blocks" in $$props) $$invalidate(0, blocks = $$props.blocks);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [blocks, x, y, $$scope, $$slots];
    }

    class Level extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { blocks: 0, x: 1, y: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get blocks() {
    		throw new Error("<Level>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blocks(value) {
    		throw new Error("<Level>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Level>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Level>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Level>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Level>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\BubTheBobcat\Instructions.svelte generated by Svelte v3.24.1 */

    const file$3 = "src\\pages\\BubTheBobcat\\Instructions.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (3:2) {#each keyBinds as bind}
    function create_each_block$1(ctx) {
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
    			attr_dev(td0, "class", "svelte-nlpb5m");
    			add_location(td0, file$3, 4, 4, 79);
    			attr_dev(td1, "class", "svelte-nlpb5m");
    			add_location(td1, file$3, 5, 4, 104);
    			add_location(tr, file$3, 3, 3, 69);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(3:2) {#each keyBinds as bind}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let table;
    	let each_value = /*keyBinds*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(table, "class", "svelte-nlpb5m");
    			add_location(table, file$3, 1, 1, 29);
    			attr_dev(div, "class", "instructions svelte-nlpb5m");
    			add_location(div, file$3, 0, 0, 0);
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const keyBinds = [
    		{
    			key: "Left + Right Arrow",
    			action: "Move"
    		},
    		{ key: "Space", action: "Jump" },
    		{ key: "R", action: "Spin Attack / Shield" },
    		{ key: "Q", action: "Heal" },
    		{ key: "Enter", action: "Restart" }
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Instructions",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\BubTheBobcat\Viewport.svelte generated by Svelte v3.24.1 */

    const file$4 = "src\\pages\\BubTheBobcat\\Viewport.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "viewport svelte-12xagbh");
    			set_style(div, "width", /*width*/ ctx[0] + "px");
    			set_style(div, "height", /*height*/ ctx[1] + "px");
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0] + "px");
    			}

    			if (!current || dirty & /*height*/ 2) {
    				set_style(div, "height", /*height*/ ctx[1] + "px");
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
    	let { width = 0 } = $$props;
    	let { height = 0 } = $$props;
    	const writable_props = ["width", "height"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Viewport> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Viewport", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ width, height });

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, $$scope, $$slots];
    }

    class Viewport extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { width: 0, height: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Viewport",
    			options,
    			id: create_fragment$6.name
    		});
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
    }

    /* src\pages\BubTheBobcat\HealthBar.svelte generated by Svelte v3.24.1 */

    const file$5 = "src\\pages\\BubTheBobcat\\HealthBar.svelte";

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;

    	let t3_value = (/*displayPercent*/ ctx[1] > 0
    	? `${/*displayPercent*/ ctx[1]}%`
    	: "I am dead.") + "";

    	let t3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(/*displayHealth*/ ctx[0]);
    			t2 = text(" - ");
    			t3 = text(t3_value);
    			attr_dev(div0, "class", "filled svelte-nlzclx");
    			set_style(div0, "width", /*displayPercent*/ ctx[1] + "%");
    			set_style(div0, "background-color", /*color*/ ctx[2]);
    			add_location(div0, file$5, 3, 1, 72);
    			attr_dev(div1, "class", "text svelte-nlzclx");
    			add_location(div1, file$5, 4, 1, 157);
    			attr_dev(div2, "class", "health-bar svelte-nlzclx");
    			add_location(div2, file$5, 2, 0, 45);
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
    			if (dirty & /*displayPercent*/ 2) {
    				set_style(div0, "width", /*displayPercent*/ ctx[1] + "%");
    			}

    			if (dirty & /*color*/ 4) {
    				set_style(div0, "background-color", /*color*/ ctx[2]);
    			}

    			if (dirty & /*displayHealth*/ 1) set_data_dev(t1, /*displayHealth*/ ctx[0]);

    			if (dirty & /*displayPercent*/ 2 && t3_value !== (t3_value = (/*displayPercent*/ ctx[1] > 0
    			? `${/*displayPercent*/ ctx[1]}%`
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		if ("percent" in $$props) $$invalidate(3, percent = $$props.percent);
    		if ("health" in $$props) $$invalidate(4, health = $$props.health);
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
    		if ("percent" in $$props) $$invalidate(3, percent = $$props.percent);
    		if ("health" in $$props) $$invalidate(4, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(5, maxHealth = $$props.maxHealth);
    		if ("displayHealth" in $$props) $$invalidate(0, displayHealth = $$props.displayHealth);
    		if ("displayPercent" in $$props) $$invalidate(1, displayPercent = $$props.displayPercent);
    		if ("color" in $$props) $$invalidate(2, color = $$props.color);
    	};

    	let displayHealth;
    	let displayPercent;
    	let color;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*health*/ 16) {
    			 $$invalidate(0, displayHealth = health > 0 ? Math.round(health) : 0);
    		}

    		if ($$self.$$.dirty & /*health, maxHealth*/ 48) {
    			 $$invalidate(3, percent = Math.round(health / maxHealth * 100, 2));
    		}

    		if ($$self.$$.dirty & /*percent*/ 8) {
    			 $$invalidate(1, displayPercent = percent > 0 ? percent : 0);
    		}

    		if ($$self.$$.dirty & /*percent*/ 8) {
    			 $$invalidate(2, color = percent > 75
    			? "rgba(24, 197, 33, 0.5)"
    			: percent > 25
    				? "rgba(245, 189, 36, 0.5)"
    				: "rgba(223, 22, 22, 0.5)");
    		}
    	};

    	return [displayHealth, displayPercent, color, percent, health, maxHealth];
    }

    class HealthBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { percent: 3, health: 4, maxHealth: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HealthBar",
    			options,
    			id: create_fragment$7.name
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

    /* src\pages\BubTheBobcat\Player.svelte generated by Svelte v3.24.1 */
    const file$6 = "src\\pages\\BubTheBobcat\\Player.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let healthbar;
    	let t;
    	let img;
    	let img_src_value;
    	let current;

    	healthbar = new HealthBar({
    			props: {
    				health: /*health*/ ctx[4],
    				maxHealth: /*maxHealth*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(healthbar.$$.fragment);
    			t = space();
    			img = element("img");
    			attr_dev(img, "class", "graphic svelte-8td79i");
    			if (img.src !== (img_src_value = "https://i.imgur.com/g1jV9bN.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Bub");
    			set_style(img, "width", /*width*/ ctx[2] + "px");
    			set_style(img, "height", /*height*/ ctx[3] + "px");
    			set_style(img, "transform", "scaleX(" + /*scaleX*/ ctx[6] + ") rotate(" + /*rotate*/ ctx[7] + "deg)");
    			add_location(img, file$6, 2, 1, 100);
    			attr_dev(div, "class", "player svelte-8td79i");
    			set_style(div, "left", /*x*/ ctx[1] + "px");
    			set_style(div, "bottom", /*y*/ ctx[0] - 5 + "px");
    			add_location(div, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(healthbar, div, null);
    			append_dev(div, t);
    			append_dev(div, img);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const healthbar_changes = {};
    			if (dirty & /*health*/ 16) healthbar_changes.health = /*health*/ ctx[4];
    			if (dirty & /*maxHealth*/ 32) healthbar_changes.maxHealth = /*maxHealth*/ ctx[5];
    			healthbar.$set(healthbar_changes);

    			if (!current || dirty & /*width*/ 4) {
    				set_style(img, "width", /*width*/ ctx[2] + "px");
    			}

    			if (!current || dirty & /*height*/ 8) {
    				set_style(img, "height", /*height*/ ctx[3] + "px");
    			}

    			if (!current || dirty & /*scaleX, rotate*/ 192) {
    				set_style(img, "transform", "scaleX(" + /*scaleX*/ ctx[6] + ") rotate(" + /*rotate*/ ctx[7] + "deg)");
    			}

    			if (!current || dirty & /*x*/ 2) {
    				set_style(div, "left", /*x*/ ctx[1] + "px");
    			}

    			if (!current || dirty & /*y*/ 1) {
    				set_style(div, "bottom", /*y*/ ctx[0] - 5 + "px");
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
    	let { momentum = { x: 0, y: 0 } } = $$props;
    	let { y = 0 } = $$props;
    	let { x = 0 } = $$props;
    	let { width = 150 } = $$props;
    	let { height = 100 } = $$props;
    	let { direction = 1 } = $$props;
    	let { health = 100 } = $$props;
    	let { maxHealth = 100 } = $$props;
    	let { spinning = false } = $$props;
    	let spinningRotation = 0;
    	let spinTimeout = null;

    	const writable_props = [
    		"momentum",
    		"y",
    		"x",
    		"width",
    		"height",
    		"direction",
    		"health",
    		"maxHealth",
    		"spinning"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Player", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("momentum" in $$props) $$invalidate(8, momentum = $$props.momentum);
    		if ("y" in $$props) $$invalidate(0, y = $$props.y);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("direction" in $$props) $$invalidate(9, direction = $$props.direction);
    		if ("health" in $$props) $$invalidate(4, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(5, maxHealth = $$props.maxHealth);
    		if ("spinning" in $$props) $$invalidate(10, spinning = $$props.spinning);
    	};

    	$$self.$capture_state = () => ({
    		HealthBar,
    		momentum,
    		y,
    		x,
    		width,
    		height,
    		direction,
    		health,
    		maxHealth,
    		spinning,
    		spinningRotation,
    		spinTimeout,
    		scaleX,
    		rotate
    	});

    	$$self.$inject_state = $$props => {
    		if ("momentum" in $$props) $$invalidate(8, momentum = $$props.momentum);
    		if ("y" in $$props) $$invalidate(0, y = $$props.y);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("direction" in $$props) $$invalidate(9, direction = $$props.direction);
    		if ("health" in $$props) $$invalidate(4, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(5, maxHealth = $$props.maxHealth);
    		if ("spinning" in $$props) $$invalidate(10, spinning = $$props.spinning);
    		if ("spinningRotation" in $$props) $$invalidate(11, spinningRotation = $$props.spinningRotation);
    		if ("spinTimeout" in $$props) $$invalidate(12, spinTimeout = $$props.spinTimeout);
    		if ("scaleX" in $$props) $$invalidate(6, scaleX = $$props.scaleX);
    		if ("rotate" in $$props) $$invalidate(7, rotate = $$props.rotate);
    	};

    	let scaleX;
    	let rotate;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*direction*/ 512) {
    			 $$invalidate(6, scaleX = direction);
    		}

    		if ($$self.$$.dirty & /*spinning, spinningRotation, spinTimeout*/ 7168) {
    			 if (spinning) {
    				$$invalidate(12, spinTimeout = setTimeout(
    					() => {
    						$$invalidate(11, spinningRotation += 30);
    					},
    					25
    				));
    			} else {
    				clearTimeout(spinTimeout);
    			}
    		}

    		if ($$self.$$.dirty & /*spinning, spinningRotation, momentum*/ 3328) {
    			 $$invalidate(7, rotate = spinning
    			? spinningRotation
    			: -1 * (5 + (momentum.y > 0 ? momentum.y * 3 : momentum.y * 1.5)));
    		}
    	};

    	return [
    		y,
    		x,
    		width,
    		height,
    		health,
    		maxHealth,
    		scaleX,
    		rotate,
    		momentum,
    		direction,
    		spinning
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			momentum: 8,
    			y: 0,
    			x: 1,
    			width: 2,
    			height: 3,
    			direction: 9,
    			health: 4,
    			maxHealth: 5,
    			spinning: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get momentum() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set momentum(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get health() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set health(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxHealth() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxHealth(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinning() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinning(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\BubTheBobcat\Enemy.svelte generated by Svelte v3.24.1 */
    const file$7 = "src\\pages\\BubTheBobcat\\Enemy.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let healthbar;
    	let t;
    	let svg;
    	let path0;
    	let path1_1;
    	let current;

    	healthbar = new HealthBar({
    			props: {
    				health: /*health*/ ctx[6],
    				maxHealth: /*maxHealth*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(healthbar.$$.fragment);
    			t = space();
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1_1 = svg_element("path");
    			attr_dev(path0, "d", /*path1*/ ctx[10]);
    			attr_dev(path0, "fill", /*bodyColor*/ ctx[8]);
    			add_location(path0, file$7, 10, 2, 436);
    			attr_dev(path1_1, "d", /*path2*/ ctx[11]);
    			attr_dev(path1_1, "fill", /*eyeColor*/ ctx[9]);
    			add_location(path1_1, file$7, 11, 2, 475);
    			attr_dev(svg, "class", "graphic svelte-1x7nj5j");
    			set_style(svg, "left", "15px");
    			set_style(svg, "width", /*width*/ ctx[3] + "px");
    			set_style(svg, "height", /*height*/ ctx[4] + "px");

    			set_style(svg, "transform", "scaleX(" + -1 * /*direction*/ ctx[5] + ") rotate(" + (-4 + (/*momentum*/ ctx[0].y > 0
    			? /*momentum*/ ctx[0].y * 3
    			: /*momentum*/ ctx[0].y * 1.5)) + "deg)");

    			set_style(svg, "opacity", /*health*/ ctx[6] <= 0 ? 0.2 : 1);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 10 1024 749");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xml:space", "preserve");
    			add_location(svg, file$7, 2, 1, 95);
    			attr_dev(div, "class", "enemy svelte-1x7nj5j");
    			set_style(div, "left", /*x*/ ctx[1] + "px");
    			set_style(div, "bottom", /*y*/ ctx[2] + "px");
    			add_location(div, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(healthbar, div, null);
    			append_dev(div, t);
    			append_dev(div, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1_1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const healthbar_changes = {};
    			if (dirty & /*health*/ 64) healthbar_changes.health = /*health*/ ctx[6];
    			if (dirty & /*maxHealth*/ 128) healthbar_changes.maxHealth = /*maxHealth*/ ctx[7];
    			healthbar.$set(healthbar_changes);

    			if (!current || dirty & /*bodyColor*/ 256) {
    				attr_dev(path0, "fill", /*bodyColor*/ ctx[8]);
    			}

    			if (!current || dirty & /*eyeColor*/ 512) {
    				attr_dev(path1_1, "fill", /*eyeColor*/ ctx[9]);
    			}

    			if (!current || dirty & /*width*/ 8) {
    				set_style(svg, "width", /*width*/ ctx[3] + "px");
    			}

    			if (!current || dirty & /*height*/ 16) {
    				set_style(svg, "height", /*height*/ ctx[4] + "px");
    			}

    			if (!current || dirty & /*direction, momentum*/ 33) {
    				set_style(svg, "transform", "scaleX(" + -1 * /*direction*/ ctx[5] + ") rotate(" + (-4 + (/*momentum*/ ctx[0].y > 0
    				? /*momentum*/ ctx[0].y * 3
    				: /*momentum*/ ctx[0].y * 1.5)) + "deg)");
    			}

    			if (!current || dirty & /*health*/ 64) {
    				set_style(svg, "opacity", /*health*/ ctx[6] <= 0 ? 0.2 : 1);
    			}

    			if (!current || dirty & /*x*/ 2) {
    				set_style(div, "left", /*x*/ ctx[1] + "px");
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
    	let { momentum = { x: 0, y: 0 } } = $$props;
    	let { x = 0 } = $$props;
    	let { y = 0 } = $$props;
    	let { width = 75 } = $$props;
    	let { height = 50 } = $$props;
    	let { isBoss = false } = $$props;
    	let { direction = 1 } = $$props;
    	let { health = 100 } = $$props;
    	let { maxHealth = 100 } = $$props;
    	let { gettingHit = false } = $$props;
    	const path1 = `M560,128H528a15.99954,15.99954,0,0,0-16,16v80H480V176a15.99954,15.99954,0,0,0-16-16H416V96h48a16.00079,16.00079,0,0,0,16-16V48a15.99954,15.99954,0,0,0-16-16H432a15.99954,15.99954,0,0,0-16,16V64H368a15.99954,15.99954,0,0,0-16,16v48H224V80a15.99954,15.99954,0,0,0-16-16H160V48a15.99954,15.99954,0,0,0-16-16H112A15.99954,15.99954,0,0,0,96,48V80a16.00079,16.00079,0,0,0,16,16h48v64H112a15.99954,15.99954,0,0,0-16,16v48H64V144a15.99954,15.99954,0,0,0-16-16H16A15.99954,15.99954,0,0,0,0,144V272a16.00079,16.00079,0,0,0,16,16H64v80a16.00079,16.00079,0,0,0,16,16h48v80a16.00079,16.00079,0,0,0,16,16h96a16.00079,16.00079,0,0,0,16-16V432a15.99954,15.99954,0,0,0-16-16H192V384H384v32H336a15.99954,15.99954,0,0,0-16,16v32a16.00079,16.00079,0,0,0,16,16h96a16.00079,16.00079,0,0,0,16-16V384h48a16.00079,16.00079,0,0,0,16-16V288h48a16.00079,16.00079,0,0,0,16-16V144A15.99954,15.99954,0,0,0,560,128ZM224,320H160V224h64Zm192,0H352V224h64Z`;
    	const path2 = `M160,320h64V224H160Zm192-96v96h64V224Z`;

    	const writable_props = [
    		"momentum",
    		"x",
    		"y",
    		"width",
    		"height",
    		"isBoss",
    		"direction",
    		"health",
    		"maxHealth",
    		"gettingHit"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Enemy> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Enemy", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("momentum" in $$props) $$invalidate(0, momentum = $$props.momentum);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("isBoss" in $$props) $$invalidate(12, isBoss = $$props.isBoss);
    		if ("direction" in $$props) $$invalidate(5, direction = $$props.direction);
    		if ("health" in $$props) $$invalidate(6, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(7, maxHealth = $$props.maxHealth);
    		if ("gettingHit" in $$props) $$invalidate(13, gettingHit = $$props.gettingHit);
    	};

    	$$self.$capture_state = () => ({
    		HealthBar,
    		momentum,
    		x,
    		y,
    		width,
    		height,
    		isBoss,
    		direction,
    		health,
    		maxHealth,
    		gettingHit,
    		path1,
    		path2,
    		bodyColor,
    		eyeColor
    	});

    	$$self.$inject_state = $$props => {
    		if ("momentum" in $$props) $$invalidate(0, momentum = $$props.momentum);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("isBoss" in $$props) $$invalidate(12, isBoss = $$props.isBoss);
    		if ("direction" in $$props) $$invalidate(5, direction = $$props.direction);
    		if ("health" in $$props) $$invalidate(6, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(7, maxHealth = $$props.maxHealth);
    		if ("gettingHit" in $$props) $$invalidate(13, gettingHit = $$props.gettingHit);
    		if ("bodyColor" in $$props) $$invalidate(8, bodyColor = $$props.bodyColor);
    		if ("eyeColor" in $$props) $$invalidate(9, eyeColor = $$props.eyeColor);
    	};

    	let bodyColor;
    	let eyeColor;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*health, gettingHit, isBoss*/ 12352) {
    			 $$invalidate(8, bodyColor = health <= 0
    			? "#333333"
    			: gettingHit ? "#ffffff" : isBoss ? "#000" : "#79cf00");
    		}

    		if ($$self.$$.dirty & /*health, gettingHit, isBoss*/ 12352) {
    			 $$invalidate(9, eyeColor = health <= 0
    			? "#000000"
    			: gettingHit ? "#0000ff" : isBoss ? "red" : "#cf7900");
    		}
    	};

    	return [
    		momentum,
    		x,
    		y,
    		width,
    		height,
    		direction,
    		health,
    		maxHealth,
    		bodyColor,
    		eyeColor,
    		path1,
    		path2,
    		isBoss,
    		gettingHit
    	];
    }

    class Enemy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			momentum: 0,
    			x: 1,
    			y: 2,
    			width: 3,
    			height: 4,
    			isBoss: 12,
    			direction: 5,
    			health: 6,
    			maxHealth: 7,
    			gettingHit: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Enemy",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get momentum() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set momentum(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isBoss() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isBoss(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get health() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set health(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxHealth() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxHealth(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gettingHit() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gettingHit(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\BubTheBobcat\GameOver.svelte generated by Svelte v3.24.1 */

    const file$8 = "src\\pages\\BubTheBobcat\\GameOver.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let h10;
    	let t1;
    	let h11;
    	let t2;
    	let t3;
    	let t4;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = "Bub is dead now. You really let him down.";
    			t1 = space();
    			h11 = element("h1");
    			t2 = text("Final score: ");
    			t3 = text(/*score*/ ctx[0]);
    			t4 = space();
    			p = element("p");
    			p.textContent = "Press enter to restart.";
    			attr_dev(h10, "class", "svelte-1ogvx1s");
    			add_location(h10, file$8, 1, 1, 26);
    			attr_dev(h11, "class", "svelte-1ogvx1s");
    			add_location(h11, file$8, 2, 1, 79);
    			attr_dev(p, "class", "svelte-1ogvx1s");
    			add_location(p, file$8, 3, 1, 111);
    			attr_dev(div, "class", "game-over svelte-1ogvx1s");
    			add_location(div, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h10);
    			append_dev(div, t1);
    			append_dev(div, h11);
    			append_dev(h11, t2);
    			append_dev(h11, t3);
    			append_dev(div, t4);
    			append_dev(div, p);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*score*/ 1) set_data_dev(t3, /*score*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let { score = 0 } = $$props;
    	let { wave = 0 } = $$props;
    	const writable_props = ["score", "wave"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameOver> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameOver", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("score" in $$props) $$invalidate(0, score = $$props.score);
    		if ("wave" in $$props) $$invalidate(1, wave = $$props.wave);
    	};

    	$$self.$capture_state = () => ({ score, wave });

    	$$self.$inject_state = $$props => {
    		if ("score" in $$props) $$invalidate(0, score = $$props.score);
    		if ("wave" in $$props) $$invalidate(1, wave = $$props.wave);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [score, wave];
    }

    class GameOver extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { score: 0, wave: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameOver",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get score() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set score(value) {
    		throw new Error("<GameOver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wave() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wave(value) {
    		throw new Error("<GameOver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function floater(x, y, width, height, color, interactive = true) {
    	return {
    		x,
    		y,
    		width,
    		height,
    		color,
    		interactive,
    	}
    }

    function levelToBlocks(level, blockSize) {
    	const b = [];
    	for (let x = 0; x < level.data.length; x++) {
    		for (let y = 0; y < level.data[x].length; y++) {
    			// todo should be objects allowing different block types and config, not just 0 or 1
    			if (level.data[x][y])
    				b.push(
    					floater(x * blockSize + 600, y * blockSize, blockSize, blockSize, level.data[x][y], true)
    					// floater(x + 20, y, blockSize, true, BlockColors.Green)
    				);
    		}
    	}
    	return b
    }

    // // deprecated
    // export default function generateBlocks(size, mapWidthInBlocks) {
    // 	const generatedBlocks = []
    // 	for (let x = 0; x < mapWidthInBlocks; x++) {
    // 		const y = getRandomInt(4)
    // 		// floater random height above filled
    // 		generatedBlocks.push(floater(x, y + getRandomInt(10), size, true, Colors.Grey))

    // 		// filled to random height
    // 		generatedBlocks.push(filled(x, y, size))

    // 		// clouds every 8 x
    // 		if (x % 8 == 0) {
    // 			const cy = x % 3 == 0 ? 13 : 14
    // 			generatedBlocks.push(floater(x, cy, size, false, Colors.White))
    // 			generatedBlocks.push(floater(x + 1, cy, size, false, Colors.White))
    // 			generatedBlocks.push(floater(x + 2, cy, size, false, Colors.White))
    // 			generatedBlocks.push(floater(x + 1, cy + 1, size, false, Colors.White))
    // 			if (x % 3 == 0) generatedBlocks.push(floater(x + 3, cy, size, false, Colors.White))
    // 		}
    // 	}

    // 	return generatedBlocks
    // }

    /* src\pages\BubTheBobcat\Game.svelte generated by Svelte v3.24.1 */

    const { window: window_1 } = globals;

    const file$9 = "src\\pages\\BubTheBobcat\\Game.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (4:1) {#if gameOver}
    function create_if_block_1(ctx) {
    	let gameover;
    	let current;

    	gameover = new GameOver({
    			props: {
    				wave: /*wave*/ ctx[0],
    				score: /*score*/ ctx[1]
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
    			if (dirty & /*wave*/ 1) gameover_changes.wave = /*wave*/ ctx[0];
    			if (dirty & /*score*/ 2) gameover_changes.score = /*score*/ ctx[1];
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(4:1) {#if gameOver}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#if player != null}
    function create_if_block$1(ctx) {
    	let level_1;
    	let current;

    	level_1 = new Level({
    			props: {
    				blocks: /*visibleBlocks*/ ctx[6],
    				x: /*player*/ ctx[3].x - /*viewport*/ ctx[7].width / 2,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(level_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(level_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const level_1_changes = {};
    			if (dirty & /*visibleBlocks*/ 64) level_1_changes.blocks = /*visibleBlocks*/ ctx[6];
    			if (dirty & /*player, viewport*/ 136) level_1_changes.x = /*player*/ ctx[3].x - /*viewport*/ ctx[7].width / 2;

    			if (dirty & /*$$scope, enemies*/ 134217744) {
    				level_1_changes.$$scope = { dirty, ctx };
    			}

    			level_1.$set(level_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(level_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(level_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(level_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:2) {#if player != null}",
    		ctx
    	});

    	return block;
    }

    // (12:4) {#each enemies as enemy}
    function create_each_block$2(ctx) {
    	let enemy;
    	let current;
    	const enemy_spread_levels = [/*enemy*/ ctx[24]];
    	let enemy_props = {};

    	for (let i = 0; i < enemy_spread_levels.length; i += 1) {
    		enemy_props = assign(enemy_props, enemy_spread_levels[i]);
    	}

    	enemy = new Enemy({ props: enemy_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(enemy.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(enemy, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const enemy_changes = (dirty & /*enemies*/ 16)
    			? get_spread_update(enemy_spread_levels, [get_spread_object(/*enemy*/ ctx[24])])
    			: {};

    			enemy.$set(enemy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(enemy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(enemy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(enemy, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(12:4) {#each enemies as enemy}",
    		ctx
    	});

    	return block;
    }

    // (11:3) <Level blocks={visibleBlocks} x={player.x - viewport.width / 2}>
    function create_default_slot_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*enemies*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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
    			if (dirty & /*enemies*/ 16) {
    				each_value = /*enemies*/ ctx[4];
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(11:3) <Level blocks={visibleBlocks} x={player.x - viewport.width / 2}>",
    		ctx
    	});

    	return block;
    }

    // (8:1) <Viewport {...viewport}>
    function create_default_slot(ctx) {
    	let t;
    	let player_1;
    	let current;
    	let if_block = /*player*/ ctx[3] != null && create_if_block$1(ctx);
    	const player_1_spread_levels = [/*player*/ ctx[3], { x: /*viewport*/ ctx[7].width / 2 }];
    	let player_1_props = {};

    	for (let i = 0; i < player_1_spread_levels.length; i += 1) {
    		player_1_props = assign(player_1_props, player_1_spread_levels[i]);
    	}

    	player_1 = new Player({ props: player_1_props, $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(player_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(player_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*player*/ ctx[3] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*player*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const player_1_changes = (dirty & /*player, viewport*/ 136)
    			? get_spread_update(player_1_spread_levels, [
    					dirty & /*player*/ 8 && get_spread_object(/*player*/ ctx[3]),
    					dirty & /*viewport*/ 128 && { x: /*viewport*/ ctx[7].width / 2 }
    				])
    			: {};

    			player_1.$set(player_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(player_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(player_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(player_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(8:1) <Viewport {...viewport}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let t0;
    	let viewport_1;
    	let t1;
    	let status;
    	let t2;
    	let instructions;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*gameOver*/ ctx[5] && create_if_block_1(ctx);
    	const viewport_1_spread_levels = [/*viewport*/ ctx[7]];

    	let viewport_1_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < viewport_1_spread_levels.length; i += 1) {
    		viewport_1_props = assign(viewport_1_props, viewport_1_spread_levels[i]);
    	}

    	viewport_1 = new Viewport({ props: viewport_1_props, $$inline: true });

    	status = new Status({
    			props: {
    				wave: /*wave*/ ctx[0],
    				score: /*score*/ ctx[1]
    			},
    			$$inline: true
    		});

    	instructions = new Instructions({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(viewport_1.$$.fragment);
    			t1 = space();
    			create_component(status.$$.fragment);
    			t2 = space();
    			create_component(instructions.$$.fragment);
    			attr_dev(div, "class", "game-window svelte-1ihy09s");
    			add_location(div, file$9, 2, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			mount_component(viewport_1, div, null);
    			append_dev(div, t1);
    			mount_component(status, div, null);
    			append_dev(div, t2);
    			mount_component(instructions, div, null);
    			/*div_binding*/ ctx[11](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*onKeyDown*/ ctx[8], false, false, false),
    					listen_dev(window_1, "keyup", /*onKeyUp*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*gameOver*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*gameOver*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
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

    			const viewport_1_changes = (dirty & /*viewport*/ 128)
    			? get_spread_update(viewport_1_spread_levels, [get_spread_object(/*viewport*/ ctx[7])])
    			: {};

    			if (dirty & /*$$scope, player, viewport, visibleBlocks, enemies*/ 134217944) {
    				viewport_1_changes.$$scope = { dirty, ctx };
    			}

    			viewport_1.$set(viewport_1_changes);
    			const status_changes = {};
    			if (dirty & /*wave*/ 1) status_changes.wave = /*wave*/ ctx[0];
    			if (dirty & /*score*/ 2) status_changes.score = /*score*/ ctx[1];
    			status.$set(status_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(viewport_1.$$.fragment, local);
    			transition_in(status.$$.fragment, local);
    			transition_in(instructions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(viewport_1.$$.fragment, local);
    			transition_out(status.$$.fragment, local);
    			transition_out(instructions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(viewport_1);
    			destroy_component(status);
    			destroy_component(instructions);
    			/*div_binding*/ ctx[11](null);
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

    const blockSize = 25;

    function instance$b($$self, $$props, $$invalidate) {
    	let { level = null } = $$props;
    	let blocks = [];
    	let wave = 0;
    	let score = 0;
    	let mainEl;
    	let maxSpeed = 5;
    	let maxEnemySpeed = 2;
    	let jumpMomentum = 20;
    	let player;
    	let enemies;
    	let leftDown = false;
    	let rightDown = false;
    	let spaceDown = false;
    	let gameOver = false;
    	let gameAlive = true;
    	let lastRequestedFrame = null;
    	let visibleBlocks;

    	let viewport = {
    		x: 0,
    		y: 0,
    		width: window.innerWidth,
    		height: 900
    	};

    	onMount(() => {
    		blocks = levelToBlocks(level, blockSize);
    		start();
    	});

    	onDestroy(() => {
    		gameAlive = false;
    		window.cancelAnimationFrame(lastRequestedFrame);
    	});

    	function start() {
    		$$invalidate(0, wave = 0);
    		$$invalidate(1, score = 0);

    		$$invalidate(3, player = {
    			width: 85,
    			height: 75,
    			x: blocks[0].x,
    			y: blocks[0].y + blocks[0].height + 25,
    			direction: 1,
    			momentum: { x: 0, y: 0 },
    			spinning: false,
    			health: 100,
    			maxHealth: 100
    		});

    		$$invalidate(4, enemies = []);
    		$$invalidate(5, gameOver = false);

    		// only start game loop if it's not already going
    		if (lastRequestedFrame == null) gameLoop();
    	}

    	function gameLoop() {
    		if (!gameOver) {
    			$$invalidate(3, player = updateSprite(player, true));
    			$$invalidate(7, viewport.x = player.x - viewport.width / 2, viewport);
    			$$invalidate(6, visibleBlocks = blocks.filter(b => doObjectsIntersectX(viewport, b)));

    			// if no enemies are alive, spawn some more
    			// todo: levels should add mobs, not auto spawn
    			// if (!enemies.some(e => e.health > 0)) {
    			// 	// if they haven't killed 10 yet, spawn some more small enemies
    			// 	if (enemies.length < 5) {
    			// 		wave++
    			// 		score += wave > 1 ? 100 : 0
    			// 		// bunch of small enemies
    			// 		enemies = enemies.concat(
    			// 			[1, 2, 3, 4, 5].map(x => ({
    			// 				width: 100,
    			// 				height: 50,
    			// 				x: player.x + 100 + x * 100,
    			// 				y: 600,
    			// 				direction: -1,
    			// 				momentum: {
    			// 					x: 0,
    			// 					y: 0,
    			// 				},
    			// 				health: 100 * wave,
    			// 				maxHealth: 100 * wave,
    			// 			}))
    			// 		)
    			// 	} else {
    			// 		// spawn a boss
    			// 		score += 50
    			// 		enemies = [
    			// 			{
    			// 				isBoss: true,
    			// 				width: 400,
    			// 				height: 200,
    			// 				x: player.x + 200,
    			// 				y: 600,
    			// 				direction: -1,
    			// 				momentum: {
    			// 					x: 0,
    			// 					y: 0,
    			// 				},
    			// 				health: 400 * wave,
    			// 				maxHealth: 400 * wave,
    			// 			},
    			// 		]
    			// 	}
    			// }
    			// for every live enemy intersecting the player, one or the other should take damage
    			for (let i = 0; i < enemies.length; i++) {
    				$$invalidate(4, enemies[i] = updateSprite(enemies[i]), enemies);

    				if (enemies[i].health > 0 && doObjectsIntersect(player, enemies[i])) {
    					if (player.spinning) {
    						$$invalidate(4, enemies[i].gettingHit = true, enemies);
    						$$invalidate(4, enemies[i].health -= 1, enemies);
    					} else {
    						$$invalidate(3, player.health -= 1 * wave, player);
    					}
    				}
    			}

    			// game is over if player dies
    			if (player.health <= 0) $$invalidate(5, gameOver = true);
    		}

    		if (gameAlive) lastRequestedFrame = window.requestAnimationFrame(gameLoop);
    	}

    	function updateSprite(sprite, isPlayerControlled = false) {
    		const groundHeightsBelowSprite = blocks.filter(b => b.interactive && isAAboveB(sprite, b)).map(b => b.y + b.height);

    		const groundY = groundHeightsBelowSprite.length > 0
    		? Math.max(...groundHeightsBelowSprite)
    		: 0;

    		if (sprite.momentum.y != 0) {
    			sprite.y += sprite.momentum.y;

    			// if we just hit the ground, take some life away
    			if (sprite.y <= groundY) {
    				sprite.y = groundY;
    				sprite.health += sprite.momentum.y / (isPlayerControlled ? 2 : 10);
    			}
    		}

    		// x momentum
    		if (sprite.momentum.x != 0) {
    			if (sprite.momentum.x > 0) {
    				const rightBound = blockSize * level.length;
    				const targetX = sprite.x + sprite.momentum.x;
    				sprite.x = targetX > rightBound ? rightBound : targetX;
    			} else {
    				const leftBound = 0;
    				const targetX = sprite.x + sprite.momentum.x;
    				sprite.x = targetX < leftBound ? leftBound : targetX;
    			}
    		}

    		if (sprite.y > groundY) {
    			sprite.momentum.y--;
    		} else {
    			sprite.momentum.y = 0;

    			if (isPlayerControlled) {
    				// player can jump if they're on the ground
    				if (spaceDown) {
    					sprite.momentum.y = jumpMomentum;
    					sprite.y += 1;
    				} else if (!leftDown && !rightDown) sprite.momentum.x = 0;
    			} else {
    				// enemy, just move toward player
    				// if player is above enemy, jump
    				if (player.y > sprite.y + sprite.height) {
    					sprite.momentum.y = jumpMomentum;
    					sprite.y += 1;
    				}
    			}
    		}

    		if (isPlayerControlled) {
    			// player can move left and right
    			if (leftDown) sprite.momentum.x = -maxSpeed; else if (rightDown) sprite.momentum.x = maxSpeed;
    		} else {
    			// enemy, just move toward player
    			if (player.x < sprite.x) sprite.momentum.x = -maxEnemySpeed; else sprite.momentum.x = maxEnemySpeed;
    		}

    		return sprite;
    	}

    	function onKeyDown(e) {
    		if (gameOver) return;

    		switch (e.code) {
    			case "KeyA":
    				$$invalidate(3, player.direction = -1, player);
    				leftDown = true;
    				break;
    			case "KeyD":
    				$$invalidate(3, player.direction = 1, player);
    				rightDown = true;
    				break;
    			case "Space":
    				spaceDown = true;
    				break;
    			case "KeyR":
    				$$invalidate(3, player.spinning = true, player);
    				break;
    			case "KeyQ":
    				$$invalidate(3, player.health = player.maxHealth, player);
    				break;
    		}
    	}

    	function onKeyUp(e) {
    		switch (e.code) {
    			case "KeyA":
    				leftDown = false;
    				break;
    			case "KeyD":
    				rightDown = false;
    				break;
    			case "Space":
    				spaceDown = false;
    				break;
    			case "KeyR":
    				$$invalidate(3, player.spinning = false, player);
    				break;
    			case "Enter":
    				start();
    				break;
    		}
    	}

    	const writable_props = ["level"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Game", $$slots, []);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			mainEl = $$value;
    			$$invalidate(2, mainEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("level" in $$props) $$invalidate(10, level = $$props.level);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		Status,
    		Level,
    		Instructions,
    		Viewport,
    		Player,
    		Enemy,
    		HealthBar,
    		GameOver,
    		Block,
    		levelToBlocks,
    		doObjectsIntersect,
    		doObjectsIntersectX,
    		doObjectsIntersectY,
    		isAAboveB,
    		level,
    		blockSize,
    		blocks,
    		wave,
    		score,
    		mainEl,
    		maxSpeed,
    		maxEnemySpeed,
    		jumpMomentum,
    		player,
    		enemies,
    		leftDown,
    		rightDown,
    		spaceDown,
    		gameOver,
    		gameAlive,
    		lastRequestedFrame,
    		visibleBlocks,
    		viewport,
    		start,
    		gameLoop,
    		updateSprite,
    		onKeyDown,
    		onKeyUp
    	});

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) $$invalidate(10, level = $$props.level);
    		if ("blocks" in $$props) blocks = $$props.blocks;
    		if ("wave" in $$props) $$invalidate(0, wave = $$props.wave);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    		if ("mainEl" in $$props) $$invalidate(2, mainEl = $$props.mainEl);
    		if ("maxSpeed" in $$props) maxSpeed = $$props.maxSpeed;
    		if ("maxEnemySpeed" in $$props) maxEnemySpeed = $$props.maxEnemySpeed;
    		if ("jumpMomentum" in $$props) jumpMomentum = $$props.jumpMomentum;
    		if ("player" in $$props) $$invalidate(3, player = $$props.player);
    		if ("enemies" in $$props) $$invalidate(4, enemies = $$props.enemies);
    		if ("leftDown" in $$props) leftDown = $$props.leftDown;
    		if ("rightDown" in $$props) rightDown = $$props.rightDown;
    		if ("spaceDown" in $$props) spaceDown = $$props.spaceDown;
    		if ("gameOver" in $$props) $$invalidate(5, gameOver = $$props.gameOver);
    		if ("gameAlive" in $$props) gameAlive = $$props.gameAlive;
    		if ("lastRequestedFrame" in $$props) lastRequestedFrame = $$props.lastRequestedFrame;
    		if ("visibleBlocks" in $$props) $$invalidate(6, visibleBlocks = $$props.visibleBlocks);
    		if ("viewport" in $$props) $$invalidate(7, viewport = $$props.viewport);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		wave,
    		score,
    		mainEl,
    		player,
    		enemies,
    		gameOver,
    		visibleBlocks,
    		viewport,
    		onKeyDown,
    		onKeyUp,
    		level,
    		div_binding
    	];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { level: 10 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get level() {
    		throw new Error("<Game>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set level(value) {
    		throw new Error("<Game>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\BubTheBobcat\Index.svelte generated by Svelte v3.24.1 */

    function create_fragment$c(ctx) {
    	let game;
    	let current;

    	game = new Game({
    			props: { level: /*levels*/ ctx[0][0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(game.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(game, target, anchor);
    			current = true;
    		},
    		p: noop,
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
    			destroy_component(game, detaching);
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
    	let level = null;

    	let levels = [
    		{
    			name: "Sample 1",
    			data: [
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"orange",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"rgb(102, 102, 102)",
    					"green",
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"green",
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
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
    					null
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
    					"rgb(204, 204, 204)",
    					null,
    					null
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
    					"rgb(204, 204, 204)",
    					null,
    					null
    				],
    				[
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"rgb(204, 204, 204)",
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
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
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
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
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
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
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					null,
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
    				],
    				[
    					"green",
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
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
    					null
    				]
    			]
    		}
    	]; // data: [
    	// 	[1],
    	// 	[1, 1],
    	// 	[1, 1, 1],

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);
    	$$self.$capture_state = () => ({ LevelBuilder, Game, level, levels });

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) level = $$props.level;
    		if ("levels" in $$props) $$invalidate(0, levels = $$props.levels);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [levels];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    // import LocalStorageStore from 'LocalStorageStore'

    function LocalStorageStore(key, defaultValue) {
    	const valueFromStorage = localStorage.getItem(key);
    	const initialValue =
    		valueFromStorage != null && valueFromStorage != 'null' && valueFromStorage != 'undefined' ? JSON.parse(valueFromStorage) : defaultValue;
    	const { subscribe, set, update } = writable(initialValue);
    	return {
    		subscribe,
    		update, // not sure if i need to handle this
    		set: function (value) {
    			set(value);
    			localStorage.setItem(key, JSON.stringify(value));
    		},
    	}
    }

    /* src\pages\PixelArtMaker\Index.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$1, console: console_1$1 } = globals;
    const file$a = "src\\pages\\PixelArtMaker\\Index.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[43] = list[i];
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	return child_ctx;
    }

    // (1:0) {#if savedNames.length}
    function create_if_block$2(ctx) {
    	let div;
    	let each_value_3 = /*savedNames*/ ctx[10];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-1i9cs17");
    			add_location(div, file$a, 1, 1, 25);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteSave, savedNames, loaded, load*/ 25166849) {
    				each_value_3 = /*savedNames*/ ctx[10];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(1:0) {#if savedNames.length}",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#each savedNames as savedDrawingName}
    function create_each_block_3(ctx) {
    	let div;
    	let button0;
    	let t0_value = /*savedDrawingName*/ ctx[49] + "";
    	let t0;
    	let button0_class_value;
    	let t1;
    	let button1;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[26](/*savedDrawingName*/ ctx[49], ...args);
    	}

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[27](/*savedDrawingName*/ ctx[49], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "x";
    			t3 = space();

    			attr_dev(button0, "class", button0_class_value = "btn btn-sm btn-" + (/*savedDrawingName*/ ctx[49] == /*loaded*/ ctx[0]
    			? "primary active"
    			: "secondary"));

    			add_location(button0, file$a, 4, 4, 108);
    			attr_dev(button1, "class", "btn btn-sm btn-secondary");
    			add_location(button1, file$a, 7, 4, 284);
    			attr_dev(div, "class", "btn-group mr-2");
    			add_location(div, file$a, 3, 3, 75);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*savedNames*/ 1024 && t0_value !== (t0_value = /*savedDrawingName*/ ctx[49] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*savedNames, loaded*/ 1025 && button0_class_value !== (button0_class_value = "btn btn-sm btn-" + (/*savedDrawingName*/ ctx[49] == /*loaded*/ ctx[0]
    			? "primary active"
    			: "secondary"))) {
    				attr_dev(button0, "class", button0_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(3:2) {#each savedNames as savedDrawingName}",
    		ctx
    	});

    	return block;
    }

    // (45:3) {#each colors as color}
    function create_each_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[33](/*color*/ ctx[46], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			set_style(button, "background-color", /*color*/ ctx[46]);
    			attr_dev(button, "class", "svelte-1i9cs17");
    			toggle_class(button, "active", /*color*/ ctx[46] == /*selectedColor*/ ctx[1]);
    			add_location(button, file$a, 45, 4, 1344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*colors, selectedColor*/ 16386) {
    				toggle_class(button, "active", /*color*/ ctx[46] == /*selectedColor*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(45:3) {#each colors as color}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {#each columns as column}
    function create_each_block_1(ctx) {
    	let rect;
    	let rect_y_value;
    	let rect_x_value;
    	let rect_data_row_value;
    	let rect_data_column_value;
    	let rect_stroke_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "y", rect_y_value = /*row*/ ctx[40] * /*gridSize*/ ctx[2]);
    			attr_dev(rect, "x", rect_x_value = /*column*/ ctx[43] * /*gridSize*/ ctx[2]);
    			set_style(rect, "fill", getCellColor(/*data*/ ctx[9], /*row*/ ctx[40], /*column*/ ctx[43]));
    			attr_dev(rect, "width", /*gridSize*/ ctx[2]);
    			attr_dev(rect, "height", /*gridSize*/ ctx[2]);
    			attr_dev(rect, "data-row", rect_data_row_value = /*row*/ ctx[40]);
    			attr_dev(rect, "data-column", rect_data_column_value = /*column*/ ctx[43]);
    			attr_dev(rect, "stroke", rect_stroke_value = /*showGrid*/ ctx[7] ? "#eee" : null);
    			add_location(rect, file$a, 59, 5, 1795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*rows, gridSize*/ 2052 && rect_y_value !== (rect_y_value = /*row*/ ctx[40] * /*gridSize*/ ctx[2])) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty[0] & /*columns, gridSize*/ 4100 && rect_x_value !== (rect_x_value = /*column*/ ctx[43] * /*gridSize*/ ctx[2])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*data, rows, columns*/ 6656) {
    				set_style(rect, "fill", getCellColor(/*data*/ ctx[9], /*row*/ ctx[40], /*column*/ ctx[43]));
    			}

    			if (dirty[0] & /*gridSize*/ 4) {
    				attr_dev(rect, "width", /*gridSize*/ ctx[2]);
    			}

    			if (dirty[0] & /*gridSize*/ 4) {
    				attr_dev(rect, "height", /*gridSize*/ ctx[2]);
    			}

    			if (dirty[0] & /*rows*/ 2048 && rect_data_row_value !== (rect_data_row_value = /*row*/ ctx[40])) {
    				attr_dev(rect, "data-row", rect_data_row_value);
    			}

    			if (dirty[0] & /*columns*/ 4096 && rect_data_column_value !== (rect_data_column_value = /*column*/ ctx[43])) {
    				attr_dev(rect, "data-column", rect_data_column_value);
    			}

    			if (dirty[0] & /*showGrid*/ 128 && rect_stroke_value !== (rect_stroke_value = /*showGrid*/ ctx[7] ? "#eee" : null)) {
    				attr_dev(rect, "stroke", rect_stroke_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(59:4) {#each columns as column}",
    		ctx
    	});

    	return block;
    }

    // (58:3) {#each rows as row}
    function create_each_block$3(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*columns*/ ctx[12];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

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
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*rows, gridSize, columns, data, showGrid*/ 6788) {
    				each_value_1 = /*columns*/ ctx[12];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(58:3) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let t0;
    	let div4;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let div0;
    	let button2;
    	let t5;
    	let t6_value = /*undos*/ ctx[5].length + "";
    	let t6;
    	let button2_disabled_value;
    	let t7;
    	let button3;
    	let t8;
    	let t9_value = /*redos*/ ctx[6].length + "";
    	let t9;
    	let button3_disabled_value;
    	let t10;
    	let div1;
    	let t11;
    	let input0;
    	let t12;
    	let div2;
    	let t13;
    	let input1;
    	let t14;
    	let div3;
    	let t15;
    	let input2;
    	let t16;
    	let label;
    	let input3;
    	let t17;
    	let t18;
    	let div8;
    	let div6;
    	let div5;
    	let t19;
    	let div7;
    	let svg;
    	let svg_width_value;
    	let svg_height_value;
    	let t20;
    	let textarea;
    	let textarea_value_value;
    	let mounted;
    	let dispose;
    	let if_block = /*savedNames*/ ctx[10].length && create_if_block$2(ctx);
    	let each_value_2 = /*colors*/ ctx[14];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*rows*/ ctx[11];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div4 = element("div");
    			button0 = element("button");
    			button0.textContent = "Save";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Reset";
    			t4 = space();
    			div0 = element("div");
    			button2 = element("button");
    			t5 = text("Undo ");
    			t6 = text(t6_value);
    			t7 = space();
    			button3 = element("button");
    			t8 = text("Redo ");
    			t9 = text(t9_value);
    			t10 = space();
    			div1 = element("div");
    			t11 = text("Grid size\n\t\t");
    			input0 = element("input");
    			t12 = space();
    			div2 = element("div");
    			t13 = text("Height\n\t\t");
    			input1 = element("input");
    			t14 = space();
    			div3 = element("div");
    			t15 = text("Width\n\t\t");
    			input2 = element("input");
    			t16 = space();
    			label = element("label");
    			input3 = element("input");
    			t17 = text("\n\t\tShow grid");
    			t18 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t19 = space();
    			div7 = element("div");
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t20 = space();
    			textarea = element("textarea");
    			attr_dev(button0, "class", "btn btn-success btn-sm mr-2 svelte-1i9cs17");
    			add_location(button0, file$a, 14, 1, 437);
    			attr_dev(button1, "class", "btn btn-secondary btn-sm svelte-1i9cs17");
    			add_location(button1, file$a, 15, 1, 520);
    			button2.disabled = button2_disabled_value = /*undos*/ ctx[5].length == 0;
    			attr_dev(button2, "class", "btn btn-default btn-sm");
    			add_location(button2, file$a, 18, 2, 621);
    			button3.disabled = button3_disabled_value = /*redos*/ ctx[6].length == 0;
    			attr_dev(button3, "class", "btn btn-default btn-sm");
    			add_location(button3, file$a, 19, 2, 736);
    			attr_dev(div0, "class", "btn-group svelte-1i9cs17");
    			add_location(div0, file$a, 17, 1, 595);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "15");
    			attr_dev(input0, "max", "50");
    			attr_dev(input0, "step", "5");
    			attr_dev(input0, "class", "svelte-1i9cs17");
    			add_location(input0, file$a, 24, 2, 879);
    			attr_dev(div1, "class", "svelte-1i9cs17");
    			add_location(div1, file$a, 22, 1, 859);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "Height");
    			attr_dev(input1, "class", "svelte-1i9cs17");
    			add_location(input1, file$a, 28, 2, 978);
    			attr_dev(div2, "class", "svelte-1i9cs17");
    			add_location(div2, file$a, 26, 1, 961);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "Width");
    			attr_dev(input2, "class", "svelte-1i9cs17");
    			add_location(input2, file$a, 32, 2, 1068);
    			attr_dev(div3, "class", "svelte-1i9cs17");
    			add_location(div3, file$a, 30, 1, 1052);
    			attr_dev(input3, "type", "checkbox");
    			add_location(input3, file$a, 35, 2, 1150);
    			attr_dev(label, "class", "svelte-1i9cs17");
    			add_location(label, file$a, 34, 1, 1140);
    			attr_dev(div4, "class", "flex svelte-1i9cs17");
    			add_location(div4, file$a, 13, 0, 417);
    			attr_dev(div5, "class", "color-picker svelte-1i9cs17");
    			add_location(div5, file$a, 43, 2, 1286);
    			attr_dev(div6, "class", "controls svelte-1i9cs17");
    			add_location(div6, file$a, 41, 1, 1260);
    			attr_dev(svg, "width", svg_width_value = /*width*/ ctx[4] * (/*gridSize*/ ctx[2] + 2));
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[3] * (/*gridSize*/ ctx[2] + 2));
    			attr_dev(svg, "class", "svelte-1i9cs17");
    			add_location(svg, file$a, 50, 2, 1518);
    			attr_dev(div7, "class", "flex-grow svelte-1i9cs17");
    			add_location(div7, file$a, 49, 1, 1492);
    			attr_dev(div8, "class", "flex align-top svelte-1i9cs17");
    			add_location(div8, file$a, 40, 0, 1230);
    			textarea.value = textarea_value_value = JSON.stringify(/*levelData*/ ctx[8]);
    			attr_dev(textarea, "class", "svelte-1i9cs17");
    			add_location(textarea, file$a, 74, 0, 2094);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, button0);
    			append_dev(div4, t2);
    			append_dev(div4, button1);
    			append_dev(div4, t4);
    			append_dev(div4, div0);
    			append_dev(div0, button2);
    			append_dev(button2, t5);
    			append_dev(button2, t6);
    			append_dev(div0, t7);
    			append_dev(div0, button3);
    			append_dev(button3, t8);
    			append_dev(button3, t9);
    			append_dev(div4, t10);
    			append_dev(div4, div1);
    			append_dev(div1, t11);
    			append_dev(div1, input0);
    			set_input_value(input0, /*gridSize*/ ctx[2]);
    			append_dev(div4, t12);
    			append_dev(div4, div2);
    			append_dev(div2, t13);
    			append_dev(div2, input1);
    			set_input_value(input1, /*height*/ ctx[3]);
    			append_dev(div4, t14);
    			append_dev(div4, div3);
    			append_dev(div3, t15);
    			append_dev(div3, input2);
    			set_input_value(input2, /*width*/ ctx[4]);
    			append_dev(div4, t16);
    			append_dev(div4, label);
    			append_dev(label, input3);
    			input3.checked = /*showGrid*/ ctx[7];
    			append_dev(label, t17);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div5, null);
    			}

    			append_dev(div8, t19);
    			append_dev(div8, div7);
    			append_dev(div7, svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			insert_dev(target, t20, anchor);
    			insert_dev(target, textarea, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[28], false, false, false),
    					listen_dev(button1, "click", /*reset*/ ctx[15], false, false, false),
    					listen_dev(button2, "click", /*undo*/ ctx[19], false, false, false),
    					listen_dev(button3, "click", /*redo*/ ctx[20], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[29]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[30]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[31]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[32]),
    					listen_dev(svg, "mousedown", /*onSvgMouseDown*/ ctx[16], false, false, false),
    					listen_dev(svg, "mouseup", /*onSvgMouseUp*/ ctx[17], false, false, false),
    					listen_dev(svg, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[25]), false, true, false),
    					listen_dev(svg, "mousemove", /*mousemove_handler*/ ctx[34], false, false, false),
    					listen_dev(textarea, "focus", focus_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*savedNames*/ ctx[10].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*undos*/ 32 && t6_value !== (t6_value = /*undos*/ ctx[5].length + "")) set_data_dev(t6, t6_value);

    			if (dirty[0] & /*undos*/ 32 && button2_disabled_value !== (button2_disabled_value = /*undos*/ ctx[5].length == 0)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*redos*/ 64 && t9_value !== (t9_value = /*redos*/ ctx[6].length + "")) set_data_dev(t9, t9_value);

    			if (dirty[0] & /*redos*/ 64 && button3_disabled_value !== (button3_disabled_value = /*redos*/ ctx[6].length == 0)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}

    			if (dirty[0] & /*gridSize*/ 4 && to_number(input0.value) !== /*gridSize*/ ctx[2]) {
    				set_input_value(input0, /*gridSize*/ ctx[2]);
    			}

    			if (dirty[0] & /*height*/ 8 && to_number(input1.value) !== /*height*/ ctx[3]) {
    				set_input_value(input1, /*height*/ ctx[3]);
    			}

    			if (dirty[0] & /*width*/ 16 && to_number(input2.value) !== /*width*/ ctx[4]) {
    				set_input_value(input2, /*width*/ ctx[4]);
    			}

    			if (dirty[0] & /*showGrid*/ 128) {
    				input3.checked = /*showGrid*/ ctx[7];
    			}

    			if (dirty[0] & /*colors, selectedColor, selectColor*/ 2113538) {
    				each_value_2 = /*colors*/ ctx[14];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty[0] & /*columns, rows, gridSize, data, showGrid*/ 6788) {
    				each_value = /*rows*/ ctx[11];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*width, gridSize*/ 20 && svg_width_value !== (svg_width_value = /*width*/ ctx[4] * (/*gridSize*/ ctx[2] + 2))) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty[0] & /*height, gridSize*/ 12 && svg_height_value !== (svg_height_value = /*height*/ ctx[3] * (/*gridSize*/ ctx[2] + 2))) {
    				attr_dev(svg, "height", svg_height_value);
    			}

    			if (dirty[0] & /*levelData*/ 256 && textarea_value_value !== (textarea_value_value = JSON.stringify(/*levelData*/ ctx[8]))) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
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

    function buildColumns(num) {
    	return [...Array(num)].map(c => null);
    }

    function getCellColor(d, row, column) {
    	return d.length > row && d[row].length > column
    	? d[row][column]
    	: "white";
    }

    const focus_handler = e => e.target.select();

    function instance$d($$self, $$props, $$invalidate) {
    	let $savedDrawings;
    	const savedDrawings = LocalStorageStore("pixel-drawings", {});
    	validate_store(savedDrawings, "savedDrawings");
    	component_subscribe($$self, savedDrawings, value => $$invalidate(36, $savedDrawings = value));
    	let loaded = null;

    	const colors = [
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
    		"red",
    		"purple",
    		"teal",
    		"green",
    		"rgb(40, 40, 184)",
    		"rgb(40, 80, 224)",
    		"rgb(80, 80, 248)",
    		"rgb(120, 124, 248)",
    		"rgb(160, 0, 16)",
    		"rgb(248, 0, 32)",
    		"rgb(208, 124, 96)",
    		"rgb(248, 208, 176)",
    		"red",
    		// bub colors
    		"rgb(253, 240, 232)",
    		"rgb(245, 222, 208)",
    		"rgb(220, 201, 187)",
    		"rgb(197, 179, 167)",
    		"rgb(186, 167, 153)",
    		"rgb(146, 129, 119)",
    		"rgb(120, 107, 99)",
    		"rgb(80, 68, 68)",
    		// eyes
    		"rgb(122, 80, 55)",
    		"rgb(178, 105, 58)",
    		"rgb(203, 140, 97)",
    		"rgb(238, 187, 155)",
    		// ears & nose
    		"rgb(75, 53, 39)"
    	]; // 'white',
    	// '#ccc',
    	// '#A0A4A0',

    	// '#666',
    	// '#333',
    	// 'black',
    	// '#773b0b',
    	// 'blue',
    	// 'pink',
    	// 'yellow',
    	// 'orange',
    	// 'red',
    	// 'purple',
    	// 'teal',
    	// 'green',
    	// '#2828B8',
    	// '#2850E0',
    	// '#5050F8',
    	// '#787CF8',
    	// '#A00010',
    	// '#F80020',
    	// '#D07C60',
    	// '#F8D0B0',
    	let selectedColor = "black";

    	let gridSize = 30;
    	let height = 30;
    	let width = 30;
    	let undos = [];
    	let redos = [];
    	let showGrid = true;
    	let levelData = [];
    	let data = [];
    	let mouseDown = false;
    	reset();

    	function reset() {
    		addUndoState();
    		$$invalidate(9, data = buildRows(height));
    		$$invalidate(0, loaded = null);
    	}

    	function onSvgMouseDown(e) {
    		if (e.altKey || e.button !== 0) {
    			$$invalidate(1, selectedColor = e.target.style.fill);
    		} else {
    			addUndoState();
    			mouseDown = true;
    			onSvgMouseMove(e.target);
    		}
    	}

    	function onSvgMouseUp(e) {
    		mouseDown = false;
    	}

    	function onSvgMouseMove(target) {
    		if (!mouseDown) return;
    		const row = target.dataset.row;
    		const column = target.dataset.column;

    		if (row != null && column != null) {
    			setColor(row, column);
    		}
    	}

    	function addUndoState() {
    		$$invalidate(5, undos = [...undos.slice(Math.max(undos.length - 20, 0)), JSON.stringify(data)]);

    		// if we're adding a new undo state, empty redos
    		$$invalidate(6, redos = []);
    	}

    	function buildRows(num) {
    		return [...Array(num)].map(r => buildColumns(width));
    	}

    	function undo() {
    		$$invalidate(6, redos = [...redos, JSON.stringify(data)]);
    		$$invalidate(9, data = JSON.parse(undos.pop()));
    		$$invalidate(5, undos);
    	}

    	function redo() {
    		if (redos.length == 0) return;
    		$$invalidate(5, undos = [...undos, JSON.stringify(data)]);
    		$$invalidate(9, data = JSON.parse(redos.pop()));
    		$$invalidate(6, redos);
    	}

    	function setColor(row, column, color = selectedColor) {
    		// make sure we have enough rows in data to fit the value
    		if (row > data.length) {
    			const rowsNeeded = height - data.length;
    			console.log("trying to set row ", row, " but only have ", data.length, " adding " + rowsNeeded);
    			$$invalidate(9, data = data.concat(buildRows(rowsNeeded)));
    		}

    		// don't need to worry about columns.. they get auto-filled with null
    		$$invalidate(9, data[row][column] = color, data);
    	}

    	function selectColor(color) {
    		$$invalidate(1, selectedColor = color);
    	}

    	function save() {
    		const name = prompt("Give us a name", loaded || "");
    		if (name == null || name.trim().length == 0) return;

    		set_store_value(
    			savedDrawings,
    			$savedDrawings[name] = {
    				name,
    				gridSize,
    				width,
    				height,
    				data,
    				showGrid
    			},
    			$savedDrawings
    		);

    		$$invalidate(0, loaded = name);
    	}

    	function load(name) {
    		let savedDrawing = JSON.parse(JSON.stringify($savedDrawings[name]));

    		if (Array.isArray(savedDrawing)) {
    			// migrate old format to new
    			console.log("migrating old format");

    			savedDrawing = {
    				name,
    				gridSize: 30,
    				width: 50,
    				height: 40,
    				data: savedDrawing,
    				showGrid
    			};

    			set_store_value(savedDrawings, $savedDrawings[name] = savedDrawing, $savedDrawings);
    		}

    		$$invalidate(9, data = savedDrawing.data);
    		$$invalidate(2, gridSize = savedDrawing.gridSize);
    		$$invalidate(4, width = savedDrawing.width || savedDrawing.data[0].length);
    		$$invalidate(3, height = savedDrawing.height || savedDrawing.data.length);
    		$$invalidate(7, showGrid = savedDrawing.showGrid || showGrid);
    		$$invalidate(5, undos = []);
    		$$invalidate(6, redos = []);
    		$$invalidate(0, loaded = name);
    	}

    	function deleteSave(name) {
    		if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    		if ($savedDrawings.hasOwnProperty(name)) {
    			delete $savedDrawings[name];
    			savedDrawings.set($savedDrawings);
    		}
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);

    	function contextmenu_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler = savedDrawingName => load(savedDrawingName);
    	const click_handler_1 = savedDrawingName => deleteSave(savedDrawingName);
    	const click_handler_2 = () => save();

    	function input0_input_handler() {
    		gridSize = to_number(this.value);
    		$$invalidate(2, gridSize);
    	}

    	function input1_input_handler() {
    		height = to_number(this.value);
    		$$invalidate(3, height);
    	}

    	function input2_input_handler() {
    		width = to_number(this.value);
    		$$invalidate(4, width);
    	}

    	function input3_change_handler() {
    		showGrid = this.checked;
    		$$invalidate(7, showGrid);
    	}

    	const click_handler_3 = color => selectColor(color);
    	const mousemove_handler = e => onSvgMouseMove(e.target);

    	$$self.$capture_state = () => ({
    		LocalStorageStore,
    		savedDrawings,
    		loaded,
    		colors,
    		selectedColor,
    		gridSize,
    		height,
    		width,
    		undos,
    		redos,
    		showGrid,
    		levelData,
    		data,
    		mouseDown,
    		reset,
    		onSvgMouseDown,
    		onSvgMouseUp,
    		onSvgMouseMove,
    		addUndoState,
    		buildRows,
    		buildColumns,
    		undo,
    		redo,
    		setColor,
    		selectColor,
    		save,
    		load,
    		deleteSave,
    		getCellColor,
    		savedNames,
    		$savedDrawings,
    		rows,
    		columns
    	});

    	$$self.$inject_state = $$props => {
    		if ("loaded" in $$props) $$invalidate(0, loaded = $$props.loaded);
    		if ("selectedColor" in $$props) $$invalidate(1, selectedColor = $$props.selectedColor);
    		if ("gridSize" in $$props) $$invalidate(2, gridSize = $$props.gridSize);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("width" in $$props) $$invalidate(4, width = $$props.width);
    		if ("undos" in $$props) $$invalidate(5, undos = $$props.undos);
    		if ("redos" in $$props) $$invalidate(6, redos = $$props.redos);
    		if ("showGrid" in $$props) $$invalidate(7, showGrid = $$props.showGrid);
    		if ("levelData" in $$props) $$invalidate(8, levelData = $$props.levelData);
    		if ("data" in $$props) $$invalidate(9, data = $$props.data);
    		if ("mouseDown" in $$props) mouseDown = $$props.mouseDown;
    		if ("savedNames" in $$props) $$invalidate(10, savedNames = $$props.savedNames);
    		if ("rows" in $$props) $$invalidate(11, rows = $$props.rows);
    		if ("columns" in $$props) $$invalidate(12, columns = $$props.columns);
    	};

    	let savedNames;
    	let rows;
    	let columns;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*$savedDrawings*/ 32) {
    			 $$invalidate(10, savedNames = Object.keys($savedDrawings));
    		}

    		if ($$self.$$.dirty[0] & /*height*/ 8) {
    			 $$invalidate(11, rows = [...Array(height)].map((_, i) => i));
    		}

    		if ($$self.$$.dirty[0] & /*width*/ 16) {
    			 $$invalidate(12, columns = [...Array(width)].map((_, i) => i));
    		}

    		if ($$self.$$.dirty[0] & /*columns, data*/ 4608) {
    			 if (columns.length > 0) {
    				const newLevelData = [];
    				const reverseData = JSON.parse(JSON.stringify(data)).reverse();

    				for (let c = 0; c < columns.length; c++) {
    					newLevelData.push(reverseData.map(r => r.length > c ? r[c] : null));
    				}

    				$$invalidate(8, levelData = newLevelData);
    			}
    		}
    	};

    	return [
    		loaded,
    		selectedColor,
    		gridSize,
    		height,
    		width,
    		undos,
    		redos,
    		showGrid,
    		levelData,
    		data,
    		savedNames,
    		rows,
    		columns,
    		savedDrawings,
    		colors,
    		reset,
    		onSvgMouseDown,
    		onSvgMouseUp,
    		onSvgMouseMove,
    		undo,
    		redo,
    		selectColor,
    		save,
    		load,
    		deleteSave,
    		contextmenu_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_change_handler,
    		click_handler_3,
    		mousemove_handler
    	];
    }

    class Index$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\pages\NotFound.svelte generated by Svelte v3.24.1 */

    const file$b = "src\\pages\\NotFound.svelte";

    function create_fragment$e(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Page not found";
    			add_location(h1, file$b, 0, 0, 0);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.24.1 */
    const file$c = "src\\App.svelte";

    function create_fragment$f(ctx) {
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Pixel Art Maker";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Bub the Bobcat";
    			t3 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "#/pixel-art-maker");
    			add_location(a0, file$c, 2, 2, 42);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$c, 1, 1, 18);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "#/bub-the-bobcat");
    			add_location(a1, file$c, 5, 2, 139);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$c, 4, 1, 115);
    			attr_dev(ul, "class", "nav");
    			add_location(ul, file$c, 0, 0, 0);
    			attr_dev(main, "class", "svelte-1ten5ne");
    			add_location(main, file$c, 9, 0, 216);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
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
    			if (detaching) detach_dev(ul);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(main);
    			destroy_component(router);
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
    	const routes = {
    		"/bub-the-bobcat": Index,
    		"/pixel-art-maker": Index$1,
    		"*": NotFound
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		BubTheBobcat: Index,
    		PixelArtMaker: Index$1,
    		NotFound,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$f.name
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
