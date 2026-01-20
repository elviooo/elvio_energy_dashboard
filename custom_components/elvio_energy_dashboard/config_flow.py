from homeassistant import config_entries
from homeassistant.helpers.selector import selector

from .const import (
    DOMAIN,
    CONF_CONSUMPTION,
    CONF_GENERATION,
    CONF_BATTERY,
)


class ElvioEnergyDashboardConfigFlow(
    config_entries.ConfigFlow,
    domain=DOMAIN,
):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            self._consumption = user_input[CONF_CONSUMPTION]
            return await self.async_step_generation()

        return self.async_show_form(
            step_id="user",
            data_schema={
                CONF_CONSUMPTION: selector({
                    "entity": {
                        "domain": "sensor",
                        "device_class": ["power", "energy"]
                    }
                })
            },
        )

    async def async_step_generation(self, user_input=None):
        if user_input is not None:
            self._generation = user_input[CONF_GENERATION]
            return await self.async_step_battery()

        return self.async_show_form(
            step_id="generation",
            data_schema={
                CONF_GENERATION: selector({
                    "entity": {
                        "domain": "sensor",
                        "device_class": ["power", "energy"]
                    }
                })
            },
        )

    async def async_step_battery(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(
                title="ELVIO Energy Dashboard",
                data={
                    CONF_CONSUMPTION: self._consumption,
                    CONF_GENERATION: self._generation,
                    CONF_BATTERY: user_input.get(CONF_BATTERY),
                },
            )

        return self.async_show_form(
            step_id="battery",
            data_schema={
                CONF_BATTERY: selector({
                    "entity": {
                        "domain": "sensor",
                        "device_class": ["power", "energy"]
                    }
                })
            },
        )
