from django.urls import path
from .views import (
    LatestProductsView,
    FeaturedProductsView,
    ProductListView,
    ProductDetailView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
)

urlpatterns = [
    path("latest/", LatestProductsView.as_view()),
    path("featured/", FeaturedProductsView.as_view()),

    path("admin/create/", ProductCreateView.as_view()),
    path("admin/update/<int:pk>/", ProductUpdateView.as_view()),
    path("admin/delete/<int:pk>/", ProductDeleteView.as_view()),

    path("", ProductListView.as_view()),
    path("<int:pk>/", ProductDetailView.as_view()),
]