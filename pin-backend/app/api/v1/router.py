"""API v1 route registration."""

from fastapi import APIRouter

from app.api.v1.endpoints import accounts, admin, classes, clients, health, payments, students, training

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(accounts.router, prefix="/auth", tags=["accounts"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(training.router, prefix="/training", tags=["training"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(classes.student_router, prefix="/students", tags=["student-classes"])
api_router.include_router(classes.admin_router, prefix="/admin", tags=["admin-classes"])
