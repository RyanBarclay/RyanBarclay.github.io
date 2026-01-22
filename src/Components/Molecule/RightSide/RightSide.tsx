import React, { useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { NavigationContext } from "../../../contexts/NavigationContext";
import componentLinkInfo, {
  ComponentLinkInfo,
} from "../../SharedLogic/navigationLogic";

const RightSide = (): React.JSX.Element => {
  const { setFooBar } = useContext(NavigationContext);
  const temp = useLocation().pathname;
  useEffect(() => {
    setFooBar(temp);
  }, [temp]);

  const getRoutes = (
    obj: ComponentLinkInfo,
    lastKey = "",
  ): React.JSX.Element => {
    return (
      <>
        {Object.keys(obj).map((key) => {
          const { to, component, childListItems } = obj[key];
          if (
            typeof to === "string" &&
            typeof childListItems === "undefined" &&
            typeof component !== "undefined"
          ) {
            return <Route path={to} element={component} key={lastKey + key} />;
          } else if (childListItems) {
            return (
              <React.Fragment key={lastKey + key}>
                {getRoutes(childListItems, lastKey + key)}
              </React.Fragment>
            );
          }
          return null;
        })}
      </>
    );
  };

  return <Routes>{getRoutes(componentLinkInfo)}</Routes>;
};
export default RightSide;
