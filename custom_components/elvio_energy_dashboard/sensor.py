from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.const import UnitOfPower
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.config_entries import ConfigEntry

from .const import (
    DOMAIN,
    CONF_CONSUMPTION,
    CONF_GENERATION,
    SENSOR_NET_IMPORT,
    SENSOR_NET_EXPORT,
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities,
):
    consumption = entry.data[CONF_CONSUMPTION]
    generation = entry.data[CONF_GENERATION]

    sensors = [
        ElvioGridImportSensor(hass, consumption, generation),
        ElvioGridExportSensor(hass, consumption, generation),
    ]

    async_add_entities(sensors)


class _ElvioBaseEnergySensor(SensorEntity):
    _attr_native_unit_of_measurement = UnitOfPower.W
    _attr_device_class = "power"
    _attr_state_class = "measurement"

    def __init__(self, hass, consumption, generation):
        self.hass = hass
        self.consumption_entity = consumption
        self.generation_entity = generation
        self._value = 0

    async def async_added_to_hass(self):
        async_track_state_change_event(
            self.hass,
            [self.consumption_entity, self.generation_entity],
            self._handle_change,
        )
        await self._update()

    @callback
    async def _handle_change(self, event):
        await self._update()

    async def _update(self):
        cons = self._get_state(self.consumption_entity)
        gen = self._get_state(self.generation_entity)

        if cons is None or gen is None:
            self._value = 0
        else:
            self._calculate(cons, gen)

        self.async_write_ha_state()

    def _get_state(self, entity_id):
        state = self.hass.states.get(entity_id)
        if not state or state.state in ("unknown", "unavailable"):
            return None
        try:
            return float(state.state)
        except ValueError:
            return None

    @property
    def native_value(self):
        return round(self._value, 2)

    def _calculate(self, consumption, generation):
        raise NotImplementedError


class ElvioGridImportSensor(_ElvioBaseEnergySensor):
    _attr_name = "ELVIO Grid Import"
    _attr_unique_id = "elvio_grid_import"

    def _calculate(self, consumption, generation):
        net = consumption - generation
        self._value = max(net, 0)


class ElvioGridExportSensor(_ElvioBaseEnergySensor):
    _attr_name = "ELVIO Grid Export"
    _attr_unique_id = "elvio_grid_export"

    def _calculate(self, consumption, generation):
        net = consumption - generation
        self._value = abs(min(net, 0))
