from django.urls import path
from .views import toggle_wishlist, user_wishlist

urlpatterns = [
    path("toggle/<int:product_id>/", toggle_wishlist),
    path("my/", user_wishlist),
]
