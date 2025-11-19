import { jest } from "@jest/globals";

export const prismaMock = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

export const PrismaClient = jest.fn(() => prismaMock);
