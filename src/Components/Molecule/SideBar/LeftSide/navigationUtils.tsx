// navigationUtils.ts

import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ComponentLinkInfo } from "../../../Logic/navigationLogic";

function makeListButtonLeaf(
  to: string,
  label: string,
  key: string,
  layer: number,
  icon?: JSX.Element
): JSX.Element {
  if (layer > 0) {
    return (
      <ListItemButton component={Link} to={to} key={key} sx={{ pl: layer * 4 }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    );
  } else {
    return (
      <ListItemButton component={Link} to={to} key={key}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    );
  }
}

function makeListButtonNode(
  label: string,
  key: string,
  childListItems: ComponentLinkInfo,
  expandedItems: string[],
  handleListItemClick: (id: string) => void,
  layer: number,
  icon?: JSX.Element
): JSX.Element {
  if (layer > 0) {
    return (
      <>
        <ListItemButton
          onClick={() => {
            handleListItemClick(key);
          }}
          key={key}
          sx={{ pl: layer * 4 }}
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
              layer + 1,
              key
            )}
          </List>
        </Collapse>
      </>
    );
  } else {
    return (
      <>
        <ListItemButton
          onClick={() => {
            handleListItemClick(key);
          }}
          key={key}
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
              layer + 1,
              key
            )}
          </List>
        </Collapse>
      </>
    );
  }
}

export function makeTree(
  obj: ComponentLinkInfo,
  expandedItems: string[],
  handleListItemClick: (id: string) => void,
  layer = 0,
  curKey = ""
): JSX.Element {
  return (
    <>
      {Object.keys(obj).map((key) => {
        const { to, label, icon, childListItems } = obj[key];
        if (typeof to === "string" && typeof childListItems === "undefined") {
          return makeListButtonLeaf(to, label, curKey + key, layer, icon);
        } else {
          return makeListButtonNode(
            label,
            curKey + key,
            childListItems,
            expandedItems,
            handleListItemClick,
            layer,
            icon
          );
        }
      })}
    </>
  );
}
