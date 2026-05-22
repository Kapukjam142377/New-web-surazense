from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime

# Patient Schema
class PatientBase(BaseModel):
    name: str
    sex: Optional[str] = None
    age: Optional[int] = None
    dob: Optional[date] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Tumor Marker Schema
class TumorMarkerBase(BaseModel):
    psa: Optional[float] = None
    cea: Optional[float] = None
    ca153: Optional[float] = None
    afp: Optional[float] = None
    hpv: Optional[str] = None
    ctcs: Optional[float] = None
    pca3: Optional[float] = None
    dlx1: Optional[str] = None

class TumorMarkerCreate(TumorMarkerBase):
    pass

class TumorMarker(TumorMarkerBase):
    id: int
    report_id: int

    model_config = ConfigDict(from_attributes=True)

# Genetic Mutation Schema
class GeneticMutationBase(BaseModel):
    exon20: Optional[float] = None
    g719x: Optional[float] = None
    exon19: Optional[float] = None
    l858r: Optional[float] = None

class GeneticMutationCreate(GeneticMutationBase):
    pass

class GeneticMutation(GeneticMutationBase):
    id: int
    report_id: int

    model_config = ConfigDict(from_attributes=True)

# Medical Report Schema
class MedicalReportBase(BaseModel):
    specimen1: Optional[str] = None
    specimen2: Optional[str] = None
    collecting_date: Optional[date] = None
    receiving_date: Optional[date] = None
    testing_date: Optional[date] = None

class MedicalReportCreate(MedicalReportBase):
    patient: PatientCreate
    markers: TumorMarkerCreate
    genetics: GeneticMutationCreate

class MedicalReport(MedicalReportBase):
    id: int
    patient_id: int
    created_at: datetime
    updated_at: datetime
    patient: Patient
    markers: Optional[TumorMarker] = None
    genetics: Optional[GeneticMutation] = None

    model_config = ConfigDict(from_attributes=True)

# Order Item Schemas
class OrderItemBase(BaseModel):
    product_id: int
    product_name: str
    price: float
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    model_config = ConfigDict(from_attributes=True)


# Order Schemas
class OrderBase(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: str
    payment_method: str

class OrderCreate(OrderBase):
    items: list[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    payment_status: Optional[str] = None
    order_status: Optional[str] = None

class Order(OrderBase):
    id: int
    payment_status: str
    order_status: str
    total_amount: float
    created_at: datetime
    updated_at: datetime
    items: list[OrderItem]

    model_config = ConfigDict(from_attributes=True)

