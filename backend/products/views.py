from django.core.cache import cache
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Product
from .serializers import ProductSerializer, ProductListSerializer


class ProductListView(ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        search = self.request.query_params.get("search", "")
        category = self.request.query_params.get("category", "")
        page = self.request.query_params.get("page", "1")

        cache_key = f"products_{search}_{category}_{page}"
        cached_queryset = cache.get(cache_key)

        if cached_queryset:
            return cached_queryset

        queryset = Product.objects.prefetch_related("variants").all()

        if search:
            queryset = queryset.filter(name__icontains=search)

        if category and category.lower() != "all":
            queryset = queryset.filter(category__iexact=category)

        cache.set(cache_key, queryset, 60 * 5)
        return queryset


class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
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
