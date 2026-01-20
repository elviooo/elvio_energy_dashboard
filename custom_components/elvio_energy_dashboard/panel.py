from homeassistant.core import HomeAssistant
from homeassistant.components import frontend

from .const import DOMAIN, PANEL_TITLE, PANEL_ICON
from .panel_view import ElvioEnergyDashboardView

async def async_register_panel(hass: HomeAssistant):
    # HTTP View registrieren
    hass.http.register_view(ElvioEnergyDashboardView)

    # Panel registrieren
    frontend.async_register_built_in_panel(
        hass,
        component_name="iframe",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=DOMAIN,
        config={
            "url": "/api/elvio_energy_dashboard/panel"
        },
        require_admin=True
    )
