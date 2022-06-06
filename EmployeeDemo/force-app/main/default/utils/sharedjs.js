/* eslint-disable no-else-return */
/**
 * @File Name          : sharedjs.js
 * @Description        :
 * @Author             : amit.singh@salesforcemvps.com
 * @Group              :
 * @Last Modified By   : Amit Singh
 * @Last Modified On   : 12-06-2020
 * @Modification Log   :
 * Ver       Date            Author      		    Modification
 * 1.0    5/17/2020   amit.singh@salesforcemvps.com     Initial Version
 **/
import { ShowToastEvent } from "lightning/platformShowToastEvent";

    /*
        ! To store all the JS functions for the various LWC
        * This JavaScript file is used to provide many reusability functionality like pubsub 
        * Reusable Apex Calls to Server, Preparing Dynamic Toasts
        Todo : PubSub JS file of LWC & Aura Components
        ? V2
    */

    var callbacks = {};

    /**
     * Registers a callback for an event
     * @param {string} eventName  - Name of the event to listen for.
     * @param {function} callback - Function to invoke when said event is fired.
     */
    const subscribe = (eventName, callback) => {
    if (!callbacks[eventName]) {
        callbacks[eventName] = new Set();
    }
    callbacks[eventName].add(callback);
    };

    /**
     * Unregisters a callback for an event
     * @param {string} eventName - Name of the event to unregister from.
     * @param {function} callback - Function to unregister.
     */
    const unregister = (eventName, callback) => {
    if (callbacks[eventName]) {
        callbacks[eventName].delete(callback);
        // ! delete the callback from callbacks variable
    }
    };

    const unregisterAll = () => {
        callbacks = {};
    };

    /**
     * Fires an event to listeners.
     * @param {string} eventName - Name of the event to fire.
     * @param {*} payload - Payload of the event to fire.
     */
    const publish = (eventName, payload) => {
    if (callbacks[eventName]) {
        callbacks[eventName].forEach(callback => {
        try {
            callback(payload);
        } catch (error) {
            // fail silently
        }
        });
    }
    };

/**
 * Todo: Calls an Apex Class method and send the response to call back methods.
 * @param {*} _serveraction     - Name of the apex class action needs to execute.
 * @param {*} _params           - the list of parameters in JSON format
 * @param {*} _onsuccess        - Name of the method which will execute in success response
 * @param {*} _onerror          - Name of the method which will execute in error response
 */
    const _servercall = (_serveraction, _params, _onsuccess, _onerror) => {
    if (!_params) {
        _params = {};
    }
    _serveraction(_params)
        .then(_result => {
        if (_result && _onsuccess) {
            _onsuccess(_result);
        }
        })
        .catch(_error => {
        if (_error && _onerror) {
            _onerror(_error);
        }
        });
    };

    /**
     * Todo: Prepare the toast object and return back to the calling JS class
     * @param {String} _title     - title of of the toast message
     * @param {String} _message   - message to display to the user
     * @param {String} _variant   - toast type either success/error/warning or info
     * @param {String} _mode      - defines either toast should auto disappear or it should stick.
     */
    const _toastcall = (_title, _message, _variant, _mode) => {
        const _showToast = new ShowToastEvent({
            title: _title,
            message: _message,
            mode: _mode,
            variant: _variant
        });
        return _showToast;
    };

/**
     * Todo: Parse the Error message and returns the parsed response to calling JS method.
     * @param {Array} errors  - Error Information
     */
    const _reduceErrors = errors => {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }
    return errors
        .filter(error => !!error)
        .map(error => {
        if (Array.isArray(error.body)) {
            return error.body.map(e => e.message);
        } else if (error.body && typeof error.body.message === "string") {
            return error.body.message;
        } else if (typeof error.message === "string") {
            return error.message;
        }
        return error.statusText;
        })
        .reduce((prev, curr) => prev.concat(curr), [])
        .filter(message => !!message);
    };

/*
    Todo: Export all the functions so that these are accisible from the other JS Classes
*/
export default {
    subscribe,
    unregister,
    publish,
    unregisterAll,
    _servercall,
    _toastcall,
    _reduceErrors
};