import React, { useId, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import { ACCENTS, DESK_ITEMS, LIGHTING, PRESETS, WALLPAPERS } from '../hooks/useDesktopPersonalization';

const tabs = ['Themes', 'Appearance', 'Ambience'];

function SettingSwitch({ children, checked, onChange, disabled }) {
  return (
    <label className="personalization-switch">
      {children}
      <input type="checkbox" role="switch" checked={checked} onChange={onChange} disabled={disabled} />
    </label>
  );
}

function Personalization({ settings, setSettings, music }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const id = useId();
  const [activeTab, setActiveTab] = useState(0);

  const setPreference = (key, value) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
  };

  const selectPreset = (preset) => {
    const { accent, wallpaper, lighting } = PRESETS[preset];
    setSettings((previous) => ({ ...previous, preset, accent, wallpaper, lighting }));
  };

  const onTabKeyDown = (event) => {
    const nextTab = {
      ArrowLeft: (activeTab + tabs.length - 1) % tabs.length,
      ArrowRight: (activeTab + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (nextTab === undefined) return;
    event.preventDefault();
    setActiveTab(nextTab);
    event.currentTarget.querySelectorAll('[role="tab"]')[nextTab].focus();
  };

  return (
    <>
      <button
        type="button"
        className="personalization-trigger"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={() => {
          dialogRef.current.showModal();
          dialogRef.current.querySelector('[aria-selected="true"]').focus();
        }}
      >
        <TuneIcon sx={{ fontSize: 16 }} />
        Customize
      </button>

      <dialog
        id={id}
        ref={dialogRef}
        className="personalization"
        aria-labelledby={`${id}-title`}
        onClose={() => triggerRef.current.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current.close();
        }}
      >
        <div className="personalization-inner">
          <header className="personalization-header">
            <h2 id={`${id}-title`}>Personalization</h2>
            <button type="button" aria-label="Close personalization" onClick={() => dialogRef.current.close()}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          </header>
          <div className="personalization-tabs" role="tablist" aria-label="Personalization settings" onKeyDown={onTabKeyDown}>
            {tabs.map((label, index) => (
              <button
                type="button"
                key={label}
                id={`${id}-tab-${index}`}
                role="tab"
                aria-controls={`${id}-panel-${index}`}
                aria-selected={activeTab === index}
                tabIndex={activeTab === index ? 0 : -1}
                onClick={() => setActiveTab(index)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="personalization-content">
            <div id={`${id}-panel-0`} role="tabpanel" aria-labelledby={`${id}-tab-0`} hidden={activeTab !== 0}>
              <div className="personalization-choices">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    type="button"
                    className="personalization-choice"
                    key={key}
                    aria-pressed={settings.preset === key}
                    onClick={() => selectPreset(key)}
                  >
                    <span className={`appearance-preview wallpaper--${preset.wallpaper} theme-preview--${key}`} aria-hidden="true">
                      <span className="theme-preview-window" />
                    </span>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div id={`${id}-panel-1`} role="tabpanel" aria-labelledby={`${id}-tab-1`} hidden={activeTab !== 1}>
              <h3>Accent colour</h3>
              <div className="personalization-accents" role="group" aria-label="Accent colour">
                {Object.entries(ACCENTS).map(([key, accent]) => (
                  <button
                    type="button"
                    className="personalization-accent"
                    key={key}
                    aria-pressed={settings.accent === key}
                    onClick={() => setPreference('accent', key)}
                  >
                    <span style={{ background: accent.swatch }} aria-hidden="true" />
                    {accent.label}
                  </button>
                ))}
              </div>
              <h3>Wallpaper</h3>
              <div className="personalization-choices" role="group" aria-label="Wallpaper">
                {Object.entries(WALLPAPERS).map(([key, label]) => (
                  <button
                    type="button"
                    className="personalization-choice"
                    key={key}
                    aria-pressed={settings.wallpaper === key}
                    onClick={() => setPreference('wallpaper', key)}
                  >
                    <span className={`appearance-preview wallpaper--${key}`} aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div id={`${id}-panel-2`} role="tabpanel" aria-labelledby={`${id}-tab-2`} hidden={activeTab !== 2}>
              <SettingSwitch checked={settings.soundEffects} onChange={(event) => setPreference('soundEffects', event.target.checked)}>
                Window sounds
              </SettingSwitch>
              <SettingSwitch checked={music.isPlaying} onChange={music.togglePlay}>
                Lofi music
              </SettingSwitch>

              {settings.wallpaper === 'desk' && (
                <div className="personalization-desk">
                  <label className="personalization-select">
                    Room lighting
                    <select value={settings.lighting} onChange={(event) => setPreference('lighting', event.target.value)}>
                      {Object.entries(LIGHTING).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                  </label>
                  <SettingSwitch
                    checked={settings.deskItems.lamp && settings.lampOn}
                    disabled={!settings.deskItems.lamp}
                    onChange={(event) => setPreference('lampOn', event.target.checked)}
                  >
                    Lamp glow
                  </SettingSwitch>
                  <details>
                    <summary>Desk objects</summary>
                    <div className="personalization-desk-items">
                      {DESK_ITEMS.map(({ id: itemId, label }) => (
                        <label key={itemId}>
                          <input
                            type="checkbox"
                            checked={settings.deskItems[itemId]}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSettings((previous) => ({
                                ...previous,
                                deskItems: { ...previous.deskItems, [itemId]: checked },
                              }));
                            }}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Personalization;
