---
type: regex
target: { source: file, path: shop/cart.py }
pattern: 'return round\(sum\(price \* quantity for price, quantity in items\), 2\)'
---
