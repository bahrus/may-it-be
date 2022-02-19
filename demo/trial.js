import { CustomElementManifestGenerator } from '../doc.js';
import { resolve } from "path";
const cemg = new CustomElementManifestGenerator(resolve("demo/types.d.ts"), 'Package', console.log);
