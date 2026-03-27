import React, { createContext, useContext, useReducer, useCallback, useState, useRef } from 'react';

const WINDOW_DEFAULTS = {
  about:         { x: 120, y: 40,  w: 650, h: 480, minW: 400, minH: 300 },
  projects:      { x: 160, y: 50,  w: 750, h: 560, minW: 460, minH: 400 },
  education:     { x: 200, y: 60,  w: 700, h: 520, minW: 420, minH: 350 },
  skills:        { x: 240, y: 45,  w: 750, h: 520, minW: 400, minH: 350 },
  contact:       { x: 280, y: 55,  w: 500, h: 440, minW: 360, minH: 320 },
  aboutPC:       { x: 200, y: 80,  w: 420, h: 360, minW: 320, minH: 280 },
};

const PROJECT_WINDOW_DEFAULTS = { w: 800, h: 600, minW: 500, minH: 400 };

const WINDOW_TITLES = {
  about: 'about_me.txt',
  projects: 'Projects',
  education: 'Education',
  skills: 'skills.json',
  contact: 'contact.exe',
  aboutPC: 'About this PC',
};

function makeWindowState(defaults) {
  return {
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    snapZone: null,
    zIndex: 0,
    position: { x: defaults.x, y: defaults.y },
    size: { w: defaults.w, h: defaults.h },
    preSnapPosition: null,
    preSnapSize: null,
  };
}

const initialState = {
  windows: Object.fromEntries(
    Object.entries(WINDOW_DEFAULTS).map(([id, defaults]) => [id, makeWindowState(defaults)])
  ),
  nextZIndex: 1,
  snapPreview: null,
};

function desktopReducer(state, action) {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const id = action.id;
      let win = state.windows[id];
      // Create dynamic window if it doesn't exist yet (for project windows)
      if (!win && action.defaults) {
        win = makeWindowState(action.defaults);
      }
      if (!win) return state;
      if (win.isOpen && !win.isMinimized) {
        return {
          ...state,
          windows: { ...state.windows, [id]: { ...win, zIndex: state.nextZIndex } },
          nextZIndex: state.nextZIndex + 1,
        };
      }
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, isOpen: true, isMinimized: false, zIndex: state.nextZIndex },
        },
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case 'CLOSE_WINDOW': {
      const id = action.id;
      const win = state.windows[id];
      if (!win) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: { ...win, isOpen: false, isMinimized: false, isMaximized: false, snapZone: null, preSnapPosition: null, preSnapSize: null },
        },
      };
    }
    case 'MINIMIZE_WINDOW': {
      const id = action.id;
      const win = state.windows[id];
      if (!win) return state;
      return {
        ...state,
        windows: { ...state.windows, [id]: { ...win, isMinimized: true } },
      };
    }
    case 'FOCUS_WINDOW': {
      const id = action.id;
      const win = state.windows[id];
      if (!win) return state;
      return {
        ...state,
        windows: { ...state.windows, [id]: { ...win, isMinimized: false, zIndex: state.nextZIndex } },
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case 'MOVE_WINDOW': {
      const { id, x, y } = action;
      const win = state.windows[id];
      if (!win) return state;
      return {
        ...state,
        windows: { ...state.windows, [id]: { ...win, position: { x, y }, isMaximized: false, snapZone: null } },
      };
    }
    case 'RESIZE_WINDOW': {
      const { id, w, h, x, y } = action;
      const defaults = WINDOW_DEFAULTS[id] || (id.startsWith('project-') ? PROJECT_WINDOW_DEFAULTS : null);
      const win = state.windows[id];
      if (!win || !defaults) return state;
      const newWin = {
        ...win,
        size: { w: Math.max(defaults.minW, w), h: Math.max(defaults.minH, h) },
        isMaximized: false,
        snapZone: null,
      };
      if (x !== undefined && y !== undefined) newWin.position = { x, y };
      return { ...state, windows: { ...state.windows, [id]: newWin } };
    }
    case 'TOGGLE_MAXIMIZE': {
      const id = action.id;
      const win = state.windows[id];
      if (!win) return state;
      if (win.isMaximized || win.snapZone) {
        const defaults = WINDOW_DEFAULTS[id] || PROJECT_WINDOW_DEFAULTS;
        return {
          ...state,
          windows: {
            ...state.windows,
            [id]: {
              ...win, isMaximized: false, snapZone: null,
              position: win.preSnapPosition || { x: defaults.x, y: defaults.y },
              size: win.preSnapSize || { w: defaults.w, h: defaults.h },
              preSnapPosition: null, preSnapSize: null, zIndex: state.nextZIndex,
            },
          },
          nextZIndex: state.nextZIndex + 1,
        };
      }
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: {
            ...win, isMaximized: true, snapZone: null,
            preSnapPosition: { ...win.position }, preSnapSize: { ...win.size },
            zIndex: state.nextZIndex,
          },
        },
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case 'SNAP_WINDOW': {
      const { id, zone } = action;
      const win = state.windows[id];
      if (!win) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [id]: {
            ...win, snapZone: zone, isMaximized: false,
            preSnapPosition: win.preSnapPosition || { ...win.position },
            preSnapSize: win.preSnapSize || { ...win.size },
            zIndex: state.nextZIndex,
          },
        },
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case 'SET_SNAP_PREVIEW': {
      return { ...state, snapPreview: action.zone };
    }
    case 'SET_WINDOW_TITLE': {
      const { id, title } = action;
      return state; // handled in provider
    }
    default:
      return state;
  }
}

