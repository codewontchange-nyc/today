# Today for Bonsai

Today is an app for [Bonsai](https://kay.so). It puts all of your calendars in one calm view: today in focus on the left, the days ahead on the right, and an agent that prepares briefs, finds open time, and turns a passing thought into a plan.

It uses your own calendar and email connections in Bonsai (Google Calendar, Outlook, Apple Calendar, Gmail, Apple Mail). If none are connected yet, the app offers to connect them on first open. No calendar data lives in this repository.

## Install

1. In Bonsai, open **App Store → Sources → Add source** and paste `https://github.com/codewontchange-nyc/today`.
2. Open the source and press **Review** to trust it.
3. Open **App Store → Browse**, find **Today**, and install it. Approve the one permission it asks for (it runs your agent in the background to read your calendars).
4. Today appears in the left rail.

Updates arrive on their own when this repository changes. To pick one up right away, open **App Store → Sources → today → Check for updates**.

## What it does

- **Today**: your timeline across every calendar, short notes from your agent, and a place to leave a thought for later.
- **Looking ahead**: 3-day, week and month views you swipe one day at a time, with quiet suggestions for rest, reading and nearby places, and prepared briefs for upcoming meetings.
- **Accepting** a suggestion adds a private block to your calendar. No one is invited.
- **Removing**: hover any card and press × to hide an event or dismiss a suggestion, with Undo. Events you made yourself can be deleted from your calendar after a confirm.

## Repository layout

This repository is a Bonsai marketplace. `marketplace.json` lists what it carries, `marketplace.index.json` is generated from it by `node tools/validate.mjs --fix`, and the app itself lives in `plugins/daybook/`. CI runs the validator on every push.
