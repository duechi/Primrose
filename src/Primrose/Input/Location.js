/*
pliny.class({
  parent: "Primrose.Input",
  name: "Location",
  baseClass: "Primrose.Input.InputProcessor",
  description: "Provides GPS data to the input system."
});
*/

import { coalesce } from "../../util";
import InputProcessor from "./InputProcessor";

export default class Location extends InputProcessor {
  constructor(commands, options) {
    super("Location", commands, ["LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED"]);

    this.options = coalesce({
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 25000
    }, options);

    this.available = !!navigator.geolocation;
    if (this.available) {
      navigator.geolocation.watchPosition(
        this.setState.bind(this),
        () => this.available = false,
        this.options);
    }
  }

  setState(location) {
    this.inPhysicalUse = true;
    for (var p in location.coords) {
      var k = p.toUpperCase();
      if (this.axisNames.indexOf(k) > -1) {
        this.setAxis(k, location.coords[p]);
      }
    }
    this.update();
  }
};
