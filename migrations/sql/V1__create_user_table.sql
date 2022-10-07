CREATE TABLE users (
  id          uuid DEFAULT gen_random_uuid(),
  discord_id  text NOT NULL,

  CONSTRAINT  idx_did UNIQUE (discord_id),
  PRIMARY KEY (id)
);
