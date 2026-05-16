from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Product, Cart, CartItem, Wishlist, Order, OrderItem
from .serializers import (
    ProductSerializer, CartSerializer, CartItemSerializer,
    WishlistSerializer, OrderSerializer, PlaceOrderSerializer,
)


# ─── Products ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    """
    GET /api/products/
    Optional query params:
      ?category=bags
      ?flash_sale=true
      ?q=dress          (search)
    """
    qs = Product.objects.filter(is_active=True)

    category = request.query_params.get('category')
    if category:
        qs = qs.filter(category=category)

    flash_sale = request.query_params.get('flash_sale')
    if flash_sale == 'true':
        qs = qs.filter(is_flash_sale=True)

    q = request.query_params.get('q', '').strip()
    if q:
        qs = qs.filter(name__icontains=q)

    serializer = ProductSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, pk):
    """GET /api/products/<id>/"""
    try:
        product = Product.objects.get(pk=pk, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, context={'request': request})
    return Response(serializer.data)


# ─── Cart ─────────────────────────────────────────────────────────────────────

def _get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_detail(request):
    """GET /api/cart/ — return the user's current cart."""
    cart = _get_or_create_cart(request.user)
    return Response(CartSerializer(cart, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cart_add(request):
    """
    POST /api/cart/add/
    Body: { "product_id": 3, "quantity": 1 }
    """
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    if not product_id:
        return Response({'error': 'product_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(pk=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

    if quantity < 1:
        return Response({'error': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)

    cart = _get_or_create_cart(request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if created:
        item.quantity = quantity
    else:
        item.quantity += quantity
    item.save()

    return Response({
        'message': f'"{product.name}" added to cart 🛒',
        'cart': CartSerializer(cart, context={'request': request}).data,
    }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def cart_item(request, pk):
    """
    PUT  /api/cart/item/<id>/ — update quantity  { "quantity": 2 }
    DELETE /api/cart/item/<id>/ — remove item
    """
    try:
        item = CartItem.objects.get(pk=pk, cart__user=request.user)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        item.delete()
        cart = _get_or_create_cart(request.user)
        return Response({'message': 'Item removed.', 'cart': CartSerializer(cart, context={'request': request}).data})

    quantity = int(request.data.get('quantity', 1))
    if quantity < 1:
        item.delete()
    else:
        item.quantity = quantity
        item.save()

    cart = _get_or_create_cart(request.user)
    return Response({'message': 'Cart updated.', 'cart': CartSerializer(cart, context={'request': request}).data})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cart_clear(request):
    """DELETE /api/cart/clear/ — empty the entire cart."""
    cart = _get_or_create_cart(request.user)
    cart.items.all().delete()
    return Response({'message': 'Cart cleared.'})


# ─── Wishlist ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlist_list(request):
    """GET /api/wishlist/"""
    items = Wishlist.objects.filter(user=request.user).select_related('product')
    return Response(WishlistSerializer(items, many=True, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wishlist_add(request):
    """
    POST /api/wishlist/add/
    Body: { "product_id": 5 }
    """
    product_id = request.data.get('product_id')
    if not product_id:
        return Response({'error': 'product_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(pk=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

    item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
    if not created:
        return Response({'message': 'Already in your wishlist ❤️'}, status=status.HTTP_200_OK)

    return Response({
        'message': f'"{product.name}" added to wishlist ❤️',
        'item': WishlistSerializer(item, context={'request': request}).data,
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def wishlist_remove(request, pk):
    """DELETE /api/wishlist/item/<id>/"""
    try:
        item = Wishlist.objects.get(pk=pk, user=request.user)
    except Wishlist.DoesNotExist:
        return Response({'error': 'Wishlist item not found.'}, status=status.HTTP_404_NOT_FOUND)

    item.delete()
    return Response({'message': 'Removed from wishlist.'})


# ─── Orders ───────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_list(request):
    """GET /api/orders/ — list the user's order history."""
    orders = Order.objects.filter(user=request.user).prefetch_related('items')
    return Response(OrderSerializer(orders, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def order_create(request):
    """
    POST /api/orders/create/
    Body: {
      "shipping_name": "...",
      "shipping_address": "...",
      "shipping_phone": "...",
      "payment_method": "card"
    }
    Converts the user's current cart into an Order.
    """
    serializer = PlaceOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cart = _get_or_create_cart(request.user)
    if cart.items.count() == 0:
        return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the order
    order = Order.objects.create(
        user=request.user,
        total=cart.total,
        shipping_name=serializer.validated_data['shipping_name'],
        shipping_address=serializer.validated_data['shipping_address'],
        shipping_phone=serializer.validated_data['shipping_phone'],
        payment_method=serializer.validated_data['payment_method'],
    )

    # Snapshot each cart item into an OrderItem
    for cart_item in cart.items.select_related('product'):
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            product_name=cart_item.product.name,
            product_price=cart_item.product.price,
            quantity=cart_item.quantity,
        )

    # Clear the cart
    cart.items.all().delete()

    return Response({
        'message': 'Order placed successfully! 💕',
        'order': OrderSerializer(order).data,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, pk):
    """GET /api/orders/<id>/"""
    try:
        order = Order.objects.get(pk=pk, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(OrderSerializer(order).data)
