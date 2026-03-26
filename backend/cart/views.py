from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import Cart, CartItem
from .serializers import CartItemSerializer
from products.models import Product


def get_user_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


def serialize_cart(cart, request):
    items = cart.items.select_related("product").all()
    serializer = CartItemSerializer(items, many=True, context={"request": request})
    return serializer.data


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_items(request):
    cart = get_user_cart(request.user)
    return Response(serialize_cart(cart, request))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity") or 1)
    size = request.data.get("size") or ""
    color = request.data.get("color") or ""

    if not product_id:
        return Response({"error": "product_id is required"}, status=400)

    product = get_object_or_404(Product, id=product_id)
    cart = get_user_cart(request.user)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        size=size,
        color=color,
        defaults={
            "quantity": max(quantity, 1),
            "unit_price": product.price,
        },
    )

    if not created:
        item.quantity += max(quantity, 1)
        item.unit_price = product.price
        item.save()

    return Response(serialize_cart(cart, request), status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_cart_item(request, pk):
    cart = get_user_cart(request.user)
    item = get_object_or_404(CartItem, pk=pk, cart=cart)

    quantity = request.data.get("quantity")
    if quantity is not None:
        try:
            quantity = int(quantity)
        except ValueError:
            return Response({"error": "quantity must be a number"}, status=400)

        if quantity <= 0:
            item.delete()
            return Response(serialize_cart(cart, request))

        item.quantity = quantity

    size = request.data.get("size")
    color = request.data.get("color")
    if size is not None:
        item.size = size
    if color is not None:
        item.color = color

    item.unit_price = item.product.price
    item.save()

    return Response(serialize_cart(cart, request))


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, pk):
    cart = get_user_cart(request.user)
    item = get_object_or_404(CartItem, pk=pk, cart=cart)
    item.delete()
    return Response(serialize_cart(cart, request))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = get_user_cart(request.user)
    cart.items.all().delete()
    return Response(serialize_cart(cart, request))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sync_cart(request):
    cart = get_user_cart(request.user)
    items = request.data.get("items", [])
    replace = request.data.get("replace", False)

    if replace:
        cart.items.all().delete()

    for entry in items:
        product_id = entry.get("product_id")
        quantity = int(entry.get("quantity") or 1)
        size = entry.get("size") or ""
        color = entry.get("color") or ""

        if not product_id:
            continue

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            continue

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size,
            color=color,
            defaults={
                "quantity": max(quantity, 1),
                "unit_price": product.price,
            },
        )

        if not created:
            item.quantity += max(quantity, 1)
            item.unit_price = product.price
            item.save()

    return Response(serialize_cart(cart, request))
