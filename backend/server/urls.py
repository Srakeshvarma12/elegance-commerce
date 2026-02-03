from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

# ---- HEALTH CHECK / ROOT ROUTE ----
def home(request):
    return JsonResponse({
        "status": "success",
        "message": "Django backend is running",
        "environment": "production" if not settings.DEBUG else "development"
    })

urlpatterns = [
    # ROOT URL (IMPORTANT FOR RENDER)
    path("", home),

    # ADMIN
    path("admin/", admin.site.urls),

    # API ROUTES (YOUR EXISTING ONES — UNTOUCHED)
    path("api/products/", include("products.urls")),
    path("api/auth/", include("accounts.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/reviews/", include("reviews.urls")),
    path("api/wishlist/", include("wishlist.urls")),
]

# Serve media locally only
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
