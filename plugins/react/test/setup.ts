import { cleanup } from "@testing-library/react";
import * as matches from "@testing-library/jest-dom/matchers";
//import "ts-node/register";
import { expect } from "vitest";
import { afterEach } from "node:test";

expect.extend(matches);
afterEach(() => {
    cleanup();
});
//import type { TransformOptions as JestTransformOptions } from "@jest/transform";
//import { babelJest } from '@babel/preset-typescript'

//const  {getCacheKey} = babelJest.creatTansformer();
