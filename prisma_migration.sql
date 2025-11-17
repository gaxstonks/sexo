-- Prisma-compatible SQL for creating User and File tables
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,
  googleId TEXT UNIQUE,
  avatarUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "File" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES "User"(id),
  path TEXT NOT NULL,
  label TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
