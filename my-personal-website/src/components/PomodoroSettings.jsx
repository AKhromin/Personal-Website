import React, { useEffect, useId, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { PRESETS, sameTimings, TIMING_FIELDS, validTimings } from '../widgets/pomodoroSettings';

function PomodoroSettings({ timer, onClose }) {
  const dialog = useRef(null);
  const titleId = useId();
  const [draft, setDraft] = useState(timer.settings);
  const values = Object.fromEntries(TIMING_FIELDS.map(({ key }) => [key, Number(draft[key])]));
  const preset = PRESETS.find(({ settings }) => sameTimings(settings, values));
  const willRestart = timer.hasProgress && !sameTimings(timer.settings, values);

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal();
  }, []);

  const close = () => dialog.current.close();
  const save = (event) => {
    event.preventDefault();
    if (!validTimings(values)) return;
    timer.applySettings(values);
    close();
  };

  return (
    <dialog
      className="pomodoro-settings"
      ref={dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <form onSubmit={save}>
        <header className="pomodoro-settings-header">
          <h2 id={titleId}>Pomodoro settings</h2>
          <button type="button" className="pomodoro-settings-close" aria-label="Close Pomodoro settings" onClick={close}>
            <CloseIcon sx={{ fontSize: 17 }} />
          </button>
        </header>

        <label className="pomodoro-setting">
          Preset
          <select value={preset?.id ?? 'custom'} onChange={(event) => {
            const selected = PRESETS.find(({ id }) => id === event.target.value);
            if (selected) setDraft(selected.settings);
          }}>
            <option value="custom" disabled>Custom</option>
            {PRESETS.map(({ id, label, settings }) => (
              <option key={id} value={id}>
                {label} ({settings.focus} / {settings.shortBreak} / {settings.longBreak})
              </option>
            ))}
          </select>
        </label>
        <p className="pomodoro-preset-description">{preset?.description}</p>

        <div className="pomodoro-timing-fields">
          {TIMING_FIELDS.map(({ key, label, max, unit }) => (
            <label className="pomodoro-setting" key={key}>
              {label}
              <span className="pomodoro-setting-input">
                <input
                  type="number"
                  min="1"
                  max={max}
                  step="1"
                  required
                  value={draft[key]}
                  onChange={(event) => {
                    const { value } = event.target;
                    setDraft((previous) => ({ ...previous, [key]: value }));
                  }}
                />
                {unit && <span aria-hidden="true">{unit}</span>}
              </span>
            </label>
          ))}
        </div>
        <footer className="pomodoro-settings-footer">
          <button type="button" onClick={close}>Cancel</button>
          <button type="submit">{willRestart ? 'Save and restart' : 'Save settings'}</button>
        </footer>
      </form>
    </dialog>
  );
}

export default PomodoroSettings;
