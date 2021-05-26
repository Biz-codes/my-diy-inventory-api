module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://chyblsxitcryks:e268c742d3d592617bbaf7e0a64476d5fe67bd08cf4215a91405df4afafc5679@ec2-107-20-153-39.compute-1.amazonaws.com:5432/d7qk8ot5u6enpe',
    JWT_SECRET: process.env.JWT_SECRET || 'Hazel',
    // API_TOKEN: process.env.API_TOKEN || '',
    CLIENT_ORIGIN: '*',
    PGSSLMODE: "require"
  }