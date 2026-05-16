from django.contrib import admin
from .models import Product, Cart, CartItem, Wishlist, Order, OrderItem


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'original_price', 'stock', 'is_flash_sale', 'is_active']
    list_filter = ['category', 'is_flash_sale', 'is_active']
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock', 'is_flash_sale', 'is_active']


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'item_count', 'total', 'updated_at']
    inlines = [CartItemInline]

    def item_count(self, obj):
        return obj.item_count

    def total(self, obj):
        return f"₦{obj.total:,.0f}"


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'added_at']
    list_filter = ['product__category']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method']
    list_editable = ['status']
    inlines = [OrderItemInline]
    readonly_fields = ['total', 'created_at', 'updated_at']
