from django.urls import path
from .views import (
    cart_items,
    add_to_cart,
    update_cart_item,
    remove_cart_item,
    clear_cart,
    sync_cart,
)

urlpatterns = [
    path("", cart_items, name="cart_items"),
    path("add/", add_to_cart, name="cart_add"),
    path("item/<int:pk>/", update_cart_item, name="cart_item_update"),
    path("item/<int:pk>/remove/", remove_cart_item, name="cart_item_remove"),
    path("clear/", clear_cart, name="cart_clear"),
    path("sync/", sync_cart, name="cart_sync"),
]
