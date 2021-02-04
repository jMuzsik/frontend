import React, { useState, useEffect } from "react";
import { Button, Intent, InputGroup, ButtonGroup } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { IconNames } from "@blueprintjs/icons";

import db from "../../../db";

function handleUpdate(e, property, updateNames, names) {
  const value = e.target.value;
  updateNames({ ...names, [property]: value });
}

export async function handleSubmit(names, { changeData, isSubmitting }) {
  // there is only one object of this at all times
  const currentNames = await db.names.toCollection().first();
  await db.names.update(currentNames.id, names);
  const updatedNames = await db.names.get(currentNames.id);

  changeData({
    update: "updateNames",
    names: updatedNames,
  });
  isSubmitting(false);
}

const icons = {
  subject: IconNames.LIGHTBULB,
  create: IconNames.BUILD,
  edit: IconNames.EDIT,
  change: IconNames.CHANGES,
  network: IconNames.GLOBE_NETWORK,
  names: IconNames.KEY,
  action: IconNames.TAKE_ACTION,
  content: IconNames.DOCUMENT,
  delete: IconNames.DELETE,
};

function IGroup({ icon, str, value, updateNames, names }) {
  return (
    <InputGroup
      asyncControl
      leftIcon={icon}
      onChange={(e) => handleUpdate(e, str, updateNames, names)}
      value={value}
    />
  );
}

export default function EditNames({ changeData, treeData }) {
  const [submitting, isSubmitting] = useState(false);
  const [names, updateNames] = useState({
    subject: "",
    create: "",
    view: "",
    edit: "",
    change: "",
    fresh: "",
    network: "",
    dnd: "",
    settings: "",
    action: "",
  });

  useEffect(() => {
    delete treeData.names.id;
    delete treeData.names.createdAt;
    updateNames(treeData.names);
  }, [treeData.names]);

  return (
    <Popover2
      placement="bottom-end"
      autoFocus
      enforceFocus={false}
      content={
        <form
          className="edit-name"
          onSubmit={(e) => {
            e.preventDefault();
            isSubmitting(true);
            handleSubmit(names, {
              changeData,
              isSubmitting,
            });
          }}
        >
          <ButtonGroup vertical large>
            {Object.keys(names).map((name) => (
              <IGroup
                key={name}
                icon={icons[name]}
                str={name}
                value={names[name]}
                updateNames={updateNames}
                names={names}
              />
            ))}
            <Button type="submit" intent={Intent.SUCCESS} loading={submitting}>
              {names.action}
            </Button>
          </ButtonGroup>
        </form>
      }
    >
      <Button icon={IconNames.KEY} />
    </Popover2>
  );
}
