import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from products.models import Product, ProductVariant

def seed():
    # Clear existing
    Product.objects.all().delete()
    
    products = [
        {
            "name": "Sony WH-1000XM5",
            "description": "Premium noise-canceling headphones with industry-leading performance.",
            "price": 29999.00,
            "category": "Headphones",
            "image_url": "/media/products/sony_headphones.png",
            "featured": True
        },
        {
            "name": "Apple Watch Series 9",
            "description": "Smarter, brighter, mightier. The most advanced Apple Watch yet.",
            "price": 41900.00,
            "category": "Watches",
            "image_url": "/media/products/apple_watch.png",
            "featured": True
        },
        {
            "name": "MacBook Pro M3",
            "description": "Mind-blowing. Eye-opening. The power of M3 is here.",
            "price": 169900.00,
            "category": "Laptops",
            "image_url": "/media/products/macbook_pro.png",
            "featured": True
        },
        {
            "name": "Nike Air Max 270",
            "description": "Big Air and bold styling for everyday comfort.",
            "price": 12999.00,
            "category": "Shoes",
            "image_url": "/media/products/nike_shoes.png",
            "featured": False
        },
        {
            "name": "iPhone 15 Pro",
            "description": "Titanium. So strong. So light. So Pro.",
            "price": 129900.00,
            "category": "Mobile",
            "image_url": "/media/products/iphone.png",
            "featured": True
        },
        {
            "name": "Nintendo Switch OLED",
            "description": "Vibrant 7-inch OLED screen and enhanced audio.",
            "price": 32900.00,
            "category": "Gaming",
            "image_url": "/media/products/nintendo_switch.png",
            "featured": False
        },
        {
            "name": "Bose SoundLink Revolve+",
            "description": "True 360 sound for consistent, uniform coverage.",
            "price": 24500.00,
            "category": "Speakers",
            "image_url": "/media/products/bose_speaker.png",
            "featured": True
        },
        {
            "name": "Samsung Galaxy S24 Ultra",
            "description": "The ultimate Ultra. Now with Galaxy AI.",
            "price": 129999.00,
            "category": "Mobile",
            "image_url": "/media/products/samsung_galaxy.png",
            "featured": False
        }
    ]

    for p_data in products:
        image_url = p_data.pop("image_url")
        p = Product.objects.create(**p_data)
        # We manually set image since CloudinaryField might try to upload if we pass a URL
        # But we can just use the URL in the frontend if we modify the serializer fallback
        p.image = image_url
        p.save()
        
        # Add a default variant
        ProductVariant.objects.create(
            product=p,
            size="Default",
            color="Default",
            stock=100
        )

    print(f"Successfully seeded {len(products)} products.")

if __name__ == "__main__":
    seed()
