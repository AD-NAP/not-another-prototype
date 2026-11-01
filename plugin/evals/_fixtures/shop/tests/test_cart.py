from shop.cart import cart_total


def test_sums_price_times_quantity():
    assert cart_total([(2.50, 2), (1.00, 1)]) == 6.00


def test_rounds_to_cents():
    assert cart_total([(0.333, 3)]) == 1.00
