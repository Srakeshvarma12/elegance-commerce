from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    UpdateOrderAfterPayment,
    AdminOrderListView,
    AdminOrderUpdateView, 
)

urlpatterns = [
    # ================= USER ROUTES =================
    path("", OrderListCreateView.as_view(), name="order-list-create"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("<int:pk>/update/", UpdateOrderAfterPayment.as_view(), name="order-update"),

    # ================= ADMIN ROUTES =================
    path("admin/orders/", AdminOrderListView.as_view(), name="admin-orders"),
    path(
        "admin/orders/<int:pk>/update/",
        AdminOrderUpdateView.as_view(),
        name="admin-order-update"
    ),
]
