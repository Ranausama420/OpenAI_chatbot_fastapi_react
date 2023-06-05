from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# SQLALCHEMY_DATABASE_URL = "sqlite:///./qadb.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:61e4d9fb@localhost:5433/tstdb"
SQLALCHEMY_DATABASE_URL = "postgres://gpehviuyarubqj:0d7b7b8d2c618ab72c50db0ac54e1c6b5cf64cb8993ee15b6a82f96e15a2fc36@ec2-3-232-218-211.compute-1.amazonaws.com:5432/ddicfrcs7ckk66"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
