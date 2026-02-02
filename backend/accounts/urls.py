from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    PasswordResetAPIView,
    PasswordResetConfirmAPIView,
)

urlpatterns = [
    # ================= AUTH =================
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),

    # ================= PASSWORD RESET =================
    path(
        "password-reset/",
        PasswordResetAPIView.as_view(),
        name="password_reset",
    ),
    path(
        "password-reset-confirm/<uidb64>/<token>/",
        PasswordResetConfirmAPIView.as_view(),
        name="password_reset_confirm",
    ),
]
