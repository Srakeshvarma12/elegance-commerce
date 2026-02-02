from django.contrib import admin
from .models import Product, ProductVariant
from reviews.models import Review


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1
    readonly_fields = ("created_at",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductVariantInline, ReviewInline]
    list_display = ("name", "price", "category", "created_at")


admin.site.register(ProductVariant)
