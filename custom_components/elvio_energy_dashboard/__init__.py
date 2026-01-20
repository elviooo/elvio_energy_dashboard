from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry

from .panel import async_register_panel

async def async_setup(hass: HomeAssistant, config: dict):
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry):
    return True

async def async_setup_entry(hass, entry):
    await async_register_panel(hass)

    hass.async_create_task(
        hass.config_entries.async_forward_entry_setup(entry, "sensor")
    )

    return True
