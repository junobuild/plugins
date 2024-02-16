import { renderHook, act } from '@testing-library/react';
import useCollection from '../src/hooks/useCollection';
import {useJuno} from '../src/hooks/useJuno';
import { vi, describe, expect, it } from 'vitest';

// Mock the useJuno hook
vi.mock('./useJuno', () => ({
  __esModule: true,
  default: () => ({
    satelliteId: 'mockSatelliteId',
    orbiterId: 'mockOrbiterId',
    subscribeCollection: vi.fn((collectionName, callback) => {
      // Simulate a subscription callback
      const docs = [{ id: '1', data: 'test' }];
      callback(docs);
      return {
        unsubscribe: vi.fn(),
  };
  }),
}),
  }));

describe('useCollection', () => { it('should subscribe to collection and update docs', () => { const { result } = renderHook(() => useCollection("mockSatelliteId"));

// Initially, docs should be an empty array
expect(result.current.docs).toEqual([]);

// After the effect runs, docs should be updated
act(() => {
  vi.useFakeTimers();
});
expect(result.current.docs).toEqual([{ id: '1', data: 'test' }]);
});


it('should clean up the subscription on unmount', () => { const { unmount } = renderHook(() => useCollection('mockSatelliteId'));

// Mock the unsubscribe function
const unsubscribe = vi.fn();
// Get the return value of useJuno
const juno = useJuno();


// Unmount the component
unmount();

// The unsubscribe function should have been called
expect(unsubscribe).toHaveBeenCalled();
}); });