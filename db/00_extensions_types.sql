-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enums
CREATE TYPE item_condition AS ENUM (
    'Near Mint',
    'Lightly Played',
    'Moderately Played',
    'Heavily Played',
    'Damaged'
);

CREATE TYPE post_category AS ENUM (
    'blog',
    'strategy',
    'news'
);
