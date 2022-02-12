import { CustomElementManifestGenerator } from '../doc.js';
const test = `{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
        "AbortController": {
            "properties": {
                "signal": {
                    "$ref": "#/definitions/AbortSignal"
                }
            },
            "type": "object"
        },
        "AbortSignal": {
            "properties": {
                "aborted": {
                    "type": "boolean"
                },
                "onabort": {
                    "type": "object"
                }
            },
            "type": "object"
        },
        "IValue": {
            "properties": {
                "idx": {
                    "type": "number"
                },
                "item": {}
            },
            "type": "object"
        },
        "SimpleWCInfo": {
            "properties": {
                "cssParts": {
                    "additionalProperties": {
                        "type": "string"
                    },
                    "type": "object"
                },
                "cssProps": {
                    "additionalProperties": {
                        "type": "string"
                    },
                    "type": "object"
                },
                "methods": {},
                "props": {},
                "tagName": {
                    "type": "string"
                }
            },
            "type": "object"
        },
        "TimeTickerActions": {
            "description": "time-ticker actions",
            "type": "object"
        },
        "TimeTickerInfo": {
            "properties": {
                "methods": {
                    "$ref": "#/definitions/TimeTickerActions"
                },
                "props": {
                    "$ref": "#/definitions/TimeTickerProps"
                },
                "tagName": {
                    "enum": [
                        "time-ticker"
                    ],
                    "type": "string"
                }
            },
            "type": "object"
        },
        "TimeTickerProps": {
            "description": "time-ticker props",
            "properties": {
                "controller": {
                    "$ref": "#/definitions/AbortController"
                },
                "disabled": {
                    "type": "boolean"
                },
                "duration": {
                    "type": "number"
                },
                "enabled": {
                    "description": "enabledTest",
                    "type": "boolean"
                },
                "idx": {
                    "description": "idxTest",
                    "type": "number"
                },
                "items": {
                    "items": {},
                    "type": "array"
                },
                "loop": {
                    "type": "boolean"
                },
                "repeat": {
                    "type": "number"
                },
                "ticks": {
                    "type": "number"
                },
                "value": {},
                "wait": {
                    "description": "Wait for the duration before firing the first tick.",
                    "type": "boolean"
                }
            },
            "type": "object"
        }
    }
}`;
const docGen = new CustomElementManifestGenerator(test, console.log);
