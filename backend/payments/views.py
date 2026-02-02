import razorpay
import hmac, hashlib
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .razorpay_client import create_razorpay_order
from orders.models import Order
from django.conf import settings



client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment(request):
    amount = request.data.get("amount")

    if not amount:
        return Response({"error": "Amount is required"}, status=400)

    # ✅ Create order in DB first
    order_db = Order.objects.create(
        user=request.user,
        total_amount=amount,
        is_paid=False
    )

    # ✅ Create Razorpay order
    order = create_razorpay_order(amount, receipt=f"order_{order_db.id}")

    # ✅ Store razorpay order id
    order_db.razorpay_order_id = order["id"]
    order_db.save()

    return Response({
        "razorpay_order": order,
        "order_id": order_db.id
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    data = request.data

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': data.get("razorpay_order_id"),
            'razorpay_payment_id': data.get("razorpay_payment_id"),
            'razorpay_signature': data.get("razorpay_signature")
        })

        order = Order.objects.get(
            razorpay_order_id=data.get("razorpay_order_id"),
            user=request.user
        )

        order.is_paid = True
        order.payment_id = data.get("razorpay_payment_id")
        order.status = "Paid"
        order.save()

        return Response({"status": "success"})

    except Exception:
        return Response({"status": "failed"}, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def razorpay_webhook(request):
    webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
    received_signature = request.headers.get("X-Razorpay-Signature")

    body = request.body

    expected_signature = hmac.new(
        webhook_secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, received_signature):
        return Response({"error": "Invalid signature"}, status=400)

    data = request.data
    event = data.get("event")

    if event == "payment.captured":
        payment = data["payload"]["payment"]["entity"]
        razorpay_order_id = payment["order_id"]
        payment_id = payment["id"]

        order = Order.objects.get(razorpay_order_id=razorpay_order_id)
        order.is_paid = True
        order.status = "Paid"
        order.payment_id = payment_id
        order.save()

    return Response({"status": "ok"})



