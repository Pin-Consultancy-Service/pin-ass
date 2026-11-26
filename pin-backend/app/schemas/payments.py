from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator, model_validator
from typing import Literal


class FeePlanCreate(BaseModel):
    code: str = Field(min_length=2, max_length=80, pattern=r"^[A-Za-z0-9_-]+$")
    name: str = Field(min_length=2, max_length=180)
    exam_body: Literal["ICAN", "ACCA", "CITN", "CISA", "ATS"]
    cohort_name: str = Field(min_length=2, max_length=120)
    cohort_starts_on: date
    cohort_ends_on: date
    description: str | None = Field(default=None, max_length=2000)
    amount_minor: int = Field(gt=0, le=100_000_000_000)
    currency: str = Field(default="NGN", pattern="^NGN$")

    @model_validator(mode="after")
    def validate_cohort_dates(self):
        if self.cohort_ends_on <= self.cohort_starts_on:
            raise ValueError("Cohort end date must be after its start date")
        return self


class FeePlanExamBodyUpdate(BaseModel):
    exam_body: Literal["ICAN", "ACCA", "CITN", "CISA", "ATS"]


class FeePlanRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    name: str
    exam_body: Literal["ICAN", "ACCA", "CITN", "CISA", "ATS"] | None
    cohort_name: str | None
    cohort_starts_on: date | None
    cohort_ends_on: date | None
    description: str | None
    amount_minor: int
    currency: str
    is_active: bool


class PaymentInitialize(BaseModel):
    fee_plan_id: str
    payment_option: Literal["FULL", "INSTALLMENT"]
    idempotency_key: str = Field(min_length=16, max_length=100, pattern=r"^[A-Za-z0-9_-]+$")


class PaymentInitialized(BaseModel):
    reference: str
    authorization_url: str
    amount_minor: int
    currency: str
    status: str


class PaymentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    student_id: str
    fee_plan_id: str
    reference: str
    amount_minor: int
    installment_number: int | None
    currency: str
    status: str
    provider: str
    paid_at: datetime | None
    created_at: datetime


class PaymentSummary(BaseModel):
    total_confirmed_minor: int
    pending_count: int
    confirmed_count: int
    failed_count: int


class ExpenseCreate(BaseModel):
    category: str = Field(min_length=2, max_length=80)
    payee: str | None = Field(default=None, max_length=180)
    description: str = Field(min_length=3, max_length=2000)
    amount_minor: int = Field(gt=0, le=100_000_000_000)
    currency: str = Field(default="NGN", pattern="^NGN$")
    expense_date: date


class ExpenseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    reference: str
    category: str
    payee: str | None
    description: str
    amount_minor: int
    currency: str
    expense_date: date
    recorded_by: str
    created_at: datetime


class FinanceSummary(BaseModel):
    confirmed_income_minor: int
    expenses_minor: int
    net_recorded_minor: int
    pending_payments: int
    new_students: int


class AdminStudentRead(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    phone_number: str | None
    is_active: bool
    created_at: datetime


class StudentAccessRead(BaseModel):
    has_paid: bool
    can_access_dashboard: bool
    message: str


class StudentFeeBalanceRead(BaseModel):
    fee_plan_id: str
    fee_plan_name: str
    cohort_name: str | None
    total_minor: int
    paid_minor: int
    pending_minor: int
    balance_minor: int
    confirmed_payment_count: int
    payment_pending: bool
    pending_payment_option: Literal["FULL", "INSTALLMENT"] | None
    currency: str


class ClassMaterial(BaseModel):
    name: str = Field(min_length=1, max_length=180)
    url: HttpUrl

    @field_validator("url")
    @classmethod
    def require_https(cls, value: HttpUrl) -> HttpUrl:
        if value.scheme != "https":
            raise ValueError("Material links must use HTTPS")
        return value


class ClassSessionCreate(BaseModel):
    fee_plan_id: str
    exam_body: Literal["ICAN", "ACCA", "CITN", "CISA", "ATS"]
    subject: str = Field(min_length=2, max_length=180)
    topic: str = Field(min_length=2, max_length=240)
    instructor_name: str = Field(min_length=2, max_length=180)
    scheduled_at: datetime
    duration_minutes: int = Field(ge=15, le=480)
    meeting_url: HttpUrl | None = None
    recording_url: HttpUrl | None = None
    materials: list[ClassMaterial] = Field(default_factory=list, max_length=20)
    description: str | None = Field(default=None, max_length=3000)

    @field_validator("scheduled_at")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("Class time must include a timezone")
        return value

    @field_validator("meeting_url", "recording_url")
    @classmethod
    def require_https_links(cls, value: HttpUrl | None) -> HttpUrl | None:
        if value is not None and value.scheme != "https":
            raise ValueError("Class links must use HTTPS")
        return value

    @field_validator("materials")
    @classmethod
    def limit_material_links(cls, value: list[ClassMaterial]) -> list[ClassMaterial]:
        if any(not item.name.strip() for item in value):
            raise ValueError("Material names cannot be blank")
        return value


class ClassRecordingUpdate(BaseModel):
    recording_url: HttpUrl | None

    @field_validator("recording_url")
    @classmethod
    def require_https_recording(cls, value: HttpUrl | None) -> HttpUrl | None:
        if value is not None and value.scheme != "https":
            raise ValueError("Recording links must use HTTPS")
        return value


class ClassSessionUpdate(BaseModel):
    subject: str | None = Field(default=None, min_length=2, max_length=180)
    topic: str | None = Field(default=None, min_length=2, max_length=240)
    instructor_name: str | None = Field(default=None, min_length=2, max_length=180)
    scheduled_at: datetime | None = None
    duration_minutes: int | None = Field(default=None, ge=15, le=480)
    meeting_url: HttpUrl | None = None
    recording_url: HttpUrl | None = None
    materials: list[ClassMaterial] | None = Field(default=None, max_length=20)
    description: str | None = Field(default=None, max_length=3000)

    @field_validator("scheduled_at")
    @classmethod
    def require_timezone_when_provided(cls, value: datetime | None) -> datetime | None:
        if value is not None and (value.tzinfo is None or value.utcoffset() is None):
            raise ValueError("Class time must include a timezone")
        return value

    @field_validator("meeting_url", "recording_url")
    @classmethod
    def require_https_when_provided(cls, value: HttpUrl | None) -> HttpUrl | None:
        if value is not None and value.scheme != "https":
            raise ValueError("Class links must use HTTPS")
        return value

    @field_validator("materials")
    @classmethod
    def validate_materials_when_provided(cls, value: list[ClassMaterial] | None) -> list[ClassMaterial] | None:
        if value is not None and any(not item.name.strip() for item in value):
            raise ValueError("Material names cannot be blank")
        return value


class ClassSessionRead(BaseModel):
    id: str
    fee_plan_id: str
    exam_body: Literal["ICAN", "ACCA", "CITN", "CISA", "ATS"] | None
    course_name: str
    cohort: str
    subject: str
    topic: str
    instructor_name: str
    scheduled_at: datetime
    duration_minutes: int
    meeting_url: str | None
    recording_url: str | None
    materials: list[ClassMaterial]
    description: str | None
    status: Literal["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"]


