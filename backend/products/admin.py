from django.contrib import admin
from .models import Product, ProductVariant
from reviews.models import Review


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    min_num = 1
    show_change_link = True


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0
    readonly_fields = ("created_at",)
    can_delete = True


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category", "featured", "created_at")
    list_editable = ("featured",)
    search_fields = ("name", "category")
    list_filter = ("category", "featured", "created_at")
    ordering = ("-created_at",)
    inlines = [ProductVariantInline, ReviewInline]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ("product", "size", "color", "stock")
    list_filter = ("size", "color")
    search_fields = ("product__name",)