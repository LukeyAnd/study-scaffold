# Documentation

Use the root [README](../README.md) to start, or [agent route map](../AGENT_GUIDE.md) for repository work. Read only the guide needed for the current task.

| Folder | Purpose | Start with |
| --- | --- | --- |
| `guides/` | Installation, classes, local progress and clarity notes | [Installation](guides/INSTALL.md), [setup](guides/SETUP.md), [classes](guides/COURSES.md), [storage](guides/STORAGE.md), [notes](guides/CLARITY.md) |
| `methodology/` | Source authority, question design and learning evidence | [Source guide](methodology/SOURCE_GUIDE.md), [question design](methodology/QUESTION_DESIGN.md), [research](methodology/RESEARCH.md) |
| `maintenance/` | Implementation decisions and release verification | [Design](maintenance/DESIGN.md), [first-run checks](maintenance/FIRST_RUN_TEST.md), [release review](maintenance/RELEASE_REVIEW.md) |

The portable skill keeps generated copies of the methodology/setup resources in its own `references/` folder so it works independently. Edit the canonical guide here, then run `python tools/package_release.py` from the repository root. The root app files remain canonical runtime sources; generated copies under the skill are rebuilt by the same command.
