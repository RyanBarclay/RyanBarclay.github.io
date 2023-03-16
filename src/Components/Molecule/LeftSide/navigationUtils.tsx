// navigationUtils.ts

import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { ComponentLinkInfo } from "../SharedLogic/navigationLogic";

function makeListButtonLeaf(
  to: string,
  label: string,
  key: string,
  currentItem: string,

  layer: number,
  icon?: JSX.Element
): JSX.Element {
  return (
    <ListItemButton
      component={Link}
      to={to}
      key={key}
      sx={layer > 0 ? { pl: layer * 4 } : {}}
      selected={currentItem == key}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

function makeListButtonNode(
  label: string,
  key: string,
  childListItems: ComponentLinkInfo,
  expandedItems: string[],
  handleListItemClick: (id: string) => void,
  currentItem: string,

  layer: number,
  icon?: JSX.Element
): JSX.Element {
  return (
    <React.Fragment key={key + "Parent"}>
      <ListItemButton
        onClick={() => {
          handleListItemClick(key);
        }}
        key={key}
        sx={layer == 4 ? { pl: layer * 4 } : {}}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
        {expandedItems.includes(key) ? (
          <KeyboardArrowDown />
        ) : (
          <KeyboardArrowRight />
        )}
      </ListItemButton>
      <Collapse in={expandedItems.includes(key)}>
        <List component="div" disablePadding>
          {makeTree(
            childListItems,
            expandedItems,
            handleListItemClick,
            currentItem,

            layer + 1,
            key
          )}
        </List>
      </Collapse>
    </React.Fragment>
  );
}

export function makeTree(
  obj: ComponentLinkInfo,
  expandedItems: string[],
  handleListItemClick: (id: string) => void,
  currentItem: string,
  layer = 0,
  curKey = ""
): JSX.Element {
  const foo = () => {};
  return (
    <>
      {Object.keys(obj).map((key) => {
        const { to, label, icon, childListItems } = obj[key];

        return typeof to === "string" && typeof childListItems === "undefined"
          ? makeListButtonLeaf(
              to,
              label,
              curKey + key,
              currentItem,
              layer,
              icon
            )
          : makeListButtonNode(
              label,
              curKey + key,
              childListItems,
              expandedItems,
              handleListItemClick,
              currentItem,
              layer,
              icon
            );
      })}
    </>
  );
}
