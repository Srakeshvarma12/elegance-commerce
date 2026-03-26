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


class LatestProductsView(ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return Product.objects.order_by("-created_at")[:8]


class FeaturedProductsView(ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return Product.objects.filter(featured=True).order_by("-created_at")[:8]


class ProductListView(ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        qs = Product.objects.all().order_by("-created_at")

        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")

        if search:
            qs = qs.filter(name__icontains=search)

        if category and category.lower() != "all":
            qs = qs.filter(category__iexact=category)

        min_price = self.request.query_params.get("min")
        max_price = self.request.query_params.get("max")

        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)

        sort = self.request.query_params.get("sort")
        if sort == "price_low":
            qs = qs.order_by("price")
        elif sort == "price_high":
            qs = qs.order_by("-price")
        elif sort == "name":
            qs = qs.order_by("name")
        else:
            qs = qs.order_by("-created_at")

        return qs

    def list(self, request, *args, **kwargs):
        search = request.query_params.get("search", "")
        category = request.query_params.get("category", "")
        min_price = request.query_params.get("min", "")
        max_price = request.query_params.get("max", "")
        sort = request.query_params.get("sort", "")
        page = request.query_params.get("page", "")

        cache_key = f"products_{search}_{category}_{min_price}_{max_price}_{sort}_{page}"

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
    authentication_classes = []


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