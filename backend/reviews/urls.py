from django.urls import path
from .views import product_reviews, add_review

urlpatterns = [
    path("product/<int:product_id>/", product_reviews),
    path("product/<int:product_id>/add/", add_review),
]
