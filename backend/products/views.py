from django.core.cache import cache
from rest_framework.generics import (
    ListAPIView, RetrieveAPIView,
    CreateAPIView, UpdateAPIView, DestroyAPIView
)
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer, ProductListSerializer


@api_view(["GET"])
def featured_products(request):
    products = Product.objects.filter(featured=True).order_by("-created_at")[:8]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def latest_products(request):
    products = Product.objects.order_by("-created_at")[:8]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)


class LatestProductsView(ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Product.objects.order_by("-created_at")[:8]


class FeaturedProductsView(ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Product.objects.filter(featured=True).order_by("-created_at")[:8]


class ProductListView(ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Product.objects.all().order_by("-created_at")

        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")

        if search:
            qs = qs.filter(name__icontains=search)

        if category and category.lower() != "all":
            qs = qs.filter(category__iexact=category)

        return qs

    def list(self, request, *args, **kwargs):
        search = request.query_params.get("search", "")
        category = request.query_params.get("category", "")
        page = request.query_params.get("page", "")

        cache_key = f"products_{search}_{category}_{page}"

        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, 300)

        return response


class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.prefetch_related("variants")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductCreateView(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save()
        cache.clear()


class ProductUpdateView(UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):
        serializer.save()
        cache.clear()


class ProductDeleteView(DestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAdminUser]

    def perform_destroy(self, instance):
        instance.delete()
        cache.clear()