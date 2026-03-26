from rest_framework import serializers
from .models import Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "size", "color", "stock"]


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
from rest_framework import serializers
from .models import Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "size", "color", "stock"]


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_image(self, obj):
        if not obj.image:
            return None
        
        val = str(obj.image)
        request = self.context.get("request")

        # If it's already a full external URL
        if val.startswith("http"):
            return val
            
        # If it's a relative path starting with /
        if val.startswith("/") and request:
            return request.build_absolute_uri(val)

        # Handle CloudinaryResource or other types
        try:
            url = obj.image.url
            if url.startswith("http"):
                return url
            if request:
                return request.build_absolute_uri(url)
            return url
        except AttributeError:
            if val.startswith("/") and request:
                return request.build_absolute_uri(val)
            return val


    def create(self, validated_data):
        variants_data = validated_data.pop("variants", [])
        product = Product.objects.create(**validated_data)

        for variant in variants_data:
            ProductVariant.objects.create(product=product, **variant)

        return product

    def update(self, instance, validated_data):
        variants_data = validated_data.pop("variants", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if variants_data is not None:
            instance.variants.all().delete()

            for variant in variants_data:
                ProductVariant.objects.create(product=instance, **variant)

        return instance


class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "category", "image"]

    def get_image(self, obj):
        if not obj.image:
            return None
            
        val = str(obj.image)
        request = self.context.get("request")

        if val.startswith("http"):
            return val
            
        if val.startswith("/") and request:
            return request.build_absolute_uri(val)

        try:
            url = obj.image.url
            if url.startswith("http"):
                 return url
            
            # Application of Cloudinary transformations only if it's a cloudinary URL
            if "/upload/" in url:
                return url.replace(
                    "/upload/",
                    "/upload/w_400,q_auto,f_auto/"
                )
            
            if request:
                return request.build_absolute_uri(url)
            return url
        except AttributeError:
            return val
