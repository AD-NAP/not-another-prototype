import importlib

import pytest


def load(name, module="shop.shipping"):
    try:
        mod = importlib.import_module(module)
    except ModuleNotFoundError as e:
        # Only the module under test (or its package) missing means "not implemented".
        if e.name is None or not (module == e.name or module.startswith(e.name + ".")):
            raise
        pytest.fail(f"Not implemented yet: {module}")
    if not hasattr(mod, name):
        pytest.fail(f"Not implemented yet: {module}.{name}")
    return getattr(mod, name)


def test_c1_under_50_and_light_costs_4_99():
    shipping_cost = load("shipping_cost")
    assert shipping_cost(total=20.00, weight_kg=2) == 4.99


def test_c1_under_50_and_exactly_5_kg_costs_4_99():
    shipping_cost = load("shipping_cost")
    assert shipping_cost(total=20.00, weight_kg=5) == 4.99


def test_c2_total_over_50_is_free():
    shipping_cost = load("shipping_cost")
    assert shipping_cost(total=80.00, weight_kg=2) == 0.00


def test_c2_total_over_50_is_free_whatever_it_weighs():
    shipping_cost = load("shipping_cost")
    assert shipping_cost(total=80.00, weight_kg=20) == 0.00


def test_c3_edge_case_total_of_exactly_50_is_free():
    shipping_cost = load("shipping_cost")
    assert shipping_cost(total=50.00, weight_kg=2) == 0.00


def test_c4_edge_case_under_50_and_over_5_kg_costs_6_99():
    shipping_cost = load("shipping_cost")
    assert shipping_cost(total=20.00, weight_kg=5.5) == 6.99
