from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny   # <-- IMPORTANT
from .models import Product
from .serializers import ProductSerializer


class ProductListView(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        queryset = Product.objects.all()

        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")

        if search:
            queryset = queryset.filter(name__icontains=search)

        if category and category.lower() != "all":
            queryset = queryset.filter(category__iexact=category)

        return queryset

    def get_serializer_context(self):
        return {"request": self.request}


class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]  

    def get_serializer_context(self):
        return {"request": self.request}
