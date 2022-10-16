import DataLoader from 'dataloader';

export function createLoader<C, K>(load: (id: C) => Promise<K>) {
  return new DataLoader<C, K>(
    async (keys) => {
      return [await load(keys[0])];
    },
    {
      batch: false,
    },
  );
}

export function createBatchedLoader<C, K>(load: (id: C[]) => Promise<K[]>) {
  return new DataLoader<C, K>(load);
}
