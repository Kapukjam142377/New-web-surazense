from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    sex = Column(String(50))
    age = Column(Integer)
    dob = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Cascading deletes will remove associated reports if a patient is deleted
    reports = relationship("MedicalReport", back_populates="patient", cascade="all, delete-orphan")

class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"))
    specimen1 = Column(String(100))
    specimen2 = Column(String(100))
    collecting_date = Column(Date)
    receiving_date = Column(Date)
    testing_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    patient = relationship("Patient", back_populates="reports")
    markers = relationship("TumorMarker", back_populates="report", uselist=False, cascade="all, delete-orphan")
    genetics = relationship("GeneticMutation", back_populates="report", uselist=False, cascade="all, delete-orphan")

class TumorMarker(Base):
    __tablename__ = "tumor_markers"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("medical_reports.id", ondelete="CASCADE"), unique=True)
    psa = Column(Numeric(10, 2))
    cea = Column(Numeric(10, 2))
    ca153 = Column(Numeric(10, 2))
    afp = Column(Numeric(10, 2))
    hpv = Column(String(100))
    ctcs = Column(Numeric(10, 2))
    pca3 = Column(Numeric(10, 2))
    dlx1 = Column(String(100))

    report = relationship("MedicalReport", back_populates="markers")

class GeneticMutation(Base):
    __tablename__ = "genetic_mutations"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("medical_reports.id", ondelete="CASCADE"), unique=True)
    exon20 = Column(Numeric(10, 2))
    g719x = Column(Numeric(10, 2))
    exon19 = Column(Numeric(10, 2))
    l858r = Column(Numeric(10, 2))

    report = relationship("MedicalReport", back_populates="genetics")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=True)
    shipping_address = Column(String(1000), nullable=False)
    payment_method = Column(String(100), nullable=False)
    payment_status = Column(String(50), default="pending")
    order_status = Column(String(50), default="received")
    total_amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, nullable=False)
    product_name = Column(String(255), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")

