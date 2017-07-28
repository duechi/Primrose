pliny.namespace({
  name: "Flags",
  description: `Various flags used for feature detecting and configuring the system.

When including Primrose as a \`script\` tag, the Flags namespace is imported directly onto the window object and is available without qualification.`
});

pliny.subClass(info);
    pliny.value({
          parent: name,
          name: key,
          type: "Number",
          description: val.toString(),
          value: val
        });
      pliny.get(value);
        pliny.js.map
