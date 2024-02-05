import {renderHook} from "@testing-library/react";
import { describe,  expect } from "vitest";
import useCollection from "../src/hooks/useCollection";

describe('useCollection', () => {

    const {result} = renderHook(() => useCollection());

    expect(result.current.subscribe).toEqual([]);
})