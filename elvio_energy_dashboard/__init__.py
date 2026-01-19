from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry

from .panel import async_register_panel

async def async_setup(hass: HomeAssistant, config: dict):
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    await async_register_panel(hass)
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry):
    return True
