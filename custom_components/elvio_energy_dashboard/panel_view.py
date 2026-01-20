from pathlib import Path

from aiohttp import web
from homeassistant.components.http import HomeAssistantView


class ElvioEnergyDashboardView(HomeAssistantView):
    url = "/api/elvio_energy_dashboard/panel"
    name = "api:elvio_energy_dashboard:panel"
    requires_auth = False

    async def get(self, request):
        html_path = Path(__file__).parent / "panel.html"
        html = html_path.read_text(encoding="utf-8")

        return web.Response(
            body=html.encode("utf-8"),
            content_type="text/html",
        )
