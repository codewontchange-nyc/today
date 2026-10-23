# Today for Bonsai

A calendar app that lives in Bonsai's left rail. Today keeps your day in focus. Looking ahead pages through 3 days, a week, a month, or back over last week. Your agent prepares meetings, suggests time to rest, read or move, and turns a passing thought into a plan.

## Install from the zip

1. Unzip `today-for-bonsai.zip`. You get one folder, `daybook`.
2. Put that folder in `~/.kay/plugins/` in your home folder. Create `plugins` if it is not there. In Terminal:

   ```
   mkdir -p ~/.kay/plugins && unzip -o ~/Downloads/today-for-bonsai.zip -d ~/.kay/plugins
   ```

3. In any Bonsai chat, say: **Install the Today app from local/daybook.** Bonsai adds it and asks you to approve one permission. That permission lets the app run its own agent to read your calendars and prepare notes.
4. Click **Today** in the left rail.

The folder carries a small git history. Bonsai runs the committed version of a local app, so keep the `.git` folder that comes with it. Bonsai trusts the `~/.kay/plugins` folder because you put the files there yourself. The app runs inside Bonsai with Bonsai's own access, like any app you install. Read `app.ts` first if you want to see what it does.

## First run

If no calendar is connected yet, Today opens on a short setup page. Connect any of:

- **Calendars:** Google Calendar (each Google account), Outlook, Apple Calendar.
- **Email, for context:** Gmail, Outlook, Apple Mail.

These use Bonsai's own sign-in, the same as App Store → Installed → the app → Connections. Anything you already connected is picked up automatically. Times follow your Mac's timezone.

## What it does with your accounts

- It reads calendars and related mail through your Bonsai connections. A refresh runs at most every 30 minutes, or when you ask for one.
- It never sends mail, invites anyone, or changes an event.
- It adds a private block with no guests only when you press **Accept** on a suggestion. It rechecks your calendars first.
- Your notes, edited pages, interests and plans stay in the app's own storage on your Mac.

## Updating

Unzip a newer `today-for-bonsai.zip` over the old one with the same command. Bonsai picks up the new version by itself.

## Layout

`kay-plugin.json` is the manifest. `app.ts` is the background part: calendar refresh, research, plans and storage. `ui.tsx` is the page and the rail icon, built as one file from `ui/surface.js`. `icon.svg` is the rail icon. The package contains no calendar data, notes or credentials.
