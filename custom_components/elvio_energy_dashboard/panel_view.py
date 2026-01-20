from homeassistant.components.http import HomeAssistantView
from pathlib import Path

class ElvioEnergyDashboardView(HomeAssistantView):
    url = "/api/elvio_energy_dashboard/panel"
    name = "api:elvio_energy_dashboard:panel"
    requires_auth = False

    async def get(self, request):
        html_path = Path(__file__).parent / "panel.html"
        return html_path.read_text(encoding="utf-8")
