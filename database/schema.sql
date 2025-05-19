-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(100),
  type VARCHAR(50), -- e.g. painting, illustration, music
  cover_image TEXT,
  details JSONB, -- holds dynamic content per type
  created_at TIMESTAMP DEFAULT NOW()
);

-- FOLLOWS (user follows user)
CREATE TABLE follows (
  follower_id INTEGER REFERENCES users(id),
  followee_id INTEGER REFERENCES users(id),
  PRIMARY KEY (follower_id, followee_id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- PROJECT FOLLOWS (user follows project)
CREATE TABLE project_follows (
  user_id INTEGER REFERENCES users(id),
  project_id INTEGER REFERENCES projects(id),
  PRIMARY KEY (user_id, project_id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- COMMENTS
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LIKES
CREATE TABLE likes (
  user_id INTEGER REFERENCES users(id),
  project_id INTEGER REFERENCES projects(id),
  PRIMARY KEY (user_id, project_id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- TAGS & PROJECT_TAGS
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE project_tags (
  project_id INTEGER REFERENCES projects(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (project_id, tag_id)
);

-- MESSAGES (DMs)
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  recipient_id INTEGER REFERENCES users(id),
  content TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);
