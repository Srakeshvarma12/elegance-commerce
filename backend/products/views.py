from django.core.cache import cache
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Product
from .serializers import ProductSerializer, ProductListSerializer


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
        page = request.query_params.get("page", "1")

        cache_key = f"products_{search}_{category}_{page}"

        cached_data = cache.get(cache_key)
        if cached_data:
            from rest_framework.response import Response
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)

        # ✅ cache serialized data only
        cache.set(cache_key, response.data, 60 * 5)

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
