import importlib

import pytest


def load(name, module="shop.discounts"):
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


def test_c1_save10_takes_ten_percent_off_50():
    apply_code = load("apply_code")
    assert apply_code(50.00, "SAVE10") == 45.00


def test_c2_save10_on_19_99_gives_17_99():
    apply_code = load("apply_code")
    assert apply_code(19.99, "SAVE10") == 17.99


def test_c3_unknown_code_leaves_total_unchanged():
    apply_code = load("apply_code")
    assert apply_code(50.00, "NOPE") == 50.00


def test_c4_edge_case_zero_total_stays_zero():
    apply_code = load("apply_code")
    assert apply_code(0.00, "SAVE10") == 0.00
