interface SeedDAta {
  entries: SeedEntry[];
}

interface SeedEntry {
  description: string;
  status: string;
  createdAt: number;
}




export const seedData: SeedDAta = {
  entries: [
    {
      description: 'pendiente: descripcion 1',
      status: 'pending',
      createdAt: Date.now(),
    },
    {
      description: 'in-progress: descripcion 2',
      status: 'in-progress',
      createdAt: Date.now() - 1000000,
    },
    {
      description: 'finished: descripcion 3',
      status: 'finished',
      createdAt: Date.now() - 100000,
    },
  ]
}