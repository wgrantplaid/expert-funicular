# PAE Deal → Slack Channel Setup

A tracker + step-by-step instructions for creating one Slack project channel per active
Monday.com deal, and linking each channel back to its Monday deal.

## Files

- **`PAE-deal-channels-tracker.xlsx`** — the tracker Will fills in as channels are created.
  - **Channel Tracker** tab: one row per deal (19 total). The top 13 ("Create now") are
    separated from the bottom 6 ("Later"). The shaded (yellow) columns — *Channel created?*,
    *Channel email address*, *Monday deal link*, *Monday↔Slack linked?*, *Kickoff note posted?*
    — are intentionally left blank for Will to fill in.
  - **Setup Steps** tab: the same manual checklist as below.

## Confirmed decisions

- Channels are **Private**.
- Naming convention: **`proj-account-project`**.
- All project channels are **grouped under a Slack sidebar section**.
- Each channel is **linked to its Monday deal via Monday's Slack app**.

## Important: these are manual steps

Slack **channel creation** and **email-to-channel enablement** are manual steps that Will
performs himself. They are **not doable from the Claude/Monday integration** — so this repo
provides the tracking tool and instructions, not the automation.

## Setup steps

1. **Create each channel.** In Slack: click the **+** next to the sidebar → **Create a
   channel** → paste the proposed channel name (e.g. `proj-ascent-weldon-village`) → set
   visibility to **Private** → **Create**. Do the 13 "Create now" deals first.
2. **Enable email-to-channel** (admin / Will only). If the option is missing, first allow the
   **Email app** for the workspace. Then in each channel: **channel name → Integrations → Send
   emails to this channel → Get email address** → paste it into the tracker's *Channel email
   address* column.
3. **Group under a sidebar section.** Right-click any channel in the sidebar → **Create
   section** → name it e.g. **"Projects — Slack & Monday"** → drag each `proj-*` channel into
   it.
4. **Link each channel to its Monday deal** via the **Monday Slack app** (connect the deal item
   to the channel), then paste the Monday deal link into the tracker and mark *Monday↔Slack
   linked?* = Yes.
5. **Post the kickoff note.** Once a channel exists and its email address is captured, post the
   kickoff note (Monday deal link + a short kickoff) into the channel, then mark *Kickoff note
   posted?* = Yes.

## The deal list

**Create now (13):** Ascent (Weldon Village, First Tee Charleston, Wilson Business Center),
Mike Owen (Public Storage Orange, ROSS Soledad, BMW Sherman Oaks), Blackburn (Hoffman Pool
Railing, North Market Enclosures), Birmingham (26230 Havelock, Steward Machine, Homewood
Church), Carvana (Indianapolis), Moltus (DHO3 Fleet Service Center).

**Later — wait until they move (6):** AES Facility, Rambar (Centennial Mini-Storage), Young
(Hotel Suwanee), Shawnee (VENU), Bryant PEMB, MMI (Arizona Erection).
