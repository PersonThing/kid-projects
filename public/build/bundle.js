
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

    /* src\pages\LevelBuilder\ArtMaker.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$1, console: console_1$1 } = globals;
    const file = "src\\pages\\LevelBuilder\\ArtMaker.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[53] = list[i];
    	return child_ctx;
    }

    // (1:0) {#if savedNames.length}
    function create_if_block$1(ctx) {
    	let div;
    	let each_value_4 = /*savedNames*/ ctx[9];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(div, file, 1, 1, 26);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteSave, savedNames, loaded, load*/ 25166337) {
    				each_value_4 = /*savedNames*/ ctx[9];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(1:0) {#if savedNames.length}",
    		ctx
    	});

    	return block;
    }

    // (3:2) {#each savedNames as savedDrawingName}
    function create_each_block_4(ctx) {
    	let div;
    	let button0;
    	let t0_value = /*savedDrawingName*/ ctx[53] + "";
    	let t0;
    	let button0_class_value;
    	let t1;
    	let button1;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[27](/*savedDrawingName*/ ctx[53], ...args);
    	}

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[28](/*savedDrawingName*/ ctx[53], ...args);
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

    			attr_dev(button0, "class", button0_class_value = "btn btn-sm btn-" + (/*savedDrawingName*/ ctx[53] == /*loaded*/ ctx[0]
    			? "primary active"
    			: "secondary"));

    			add_location(button0, file, 4, 4, 112);
    			attr_dev(button1, "class", "btn btn-sm btn-secondary");
    			add_location(button1, file, 7, 4, 291);
    			attr_dev(div, "class", "btn-group mr-2");
    			add_location(div, file, 3, 3, 78);
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
    			if (dirty[0] & /*savedNames*/ 512 && t0_value !== (t0_value = /*savedDrawingName*/ ctx[53] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*savedNames, loaded*/ 513 && button0_class_value !== (button0_class_value = "btn btn-sm btn-" + (/*savedDrawingName*/ ctx[53] == /*loaded*/ ctx[0]
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
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(3:2) {#each savedNames as savedDrawingName}",
    		ctx
    	});

    	return block;
    }

    // (44:3) {#each colors as color}
    function create_each_block_3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[34](/*color*/ ctx[50], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");

    			set_style(button, "background", /*color*/ ctx[50] != "transparent"
    			? /*color*/ ctx[50]
    			: "linear-gradient(110deg, rgba(200,200,200,1) 45%, rgba(255,255,255,1) 55%, rgba(255,255,255,1) 100%)");

    			attr_dev(button, "class", "svelte-1a4yczt");
    			toggle_class(button, "active", /*color*/ ctx[50] == /*selectedColor*/ ctx[1]);
    			add_location(button, file, 44, 4, 1387);
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
    				toggle_class(button, "active", /*color*/ ctx[50] == /*selectedColor*/ ctx[1]);
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
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(44:3) {#each colors as color}",
    		ctx
    	});

    	return block;
    }

    // (56:4) {#each [20, 0, 0, 0, 0] as margin}
    function create_each_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*previewPNG*/ ctx[10])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			set_style(img, "margin-right", /*margin*/ ctx[47] + "px");
    			add_location(img, file, 56, 5, 1854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*previewPNG*/ 1024 && img.src !== (img_src_value = /*previewPNG*/ ctx[10])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(56:4) {#each [20, 0, 0, 0, 0] as margin}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#each columns as column}
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
    			attr_dev(rect, "y", rect_y_value = /*row*/ ctx[41] * /*gridSize*/ ctx[2]);
    			attr_dev(rect, "x", rect_x_value = /*column*/ ctx[44] * /*gridSize*/ ctx[2]);
    			set_style(rect, "fill", getCellColor(/*data*/ ctx[8], /*row*/ ctx[41], /*column*/ ctx[44]));
    			attr_dev(rect, "width", /*gridSize*/ ctx[2]);
    			attr_dev(rect, "height", /*gridSize*/ ctx[2]);
    			attr_dev(rect, "data-row", rect_data_row_value = /*row*/ ctx[41]);
    			attr_dev(rect, "data-column", rect_data_column_value = /*column*/ ctx[44]);
    			attr_dev(rect, "stroke", rect_stroke_value = /*showGrid*/ ctx[7] ? "#eee" : null);
    			add_location(rect, file, 70, 5, 2266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*rows, gridSize*/ 2052 && rect_y_value !== (rect_y_value = /*row*/ ctx[41] * /*gridSize*/ ctx[2])) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty[0] & /*columns, gridSize*/ 4100 && rect_x_value !== (rect_x_value = /*column*/ ctx[44] * /*gridSize*/ ctx[2])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*data, rows, columns*/ 6400) {
    				set_style(rect, "fill", getCellColor(/*data*/ ctx[8], /*row*/ ctx[41], /*column*/ ctx[44]));
    			}

    			if (dirty[0] & /*gridSize*/ 4) {
    				attr_dev(rect, "width", /*gridSize*/ ctx[2]);
    			}

    			if (dirty[0] & /*gridSize*/ 4) {
    				attr_dev(rect, "height", /*gridSize*/ ctx[2]);
    			}

    			if (dirty[0] & /*rows*/ 2048 && rect_data_row_value !== (rect_data_row_value = /*row*/ ctx[41])) {
    				attr_dev(rect, "data-row", rect_data_row_value);
    			}

    			if (dirty[0] & /*columns*/ 4096 && rect_data_column_value !== (rect_data_column_value = /*column*/ ctx[44])) {
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
    		source: "(70:4) {#each columns as column}",
    		ctx
    	});

    	return block;
    }

    // (69:3) {#each rows as row}
    function create_each_block(ctx) {
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
    			if (dirty[0] & /*rows, gridSize, columns, data, showGrid*/ 6532) {
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(69:3) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
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
    	let div10;
    	let div6;
    	let div5;
    	let t19;
    	let div9;
    	let div8;
    	let t20;
    	let div7;
    	let t21;
    	let svg;
    	let svg_width_value;
    	let svg_height_value;
    	let mounted;
    	let dispose;
    	let if_block = /*savedNames*/ ctx[9].length && create_if_block$1(ctx);
    	let each_value_3 = /*colors*/ ctx[14];
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = [20, 0, 0, 0, 0];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < 5; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*rows*/ ctx[11];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    			t11 = text("Grid size\r\n\t\t");
    			input0 = element("input");
    			t12 = space();
    			div2 = element("div");
    			t13 = text("Height\r\n\t\t");
    			input1 = element("input");
    			t14 = space();
    			div3 = element("div");
    			t15 = text("Width\r\n\t\t");
    			input2 = element("input");
    			t16 = space();
    			label = element("label");
    			input3 = element("input");
    			t17 = text("\r\n\t\tShow grid");
    			t18 = space();
    			div10 = element("div");
    			div6 = element("div");
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t19 = space();
    			div9 = element("div");
    			div8 = element("div");
    			t20 = text("Preview at in-game size / repeated next to same graphic:\r\n\t\t\t");
    			div7 = element("div");

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t21 = space();
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button0, "class", "btn btn-success btn-sm mr-2");
    			add_location(button0, file, 14, 1, 451);
    			attr_dev(button1, "class", "btn btn-secondary btn-sm");
    			add_location(button1, file, 15, 1, 535);
    			button2.disabled = button2_disabled_value = /*undos*/ ctx[5].length == 0;
    			attr_dev(button2, "class", "btn btn-default btn-sm");
    			add_location(button2, file, 18, 2, 639);
    			button3.disabled = button3_disabled_value = /*redos*/ ctx[6].length == 0;
    			attr_dev(button3, "class", "btn btn-default btn-sm");
    			add_location(button3, file, 19, 2, 755);
    			attr_dev(div0, "class", "btn-group");
    			add_location(div0, file, 17, 1, 612);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "15");
    			attr_dev(input0, "max", "50");
    			attr_dev(input0, "step", "5");
    			attr_dev(input0, "class", "svelte-1a4yczt");
    			add_location(input0, file, 24, 2, 903);
    			add_location(div1, file, 22, 1, 881);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "Height");
    			attr_dev(input1, "class", "svelte-1a4yczt");
    			add_location(input1, file, 28, 2, 1006);
    			add_location(div2, file, 26, 1, 987);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "Width");
    			attr_dev(input2, "class", "svelte-1a4yczt");
    			add_location(input2, file, 32, 2, 1100);
    			add_location(div3, file, 30, 1, 1082);
    			attr_dev(input3, "type", "checkbox");
    			add_location(input3, file, 35, 2, 1185);
    			add_location(label, file, 34, 1, 1174);
    			attr_dev(div4, "class", "flex svelte-1a4yczt");
    			add_location(div4, file, 13, 0, 430);
    			attr_dev(div5, "class", "color-picker svelte-1a4yczt");
    			add_location(div5, file, 42, 2, 1327);
    			attr_dev(div6, "class", "controls");
    			add_location(div6, file, 41, 1, 1301);
    			attr_dev(div7, "class", "p-3 preview-bg svelte-1a4yczt");
    			add_location(div7, file, 54, 3, 1779);
    			add_location(div8, file, 52, 2, 1708);
    			attr_dev(svg, "class", "preview-bg svelte-1a4yczt");
    			attr_dev(svg, "width", svg_width_value = /*width*/ ctx[4] * (/*gridSize*/ ctx[2] + 1));
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[3] * (/*gridSize*/ ctx[2] + 1));
    			add_location(svg, file, 60, 2, 1957);
    			attr_dev(div9, "class", "flex-grow ");
    			add_location(div9, file, 51, 1, 1680);
    			attr_dev(div10, "class", "flex align-top");
    			add_location(div10, file, 40, 0, 1270);
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
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div6);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div5, null);
    			}

    			append_dev(div10, t19);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, t20);
    			append_dev(div8, div7);

    			for (let i = 0; i < 5; i += 1) {
    				each_blocks_1[i].m(div7, null);
    			}

    			append_dev(div9, t21);
    			append_dev(div9, svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", onKeyDown, false, false, false),
    					listen_dev(window, "keyup", /*onKeyUp*/ ctx[25], false, false, false),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[29], false, false, false),
    					listen_dev(button1, "click", /*reset*/ ctx[15], false, false, false),
    					listen_dev(button2, "click", /*undo*/ ctx[19], false, false, false),
    					listen_dev(button3, "click", /*redo*/ ctx[20], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[30]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[31]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[32]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[33]),
    					listen_dev(svg, "mousedown", /*onSvgMouseDown*/ ctx[16], false, false, false),
    					listen_dev(svg, "mouseup", /*onSvgMouseUp*/ ctx[17], false, false, false),
    					listen_dev(svg, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[26]), false, true, false),
    					listen_dev(svg, "mousemove", /*mousemove_handler*/ ctx[35], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*savedNames*/ ctx[9].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
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
    				each_value_3 = /*colors*/ ctx[14];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty[0] & /*previewPNG*/ 1024) {
    				each_value_2 = [20, 0, 0, 0, 0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < 5; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div7, null);
    					}
    				}

    				for (; i < 5; i += 1) {
    					each_blocks_1[i].d(1);
    				}
    			}

    			if (dirty[0] & /*columns, rows, gridSize, data, showGrid*/ 6532) {
    				each_value = /*rows*/ ctx[11];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*width, gridSize*/ 20 && svg_width_value !== (svg_width_value = /*width*/ ctx[4] * (/*gridSize*/ ctx[2] + 1))) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty[0] & /*height, gridSize*/ 12 && svg_height_value !== (svg_height_value = /*height*/ ctx[3] * (/*gridSize*/ ctx[2] + 1))) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div10);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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

    function buildColumns(num) {
    	return [...Array(num)].map(c => "transparent");
    }

    function getCellColor(d, row, column) {
    	return d.length > row && d[row].length > column
    	? d[row][column]
    	: "white";
    }

    function onKeyDown(e) {
    	
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $artStore;
    	const artStore = LocalStorageStore("pixel-drawings", {});
    	validate_store(artStore, "artStore");
    	component_subscribe($$self, artStore, value => $$invalidate(37, $artStore = value));
    	let loaded = null;

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

    	let gridSize = 25;
    	let height = 20;
    	let width = 20;
    	let undos = [];
    	let redos = [];
    	let showGrid = true;
    	let data = [];
    	let mouseDown = false;
    	reset(false);

    	function reset(undoable = true) {
    		if (undoable) addUndoState();
    		$$invalidate(8, data = buildRows(height));
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
    		if (undos.length == 0) return;
    		$$invalidate(6, redos = [...redos, JSON.stringify(data)]);
    		$$invalidate(8, data = JSON.parse(undos.pop()));
    		$$invalidate(5, undos);
    	}

    	function redo() {
    		if (redos.length == 0) return;
    		$$invalidate(5, undos = [...undos, JSON.stringify(data)]);
    		$$invalidate(8, data = JSON.parse(redos.pop()));
    		$$invalidate(6, redos);
    	}

    	function setColor(row, column, color = selectedColor) {
    		// make sure we have enough rows in data to fit the value
    		if (row > data.length) {
    			const rowsNeeded = height - data.length;
    			console.log("trying to set row ", row, " but only have ", data.length, " adding " + rowsNeeded);
    			$$invalidate(8, data = data.concat(buildRows(rowsNeeded)));
    		}

    		// don't need to worry about columns.. they get auto-filled with null
    		$$invalidate(8, data[row][column] = color, data);
    	}

    	function selectColor(color) {
    		$$invalidate(1, selectedColor = color);
    	}

    	function save() {
    		const name = prompt("Give us a name", loaded || "");
    		if (name == null || name.trim().length == 0) return;

    		set_store_value(
    			artStore,
    			$artStore[name] = {
    				name,
    				gridSize,
    				width,
    				height,
    				data,
    				showGrid,
    				png: toPNG(data, width, height)
    			},
    			$artStore
    		);

    		$$invalidate(0, loaded = name);
    	}

    	function load(name) {
    		let savedDrawing = JSON.parse(JSON.stringify($artStore[name]));
    		$$invalidate(8, data = savedDrawing.data);
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

    		if ($artStore.hasOwnProperty(name)) {
    			delete $artStore[name];
    			artStore.set($artStore);
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

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<ArtMaker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ArtMaker", $$slots, []);

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
    		toPNG,
    		artStore,
    		loaded,
    		colors,
    		selectedColor,
    		gridSize,
    		height,
    		width,
    		undos,
    		redos,
    		showGrid,
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
    		onKeyDown,
    		onKeyUp,
    		savedNames,
    		$artStore,
    		previewPNG,
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
    		if ("data" in $$props) $$invalidate(8, data = $$props.data);
    		if ("mouseDown" in $$props) mouseDown = $$props.mouseDown;
    		if ("savedNames" in $$props) $$invalidate(9, savedNames = $$props.savedNames);
    		if ("previewPNG" in $$props) $$invalidate(10, previewPNG = $$props.previewPNG);
    		if ("rows" in $$props) $$invalidate(11, rows = $$props.rows);
    		if ("columns" in $$props) $$invalidate(12, columns = $$props.columns);
    	};

    	let savedNames;
    	let previewPNG;
    	let rows;
    	let columns;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*$artStore*/ 64) {
    			 $$invalidate(9, savedNames = Object.keys($artStore));
    		}

    		if ($$self.$$.dirty[0] & /*data, width, height*/ 280) {
    			 $$invalidate(10, previewPNG = toPNG(data, width, height));
    		}

    		if ($$self.$$.dirty[0] & /*height*/ 8) {
    			 $$invalidate(11, rows = [...Array(height)].map((_, i) => i));
    		}

    		if ($$self.$$.dirty[0] & /*width*/ 16) {
    			 $$invalidate(12, columns = [...Array(width)].map((_, i) => i));
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
    		data,
    		savedNames,
    		previewPNG,
    		rows,
    		columns,
    		artStore,
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
    		onKeyUp,
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

    class ArtMaker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArtMaker",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const store = LocalStorageStore('blocks', {});

    const store$1 = LocalStorageStore('pixel-drawings', {});

    /* src\pages\LevelBuilder\components\CustomGraphic.svelte generated by Svelte v3.24.1 */
    const file$1 = "src\\pages\\LevelBuilder\\components\\CustomGraphic.svelte";

    // (1:0) {#if graphic?.png != null}
    function create_if_block$2(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_title_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*graphic*/ ctx[0].png)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*graphic*/ ctx[0].name);
    			attr_dev(img, "title", img_title_value = /*graphic*/ ctx[0].name);
    			add_location(img, file$1, 1, 1, 29);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*graphic*/ 1 && img.src !== (img_src_value = /*graphic*/ ctx[0].png)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*graphic*/ 1 && img_alt_value !== (img_alt_value = /*graphic*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*graphic*/ 1 && img_title_value !== (img_title_value = /*graphic*/ ctx[0].name)) {
    				attr_dev(img, "title", img_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(1:0) {#if graphic?.png != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*graphic*/ ctx[0]?.png != null && create_if_block$2(ctx);

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
    			if (/*graphic*/ ctx[0]?.png != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { graphic } = $$props;
    	const writable_props = ["graphic"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CustomGraphic> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CustomGraphic", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("graphic" in $$props) $$invalidate(0, graphic = $$props.graphic);
    	};

    	$$self.$capture_state = () => ({ toPNG, graphic });

    	$$self.$inject_state = $$props => {
    		if ("graphic" in $$props) $$invalidate(0, graphic = $$props.graphic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*graphic*/ 1) {
    			// set png for any that haven't been saved with png yet
    			 if (graphic != null && graphic.png == null) {
    				$$invalidate(0, graphic.png = toPNG(graphic, graphic.width, graphic.height), graphic);
    			}
    		}
    	};

    	return [graphic];
    }

    class CustomGraphic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { graphic: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomGraphic",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*graphic*/ ctx[0] === undefined && !("graphic" in props)) {
    			console.warn("<CustomGraphic> was created without expected prop 'graphic'");
    		}
    	}

    	get graphic() {
    		throw new Error("<CustomGraphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graphic(value) {
    		throw new Error("<CustomGraphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\FieldGraphicPicker.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$2 } = globals;
    const file$2 = "src\\pages\\LevelBuilder\\components\\FieldGraphicPicker.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (3:8) Graphic
    function fallback_block(ctx) {
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
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(3:8) Graphic",
    		ctx
    	});

    	return block;
    }

    // (6:2) {#each options as drawingName}
    function create_each_block$1(ctx) {
    	let div;
    	let customgraphic;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	customgraphic = new CustomGraphic({
    			props: {
    				graphic: /*$artStore*/ ctx[2][/*drawingName*/ ctx[7]]
    			},
    			$$inline: true
    		});

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*drawingName*/ ctx[7], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(customgraphic.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "svelte-1u0b3hs");
    			toggle_class(div, "active", /*value*/ ctx[0] == /*drawingName*/ ctx[7]);
    			add_location(div, file$2, 6, 3, 146);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(customgraphic, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const customgraphic_changes = {};
    			if (dirty & /*$artStore, options*/ 6) customgraphic_changes.graphic = /*$artStore*/ ctx[2][/*drawingName*/ ctx[7]];
    			customgraphic.$set(customgraphic_changes);

    			if (dirty & /*value, options*/ 3) {
    				toggle_class(div, "active", /*value*/ ctx[0] == /*drawingName*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(customgraphic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(customgraphic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(customgraphic);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(6:2) {#each options as drawingName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let label;
    	let t;
    	let div0;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);
    	let each_value = /*options*/ ctx[1];
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
    			div1 = element("div");
    			label = element("label");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label, "for", "graphic");
    			add_location(label, file$2, 1, 1, 27);
    			attr_dev(div0, "class", "options svelte-1u0b3hs");
    			add_location(div0, file$2, 4, 1, 86);
    			attr_dev(div1, "class", "form-group svelte-1u0b3hs");
    			add_location(div1, file$2, 0, 0, 0);
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

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (dirty & /*value, options, $artStore*/ 7) {
    				each_value = /*options*/ ctx[1];
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
    						each_blocks[i].m(div0, null);
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
    			transition_in(default_slot_or_fallback, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			destroy_each(each_blocks, detaching);
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
    	let $artStore;
    	validate_store(store$1, "artStore");
    	component_subscribe($$self, store$1, $$value => $$invalidate(2, $artStore = $$value));
    	let { value = null } = $$props;
    	let { filter = null } = $$props;
    	const writable_props = ["value", "filter"];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FieldGraphicPicker> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FieldGraphicPicker", $$slots, ['default']);
    	const click_handler = drawingName => $$invalidate(0, value = drawingName);

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("filter" in $$props) $$invalidate(3, filter = $$props.filter);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		artStore: store$1,
    		CustomGraphic,
    		onMount,
    		value,
    		filter,
    		options,
    		$artStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("filter" in $$props) $$invalidate(3, filter = $$props.filter);
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    	};

    	let options;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$artStore, filter*/ 12) {
    			 $$invalidate(1, options = Object.keys($artStore).filter(name => filter == null || filter($artStore[name])));
    		}
    	};

    	return [value, options, $artStore, filter, $$scope, $$slots, click_handler];
    }

    class FieldGraphicPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { value: 0, filter: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldGraphicPicker",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get value() {
    		throw new Error("<FieldGraphicPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<FieldGraphicPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter() {
    		throw new Error("<FieldGraphicPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter(value) {
    		throw new Error("<FieldGraphicPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\components\FieldText.svelte generated by Svelte v3.24.1 */

    const file$3 = "src\\pages\\LevelBuilder\\components\\FieldText.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let label;
    	let t;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			if (default_slot) default_slot.c();
    			t = space();
    			input = element("input");
    			attr_dev(label, "for", /*name*/ ctx[1]);
    			add_location(label, file$3, 1, 1, 27);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			add_location(input, file$3, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$3, 0, 0, 0);
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
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
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
    			mounted = false;
    			dispose();
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
    	let { value = null } = $$props;
    	let { name = "text" } = $$props;
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

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ value, name });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, name, $$scope, $$slots, input_input_handler];
    }

    class FieldText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { value: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldText",
    			options,
    			id: create_fragment$4.name
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

    /* src\pages\LevelBuilder\components\FieldCheckbox.svelte generated by Svelte v3.24.1 */

    const file$4 = "src\\pages\\LevelBuilder\\components\\FieldCheckbox.svelte";

    function create_fragment$5(ctx) {
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
    			add_location(input, file$4, 2, 2, 55);
    			attr_dev(label, "class", "form-check-label");
    			attr_dev(label, "for", /*name*/ ctx[1]);
    			add_location(label, file$4, 3, 2, 139);
    			attr_dev(div0, "class", "form-check");
    			add_location(div0, file$4, 1, 1, 27);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$4, 0, 0, 0);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { checked: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldCheckbox",
    			options,
    			id: create_fragment$5.name
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

    const file$5 = "src\\pages\\LevelBuilder\\components\\FieldNumber.svelte";

    function create_fragment$6(ctx) {
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
    			add_location(label, file$5, 1, 1, 27);
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", /*min*/ ctx[2]);
    			attr_dev(input, "max", /*max*/ ctx[3]);
    			attr_dev(input, "step", /*step*/ ctx[4]);
    			attr_dev(input, "class", "form-control");
    			add_location(input, file$5, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$5, 0, 0, 0);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
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
    			id: create_fragment$6.name
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

    /* src\pages\LevelBuilder\components\SaveBtn.svelte generated by Svelte v3.24.1 */

    const file$6 = "src\\pages\\LevelBuilder\\components\\SaveBtn.svelte";

    // (2:7) Save
    function fallback_block$1(ctx) {
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
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(2:7) Save",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let button;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$6, 0, 0, 0);
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
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
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
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SaveBtn> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SaveBtn", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class SaveBtn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SaveBtn",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\pages\LevelBuilder\components\Form.svelte generated by Svelte v3.24.1 */
    const file$7 = "src\\pages\\LevelBuilder\\components\\Form.svelte";
    const get_buttons_slot_changes = dirty => ({});
    const get_buttons_slot_context = ctx => ({});

    function create_fragment$8(ctx) {
    	let form;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let savebtn;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	savebtn = new SaveBtn({ $$inline: true });
    	const buttons_slot_template = /*$$slots*/ ctx[1].buttons;
    	const buttons_slot = create_slot(buttons_slot_template, ctx, /*$$scope*/ ctx[0], get_buttons_slot_context);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div2 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div1 = element("div");
    			create_component(savebtn.$$.fragment);
    			t1 = space();
    			if (buttons_slot) buttons_slot.c();
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$7, 2, 2, 56);
    			attr_dev(div1, "class", "card-footer");
    			add_location(div1, file$7, 5, 2, 106);
    			attr_dev(div2, "class", "card");
    			add_location(div2, file$7, 1, 1, 34);
    			add_location(form, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div2);
    			append_dev(div2, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(savebtn, div1, null);
    			append_dev(div1, t1);

    			if (buttons_slot) {
    				buttons_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}

    			if (buttons_slot) {
    				if (buttons_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(buttons_slot, buttons_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_buttons_slot_changes, get_buttons_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(savebtn.$$.fragment, local);
    			transition_in(buttons_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(savebtn.$$.fragment, local);
    			transition_out(buttons_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(savebtn);
    			if (buttons_slot) buttons_slot.d(detaching);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Form", $$slots, ['default','buttons']);

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ SaveBtn });
    	return [$$scope, $$slots, submit_handler];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\pages\LevelBuilder\StoreNav.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$3 } = globals;
    const file$8 = "src\\pages\\LevelBuilder\\StoreNav.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (9:1) {#each Object.keys(items) as itemName}
    function create_each_block$2(ctx) {
    	let div;
    	let t0_value = /*itemName*/ ctx[5] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[4](/*itemName*/ ctx[5], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "list-group-item list-group-item-action");
    			toggle_class(div, "active", /*activeName*/ ctx[1] == /*itemName*/ ctx[5]);
    			add_location(div, file$8, 9, 2, 254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*itemName*/ ctx[5] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*activeName, Object, items*/ 3) {
    				toggle_class(div, "active", /*activeName*/ ctx[1] == /*itemName*/ ctx[5]);
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(9:1) {#each Object.keys(items) as itemName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let mounted;
    	let dispose;
    	let each_value = Object.keys(/*items*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "New";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "list-group-item list-group-item-action");
    			attr_dev(div0, "href", "#/");
    			toggle_class(div0, "active", /*items*/ ctx[0][/*activeName*/ ctx[1]] == null);
    			add_location(div0, file$8, 1, 1, 27);
    			attr_dev(div1, "class", "list-group");
    			add_location(div1, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", prevent_default(/*click_handler*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items, activeName*/ 3) {
    				toggle_class(div0, "active", /*items*/ ctx[0][/*activeName*/ ctx[1]] == null);
    			}

    			if (dirty & /*activeName, Object, items, dispatch*/ 7) {
    				each_value = Object.keys(/*items*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
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
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
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
    	let { items = {} } = $$props;
    	let { activeName = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ["items", "activeName"];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StoreNav> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("StoreNav", $$slots, []);
    	const click_handler = () => dispatch("create");
    	const click_handler_1 = itemName => dispatch("edit", itemName);

    	$$self.$$set = $$props => {
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("activeName" in $$props) $$invalidate(1, activeName = $$props.activeName);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		items,
    		activeName,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("activeName" in $$props) $$invalidate(1, activeName = $$props.activeName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items, activeName, dispatch, click_handler, click_handler_1];
    }

    class StoreNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { items: 0, activeName: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StoreNav",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get items() {
    		throw new Error("<StoreNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<StoreNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeName() {
    		throw new Error("<StoreNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeName(value) {
    		throw new Error("<StoreNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\BlockBuilder.svelte generated by Svelte v3.24.1 */
    const file$9 = "src\\pages\\LevelBuilder\\BlockBuilder.svelte";

    // (7:3) <FieldText name="name" bind:value={input.name}>
    function create_default_slot_4(ctx) {
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
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(7:3) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (8:3) <FieldGraphicPicker bind:value={input.graphic} filter={b => b.width == 20 && b.height == 20}>
    function create_default_slot_3(ctx) {
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
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(8:3) <FieldGraphicPicker bind:value={input.graphic} filter={b => b.width == 20 && b.height == 20}>",
    		ctx
    	});

    	return block;
    }

    // (9:3) <FieldCheckbox name="solid" bind:checked={input.solid}>
    function create_default_slot_2(ctx) {
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(9:3) <FieldCheckbox name=\\\"solid\\\" bind:checked={input.solid}>",
    		ctx
    	});

    	return block;
    }

    // (10:3) <FieldNumber name="dps" bind:value={input.dpsToPlayers}>
    function create_default_slot_1(ctx) {
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(10:3) <FieldNumber name=\\\"dps\\\" bind:value={input.dpsToPlayers}>",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if !isAdding}
    function create_if_block$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$9, 14, 5, 724);
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(14:4) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (13:3) <span slot="buttons">
    function create_buttons_slot(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$9, 12, 3, 675);
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
    					if_block = create_if_block$3(ctx);
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
    		source: "(13:3) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (6:2) <Form on:submit={save}>
    function create_default_slot(ctx) {
    	let fieldtext;
    	let updating_value;
    	let t0;
    	let fieldgraphicpicker;
    	let updating_value_1;
    	let t1;
    	let fieldcheckbox;
    	let updating_checked;
    	let t2;
    	let fieldnumber;
    	let updating_value_2;
    	let t3;
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		$$slots: { default: [create_default_slot_4] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext = new FieldText({ props: fieldtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext, "value", fieldtext_value_binding));

    	function fieldgraphicpicker_value_binding(value) {
    		/*fieldgraphicpicker_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldgraphicpicker_props = {
    		filter: func,
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphic !== void 0) {
    		fieldgraphicpicker_props.value = /*input*/ ctx[0].graphic;
    	}

    	fieldgraphicpicker = new FieldGraphicPicker({
    			props: fieldgraphicpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldgraphicpicker, "value", fieldgraphicpicker_value_binding));

    	function fieldcheckbox_checked_binding(value) {
    		/*fieldcheckbox_checked_binding*/ ctx[10].call(null, value);
    	}

    	let fieldcheckbox_props = {
    		name: "solid",
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].solid !== void 0) {
    		fieldcheckbox_props.checked = /*input*/ ctx[0].solid;
    	}

    	fieldcheckbox = new FieldCheckbox({
    			props: fieldcheckbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldcheckbox, "checked", fieldcheckbox_checked_binding));

    	function fieldnumber_value_binding(value) {
    		/*fieldnumber_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldnumber_props = {
    		name: "dps",
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].dpsToPlayers !== void 0) {
    		fieldnumber_props.value = /*input*/ ctx[0].dpsToPlayers;
    	}

    	fieldnumber = new FieldNumber({ props: fieldnumber_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldnumber, "value", fieldnumber_value_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext.$$.fragment);
    			t0 = space();
    			create_component(fieldgraphicpicker.$$.fragment);
    			t1 = space();
    			create_component(fieldcheckbox.$$.fragment);
    			t2 = space();
    			create_component(fieldnumber.$$.fragment);
    			t3 = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldgraphicpicker, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldcheckbox, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(fieldnumber, target, anchor);
    			insert_dev(target, t3, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				fieldtext_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext.$set(fieldtext_changes);
    			const fieldgraphicpicker_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				fieldgraphicpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldgraphicpicker_changes.value = /*input*/ ctx[0].graphic;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldgraphicpicker.$set(fieldgraphicpicker_changes);
    			const fieldcheckbox_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				fieldcheckbox_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*input*/ 1) {
    				updating_checked = true;
    				fieldcheckbox_changes.checked = /*input*/ ctx[0].solid;
    				add_flush_callback(() => updating_checked = false);
    			}

    			fieldcheckbox.$set(fieldcheckbox_changes);
    			const fieldnumber_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				fieldnumber_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber_changes.value = /*input*/ ctx[0].dpsToPlayers;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber.$set(fieldnumber_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext.$$.fragment, local);
    			transition_in(fieldgraphicpicker.$$.fragment, local);
    			transition_in(fieldcheckbox.$$.fragment, local);
    			transition_in(fieldnumber.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldgraphicpicker.$$.fragment, local);
    			transition_out(fieldcheckbox.$$.fragment, local);
    			transition_out(fieldnumber.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldgraphicpicker, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldcheckbox, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(fieldnumber, detaching);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(6:2) <Form on:submit={save}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div2;
    	let div0;
    	let storenav;
    	let t;
    	let div1;
    	let form;
    	let current;

    	storenav = new StoreNav({
    			props: {
    				items: /*$blocks*/ ctx[2],
    				activeName: /*input*/ ctx[0].name
    			},
    			$$inline: true
    		});

    	storenav.$on("create", /*create*/ ctx[5]);
    	storenav.$on("edit", /*edit_handler*/ ctx[7]);

    	form = new Form({
    			props: {
    				$$slots: {
    					default: [create_default_slot],
    					buttons: [create_buttons_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(storenav.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(form.$$.fragment);
    			attr_dev(div0, "class", "col-2");
    			add_location(div0, file$9, 1, 1, 20);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$9, 4, 1, 156);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(storenav, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(form, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const storenav_changes = {};
    			if (dirty & /*$blocks*/ 4) storenav_changes.items = /*$blocks*/ ctx[2];
    			if (dirty & /*input*/ 1) storenav_changes.activeName = /*input*/ ctx[0].name;
    			storenav.$set(storenav_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope, input, isAdding*/ 8195) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(storenav.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(storenav.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(storenav);
    			destroy_component(form);
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

    const func = b => b.width == 20 && b.height == 20;

    function instance$a($$self, $$props, $$invalidate) {
    	let $blocks;
    	validate_store(store, "blocks");
    	component_subscribe($$self, store, $$value => $$invalidate(2, $blocks = $$value));
    	let input;
    	create();

    	function save() {
    		set_store_value(store, $blocks[input.name] = JSON.parse(JSON.stringify(input)), $blocks);
    	}

    	function edit(name) {
    		$$invalidate(0, input = { ...$blocks[name] });
    	}

    	function create() {
    		$$invalidate(0, input = { name: "", solid: true, dps: 0 });
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) delete $blocks[name];
    		store.set($blocks);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BlockBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BlockBuilder", $$slots, []);
    	const edit_handler = e => edit(e.detail);

    	function fieldtext_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldgraphicpicker_value_binding(value) {
    		input.graphic = value;
    		$$invalidate(0, input);
    	}

    	function fieldcheckbox_checked_binding(value) {
    		input.solid = value;
    		$$invalidate(0, input);
    	}

    	function fieldnumber_value_binding(value) {
    		input.dpsToPlayers = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$capture_state = () => ({
    		blocks: store,
    		FieldGraphicPicker,
    		FieldText,
    		FieldCheckbox,
    		FieldNumber,
    		Form,
    		StoreNav,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		isAdding,
    		$blocks
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("isAdding" in $$props) $$invalidate(1, isAdding = $$props.isAdding);
    	};

    	let isAdding;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$blocks, input*/ 5) {
    			 $$invalidate(1, isAdding = $blocks[input.name] == null);
    		}
    	};

    	return [
    		input,
    		isAdding,
    		$blocks,
    		save,
    		edit,
    		create,
    		del,
    		edit_handler,
    		fieldtext_value_binding,
    		fieldgraphicpicker_value_binding,
    		fieldcheckbox_checked_binding,
    		fieldnumber_value_binding,
    		click_handler
    	];
    }

    class BlockBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlockBuilder",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const store$2 = LocalStorageStore('characters', {});

    /* src\pages\LevelBuilder\CharacterBuilder.svelte generated by Svelte v3.24.1 */
    const file$a = "src\\pages\\LevelBuilder\\CharacterBuilder.svelte";

    // (21:3) <FieldText name="name" bind:value={input.name}>
    function create_default_slot_8(ctx) {
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
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(21:3) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (22:3) <FieldGraphicPicker bind:value={input.graphicStill} filter={b => b.width != 20 || b.height != 20}>
    function create_default_slot_7(ctx) {
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
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(22:3) <FieldGraphicPicker bind:value={input.graphicStill} filter={b => b.width != 20 || b.height != 20}>",
    		ctx
    	});

    	return block;
    }

    // (26:3) <FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>
    function create_default_slot_6(ctx) {
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
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(26:3) <FieldNumber name=\\\"maxVelocity\\\" min={0} bind:value={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (27:3) <FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>
    function create_default_slot_5(ctx) {
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
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(27:3) <FieldNumber name=\\\"jumpVelocity\\\" min={0} bind:value={input.jumpVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (28:3) <FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>
    function create_default_slot_4$1(ctx) {
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
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(28:3) <FieldNumber name=\\\"gravityMultiplier\\\" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (29:3) <FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>
    function create_default_slot_3$1(ctx) {
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
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(29:3) <FieldNumber name=\\\"fallDamageMultiplier\\\" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (30:3) <FieldNumber name="maxHealth" bind:value={input.maxHealth}>
    function create_default_slot_2$1(ctx) {
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
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(30:3) <FieldNumber name=\\\"maxHealth\\\" bind:value={input.maxHealth}>",
    		ctx
    	});

    	return block;
    }

    // (31:3) <FieldNumber name="dps" bind:value={input.dpsToPlayers}>
    function create_default_slot_1$1(ctx) {
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(31:3) <FieldNumber name=\\\"dps\\\" bind:value={input.dpsToPlayers}>",
    		ctx
    	});

    	return block;
    }

    // (35:4) {#if !isAdding}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$a, 35, 5, 2114);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(35:4) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (34:3) <span slot="buttons">
    function create_buttons_slot$1(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$a, 33, 3, 2065);
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
    					if_block = create_if_block$4(ctx);
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
    		source: "(34:3) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:2) <Form on:submit={save}>
    function create_default_slot$1(ctx) {
    	let fieldtext;
    	let updating_value;
    	let t0;
    	let fieldgraphicpicker;
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
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		$$slots: { default: [create_default_slot_8] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext = new FieldText({ props: fieldtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext, "value", fieldtext_value_binding));

    	function fieldgraphicpicker_value_binding(value) {
    		/*fieldgraphicpicker_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldgraphicpicker_props = {
    		filter: func$1,
    		$$slots: { default: [create_default_slot_7] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphicStill !== void 0) {
    		fieldgraphicpicker_props.value = /*input*/ ctx[0].graphicStill;
    	}

    	fieldgraphicpicker = new FieldGraphicPicker({
    			props: fieldgraphicpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldgraphicpicker, "value", fieldgraphicpicker_value_binding));

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[10].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "maxVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_6] },
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
    		$$slots: { default: [create_default_slot_5] },
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
    		$$slots: { default: [create_default_slot_4$1] },
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
    		name: "fallDamageMultiplier",
    		min: 0,
    		max: 1,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_3$1] },
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
    		/*fieldnumber4_value_binding*/ ctx[14].call(null, value);
    	}

    	let fieldnumber4_props = {
    		name: "maxHealth",
    		$$slots: { default: [create_default_slot_2$1] },
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
    		/*fieldnumber5_value_binding*/ ctx[15].call(null, value);
    	}

    	let fieldnumber5_props = {
    		name: "dps",
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].dpsToPlayers !== void 0) {
    		fieldnumber5_props.value = /*input*/ ctx[0].dpsToPlayers;
    	}

    	fieldnumber5 = new FieldNumber({
    			props: fieldnumber5_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber5, "value", fieldnumber5_value_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext.$$.fragment);
    			t0 = space();
    			create_component(fieldgraphicpicker.$$.fragment);
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
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldgraphicpicker, target, anchor);
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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldtext_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext.$set(fieldtext_changes);
    			const fieldgraphicpicker_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldgraphicpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldgraphicpicker_changes.value = /*input*/ ctx[0].graphicStill;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldgraphicpicker.$set(fieldgraphicpicker_changes);
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].maxVelocity;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].jumpVelocity;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].gravityMultiplier;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_5 && dirty & /*input*/ 1) {
    				updating_value_5 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].fallDamageMultiplier;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldnumber4_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_6 && dirty & /*input*/ 1) {
    				updating_value_6 = true;
    				fieldnumber4_changes.value = /*input*/ ctx[0].maxHealth;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			fieldnumber4.$set(fieldnumber4_changes);
    			const fieldnumber5_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber5_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_7 && dirty & /*input*/ 1) {
    				updating_value_7 = true;
    				fieldnumber5_changes.value = /*input*/ ctx[0].dpsToPlayers;
    				add_flush_callback(() => updating_value_7 = false);
    			}

    			fieldnumber5.$set(fieldnumber5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext.$$.fragment, local);
    			transition_in(fieldgraphicpicker.$$.fragment, local);
    			transition_in(fieldnumber0.$$.fragment, local);
    			transition_in(fieldnumber1.$$.fragment, local);
    			transition_in(fieldnumber2.$$.fragment, local);
    			transition_in(fieldnumber3.$$.fragment, local);
    			transition_in(fieldnumber4.$$.fragment, local);
    			transition_in(fieldnumber5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldgraphicpicker.$$.fragment, local);
    			transition_out(fieldnumber0.$$.fragment, local);
    			transition_out(fieldnumber1.$$.fragment, local);
    			transition_out(fieldnumber2.$$.fragment, local);
    			transition_out(fieldnumber3.$$.fragment, local);
    			transition_out(fieldnumber4.$$.fragment, local);
    			transition_out(fieldnumber5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldgraphicpicker, detaching);
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(20:2) <Form on:submit={save}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div2;
    	let div0;
    	let storenav;
    	let t;
    	let div1;
    	let form;
    	let current;

    	storenav = new StoreNav({
    			props: {
    				items: /*$characters*/ ctx[2],
    				activeName: /*input*/ ctx[0].name
    			},
    			$$inline: true
    		});

    	storenav.$on("create", /*create*/ ctx[5]);
    	storenav.$on("edit", /*edit_handler*/ ctx[7]);

    	form = new Form({
    			props: {
    				$$slots: {
    					default: [create_default_slot$1],
    					buttons: [create_buttons_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(storenav.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(form.$$.fragment);
    			attr_dev(div0, "class", "col-2");
    			add_location(div0, file$a, 15, 1, 618);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$a, 18, 1, 758);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$a, 14, 0, 598);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(storenav, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(form, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const storenav_changes = {};
    			if (dirty & /*$characters*/ 4) storenav_changes.items = /*$characters*/ ctx[2];
    			if (dirty & /*input*/ 1) storenav_changes.activeName = /*input*/ ctx[0].name;
    			storenav.$set(storenav_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope, input, isAdding*/ 131075) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(storenav.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(storenav.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(storenav);
    			destroy_component(form);
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

    const func$1 = b => b.width != 20 || b.height != 20;

    function instance$b($$self, $$props, $$invalidate) {
    	let $characters;
    	validate_store(store$2, "characters");
    	component_subscribe($$self, store$2, $$value => $$invalidate(2, $characters = $$value));
    	let input;
    	create();

    	function save() {
    		set_store_value(store$2, $characters[input.name] = JSON.parse(JSON.stringify(input)), $characters);
    	}

    	function edit(name) {
    		$$invalidate(0, input = { ...$characters[name] });
    	}

    	function create() {
    		$$invalidate(0, input = {
    			graphicStill: null,
    			name: "",
    			maxVelocity: 20,
    			jumpVelocity: 15,
    			gravityMultiplier: 1,
    			fallDamageMultiplier: 1,
    			dps: 120
    		});
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) delete $characters[name];
    		store$2.set($characters);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CharacterBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CharacterBuilder", $$slots, []);
    	const edit_handler = e => edit(e.detail);

    	function fieldtext_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldgraphicpicker_value_binding(value) {
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
    		input.dpsToPlayers = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$capture_state = () => ({
    		characters: store$2,
    		FieldGraphicPicker,
    		FieldText,
    		FieldCheckbox,
    		FieldNumber,
    		Form,
    		StoreNav,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		isAdding,
    		$characters
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("isAdding" in $$props) $$invalidate(1, isAdding = $$props.isAdding);
    	};

    	let isAdding;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$characters, input*/ 5) {
    			 $$invalidate(1, isAdding = $characters[input.name] == null);
    		}
    	};

    	return [
    		input,
    		isAdding,
    		$characters,
    		save,
    		edit,
    		create,
    		del,
    		edit_handler,
    		fieldtext_value_binding,
    		fieldgraphicpicker_value_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldnumber2_value_binding,
    		fieldnumber3_value_binding,
    		fieldnumber4_value_binding,
    		fieldnumber5_value_binding,
    		click_handler
    	];
    }

    class CharacterBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CharacterBuilder",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const store$3 = LocalStorageStore('enemies', {});

    /* src\pages\LevelBuilder\EnemyBuilder.svelte generated by Svelte v3.24.1 */
    const file$b = "src\\pages\\LevelBuilder\\EnemyBuilder.svelte";

    // (18:3) <FieldText name="name" bind:value={input.name}>
    function create_default_slot_8$1(ctx) {
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
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(18:3) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (19:3) <FieldGraphicPicker bind:value={input.graphicStill} filter={b => b.width != 20 || b.height != 20}>
    function create_default_slot_7$1(ctx) {
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
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(19:3) <FieldGraphicPicker bind:value={input.graphicStill} filter={b => b.width != 20 || b.height != 20}>",
    		ctx
    	});

    	return block;
    }

    // (23:3) <FieldNumber name="maxVelocity" min={0} bind:value={input.maxVelocity}>
    function create_default_slot_6$1(ctx) {
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
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(23:3) <FieldNumber name=\\\"maxVelocity\\\" min={0} bind:value={input.maxVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (24:3) <FieldNumber name="jumpVelocity" min={0} bind:value={input.jumpVelocity}>
    function create_default_slot_5$1(ctx) {
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
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(24:3) <FieldNumber name=\\\"jumpVelocity\\\" min={0} bind:value={input.jumpVelocity}>",
    		ctx
    	});

    	return block;
    }

    // (25:3) <FieldNumber name="gravityMultiplier" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>
    function create_default_slot_4$2(ctx) {
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
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(25:3) <FieldNumber name=\\\"gravityMultiplier\\\" min={0} max={2} step={0.1} bind:value={input.gravityMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (26:3) <FieldNumber name="fallDamageMultiplier" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>
    function create_default_slot_3$2(ctx) {
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
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(26:3) <FieldNumber name=\\\"fallDamageMultiplier\\\" min={0} max={1} step={0.1} bind:value={input.fallDamageMultiplier}>",
    		ctx
    	});

    	return block;
    }

    // (27:3) <FieldNumber name="maxHealth" bind:value={input.maxHealth}>
    function create_default_slot_2$2(ctx) {
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
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(27:3) <FieldNumber name=\\\"maxHealth\\\" bind:value={input.maxHealth}>",
    		ctx
    	});

    	return block;
    }

    // (28:3) <FieldNumber name="dps" bind:value={input.dpsToPlayers}>
    function create_default_slot_1$2(ctx) {
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(28:3) <FieldNumber name=\\\"dps\\\" bind:value={input.dpsToPlayers}>",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if !isAdding}
    function create_if_block$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$b, 32, 5, 1721);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(32:4) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (31:3) <span slot="buttons">
    function create_buttons_slot$2(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$b, 30, 3, 1672);
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
    					if_block = create_if_block$5(ctx);
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
    		source: "(31:3) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:2) <Form on:submit={save}>
    function create_default_slot$2(ctx) {
    	let fieldtext;
    	let updating_value;
    	let t0;
    	let fieldgraphicpicker;
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
    	let current;

    	function fieldtext_value_binding(value) {
    		/*fieldtext_value_binding*/ ctx[8].call(null, value);
    	}

    	let fieldtext_props = {
    		name: "name",
    		$$slots: { default: [create_default_slot_8$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext = new FieldText({ props: fieldtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext, "value", fieldtext_value_binding));

    	function fieldgraphicpicker_value_binding(value) {
    		/*fieldgraphicpicker_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldgraphicpicker_props = {
    		filter: func$2,
    		$$slots: { default: [create_default_slot_7$1] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].graphicStill !== void 0) {
    		fieldgraphicpicker_props.value = /*input*/ ctx[0].graphicStill;
    	}

    	fieldgraphicpicker = new FieldGraphicPicker({
    			props: fieldgraphicpicker_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldgraphicpicker, "value", fieldgraphicpicker_value_binding));

    	function fieldnumber0_value_binding(value) {
    		/*fieldnumber0_value_binding*/ ctx[10].call(null, value);
    	}

    	let fieldnumber0_props = {
    		name: "maxVelocity",
    		min: 0,
    		$$slots: { default: [create_default_slot_6$1] },
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
    		$$slots: { default: [create_default_slot_5$1] },
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
    		$$slots: { default: [create_default_slot_4$2] },
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
    		name: "fallDamageMultiplier",
    		min: 0,
    		max: 1,
    		step: 0.1,
    		$$slots: { default: [create_default_slot_3$2] },
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
    		/*fieldnumber4_value_binding*/ ctx[14].call(null, value);
    	}

    	let fieldnumber4_props = {
    		name: "maxHealth",
    		$$slots: { default: [create_default_slot_2$2] },
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
    		/*fieldnumber5_value_binding*/ ctx[15].call(null, value);
    	}

    	let fieldnumber5_props = {
    		name: "dps",
    		$$slots: { default: [create_default_slot_1$2] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].dpsToPlayers !== void 0) {
    		fieldnumber5_props.value = /*input*/ ctx[0].dpsToPlayers;
    	}

    	fieldnumber5 = new FieldNumber({
    			props: fieldnumber5_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldnumber5, "value", fieldnumber5_value_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext.$$.fragment);
    			t0 = space();
    			create_component(fieldgraphicpicker.$$.fragment);
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
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldgraphicpicker, target, anchor);
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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldtext_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext.$set(fieldtext_changes);
    			const fieldgraphicpicker_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldgraphicpicker_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldgraphicpicker_changes.value = /*input*/ ctx[0].graphicStill;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldgraphicpicker.$set(fieldgraphicpicker_changes);
    			const fieldnumber0_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldnumber0_changes.value = /*input*/ ctx[0].maxVelocity;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldnumber0.$set(fieldnumber0_changes);
    			const fieldnumber1_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*input*/ 1) {
    				updating_value_3 = true;
    				fieldnumber1_changes.value = /*input*/ ctx[0].jumpVelocity;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			fieldnumber1.$set(fieldnumber1_changes);
    			const fieldnumber2_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_4 && dirty & /*input*/ 1) {
    				updating_value_4 = true;
    				fieldnumber2_changes.value = /*input*/ ctx[0].gravityMultiplier;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			fieldnumber2.$set(fieldnumber2_changes);
    			const fieldnumber3_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_5 && dirty & /*input*/ 1) {
    				updating_value_5 = true;
    				fieldnumber3_changes.value = /*input*/ ctx[0].fallDamageMultiplier;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			fieldnumber3.$set(fieldnumber3_changes);
    			const fieldnumber4_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_6 && dirty & /*input*/ 1) {
    				updating_value_6 = true;
    				fieldnumber4_changes.value = /*input*/ ctx[0].maxHealth;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			fieldnumber4.$set(fieldnumber4_changes);
    			const fieldnumber5_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				fieldnumber5_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_7 && dirty & /*input*/ 1) {
    				updating_value_7 = true;
    				fieldnumber5_changes.value = /*input*/ ctx[0].dpsToPlayers;
    				add_flush_callback(() => updating_value_7 = false);
    			}

    			fieldnumber5.$set(fieldnumber5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext.$$.fragment, local);
    			transition_in(fieldgraphicpicker.$$.fragment, local);
    			transition_in(fieldnumber0.$$.fragment, local);
    			transition_in(fieldnumber1.$$.fragment, local);
    			transition_in(fieldnumber2.$$.fragment, local);
    			transition_in(fieldnumber3.$$.fragment, local);
    			transition_in(fieldnumber4.$$.fragment, local);
    			transition_in(fieldnumber5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext.$$.fragment, local);
    			transition_out(fieldgraphicpicker.$$.fragment, local);
    			transition_out(fieldnumber0.$$.fragment, local);
    			transition_out(fieldnumber1.$$.fragment, local);
    			transition_out(fieldnumber2.$$.fragment, local);
    			transition_out(fieldnumber3.$$.fragment, local);
    			transition_out(fieldnumber4.$$.fragment, local);
    			transition_out(fieldnumber5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldgraphicpicker, detaching);
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(17:2) <Form on:submit={save}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div2;
    	let div0;
    	let storenav;
    	let t;
    	let div1;
    	let form;
    	let current;

    	storenav = new StoreNav({
    			props: {
    				items: /*$enemies*/ ctx[2],
    				activeName: /*input*/ ctx[0].name
    			},
    			$$inline: true
    		});

    	storenav.$on("create", /*create*/ ctx[5]);
    	storenav.$on("edit", /*edit_handler*/ ctx[7]);

    	form = new Form({
    			props: {
    				$$slots: {
    					default: [create_default_slot$2],
    					buttons: [create_buttons_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(storenav.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(form.$$.fragment);
    			attr_dev(div0, "class", "col-2");
    			add_location(div0, file$b, 12, 1, 229);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$b, 15, 1, 366);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$b, 11, 0, 209);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(storenav, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(form, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const storenav_changes = {};
    			if (dirty & /*$enemies*/ 4) storenav_changes.items = /*$enemies*/ ctx[2];
    			if (dirty & /*input*/ 1) storenav_changes.activeName = /*input*/ ctx[0].name;
    			storenav.$set(storenav_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope, input, isAdding*/ 131075) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(storenav.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(storenav.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(storenav);
    			destroy_component(form);
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

    const func$2 = b => b.width != 20 || b.height != 20;

    function instance$c($$self, $$props, $$invalidate) {
    	let $enemies;
    	validate_store(store$3, "enemies");
    	component_subscribe($$self, store$3, $$value => $$invalidate(2, $enemies = $$value));
    	let input;
    	create();

    	function save() {
    		set_store_value(store$3, $enemies[input.name] = JSON.parse(JSON.stringify(input)), $enemies);
    	}

    	function edit(name) {
    		$$invalidate(0, input = { ...$enemies[name] });
    	}

    	function create() {
    		$$invalidate(0, input = {
    			graphicStill: null,
    			name: "",
    			maxVelocity: 20,
    			jumpVelocity: 15,
    			gravityMultiplier: 1,
    			fallDamageMultiplier: 1,
    			dps: 120
    		});
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) delete $enemies[name];
    		store$3.set($enemies);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EnemyBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EnemyBuilder", $$slots, []);
    	const edit_handler = e => edit(e.detail);

    	function fieldtext_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldgraphicpicker_value_binding(value) {
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
    		input.dpsToPlayers = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$capture_state = () => ({
    		enemies: store$3,
    		FieldGraphicPicker,
    		FieldText,
    		FieldCheckbox,
    		FieldNumber,
    		Form,
    		StoreNav,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		isAdding,
    		$enemies
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("isAdding" in $$props) $$invalidate(1, isAdding = $$props.isAdding);
    	};

    	let isAdding;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$enemies, input*/ 5) {
    			 $$invalidate(1, isAdding = $enemies[input.name] == null);
    		}
    	};

    	return [
    		input,
    		isAdding,
    		$enemies,
    		save,
    		edit,
    		create,
    		del,
    		edit_handler,
    		fieldtext_value_binding,
    		fieldgraphicpicker_value_binding,
    		fieldnumber0_value_binding,
    		fieldnumber1_value_binding,
    		fieldnumber2_value_binding,
    		fieldnumber3_value_binding,
    		fieldnumber4_value_binding,
    		fieldnumber5_value_binding,
    		click_handler
    	];
    }

    class EnemyBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EnemyBuilder",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\pages\LevelBuilder\components\FieldMultiSelect.svelte generated by Svelte v3.24.1 */

    const file$c = "src\\pages\\LevelBuilder\\components\\FieldMultiSelect.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each options as option}
    function create_each_block$3(ctx) {
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
    			add_location(option, file$c, 6, 3, 171);
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(6:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
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
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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
    			add_location(label, file$c, 1, 1, 27);
    			select.multiple = true;
    			attr_dev(select, "name", /*name*/ ctx[1]);
    			attr_dev(select, "id", /*name*/ ctx[1]);
    			attr_dev(select, "class", "form-control");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$c, 4, 1, 71);
    			attr_dev(div, "class", "form-group");
    			add_location(div, file$c, 0, 0, 0);
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
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { value: 0, name: 1, options: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldMultiSelect",
    			options,
    			id: create_fragment$d.name
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

    const store$4 = LocalStorageStore('level-store', {});

    /* src\pages\BubTheBobcat\Level.svelte generated by Svelte v3.24.1 */

    const file$d = "src\\pages\\BubTheBobcat\\Level.svelte";

    function create_fragment$e(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", /*width*/ ctx[0]);
    			attr_dev(canvas_1, "height", /*height*/ ctx[1]);
    			set_style(canvas_1, "position", "absolute");
    			set_style(canvas_1, "bottom", "0px");
    			set_style(canvas_1, "left", "0px");
    			add_location(canvas_1, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[4](canvas_1);
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
    			/*canvas_1_binding*/ ctx[4](null);
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
    	let { width = 0 } = $$props;
    	let { height = 0 } = $$props;
    	let { blocks = [] } = $$props;
    	let canvas;
    	let drawnBlocks = [];
    	const imageCache = {};
    	const writable_props = ["width", "height", "blocks"];

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
    	};

    	$$self.$capture_state = () => ({
    		width,
    		height,
    		blocks,
    		canvas,
    		drawnBlocks,
    		imageCache
    	});

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("blocks" in $$props) $$invalidate(3, blocks = $$props.blocks);
    		if ("canvas" in $$props) $$invalidate(2, canvas = $$props.canvas);
    		if ("drawnBlocks" in $$props) $$invalidate(5, drawnBlocks = $$props.drawnBlocks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*blocks, canvas, drawnBlocks, imageCache*/ 108) {
    			 if (blocks != null && canvas != null) {
    				let ctx = canvas.getContext("2d");

    				// erase any blocks that are drawn that aren't in the new array
    				const toErase = drawnBlocks.filter(db => !blocks.some(b => db.x == b.x && db.y == b.y && db.png == b.png));

    				const toDraw = blocks.filter(b => !drawnBlocks.some(db => db.x == b.x && db.y == b.y && db.png == b.png));
    				toErase.forEach(b => ctx.clearRect(b.x, b.y, b.width, b.height));

    				toDraw.forEach(b => {
    					if (b.png) {
    						let drawing = imageCache[b.png];

    						if (drawing == null) {
    							drawing = new Image();
    							drawing.src = b.png;
    							$$invalidate(6, imageCache[b.png] = drawing, imageCache);
    							drawing.onload = () => ctx.drawImage(drawing, b.x, b.y);
    						} else {
    							ctx.drawImage(drawing, b.x, b.y);
    						}
    					} else {
    						// temporarily supporting old data format with colors instead of pngs
    						ctx.beginPath();

    						ctx.rect(b.x, b.y, b.width, b.height);
    						ctx.fillStyle = b.color;
    						ctx.fill();

    						// draw a line on top
    						ctx.beginPath();

    						ctx.moveTo(b.x, b.y + b.height);
    						ctx.lineTo(b.x + b.width, b.y + b.height);
    						ctx.strokeStyle = "black";
    						ctx.stroke();
    					}
    				});

    				$$invalidate(5, drawnBlocks = JSON.parse(JSON.stringify(blocks)));
    			}
    		}
    	};

    	return [width, height, canvas, blocks, canvas_1_binding];
    }

    class Level extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { width: 0, height: 1, blocks: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$e.name
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
    }

    /* src\pages\BubTheBobcat\HealthBar.svelte generated by Svelte v3.24.1 */

    const file$e = "src\\pages\\BubTheBobcat\\HealthBar.svelte";

    function create_fragment$f(ctx) {
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
    			add_location(div0, file$e, 3, 1, 72);
    			attr_dev(div1, "class", "text svelte-nlzclx");
    			add_location(div1, file$e, 4, 1, 157);
    			attr_dev(div2, "class", "health-bar svelte-nlzclx");
    			add_location(div2, file$e, 2, 0, 45);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { percent: 3, health: 4, maxHealth: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HealthBar",
    			options,
    			id: create_fragment$f.name
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

    /* src\pages\BubTheBobcat\Enemy.svelte generated by Svelte v3.24.1 */
    const file$f = "src\\pages\\BubTheBobcat\\Enemy.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let healthbar;
    	let t;
    	let svg;
    	let path0;
    	let path1_1;
    	let current;

    	healthbar = new HealthBar({
    			props: {
    				health: /*health*/ ctx[5],
    				maxHealth: /*maxHealth*/ ctx[6]
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
    			add_location(path0, file$f, 9, 2, 392);
    			attr_dev(path1_1, "d", /*path2*/ ctx[11]);
    			attr_dev(path1_1, "fill", /*eyeColor*/ ctx[9]);
    			add_location(path1_1, file$f, 10, 2, 431);
    			attr_dev(svg, "class", "graphic svelte-1x7nj5j");
    			set_style(svg, "width", /*width*/ ctx[3] + "px");
    			set_style(svg, "height", /*height*/ ctx[4] + "px");

    			set_style(svg, "transform", "scaleX(" + /*direction*/ ctx[7] + ") rotate(" + (-4 + (/*vy*/ ctx[0] > 0
    			? /*vy*/ ctx[0] * 3
    			: /*vy*/ ctx[0] * 1.5)) + "deg)");

    			set_style(svg, "opacity", /*health*/ ctx[5] <= 0 ? 0.2 : 1);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 10 1024 749");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xml:space", "preserve");
    			add_location(svg, file$f, 2, 1, 95);
    			attr_dev(div, "class", "enemy svelte-1x7nj5j");
    			set_style(div, "left", /*x*/ ctx[1] + "px");
    			set_style(div, "bottom", /*y*/ ctx[2] + "px");
    			add_location(div, file$f, 0, 0, 0);
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
    			if (dirty & /*health*/ 32) healthbar_changes.health = /*health*/ ctx[5];
    			if (dirty & /*maxHealth*/ 64) healthbar_changes.maxHealth = /*maxHealth*/ ctx[6];
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

    			if (!current || dirty & /*direction, vy*/ 129) {
    				set_style(svg, "transform", "scaleX(" + /*direction*/ ctx[7] + ") rotate(" + (-4 + (/*vy*/ ctx[0] > 0
    				? /*vy*/ ctx[0] * 3
    				: /*vy*/ ctx[0] * 1.5)) + "deg)");
    			}

    			if (!current || dirty & /*health*/ 32) {
    				set_style(svg, "opacity", /*health*/ ctx[5] <= 0 ? 0.2 : 1);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { vx = 0 } = $$props;
    	let { vy = 0 } = $$props;
    	let { x = 0 } = $$props;
    	let { y = 0 } = $$props;
    	let { width = 75 } = $$props;
    	let { height = 50 } = $$props;
    	let { isBoss = false } = $$props;
    	let { health = 100 } = $$props;
    	let { maxHealth = 100 } = $$props;
    	let { gettingHit = false } = $$props;
    	let direction = 1;
    	const path1 = `M560,128H528a15.99954,15.99954,0,0,0-16,16v80H480V176a15.99954,15.99954,0,0,0-16-16H416V96h48a16.00079,16.00079,0,0,0,16-16V48a15.99954,15.99954,0,0,0-16-16H432a15.99954,15.99954,0,0,0-16,16V64H368a15.99954,15.99954,0,0,0-16,16v48H224V80a15.99954,15.99954,0,0,0-16-16H160V48a15.99954,15.99954,0,0,0-16-16H112A15.99954,15.99954,0,0,0,96,48V80a16.00079,16.00079,0,0,0,16,16h48v64H112a15.99954,15.99954,0,0,0-16,16v48H64V144a15.99954,15.99954,0,0,0-16-16H16A15.99954,15.99954,0,0,0,0,144V272a16.00079,16.00079,0,0,0,16,16H64v80a16.00079,16.00079,0,0,0,16,16h48v80a16.00079,16.00079,0,0,0,16,16h96a16.00079,16.00079,0,0,0,16-16V432a15.99954,15.99954,0,0,0-16-16H192V384H384v32H336a15.99954,15.99954,0,0,0-16,16v32a16.00079,16.00079,0,0,0,16,16h96a16.00079,16.00079,0,0,0,16-16V384h48a16.00079,16.00079,0,0,0,16-16V288h48a16.00079,16.00079,0,0,0,16-16V144A15.99954,15.99954,0,0,0,560,128ZM224,320H160V224h64Zm192,0H352V224h64Z`;
    	const path2 = `M160,320h64V224H160Zm192-96v96h64V224Z`;

    	const writable_props = [
    		"vx",
    		"vy",
    		"x",
    		"y",
    		"width",
    		"height",
    		"isBoss",
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
    		if ("vx" in $$props) $$invalidate(12, vx = $$props.vx);
    		if ("vy" in $$props) $$invalidate(0, vy = $$props.vy);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("isBoss" in $$props) $$invalidate(13, isBoss = $$props.isBoss);
    		if ("health" in $$props) $$invalidate(5, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(6, maxHealth = $$props.maxHealth);
    		if ("gettingHit" in $$props) $$invalidate(14, gettingHit = $$props.gettingHit);
    	};

    	$$self.$capture_state = () => ({
    		HealthBar,
    		vx,
    		vy,
    		x,
    		y,
    		width,
    		height,
    		isBoss,
    		health,
    		maxHealth,
    		gettingHit,
    		direction,
    		path1,
    		path2,
    		bodyColor,
    		eyeColor
    	});

    	$$self.$inject_state = $$props => {
    		if ("vx" in $$props) $$invalidate(12, vx = $$props.vx);
    		if ("vy" in $$props) $$invalidate(0, vy = $$props.vy);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("isBoss" in $$props) $$invalidate(13, isBoss = $$props.isBoss);
    		if ("health" in $$props) $$invalidate(5, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(6, maxHealth = $$props.maxHealth);
    		if ("gettingHit" in $$props) $$invalidate(14, gettingHit = $$props.gettingHit);
    		if ("direction" in $$props) $$invalidate(7, direction = $$props.direction);
    		if ("bodyColor" in $$props) $$invalidate(8, bodyColor = $$props.bodyColor);
    		if ("eyeColor" in $$props) $$invalidate(9, eyeColor = $$props.eyeColor);
    	};

    	let bodyColor;
    	let eyeColor;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*vx*/ 4096) {
    			 if (vx != 0) $$invalidate(7, direction = vx > 0 ? 1 : -1);
    		}

    		if ($$self.$$.dirty & /*health, gettingHit, isBoss*/ 24608) {
    			 $$invalidate(8, bodyColor = health <= 0
    			? "#333333"
    			: gettingHit ? "#ffffff" : isBoss ? "#000" : "#79cf00");
    		}

    		if ($$self.$$.dirty & /*health, gettingHit, isBoss*/ 24608) {
    			 $$invalidate(9, eyeColor = health <= 0
    			? "#000000"
    			: gettingHit ? "#0000ff" : isBoss ? "red" : "#cf7900");
    		}
    	};

    	return [
    		vy,
    		x,
    		y,
    		width,
    		height,
    		health,
    		maxHealth,
    		direction,
    		bodyColor,
    		eyeColor,
    		path1,
    		path2,
    		vx,
    		isBoss,
    		gettingHit
    	];
    }

    class Enemy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			vx: 12,
    			vy: 0,
    			x: 1,
    			y: 2,
    			width: 3,
    			height: 4,
    			isBoss: 13,
    			health: 5,
    			maxHealth: 6,
    			gettingHit: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Enemy",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get vx() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vx(value) {
    		throw new Error("<Enemy>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vy() {
    		throw new Error("<Enemy>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vy(value) {
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

    /* src\pages\LevelBuilder\components\LevelBuilderDataEditor.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$4 } = globals;
    const file$g = "src\\pages\\LevelBuilder\\components\\LevelBuilderDataEditor.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (3:1) {#each Object.keys($blockStore) as name}
    function create_each_block$4(ctx) {
    	let button;
    	let customgraphic;
    	let t;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	customgraphic = new CustomGraphic({
    			props: {
    				graphic: /*$artStore*/ ctx[5][/*$blockStore*/ ctx[6][/*name*/ ctx[23]].graphic]
    			},
    			$$inline: true
    		});

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[13](/*name*/ ctx[23], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(customgraphic.$$.fragment);
    			t = space();

    			attr_dev(button, "class", button_class_value = "btn btn-" + (/*name*/ ctx[23] == /*selectedBlock*/ ctx[2]
    			? "primary"
    			: "default") + " svelte-1kr1on8");

    			add_location(button, file$g, 3, 2, 98);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(customgraphic, button, null);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const customgraphic_changes = {};
    			if (dirty & /*$artStore, $blockStore*/ 96) customgraphic_changes.graphic = /*$artStore*/ ctx[5][/*$blockStore*/ ctx[6][/*name*/ ctx[23]].graphic];
    			customgraphic.$set(customgraphic_changes);

    			if (!current || dirty & /*$blockStore, selectedBlock*/ 68 && button_class_value !== (button_class_value = "btn btn-" + (/*name*/ ctx[23] == /*selectedBlock*/ ctx[2]
    			? "primary"
    			: "default") + " svelte-1kr1on8")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(customgraphic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(customgraphic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(customgraphic);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(3:1) {#each Object.keys($blockStore) as name}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div0;
    	let strong;
    	let t1;
    	let t2;
    	let div2;
    	let div1;
    	let t3;
    	let level;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = Object.keys(/*$blockStore*/ ctx[6]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	level = new Level({
    			props: {
    				blocks: /*blocks*/ ctx[0],
    				width: /*width*/ ctx[4],
    				height: /*height*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			strong = element("strong");
    			strong.textContent = "Blocks";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t3 = space();
    			create_component(level.$$.fragment);
    			add_location(strong, file$g, 1, 1, 28);
    			attr_dev(div0, "class", "tool-picker svelte-1kr1on8");
    			add_location(div0, file$g, 0, 0, 0);
    			attr_dev(div1, "class", "level-overlay svelte-1kr1on8");
    			add_location(div1, file$g, 18, 1, 698);
    			attr_dev(div2, "class", "level-container svelte-1kr1on8");
    			set_style(div2, "background", /*background*/ ctx[1]);
    			add_location(div2, file$g, 17, 0, 632);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, strong);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div2, t3);
    			mount_component(level, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mousedown", /*onMouseDown*/ ctx[8], false, false, false),
    					listen_dev(div1, "mouseup", /*onMouseUp*/ ctx[10], false, false, false),
    					listen_dev(div1, "mousemove", /*onMouseMove*/ ctx[9], false, false, false),
    					listen_dev(div1, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[12]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, $blockStore, selectedBlock, selectBlock, $artStore*/ 228) {
    				each_value = Object.keys(/*$blockStore*/ ctx[6]);
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
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const level_changes = {};
    			if (dirty & /*blocks*/ 1) level_changes.blocks = /*blocks*/ ctx[0];
    			if (dirty & /*width*/ 16) level_changes.width = /*width*/ ctx[4];
    			if (dirty & /*height*/ 8) level_changes.height = /*height*/ ctx[3];
    			level.$set(level_changes);

    			if (!current || dirty & /*background*/ 2) {
    				set_style(div2, "background", /*background*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(level.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(level.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			destroy_component(level);
    			mounted = false;
    			run_all(dispose);
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

    const blockSize = 40;

    function getEventBlockPosition(e) {
    	return {
    		x: Math.floor(e.offsetX / blockSize) * blockSize,
    		y: Math.floor(e.offsetY / blockSize) * blockSize
    	};
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $artStore;
    	let $blockStore;
    	validate_store(store$1, "artStore");
    	component_subscribe($$self, store$1, $$value => $$invalidate(5, $artStore = $$value));
    	validate_store(store, "blockStore");
    	component_subscribe($$self, store, $$value => $$invalidate(6, $blockStore = $$value));
    	let { background = null } = $$props;
    	let { blocks = [] } = $$props;
    	let { enemies = [] } = $$props;
    	let selectedBlock = null;
    	let selectedEnemy = null;
    	let mouseDown = false;

    	function selectBlock(name) {
    		selectedEnemy = null;
    		$$invalidate(2, selectedBlock = name);
    	}

    	function selectEnemy(name) {
    		$$invalidate(2, selectedBlock = null);
    		selectedEnemy = name;
    	}

    	function onMouseDown(e) {
    		// if they right click or alt click, select whatever block they're hovering over
    		// if no block is there, it selects null, which makes placeBlock erase the current block
    		if (e.altKey || e.button !== 0) $$invalidate(2, selectedBlock = findBlockAtPosition(e));

    		mouseDown = e.button === 0;
    		onMouseMove(e);
    	}

    	function onMouseMove(e) {
    		if (mouseDown) {
    			const { x, y } = getEventBlockPosition(e);
    			placeBlock(x, y);
    		}
    	}

    	function onMouseUp(e) {
    		mouseDown = false;
    	}

    	function findBlockAtPosition(e) {
    		const { x, y } = getEventBlockPosition(e);
    		const block = blocks.find(b => b.x == x && b.y == y);
    		return block == null ? null : block.name;
    	}

    	function placeBlock(x, y) {
    		if (selectedBlock == null) {
    			eraseBlock(x, y);
    			return;
    		}

    		const block = {
    			x,
    			y,
    			width: blockSize,
    			height: blockSize,
    			name: selectedBlock,
    			png: $artStore[$blockStore[selectedBlock].graphic].png
    		};

    		// add this block, filtering out any block that used to be at the same position
    		// todo: sort blocks by x asc, y desc
    		$$invalidate(0, blocks = [...getBlocksNotAtPosition(x, y), block]);
    	}

    	function eraseBlock(x, y) {
    		$$invalidate(0, blocks = getBlocksNotAtPosition(x, y));
    	}

    	function getBlocksNotAtPosition(x, y) {
    		return blocks.filter(b => b.x != x || b.y != y);
    	}

    	const writable_props = ["background", "blocks", "enemies"];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelBuilderDataEditor> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelBuilderDataEditor", $$slots, []);

    	function contextmenu_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler = name => selectBlock(name);

    	$$self.$$set = $$props => {
    		if ("background" in $$props) $$invalidate(1, background = $$props.background);
    		if ("blocks" in $$props) $$invalidate(0, blocks = $$props.blocks);
    		if ("enemies" in $$props) $$invalidate(11, enemies = $$props.enemies);
    	};

    	$$self.$capture_state = () => ({
    		Level,
    		artStore: store$1,
    		blockStore: store,
    		enemyStore: store$3,
    		Enemy,
    		CustomGraphic,
    		background,
    		blocks,
    		enemies,
    		blockSize,
    		selectedBlock,
    		selectedEnemy,
    		mouseDown,
    		selectBlock,
    		selectEnemy,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		findBlockAtPosition,
    		getEventBlockPosition,
    		placeBlock,
    		eraseBlock,
    		getBlocksNotAtPosition,
    		highestBlockY,
    		height,
    		highestBlockX,
    		width,
    		$artStore,
    		$blockStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("background" in $$props) $$invalidate(1, background = $$props.background);
    		if ("blocks" in $$props) $$invalidate(0, blocks = $$props.blocks);
    		if ("enemies" in $$props) $$invalidate(11, enemies = $$props.enemies);
    		if ("selectedBlock" in $$props) $$invalidate(2, selectedBlock = $$props.selectedBlock);
    		if ("selectedEnemy" in $$props) selectedEnemy = $$props.selectedEnemy;
    		if ("mouseDown" in $$props) mouseDown = $$props.mouseDown;
    		if ("highestBlockY" in $$props) highestBlockY = $$props.highestBlockY;
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("highestBlockX" in $$props) highestBlockX = $$props.highestBlockX;
    		if ("width" in $$props) $$invalidate(4, width = $$props.width);
    	};

    	let highestBlockY;
    	let height;
    	let highestBlockX;
    	let width;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*blocks*/ 1) {
    			// make level viewer at least 100px higher and wider than any block is placed
    			 highestBlockY = Math.max(...blocks.map(b => b.y + b.height));
    		}

    		if ($$self.$$.dirty & /*blocks*/ 1) {
    			// $: console.log(height)
    			 highestBlockX = Math.max(...blocks.map(b => b.x + b.width));
    		}
    	};

    	 $$invalidate(3, height = 400); //highestBlockY > 400 ? highestBlockY + 100 : 400
    	 $$invalidate(4, width = 800); // blocks.length > 0 ? highestBlockX + 100 : 400

    	return [
    		blocks,
    		background,
    		selectedBlock,
    		height,
    		width,
    		$artStore,
    		$blockStore,
    		selectBlock,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		enemies,
    		contextmenu_handler,
    		click_handler
    	];
    }

    class LevelBuilderDataEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { background: 1, blocks: 0, enemies: 11 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilderDataEditor",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get background() {
    		throw new Error("<LevelBuilderDataEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<LevelBuilderDataEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blocks() {
    		throw new Error("<LevelBuilderDataEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blocks(value) {
    		throw new Error("<LevelBuilderDataEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enemies() {
    		throw new Error("<LevelBuilderDataEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enemies(value) {
    		throw new Error("<LevelBuilderDataEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\LevelBuilder\LevelBuilder.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1$5 } = globals;
    const file$h = "src\\pages\\LevelBuilder\\LevelBuilder.svelte";

    // (23:3) <FieldText name="name" bind:value={input.name}>
    function create_default_slot_3$3(ctx) {
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
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(23:3) <FieldText name=\\\"name\\\" bind:value={input.name}>",
    		ctx
    	});

    	return block;
    }

    // (25:3) <FieldMultiSelect name="playableCharacters" bind:value={input.playableCharacters} options={Object.keys($characters)}>
    function create_default_slot_2$3(ctx) {
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
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(25:3) <FieldMultiSelect name=\\\"playableCharacters\\\" bind:value={input.playableCharacters} options={Object.keys($characters)}>",
    		ctx
    	});

    	return block;
    }

    // (29:3) <FieldText name="background" bind:value={input.background}>
    function create_default_slot_1$3(ctx) {
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
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(29:3) <FieldText name=\\\"background\\\" bind:value={input.background}>",
    		ctx
    	});

    	return block;
    }

    // (34:4) {#if !isAdding}
    function create_if_block$6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Delete";
    			attr_dev(button, "class", "btn btn-danger");
    			add_location(button, file$h, 34, 5, 1091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[14], false, false, false);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(34:4) {#if !isAdding}",
    		ctx
    	});

    	return block;
    }

    // (33:3) <span slot="buttons">
    function create_buttons_slot$3(ctx) {
    	let span;
    	let if_block = !/*isAdding*/ ctx[1] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "buttons");
    			add_location(span, file$h, 32, 3, 1042);
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
    					if_block = create_if_block$6(ctx);
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
    		source: "(33:3) <span slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:2) <Form on:submit={save}>
    function create_default_slot$3(ctx) {
    	let fieldtext0;
    	let updating_value;
    	let t0;
    	let fieldmultiselect;
    	let updating_value_1;
    	let t1;
    	let fieldtext1;
    	let updating_value_2;
    	let t2;
    	let levelbuilderdataeditor;
    	let updating_blocks;
    	let updating_enemies;
    	let t3;
    	let current;

    	function fieldtext0_value_binding(value) {
    		/*fieldtext0_value_binding*/ ctx[9].call(null, value);
    	}

    	let fieldtext0_props = {
    		name: "name",
    		$$slots: { default: [create_default_slot_3$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].name !== void 0) {
    		fieldtext0_props.value = /*input*/ ctx[0].name;
    	}

    	fieldtext0 = new FieldText({ props: fieldtext0_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext0, "value", fieldtext0_value_binding));

    	function fieldmultiselect_value_binding(value) {
    		/*fieldmultiselect_value_binding*/ ctx[10].call(null, value);
    	}

    	let fieldmultiselect_props = {
    		name: "playableCharacters",
    		options: Object.keys(/*$characters*/ ctx[3]),
    		$$slots: { default: [create_default_slot_2$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].playableCharacters !== void 0) {
    		fieldmultiselect_props.value = /*input*/ ctx[0].playableCharacters;
    	}

    	fieldmultiselect = new FieldMultiSelect({
    			props: fieldmultiselect_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fieldmultiselect, "value", fieldmultiselect_value_binding));

    	function fieldtext1_value_binding(value) {
    		/*fieldtext1_value_binding*/ ctx[11].call(null, value);
    	}

    	let fieldtext1_props = {
    		name: "background",
    		$$slots: { default: [create_default_slot_1$3] },
    		$$scope: { ctx }
    	};

    	if (/*input*/ ctx[0].background !== void 0) {
    		fieldtext1_props.value = /*input*/ ctx[0].background;
    	}

    	fieldtext1 = new FieldText({ props: fieldtext1_props, $$inline: true });
    	binding_callbacks.push(() => bind(fieldtext1, "value", fieldtext1_value_binding));

    	function levelbuilderdataeditor_blocks_binding(value) {
    		/*levelbuilderdataeditor_blocks_binding*/ ctx[12].call(null, value);
    	}

    	function levelbuilderdataeditor_enemies_binding(value) {
    		/*levelbuilderdataeditor_enemies_binding*/ ctx[13].call(null, value);
    	}

    	let levelbuilderdataeditor_props = { background: /*input*/ ctx[0].background };

    	if (/*input*/ ctx[0].blocks !== void 0) {
    		levelbuilderdataeditor_props.blocks = /*input*/ ctx[0].blocks;
    	}

    	if (/*input*/ ctx[0].enemies !== void 0) {
    		levelbuilderdataeditor_props.enemies = /*input*/ ctx[0].enemies;
    	}

    	levelbuilderdataeditor = new LevelBuilderDataEditor({
    			props: levelbuilderdataeditor_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(levelbuilderdataeditor, "blocks", levelbuilderdataeditor_blocks_binding));
    	binding_callbacks.push(() => bind(levelbuilderdataeditor, "enemies", levelbuilderdataeditor_enemies_binding));

    	const block = {
    		c: function create() {
    			create_component(fieldtext0.$$.fragment);
    			t0 = space();
    			create_component(fieldmultiselect.$$.fragment);
    			t1 = space();
    			create_component(fieldtext1.$$.fragment);
    			t2 = space();
    			create_component(levelbuilderdataeditor.$$.fragment);
    			t3 = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fieldtext0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fieldmultiselect, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fieldtext1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(levelbuilderdataeditor, target, anchor);
    			insert_dev(target, t3, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fieldtext0_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fieldtext0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty & /*input*/ 1) {
    				updating_value = true;
    				fieldtext0_changes.value = /*input*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			fieldtext0.$set(fieldtext0_changes);
    			const fieldmultiselect_changes = {};
    			if (dirty & /*$characters*/ 8) fieldmultiselect_changes.options = Object.keys(/*$characters*/ ctx[3]);

    			if (dirty & /*$$scope*/ 32768) {
    				fieldmultiselect_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_1 && dirty & /*input*/ 1) {
    				updating_value_1 = true;
    				fieldmultiselect_changes.value = /*input*/ ctx[0].playableCharacters;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			fieldmultiselect.$set(fieldmultiselect_changes);
    			const fieldtext1_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fieldtext1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*input*/ 1) {
    				updating_value_2 = true;
    				fieldtext1_changes.value = /*input*/ ctx[0].background;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			fieldtext1.$set(fieldtext1_changes);
    			const levelbuilderdataeditor_changes = {};
    			if (dirty & /*input*/ 1) levelbuilderdataeditor_changes.background = /*input*/ ctx[0].background;

    			if (!updating_blocks && dirty & /*input*/ 1) {
    				updating_blocks = true;
    				levelbuilderdataeditor_changes.blocks = /*input*/ ctx[0].blocks;
    				add_flush_callback(() => updating_blocks = false);
    			}

    			if (!updating_enemies && dirty & /*input*/ 1) {
    				updating_enemies = true;
    				levelbuilderdataeditor_changes.enemies = /*input*/ ctx[0].enemies;
    				add_flush_callback(() => updating_enemies = false);
    			}

    			levelbuilderdataeditor.$set(levelbuilderdataeditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldtext0.$$.fragment, local);
    			transition_in(fieldmultiselect.$$.fragment, local);
    			transition_in(fieldtext1.$$.fragment, local);
    			transition_in(levelbuilderdataeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldtext0.$$.fragment, local);
    			transition_out(fieldmultiselect.$$.fragment, local);
    			transition_out(fieldtext1.$$.fragment, local);
    			transition_out(levelbuilderdataeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fieldtext0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fieldmultiselect, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fieldtext1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(levelbuilderdataeditor, detaching);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(22:2) <Form on:submit={save}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div2;
    	let div0;
    	let storenav;
    	let t;
    	let div1;
    	let form;
    	let current;

    	storenav = new StoreNav({
    			props: {
    				items: /*$levels*/ ctx[2],
    				activeName: /*input*/ ctx[0].name
    			},
    			$$inline: true
    		});

    	storenav.$on("create", /*create*/ ctx[6]);
    	storenav.$on("edit", /*edit_handler*/ ctx[8]);

    	form = new Form({
    			props: {
    				$$slots: {
    					default: [create_default_slot$3],
    					buttons: [create_buttons_slot$3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	form.$on("submit", /*save*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(storenav.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(form.$$.fragment);
    			attr_dev(div0, "class", "col-2");
    			add_location(div0, file$h, 17, 1, 362);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$h, 20, 1, 498);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$h, 16, 0, 342);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(storenav, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(form, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const storenav_changes = {};
    			if (dirty & /*$levels*/ 4) storenav_changes.items = /*$levels*/ ctx[2];
    			if (dirty & /*input*/ 1) storenav_changes.activeName = /*input*/ ctx[0].name;
    			storenav.$set(storenav_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope, input, isAdding, $characters*/ 32779) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(storenav.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(storenav.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(storenav);
    			destroy_component(form);
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
    	let $levels;
    	let $characters;
    	validate_store(store$4, "levels");
    	component_subscribe($$self, store$4, $$value => $$invalidate(2, $levels = $$value));
    	validate_store(store$2, "characters");
    	component_subscribe($$self, store$2, $$value => $$invalidate(3, $characters = $$value));
    	let input;
    	create();

    	function save() {
    		set_store_value(store$4, $levels[input.name] = JSON.parse(JSON.stringify(input)), $levels);
    	}

    	function edit(name) {
    		$$invalidate(0, input = { ...$levels[name] });
    	}

    	function create() {
    		$$invalidate(0, input = {
    			name: "",
    			playableCharacters: [],
    			background: "rgb(135, 206, 235)",
    			blocks: [],
    			enemies: []
    		});
    	}

    	function del(name) {
    		if (confirm(`Are you sure you want to delete "${name}"?`)) delete $levels[name];
    		store$4.set($levels);
    	}

    	const writable_props = [];

    	Object_1$5.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelBuilder", $$slots, []);
    	const edit_handler = e => edit(e.detail);

    	function fieldtext0_value_binding(value) {
    		input.name = value;
    		$$invalidate(0, input);
    	}

    	function fieldmultiselect_value_binding(value) {
    		input.playableCharacters = value;
    		$$invalidate(0, input);
    	}

    	function fieldtext1_value_binding(value) {
    		input.background = value;
    		$$invalidate(0, input);
    	}

    	function levelbuilderdataeditor_blocks_binding(value) {
    		input.blocks = value;
    		$$invalidate(0, input);
    	}

    	function levelbuilderdataeditor_enemies_binding(value) {
    		input.enemies = value;
    		$$invalidate(0, input);
    	}

    	const click_handler = () => del(input.name);

    	$$self.$capture_state = () => ({
    		FieldGraphicPicker,
    		FieldText,
    		FieldCheckbox,
    		FieldNumber,
    		Form,
    		StoreNav,
    		FieldMultiSelect,
    		characters: store$2,
    		levels: store$4,
    		LevelBuilderDataEditor,
    		input,
    		save,
    		edit,
    		create,
    		del,
    		isAdding,
    		$levels,
    		$characters
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("isAdding" in $$props) $$invalidate(1, isAdding = $$props.isAdding);
    	};

    	let isAdding;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$levels, input*/ 5) {
    			 $$invalidate(1, isAdding = $levels[input.name] == null);
    		}
    	};

    	return [
    		input,
    		isAdding,
    		$levels,
    		$characters,
    		save,
    		edit,
    		create,
    		del,
    		edit_handler,
    		fieldtext0_value_binding,
    		fieldmultiselect_value_binding,
    		fieldtext1_value_binding,
    		levelbuilderdataeditor_blocks_binding,
    		levelbuilderdataeditor_enemies_binding,
    		click_handler
    	];
    }

    class LevelBuilder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilder",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\pages\LevelBuilder\Index.svelte generated by Svelte v3.24.1 */
    const file$i = "src\\pages\\LevelBuilder\\Index.svelte";

    function create_fragment$j(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let a3;
    	let t7;
    	let a4;
    	let t9;
    	let div2;
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[1], prefix },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Art";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "Blocks";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Characters";
    			t5 = space();
    			a3 = element("a");
    			a3.textContent = "Enemies";
    			t7 = space();
    			a4 = element("a");
    			a4.textContent = "Levels";
    			t9 = space();
    			div2 = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(a0, "class", "list-group-item list-group-item-action");
    			attr_dev(a0, "href", "#/level-builder");
    			toggle_class(a0, "active", /*tab*/ ctx[0] == "art");
    			add_location(a0, file$i, 3, 3, 72);
    			attr_dev(a1, "class", "list-group-item list-group-item-action");
    			attr_dev(a1, "href", "#/level-builder/blocks");
    			toggle_class(a1, "active", /*tab*/ ctx[0] == "blocks");
    			add_location(a1, file$i, 4, 3, 185);
    			attr_dev(a2, "class", "list-group-item list-group-item-action");
    			attr_dev(a2, "href", "#/level-builder/characters");
    			toggle_class(a2, "active", /*tab*/ ctx[0] == "characters");
    			add_location(a2, file$i, 5, 3, 311);
    			attr_dev(a3, "class", "list-group-item list-group-item-action");
    			attr_dev(a3, "href", "#/level-builder/enemies");
    			toggle_class(a3, "active", /*tab*/ ctx[0] == "enemies");
    			add_location(a3, file$i, 6, 3, 449);
    			attr_dev(a4, "class", "list-group-item list-group-item-action");
    			attr_dev(a4, "href", "#/level-builder/levels");
    			toggle_class(a4, "active", /*tab*/ ctx[0] == "levels");
    			add_location(a4, file$i, 7, 3, 578);
    			attr_dev(div0, "class", "list-group");
    			add_location(div0, file$i, 2, 2, 43);
    			attr_dev(div1, "class", "col-2");
    			add_location(div1, file$i, 1, 1, 20);
    			attr_dev(div2, "class", "col");
    			add_location(div2, file$i, 10, 1, 721);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(div0, t3);
    			append_dev(div0, a2);
    			append_dev(div0, t5);
    			append_dev(div0, a3);
    			append_dev(div0, t7);
    			append_dev(div0, a4);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			mount_component(router, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tab*/ 1) {
    				toggle_class(a0, "active", /*tab*/ ctx[0] == "art");
    			}

    			if (dirty & /*tab*/ 1) {
    				toggle_class(a1, "active", /*tab*/ ctx[0] == "blocks");
    			}

    			if (dirty & /*tab*/ 1) {
    				toggle_class(a2, "active", /*tab*/ ctx[0] == "characters");
    			}

    			if (dirty & /*tab*/ 1) {
    				toggle_class(a3, "active", /*tab*/ ctx[0] == "enemies");
    			}

    			if (dirty & /*tab*/ 1) {
    				toggle_class(a4, "active", /*tab*/ ctx[0] == "levels");
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
    			if (detaching) detach_dev(div3);
    			destroy_component(router);
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

    const prefix = "/level-builder";

    function instance$j($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;

    	const routes = {
    		"/": ArtMaker,
    		"/blocks": BlockBuilder,
    		"/characters": CharacterBuilder,
    		"/enemies": EnemyBuilder,
    		"/levels": LevelBuilder
    	};

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(2, params = $$props.params);
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
    		if ("params" in $$props) $$invalidate(2, params = $$props.params);
    		if ("tab" in $$props) $$invalidate(0, tab = $$props.tab);
    	};

    	let tab;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 4) {
    			 $$invalidate(0, tab = params.tab || "art");
    		}
    	};

    	return [tab, routes, params];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { params: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get params() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\BubTheBobcat\LevelBuilder.svelte generated by Svelte v3.24.1 */

    function create_fragment$k(ctx) {
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LevelBuilder> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LevelBuilder", $$slots, []);
    	return [];
    }

    class LevelBuilder$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelBuilder",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\pages\BubTheBobcat\Status.svelte generated by Svelte v3.24.1 */

    const file$j = "src\\pages\\BubTheBobcat\\Status.svelte";

    function create_fragment$l(ctx) {
    	let div;
    	let p0;
    	let t0;
    	let t1_value = /*level*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3;
    	let t4;

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
    			attr_dev(p0, "class", "svelte-18s0d67");
    			add_location(p0, file$j, 1, 1, 8);
    			attr_dev(p1, "class", "svelte-18s0d67");
    			add_location(p1, file$j, 2, 1, 37);
    			attr_dev(div, "class", "svelte-18s0d67");
    			add_location(div, file$j, 0, 0, 0);
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
    			if (dirty & /*level*/ 1 && t1_value !== (t1_value = /*level*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { level = {} } = $$props;
    	let { score = 0 } = $$props;
    	const writable_props = ["level", "score"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Status> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Status", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    	};

    	$$self.$capture_state = () => ({ level, score });

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [level, score];
    }

    class Status extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { level: 0, score: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Status",
    			options,
    			id: create_fragment$l.name
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
    }

    /* src\pages\BubTheBobcat\Instructions.svelte generated by Svelte v3.24.1 */

    const file$k = "src\\pages\\BubTheBobcat\\Instructions.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (3:2) {#each keyBinds as bind}
    function create_each_block$5(ctx) {
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
    			add_location(td0, file$k, 4, 4, 79);
    			attr_dev(td1, "class", "svelte-1d0wu93");
    			add_location(td1, file$k, 5, 4, 104);
    			add_location(tr, file$k, 3, 3, 69);
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
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(3:2) {#each keyBinds as bind}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let table;
    	let each_value = /*keyBinds*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(table, "class", "svelte-1d0wu93");
    			add_location(table, file$k, 1, 1, 29);
    			attr_dev(div, "class", "instructions svelte-1d0wu93");
    			add_location(div, file$k, 0, 0, 0);
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
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Instructions",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\pages\BubTheBobcat\Viewport.svelte generated by Svelte v3.24.1 */

    const file$l = "src\\pages\\BubTheBobcat\\Viewport.svelte";

    function create_fragment$n(ctx) {
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
    			add_location(div0, file$l, 1, 1, 107);
    			attr_dev(div1, "class", "viewport svelte-cjx02");
    			set_style(div1, "width", /*width*/ ctx[2] + "px");
    			set_style(div1, "height", /*height*/ ctx[3] + "px");
    			set_style(div1, "background-color", /*backgroundColor*/ ctx[4]);
    			add_location(div1, file$l, 0, 0, 0);
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

    			if (!current || dirty & /*backgroundColor*/ 16) {
    				set_style(div1, "background-color", /*backgroundColor*/ ctx[4]);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { x = 0 } = $$props;
    	let { y = 0 } = $$props;
    	let { width = 0 } = $$props;
    	let { height = 0 } = $$props;
    	let { backgroundColor = null } = $$props;
    	const writable_props = ["x", "y", "width", "height", "backgroundColor"];

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
    		if ("backgroundColor" in $$props) $$invalidate(4, backgroundColor = $$props.backgroundColor);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ x, y, width, height, backgroundColor });

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("backgroundColor" in $$props) $$invalidate(4, backgroundColor = $$props.backgroundColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [x, y, width, height, backgroundColor, $$scope, $$slots];
    }

    class Viewport extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			x: 0,
    			y: 1,
    			width: 2,
    			height: 3,
    			backgroundColor: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Viewport",
    			options,
    			id: create_fragment$n.name
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

    	get backgroundColor() {
    		throw new Error("<Viewport>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundColor(value) {
    		throw new Error("<Viewport>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\BubTheBobcat\Player.svelte generated by Svelte v3.24.1 */
    const file$m = "src\\pages\\BubTheBobcat\\Player.svelte";

    function create_fragment$o(ctx) {
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
    			set_style(img, "transform", "scaleX(" + /*direction*/ ctx[6] + ") rotate(" + /*rotate*/ ctx[7] + "deg)");
    			add_location(img, file$m, 2, 1, 100);
    			attr_dev(div, "class", "player svelte-8td79i");
    			set_style(div, "left", /*x*/ ctx[1] + "px");
    			set_style(div, "bottom", /*y*/ ctx[0] - 5 + "px");
    			add_location(div, file$m, 0, 0, 0);
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

    			if (!current || dirty & /*direction, rotate*/ 192) {
    				set_style(img, "transform", "scaleX(" + /*direction*/ ctx[6] + ") rotate(" + /*rotate*/ ctx[7] + "deg)");
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { vx = 0 } = $$props;
    	let { vy = 0 } = $$props;
    	let { y = 0 } = $$props;
    	let { x = 0 } = $$props;
    	let { width = 150 } = $$props;
    	let { height = 100 } = $$props;
    	let { health = 100 } = $$props;
    	let { maxHealth = 100 } = $$props;
    	let { spinning = false } = $$props;
    	let direction = 1;
    	let spinningRotation = 0;
    	let spinTimeout = null;
    	const writable_props = ["vx", "vy", "y", "x", "width", "height", "health", "maxHealth", "spinning"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Player", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("vx" in $$props) $$invalidate(8, vx = $$props.vx);
    		if ("vy" in $$props) $$invalidate(9, vy = $$props.vy);
    		if ("y" in $$props) $$invalidate(0, y = $$props.y);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("health" in $$props) $$invalidate(4, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(5, maxHealth = $$props.maxHealth);
    		if ("spinning" in $$props) $$invalidate(10, spinning = $$props.spinning);
    	};

    	$$self.$capture_state = () => ({
    		HealthBar,
    		vx,
    		vy,
    		y,
    		x,
    		width,
    		height,
    		health,
    		maxHealth,
    		spinning,
    		direction,
    		spinningRotation,
    		spinTimeout,
    		rotate
    	});

    	$$self.$inject_state = $$props => {
    		if ("vx" in $$props) $$invalidate(8, vx = $$props.vx);
    		if ("vy" in $$props) $$invalidate(9, vy = $$props.vy);
    		if ("y" in $$props) $$invalidate(0, y = $$props.y);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    		if ("health" in $$props) $$invalidate(4, health = $$props.health);
    		if ("maxHealth" in $$props) $$invalidate(5, maxHealth = $$props.maxHealth);
    		if ("spinning" in $$props) $$invalidate(10, spinning = $$props.spinning);
    		if ("direction" in $$props) $$invalidate(6, direction = $$props.direction);
    		if ("spinningRotation" in $$props) $$invalidate(11, spinningRotation = $$props.spinningRotation);
    		if ("spinTimeout" in $$props) $$invalidate(12, spinTimeout = $$props.spinTimeout);
    		if ("rotate" in $$props) $$invalidate(7, rotate = $$props.rotate);
    	};

    	let rotate;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*vx*/ 256) {
    			 if (vx != 0) $$invalidate(6, direction = vx > 0 ? 1 : -1);
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

    		if ($$self.$$.dirty & /*spinning, spinningRotation, vy*/ 3584) {
    			 $$invalidate(7, rotate = spinning
    			? spinningRotation
    			: -1 * (5 + (vy > 0 ? vy * 3 : vy * 1.5)));
    		}
    	};

    	return [y, x, width, height, health, maxHealth, direction, rotate, vx, vy, spinning];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			vx: 8,
    			vy: 9,
    			y: 0,
    			x: 1,
    			width: 2,
    			height: 3,
    			health: 4,
    			maxHealth: 5,
    			spinning: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get vx() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vx(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vy() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vy(value) {
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

    /* src\pages\BubTheBobcat\GameOver.svelte generated by Svelte v3.24.1 */

    const file$n = "src\\pages\\BubTheBobcat\\GameOver.svelte";

    function create_fragment$p(ctx) {
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
    			p.textContent = "Press any key to restart.";
    			attr_dev(h10, "class", "svelte-1ogvx1s");
    			add_location(h10, file$n, 1, 1, 26);
    			attr_dev(h11, "class", "svelte-1ogvx1s");
    			add_location(h11, file$n, 2, 1, 79);
    			attr_dev(p, "class", "svelte-1ogvx1s");
    			add_location(p, file$n, 3, 1, 111);
    			attr_dev(div, "class", "game-over svelte-1ogvx1s");
    			add_location(div, file$n, 0, 0, 0);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { score = 0 } = $$props;
    	const writable_props = ["score"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GameOver> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GameOver", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("score" in $$props) $$invalidate(0, score = $$props.score);
    	};

    	$$self.$capture_state = () => ({ score });

    	$$self.$inject_state = $$props => {
    		if ("score" in $$props) $$invalidate(0, score = $$props.score);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [score];
    }

    class GameOver extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { score: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameOver",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get score() {
    		throw new Error("<GameOver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set score(value) {
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
    					floater(x * blockSize, y * blockSize, blockSize, blockSize, level.data[x][y], true)
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

    // object x, y coords are always bottom left... add width or height to get other sides
    const doObjectsIntersect = (a, b) => doObjectsIntersectX(a, b) && doObjectsIntersectY(a, b);
    const doObjectsIntersectX = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x;
    const doObjectsIntersectY = (a, b) => a.y + a.height > b.y && a.y < b.y + b.height;
    const isAAboveB = (a, b) => a.y >= b.y + b.height && doObjectsIntersectX(a, b);

    // x|    |x+width
    //    x|     |x+width

    class SimpleEnemy {
    	constructor(x, y) {
    		this.alive = true;
    		this.tvx = 2;
    		this.width = 100;
    		this.height = 50;
    		this.x = x;
    		this.y = y;
    		this.vx = 0;
    		this.vy = 0;
    		this.health = 100;
    		this.maxHealth = 100;
    		this.jumpVelocity = 20;
    		this.fallDamageMultiplier = 2;
    		this.score = 1;
    		this.dps = 10;

    		// todo replace w/ graphic states
    		this.isBoss = false;

    		this.grounded = false;
    	}
    	q
    	tick(player) {
    		// default enemy just moves toward player
    		if (this.grounded) {
    			// x axis
    			if (player.x == this.x) this.vx = 0;
    			else if (player.x < this.x) this.vx = -this.tvx;
    			else this.vx = this.tvx;

    			// y axis
    			if (player.y > this.y + this.height) {
    				this.vy = this.jumpVelocity;
    				this.y += 1;
    			}
    		}
    	}

    	onDeath() {}
    }

    class BossEnemy extends SimpleEnemy {
    	constructor(x, y) {
    		super(x, y);
    		this.health = 400;
    		this.maxHealth = 400;
    		this.score = 5;
    		this.width = 400;
    		this.height = 300;
    		this.isBoss = true;
    		this.dps = 50;
    	}
    }

    /* src\pages\BubTheBobcat\Game.svelte generated by Svelte v3.24.1 */

    const { console: console_1$2, window: window_1 } = globals;
    const file$o = "src\\pages\\BubTheBobcat\\Game.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (4:1) {#if gameOver}
    function create_if_block_1(ctx) {
    	let gameover;
    	let current;

    	gameover = new GameOver({
    			props: { score: /*score*/ ctx[4] },
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
    			if (dirty & /*score*/ 16) gameover_changes.score = /*score*/ ctx[4];
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

    // (7:1) {#if level != null && player != null}
    function create_if_block$7(ctx) {
    	let viewport_1;
    	let current;

    	const viewport_1_spread_levels = [
    		/*viewport*/ ctx[9],
    		{
    			backgroundColor: /*level*/ ctx[0].backgroundColor
    		}
    	];

    	let viewport_1_props = {
    		$$slots: { default: [create_default_slot$4] },
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
    			const viewport_1_changes = (dirty & /*viewport, level*/ 513)
    			? get_spread_update(viewport_1_spread_levels, [
    					dirty & /*viewport*/ 512 && get_spread_object(/*viewport*/ ctx[9]),
    					dirty & /*level*/ 1 && {
    						backgroundColor: /*level*/ ctx[0].backgroundColor
    					}
    				])
    			: {};

    			if (dirty & /*$$scope, player, enemies, blocks, levelWidth, levelHeight*/ 16777422) {
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(7:1) {#if level != null && player != null}",
    		ctx
    	});

    	return block;
    }

    // (10:3) {#each enemies as enemy}
    function create_each_block$6(ctx) {
    	let enemy;
    	let current;
    	const enemy_spread_levels = [/*enemy*/ ctx[21]];
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
    			const enemy_changes = (dirty & /*enemies*/ 128)
    			? get_spread_update(enemy_spread_levels, [get_spread_object(/*enemy*/ ctx[21])])
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
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(10:3) {#each enemies as enemy}",
    		ctx
    	});

    	return block;
    }

    // (8:2) <Viewport {...viewport} backgroundColor={level.backgroundColor}>
    function create_default_slot$4(ctx) {
    	let level_1;
    	let t0;
    	let t1;
    	let player_1;
    	let current;

    	level_1 = new Level({
    			props: {
    				blocks: /*blocks*/ ctx[1],
    				width: /*levelWidth*/ ctx[2],
    				height: /*levelHeight*/ ctx[3]
    			},
    			$$inline: true
    		});

    	let each_value = /*enemies*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const player_1_spread_levels = [/*player*/ ctx[6]];
    	let player_1_props = {};

    	for (let i = 0; i < player_1_spread_levels.length; i += 1) {
    		player_1_props = assign(player_1_props, player_1_spread_levels[i]);
    	}

    	player_1 = new Player({ props: player_1_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(level_1.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(player_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(level_1, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(player_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const level_1_changes = {};
    			if (dirty & /*blocks*/ 2) level_1_changes.blocks = /*blocks*/ ctx[1];
    			if (dirty & /*levelWidth*/ 4) level_1_changes.width = /*levelWidth*/ ctx[2];
    			if (dirty & /*levelHeight*/ 8) level_1_changes.height = /*levelHeight*/ ctx[3];
    			level_1.$set(level_1_changes);

    			if (dirty & /*enemies*/ 128) {
    				each_value = /*enemies*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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

    			const player_1_changes = (dirty & /*player*/ 64)
    			? get_spread_update(player_1_spread_levels, [get_spread_object(/*player*/ ctx[6])])
    			: {};

    			player_1.$set(player_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(level_1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(player_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(level_1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(player_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(level_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(player_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(8:2) <Viewport {...viewport} backgroundColor={level.backgroundColor}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let status;
    	let t2;
    	let instructions;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*gameOver*/ ctx[8] && create_if_block_1(ctx);
    	let if_block1 = /*level*/ ctx[0] != null && /*player*/ ctx[6] != null && create_if_block$7(ctx);

    	status = new Status({
    			props: {
    				level: /*level*/ ctx[0],
    				score: /*score*/ ctx[4]
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
    			add_location(div, file$o, 2, 0, 63);
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
    			/*div_binding*/ ctx[12](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*onKeyDown*/ ctx[10], false, false, false),
    					listen_dev(window_1, "keyup", /*onKeyUp*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*gameOver*/ ctx[8]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*gameOver*/ 256) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
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

    					if (dirty & /*level, player*/ 65) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$7(ctx);
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
    			if (dirty & /*level*/ 1) status_changes.level = /*level*/ ctx[0];
    			if (dirty & /*score*/ 16) status_changes.score = /*score*/ ctx[4];
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
    			/*div_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
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

    const blockSize$1 = 25;

    function instance$q($$self, $$props, $$invalidate) {
    	let { level = null } = $$props;
    	let blocks;
    	let levelWidth = 0;
    	let levelHeight = 0;
    	let score = 0;
    	let mainEl;
    	let jumpVelocity = 15;
    	let player;
    	let enemies;
    	let gameOver = false;
    	let gameAlive = true;
    	let lastRequestedFrame = null;
    	let visibleBlocks;
    	let viewport = { width: window.innerWidth, height: 900 };

    	onMount(() => {
    		$$invalidate(1, blocks = levelToBlocks(level, blockSize$1));
    		$$invalidate(2, levelWidth = level.data.length * blockSize$1);
    		$$invalidate(3, levelHeight = Math.max(...blocks.map(b => b.y + b.height)));
    		start();
    	});

    	onDestroy(() => {
    		gameAlive = false;
    		window.cancelAnimationFrame(lastRequestedFrame);
    	});

    	let rightBound;

    	function start() {
    		$$invalidate(4, score = 0);

    		$$invalidate(6, player = {
    			width: 85,
    			height: 75,
    			x: blocks[0].x,
    			y: blocks[0].y + blocks[0].height + 100,
    			vx: 0,
    			vy: 0,
    			spinning: false,
    			health: 100,
    			maxHealth: 100,
    			tvx: 7,
    			fallDamageMultiplier: 10,
    			dps: 120,
    			tick() {
    				console.log("i am the player in a frame");
    			}
    		});

    		$$invalidate(7, enemies = []);
    		$$invalidate(8, gameOver = false);

    		// only start game loop if it's not already going
    		if (lastRequestedFrame == null) gameLoop();
    	}

    	function gameLoop() {
    		if (!gameOver) {
    			// visibleBlocks = blocks.filter(b => doObjectsIntersect(viewport, b))
    			$$invalidate(6, player = applyGravityAndVelocity(player, true));

    			rightBound = blockSize$1 * level.length;
    			const halfViewportWidth = viewport.width / 2;
    			const halfViewportHeight = viewport.height / 2;

    			$$invalidate(
    				9,
    				viewport.x = // player is at beginning of level
    				player.x < halfViewportWidth
    				? // viewport all the way to the left
    					0
    				: // player is at end of level
    					player.x > rightBound - halfViewportWidth
    					? // viewport all the way to the right
    						rightBound - viewport.width
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

    			// todo: levels should add mobs, not auto spawn
    			if (!enemies.some(e => e.health > 0)) {
    				if (enemies.length < 5) {
    					$$invalidate(7, enemies = enemies.concat([1, 2, 3, 4, 5].map(x => new SimpleEnemy(player.x + 200 * x, player.y + 200))));
    				} else {
    					$$invalidate(7, enemies = [new BossEnemy(player.x + 200, player.y + 200)]);
    				}
    			}

    			// for every live enemy intersecting the player, one or the other should take damage
    			for (let i = 0; i < enemies.length; i++) {
    				if (enemies[i].alive) {
    					$$invalidate(7, enemies[i] = applyGravityAndVelocity(enemies[i]), enemies);
    					enemies[i].tick(player);

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

    	function applyGravityAndVelocity(sprite, isPlayerControlled = false) {
    		const surfacesBelowSprite = blocks.filter(b => b.interactive && isAAboveB(sprite, b)).map(b => b.y + b.height);

    		const surfaceY = surfacesBelowSprite.length > 0
    		? Math.max(...surfacesBelowSprite)
    		: -500; // some number off screen

    		sprite.y += sprite.vy;
    		sprite.grounded = sprite.y <= surfaceY;

    		// gravity affects all sprites
    		if (sprite.grounded) {
    			// we're grounded - take damage if we were previously falling
    			if (sprite.vy < 0) {
    				sprite.health += sprite.vy / sprite.fallDamageMultiplier;
    				sprite.vy = 0;
    			}

    			// make sure we're exactly on the ground
    			sprite.y = surfaceY;
    		} else if (sprite.y < -200) {
    			// we fell under the map, die
    			sprite.health = 0;
    		} else {
    			// we're in the air, accelerate downward
    			sprite.vy--;
    		}

    		// x velocity
    		if (sprite.vx != 0) {
    			if (sprite.vx > 0) {
    				const targetX = sprite.x + sprite.vx;
    				sprite.x = targetX > rightBound ? rightBound : targetX;
    			} else {
    				const leftBound = 0;
    				const targetX = sprite.x + sprite.vx;
    				sprite.x = targetX < leftBound ? leftBound : targetX;
    			}
    		}

    		return sprite;
    	}

    	function onKeyDown(e) {
    		if (gameOver) return;

    		switch (e.code) {
    			case "ArrowLeft":
    				$$invalidate(6, player.vx = -player.tvx, player);
    				break;
    			case "ArrowRight":
    				$$invalidate(6, player.vx = player.tvx, player);
    				break;
    			case "Space":
    				if (player.grounded) $$invalidate(6, player.vy = jumpVelocity, player);
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
    		if (gameOver) {
    			start();
    			return;
    		}

    		switch (e.code) {
    			case "ArrowLeft":
    				$$invalidate(6, player.vx = 0, player);
    				break;
    			case "ArrowRight":
    				$$invalidate(6, player.vx = 0, player);
    				break;
    			case "Space":
    				break;
    			case "KeyR":
    				$$invalidate(6, player.spinning = false, player);
    				break;
    			case "Enter":
    			case "NumpadEnter":
    				start();
    				break;
    			default:
    				console.log(e.code);
    		}
    	}

    	const writable_props = ["level"];

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
    		levelToBlocks,
    		doObjectsIntersect,
    		isAAboveB,
    		BossEnemy,
    		SimpleEnemy,
    		level,
    		blockSize: blockSize$1,
    		blocks,
    		levelWidth,
    		levelHeight,
    		score,
    		mainEl,
    		jumpVelocity,
    		player,
    		enemies,
    		gameOver,
    		gameAlive,
    		lastRequestedFrame,
    		visibleBlocks,
    		viewport,
    		rightBound,
    		start,
    		gameLoop,
    		applyGravityAndVelocity,
    		onKeyDown,
    		onKeyUp
    	});

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) $$invalidate(0, level = $$props.level);
    		if ("blocks" in $$props) $$invalidate(1, blocks = $$props.blocks);
    		if ("levelWidth" in $$props) $$invalidate(2, levelWidth = $$props.levelWidth);
    		if ("levelHeight" in $$props) $$invalidate(3, levelHeight = $$props.levelHeight);
    		if ("score" in $$props) $$invalidate(4, score = $$props.score);
    		if ("mainEl" in $$props) $$invalidate(5, mainEl = $$props.mainEl);
    		if ("jumpVelocity" in $$props) jumpVelocity = $$props.jumpVelocity;
    		if ("player" in $$props) $$invalidate(6, player = $$props.player);
    		if ("enemies" in $$props) $$invalidate(7, enemies = $$props.enemies);
    		if ("gameOver" in $$props) $$invalidate(8, gameOver = $$props.gameOver);
    		if ("gameAlive" in $$props) gameAlive = $$props.gameAlive;
    		if ("lastRequestedFrame" in $$props) lastRequestedFrame = $$props.lastRequestedFrame;
    		if ("visibleBlocks" in $$props) visibleBlocks = $$props.visibleBlocks;
    		if ("viewport" in $$props) $$invalidate(9, viewport = $$props.viewport);
    		if ("rightBound" in $$props) rightBound = $$props.rightBound;
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
    		div_binding
    	];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { level: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$q.name
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

    function create_fragment$r(ctx) {
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let level = null;

    	let levels = [
    		{
    			name: "Sample 1",
    			backgroundColor: "rgb(135, 206, 235)",
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
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
    					null,
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
    					"rgb(204, 204, 204)",
    					"rgb(204, 204, 204)",
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
    					"green",
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
    					"green",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
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
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"green",
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
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"green",
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
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"green",
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
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"green",
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
    					"green",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
    					"rgb(203, 140, 97)",
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
    					"green",
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
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Index", $$slots, []);
    	$$self.$capture_state = () => ({ LevelBuilder: LevelBuilder$1, Game, level, levels });

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) level = $$props.level;
    		if ("levels" in $$props) $$invalidate(0, levels = $$props.levels);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [levels];
    }

    class Index$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\pages\NotFound.svelte generated by Svelte v3.24.1 */

    const file$p = "src\\pages\\NotFound.svelte";

    function create_fragment$s(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Page not found";
    			add_location(h1, file$p, 0, 0, 0);
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props) {
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
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.24.1 */
    const file$q = "src\\App.svelte";

    function create_fragment$t(ctx) {
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
    			a0.textContent = "Bub the Bobcat";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Level Builder (WIP)";
    			t3 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "#/bub-the-bobcat");
    			add_location(a0, file$q, 2, 2, 42);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$q, 1, 1, 18);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "#/level-builder");
    			add_location(a1, file$q, 5, 2, 137);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$q, 4, 1, 113);
    			attr_dev(ul, "class", "nav");
    			add_location(ul, file$q, 0, 0, 0);
    			attr_dev(main, "class", "svelte-1ten5ne");
    			add_location(main, file$q, 9, 0, 218);
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	const routes = {
    		"/level-builder/:tab?": Index,
    		"/bub-the-bobcat": Index$1,
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
    		LevelBuilder: Index,
    		BubTheBobcat: Index$1,
    		NotFound,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$t.name
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
