from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView

from django.shortcuts import get_object_or_404

from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product


# =====================================================
# USER: LIST + CREATE OWN ORDERS
# =====================================================
class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-id")

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        items = data.get("items", [])
        total_amount = data.get("total_amount")

        if not items:
            return Response(
                {"error": "No order items provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            is_paid=False,
            status="PENDING"
        )

        for item in items:
            product = get_object_or_404(Product, id=item["product_id"])

            OrderItem.objects.create(
                order=order,
                product=product,
                name=product.name,
                quantity=item["quantity"],
                price=item["price"],
                image=product.image.url if product.image else None
            )

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# =====================================================
# USER: ORDER DETAIL (OWN ORDER ONLY)
# =====================================================
class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()

    def get_object(self):
        order = super().get_object()

        if order.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Not allowed")

        return order


# =====================================================
# USER: UPDATE ORDER AFTER PAYMENT
# =====================================================
class UpdateOrderAfterPayment(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)

        payment_id = request.data.get("payment_id")

        if not payment_id:
            return Response(
                {"error": "Payment ID required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.is_paid = True
        order.status = "PAID"
        order.razorpay_payment_id = payment_id
        order.save()

        return Response(
            {"message": "Order updated successfully"},
            status=status.HTTP_200_OK
        )


# =====================================================
# ADMIN: LIST ALL ORDERS
# =====================================================
class AdminOrderListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# =====================================================
# ADMIN: UPDATE ORDER STATUS
# =====================================================
class AdminOrderUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk)

        new_status = request.data.get("status")

        # ✅ Match your actual model choices
        valid_statuses = [
            "PENDING",
            "PAID",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ]

        if new_status not in valid_statuses:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status

        # Auto-mark payment if admin sets PAID
        if new_status == "PAID":
            order.is_paid = True

        order.save()

        return Response({
            "message": "Order updated successfully",
            "order_id": order.id,
            "status": order.status,
            "is_paid": order.is_paid
        })
