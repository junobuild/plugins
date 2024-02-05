import {renderHook} from '@testing-library/react';
import {describe, it, expect, vi } from "vitest";
import useCollection from '../src/hooks/useCollection';
import  subscribeCollection  from '../src/hooks/useCollection';


// Mock the @junobuild/core library
vi.mock('@junobuild/core', () => {
  return {
    initJuno: vi.fn().mockImplementation(() => {
      let data = [];
      // Simulate a subscription callback
      process.nextTick(() => data);
      return {
        unsubscribe: vi.fn(),
        getDocs: vi.fn(() => data),
    };
  }),
};
});

vi.mock('./useCollection', () => ({
  ...vi.importActual('./useCollection'), 
  subscribeCollection: vi.fn()
}));

describe('useCollection', () => {
  it('should subscribe to collection', () => {

    const mockSubscribe = subscribeCollection as vi.isMockFuncxtion<typeof subscribeCollection>;
    
    expect(mockSubscribe).toHaveBeenCalled();

  }),

});

  

describe('useCollection', () => {
  it('should return an object with docs property', () => {
    const {result } = renderHook(() => useCollection("user"));
    expect(result.current).toHaveProperty("docs");
    expect(result.current.docs).toEqual([]);
  });

  it('should call subscribeCollection when the hook is used', () => {
    renderHook(() => useCollection("user"));
    
    expect(vi.mocked(vi.mock.call[0][0].initJuno).toHaveBeenCalledWith('posts', expect.any(Function)));
});
});