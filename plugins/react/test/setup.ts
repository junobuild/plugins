import { cleanup } from "@testing-library/react";
import * as matches from "@testing-library/jest-dom/matchers";
import { Satellite } from "@junobuild/core";
import { expect } from "vitest";
import { afterEach, beforeEach } from "node:test";
import "fake-indexeddb/auto";
import { vi } from  "vitest";

vi.mock('@junobuild/core');

beforeEach(() => {

    setSatellitePrincipal({
        identity: {},
        satelliteId: "my-sat-id",
        fetch: typeof fetch,
        container: undefined
    } as unknown as Satellite);
})

expect.extend(matches);
afterEach(() => {
    cleanup();
});

function setSatellitePrincipal(arg0: Satellite) {
    throw new Error("Function not implemented.");
}
//import type { TransformOptions as JestTransformOptions } from "@jest/transform";
//import { babelJest } from '@babel/preset-typescript'

//const  {getCacheKey} = babelJest.creatTansformer();
