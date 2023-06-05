from database import Base
from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship


class QaData(Base):
    __tablename__ = "qadata"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String)
    answer = Column(String)

    # sources = relationship("Source",back_populates="qas")

class Source(Base):
    __tablename__ = "source"

    id = Column(Integer, primary_key=True, index=True)
    page_content = Column(String)
    pdf_numpages = Column(Integer)
    source = Column(String)
    qadata_id = Column(Integer)
    # qas = relationship("QaData", back_populates="sources")