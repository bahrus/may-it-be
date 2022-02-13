import {CustomElementManifestGenerator} from '../doc.js';

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
                "nonAttribProps": {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                "props": {},
                "tagName": {
                    "type": "string"
                }
            },
            "type": "object"
        },
        "TimeTickerActions": {
            "description": "time-ticker actions",
            "properties": {
                "onTicks": {
                    "type": "object"
                },
                "rotateItems": {
                    "description": "Set rotating items",
                    "type": "object"
                },
                "start": {
                    "description": "Starts the timer",
                    "type": "object"
                },
                "stop": {
                    "description": "Stop the timer",
                    "type": "object"
                }
            },
            "type": "object"
        },
        "TimeTickerInfo": {
            "properties": {
                "methods": {
                    "$ref": "#/definitions/TimeTickerActions"
                },
                "nonAttribProps": {
                    "items": [
                        {
                            "enum": [
                                "value"
                            ],
                            "type": "string"
                        }
                    ],
                    "maxItems": 1,
                    "minItems": 1,
                    "type": "array"
                },
                "props": {
                    "$ref": "#/definitions/TimeTickerProps"
                },
                "src": {
                    "enum": [
                        "./time-ticker.js"
                    ],
                    "type": "string"
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
                    "description": "",
                    "type": "boolean"
                },
                "idx": {
                    "description": "",
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