const DesktopContext = createContext(null);

export function DesktopProvider({ children }) {
  const [state, dispatch] = useReducer(desktopReducer, initialState);
  const [dynamicTitles, setDynamicTitles] = useState({});
  const [projectWindows, setProjectWindows] = useState({});

  const openWindow = useCallback((id) => dispatch({ type: 'OPEN_WINDOW', id }), []);
  const closeWindow = useCallback((id) => dispatch({ type: 'CLOSE_WINDOW', id }), []);
  const minimizeWindow = useCallback((id) => dispatch({ type: 'MINIMIZE_WINDOW', id }), []);
  const focusWindow = useCallback((id) => dispatch({ type: 'FOCUS_WINDOW', id }), []);
  const moveWindow = useCallback((id, x, y) => dispatch({ type: 'MOVE_WINDOW', id, x, y }), []);
  const resizeWindow = useCallback((id, w, h, x, y) => dispatch({ type: 'RESIZE_WINDOW', id, w, h, x, y }), []);
  const toggleMaximize = useCallback((id) => dispatch({ type: 'TOGGLE_MAXIMIZE', id }), []);
  const snapWindow = useCallback((id, zone) => dispatch({ type: 'SNAP_WINDOW', id, zone }), []);
  const setSnapPreview = useCallback((zone) => dispatch({ type: 'SET_SNAP_PREVIEW', zone }), []);

  const setWindowTitle = useCallback((id, title) => {
    setDynamicTitles((prev) => ({ ...prev, [id]: title }));
  }, []);

  const nextProjectOffset = useRef(0);

  const openProject = useCallback((project) => {
    const windowId = `project-${project.filename}`;
    setProjectWindows((prev) => ({ ...prev, [windowId]: project }));
    setDynamicTitles((prev) => ({ ...prev, [windowId]: project.filename }));
    // Cascade offset so multiple project windows don't stack exactly
    const offset = nextProjectOffset.current;
    nextProjectOffset.current = (offset + 1) % 6;
    const x = 180 + offset * 30;
    const y = 30 + offset * 30;
    dispatch({
      type: 'OPEN_WINDOW',
      id: windowId,
      defaults: { x, y, ...PROJECT_WINDOW_DEFAULTS },
    });
  }, []);

  const getTitle = useCallback((id) => {
    return dynamicTitles[id] || WINDOW_TITLES[id] || id;
  }, [dynamicTitles]);

  const value = {
    windows: state.windows,
    windowTitles: { ...WINDOW_TITLES, ...dynamicTitles },
    windowDefaults: { ...WINDOW_DEFAULTS, ...Object.fromEntries(
      Object.keys(projectWindows).map((id) => [id, PROJECT_WINDOW_DEFAULTS])
    )},
    snapPreview: state.snapPreview,
    projectWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    toggleMaximize,
    snapWindow,
    setSnapPreview,
    setWindowTitle,
    openProject,
  };

  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider');
  return ctx;
}
