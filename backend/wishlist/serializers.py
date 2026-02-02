from rest_framework import serializers
from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(
        source="product.price", max_digits=10, decimal_places=2, read_only=True
    )
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image",
        ]

    def get_product_image(self, obj):
        request = self.context.get("request")
        if obj.product.image and request:
            return request.build_absolute_uri(obj.product.image.url)
        return None
