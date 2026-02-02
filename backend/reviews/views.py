from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Review
from .serializers import ReviewSerializer
from products.models import Product

def user_has_bought_product(user, product):
    # TODO: replace with real order check
    return True

@api_view(["GET"])
def product_reviews(request, product_id):
    reviews = Review.objects.filter(product_id=product_id)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_review(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    if not user_has_bought_product(request.user, product):
        return Response({"error": "Only buyers can review"}, status=403)

    if Review.objects.filter(user=request.user, product=product).exists():
        return Response({"error": "Already reviewed"}, status=400)

    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, product=product)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
