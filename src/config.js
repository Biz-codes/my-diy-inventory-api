module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://biz@localhost/my-diy-inventory',
    JWT_SECRET: process.env.JWT_SECRET || 'Hazel',
    // API_TOKEN: process.env.API_TOKEN || '',
    CLIENT_ORIGIN: '*',
    PGSSLMODE: "require"
  }