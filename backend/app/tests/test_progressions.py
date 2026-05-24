"""
test_progressions.py — Tests de progresión semanal.

🔑 Tests CRÍTICOS porque progression_service es la pieza más
   delicada del sistema.

Tests planeados:
    def test_calculate_current_week_first_day()           # → semana 1
    def test_calculate_current_week_day_8()                # → semana 2
    def test_calculate_current_week_future_start_date()    # → 0 o error

    async def test_get_effective_angles_with_matching_week(...)
    async def test_get_effective_angles_falls_back_to_previous_week(...)
    async def test_get_effective_angles_falls_back_to_default(...)
    async def test_get_effective_angles_no_progressions_no_defaults(...)

    async def test_create_progression(...)
    async def test_create_duplicate_progression_fails(...)
    async def test_bulk_replace_progressions(...)
"""

# TODO: tests de progresión
