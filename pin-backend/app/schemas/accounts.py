from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class StudentRegistration(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    password2: str = Field(min_length=8, max_length=128)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone_number: str | None = Field(default=None, max_length=40)
    role: Literal["STUDENT"] = "STUDENT"

    @field_validator("password")
    @classmethod
    def require_password_complexity(cls, value: str) -> str:
        if not any(char.islower() for char in value) or not any(char.isupper() for char in value):
            raise ValueError("Password must include upper-case and lower-case letters")
        if not any(char.isdigit() for char in value) or not any(not char.isalnum() for char in value):
            raise ValueError("Password must include a number and a symbol")
        return value

    @model_validator(mode="after")
    def passwords_must_match(self) -> "StudentRegistration":
        if self.password != self.password2:
            raise ValueError("Passwords do not match")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class PublicUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: str | None
    role: Literal["STUDENT", "ADMIN"]
    created_at: datetime
