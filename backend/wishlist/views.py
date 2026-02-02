from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Wishlist
from .serializers import WishlistSerializer
from products.models import Product


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_wishlist(request):
    items = Wishlist.objects.filter(user=request.user)
    serializer = WishlistSerializer(items, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_wishlist(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    item = Wishlist.objects.filter(user=request.user, product=product).first()

    if item:
        item.delete()
        return Response({"status": "removed"}, status=200)
    else:
        Wishlist.objects.create(user=request.user, product=product)
        return Response({"status": "added"}, status=201)
