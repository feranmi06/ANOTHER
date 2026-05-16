"""
Management command to seed the database with L-BUY's initial product catalogue.
Run: python manage.py seed_products
"""
from django.core.management.base import BaseCommand
from store.models import Product


PRODUCTS = [
    # ── Trending Products ────────────────────────────────────────────────────
    {
        'name': 'Luxury Pink Dress',
        'description': 'Elegant luxury pink dress perfect for any occasion. Premium fabric with a flattering fit.',
        'price': 25000,
        'original_price': None,
        'image_url': 'image/pink dress.jpg',
        'category': 'fashion',
        'stock': 50,
        'is_flash_sale': False,
    },
    {
        'name': 'Premium Hand Bag',
        'description': 'Premium quality hand bag crafted from the finest materials. Stylish and durable.',
        'price': 18000,
        'original_price': None,
        'image_url': 'image/pink bag.jpg',
        'category': 'bags',
        'stock': 30,
        'is_flash_sale': False,
    },
    {
        'name': 'High Heels',
        'description': 'Stunning high heels that add height and elegance to any outfit.',
        'price': 14500,
        'original_price': None,
        'image_url': 'image/heels.jpg',
        'category': 'shoes',
        'stock': 40,
        'is_flash_sale': False,
    },
    {
        'name': 'Bone Straight Wig',
        'description': 'Premium bone straight wig. Silky smooth, long-lasting, and natural-looking.',
        'price': 70000,
        'original_price': None,
        'image_url': 'image/wig.avif',
        'category': 'beauty',
        'stock': 20,
        'is_flash_sale': False,
    },
    {
        'name': 'Luxury Perfume',
        'description': 'Exquisite luxury perfume with a long-lasting, captivating fragrance.',
        'price': 12000,
        'original_price': None,
        'image_url': 'image/perfume.jpeg',
        'category': 'beauty',
        'stock': 60,
        'is_flash_sale': False,
    },
    {
        'name': 'Diamond Jewelry Set',
        'description': 'Dazzling diamond-studded jewelry set including necklace and earrings.',
        'price': 40000,
        'original_price': None,
        'image_url': 'image/necklace.jpg',
        'category': 'jewelry',
        'stock': 15,
        'is_flash_sale': False,
    },
    {
        'name': 'Barcelona F.C Special Edition Jersey 2025/2026 Season',
        'description': 'Official Barcelona F.C special edition jersey for the 2025/2026 season.',
        'price': 20000,
        'original_price': None,
        'image_url': 'image/barcelona.jpg',
        'category': 'fashion',
        'stock': 25,
        'is_flash_sale': False,
    },
    {
        'name': 'Ladies/Female Waist Chain Gold-Waist Bead',
        'description': 'Beautiful gold waist chain and bead set. Adds a stunning accent to any look.',
        'price': 7000,
        'original_price': None,
        'image_url': 'image/waist.jpg',
        'category': 'jewelry',
        'stock': 80,
        'is_flash_sale': False,
    },
    {
        'name': 'Luxury and Unique Women T-Shirt Polo Top For Ladies - Pink',
        'description': 'Luxury and unique polo top for ladies in pink. Comfortable and stylish.',
        'price': 12500,
        'original_price': None,
        'image_url': 'image/polo shirt.jpg',
        'category': 'fashion',
        'stock': 45,
        'is_flash_sale': False,
    },
    {
        'name': 'Press on Nails - Medium Long Rhinestone Pink (24pcs)',
        'description': 'Press on nails — medium long rhinestone pink false nails. Square bling glossy 3D tips for women and girls.',
        'price': 7150,
        'original_price': None,
        'image_url': 'image/female nails.jpg',
        'category': 'beauty',
        'stock': 100,
        'is_flash_sale': False,
    },
    # ── Flash Sale Products ──────────────────────────────────────────────────
    {
        'name': 'Classic Corporate Office Ladies Gown',
        'description': 'Elegant corporate gown perfect for the modern office woman. Tailored for comfort and professionalism.',
        'price': 18000,
        'original_price': 30000,
        'image_url': 'image/office dress.jpg',
        'category': 'fashion',
        'stock': 35,
        'is_flash_sale': True,
    },
    {
        'name': 'STY Lady Watch + Wallet Set',
        'description': 'Stylish women wrist watch and PU leather wallet set. Perfect matching combo.',
        'price': 12000,
        'original_price': 16000,
        'image_url': 'image/ladies watch.jpg',
        'category': 'accessories',
        'stock': 20,
        'is_flash_sale': True,
    },
    {
        'name': 'Women Ladies Platform Chunky Loafers – Black',
        'description': 'Office-ready platform chunky loafers in black. Slip-on style with premium sole.',
        'price': 45000,
        'original_price': 90000,
        'image_url': 'image/female shoe.jpg',
        'category': 'shoes',
        'stock': 18,
        'is_flash_sale': True,
    },
    {
        'name': 'Ladies Sexy G-String Panties (Set of 6)',
        'description': 'Comfortable and stylish ladies G-string panties. Set of 6 in assorted colours.',
        'price': 10000,
        'original_price': 15500,
        'image_url': 'image/panties.jpg',
        'category': 'fashion',
        'stock': 70,
        'is_flash_sale': True,
    },
]


class Command(BaseCommand):
    help = 'Seed the database with L-BUY initial product catalogue (14 products).'

    def handle(self, *args, **kwargs):
        created_count = 0
        skipped_count = 0

        for data in PRODUCTS:
            product, created = Product.objects.get_or_create(
                name=data['name'],
                defaults=data,
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'  ✅ Created: {product.name}'))
            else:
                skipped_count += 1
                self.stdout.write(self.style.WARNING(f'  ⏭  Skipped (already exists): {product.name}'))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done! {created_count} product(s) created, {skipped_count} skipped.'
        ))
