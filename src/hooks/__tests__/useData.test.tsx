import { act, renderHook, waitFor } from '@testing-library/react';
import useData from '../useData';

const originalFetch = global.fetch;
const fetchMock = jest.fn();
const data = [{ id: 1, name: 'App', icon: 'icon.png', data: [] }];
const response = {
  ok: true,
  json: async () => data,
} as Response;

beforeEach(() => {
  jest.useFakeTimers();
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

afterEach(() => {
  jest.useRealTimers();
  global.fetch = originalFetch;
});

it('loads data once and does not refetch after rerenders', async () => {
  fetchMock.mockResolvedValue(response);
  const { result, rerender } = renderHook(() => useData());

  expect(result.current).toEqual({ data: [], loading: true, error: null });
  await act(async () => {
    jest.advanceTimersByTime(1999);
  });
  expect(result.current.loading).toBe(true);
  expect(fetchMock).not.toHaveBeenCalled();

  await act(async () => {
    jest.advanceTimersByTime(1);
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current).toEqual({ data, loading: false, error: null });

  rerender();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('/data.json');
});

it('reports HTTP errors without reading the response as data', async () => {
  const json = jest.fn();
  fetchMock.mockResolvedValue({ ok: false, status: 500, json });
  const { result } = renderHook(() => useData());

  await act(async () => {
    jest.advanceTimersByTime(2000);
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).toBe('Failed to load data (HTTP 500).');
  expect(result.current.data).toEqual([]);
  expect(json).not.toHaveBeenCalled();
});

it.each([
  ['network', () => Promise.reject(new Error('Network unavailable'))],
  [
    'JSON',
    () =>
      Promise.resolve({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      }),
  ],
])('finishes loading on a %s error', async (_, implementation) => {
  fetchMock.mockImplementation(implementation);
  const { result } = renderHook(() => useData());

  await act(async () => {
    jest.advanceTimersByTime(2000);
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).toBeTruthy();
  expect(result.current.data).toEqual([]);
});
