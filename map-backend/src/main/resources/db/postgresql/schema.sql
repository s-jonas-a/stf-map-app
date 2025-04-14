CREATE TABLE IF NOT EXISTS userMessages (
  id SERIAL PRIMARY KEY,
  message TEXT,
  observationDate DATE,
  observationLng DOUBLE PRECISION,
  observationLat DOUBLE PRECISION
);
