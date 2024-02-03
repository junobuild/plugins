//ts
// useCollection.test.ts

import { renderHook,  act } from '@testing-library/react';
//import "@testing-library/jest-dom";
import { describe, it, expect, jest } from '@jest/globals';
//import { jest } from 
import useCollection from '../hooks/useCollection';

describe('useCollection', () => {

  it('should return subscribe method', () => {
    const { result } = renderHook(() => useCollection());

    expect(result.current).toHaveProperty('subscribe');
    expect(typeof result.current.subscribe).toBe('function');
  });

  it('should call juno.subscribeCollection when subscribed', () => {
    
    const subscribe = jest.fn();

    jest.unstable_mockModule('./useJuno', () => ({
      __esModule: false,
      default: () => ({
        subscribeCollection: subscribe  
      })
    }));

    const { result } = renderHook(() => useCollection());

    act(() => {
      result.current.subscribe('posts');
    }) 

    expect(subscribe).toHaveBeenCalledWith('posts', expect.any(Function));

  });

});
//import { render, act } from '@testing-library/react';
//import useCollection from './useCollection';

//describe('useCollection', () => {
//  it('should return subscribe method', () => {
//    let subscribeResult: ReturnType<typeof useCollection> | null = null;

    // Create a test component that uses the hook
//    function TestComponent() {
//      subscribeResult = useCollection();
//      return null;
//    }

    // Render the test component
//    render(<TestComponent />);

    // Assert that the hook provides the subscribe method
//    expect(subscribeResult).not.toBeNull();
//    expect(subscribeResult?.subscribe).toBeDefined();
//    expect(typeof subscribeResult?.subscribe).toBe('function');
//  });

  // Additional tests...
//});

//function expect(current: any) {
//  throw new Error('Function not implemented.');
//}
