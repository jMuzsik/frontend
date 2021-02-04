import React, { useState, useEffect, useCallback, useRef } from "react";

import db from "./db";

import {
  DEF_NODES_DATA,
  DEF_STRUCTURE_DATA,
  DEF_SUBJECT_DATA,
  DEF_SUBJECTS_DATA,
  DEF_DIMENSIONS,
  DEF_DATA_CHANGE,
  DEF_NAMES,
  DEF_USER,
  DEF_HELP,
} from "./defaults";
import { useDeepEffect } from "./Utils";
import mainFetch from "./mainFetch";
import handleDataChange from "./handleDataChange";

import Home from "./Home";

import "normalize.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import Skeleton from "./Skeleton";

export const UserContext = React.createContext({
  user: DEF_USER,
  setUser: () => null,
});

function App(props) {
  const [user, setUser] = useState(DEF_USER);
  const [loading, setLoading] = useState(true);

  const handleFetchUser = useCallback(async () => {
    // Always will be stored as array but will only ever care about first item here
    let users = await db.user.toArray();
    // User object not created yet so create default user
    if (users.length === 0) {
      await db.user.add(DEF_USER);
      // Both happen at same time (names are above subjects) but I
      // prefer to not have too many properties on the user object
      await db.names.add(DEF_NAMES);
      await db.help.add(DEF_HELP);
      return;
    }
    setUser(users[0]);
  }, []);

  // Is the sidebar open?
  // I do this here as I need to keep track of the dimensions of the main content
  const [isOpen, setOpen] = useState(true);
  const open = isOpen ? "open" : "closed";

  // https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render
  // This is done to keep track of the size of the svg mindmap
  // - as i have to work with height/width of elements within
  //   the svg
  const mainRef = useRef();

  const [treeData, setTreeData] = useState({
    data: DEF_NODES_DATA,
    structure: DEF_STRUCTURE_DATA,
    subject: DEF_SUBJECT_DATA,
    subjects: DEF_SUBJECTS_DATA,
    dimensions: DEF_DIMENSIONS,
    names: DEF_NAMES,
    help: DEF_HELP,
    // also names here but it is redundant
  });
  const [dataChange, changeData] = useState(DEF_DATA_CHANGE);

  const handleFetchItems = useCallback(async () => {
    const obj = await mainFetch(treeData);
    setTreeData(obj);
    setLoading(false);
  }, []);

  useEffect(() => {
    handleFetchItems();
    return () => {
      setTreeData();
    };
  }, [handleFetchItems]);

  useDeepEffect(() => {
    const dataObj = handleDataChange(dataChange, treeData, setTreeData);
    if (dataObj === null) return;
    setTreeData(dataObj);
  }, [dataChange]);

  useEffect(() => {
    handleFetchUser();
    return () => {
      setUser(DEF_USER);
    };
  }, [setUser, handleFetchUser]);
  console.log(user)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div
        className={`app ${user.theme === "dark" ? "bp3-dark" : ""} ${
          loading ? "loading" : "finished-loading"
        }`}
      >
        {loading ? (
          <Skeleton />
        ) : (
          <Home
            {...{
              ...props,
              user,
              changeData,
              userProp: user,
              treeData,
              setTreeData,
              mainRef,
              isOpen,
              open,
              setOpen,
            }}
          />
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;