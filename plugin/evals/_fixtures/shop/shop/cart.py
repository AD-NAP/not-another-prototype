def cart_total(items):
    """Sum of (price, quantity) pairs, rounded to cents."""
    return round(sum(price * quantity for price, quantity in items), 2)
