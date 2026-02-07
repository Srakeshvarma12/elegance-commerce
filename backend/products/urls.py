from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
)

urlpatterns = [
    path("", ProductListView.as_view()),
    path("<int:pk>/", ProductDetailView.as_view()),

    # ADMIN APIs FOR FRONTEND
    path("admin/create/", ProductCreateView.as_view()),
    path("admin/update/<int:pk>/", ProductUpdateView.as_view()),
    path("admin/delete/<int:pk>/", ProductDeleteView.as_view()),
]
