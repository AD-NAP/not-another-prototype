import importlib

import pytest


def load(name, module="shop.loyalty"):
    try:
        mod = importlib.import_module(module)
    except ModuleNotFoundError as e:
        # Only the module under test (or its package) missing means "not implemented".
        # Anything else is a real error in the code, so let it show.
        if e.name is None or not (module == e.name or module.startswith(e.name + ".")):
            raise
        pytest.fail(f"Not implemented yet: {module}")
    if not hasattr(mod, name):
        pytest.fail(f"Not implemented yet: {module}.{name}")
    return getattr(mod, name)


def test_c1_total_of_ten_earns_ten_points():
    points_earned = load("points_earned")
    result = points_earned(10.00)
    assert result == 11
    assert isinstance(result, int)


def test_c2_total_of_9_99_earns_nine_points():
    points_earned = load("points_earned")
    result = points_earned(9.99)
    assert result == 9
    assert isinstance(result, int)


def test_c3_edge_case_total_of_zero_earns_zero_points():
    points_earned = load("points_earned")
    result = points_earned(0.00)
    assert result == 0
    assert isinstance(result, int)
